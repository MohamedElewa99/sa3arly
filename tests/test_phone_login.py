import hashlib
import hmac
import json
from pathlib import Path

import pytest

from sa3arly import phone_login as pl
from tests.test_pricing import URL, db  # noqa: F401  (fixture)


def test_migration_file_matches_code():
    assert Path("db/migrations/005_phone_logins.sql").read_text() == pl.MIGRATION


def test_phone_and_signature(monkeypatch):
    assert pl.egypt_phone("201012345678") == "01012345678"
    assert pl.egypt_phone("971501234567") == "+971501234567"
    monkeypatch.setenv("WA_APP_SECRET", "s3")
    body = b'{"x":1}'
    sig = "sha256=" + hmac.new(b"s3", body, hashlib.sha256).hexdigest()
    assert pl.signature_ok(body, sig) and not pl.signature_ok(body, "sha256=00") and not pl.signature_ok(body, "")


def _msg(frm, text):
    return {"entry": [{"changes": [{"value": {"messages": [{"from": frm, "type": "text", "text": {"body": text}}]}}]}]}


@pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")
def test_flow(db, monkeypatch):  # noqa: F811
    monkeypatch.setenv("WA_NUMBER", "+20 100 000 0000")
    s = pl.start(db)
    assert s["wa"].startswith("https://wa.me/201000000000?text=") and len(s["code"]) == 6
    assert pl.check(db, s["nonce"])["state"] == "waiting"
    assert pl.check(db, "not-the-nonce")["state"] == "gone"
    assert pl.received(db, _msg("201012345678", "كود الدخول لسعرلي: 000000")) == 0          # wrong code
    arabic = s["code"].translate(str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩"))
    assert pl.received(db, _msg("201012345678", "كود الدخول لسعرلي: " + arabic)) == 1
    asked = []
    monkeypatch.setattr(pl, "session_token", lambda phone: asked.append(phone) or "tok")
    out = pl.check(db, s["nonce"])
    assert out == {"state": "ok", "token_hash": "tok", "phone": "01012345678"} and asked == ["01012345678"]
    assert pl.check(db, s["nonce"])["state"] == "gone"                                      # one use only
    assert pl.received(db, _msg("201099999999", s["code"])) == 0                            # can't be taken over
    json.dumps(out)
