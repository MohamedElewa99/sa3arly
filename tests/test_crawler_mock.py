"""Crawler end-to-end on a local mock of a Hatla2ee list page (inline price, two links per card)."""
import functools
import http.server
import threading
from pathlib import Path

import pytest

CARD = ('<div class="c"><div><a href="/en/car/hyundai/elantra/{id}"><img></a></div><div>'
        '<a href="/en/car/hyundai/elantra/{id}">Hyundai Elantra {y}</a><p>{y}</p><p>{km} KM</p><p>Automatic</p>'
        '<p>Gas</p><span>{p}</span><span>EGP</span><p>Giza</p><p>Hyundai</p><p>Elantra</p>{trim}<button>Call</button></div></div>')


@pytest.fixture()
def site(tmp_path):
    (tmp_path / "en/car").mkdir(parents=True)
    cards = CARD.format(id=7228179, y=2022, km="80,000", p="830,000", trim="") + \
        CARD.format(id=7210670, y=2013, km="140,000", p="800,000", trim="<p>A/T / GLS</p>")
    (tmp_path / "en/car/index.html").write_text(f"<html><head><meta charset='utf-8'></head><body>{cards}</body></html>", encoding="utf-8")
    ad = (Path(__file__).parent / "fixtures/hatla2ee_ad.txt").read_text(encoding="utf-8")
    for i in (7228179, 7210670):
        p = tmp_path / f"en/car/hyundai/elantra/{i}"
        p.mkdir(parents=True)
        (p / "index.html").write_text("<html><head><meta charset='utf-8'></head><body>" +
                                      "".join(f"<div>{l}</div>" for l in ad.splitlines()) + "</body></html>", encoding="utf-8")
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(tmp_path))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{srv.server_port}"
    srv.shutdown()


def test_crawl_mock(site, monkeypatch):
    pytest.importorskip("playwright")
    from sa3arly.common import Fetcher
    from sa3arly.scrapers import hatla2ee as h
    monkeypatch.setattr(h, "BASE", site)
    monkeypatch.setattr(h, "AD_RE", r"/en/car/[^/?#]+/[^/?#]+/\d{5,}/?$")
    f = Fetcher(min_gap=0, max_gap=0.05)
    try:
        rows = {r.source_id: r for r in h.scrape_used(f, max_pages=2)}
    finally:
        f.close()
    assert set(rows) == {"7228179", "7210670"}
    a, b = rows["7228179"], rows["7210670"]
    assert (a.price_egp, a.km, a.city, a.model_raw) == (830_000, 80_000, "Giza", "Elantra")
    assert (b.trim_raw, b.color, b.posted_on) == ("A/T / GLS", "Black", "2026-04-30")
    assert b.description.startswith("فئاه")
