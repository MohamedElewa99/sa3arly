"""Dubizzle Egypt — the largest used-car pool. Ad URLs end in '-ID<number>.html'.

Dubizzle prints mileage as a bucket ('100,000 to 119,999'); we store the midpoint and keep
the raw bucket in raw['km_raw'] so the pricing engine can weight it lower than an exact km.
"""
from __future__ import annotations

from .generic import crawl

BASE = "https://www.dubizzle.com.eg"
SOURCE = "dubizzle"
AD_RE = r"dubizzle\.com\.eg/(?:en/)?ad/[^?#]*-ID\d+\.html"
ID_RE = r"-ID(\d+)\.html"


def scrape_used(f, max_pages: int = 300, known_ids=None):
    yield from crawl(f, SOURCE, BASE + "/en/vehicles/cars-for-sale/?page={page}", AD_RE, ID_RE,
                     max_pages, known_ids)
