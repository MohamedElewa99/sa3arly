"""App API queries on the same synthetic market as the pricing tests (needs TEST_DATABASE_URL)."""
import pytest

from tests.test_pricing import URL, db, true_price  # noqa: F401  (db is the shared fixture)

pytestmark = pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")


def test_catalog_lists_models_with_enough_ads(db):
    from sa3arly.web_api import catalog
    c = catalog(db)
    elantra = c["makes"]["Hyundai"]["Elantra AD"]
    assert elantra["n"] >= 40 and elantra["years"] == [2019, 2020, 2021]
    assert elantra["body"] == "sedan" and elantra["trims"]
    # anchor price = asking price at 2022 / 60,000 km, close to the known market
    assert abs(elantra["ref"] / (true_price(2022, 60_000) / 0.95) - 1) < 0.15
    assert "Cupra" not in c["makes"]                      # 2 ads only: not enough to list
    assert c["default"]["make"] == "Hyundai" and c["default"]["model"] == "Elantra AD"


def test_quote_is_a_range_with_comparables(db):
    from sa3arly.web_api import quote
    q = quote(db, "Hyundai", "Elantra AD", 2020, 100_000)
    truth = true_price(2020, 100_000)
    assert q["low"] <= truth <= q["high"]
    assert q["n"] >= 30 and q["comparables"] and all("adjusted" in c for c in q["comparables"])


def test_market_shows_zero_changes_and_cheap_new_ads(db):
    from sa3arly.web_api import market
    mk = db.execute("select id from makes where name_en = 'Hyundai'").fetchone()[0]
    mo = db.execute("select id from models where make_id = %s", (mk,)).fetchone()[0]
    db.execute("""insert into zero_price_changes (make_id, model_id, trim_name, model_year, old_price_egp, new_price_egp, changed_on, source)
                  values (%s, %s, 'Top', 2026, 1200000, 1230000, current_date, 'hatla2ee')""", (mk, mo))
    db.execute("""insert into listings (source, source_id, url, make_id, model_id, year, km, price_egp)
                  values ('hatla2ee', 'cheap', 'c', %s, %s, 2020, 90000, 700000)""", (mk, mo))
    items = market(db)["items"]
    zero = [i for i in items if i["t"] == "zero"]
    deals = [i for i in items if i["t"] == "deal"]
    assert zero and zero[0]["delta"] == 30000 and zero[0]["up"] and zero[0]["car"]["model"] == "Elantra AD"
    assert "فئة Top" in zero[0]["name"] and zero[0]["old"] == 1200000
    assert any(d["price"] == 700000 and d["delta"] < -10 and d["km"] == 90000 and d["median"] > 700000 and d["url"] == "c" for d in deals)
