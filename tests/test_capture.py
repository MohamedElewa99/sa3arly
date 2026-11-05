"""Run the capture button on a local Dubizzle-shaped page, then import the file twice."""
import functools, http.server, json, threading
from pathlib import Path

import pytest

from sa3arly.capture.importer import import_folder

HERE = Path(__file__).parent


class MemStore:
    def __init__(self):
        self.rows = {}

    def listing(self, l):
        self.rows[(l.source, l.source_id)] = l


@pytest.fixture()
def site():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(HERE / "capture_site"))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{srv.server_port}"
    srv.shutdown()


def capture(page_url, tmp_path):
    from playwright.sync_api import sync_playwright
    js = (HERE.parent / "sa3arly/capture/bookmarklet.js").read_text(encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_context(accept_downloads=True).new_page()
        pg.goto(page_url)
        with pg.expect_download() as d:
            pg.evaluate(js)
        out = tmp_path / d.value.suggested_filename
        d.value.save_as(out)
        b.close()
    return out


def test_capture_and_import(site, tmp_path):
    pytest.importorskip("playwright")
    f = capture(site + "/dubizzle.html", tmp_path)
    data = json.loads(f.read_text(encoding="utf-8"))
    assert len(data["cards"]) == 2                         # 2 cars; the phone ad has no year
    st = MemStore()
    stats = import_folder(st, tmp_path)
    assert stats["saved"] == 2
    el = st.rows[("127", "498765432")] if ("127", "498765432") in st.rows else None
    rows = {k[1]: v for k, v in st.rows.items()}
    e = rows["498765432"]
    assert (e.price_egp, e.year, e.km, e.make_raw, e.transmission) == (1_050_000, 2020, 109_999, "Hyundai", "automatic")
    assert e.raw["captured_manually"] and "فابريكا" in e.raw["card_text"]
    # same page captured again -> still 2 rows
    f2 = capture(site + "/dubizzle.html", tmp_path)
    import_folder(st, tmp_path)
    assert len(st.rows) == 2
    assert (tmp_path / "sa3arly-imported").exists()


def test_installer_button_runs(site, tmp_path):
    """The javascript: link in the installer page works when clicked on a listing page."""
    pytest.importorskip("playwright")
    from playwright.sync_api import sync_playwright
    from sa3arly.capture.make_installer import build
    import re as _re
    page_html = build(tmp_path / "btn.html").read_text(encoding="utf-8")
    href = _re.search(r'class="btn" href="([^"]+)"', page_html).group(1)
    from urllib.parse import unquote
    js = unquote(href[len("javascript:"):])
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_context(accept_downloads=True).new_page()
        pg.goto(site + "/dubizzle.html")
        with pg.expect_download() as d:
            pg.evaluate(js)
        data = json.loads(Path(d.value.path()).read_text(encoding="utf-8"))
        b.close()
    assert len(data["cards"]) == 2
