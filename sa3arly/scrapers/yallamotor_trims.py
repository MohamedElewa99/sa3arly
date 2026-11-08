"""YallaMotor Egypt — every version (trim) of every model year with its official price when it was sold new.

The pages /new-cars/<make>/<model>/<year> list each version and its price, back many years, so even a model
that is no longer sold (and has no ads today) gets its real trims, in their real order (by price).
"""
from __future__ import annotations

import re
from typing import Iterator, NamedTuple, Optional

from ..common import Fetcher

BASE = "https://egypt.yallamotor.com"
SOURCE = "yallamotor"
_NOT = {"prices", "search", "compare", "reviews", "news", "dealers", "offers", "electric", "body", "price", "brands",
        "best", "upcoming", "latest", "used-cars", "new-cars", "specs", "photos", "videos", "ar", "en"}


class TrimPrice(NamedTuple):
    make_raw: str
    model_raw: str
    model_year: int
    trim: str
    price_egp: int
    source_url: str


def _path(url: str) -> list[str]:
    u = url.split("#")[0].split("?")[0]
    m = re.match(r"https://egypt\.yallamotor\.com/new-cars/(.*)$", u)
    return [p for p in (m.group(1).split("/") if m else []) if p]


def make_links(links: list[str]) -> list[str]:
    return sorted({p[0] for p in map(_path, links) if len(p) == 1 and p[0] not in _NOT and not p[0].isdigit()})


def model_links(links: list[str], make: str) -> list[str]:
    return sorted({p[1] for p in map(_path, links)
                   if len(p) == 2 and p[0] == make and p[1] not in _NOT and not re.fullmatch(r"\d{4}", p[1])})


def year_links(links: list[str], make: str, model: str) -> list[int]:
    return sorted({int(p[2]) for p in map(_path, links)
                   if len(p) == 3 and p[0] == make and p[1] == model and re.fullmatch(r"(19|20)\d{2}", p[2])}, reverse=True)


_PRICE = re.compile(r"^(?:EGP\s*([\d,]{5,})|([\d,]{5,})\s*EGP)$")


def parse_year_page(text: str, make_slug: str, url: str) -> list[TrimPrice]:
    """'Hyundai Verna 2018 1.6 GL M/T (Base)' … 'EGP 159,500' -> one TrimPrice per version that has a price."""
    m = re.search(r"^(.+?) ((?:19|20)\d{2}) in Egypt\s*$", text, re.M)
    if not m:
        return []
    title, year = m.group(1).strip(), int(m.group(2))
    # the make as written in the title: the leading words that spell the make slug ('Mercedes-Benz', 'Alfa Romeo')
    words = title.split()
    n = 1
    for k in (1, 2, 3):
        if re.sub(r"[^a-z0-9]+", "-", " ".join(words[:k]).lower()).strip("-") == make_slug:
            n = k
            break
    make_raw, model_raw = " ".join(words[:n]), " ".join(words[n:])
    if not model_raw:
        return []
    prefix = f"{title} {year} "
    ls = [l.strip() for l in text.split("\n") if l.strip()]
    out, seen = [], set()
    for i, l in enumerate(ls):
        if not l.startswith(prefix) or len(l) > len(prefix) + 80:
            continue
        trim = re.sub(r"\s+", " ", l[len(prefix):]).strip()
        if not trim or trim in seen:
            continue
        for j in range(i + 1, min(i + 6, len(ls))):
            if ls[j].startswith(prefix):
                break
            pm = _PRICE.match(ls[j])
            if pm:
                price = int((pm.group(1) or pm.group(2)).replace(",", ""))
                if 20_000 <= price <= 200_000_000:
                    out.append(TrimPrice(make_raw, model_raw, year, trim, price, url))
                    seen.add(trim)
                break
    return out


def scrape(f: Fetcher, done: Optional[set] = None, max_pages: int = 1500, makes: Optional[list[str]] = None,
           min_year: int = 2005) -> Iterator[TrimPrice]:
    """Walk makes -> models -> model years. done: {(make slug, model slug, year)} already stored, skipped."""
    done = done or set()
    start = f.pages
    _, _, links = f.get(f"{BASE}/new-cars")
    for mk in makes or make_links(links):
        if f.pages - start >= max_pages:
            return
        try:
            _, _, ml = f.get(f"{BASE}/new-cars/{mk}")
        except RuntimeError as e:
            if f.blocked:
                raise
            print(f"[yallamotor] skip make {mk}: {e}")
            continue
        models = model_links(ml, mk)
        print(f"[yallamotor] {mk}: {len(models)} models")
        for mo in models:
            if f.pages - start >= max_pages:
                return
            try:
                _, text, yl = f.get(f"{BASE}/new-cars/{mk}/{mo}")
            except RuntimeError as e:
                if f.blocked:
                    raise
                print(f"[yallamotor] skip model {mk}/{mo}: {e}")
                continue
            yield from parse_year_page(text, mk, f"{BASE}/new-cars/{mk}/{mo}")
            todo, seen_years = list(year_links(yl, mk, mo)), set()
            while todo and f.pages - start < max_pages:
                y = todo.pop(0)
                if y in seen_years or y < min_year:
                    continue
                seen_years.add(y)
                if (mk, mo, y) in done:
                    continue
                url = f"{BASE}/new-cars/{mk}/{mo}/{y}"
                try:
                    _, text, more = f.get(url)
                except RuntimeError as e:
                    if f.blocked:
                        raise
                    print(f"[yallamotor] skip {url}: {e}")
                    continue
                rows = parse_year_page(text, mk, url)
                yield from rows
                if not rows:
                    yield TrimPrice("", "", y, "", 0, url)          # marks the page as read (no prices on it)
                todo.extend(x for x in year_links(more, mk, mo) if x not in seen_years)
