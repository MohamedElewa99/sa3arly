import os
import pytest
from pathlib import Path

URL = os.environ.get("TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")


def test_pg_roundtrip():
    from sa3arly.store import PgStore
    from sa3arly.scrapers import hatla2ee as h
    from sa3arly.common import Listing
    s = PgStore(URL)
    s.cx.execute("truncate makes, models, zero_prices, zero_price_changes, listings, listing_prices, scrape_runs restart identity cascade")
    fx = Path(__file__).parent / "fixtures"
    for z in h.parse_price_changes((fx / "hatla2ee_price_change_a.txt").read_text(encoding="utf-8"), "Opel", "u"):
        s.zero(z)
    l = h.parse_card((fx / "hatla2ee_card.txt").read_text(encoding="utf-8"), "https://eg.hatla2ee.com/en/car/hyundai/elantra/7228179")
    s.listing(l)
    l.price_egp = 815_000                      # price drop seen next day
    s.listing(l)
    s.run("hatla2ee:used", pages=1, items=1)
    assert s.cx.execute("select count(*) from zero_price_changes").fetchone()[0] == 3
    assert s.cx.execute("select trim_name, change_egp from zero_price_changes order by changed_on desc, change_egp desc limit 1").fetchone() \
        == ("A/T / Black Edition", 160_000)
    assert s.cx.execute("select price_egp from listings").fetchone()[0] == 815_000
    assert [r[0] for r in s.cx.execute("select price_egp from listing_prices order by seen_at")] == [830_000, 815_000]
    assert s.cx.execute("select m.name_en from models m join listings l on l.model_id = m.id").fetchone()[0] == "Elantra"
    s.close()


def test_pg_zero_model_page_market_price():
    from sa3arly.store import PgStore
    from sa3arly.scrapers import hatla2ee as h
    s = PgStore(URL)
    s.cx.execute("truncate makes, models, zero_prices restart identity cascade")
    for z in h.parse_model_page((Path(__file__).parent / "fixtures/hatla2ee_model_tucson.txt").read_text(encoding="utf-8"), "Hyundai", "u"):
        s.zero(z)
    rows = s.cx.execute("select m.name_en, z.trim_name, z.model_year, z.price_egp, z.market_price_egp from zero_prices z "
                        "join models m on m.id = z.model_id order by z.model_year, z.price_egp").fetchall()
    assert len(rows) == 13 and rows[0] == ("Tucson", "A/T / SHADOW", 2025, 1_499_000, 1_499_000)
    s.close()
