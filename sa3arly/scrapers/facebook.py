"""Facebook Marketplace — best effort, OFF by default.

No API exists and Meta's terms forbid automated collection; no login is ever used here.
Only what a logged-out visitor sees is read, a few pages, slowly. If Facebook shows a login
wall or blocks, the run stops quietly and the rest of Sa3arly keeps working without it.
"""
from __future__ import annotations

from .generic import crawl

SOURCE = "facebook"
AD_RE = r"facebook\.com/marketplace/item/\d+"
ID_RE = r"/item/(\d+)"
CITIES = ("cairo", "alexandria", "giza")


def scrape_used(f, max_pages: int = 3, known_ids=None):
    for city in CITIES:
        url = f"https://www.facebook.com/marketplace/{city}/vehicles?sortBy=creation_time_descend&exact=false#{{page}}"
        try:
            # Marketplace is one infinite page: 'page' only re-scrolls; crawl stops when nothing new loads.
            yield from crawl(f, SOURCE, url, AD_RE, ID_RE, max_pages, known_ids, fetch_detail=False)
        except RuntimeError as e:
            print(f"[facebook] stopped for {city}: {e}")
            return
