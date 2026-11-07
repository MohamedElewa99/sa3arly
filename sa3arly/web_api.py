"""Read-only queries behind the Sa3arly app: catalog, one-car quote, market feed.

Each function takes an open psycopg connection and returns plain JSON-able dicts.
The Vercel functions in /api are thin wrappers around these, so they can be tested locally.
"""
from __future__ import annotations

import re
import statistics
from datetime import date, datetime, timezone
from typing import Optional

from .pricing import DEFAULT_KM_RATE, DEFAULT_YEAR_RATE, Pricer

BODY_WORDS = [
    ("pickup", "pickup"), ("pick-up", "pickup"), ("pick up", "pickup"), ("van", "van"), ("bus", "van"),
    ("hatch", "hatch"), ("suv", "suv"), ("crossover", "crossover"), ("coupe", "sedan"), ("sedan", "sedan"),
]
SOURCE_AR = {"hatla2ee": "هتلاقي", "opensooq": "السوق المفتوح", "sylndr": "Sylndr", "dubizzle": "دوبيزل", "contactcars": "كونتاكت كارز"}


def _body(types: list[str]) -> str:
    votes: dict[str, int] = {}
    for t in types:
        t = (t or "").lower()
        for word, body in BODY_WORDS:
            if word in t:
                votes[body] = votes.get(body, 0) + 1
                break
    return max(votes, key=votes.get) if votes else "sedan"


def _ref_price(rows: list[tuple[int, Optional[int], int]]) -> Optional[int]:
    """median price brought to model year 2022 and 60,000 km, the anchor the app's local estimate uses"""
    adj = []
    for year, km, price in rows:
        p = price * (1 + DEFAULT_YEAR_RATE) ** (2022 - year)
        if km is not None:
            p *= (1 + DEFAULT_KM_RATE) ** ((km - 60_000) / 10_000)
        adj.append(p)
    return int(round(statistics.median(adj) / 5000) * 5000) if adj else None


JUNK = {"other", "others", "أخرى", "اخرى", "غير ذلك", "unknown", ""}


def _junk(name) -> bool:
    """Catch-all buckets from the listing sites ("Other") aren't a car anyone can pick."""
    return (name or "").strip().lower() in JUNK


def catalog(cx, days: int = 90, min_ads: int = 3) -> dict:
    rows = cx.execute("""
        select mk.name_en, mo.name_en, l.year, l.km, l.price_egp, l.trim_raw, l.body_type
        from listings l join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
        where l.price_egp is not null and l.year is not null
          and l.last_seen > now() - make_interval(days => %s)
    """, (days,)).fetchall()
    zero = cx.execute("""
        select mk.name_en, mo.name_en, z.model_year, z.price_egp
        from zero_prices z join makes mk on mk.id = z.make_id join models mo on mo.id = z.model_id
        where z.effective_on > now() - interval '45 days'
    """).fetchall()
    zmap: dict[tuple, list] = {}
    for mk, mo, y, p in zero:
        zmap.setdefault((mk, mo), []).append((y, p))

    groups: dict[tuple, list] = {}
    for r in rows:
        groups.setdefault((r[0], r[1]), []).append(r)
    makes: dict[str, dict] = {}
    best, best_n = None, 0
    this_year = date.today().year
    for (mk, mo), rs in groups.items():
        if len(rs) < min_ads or _junk(mk) or _junk(mo):
            continue
        years = sorted({r[2] for r in rs if 1990 <= r[2] <= this_year + 1})
        trims: dict[str, int] = {}
        for r in rs:
            if r[5]:
                trims[r[5].strip()] = trims.get(r[5].strip(), 0) + 1
        top_trims = [t for t, _ in sorted(trims.items(), key=lambda kv: -kv[1])[:6]] or ["Standard"]
        z = zmap.get((mk, mo), [])
        zero_price = None
        if z:
            newest = max(y for y, _ in z)
            zero_price = int(statistics.median(p for y, p in z if y == newest))
        makes.setdefault(mk, {})[mo] = {
            "body": _body([r[6] for r in rs]),
            "trims": top_trims,
            "years": years,
            "ref": _ref_price([(r[2], r[3], r[4]) for r in rs]),
            "zero": zero_price or 0,
            "n": len(rs),
        }
        if len(rs) > best_n:
            year_counts: dict[int, int] = {}
            for r in rs:
                year_counts[r[2]] = year_counts.get(r[2], 0) + 1
            best_n = len(rs)
            best = {"make": mk, "model": mo, "year": max(year_counts, key=year_counts.get), "trim": top_trims[0],
                    "body": makes[mk][mo]["body"]}
    return {"makes": makes, "default": best, "generated": datetime.now(timezone.utc).isoformat()}


def quote(cx, make: str, model: str, year: int, km: int, trim: Optional[str] = None) -> dict:
    """Market range for a factory-condition car; the app subtracts paint and repairs itself."""
    q = Pricer(cx).quote(make, model, int(year), int(km), trim=trim or None)
    comps = [{
        "source": SOURCE_AR.get(c.source, c.source), "year": c.year, "km": c.km, "price": c.price,
        "adjusted": int(round(c.adjusted)), "url": c.url, "trim": c.trim,
    } for c in q.comparables]
    return {
        "low": q.low, "high": q.high, "mid": q.mid, "confidence": q.confidence,
        "n": len(q.comparables) if q.low is None else _count(q), "zero": q.zero_price, "zero_year": q.zero_year,
        "lines": q.lines, "comparables": comps, "ai": q.ai,
    }


def _count(q) -> int:
    # the explanation line "N عربية شبهها اتقارنت …" carries the number of comparables used
    for line in q.lines:
        head = line.split(" ", 1)[0]
        if "عربية شبهها" in line and head.isdigit():
            return int(head)
    return len(q.comparables)


def _when(ts) -> str:
    if ts is None:
        return ""
    if isinstance(ts, date) and not isinstance(ts, datetime):
        days = (date.today() - ts).days
    else:
        delta = datetime.now(timezone.utc) - ts
        hours = int(delta.total_seconds() // 3600)
        if hours < 1:
            return "دلوقتي"
        if hours < 24:
            return "من ساعة" if hours == 1 else "من ساعتين" if hours == 2 else f"من {hours} ساعات" if hours <= 10 else f"من {hours} ساعة"
        days = hours // 24
    return "النهارده" if days <= 0 else "امبارح" if days == 1 else "من يومين" if days == 2 else f"من {days} أيام" if days <= 10 else f"من {days} يوم"


def market(cx, limit: int = 12) -> dict:
    items = []
    for mk, mo, trim, y, old, new, ch, on in cx.execute("""
        select mk.name_en, mo.name_en, c.trim_name, c.model_year, c.old_price_egp, c.new_price_egp, c.change_egp, c.changed_on
        from zero_price_changes c join makes mk on mk.id = c.make_id join models mo on mo.id = c.model_id
        where c.changed_on > current_date - 14 and c.change_egp <> 0
        order by c.changed_on desc, abs(c.change_egp) desc
        limit %s
    """, (limit // 2,)).fetchall():
        name = f"{mk} {mo} {y}" + (f"، فئة {trim}" if trim else "")
        items.append({"t": "zero", "name": name, "kind": "سعر الزيرو", "when": _when(on), "price": new, "old": old,
                      "delta": ch, "pct": False, "up": ch > 0, "source": "هتلاقي",
                      "car": {"make": mk, "model": mo, "year": y, "trim": trim}, "km": 0})
    for mk, mo, y, km, price, src, seen, trim, med, url, city in cx.execute("""
        with recent as (
          select l.make_id, l.model_id, l.year, l.km, l.price_egp, l.source, l.first_seen, l.trim_raw, l.url, l.city
          from listings l
          where l.first_seen > now() - interval '3 days' and l.removed_at is null and l.price_egp is not null and l.year is not null
        ), med as (
          select l.model_id, l.year, percentile_cont(0.5) within group (order by l.price_egp) as m, count(*) as n
          from listings l
          where l.last_seen > now() - interval '60 days' and l.price_egp is not null
            and (l.model_id, l.year) in (select model_id, year from recent)
          group by l.model_id, l.year
        )
        select mk.name_en, mo.name_en, r.year, r.km, r.price_egp, r.source, r.first_seen, r.trim_raw, med.m, r.url, r.city
        from recent r join med on med.model_id = r.model_id and med.year = r.year and med.n >= 6
        join makes mk on mk.id = r.make_id join models mo on mo.id = r.model_id
        where r.price_egp < med.m * 0.9 and r.price_egp > med.m * 0.5
        order by r.price_egp / med.m asc
        limit %s
    """, (limit,)).fetchall():
        pct = round((price / med - 1) * 100, 1)
        km_txt = f"، {km:,} كم" if km else ""
        items.append({"t": "deal", "name": f"{mk} {mo} {y}{km_txt}", "kind": "لقطة على " + SOURCE_AR.get(src, src), "when": _when(seen),
                      "price": price, "median": int(round(med)), "delta": pct, "pct": True, "up": False,
                      "source": SOURCE_AR.get(src, src), "url": url, "city": city,
                      "car": {"make": mk, "model": mo, "year": y, "trim": (trim or "Standard").strip()}, "km": km or 0})
    return {"items": items[:limit]}


# ---------------------------------------------------------------- zero prices: makes -> models -> trims -> one trim
ZERO_SQL = """
with latest as (
  select distinct on (z.model_id, z.trim_name, z.model_year)
         z.make_id, z.model_id, z.trim_name, z.model_year, z.price_egp, z.market_price_egp, z.source, z.source_url, z.effective_on
  from zero_prices z
  where z.model_id is not null and z.effective_on > now() - interval '120 days'
  order by z.model_id, z.trim_name, z.model_year, z.effective_on desc, z.scraped_at desc
)
select mk.name_en, mo.name_en, l.trim_name, l.model_year, l.price_egp, l.market_price_egp, l.source, l.source_url, l.effective_on
from latest l join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
"""


def _trim_label(make: str, model: str, trim: str) -> str:
    """Hatla2ee names a trim 'Kia Sportage 2025 A/T / Top Line'; keep just the trim part."""
    t = trim or ""
    for w in (make, model):
        if w and t.lower().startswith(w.lower()):
            t = t[len(w):].strip()
    t = re.sub(r"^(19|20)\d\d\s+", "", t).strip(" -،,")
    return t or "الفئة الأساسية"


def zero(cx, make: str | None = None, model: str | None = None) -> dict:
    rows = cx.execute(ZERO_SQL).fetchall()
    newest = {}
    for mk, mo, *_rest in rows:
        y = _rest[1]
        newest[(mk, mo)] = max(newest.get((mk, mo), 0), y)
    # only the current model year(s): a model can still list last year's trims for a while
    rows = [r for r in rows if r[3] >= newest[(r[0], r[1])] - 1]
    if not make:
        acc: dict = {}
        for mk, mo, tr, y, p, *_ in rows:
            a = acc.setdefault(mk, {"make": mk, "models": set(), "trims": 0, "from": p})
            a["models"].add(mo)
            a["trims"] += 1
            a["from"] = min(a["from"], p)
        out = [{"make": a["make"], "models": len(a["models"]), "trims": a["trims"], "from": a["from"]} for a in acc.values()]
        return {"level": "makes", "items": sorted(out, key=lambda a: a["make"].lower())}
    rows = [r for r in rows if r[0].lower() == make.lower()]
    if not model:
        acc = {}
        for mk, mo, tr, y, p, *_ in rows:
            a = acc.setdefault(mo, {"model": mo, "trims": 0, "from": p, "to": p, "year": y})
            a["trims"] += 1
            a["from"], a["to"], a["year"] = min(a["from"], p), max(a["to"], p), max(a["year"], y)
        return {"level": "models", "make": rows[0][0] if rows else make, "items": sorted(acc.values(), key=lambda a: a["from"])}
    rows = [r for r in rows if r[1].lower() == model.lower()]
    hist = {}
    if rows:
        for tr, y, p, on in cx.execute("""
                select z.trim_name, z.model_year, z.price_egp, z.effective_on from zero_prices z
                join models mo on mo.id = z.model_id join makes mk on mk.id = z.make_id
                where lower(mk.name_en) = lower(%s) and lower(mo.name_en) = lower(%s)
                order by z.effective_on""", (make, model)):
            h = hist.setdefault((tr, y), [])
            if not h or h[-1]["price"] != p:
                h.append({"date": on.isoformat(), "price": p})
    items = []
    for mk, mo, tr, y, p, mkt, src, url, on in rows:
        h = hist.get((tr, y), [])
        prev = h[-2]["price"] if len(h) >= 2 else None
        items.append({"trim": _trim_label(mk, mo, tr), "full": tr, "year": y, "price": p, "market": mkt,
                      "prev": prev, "change": (p - prev) if prev else None, "changed_on": h[-1]["date"] if h else on.isoformat(),
                      "source": SOURCE_AR.get(src, src), "url": url, "history": h[-8:]})
    items.sort(key=lambda a: (-a["year"], a["price"]))
    return {"level": "trims", "make": rows[0][0] if rows else make, "model": rows[0][1] if rows else model, "items": items}
