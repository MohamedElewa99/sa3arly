"""ContactCars — new-car prices (cross-check for Hatla2ee) and used listings."""
from __future__ import annotations

import re
from typing import Iterator

from ..common import Fetcher, ZeroPrice, first_year, norm_text, today
from .generic import crawl

BASE = "https://www.contactcars.com"
SOURCE = "contactcars"
# Listing pages (city/, price-range/, attribute-, financed) are excluded; an ad URL ends in a numeric id.
AD_RE = r"contactcars\.com/en/used-cars?/(?!city/|price-range/|attribute|financed|showrooms)[^?#]*?\d{4,}/?$"
ID_RE = r"(\d{4,})/?$"

_ROW = re.compile(r"(?P<name>[A-Z][^\n\t|]{2,80}?\b(?:19|20)\d{2}\b[^\n\t|]{0,60}?)[ \t|]*\n?[ \t|]*(?P<price>[\d,]{6,})\s*EGP")


def parse_new_car_page(text: str, url: str) -> list[ZeroPrice]:
    out, seen = [], set()
    for m in _ROW.finditer(norm_text(text)):
        name = m.group("name").strip(" |")
        price = int(m.group("price").replace(",", ""))
        if name in seen or not 50_000 <= price <= 200_000_000:
            continue
        seen.add(name)
        out.append(ZeroPrice(source=SOURCE, make_raw=name.split()[0], full_name=name,
                             model_year=first_year(name), price_egp=price,
                             effective_on=today(), source_url=url))
    return out


def scrape_zero(f: Fetcher) -> Iterator[ZeroPrice]:
    _, _, links = f.get(f"{BASE}/en/new-cars")
    model_pages = sorted({l.split("?")[0] for l in links
                          if re.search(r"contactcars\.com/en/new-cars/[a-z0-9]+-[a-z0-9_\-]+/?$", l)})
    for url in model_pages:
        try:
            _, text, _ = f.get(url)
        except RuntimeError as e:
            if f.blocked:
                raise
            print(f"[contactcars] skip {url}: {e}")
            continue
        yield from parse_new_car_page(text, url)


def scrape_used(f: Fetcher, max_pages: int = 300, known_ids=None):
    yield from crawl(f, SOURCE, BASE + "/en/used-cars?page={page}", AD_RE, ID_RE, max_pages, known_ids)
