"""YallaMotor Egypt, OpenSooq Egypt and Sylndr — open sites checked live on 5 Nov 2026.

Only pages that answer a polite reader are used: YallaMotor's make/model pages answer 403,
so only its /used-cars/search pages are read. robots.txt of all three allows these paths.
Card text layouts (live):
  YallaMotor : [photo count] 'Used Lada Granta Sedan 1.6L 8V - Manual 2022' '567,890' 'EGP' [match tag]
               <seller text> 'Year' '2022' 'Mileage' '3,000 KM' 'Fuel type' 'Petrol' 'Transmission' 'Manual'
               'Regional specs' 'European Specs' <city> [tags…] 'Show Number' …
  OpenSooq   : [photo count] ['Verified User'] '320,000 EGP' <title> '2015' Make Model [Trim] 'Used'
               '2,250 km' Fuel Specs <city> …
  Sylndr     : ['New Price'|'Newly Added'] 'Chery Tiggo 7' '2023' '•' '1st Category' '•' '93K KM'
               '860,000' 'EGP' '17,443' '/' 'month'   (fixed asking price of an inspected car)
"""
from __future__ import annotations

import re
from typing import Iterator, Optional

from ..common import Fetcher, Listing, lines, norm_transmission, parse_km, to_int

_NUM = re.compile(r"[\d,]{4,}")


def _after(ls: list[str], label: str) -> Optional[str]:
    try:
        return ls[ls.index(label) + 1]
    except (ValueError, IndexError):
        return None


# ------------------------------------------------------------------ YallaMotor

YALLA_AD = r"egypt\.yallamotor\.com/used-cars/[^/]+/[^/]+/\d{4}/used-[^?#]*-\d{5,}"
YALLA_TAGS = ("No Accident History", "Perfect Inside And Out", "Low Mileage", "Urgent", "Under Warranty",
              "Full Service History", "First Owner")


def parse_yalla_card(text: str, href: str) -> Optional[Listing]:
    m = re.search(r"/used-cars/([^/]+)/([^/]+)/(\d{4})/[^?#]*-(\d{5,})", href)
    if not m:
        return None
    ls = lines(text)
    l = Listing(source="yallamotor", source_id=m.group(4), url=href.split("?")[0],
                make_raw=m.group(1).replace("-", " ").title(), model_raw=m.group(2).replace("-", " "),
                year=int(m.group(3)))
    for i, x in enumerate(ls):
        if x == "EGP" and i and _NUM.fullmatch(ls[i - 1]) and l.price_egp is None:
            l.price_egp = to_int(ls[i - 1])
            l.title = next((t for t in reversed(ls[:i - 1]) if re.search(r"[A-Za-z]{3}", t)), None)
    l.year = to_int(_after(ls, "Year")) or l.year
    l.km = parse_km(_after(ls, "Mileage"))
    l.transmission = norm_transmission(_after(ls, "Transmission"))
    l.fuel = (_after(ls, "Fuel type") or "").lower() or None
    spec = _after(ls, "Regional specs")
    if spec:
        l.raw["specs"] = spec
        city = _after(ls, spec)
        if city and city not in YALLA_TAGS and city != "Show Number":
            l.city = l.governorate = city
    # seller's own line between the price block and 'Year' (e.g. 'رينو فلوانس 2016 فابريكه بالكامل')
    if "Year" in ls and "EGP" in ls:
        mid = [t for t in ls[ls.index("EGP") + 1:ls.index("Year")] if t not in ("Exact match",)]
        if mid:
            l.description = " ".join(mid)[:1000]
    tags = [t for t in ls if t in YALLA_TAGS]
    if tags:
        l.raw["badges"] = tags
    if l.title:
        tm = re.search(r"\b(\d\.\d)L\b\s*(.*?)\s*(?:\d{4})?$", l.title)
        if tm:
            l.trim_raw = f"{tm.group(1)}L {tm.group(2)}".strip()
    return l if l.price_egp and l.price_egp >= 20_000 else None


# ------------------------------------------------------------------ OpenSooq

SOOQ_AD = r"eg\.opensooq\.com/en/search/\d{6,}"
_FUELS = {"gasoline", "diesel", "electric", "hybrid", "natural gas", "plug-in hybrid", "benzine"}


def parse_sooq_card(text: str, href: str) -> Optional[Listing]:
    m = re.search(r"/search/(\d{6,})", href)
    if not m:
        return None
    ls = [x for x in lines(text) if x not in ("Verified User", "Compare", "Chat", "Featured", "Premium")]
    l = Listing(source="opensooq", source_id=m.group(1), url=href.split("?")[0])
    pi = next((i for i, x in enumerate(ls) if re.fullmatch(r"[\d,]{4,}\s*EGP", x)), None)
    if pi is None:
        return None
    l.price_egp = to_int(ls[pi])
    rest = ls[pi + 1:]
    if rest:
        l.title = rest[0]
    yi = next((i for i, x in enumerate(rest) if re.fullmatch(r"(19|20)\d{2}", x)), None)
    if yi is not None:
        l.year = int(rest[yi])
        ci = next((i for i, x in enumerate(rest) if x in ("Used", "New")), None)
        if ci is not None:
            spec = rest[yi + 1:ci]                       # Make, Model, [Trim…]
            if spec:
                l.make_raw = spec[0]
            if len(spec) > 1:
                l.model_raw = spec[1]
            if len(spec) > 2:
                l.trim_raw = " ".join(spec[2:])
            l.raw["condition"] = rest[ci]
            tail = rest[ci + 1:]
            for j, x in enumerate(tail):
                if l.km is None and re.fullmatch(r"[\d,]+\s*km", x, re.I):
                    l.km = parse_km(x)
                elif l.fuel is None and x.lower() in _FUELS:
                    l.fuel = x.lower()
                elif x.endswith("Specs"):
                    l.raw["specs"] = x
                    if j + 1 < len(tail):
                        l.city = tail[j + 1]
                        l.governorate = l.city.split(",")[-1].strip()
                    break
    if l.title and re.search(r"[؀-ۿ]", l.title):
        l.description = l.title
    if l.raw.get("condition") == "New":
        return None                                       # zero-km dealer stock is not a used comparable
    return l if l.price_egp >= 20_000 else None


# ------------------------------------------------------------------ Sylndr

SYLNDR_AD = r"sylndr\.com/en/car-details/used-cars/[^/]+/[^/]+/[0-9a-f\-]{20,}"


def parse_sylndr_card(text: str, href: str) -> Optional[Listing]:
    m = re.search(r"/used-cars/([^/]+)/([^/]+)/([0-9a-f\-]{20,})", href)
    if not m:
        return None
    ls = [x for x in lines(text) if x != "•"]
    l = Listing(source="sylndr", source_id=m.group(3), url=href.split("?")[0],
                make_raw=m.group(1).replace("-", " ").title())
    yi = next((i for i, x in enumerate(ls) if re.fullmatch(r"(19|20)\d{2}", x)), None)
    if yi is None:
        return None
    l.year = int(ls[yi])
    l.title = ls[yi - 1] if yi else None
    if l.title and l.title.lower().startswith(l.make_raw.lower()):
        l.model_raw = l.title[len(l.make_raw):].strip()
    else:
        l.model_raw = m.group(2).replace("-", " ")
    for i, x in enumerate(ls[yi + 1:], start=yi + 1):
        if l.km is None and re.fullmatch(r"[\d.,]+\s*K?\s*KM", x, re.I):
            l.km = parse_km(x.replace("KM", "km"))
        elif l.trim_raw is None and re.search(r"(?i)category|luxury|amg|line|highline|style", x):
            l.trim_raw = x
        elif x == "EGP" and l.price_egp is None:
            l.price_egp = to_int(ls[i - 1])
            if i + 1 < len(ls) and ls[i + 1].replace(",", "").isdigit():
                l.raw["installment_egp"] = to_int(ls[i + 1])
    status = [x for x in ls[:yi] if x in ("New Price", "Newly Added", "Being Sold", "Reserved")]
    if status:
        l.raw["badges"] = status
    l.seller_type = "dealer"
    l.raw["fixed_price_inspected"] = True
    return l if l.price_egp and l.price_egp >= 20_000 else None


# ------------------------------------------------------------------ crawler

SITES = {
    "yallamotor": ("https://egypt.yallamotor.com/used-cars/search?page={page}", YALLA_AD, parse_yalla_card),
    "opensooq": ("https://eg.opensooq.com/en/cars/cars-for-sale?page={page}", SOOQ_AD, parse_sooq_card),
    "sylndr": ("https://sylndr.com/en/buy-cars/egypt/used-cars?page={page}", SYLNDR_AD, parse_sylndr_card),
}


def scrape_used(f: Fetcher, source: str, max_pages: int = 250, **_) -> Iterator[Listing]:
    page_url, ad_re, parse = SITES[source]
    seen: set[str] = set()
    for page in range(1, max_pages + 1):
        f.get(page_url.format(page=page), scroll=True)
        if source == "sylndr":
            # Sylndr's list ignores ?page= and grows as you scroll: load it all on the first page
            print(f"[sylndr] {f.load_more(ad_re)} ads on the page after loading more")
        if source == "opensooq":
            f.reveal(ad_re)                  # OpenSooq renders card text only when it is on screen
        rows = [r for r in f.cards(ad_re) if r["href"].split("?")[0] not in seen]
        if not rows:
            print(f"[{source}] page {page}: no new ads; stop")
            return
        for r in rows:
            seen.add(r["href"].split("?")[0])
            l = parse(r["text"], r["href"])
            if l:
                yield l
