"""Hatla2ee Egypt — zero prices (official price changes + current price lists) and used listings.

Parsers work on the page's visible text, so a CSS redesign does not break them.
Formats seen on the live site (Nov 2026):

  price-change row : 'Opel Mokka A/T / Black Edition 2026  1,390,000 EGP  1,550,000 EGP  + 160,000 EGP  2026-04-15'
                     (some layouts print 'trending_down -225,000 EGP' between the two prices)
  used card        : 'Hyundai Elantra 2022 | 2022 | 80,000 KM | Automatic | Gas | 830,000 | EGP | El Haram, Giza | Hyundai | Elantra | Call'
  ad page          : 'Brand Hyundai  Model Elantra  Condition Used  Color White  Posted On 2026-06-13  Location Giza  <description>  Contact Seller'
"""
from __future__ import annotations

import re
from typing import Iterator, Optional
from urllib.parse import urljoin

from ..common import (
    DATE_RE, MINUS, Fetcher, Listing, ZeroPrice, first_year, label_value, lines,
    norm_text, norm_transmission, parse_km, parse_price, to_int, today,
)

BASE = "https://eg.hatla2ee.com"
SOURCE = "hatla2ee"
# 'Disabled' = customs-exempt car for disabled owners and 'Financed' = sold on instalments:
# both trade at different prices, so the pricing engine excludes them from comparables.
BADGES = ("Premium", "Low KM", "Valid License", "Disabled", "Financed", "Factory Paint", "Personal Use")
_SLIDER = re.compile(r"^(View All \(\d+\)|Next slide|Previous slide|\d+ / \d+|\+\d+|Call|Whatsapp)$")
AD_RE = r"hatla2ee\.com/en/car/[^/?#]+/[^/?#]+/\d{5,}/?$"

# ------------------------------------------------------------------ zero prices

_AMOUNT = r"[+\-−–]?\s*[\d,]{3,}\s*EGP"
_PRICE_CHANGE_RE = re.compile(
    r"(?P<name>[^\n\t]{3,90}?\b(?:19|20)\d{2})"                       # name ends with model year
    r"(?P<body>(?:\s|trending_(?:up|down)|arrow_\w+|[+\-−–]|" + _AMOUNT + r")+?)"
    r"(?P<date>20\d{2}-\d{2}-\d{2})"
)


def _brand_ok(name: str, brand: Optional[str]) -> bool:
    return not brand or name.lower().startswith(brand.lower())


def parse_price_changes(text: str, brand: Optional[str] = None, url: Optional[str] = None) -> list[ZeroPrice]:
    """Rows of a /new-car/price-change/<brand> page -> change events."""
    text = norm_text(text)
    out: list[ZeroPrice] = []
    for m in _PRICE_CHANGE_RE.finditer(text):
        name = m.group("name").strip(" |-")
        # the name must start at a line/cell start; trim header junk before the brand
        if brand and brand.lower() in name.lower():
            name = name[name.lower().rindex(brand.lower()):]
        if not _brand_ok(name, brand) or "EGP" in name:
            continue
        amounts = []
        for a in re.finditer(r"([+\-−–])?\s*([\d,]{3,})\s*EGP", m.group("body")):
            sign = a.group(1)
            val = int(a.group(2).replace(",", ""))
            amounts.append((sign, val))
        signed = [v if s == "+" else -v for s, v in amounts if s]
        plain = [v for s, v in amounts if not s]
        if len(plain) != 2:
            continue
        old, new = plain
        if signed:
            d = signed[0]
            if old + d != new and new + d == old:      # layout printed new before old
                old, new = new, old
            elif old + d != new:
                continue                               # numbers don't add up -> skip, never guess
        year = first_year(name[-4:]) or first_year(name)
        out.append(ZeroPrice(
            source=SOURCE, make_raw=brand or name.split()[0], full_name=name, model_year=year,
            price_egp=new, old_price_egp=old, effective_on=m.group("date"), source_url=url,
        ))
    return out


_CLASS_RE = re.compile(r"^(?P<name>[^\t\n]{3,100}?\b(?P<year>(?:19|20)\d{2})\b[^\t\n]*)$")


def parse_model_page(text: str, brand: Optional[str] = None, url: Optional[str] = None) -> list[ZeroPrice]:
    """A model page (/en/new-car/<brand>/<model>) -> one row per class (trim) and model year.

    Row layout: 'Hyundai Tucson 2025 A/T / SHADOW', ['1600 CC'], official price, [market price],
    min deposit, min instalment, 'Compare'. The deposit is a fixed share of the official price,
    so a row with 4 amounts has a market price and a row with 3 does not.
    """
    text = norm_text(text)
    out = []
    ls = [l.strip() for l in text.split("\n")]
    i = 0
    while i < len(ls):
        m = _CLASS_RE.match(ls[i])
        if not m or (brand and not ls[i].lower().startswith(brand.lower())) or "EGP" in ls[i] \
                or ls[i].startswith(("Used ", "New ")):
            i += 1
            continue
        amounts, j = [], i + 1
        while j < len(ls) and j < i + 30 and ls[j] != "Compare":
            if _CLASS_RE.match(ls[j]) and not re.fullmatch(r"\d+\s*CC", ls[j]):
                break
            if re.fullmatch(r"[\d,]{4,}", ls[j]) and j + 1 < len(ls) and ls[j + 1] == "EGP":
                amounts.append(int(ls[j].replace(",", "")))
            j += 1
        if j < len(ls) and ls[j] == "Compare" and len(amounts) in (3, 4):
            official = amounts[0]
            market = amounts[1] if len(amounts) == 4 else None
            if 50_000 <= official <= 200_000_000:
                out.append(ZeroPrice(
                    source=SOURCE, make_raw=brand or ls[i].split()[0], full_name=ls[i],
                    model_year=int(re.findall(r"\b((?:19|20)\d{2})\b", ls[i])[-1]), price_egp=official, market_price_egp=market,
                    effective_on=today(), source_url=url))
            i = j + 1
        else:
            i += 1
    return out


_SKIP_BRAND = {"body", "compare", "price-change", "price-limit", "page", "price", "electric", "unit"}


def brand_slugs(f: Fetcher) -> list[str]:
    _, _, links = f.get(f"{BASE}/en/new-car")
    out = set()
    for l in links:
        m = re.fullmatch(r"https://eg\.hatla2ee\.com/en/new-car/([A-Za-z0-9\-]+)/?", l.split("?")[0].split("#")[0])
        if m and m.group(1).lower() not in _SKIP_BRAND:
            out.add(m.group(1))
    return sorted(out)


def _brand_name(text: str, slug: str) -> str:
    for pat in (r"^(.+?) Cars Prices in Egypt$", r"Last Changes in (.+?) Prices", r"^(.+?) Prices Egypt"):
        m = re.search(pat, text, re.M)
        if m:
            return m.group(1).strip()
    return slug.replace("-", " ").title()


def scrape_zero(f: Fetcher, brands: Optional[list[str]] = None, max_change_pages: int = 30) -> Iterator[ZeroPrice]:
    """Per brand: every official price change (all pages) + every class on every model page."""
    for slug in brands or brand_slugs(f):
        try:
            _, text, links = f.get(f"{BASE}/en/new-car/{slug}")
        except RuntimeError as e:
            if f.blocked:
                raise
            print(f"[hatla2ee] skip brand {slug}: {e}")
            continue
        brand = _brand_name(text, slug)
        models = sorted({l.split("#")[0].split("?")[0] for l in links
                         if re.fullmatch(rf"https://eg\.hatla2ee\.com/en/new-car/{re.escape(slug)}/[^/]+/?",
                                         l.split("#")[0].split("?")[0], re.I)})
        for url in models:
            try:
                _, t, _ = f.get(url)
            except RuntimeError as e:
                if f.blocked:
                    raise
                print(f"[hatla2ee] skip model {url}: {e}")
                continue
            rows = parse_model_page(t, brand, url)
            if not rows:
                if "Price Not Available" in t or "No data available" in t:
                    print(f"[hatla2ee] no official price on site (discontinued / not sold new): {url}")
                else:
                    print(f"[hatla2ee] CHECK: classes not parsed on {url}")   # a real parser miss
            yield from rows
        seen_rows = set()
        for page in range(1, max_change_pages + 1):
            url = f"{BASE}/en/new-car/price-change/{slug}" + ("" if page == 1 else f"/page/{page}")
            try:
                _, t, _ = f.get(url)
            except RuntimeError as e:
                if f.blocked:
                    raise
                break
            rows = [r for r in parse_price_changes(t, _brand_name(t, slug) or brand, url)
                    if (r.full_name, r.effective_on, r.price_egp) not in seen_rows]
            if not rows:
                break
            for r in rows:
                seen_rows.add((r.full_name, r.effective_on, r.price_egp))
                yield r


# ------------------------------------------------------------------ every model of every brand

_NOT_MODEL = {"year", "body", "city", "info", "fuel", "transmission", "color", "page", "price", "km", "new", "used",
              "search", "compare", "showrooms", "maintenance", "automatic", "manual", "diesel", "gas", "natural-gas",
              "natural gas", "electric", "hybrid", "plug-in-hybrid", "plug in hybrid", "taxi", "classic", "disabled",
              "kasr-zero", "kasr zero", "all-prices", "all prices"}


def used_brand_slugs(f: Fetcher) -> list[str]:
    _, _, links = f.get(f"{BASE}/en/car")
    out = set()
    for l in links:
        m = re.fullmatch(r"https://eg\.hatla2ee\.com/en/car/([A-Za-z0-9\-]+)/?", l.split("?")[0].split("#")[0])
        if m and m.group(1).lower() not in _NOT_MODEL and m.group(1).lower() not in _SKIP_BRAND:
            out.add(m.group(1))
    return sorted(out)


def parse_brand_models(text: str, links: list[str], slug: str) -> tuple[str, list[str]]:
    """A used-cars brand page (/en/car/<brand>) -> (brand name, every model it lists, old ones included)."""
    from urllib.parse import unquote
    m = re.search(r"^Used (.+?) (?:cars )?for sale in Egypt", text, re.M | re.I)
    brand = re.sub(r"\s+cars$", "", (m.group(1) if m else _brand_name(text, slug)).strip(), flags=re.I)
    models = []
    for l in links:
        u = l.split("#")[0].split("?")[0].rstrip("/")
        mm = re.fullmatch(rf"https://eg\.hatla2ee\.com/en/car/{re.escape(slug)}/([^/]+)", u, re.I)
        if not mm:
            continue
        name = unquote(mm.group(1)).replace("+", " ").strip()
        if name.lower() in _NOT_MODEL or name.lower().startswith("other") or name in models:
            continue
        models.append(name)
    return brand, models


def scrape_models(f: Fetcher) -> Iterator[tuple[str, str]]:
    """(brand, model) for every model Hatla2ee knows, new or discontinued."""
    slugs = sorted(set(used_brand_slugs(f)) | set(brand_slugs(f)))
    print(f"[hatla2ee] {len(slugs)} brands")
    for slug in slugs:
        try:
            _, text, links = f.get(f"{BASE}/en/car/{slug}")
        except RuntimeError as e:
            if f.blocked:
                raise
            print(f"[hatla2ee] skip brand {slug}: {e}")
            continue
        brand, models = parse_brand_models(text, links, slug)
        print(f"[hatla2ee] {brand}: {len(models)} models")
        for m in models:
            yield brand, m


# ------------------------------------------------------------------ used listings


def parse_card(text: str, href: str) -> Optional[Listing]:
    """A listing card's text -> Listing (no description yet).

    Live layout (Nov 2026): [slider junk] [badges] title, year, 'N KM', transmission, fuel,
    'price EGP' [instalment 'N', 'EGP', '/mo'], city, make, model, [trim], [badges], Call.
    """
    raw_lines = lines(text)
    m = re.search(r"/en/car/([^/]+)/([^/]+)/(\d+)", href)
    if not m or not raw_lines:
        return None
    ls = []
    for l in raw_lines:                         # '1,370,000 EGP' -> '1,370,000', 'EGP'
        pm = re.fullmatch(r"([\d,]{4,})\s*EGP", l)
        ls.extend([pm.group(1), "EGP"] if pm else [l])
    lst = Listing(source=SOURCE, source_id=m.group(3), url=href)
    badges = [l for l in raw_lines if l in BADGES]
    ti = next((i for i, l in enumerate(ls) if re.search(r"[A-Za-z].*\b(19|20)\d{2}$", l) and "KM" not in l), None)
    if ti is not None:
        lst.title = ls[ti]
        lst.year = first_year(ls[ti][-4:])
    body = ls[ti + 1:] if ti is not None else ls
    for i, l in enumerate(body):
        if lst.km is None and re.fullmatch(r"[\d,]+\s*KM", l, re.I):
            lst.km = parse_km(l)
        elif lst.transmission is None and len(l) < 20 and norm_transmission(l):
            lst.transmission = norm_transmission(l)
        elif lst.fuel is None and l.lower() in {"gas", "diesel", "electric", "hybrid", "natural gas", "benzine"}:
            lst.fuel = l.lower()
        elif l == "EGP" and i > 0 and lst.price_egp is None:
            lst.price_egp = to_int(body[i - 1])
            tail = body[i + 1:]
            # monthly instalment printed after the price: '10,000', 'EGP', '/mo'
            if len(tail) >= 3 and re.fullmatch(r"[\d,]+", tail[0]) and tail[1] == "EGP" and tail[2].startswith("/"):
                lst.raw["installment_egp"] = to_int(tail[0])
                tail = tail[3:]
            tail = [t for t in tail if not _SLIDER.match(t)]
            if tail:
                lst.city = tail[0]
            if len(tail) >= 3:
                lst.make_raw, lst.model_raw = tail[1], tail[2]
            for t in tail[3:]:
                if t in BADGES:
                    continue
                if "/" in t and lst.trim_raw is None:      # 'A/T / Shadow', 'GL / AD / AT'
                    lst.trim_raw = t
            break
    lst.make_raw = lst.make_raw or m.group(1).replace("-", " ").title()
    lst.model_raw = lst.model_raw or m.group(2).replace("-", " ")
    if lst.city:
        lst.governorate = lst.city.split(",")[-1].strip()
    if badges:
        lst.raw["badges"] = badges
    return lst if lst.price_egp else None


def parse_ad_page(text: str, lst: Listing) -> Listing:
    """Fill description, color, posted date and Hatla2ee's own min/max market price."""
    text = norm_text(text)
    body = text.split("Car Details", 1)[-1] if "Car Details" in text else text
    lst.color = label_value(body, "Color") or lst.color
    posted = label_value(body, "Posted On")
    if posted and DATE_RE.search(posted):
        lst.posted_on = DATE_RE.search(posted).group(1)
    loc = label_value(body, "Location")
    if loc:
        lst.city = lst.city or loc
        m = re.search(rf"Location\s*\n\s*{re.escape(loc)}\s*\n(.*?)\n\s*(?:Contact Seller|Report this Ad)", body, re.S)
        if m:
            lst.description = m.group(1).strip()[:4000] or None
    lst.trim_raw = label_value(body, "Class") or label_value(body, "Trim") or lst.trim_raw
    mn = re.search(r"Minimum Price\s*\n?\s*([\d,]+)\s*\n?\s*EGP", text)
    mx = re.search(r"Maximum Price\s*\n?\s*([\d,]+)\s*\n?\s*EGP", text)
    if mn and mx:
        lst.raw["hatla2ee_market_min"] = to_int(mn.group(1))
        lst.raw["hatla2ee_market_max"] = to_int(mx.group(1))
    photos = re.search(r"Show All (\d+) Photos", text)
    if photos:
        lst.photo_count = int(photos.group(1))
    return lst


def scrape_used(f: Fetcher, max_pages: int = 800, known_ids: Optional[set] = None,
                detail_for_new: bool = True, max_details: int = 300,
                have_ids: Optional[set] = None, min_pages: int = 40, quiet_pages: int = 6) -> Iterator[Listing]:
    """Walk /en/car, /en/car/page/2 ... (newest first) until a page brings no unseen ad.

    Ad pages (description, colour, posted date) are opened only for ads not yet in the
    database, at most `max_details` per run: the first ~20k-ad backlog fills over a few days
    while every run still refreshes all prices from the list pages.

    The daily run passes `have_ids` (every ad id already stored): the walk then goes as deep as the new ads go,
    and stops after `quiet_pages` pages in a row that bring nothing new (never before `min_pages`), so a busy
    day is read to its end without sweeping the whole site every night.
    """
    known_ids = known_ids or set()
    seen: set[str] = set()
    details = 0
    quiet = 0
    for page in range(1, max_pages + 1):
        url = f"{BASE}/en/car" if page == 1 else f"{BASE}/en/car/page/{page}"
        f.get(url, scroll=True)
        rows = [r for r in f.cards(AD_RE) if r["href"] not in seen]
        if not rows:
            print(f"[hatla2ee] no new ads on page {page}; stop")
            return
        fresh = 0
        for r in rows:
            seen.add(r["href"])
            lst = parse_card(r["text"], r["href"])
            if not lst:
                continue
            if have_ids is not None and lst.source_id not in have_ids:
                fresh += 1
            if f.overloaded and detail_for_new:
                print("[hatla2ee] site is slow — no more ad pages this run, list pages only")
                detail_for_new = False
            if detail_for_new and lst.source_id not in known_ids and details < max_details:
                details += 1
                try:
                    _, t, _ = f.get(lst.url, settle_ms=2500)
                    parse_ad_page(t, lst)
                except RuntimeError as e:
                    if f.blocked:
                        raise
                    print(f"[hatla2ee] ad page failed {lst.url}: {e}")
            yield lst
        if have_ids is not None:
            quiet = 0 if fresh else quiet + 1
            if page >= min_pages and quiet >= quiet_pages:
                print(f"[hatla2ee] {quiet} pages in a row with nothing new (page {page}); every new ad is in, stop")
                return
    if have_ids is not None:
        print(f"[hatla2ee] reached --max-pages {max_pages} while pages still had new ads: raise it")
