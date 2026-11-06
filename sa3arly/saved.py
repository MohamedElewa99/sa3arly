"""A user's saved pricings (see db/migrations/002_saved_quotes.sql)."""
from __future__ import annotations

import json

# same as db/migrations/002_saved_quotes.sql (db/ isn't shipped to Vercel), run once per cold start
MIGRATION = """-- Pricings a signed-in user chose to keep. Written only by the /api/saved function (server side, checks the
-- Supabase Auth token), so the table stays closed to the public API: RLS on, no policies.
create table if not exists saved_quotes (
  id         bigserial primary key,
  user_id    uuid not null,
  created_at timestamptz not null default now(),
  make       text not null,
  model      text not null,
  year       int  not null,
  trim       text,
  km         int  not null,
  low        int  not null,
  high       int  not null,
  details    jsonb not null default '{}'::jsonb
);
create index if not exists saved_quotes_user on saved_quotes (user_id, created_at desc);
alter table saved_quotes enable row level security;
"""
LIMIT = 200          # per user
_ready = False


def ensure(cx) -> None:
    global _ready
    if not _ready:
        cx.execute(MIGRATION)
        _ready = True


def _row(r) -> dict:
    return {"id": r[0], "at": r[1].isoformat(), "car": {"make": r[2], "model": r[3], "year": r[4], "trim": r[5]},
            "km": r[6], "low": r[7], "high": r[8], "details": r[9] or {}}


def listing(cx, uid: str) -> list[dict]:
    ensure(cx)
    rows = cx.execute("""select id, created_at, make, model, year, trim, km, low, high, details
                         from saved_quotes where user_id = %s order by created_at desc limit %s""", (uid, LIMIT)).fetchall()
    return [_row(r) for r in rows]


def clean(body: dict) -> dict | None:
    """Validate what the app sends; None when it isn't a pricing."""
    car = body.get("car") or {}
    try:
        out = {"make": str(car["make"])[:60], "model": str(car["model"])[:60], "year": int(car["year"]),
               "trim": (str(car.get("trim") or "")[:60] or None), "km": int(body["km"]),
               "low": int(body["low"]), "high": int(body["high"])}
    except (KeyError, TypeError, ValueError):
        return None
    if not out["make"] or not out["model"] or not 1980 <= out["year"] <= 2030 or not 0 <= out["km"] <= 2_000_000:
        return None
    if not 0 < out["low"] <= out["high"] <= 100_000_000:
        return None
    details = body.get("details") if isinstance(body.get("details"), dict) else {}
    out["details"] = json.dumps(details, ensure_ascii=False)[:8000]
    if len(out["details"]) >= 8000:
        out["details"] = "{}"
    return out


def save(cx, uid: str, q: dict) -> dict:
    ensure(cx)
    r = cx.execute("""insert into saved_quotes (user_id, make, model, year, trim, km, low, high, details)
                      values (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb)
                      returning id, created_at, make, model, year, trim, km, low, high, details""",
                   (uid, q["make"], q["model"], q["year"], q["trim"], q["km"], q["low"], q["high"], q["details"])).fetchone()
    cx.execute("""delete from saved_quotes where user_id = %s and id not in
                  (select id from saved_quotes where user_id = %s order by created_at desc limit %s)""", (uid, uid, LIMIT))
    return _row(r)


def remove(cx, uid: str, qid: int) -> bool:
    ensure(cx)
    return cx.execute("delete from saved_quotes where user_id = %s and id = %s", (uid, qid)).rowcount > 0
