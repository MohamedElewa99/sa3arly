"""A user's profile: name, showroom, phone, city and photo (see db/migrations/003_profiles.sql)."""
from __future__ import annotations

import re

# same as db/migrations/003_profiles.sql (db/ isn't shipped to Vercel), run once per cold start
MIGRATION = """-- One row per signed-in user: what the receipt shows and the city the market is sorted by.
-- Written only by the /api/profile function (server side, checks the Supabase Auth token); RLS on, no policies.
create table if not exists profiles (
  user_id    uuid primary key,
  name       text,
  showroom   text,
  phone      text,
  city       text,
  avatar     text,
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
"""
FIELDS = ("name", "showroom", "phone", "city", "avatar")
CITIES = ["القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية", "الغربية", "المنوفية", "البحيرة", "كفر الشيخ",
          "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر",
          "أسوان", "البحر الأحمر", "مطروح", "شمال سيناء", "جنوب سيناء", "الوادي الجديد"]
AVATAR_MAX = 120_000          # chars of a data: URL; the app sends a 256px JPEG, usually 15-40 KB
_ready = False


def ensure(cx) -> None:
    global _ready
    if not _ready:
        cx.execute(MIGRATION)
        _ready = True


def get(cx, uid: str) -> dict:
    ensure(cx)
    r = cx.execute("select name, showroom, phone, city, avatar from profiles where user_id = %s", (uid,)).fetchone()
    return dict(zip(FIELDS, r)) if r else {k: None for k in FIELDS}


def phone_ok(p: str) -> str | None:
    """Egyptian mobile as 01xxxxxxxxx; accepts +20 / 0020 / spaces / Arabic digits."""
    p = p.translate(str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789"))
    p = re.sub(r"[\s\-()]", "", p)
    p = re.sub(r"^(\+|00)20", "0", p)
    return p if re.fullmatch(r"01[0125]\d{8}", p) else None


def clean(body: dict) -> tuple[dict | None, str]:
    """Validated fields to write, or (None, reason). Missing keys are left as they are; empty strings clear."""
    out = {}
    for k in ("name", "showroom"):
        if k in body:
            v = str(body[k] or "").strip()
            if len(v) > 60:
                return None, k
            out[k] = v or None
    if "phone" in body:
        v = str(body["phone"] or "").strip()
        if v and not phone_ok(v):
            return None, "phone"
        out["phone"] = phone_ok(v) if v else None
    if "city" in body:
        v = str(body["city"] or "").strip()
        if v and v not in CITIES:
            return None, "city"
        out["city"] = v or None
    if "avatar" in body:
        v = str(body["avatar"] or "")
        if v and (len(v) > AVATAR_MAX or not re.match(r"^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$", v)):
            return None, "avatar"
        out["avatar"] = v or None
    return out, ""


def put(cx, uid: str, fields: dict) -> dict:
    ensure(cx)
    if fields:
        cols = list(fields)
        cx.execute(
            f"""insert into profiles (user_id, {", ".join(cols)}) values (%s, {", ".join(["%s"] * len(cols))})
                on conflict (user_id) do update set {", ".join(f"{c} = excluded.{c}" for c in cols)}, updated_at = now()""",
            [uid] + [fields[c] for c in cols])
    return get(cx, uid)
