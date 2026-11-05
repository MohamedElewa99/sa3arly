"""Import pages saved by the Sa3arly capture button (sa3arly-<site>-<time>.json in Downloads).

Every card becomes a Listing; the same ad captured twice updates one row (source + ad id).
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlparse

from ..common import Listing, first_year
from ..scrapers.generic import parse_generic_card

# site -> regex for the ad id inside the ad URL
ID_RULES = {
    "dubizzle": r"-ID(\d+)\.html",
    "contactcars": r"(\d{4,})(?:[/?#]|$)",
    "facebook": r"/marketplace/item/(\d+)",
    "hatla2ee": r"/(\d{5,})(?:[/?#]|$)",
    "opensooq": r"/search/(\d{6,})",
    "yallamotor": r"-(\d{5,})(?:[/?#]|$)",
}
MAKES = ("Alfa Romeo", "Audi", "BAIC", "BMW", "BYD", "Chery", "Chevrolet", "Citroen", "Cupra", "DFSK", "Fiat",
         "Ford", "Geely", "Haval", "Honda", "Hyundai", "Jeep", "Jetour", "Kia", "Lada", "Land Rover", "Mazda",
         "Mercedes", "MG", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Proton", "Renault",
         "Seat", "Skoda", "Subaru", "Suzuki", "Toyota", "Volkswagen", "Volvo", "Daewoo", "Changan", "Exeed")


# URL shapes that identify a site even when the host is unusual (mirrors, app domains)
SHAPES = {"dubizzle": r"-ID\d+\.html", "facebook": r"/marketplace/item/\d+", "opensooq": r"/search/\d{6,}"}


def site_of(url: str) -> str:
    host = urlparse(url).hostname or ""
    for s in ID_RULES:
        if s in host:
            return s
    for s, rx in SHAPES.items():
        if re.search(rx, url):
            return s
    return "unknown"


def ad_id(site: str, href: str) -> str:
    path = urlparse(href).path
    m = re.search(ID_RULES[site], path) if site in ID_RULES else re.search(r"(\d{5,})", path)
    return m.group(1) if m else hashlib.sha1(href.encode()).hexdigest()[:16]


def card_to_listing(card: dict, page_url: str, captured_at: str) -> Listing | None:
    href = card["href"].split("#")[0]
    site = site_of(href) if site_of(href) != "unknown" else site_of(page_url)
    if site == "unknown":
        site = (urlparse(page_url).hostname or "manual").replace("www.", "").split(".")[0]
    l = parse_generic_card(card["text"], href.split("?")[0], site, ad_id(site, href))
    if not l:
        return None
    title = l.title or ""
    for mk in sorted(MAKES, key=len, reverse=True):
        m = re.search(rf"(?i)\b{re.escape(mk)}\b\s+([A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+)?)", card["text"])
        if m:
            l.make_raw = mk
            model = re.sub(r"\b(19|20)\d{2}\b", "", m.group(1)).strip()
            l.model_raw = model or None
            break
    l.year = l.year or first_year(title)
    # place = first line after the km/transmission lines that is not a time-ago or a button
    ls = [x.strip() for x in card["text"].split("\n") if x.strip()]
    anchor = max([i for i, x in enumerate(ls) if re.search(r"(?i)\bkm\b|كم|automatic|manual|اوتوماتيك|مانيوال", x)],
                 default=None)
    if anchor is not None:
        for x in ls[anchor + 1:]:
            if re.search(r"(?i)\b(ago|منذ|call|chat|seller|whatsapp)\b", x) or re.fullmatch(r"[\d,.\s]+", x):
                continue
            if len(x) <= 60:
                l.city = x
                l.governorate = x.split(",")[-1].strip()
            break
    l.raw.update({"captured_manually": True, "captured_at": captured_at, "page_url": page_url,
                  "card_text": card["text"][:1500]})
    return l


def import_folder(store, folder: str | Path, pattern: str = "sa3arly-*.json", move_done: bool = True) -> dict:
    folder = Path(folder).expanduser()
    stats = {"files": 0, "cards": 0, "saved": 0, "skipped": 0}
    done = folder / "sa3arly-imported"
    for p in sorted(folder.glob(pattern)):
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        if data.get("tool") != "sa3arly-capture":
            continue
        stats["files"] += 1
        seen = set()
        for c in data.get("cards", []):
            stats["cards"] += 1
            l = card_to_listing(c, data.get("url", ""), data.get("captured_at", ""))
            if not l or (l.source, l.source_id) in seen:
                stats["skipped"] += 1
                continue
            seen.add((l.source, l.source_id))
            store.listing(l)
            stats["saved"] += 1
        if move_done:
            done.mkdir(exist_ok=True)
            p.replace(done / p.name)
    return stats
