"""Sa3arly pricing engine — fair market range for one used car, explained line by line.

Method (matches the spec):
 1. comparables: same make + model, model year ±1, widened (±2, then 120 / 180 days, ±3) until 15 ads,
    not customs-exempt ('Disabled'), not zero-km stock;
 2. keep the closest cars: same trim and a similar odometer when there are enough of them;
    clean: drop asking prices that are impossible next to today's zero price (down-payment ads,
    typos), then 1.5×IQR on the raw prices and again on the normalised prices;
 3. normalise every comparable to this car's year and km (rates fitted from the comparables
    themselves when there are enough, otherwise market defaults);
 4. asking → deal: −5 % for classified ads, −2 % for Sylndr's fixed inspected prices;
 5. range = 25th–75th percentile of the normalised comparables;
 6. condition: paint deductions (% of price) and repair costs (EGP) subtracted;
 7. thin data (< 5 comparables): anchor on today's zero price × the depreciation seen for that
    model / brand; confidence is shown either way.
"""
from __future__ import annotations

import statistics
from dataclasses import dataclass, field
from datetime import date
from typing import Optional

from .common import slugify
from .normalize import make_slug

# Default deductions when a part is repainted (share of market price). Priors until learned.
PAINT_PRIOR = {
    "door": 0.015, "front_fender": 0.015, "rear_fender": 0.03, "bumper": 0.005,
    "hood": 0.02, "roof": 0.06, "trunk": 0.02, "pillar": 0.04, "chassis": 0.10,
}
REPLACED_FACTOR = 1.3          # a replaced (non-original) part weighs more than a repaint
DEAL_DISCOUNT = {"default": 0.05, "sylndr": 0.02}
DEFAULT_YEAR_RATE = 0.07       # value lost per model year, used when it cannot be fitted
DEFAULT_KM_RATE = 0.008        # value lost per 10,000 km, used when it cannot be fitted
EXCLUDE_BADGES = {"Disabled"}


@dataclass
class Comparable:
    source: str
    year: int
    km: Optional[int]
    price: int
    url: str
    trim: Optional[str] = None
    adjusted: float = 0.0


@dataclass
class Quote:
    low: Optional[int]
    high: Optional[int]
    mid: Optional[int]
    confidence: str
    comparables: list = field(default_factory=list)
    zero_price: Optional[int] = None
    zero_year: Optional[int] = None
    lines: list = field(default_factory=list)      # Arabic explanation, one step per line
    ai: Optional[dict] = None                      # what the learned model said, and how much it counted

    def text(self) -> str:
        head = (f"الرينج: {self.low:,} – {self.high:,} جنيه  (الثقة: {self.confidence})"
                if self.low else f"مفيش بيانات كفاية لسعر (الثقة: {self.confidence})")
        return "\n".join([head] + [f"• {l}" for l in self.lines])


def _round(x: float, step: int = 5000) -> int:
    return int(round(x / step) * step)


def _iqr_filter(xs: list[Comparable]) -> list[Comparable]:
    if len(xs) < 5:
        return xs
    ps = sorted(c.price for c in xs)
    q1, q3 = statistics.quantiles(ps, n=4)[0], statistics.quantiles(ps, n=4)[2]
    lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
    return [c for c in xs if lo <= c.price <= hi]


MIN_SIMILAR = 8                # narrow to same trim / similar km only when this many remain


def _norm_trim(t: Optional[str]) -> str:
    return " ".join((t or "").lower().replace("-", " ").split())


def _closest(comps: list[Comparable], trim: Optional[str], km: int) -> tuple[list[Comparable], list[str]]:
    """Narrow the pool to the most similar cars, but never below MIN_SIMILAR."""
    notes = []
    tt = _norm_trim(trim)
    if tt:
        same = [c for c in comps if tt in _norm_trim(c.trim) or (_norm_trim(c.trim) and _norm_trim(c.trim) in tt)]
        if len(same) >= MIN_SIMILAR:
            notes.append(f"نفس الفئة ({trim}) بس: {len(same)} من {len(comps)}")
            comps = same
    band = max(40_000, km * 0.5)
    near = [c for c in comps if c.km is not None and abs(c.km - km) <= band]
    if len(near) >= MIN_SIMILAR and len(near) < len(comps):
        notes.append(f"عداد قريب (±{int(band):,} كم) بس: {len(near)} من {len(comps)}")
        comps = near
    return comps, notes


def _iqr_on(xs: list[Comparable], key) -> list[Comparable]:
    if len(xs) < 5:
        return xs
    vs = sorted(key(c) for c in xs)
    q = statistics.quantiles(vs, n=4)
    lo, hi = q[0] - 1.5 * (q[2] - q[0]), q[2] + 1.5 * (q[2] - q[0])
    return [c for c in xs if lo <= key(c) <= hi]


def _fit_rates(comps: list[Comparable]) -> tuple[float, float, str]:
    """Least squares on log-price: log p = a − y_rate·age − km_rate·km/10k. Falls back to defaults."""
    import math
    pts = [(c.year, c.km, math.log(c.price)) for c in comps if c.km is not None and c.km > 0]
    if len(pts) < 12 or len({p[0] for p in pts}) < 2:
        return DEFAULT_YEAR_RATE, DEFAULT_KM_RATE, "default"
    n = len(pts)
    ys = [p[0] for p in pts]; ks = [p[1] / 10_000 for p in pts]; zs = [p[2] for p in pts]
    my, mk, mz = sum(ys) / n, sum(ks) / n, sum(zs) / n
    syy = sum((y - my) ** 2 for y in ys); skk = sum((k - mk) ** 2 for k in ks)
    syk = sum((y - my) * (k - mk) for y, k in zip(ys, ks))
    syz = sum((y - my) * (z - mz) for y, z in zip(ys, zs)); skz = sum((k - mk) * (z - mz) for k, z in zip(ks, zs))
    det = syy * skk - syk ** 2
    if abs(det) < 1e-9:
        return DEFAULT_YEAR_RATE, DEFAULT_KM_RATE, "default"
    b_year = (skk * syz - syk * skz) / det          # log-price change per newer model year
    b_km = (syy * skz - syk * syz) / det            # log-price change per 10k km (negative)
    y_rate, k_rate = b_year, -b_km
    if not (0.02 <= y_rate <= 0.20) or not (0.0 <= k_rate <= 0.04):
        return DEFAULT_YEAR_RATE, DEFAULT_KM_RATE, "default"
    return y_rate, k_rate, "fitted"


def _paint_weight(part: str) -> float:
    """'door_fl' -> door, 'rear_fender_l' -> rear_fender, 'hood' -> hood."""
    p = part.lower()
    for key in sorted(PAINT_PRIOR, key=len, reverse=True):
        if p == key or p.startswith(key + "_"):
            return PAINT_PRIOR[key]
    return 0.015


WANT_COMPS = 15                                    # aim for at least this many ads
WIDE_STEPS = ((1, 60), (2, 60), (2, 120), (3, 180))  # (model years either side, days back)


def _ai_weight(n: int, known_model: bool, has_zero: bool, error: float = 0.0, learned: Optional[dict] = None) -> float:
    """How much the learned model counts next to n close comparables (checked on held-out cars, see tests).
    A model whose held-out error is above 6 % counts proportionally less."""
    if n == 0:
        return 1.0
    if learned:                          # weights the nightly training measured on left-out real ads
        return float(learned.get("<8 ads" if n < 8 else "8-19 ads" if n < 20 else "20+ ads", 0.0))
    w = 0.6 if n < 8 else 0.45 if n < 20 else 0.3
    if not known_model and not has_zero:
        w *= 0.4                     # the model never saw this car and has no zero price to anchor on
    if error and error > 0.06:
        w *= 0.06 / error
    return w


class Pricer:
    def __init__(self, cx, use_ai: bool = True, wide: bool = True):
        self.cx = cx
        self.wide = wide
        self.use_ai = use_ai
        self.exclude_url = None          # leave one ad out (for measuring the error on that ad)

    def _ai(self, make, model, year, km, trim, zero):
        if not self.use_ai:
            return None, None
        from . import ml
        m = ml.latest(self.cx)
        if m is None:
            return None, None
        f = ml.row_features(make, model, year, km, trim, "hatla2ee", zero=zero)
        p = m.predict(f)
        disc = 1 - DEAL_DISCOUNT["default"]           # predicted as a Hatla2ee ask -> a deal price
        return {k: v * disc for k, v in p.items()}, {"metrics": m.metrics, "known": m.known(f), "blend": m.blend}

    # ---------------------------------------------------------------- data
    def _make_id(self, make: str) -> Optional[int]:
        r = self.cx.execute("select id from makes where slug = %s", (make_slug(make),)).fetchone()
        return r[0] if r else None

    def comparables(self, make: str, model: str, year: int, spread: int, days: int = 60) -> list[Comparable]:
        mk = self._make_id(make)
        if not mk:
            return []
        ms = slugify(model)
        like = ms.replace("\\", "\\\\").replace("_", "\\_").replace("%", "\\%") + "-%"
        # model family ('elantra' ⇄ 'elantra-ad') is resolved in SQL, so only matching rows leave the database
        rows = self.cx.execute("""
            select l.source, l.year, l.km, l.price_egp, l.url, l.trim_raw, coalesce(l.raw->'badges', '[]'::jsonb)
            from listings l
            where l.make_id = %s
              and l.model_id in (select id from models
                                 where make_id = %s and (slug = %s or slug like %s or %s like slug || '-%%'))
              and l.year between %s and %s and l.price_egp is not null
              and l.last_seen > now() - make_interval(days => %s)
              and (l.removed_at is null or l.removed_at > now() - make_interval(days => %s))
        """, (mk, mk, ms, like, ms, year - spread, year + spread, days, days)).fetchall()
        out = []
        for src, y, km, price, url, trim, badges in rows:
            if set(badges or []) & EXCLUDE_BADGES or url == self.exclude_url:
                continue
            if km is not None and km < 1000 and y >= date.today().year:
                continue                                      # zero-km stock, not a used car
            out.append(Comparable(src, y, km, int(price), url, trim))
        return out

    def zero_price(self, make: str, model: str) -> tuple[Optional[int], Optional[int]]:
        """Median official price of the newest model year on sale today."""
        mk = self._make_id(make)
        if not mk:
            return None, None
        ms = slugify(model)
        like = ms.replace("\\", "\\\\").replace("_", "\\_").replace("%", "\\%") + "-%"
        rows = self.cx.execute("""
            select z.model_year, z.price_egp from zero_prices z
            where z.make_id = %s and z.effective_on > now() - interval '45 days'
              and z.model_id in (select id from models
                                 where make_id = %s and (slug = %s or slug like %s or %s like slug || '-%%'))
        """, (mk, mk, ms, like, ms)).fetchall()
        if not rows:
            return None, None
        top = max(y for y, _ in rows)
        return int(statistics.median(p for y, p in rows if y == top)), top

    # ---------------------------------------------------------------- quote
    def quote(self, make: str, model: str, year: int, km: int, paint: Optional[dict] = None,
              repairs: Optional[list[tuple[int, int]]] = None, trim: Optional[str] = None) -> Quote:
        lines = []
        # widen step by step until there are enough ads to compare with (years and km are adjusted below)
        steps = WIDE_STEPS if self.wide else ((1, 60), (2, 60))
        for spread, days in steps:
            comps = self.comparables(make, model, year, spread, days)
            if len(comps) >= (WANT_COMPS if self.wide else 8):
                break
        zero, zero_year = self.zero_price(make, model)
        found = len(comps)
        if zero:
            # an asking price under 25 % or over 130 % of a new one is a down payment, a typo or a dream
            comps = [c for c in comps if 0.25 * zero <= c.price <= 1.3 * zero]
        comps, notes = _closest(comps, trim, km)
        comps = _iqr_filter(comps)
        y_rate, k_rate, how = _fit_rates(comps)

        for c in comps:
            adj = c.price * (1 + y_rate) ** (year - c.year)
            if c.km is not None:
                adj *= (1 + k_rate) ** ((c.km - km) / 10_000)   # comparable drove more -> worth more at our km
            adj *= 1 - DEAL_DISCOUNT.get(c.source, DEAL_DISCOUNT["default"])
            c.adjusted = adj
        comps = _iqr_on(comps, lambda c: c.adjusted)     # second pass: odd once year/km are evened out
        n = len(comps)
        lines.extend(notes)
        if found - n:
            lines.append(f"اتشال {found - n} إعلان سعره شاذ أو بعيد عن العربية دي")
        conf = "عالية" if n >= 20 else "متوسطة" if n >= 8 else "منخفضة"
        lines.append(f"{n} عربية شبهها اتقارنت (سنة {year - spread}–{year + spread}، آخر {days} يوم، "
                     f"مصادر: {', '.join(sorted({c.source for c in comps})) or '—'})")
        lines.append(f"تظبيط السنة والعداد: {y_rate:.1%} لكل سنة و{k_rate:.1%} لكل ١٠ آلاف كم "
                     f"({'محسوبة من السوق' if how == 'fitted' else 'قيم افتراضية'})")
        lines.append("سعر الإعلان ← سعر البيع: −٥٪ (−٢٪ لـ Sylndr)")

        if n >= 5:
            adjusted = sorted(c.adjusted for c in comps)
            q = statistics.quantiles(adjusted, n=4)
            low, high, mid = q[0], q[2], statistics.median(adjusted)
        elif n >= 1 and zero:
            # thin data: retention of the few comparables vs today's zero price, applied to this car
            ret = statistics.median(c.adjusted for c in comps) / zero
            mid = zero * ret
            low, high = mid * 0.94, mid * 1.06
            lines.append(f"بيانات قليلة: الحساب من سعر الزيرو ({zero:,}) × نسبة الاحتفاظ بالقيمة ({ret:.0%})")
        elif n >= 1:
            mid = statistics.median(c.adjusted for c in comps)
            low, high = mid * 0.93, mid * 1.07
        else:
            low = high = mid = None

        # the learned model: blends in by how few close ads there are, and prices cars with none
        ai, info = self._ai(make, model, year, km, trim, zero)
        if ai and not 30_000 <= ai["mid"] <= 100_000_000:
            ai = None                     # not a car price (a model trained without such cars): don't show it
        ai_out = None
        if ai:
            met = info["metrics"]
            w = _ai_weight(n, info["known"]["model"], bool(zero), met.get("median_ape") or 0.0, info.get("blend"))
            ai_out = {"mid": _round(ai["mid"]), "low": _round(ai["lo"]), "high": _round(ai["hi"]), "weight": round(w, 2),
                      "n_train": met.get("n_all", met.get("n_train")), "error": met.get("median_ape"), "comps_mid": _round(mid) if mid else None}
            if mid is None:
                # no close ads: the model's own middle; the range is as wide as its measured error on such cars
                err = (info.get("blend") or {}).get("no_ads_error") or 0.15
                half = min(0.30, max(0.10, err))
                kn = info["known"]
                if not kn["model"] and not zero:
                    # a model it never saw: it goes by the make, the year and the km, so the range is wider
                    half = max(half, 0.30 if not kn["make"] else 0.22)
                mid = ai["mid"]
                low, high = mid * (1 - half), mid * (1 + half)
                conf = "منخفضة"
                if kn["model"] or zero:
                    lines.append("مفيش عربيات شبهها كفاية، فده تقدير تقريبي من الذكاء الاصطناعي اللي اتعلّم من كل الإعلانات "
                                 f"(غلطه في الحالات دي حوالي {err:.0%})")
                else:
                    lines.append("الموديل ده مفيش عليه إعلانات خالص، فده تخمين من الذكاء الاصطناعي على حسب "
                                 + ("الماركة والسنة والعداد" if kn["make"] else "السنة والعداد ونوع العربية")
                                 + f"، والمدى واسع (±{half:.0%}). اتأكد من السعر قبل ما تقرر")
            else:
                gap = (ai["mid"] - mid) / mid
                if abs(gap) > 0.20 and n >= 5:
                    # too far from what the ads say: trust the ads, and say so
                    w = 0.0
                    ai_out["weight"] = 0.0
                    lines.append(f"الذكاء الاصطناعي متوقّع سعر {'أعلى' if gap > 0 else 'أقل'} بـ {abs(gap):.0%} من الإعلانات القريبة، "
                                 "فاعتمدنا على الإعلانات. بص على العربيات اللي اتقارنت قبل ما تقرر")
                else:
                    # move the ads' range by the blended middle; the ads keep deciding how wide it is
                    new_mid = w * ai["mid"] + (1 - w) * mid
                    low, high = low * new_mid / mid, high * new_mid / mid
                    mid = new_mid
                    if abs(gap) >= 0.12:
                        lines.append(f"الإعلانات القريبة {'أرخص' if gap > 0 else 'أغلى'} بـ {abs(gap):.0%} من اللي متوقع لعربية زيها، "
                                     "بص على العربيات اللي اتقارنت قبل ما تقرر")
            lines.append(f"الذكاء الاصطناعي: اتعلّم من {met.get('n_all', met.get('n_train', 0)):,} إعلان (غلطه المعتاد {met.get('median_ape', 0):.0%})، "
                         f"توقّع {_round(ai['mid']):,} جنيه، ووزنه في السعر {w:.0%}"
                         + (" (لسه مش أدق من الإعلانات القريبة للعربية دي، فبنستخدمه للمراجعة بس)" if w == 0 and n else ""))
        if mid is None:
            return Quote(None, None, None, "منخفضة", [], zero, zero_year,
                         lines + ["مفيش عربيات شبهها في القاعدة لسه"])

        # few comparables -> the quartiles are too tight to be honest: enforce a minimum width
        min_width = 0.12 if n == 0 else 0.10 if n < 8 else 0.07 if n < 20 else 0.0
        if min_width and (high - low) < min_width * mid:
            low, high = mid * (1 - min_width / 2), mid * (1 + min_width / 2)

        # condition
        paint = paint or {}
        pct = 0.0
        for part, state in paint.items():
            base = _paint_weight(part)
            if state == "repainted":
                pct += base
            elif state == "replaced":
                pct += base * REPLACED_FACTOR
        if pct:
            lines.append(f"خصم الرش/التغيير: −{pct:.1%}")
        rep_lo = sum(r[0] for r in repairs or [])
        rep_hi = sum(r[1] for r in repairs or [])
        if rep_hi:
            lines.append(f"خصم الإصلاحات: −{rep_lo:,} إلى −{rep_hi:,} جنيه")
        low = low * (1 - pct) - rep_hi
        high = high * (1 - pct) - rep_lo
        mid = mid * (1 - pct) - (rep_lo + rep_hi) / 2
        if zero:
            lines.append(f"سعر الزيرو النهارده (موديل {zero_year}): {zero:,} جنيه")
        return Quote(_round(low), _round(high), _round(mid), conf,
                     sorted(comps, key=lambda c: abs(c.adjusted - mid))[:10], zero, zero_year, lines, ai_out)
