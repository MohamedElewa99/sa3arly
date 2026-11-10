"""عربياتي: a trader's own cars in stock, private to each user (see db/migrations/004_my_cars.sql)."""
from __future__ import annotations

from .secure import ddl

import json
import re

# same as db/migrations/004_my_cars.sql (db/ isn't shipped to Vercel), run once per cold start
MIGRATION = """-- عربياتي: the cars a trader has in stock. Private to each user (no one else ever sees them), written only by the
-- /api/garage function (server side, checks the Supabase Auth token): RLS on, no policies.
create table if not exists my_cars (
  id         bigserial primary key,
  user_id    uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  make       text not null,
  model      text not null,
  year       int  not null,
  trim       text,
  km         int  not null,
  price      bigint,
  status     text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  notes      text,
  details    jsonb not null default '{}'::jsonb,
  cover      text,
  photos     jsonb not null default '[]'::jsonb
);
create index if not exists my_cars_user on my_cars (user_id, updated_at desc);
alter table my_cars enable row level security;
"""
LIMIT = 300                   # cars per user
STATUSES = ("available", "reserved", "sold")
PHOTOS_MAX = 20               # per car (the app sends them smaller when there are many)
PHOTO_MAX = 200_000           # chars of one data: URL (the app sends ~800px JPEGs, usually 50-120 KB)
COVER_MAX = 40_000            # the small list thumbnail
DETAILS_MAX = 20_000
_DATA_URL = re.compile(r"^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$")
_COLS = "id, created_at, updated_at, make, model, year, trim, km, price, status, notes, details, cover, jsonb_array_length(photos)"
_ready = False


def ensure(cx) -> None:
    global _ready
    if not _ready:
        ddl(cx, MIGRATION)
        _ready = True


def _row(r, photos=None) -> dict:
    out = {"id": r[0], "at": r[1].isoformat(), "updated": r[2].isoformat(),
           "car": {"make": r[3], "model": r[4], "year": r[5], "trim": r[6]}, "km": r[7], "price": r[8],
           "status": r[9], "notes": r[10] or "", "details": r[11] or {}, "cover": r[12], "nPhotos": r[13]}
    if photos is not None:
        out["photos"] = photos
    return out


def _photo(v, cap) -> bool:
    return isinstance(v, str) and len(v) <= cap and bool(_DATA_URL.match(v))


def clean(body: dict, partial: bool = False) -> tuple[dict | None, str]:
    """Validated columns to write, or (None, reason). partial=True (an edit) leaves missing keys as they are."""
    out: dict = {}
    if "car" in body or not partial:
        car = body.get("car") or {}
        try:
            out.update(make=str(car["make"]).strip()[:60], model=str(car["model"]).strip()[:60], year=int(car["year"]),
                       trim=(str(car.get("trim") or "").strip()[:60] or None))
        except (KeyError, TypeError, ValueError):
            return None, "car"
        if not out["make"] or not out["model"] or not 1980 <= out["year"] <= 2030:
            return None, "car"
    if "km" in body or not partial:
        try:
            out["km"] = int(body["km"])
        except (KeyError, TypeError, ValueError):
            return None, "km"
        if not 0 <= out["km"] <= 2_000_000:
            return None, "km"
    if "price" in body:
        v = body["price"]
        if v in (None, ""):
            out["price"] = None
        else:
            try:
                out["price"] = int(v)
            except (TypeError, ValueError):
                return None, "price"
            if not 1_000 <= out["price"] <= 100_000_000:
                return None, "price"
    if "status" in body or not partial:
        v = body.get("status") or "available"
        if v not in STATUSES:
            return None, "status"
        out["status"] = v
    if "notes" in body:
        v = str(body["notes"] or "").strip()
        if len(v) > 2000:
            return None, "notes"
        out["notes"] = v or None
    if "details" in body:
        d = body["details"] if isinstance(body["details"], dict) else {}
        s = json.dumps(d, ensure_ascii=False)
        if len(s) > DETAILS_MAX:
            return None, "details"
        out["details"] = s
    if "photos" in body:
        ph = body["photos"] if isinstance(body["photos"], list) else []
        if len(ph) > PHOTOS_MAX or not all(_photo(p, PHOTO_MAX) for p in ph):
            return None, "photos"
        out["photos"] = json.dumps(ph)
    if "cover" in body:
        v = body["cover"] or None
        if v is not None and not _photo(v, COVER_MAX):
            return None, "cover"
        out["cover"] = v
    return out, ""


def listing(cx, uid: str) -> list[dict]:
    """Every car of this user, newest change first; photos left out (only the small cover) to keep it light."""
    ensure(cx)
    rows = cx.execute(f"select {_COLS} from my_cars where user_id = %s order by updated_at desc limit %s", (uid, LIMIT)).fetchall()
    return [_row(r) for r in rows]


def get(cx, uid: str, cid: int) -> dict | None:
    ensure(cx)
    r = cx.execute(f"select {_COLS}, photos from my_cars where user_id = %s and id = %s", (uid, cid)).fetchone()
    return _row(r[:-1], r[-1] or []) if r else None


def add(cx, uid: str, f: dict) -> dict | str:
    ensure(cx)
    n = cx.execute("select count(*) from my_cars where user_id = %s", (uid,)).fetchone()[0]
    if n >= LIMIT:
        return "full"
    cols = ["user_id"] + list(f)
    vals = [uid] + list(f.values())
    ph = ", ".join("%s::jsonb" if c in ("details", "photos") else "%s" for c in cols)
    r = cx.execute(f"insert into my_cars ({', '.join(cols)}) values ({ph}) returning id", vals).fetchone()
    return get(cx, uid, r[0])


def update(cx, uid: str, cid: int, f: dict) -> dict | None:
    ensure(cx)
    if f:
        sets = ", ".join(f"{c} = %s::jsonb" if c in ("details", "photos") else f"{c} = %s" for c in f)
        n = cx.execute(f"update my_cars set {sets}, updated_at = now() where user_id = %s and id = %s",
                       list(f.values()) + [uid, cid]).rowcount
        if not n:
            return None
    return get(cx, uid, cid)


def remove(cx, uid: str, cid: int) -> bool:
    ensure(cx)
    return cx.execute("delete from my_cars where user_id = %s and id = %s", (uid, cid)).rowcount > 0
