"""Site-independent card parsing + JSON extraction, used by ContactCars, Dubizzle and Facebook.

These sites' exact card layouts were not observable from the build machine, so parsing is
field-pattern based (price, year, km, transmission recognised by shape in English or Arabic)
and every value is cross-checked by JSON embedded in the page when present.
Run `python -m sa3arly probe` to confirm on the live site.
"""
from __future__ import annotations

import re
from typing import Optional

from ..common import (
    Listing, YEAR_RE, extract_json_blobs, first_year, lines, norm_text, norm_transmission,
    parse_km, parse_price, walk_json,
)

PRICE_LINE = re.compile(r"(?i)(?:EGP|E£|LE|جنيه|ج\.م)\s*[\d,\.]+|[\d,\.]+\s*(?:EGP|E£|LE|جنيه|ج\.م|مليون|ألف|الف)")
KM_LINE = re.compile(r"(?i)^[\d,\.]+\s*(?:k\s*)?(?:km|kms|كم|كيلو)(?:\b|$)|^(?:km|كم)\s*[\d,\.]+")
SKIP = re.compile(r"(?i)^(call|chat|whatsapp|featured|premium|elite|new|used|اتصل|دردشة|مميز)$")


def parse_generic_card(text: str, href: str, source: str, source_id: str) -> Optional[Listing]:
    ls = [l for l in lines(text) if not SKIP.match(l)]
    if not ls:
        return None
    lst = Listing(source=source, source_id=source_id, url=href)
    for i, l in enumerate(ls):
        if lst.price_egp is None and PRICE_LINE.search(l):
            lst.price_egp = parse_price(l)
        elif lst.price_egp is None and l in ("EGP", "جنيه", "ج.م") and i > 0:
            lst.price_egp = parse_price(ls[i - 1])
        if lst.km is None and KM_LINE.search(l):
            lst.km = parse_km(l)
        if lst.transmission is None and len(l) < 25:
            lst.transmission = norm_transmission(l)
        if lst.year is None and re.fullmatch(r"(19|20)\d{2}", l):
            lst.year = int(l)
    # title = first line with letters that is not a price / km / time-ago line
    for l in ls:
        if re.search(r"[A-Za-z؀-ۿ]{2}", l) and not PRICE_LINE.search(l) and not KM_LINE.search(l) \
                and not re.search(r"(?i)\b(ago|منذ)\b", l) and len(l) <= 120:
            lst.title = l
            break
    lst.year = lst.year or first_year(lst.title)
    m = re.search(r"(?i)(\d+\s*(?:minute|hour|day|week|month)s?\s*ago|منذ\s*\d+\s*\S+)", text)
    if m:
        lst.raw["posted_ago"] = m.group(1)
    if not (lst.price_egp and 20_000 <= lst.price_egp <= 200_000_000):
        return None
    return lst


# ---------------------------------------------------------------- JSON fallback

_PRICE_KEYS = ("price", "priceValue", "price_egp", "amount")
_YEAR_KEYS = ("year", "modelYear", "model_year", "manufactureYear", "vehicleModelDate")
_KM_KEYS = ("mileage", "kilometers", "km", "kilometres", "mileageFromOdometer")


def _num(v):
    if isinstance(v, dict):
        v = v.get("value") or v.get("amount") or v.get("raw")
    if isinstance(v, (int, float)):
        return int(v)
    if isinstance(v, str):
        return parse_price(v)
    return None


def listings_from_json(html: str, source: str, url_of) -> list[Listing]:
    """Any JSON object on the page that looks like a car ad (id + price + year/km)."""
    out, seen = [], set()
    for blob in extract_json_blobs(html):
        for d in walk_json(blob):
            price = next((_num(d[k]) for k in _PRICE_KEYS if k in d and _num(d[k])), None)
            year = next((_num(d[k]) for k in _YEAR_KEYS if k in d and _num(d[k])), None)
            km = next((_num(d[k]) for k in _KM_KEYS if k in d and _num(d[k]) is not None), None)
            ad_id = d.get("id") or d.get("adId") or d.get("externalID") or d.get("sku")
            if not (price and ad_id and (year or km is not None)):
                continue
            if not (20_000 <= price <= 200_000_000) or (year and not 1980 <= year <= 2030):
                continue
            sid = str(ad_id)
            if sid in seen:
                continue
            seen.add(sid)
            title = d.get("title") or d.get("name")
            lst = Listing(source=source, source_id=sid, url=url_of(d, sid), title=title,
                          price_egp=price, year=year, km=km)
            for k in ("make", "brand"):
                v = d.get(k)
                lst.make_raw = lst.make_raw or (v.get("name") if isinstance(v, dict) else v)
            v = d.get("model")
            lst.model_raw = v.get("name") if isinstance(v, dict) else v
            lst.description = (d.get("description") or None) if isinstance(d.get("description"), str) else None
            tr = d.get("transmission") or d.get("vehicleTransmission")
            lst.transmission = norm_transmission(tr if isinstance(tr, str) else None)
            lst.raw["json_keys"] = sorted(d.keys())[:40]
            out.append(lst)
    return out


def merge(card: Listing, js: Optional[Listing]) -> Listing:
    """Fill gaps in a card-parsed listing from its JSON twin; flag disagreements."""
    if not js:
        return card
    for f in ("make_raw", "model_raw", "year", "km", "transmission", "description", "title"):
        if getattr(card, f) in (None, "") and getattr(js, f) not in (None, ""):
            setattr(card, f, getattr(js, f))
    if js.price_egp and card.price_egp and abs(js.price_egp - card.price_egp) > 0.01 * card.price_egp:
        card.raw["price_conflict"] = [card.price_egp, js.price_egp]
    return card


# ---------------------------------------------------------------- shared crawler

DETAIL_LABELS = {
    "make_raw": ("Brand", "Make", "الماركة", "الماركه"),
    "model_raw": ("Model", "الموديل"),
    "trim_raw": ("Trim", "Version", "Class", "الفئة", "الفئه"),
    "year": ("Year", "Model Year", "سنة الصنع", "السنة", "الموديل سنة"),
    "km": ("Kilometers", "Mileage", "KM", "الكيلومترات", "عداد الكيلومترات"),
    "transmission": ("Transmission", "Transmission Type", "ناقل الحركة"),
    "fuel": ("Fuel Type", "Fuel", "نوع الوقود"),
    "body_type": ("Body Type", "نوع الهيكل"),
    "color": ("Color", "Colour", "اللون"),
}


def km_from_value(v: str) -> int | None:
    """'100,000 - 119,999' / '100000 to 119999' (Dubizzle buckets) -> midpoint; else plain km."""
    nums = [int(x.replace(",", "")) for x in re.findall(r"\d[\d,]*", norm_text(v))]
    if len(nums) >= 2 and re.search(r"(?i)\bto\b|-|–|إلى|الى", v):
        return (nums[0] + nums[1]) // 2
    return parse_km(v)


def parse_detail_labels(text: str, lst: Listing) -> Listing:
    from ..common import label_value
    text = norm_text(text)
    for field, labels in DETAIL_LABELS.items():
        if getattr(lst, field) not in (None, ""):
            continue
        for lab in labels:
            v = label_value(text, lab)
            if not v:
                continue
            if field == "year":
                v = first_year(v)
            elif field == "km":
                lst.raw["km_raw"] = v
                v = km_from_value(v)
            elif field == "transmission":
                v = norm_transmission(v)
            if v:
                setattr(lst, field, v)
                break
    m = re.search(r"(?s)\n(?:Description|الوصف)\s*\n(.{10,4000}?)\n\s*(?:Location|Show more|Report|الموقع|عرض المزيد|Related|Similar)", text)
    if m:
        lst.description = m.group(1).strip()
    return lst


def crawl(f, source: str, page_url: str, ad_re: str, id_re: str, max_pages: int,
          known_ids: set | None = None, fetch_detail: bool = True):
    """page_url has '{page}'. Newest-first lists; stops when a page brings no unseen ads."""
    known_ids = known_ids or set()
    seen: set[str] = set()
    for page in range(1, max_pages + 1):
        html, _, _ = f.get(page_url.format(page=page), scroll=True)
        rows = [r for r in f.cards(ad_re) if r["href"] not in seen]
        if not rows:
            print(f"[{source}] page {page}: no new ads; stop")
            return
        by_id = {}
        for js in listings_from_json(html, source, lambda d, sid: ""):
            by_id[js.source_id] = js
        for r in rows:
            seen.add(r["href"])
            m = re.search(id_re, r["href"])
            if not m:
                continue
            sid = m.group(1)
            lst = parse_generic_card(r["text"], r["href"].split("?")[0], source, sid)
            if not lst:
                continue
            lst = merge(lst, by_id.get(sid))
            if fetch_detail and sid not in known_ids:
                try:
                    _, t, _ = f.get(lst.url)
                    parse_detail_labels(t, lst)
                except RuntimeError as e:
                    if f.blocked:
                        raise
                    print(f"[{source}] detail failed {lst.url}: {e}")
            yield lst
