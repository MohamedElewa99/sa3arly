"""Sa3arly pricing engine — fair market range for one used car, explained line by line.

Method (matches the spec):
 1. comparables: same make + model, model year ±1 (±2 when thin), listed in the last 60 days,
    not customs-exempt ('Disabled'), not zero-km stock;
 2. clean: drop prices outside 1.5×IQR;
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


class Pricer:
    def __init__(self, cx):
        self.cx = cx

    # ---------------------------------------------------------------- data
    def _make_id(self, make: str) -> Optional[int]:
        r = self.cx.execute("select id from makes where slug = %s", (make_slug(make),)).fetchone()
        return r[0] if r else None

    def comparables(self, make: str, model: str, year: int, spread: int, days: int = 60) -> list[Comparable]:
        mk = self._make_id(make)
        if not mk:
            return []
        ms = slugify(model)
        rows = self.cx.execute("""
            select l.source, l.year, l.km, l.price_egp, l.url, l.trim_raw, coalesce(l.raw->'badges', '[]'::jsonb),
                   mo.slug
            from listings l left join models mo on mo.id = l.model_id
            where l.make_id = %s and l.year between %s and %s and l.price_egp is not null
              and l.last_seen > now() - make_interval(days => %s)
              and (l.removed_at is null or l.removed_at > now() - make_interval(days => %s))
        """, (mk, year - spread, year + spread, days, days)).fetchall()
        out = []
        for src, y, km, price, url, trim, badges, mslug in rows:
            mslug = mslug or ""
            # 'elantra' matches 'elantra-ad', 'elantra-cn7'…; exact generation wins when given
            if not (mslug == ms or mslug.startswith(ms + "-") or ms.startswith(mslug + "-")):
                continue
            if set(badges or []) & EXCLUDE_BADGES:
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
        rows = self.cx.execute("""
            select z.model_year, z.price_egp, mo.slug from zero_prices z join models mo on mo.id = z.model_id
            where z.make_id = %s and z.effective_on > now() - interval '45 days'
        """, (mk,)).fetchall()
        rows = [(y, p) for y, p, s in rows if s == ms or s.startswith(ms + "-") or ms.startswith(s + "-")]
        if not rows:
            return None, None
        top = max(y for y, _ in rows)
        return int(statistics.median(p for y, p in rows if y == top)), top

    # ---------------------------------------------------------------- quote
    def quote(self, make: str, model: str, year: int, km: int, paint: Optional[dict] = None,
              repairs: Optional[list[tuple[int, int]]] = None) -> Quote:
        lines = []
        comps = self.comparables(make, model, year, 1)
        spread = 1
        if len(comps) < 8:
            comps, spread = self.comparables(make, model, year, 2), 2
        comps = _iqr_filter(comps)
        y_rate, k_rate, how = _fit_rates(comps)
        zero, zero_year = self.zero_price(make, model)

        for c in comps:
            adj = c.price * (1 + y_rate) ** (year - c.year)
            if c.km is not None:
                adj *= (1 + k_rate) ** ((c.km - km) / 10_000)   # comparable drove more -> worth more at our km
            adj *= 1 - DEAL_DISCOUNT.get(c.source, DEAL_DISCOUNT["default"])
            c.adjusted = adj
        n = len(comps)
        conf = "عالية" if n >= 20 else "متوسطة" if n >= 8 else "منخفضة"
        lines.append(f"{n} عربية شبهها اتقارنت (سنة {year - spread}–{year + spread}، آخر ٦٠ يوم، "
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
            return Quote(None, None, None, "منخفضة", [], zero, zero_year,
                         lines + ["مفيش عربيات شبهها في القاعدة لسه"])

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
                     sorted(comps, key=lambda c: abs(c.adjusted - mid))[:10], zero, zero_year, lines)
