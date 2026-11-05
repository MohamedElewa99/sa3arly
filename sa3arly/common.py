"""Shared types, text parsing helpers and the polite browser fetcher."""
from __future__ import annotations

import hashlib
import json
import random
import re
import time
from dataclasses import asdict, dataclass, field
from datetime import date
from typing import Iterator, Optional

# ---------------------------------------------------------------- data types


@dataclass
class Listing:
    source: str
    source_id: str
    url: str
    make_raw: Optional[str] = None
    model_raw: Optional[str] = None
    trim_raw: Optional[str] = None
    title: Optional[str] = None
    year: Optional[int] = None
    km: Optional[int] = None
    transmission: Optional[str] = None
    fuel: Optional[str] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    city: Optional[str] = None
    governorate: Optional[str] = None
    price_egp: Optional[int] = None
    seller_type: Optional[str] = None
    description: Optional[str] = None
    photo_count: Optional[int] = None
    posted_on: Optional[str] = None  # ISO date
    raw: dict = field(default_factory=dict)

    def dict(self) -> dict:
        return asdict(self)


@dataclass
class ZeroPrice:
    source: str
    make_raw: str
    full_name: str          # 'Opel Mokka A/T / Black Edition 2026'
    model_year: int
    price_egp: int
    effective_on: str       # ISO date
    old_price_egp: Optional[int] = None  # set when the row is a change event
    market_price_egp: Optional[int] = None  # Hatla2ee "Market Price" (over/under official)
    source_url: Optional[str] = None

    def dict(self) -> dict:
        return asdict(self)


# ---------------------------------------------------------------- text helpers

_AR_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")
MINUS = "-−–"


def norm_text(s: str) -> str:
    """Arabic digits -> ASCII, nbsp -> space, collapse spaces (keeps newlines)."""
    s = (s or "").translate(_AR_DIGITS).replace(" ", " ").replace("٬", ",")
    s = re.sub(r"[ \t\r\f\v]+", lambda m: "\t" if "\t" in m.group() else " ", s)
    return s


def to_int(s: str | None) -> Optional[int]:
    if s is None:
        return None
    s = norm_text(str(s))
    m = re.search(r"\d[\d,\.]*", s)
    if not m:
        return None
    digits = re.sub(r"[^\d]", "", m.group())
    return int(digits) if digits else None


def parse_km(s: str | None) -> Optional[int]:
    """'80,000 KM' / '80 ألف كم' / '80K' -> int km."""
    if not s:
        return None
    s = norm_text(s).lower()
    n = to_int(s)
    if n is None:
        return None
    if re.search(r"\d\s*(k\b|ألف|الف)", s):
        n *= 1000
    return n


def parse_price(s: str | None) -> Optional[int]:
    """'1,300,000 EGP' / '1.3 مليون' / '850 ألف' -> int EGP."""
    if not s:
        return None
    t = norm_text(s).lower()
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*(مليون|million|m\b)", t)
    if m:
        return int(round(float(m.group(1).replace(",", ".")) * 1_000_000))
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*(ألف|الف|k\b)", t)
    if m:
        return int(round(float(m.group(1).replace(",", ".")) * 1_000))
    return to_int(t)


def norm_transmission(s: str | None) -> Optional[str]:
    if not s:
        return None
    t = s.lower()
    if any(k in t for k in ("auto", "اوتوماتيك", "أوتوماتيك", "a/t", "cvt", "dct")):
        return "automatic"
    if any(k in t for k in ("manual", "مانيوال", "عادي", "m/t")):
        return "manual"
    return None


def slugify(s: str) -> str:
    s = norm_text(s).strip().lower()
    s = re.sub(r"[^\w؀-ۿ]+", "-", s)
    return s.strip("-")


def dedupe_key(make: str | None, model: str | None, year: int | None, km: int | None, price: int | None) -> Optional[str]:
    """Same car posted on two sites: same make/model/year, km within 1,000, price within 2%."""
    if not (make and model and year):
        return None
    km_b = (km or 0) // 1000
    pr_b = round((price or 0) / 20_000)
    base = f"{slugify(make)}|{slugify(model)}|{year}|{km_b}|{pr_b}"
    return hashlib.sha1(base.encode()).hexdigest()[:16]


YEAR_RE = re.compile(r"\b(19[89]\d|20[0-3]\d)\b")
DATE_RE = re.compile(r"\b(20\d{2}-\d{2}-\d{2})\b")


def first_year(s: str | None) -> Optional[int]:
    m = YEAR_RE.search(s or "")
    return int(m.group(1)) if m else None


def label_value(text: str, label: str) -> Optional[str]:
    """Value printed right after a label, on the same line (tab/colon) or the next line."""
    m = re.search(rf"(?mi)^\s*{re.escape(label)}\s*[:\t]?\s*\n?\s*([^\n\t]+)", text)
    if not m:
        return None
    v = m.group(1).strip()
    return v or None


def lines(text: str) -> list[str]:
    return [l.strip() for l in re.split(r"[\n\t]", text) if l.strip()]


def today() -> str:
    return date.today().isoformat()


def walk_json(obj, depth: int = 0) -> Iterator[dict]:
    """Yield every dict inside a nested JSON structure."""
    if depth > 40:
        return
    if isinstance(obj, dict):
        yield obj
        for v in obj.values():
            yield from walk_json(v, depth + 1)
    elif isinstance(obj, list):
        for v in obj:
            yield from walk_json(v, depth + 1)


def extract_json_blobs(html: str) -> list:
    """__NEXT_DATA__, window.state / __INITIAL_STATE__, and JSON-LD blocks."""
    out = []
    for m in re.finditer(r'<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S):
        try:
            out.append(json.loads(m.group(1)))
        except Exception:
            pass
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try:
            out.append(json.loads(m.group(1)))
        except Exception:
            pass
    for m in re.finditer(r"window\.(?:state|__INITIAL_STATE__|__PRELOADED_STATE__)\s*=\s*(\{.*?\});\s*(?:</script>|window\.)", html, re.S):
        try:
            out.append(json.loads(m.group(1)))
        except Exception:
            pass
    return out


# ---------------------------------------------------------------- fetcher


class Fetcher:
    """Headless Chromium, one page at a time, random 2–5 s gaps, stops on block pages."""

    BLOCK_MARKERS = ("captcha", "access denied", "are you a robot", "unusual traffic", "cf-chl")

    def __init__(self, min_gap: float = 2.0, max_gap: float = 5.0, headless: bool = True):
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(headless=headless)
        self._ctx = self._browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
            ),
            viewport={"width": 1366, "height": 900},
        )
        self._ctx.route("**/*.{png,jpg,jpeg,webp,gif,svg,woff,woff2,mp4}", lambda r: r.abort())
        self.page = self._ctx.new_page()
        self.min_gap, self.max_gap = min_gap, max_gap
        self._base_gap = (min_gap, max_gap)
        self.slow_streak = 0          # consecutive slow answers: the site is struggling, back off
        self._last = 0.0
        self.pages = 0
        self.blocked = False

    def get(self, url: str, scroll: bool = False, retries: int = 2, settle_ms: int = 8000) -> tuple[str, str, list[str]]:
        """Return (html, innerText, absolute links)."""
        wait = self.min_gap + random.random() * (self.max_gap - self.min_gap) - (time.time() - self._last)
        if wait > 0:
            time.sleep(wait)
        err = None
        for attempt in range(retries + 1):
            try:
                t0 = time.time()
                resp = self.page.goto(url, wait_until="domcontentloaded", timeout=45_000)
                try:
                    self.page.wait_for_load_state("networkidle", timeout=settle_ms)
                except Exception:
                    pass
                if scroll:
                    for _ in range(4):
                        self.page.mouse.wheel(0, 2500)
                        self.page.wait_for_timeout(600)
                self._pace(time.time() - t0)
                html = self.page.content()
                text = norm_text(self.page.inner_text("body"))
                links = self.page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
                self._last = time.time()
                self.pages += 1
                status = resp.status if resp else 0
                low = text[:3000].lower()
                if status in (403, 429) or any(m in low for m in self.BLOCK_MARKERS):
                    self.blocked = True
                    raise RuntimeError(f"blocked ({status}) at {url}")
                return html, text, list(dict.fromkeys(links))
            except RuntimeError:
                raise
            except Exception as e:  # timeouts, network
                err = e
                self._pace(60)
                time.sleep(15 * (attempt + 1))
        raise RuntimeError(f"failed {url}: {err}")

    def _pace(self, seconds: float) -> None:
        """Slow answers double the gap between pages (max 30-60 s); fast ones bring it back."""
        if seconds > 20:
            self.slow_streak += 1
            self.min_gap, self.max_gap = min(self.min_gap * 2, 30), min(self.max_gap * 2, 60)
        else:
            self.slow_streak = 0
            if seconds < 12:
                self.min_gap = max(self._base_gap[0], self.min_gap / 2)
                self.max_gap = max(self._base_gap[1], self.max_gap / 2)

    @property
    def overloaded(self) -> bool:
        return self.slow_streak >= 3

    def cards(self, href_regex: str) -> list[dict]:
        """For the current page: every link matching href_regex with the text of its own card.

        The card is the largest ancestor that still contains only that one ad link,
        so it works whatever the site's CSS class names are.
        """
        js = r"""
        (src) => {
          const re = new RegExp(src);
          const ads = [...document.querySelectorAll('a[href]')].filter(a => re.test(a.href));
          // count matching ad links under every ancestor once (O(links x depth), no layout work)
          const owners = new Map();                 // element -> Set(hrefs)
          for (const a of ads) {
            let n = a.parentElement, depth = 0;
            while (n && n !== document.body && depth < 12) {
              if (!owners.has(n)) owners.set(n, new Set());
              owners.get(n).add(a.href);
              n = n.parentElement; depth++;
            }
          }
          const out = new Map();
          for (const a of ads) {
            let best = a, n = a.parentElement, depth = 0;
            while (n && n !== document.body && depth < 12) {
              if (owners.get(n).size > 1 || (n.textContent || '').length > 20000) break;
              best = n; n = n.parentElement; depth++;
            }
            // off-screen cards (content-visibility) have no innerText: rebuild it from leaf elements
            let t = best.innerText || '';
            if (!t.trim()) t = [...best.querySelectorAll('*')].filter(e => !e.children.length)
                               .map(e => (e.textContent || '').trim()).filter(Boolean).join('\n');
            if (!out.has(a.href) || t.length > out.get(a.href).length) out.set(a.href, t);
          }
          return [...out].map(([href, text]) => ({href, text}));
        }
        """
        rows = self.page.evaluate(js, href_regex)
        for r in rows:
            r["text"] = norm_text(r["text"])
        return rows

    def close(self):
        try:
            self._browser.close()
        finally:
            self._pw.stop()
