from pathlib import Path

import pytest

from sa3arly import profile
from tests.test_pricing import URL, db  # noqa: F401  (fixture)


def test_migration_file_matches_code():
    assert Path("db/migrations/003_profiles.sql").read_text() == profile.MIGRATION


def test_phone_forms():
    assert profile.phone_ok("01012345678") == "01012345678"
    assert profile.phone_ok("+20 101 234 5678") == "01012345678"
    assert profile.phone_ok("٠١٠١٢٣٤٥٦٧٨") == "01012345678"
    assert profile.phone_ok("0020-1012345678") == "01012345678"
    assert profile.phone_ok("0131234567") is None and profile.phone_ok("123") is None


def test_clean():
    f, bad = profile.clean({"name": " محمد ", "showroom": "", "city": "الجيزة", "phone": "01112345678"})
    assert f == {"name": "محمد", "showroom": None, "city": "الجيزة", "phone": "01112345678"} and not bad
    assert profile.clean({"city": "Berlin"}) == (None, "city")
    assert profile.clean({"phone": "12"}) == (None, "phone")
    assert profile.clean({"name": "x" * 61}) == (None, "name")
    assert profile.clean({"avatar": "javascript:alert(1)"}) == (None, "avatar")
    assert profile.clean({"avatar": "data:image/jpeg;base64,QUJD"})[0] == {"avatar": "data:image/jpeg;base64,QUJD"}


@pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")
def test_put_get(db):  # noqa: F811
    uid = "00000000-0000-0000-0000-0000000000c1"
    db.execute("delete from profiles where user_id = %s", (uid,)) if db.execute("select to_regclass('profiles')").fetchone()[0] else None
    assert profile.get(db, uid)["name"] is None
    assert profile.put(db, uid, {"name": "محمد", "city": "القاهرة"})["city"] == "القاهرة"
    p = profile.put(db, uid, {"showroom": "معرض طارق"})
    assert p["name"] == "محمد" and p["showroom"] == "معرض طارق"      # untouched fields stay
