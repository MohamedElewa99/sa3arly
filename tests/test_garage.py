from pathlib import Path

import pytest

from sa3arly import garage
from tests.test_pricing import URL, db  # noqa: F401  (fixture)

PIC = "data:image/jpeg;base64,/9j/AAAA"
CAR = {"car": {"make": "Toyota", "model": "Corolla", "year": 2020, "trim": "Elite"}, "km": 80000}


def test_migration_file_matches_code():
    assert Path("db/migrations/004_my_cars.sql").read_text() == garage.MIGRATION


def test_clean():
    f, _ = garage.clean({**CAR, "price": "950000", "notes": " فبريكا ", "photos": [PIC], "cover": PIC})
    assert f["price"] == 950000 and f["status"] == "available" and f["notes"] == "فبريكا" and f["trim"] == "Elite"
    assert garage.clean({**CAR, "status": "gone"})[1] == "status"
    assert garage.clean({**CAR, "price": 5})[1] == "price"
    assert garage.clean({**CAR, "photos": ["http://x"]})[1] == "photos"
    assert garage.clean({**CAR, "photos": [PIC] * 9})[1] == "photos"
    assert garage.clean({"km": 5})[1] == "car"
    f, _ = garage.clean({"status": "sold"}, partial=True)
    assert f == {"status": "sold"}                        # an edit touches only what was sent
    assert garage.clean({"price": None}, partial=True)[0] == {"price": None}


@pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")
def test_add_list_edit_remove(db):  # noqa: F811
    cx = db
    a, b = "00000000-0000-0000-0000-00000000000a", "00000000-0000-0000-0000-00000000000b"
    f, _ = garage.clean({**CAR, "price": 950000, "photos": [PIC, PIC], "cover": PIC, "details": {"paint": ["كبوت"]}})
    item = garage.add(cx, a, f)
    assert item["price"] == 950000 and item["photos"] == [PIC, PIC] and item["details"] == {"paint": ["كبوت"]}
    lst = garage.listing(cx, a)
    assert [i["id"] for i in lst] == [item["id"]] and "photos" not in lst[0] and lst[0]["nPhotos"] == 2
    assert garage.listing(cx, b) == [] and garage.get(cx, b, item["id"]) is None      # private
    assert garage.update(cx, b, item["id"], {"status": "sold"}) is None
    up = garage.update(cx, a, item["id"], garage.clean({"status": "reserved", "price": 990000}, partial=True)[0])
    assert up["status"] == "reserved" and up["price"] == 990000 and up["photos"] == [PIC, PIC]
    assert not garage.remove(cx, b, item["id"])
    assert garage.remove(cx, a, item["id"]) and garage.listing(cx, a) == []
