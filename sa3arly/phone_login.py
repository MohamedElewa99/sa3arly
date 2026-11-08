"""Sign in with WhatsApp, free: the user sends us a code from his own WhatsApp (see db/migrations/005_phone_logins.sql).

1. app -> start(): a 6-digit code + a secret nonce (only the app has it) + a wa.me link with the code filled in.
2. user sends the message; Meta calls /api/whatsapp -> received(): the code is matched, the sender's number recorded.
3. app polls check(nonce): once verified, the server makes (or finds) the Supabase user for that number and returns a
   one-time token_hash; the app trades it for a session with supabase.auth.verifyOtp({ token_hash, type: 'magiclink' }).
Incoming WhatsApp messages are free, and nothing is sent back, so a sign-in costs nothing."""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import urllib.error
import urllib.request

from .http_shared import supabase_url

MIGRATION = """-- Sign in with WhatsApp: the app shows a code, the user sends it from his WhatsApp to our number (incoming messages
-- cost nothing), the webhook records which number sent it, and the app that holds the secret nonce gets a session.
-- Written only by /api/phone and /api/whatsapp (server side); RLS on, no policies.
create table if not exists phone_logins (
  id          bigserial primary key,
  nonce_hash  text not null unique,
  code        text not null,
  created_at  timestamptz not null default now(),
  phone       text,
  verified_at timestamptz,
  used_at     timestamptz
);
create index if not exists phone_logins_code on phone_logins (code) where verified_at is null;
alter table phone_logins enable row level security;
"""
TTL_MIN = 10
_ready = False


def ensure(cx) -> None:
    global _ready
    if not _ready:
        cx.execute(MIGRATION)
        _ready = True


def wa_number() -> str:
    return re.sub(r"\D", "", os.environ.get("WA_NUMBER", ""))


def service_key() -> str:
    return os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "") or os.environ.get("SUPABASE_SECRET_KEY", "")


def enabled() -> bool:
    return bool(wa_number() and service_key() and os.environ.get("WA_VERIFY_TOKEN") and os.environ.get("WA_APP_SECRET"))


def _h(nonce: str) -> str:
    return hashlib.sha256(nonce.encode()).hexdigest()


def start(cx) -> dict:
    ensure(cx)
    cx.execute("delete from phone_logins where created_at < now() - interval '1 day'")
    for _ in range(20):
        code = f"{secrets.randbelow(900000) + 100000}"
        busy = cx.execute(f"""select 1 from phone_logins where code = %s and verified_at is null
                              and created_at > now() - interval '{TTL_MIN} minutes'""", (code,)).fetchone()
        if not busy:
            break
    nonce = secrets.token_urlsafe(32)
    cx.execute("insert into phone_logins (nonce_hash, code) values (%s, %s)", (_h(nonce), code))
    text = f"كود الدخول لسعرلي: {code}"
    return {"nonce": nonce, "code": code, "ttl": TTL_MIN * 60,
            "wa": f"https://wa.me/{wa_number()}?text=" + urllib.request.quote(text)}


def egypt_phone(wa_id: str) -> str | None:
    """WhatsApp sender id (e.g. 201012345678) -> 01012345678 for Egyptian mobiles, else +<id>."""
    d = re.sub(r"\D", "", wa_id or "")
    if re.fullmatch(r"201[0125]\d{8}", d):
        return "0" + d[2:]
    return "+" + d if 8 <= len(d) <= 15 else None


def signature_ok(body: bytes, header: str) -> bool:
    secret = os.environ.get("WA_APP_SECRET", "")
    if not secret or not header.startswith("sha256="):
        return False
    want = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(want, header[7:])


def received(cx, payload: dict) -> int:
    """A webhook call from Meta: every text message with a pending code verifies that login. Returns how many."""
    ensure(cx)
    n = 0
    for entry in payload.get("entry") or []:
        for ch in entry.get("changes") or []:
            for m in (ch.get("value") or {}).get("messages") or []:
                text = ((m.get("text") or {}).get("body") or "")
                text = text.translate(str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789"))
                phone = egypt_phone(m.get("from", ""))
                for code in re.findall(r"(?<!\d)\d{6}(?!\d)", text):
                    if phone:
                        n += cx.execute(f"""update phone_logins set phone = %s, verified_at = now()
                                            where code = %s and verified_at is null
                                              and created_at > now() - interval '{TTL_MIN} minutes'""", (phone, code)).rowcount
    return n


def _admin(method: str, path: str, body: dict | None = None) -> tuple[int, dict]:
    key = service_key()
    req = urllib.request.Request(supabase_url() + path, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={"apikey": key, "Authorization": "Bearer " + key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read() or b"{}")
        except ValueError:
            return e.code, {}


def account_email(phone: str) -> str:
    return re.sub(r"\D", "", phone) + "@phone.sa3arly.app"


def session_token(phone: str) -> str | None:
    """Make sure the user for this number exists, then a one-time magic-link token for it (nothing is emailed)."""
    email = account_email(phone)
    _admin("POST", "/auth/v1/admin/users", {"email": email, "email_confirm": True, "user_metadata": {"phone": phone}})
    code, d = _admin("POST", "/auth/v1/admin/generate_link", {"type": "magiclink", "email": email})
    if code != 200:
        return None
    return d.get("hashed_token") or (d.get("properties") or {}).get("hashed_token")


def check(cx, nonce: str) -> dict:
    ensure(cx)
    r = cx.execute(f"""select id, phone, verified_at, used_at, created_at > now() - interval '{TTL_MIN} minutes'
                      from phone_logins where nonce_hash = %s""", (_h(nonce or ""),)).fetchone()
    if not r or r[3]:
        return {"state": "gone"}
    if not r[2]:
        return {"state": "waiting" if r[4] else "expired"}
    tok = session_token(r[1])
    if not tok:
        return {"state": "error"}
    cx.execute("update phone_logins set used_at = now() where id = %s", (r[0],))
    return {"state": "ok", "token_hash": tok, "phone": r[1]}
