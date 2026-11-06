from pathlib import Path

import pytest

from sa3arly import saved
from tests.test_pricing import URL, db  # noqa: F401  (fixture)


def test_migration_file_matches_code():
    assert Path("db/migrations/002_saved_quotes.sql").read_text() == saved.MIGRATION


def test_clean_rejects_junk():
    ok = {"car": {"make": "Toyota", "model": "Corolla", "year": 2020, "trim": "Elite"}, "km": 80000, "low": 900000, "high": 1000000}
    assert saved.clean(ok)["trim"] == "Elite"
    assert saved.clean({**ok, "low": 0}) is None
    assert saved.clean({**ok, "low": 2, "high": 1}) is None
    assert saved.clean({**ok, "car": {"make": "", "model": "x", "year": 2020}}) is None
    assert saved.clean({"car": "x"}) is None
    assert saved.clean({**ok, "details": {"x": "y" * 9000}})["details"] == "{}"


@pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")
def test_save_list_remove(db):  # noqa: F811
    cx = db
    a, b = "00000000-0000-0000-0000-00000000000a", "00000000-0000-0000-0000-00000000000b"
    q = saved.clean({"car": {"make": "Kia", "model": "Cerato", "year": 2019}, "km": 90000, "low": 700000, "high": 760000,
                     "details": {"paint": ["كبوت"]}})
    item = saved.save(cx, a, q)
    assert item["car"]["model"] == "Cerato" and item["details"] == {"paint": ["كبوت"]}
    assert [i["id"] for i in saved.listing(cx, a)] == [item["id"]]
    assert saved.listing(cx, b) == []
    assert not saved.remove(cx, b, item["id"])          # someone else's
    assert saved.remove(cx, a, item["id"]) and saved.listing(cx, a) == []
