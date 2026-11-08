"""Read-only queries behind the Sa3arly app: catalog, one-car quote, market feed.

Each function takes an open psycopg connection and returns plain JSON-able dicts.
The Vercel functions in /api are thin wrappers around these, so they can be tested locally.
"""
from __future__ import annotations

import re
import statistics
from datetime import date, datetime, timezone
from typing import Optional

from .normalize import make_display
from .trims_ref import ref_for
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


NOT_MODELS = {"automatic", "manual", "diesel", "gas", "natural-gas", "natural gas", "electric", "hybrid", "plug-in-hybrid",
              "plug in hybrid", "taxi", "classic", "disabled", "kasr-zero"}


def _junk(name) -> bool:
    """Catch-all buckets from the listing sites ("Other") aren't a car anyone can pick."""
    n = (name or "").strip().lower()
    return n in JUNK or n in NOT_MODELS or n.startswith("other-") or n.startswith("other ")


def _pretty(name: str) -> str:
    """A model only known from a link ('giulietta-quadrifoglio-verde', 'creta-su2') -> 'Giulietta Quadrifoglio Verde', 'Creta SU2'."""
    if " " in name or name != name.lower():
        return name
    return " ".join(w.upper() if re.search(r"\d", w) and re.search(r"[a-z]", w) else w.capitalize() for w in re.split(r"[-_]+", name) if w)


_CAT = re.compile(r"^(\d)(?:st|nd|rd|th)\s+category$", re.I)


def _listing_trims(rs: list, zero_trims: dict) -> list:
    """Trims as written in the ads, cleaned and lowest first: one spelling per trim, typos seen once dropped,
    the site's 'Nth Category' classes kept in their order (4th < 3rd < 2nd < 1st), 'Standard' only when alone."""
    spell = _merge_case([_clean_trim(r[5]) for r in rs if _clean_trim(r[5])])
    def ok(t):
        return t and not re.search(r"\b(19|20)\d{2}\b", t) and len(t) <= 40
    merged = [r[:5] + (spell.get(_clean_trim(r[5]).lower(), ""),) + r[6:] for r in rs]
    merged = [r for r in merged if ok(r[5])]
    counts: dict[str, int] = {}
    for r in merged:
        counts[r[5]] = counts.get(r[5], 0) + 1
    if sum(1 for c in counts.values() if c >= 2) >= 2:
        merged = [r for r in merged if counts[r[5]] >= 2]
    ordered = list(reversed(_trims_by_level(merged, zero_trims)))
    cats = sorted([t for t in ordered if _CAT.match(t)], key=lambda t: -int(_CAT.match(t).group(1)))
    if cats:                                   # keep the classes in their own order, where the first one sat
        at = min(ordered.index(t) for t in cats)
        rest = [t for t in ordered if not _CAT.match(t)]
        ordered = rest[:at] + cats + rest[at:]
    if len(ordered) > 1:
        ordered = [t for t in ordered if t.lower() not in ("standard", "عادية")] or ordered
    return ordered


def _tnorm(t: str) -> set:
    t = re.sub(r"\b([amc])\s*/\s*t\b", r"\1t", (t or "").lower())          # A/T, M/T, C/T -> at, mt, ct
    return set(re.findall(r"[a-z0-9]+|[\u0600-\u06ff]+", t))


def _trims_by_level(rs, zero_trims: Optional[dict] = None) -> list:
    """The model's trims, highest first. Up to 8 of the most listed.

    The new (zero) price of a trim says best where it sits, so trims that match one are ordered by it. The others
    get a level from their used ads: price brought to the same model year (9 %/year) and the same km (1 % per 10k),
    pulled toward the model's middle when a trim has few ads, then put on the zero scale with the ratio measured on
    the matched trims. zero_trims: {trim name: newest zero price}."""
    if not rs:
        return []
    by: dict[str, list] = {}
    newest = max(r[2] for r in rs)
    kms = sorted(r[3] for r in rs if r[3] is not None)
    mid_km = kms[len(kms) // 2] if kms else 0
    for r in rs:
        t = (r[5] or "").strip()
        if t and r[4]:
            km_adj = 1 + 0.01 * ((r[3] or mid_km) - mid_km) / 10_000
            by.setdefault(t, []).append(r[4] * 1.09 ** (newest - r[2]) * max(0.7, min(1.3, km_adj)))
    common = sorted(by, key=lambda t: -len(by[t]))[:8]
    if not common:
        return []
    all_p = [p for t in common for p in by[t]]
    model_mid = statistics.median(all_p)
    k = 4

    def used_level(t):
        v = by[t]
        return (statistics.median(v) * len(v) + model_mid * k) / (len(v) + k)

    zero_of: dict[str, float] = {}
    if zero_trims:
        zt = [(_tnorm(n), p) for n, p in zero_trims.items() if p]
        for t in common:
            a = _tnorm(t)
            best, score = None, 0.0
            for b, p in zt:
                j = len(a & b) / len(a | b) if a and b else 0.0
                if j > score:
                    best, score = p, j
            if best and score >= 0.5:
                zero_of[t] = best
    ratios = [zero_of[t] / used_level(t) for t in zero_of]
    ratio = statistics.median(ratios) if ratios else 1.0
    level = {t: zero_of.get(t, used_level(t) * ratio) for t in common}
    return sorted(common, key=lambda t: -level[t])


def _clean_trim(t) -> str:
    t = re.sub(r"\s+", " ", (t or "").strip())
    return "" if _junk(t) or t in {"-", "--", "."} else t


def _official_trims(z: list[tuple]) -> tuple[list, dict]:
    """Official (zero) prices -> (all trims lowest first, {model year: trims lowest first}).

    Within a year trims are ordered by their price. Across years a trim is placed by where it sat in its own
    year's list (0 = cheapest, 1 = top), so a 2019-only trim falls in its right place among the 2025 ones."""
    by_year: dict[int, dict[str, int]] = {}
    for y, p, tn in z:
        tn = _clean_trim(tn)
        if tn and p:
            d = by_year.setdefault(y, {})
            d[tn] = p if tn not in d else min(d[tn], p)       # price changes: the year's price list, lowest
    per_year = {y: sorted(d, key=lambda t: d[t]) for y, d in by_year.items()}
    pos: dict[str, list] = {}
    for y, ts in per_year.items():
        for i, t in enumerate(ts):
            pos.setdefault(t.lower(), []).append((i / (len(ts) - 1) if len(ts) > 1 else 0.5, y, t))
    order = sorted(pos.values(), key=lambda v: (statistics.mean(x[0] for x in v), -max(x[1] for x in v)))
    return [max(v, key=lambda x: x[1])[2] for v in order], per_year


def _mslug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def _family_trims(zmap: dict, mk: str, mo: str, years: set) -> list:
    """Official trims of the same model family (one name the start of the other) for the years this model covers."""
    me, out = _mslug(mo), []
    for (mk2, mo2), rows in zmap.items():
        other = _mslug(mo2)
        if mk2 != mk or other == me or not other or not (me.startswith(other + "-") or other.startswith(me + "-")):
            continue
        out += [(y, p, tn) for y, p, tn, _ in rows if y in years]
    return out


def _merge_case(names: list[str]) -> dict[str, str]:
    """'1st Category' and '1st category' are one trim: lower name -> the spelling used most."""
    cnt: dict[str, dict[str, int]] = {}
    for n in names:
        cnt.setdefault(n.lower(), {}).setdefault(n, 0)
        cnt[n.lower()][n] += 1
    return {k: max(v, key=lambda n: (v[n], n[:1].isupper())) for k, v in cnt.items()}


def catalog(cx, days: int = 90, min_ads: int = 1) -> dict:
    """Every make and model we know: the ones with ads (any time), the ones with official prices, and the full
    model list read from the listing sites (model_catalog). Trims lowest first: official classes ordered by their
    price when the model has them (also per model year), else the trims written in the ads, cheapest first."""
    rows = cx.execute("""
        select mk.name_en, mo.name_en, l.year, l.km, l.price_egp, l.trim_raw, l.body_type,
               l.last_seen > now() - make_interval(days => %s)
        from listings l join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
        where l.price_egp is not null and l.year is not null
    """, (days,)).fetchall()
    zero = cx.execute("""
        select mk.name_en, mo.name_en, z.model_year, z.price_egp, z.trim_name, z.effective_on > now() - interval '45 days'
        from zero_prices z join makes mk on mk.id = z.make_id join models mo on mo.id = z.model_id
    """).fetchall()
    listed = []
    if cx.execute("select to_regclass('model_catalog')").fetchone()[0]:
        listed = cx.execute("""select mk.name_en, mo.name_en from model_catalog c
                               join models mo on mo.id = c.model_id join makes mk on mk.id = mo.make_id""").fetchall()
    if cx.execute("select to_regclass('trim_prices')").fetchone()[0]:
        # every version of past model years with its price new (YallaMotor): the real trims of old models
        zero = list(zero) + [(mk, mo, y, p, tn, None) for mk, mo, y, p, tn in cx.execute("""
            select mk.name_en, mo.name_en, t.model_year, t.price_egp, t.trim
            from trim_prices t join models mo on mo.id = t.model_id join makes mk on mk.id = mo.make_id
            where t.price_egp > 0""").fetchall()]
    names: dict[str, str] = {}
    disp = lambda m: names.setdefault(m, make_display(m))       # 'Alfaromeo' and 'Alfa Romeo' -> one brand
    rows = [(disp(r[0]),) + tuple(r[1:]) for r in rows]
    zero = [(disp(r[0]),) + tuple(r[1:]) for r in zero]
    listed_set = {(disp(a), b) for a, b in listed}
    zmap: dict[tuple, list] = {}
    for mk, mo, y, p, tn, fresh in zero:
        zmap.setdefault((mk, mo), []).append((y, p, tn, fresh))

    groups: dict[tuple, list] = {}
    for r in rows:
        groups.setdefault((r[0], r[1]), []).append(r)
    keys = set(groups) | set(zmap) | listed_set
    makes: dict[str, dict] = {}
    best, best_n = None, 0
    this_year = date.today().year
    for (mk, mo) in keys:
        if _junk(mk) or _junk(mo):
            continue
        rs_all = groups.get((mk, mo), [])
        rs = [r for r in rs_all if r[7]] or rs_all            # recent ads when there are any
        z = zmap.get((mk, mo), [])
        if len(rs_all) < min_ads and not z and (mk, mo) not in listed_set:
            continue
        years = sorted({r[2] for r in rs_all if 1980 <= r[2] <= this_year + 1} | {y for y, _, _, _ in z if 1980 <= y <= this_year + 1})
        if not years:
            years = list(range(this_year - 15, this_year + 1))
        zero_price = None
        fresh = [(y, p) for y, p, _, f in z if f is True]
        if fresh:
            newest = max(y for y, _ in fresh)
            zero_price = int(statistics.median(p for y, p in fresh if y == newest))
        # a year Hatla2ee has official prices for keeps those; YallaMotor fills the other years
        hy = {y for y, _, _, f in z if f is not None}
        official, per_year = _official_trims([(y, p, tn) for y, p, tn, f in z if f is not None or y not in hy])
        if len(official) < 2:
            # 'Elantra HD' takes the trims YallaMotor lists under 'Elantra' for the same years
            fam = _family_trims(zmap, mk, mo, set(years))
            if fam:
                official, per_year = _official_trims(fam)
        # researched trims of popular older models fill the years no official price list covers
        ref = ref_for(mk, mo, set(years))
        for y, ts in ref.items():
            if len(per_year.get(y, [])) < 2:
                per_year[y] = list(ts)
        if ref and len(official) < 2:
            official = []
            for y in sorted(per_year, reverse=True):
                official += [t for t in per_year[y] if t not in official]
        if len(official) >= 2 or (official and not rs_all):
            trims, trims_by_year = official, {str(y): ts for y, ts in per_year.items() if ts}
        else:
            trims = _listing_trims(rs_all, {t: p for _, p, t in sorted((y, p, t) for y, p, t, _ in z) if t})
            trims = trims or official or ["Standard"]
            trims_by_year = {}
        mo_name = _pretty(mo)
        if mo_name != mo and mo_name in makes.get(mk, {}):
            continue
        makes.setdefault(mk, {})[mo_name] = {
            "body": _body([r[6] for r in rs_all]),
            "trims": trims,
            "trimsByYear": trims_by_year,
            "years": years,
            "ref": _ref_price([(r[2], r[3], r[4]) for r in rs]) if rs else None,
            "zero": zero_price or 0,
            "n": len(rs),
        }
        if len(rs) > best_n:
            year_counts: dict[int, int] = {}
            for r in rs:
                year_counts[r[2]] = year_counts.get(r[2], 0) + 1
            best_n = len(rs)
            best = {"make": mk, "model": mo_name, "year": max(year_counts, key=year_counts.get), "trim": trims[0],
                    "body": makes[mk][mo_name]["body"]}
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
