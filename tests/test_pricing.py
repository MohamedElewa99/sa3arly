"""Pricing engine on a synthetic market with a known answer (needs TEST_DATABASE_URL)."""
import json
import os
import random

import pytest

URL = os.environ.get("TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")


def true_price(year, km):
    return 1_000_000 * 1.08 ** (year - 2020) * 0.99 ** (km / 10_000)


@pytest.fixture()
def db():
    import psycopg
    from sa3arly.store import PgStore
    from sa3arly.common import Listing, ZeroPrice
    s = PgStore(URL)
    s.cx.execute("truncate makes, models, zero_prices, zero_price_changes, listings, listing_prices restart identity cascade")
    rnd = random.Random(7)
    for i in range(40):
        y = rnd.choice([2019, 2020, 2021])
        km = rnd.randrange(40_000, 180_000, 1000)
        price = int(true_price(y, km) / 0.95 * rnd.uniform(0.97, 1.03))     # asking = deal / 0.95
        s.listing(Listing(source="hatla2ee", source_id=str(i), url=f"u{i}", make_raw="Hyundai",
                          model_raw="Elantra AD", year=y, km=km, price_egp=price))
    # noise that must be ignored: a customs-exempt car and a crazy price
    s.listing(Listing(source="hatla2ee", source_id="dis", url="d", make_raw="Hyundai", model_raw="Elantra AD",
                      year=2020, km=100_000, price_egp=400_000, raw={"badges": ["Disabled"]}))
    s.listing(Listing(source="hatla2ee", source_id="x", url="x", make_raw="Hyundai", model_raw="Elantra AD",
                      year=2020, km=100_000, price_egp=9_000_000))
    # a rare model with 2 ads + a zero price
    for i, (y, km, p) in enumerate([(2022, 76_000, 1_880_000), (2022, 95_000, 1_660_000)]):
        s.listing(Listing(source="hatla2ee", source_id=f"f{i}", url=f"f{i}", make_raw="Cupra", model_raw="Formentor",
                          year=y, km=km, price_egp=p))
    s.zero(ZeroPrice(source="hatla2ee", make_raw="Cupra", full_name="Cupra Formentor 2026 Automatic",
                     model_year=2026, price_egp=2_049_000, effective_on=__import__("datetime").date.today().isoformat()))
    s.flush()
    yield s.cx
    s.close()


def test_range_contains_true_deal_price(db):
    from sa3arly.pricing import Pricer
    q = Pricer(db).quote("Hyundai", "Elantra AD", 2020, 100_000)
    truth = true_price(2020, 100_000)
    assert q.low <= truth <= q.high, (q.low, truth, q.high)
    assert (q.high - q.low) / q.mid < 0.10                       # useful width
    assert q.confidence == "عالية" and all(c.price != 400_000 for c in q.comparables)


def test_model_family_matching_and_deductions(db):
    from sa3arly.pricing import Pricer
    base = Pricer(db).quote("hyundai", "Elantra", 2020, 100_000)  # family name finds 'Elantra AD'
    worse = Pricer(db).quote("hyundai", "Elantra", 2020, 100_000, paint={"hood": "repainted", "roof": "repainted"},
                             repairs=[(10_000, 20_000)])
    assert worse.mid < base.mid * 0.93 - 10_000
    assert any("الرش" in l for l in worse.lines) and any("الإصلاحات" in l for l in worse.lines)


def test_thin_data_uses_zero_anchor(db):
    from sa3arly.pricing import Pricer
    q = Pricer(db).quote("Cupra", "Formentor", 2022, 100_000)
    assert q.confidence == "منخفضة" and q.zero_price == 2_049_000
    assert 1_450_000 < q.mid < 1_800_000
    assert any("الزيرو" in l for l in q.lines)


def test_unknown_model(db):
    from sa3arly.pricing import Pricer
    q = Pricer(db).quote("Lada", "Niva", 2015, 100_000)
    assert q.low is None and "مفيش" in q.text()


def test_closest_and_outliers_helpers():
    from sa3arly.pricing import Comparable, _closest, _iqr_on
    comps = [Comparable("h", 2022, 90_000 + i * 1000, 1_500_000, "u", "VZ") for i in range(9)]
    comps += [Comparable("h", 2022, 300_000, 1_100_000, "u", "Style") for _ in range(5)]
    near, notes = _closest(comps, "vz", 100_000)
    assert len(near) == 9 and all(c.trim == "VZ" for c in near) and notes
    few, notes2 = _closest(comps[:5], "VZ", 100_000)      # too few to narrow: keep everything
    assert len(few) == 5 and not notes2
    pool = [Comparable("h", 2022, 1, p, "u") for p in [100, 101, 99, 102, 98, 100, 400]]
    for c in pool:
        c.adjusted = c.price
    assert 400 not in [c.price for c in _iqr_on(pool, lambda c: c.adjusted)]
