import base64

from sa3arly import vision


def test_decode_and_json():
    url = "data:image/jpeg;base64," + base64.b64encode(b"\xff\xd8abc").decode()
    assert vision.decode(url) == b"\xff\xd8abc"
    assert vision.decode("data:text/html;base64,QQ==") is None and vision.decode("nope") is None
    assert vision._json('```json\n{"make": "Kia"}\n```') == {"make": "Kia"}
    assert vision._json("no json") == {}


def test_car_and_odo_parsing(monkeypatch):
    monkeypatch.setattr(vision, "_ask", lambda p, j: {"make": "Kia", "model": "Cerato", "years": [2019, 2023], "confidence": "0.8", "note": "x"})
    r = vision.car(b"x", ["Kia"])
    assert r["make"] == "Kia" and r["confidence"] == 0.8 and r["years"] == [2019, 2023]
    monkeypatch.setattr(vision, "_ask", lambda p, j: {"value": "62,140", "unit": "mi", "confidence": 0.9})
    assert vision.odometer(b"x")["km"] == 100005
    monkeypatch.setattr(vision, "_ask", lambda p, j: {"value": None})
    assert vision.odometer(b"x")["km"] is None


def test_provider(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    assert vision.provider() == ""
    monkeypatch.setenv("GEMINI_API_KEY", "k")
    assert vision.provider() == "gemini"


def test_gemini_falls_back_to_the_next_model(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "k")
    monkeypatch.delenv("GEMINI_MODEL", raising=False)
    tried = []

    def post(url, body, headers, timeout=25):
        tried.append(url.split("/models/")[1].split(":")[0])
        if len(tried) == 1:
            raise vision.VisionError("HTTP 404: models/x is not found")
        return {"candidates": [{"content": {"parts": [{"text": '{"make": "Kia", "confidence": 0.9}'}]}}]}
    monkeypatch.setattr(vision, "_post", post)
    assert vision.car(b"x")["make"] == "Kia" and tried == ["gemini-3.6-flash", "gemini-3.8-flash"]
    monkeypatch.setattr(vision, "_post", lambda *a, **k: (_ for _ in ()).throw(vision.VisionError("HTTP 400: API key not valid")))
    c = vision.check()
    assert c["ok"] is False and "API key not valid" in c["error"] and c["error"].startswith("gemini-")


def test_inspect_cleans_the_answer(monkeypatch):
    answer = {"make": "Kia", "model": "Cerato", "years": [2019, 2023], "confidence": 0.9, "km": "85,300",
              "areas": {"body": {"score": 7.26, "note": "خدوش"}, "interior": None, "tyres": {"score": "x"}, "lights": {"score": 12}},
              "summary": "نضيفة", "defects": [{"area": "roof", "what": " خدش في الباب ", "severity": "huge", "photo": 9},
                                               {"area": "tyres", "what": "", "severity": "light"},
                                               {"area": "lights", "what": "فانوس مكسور", "severity": "medium", "photo": 2}],
              "missing": ["صورة للعداد", "", "a", "b", "c"]}
    monkeypatch.setattr(vision, "_ask", lambda p, j, **k: answer)
    r = vision.inspect([b"a", b"b"], ["Kia"])
    assert r["make"] == "Kia" and r["km"] == 85300 and r["photos"] == 2
    assert r["areas"]["body"] == {"score": 7.3, "note": "خدوش"} and r["areas"]["interior"] is None and r["areas"]["tyres"] is None
    assert r["areas"]["lights"]["score"] == 10 and r["score"] == 8.7          # the mean of what was seen when the model gave none
    assert r["defects"] == [{"area": "body", "what": "خدش في الباب", "severity": "light", "photo": None},
                            {"area": "lights", "what": "فانوس مكسور", "severity": "medium", "photo": 2}]
    assert r["missing"] == ["صورة للعداد", "a", "b"]
    monkeypatch.setattr(vision, "_ask", lambda p, j, **k: {})
    r = vision.inspect([b"a"])
    assert r["make"] is None and r["score"] is None and r["defects"] == [] and r["km"] is None


def test_decode_set_drops_bad_and_caps():
    ok = "data:image/jpeg;base64," + base64.b64encode(b"\xff\xd8abc").decode()
    big = "data:image/jpeg;base64," + base64.b64encode(b"x" * (vision.MAX_SET_IMAGE + 1)).decode()
    assert vision.decode_set([ok, "nope", big, 5, ok]) == [b"\xff\xd8abc"] * 2
    assert len(vision.decode_set([ok] * 50)) == vision.MAX_PHOTOS and vision.decode_set("x") == []


def test_ad_sends_only_known_facts(monkeypatch):
    import pytest
    seen = {}

    def ask(prompt, jpegs, **k):
        seen["p"], seen["n"] = prompt, len(jpegs)
        return {"title": "كيا سيراتو 2020", "text": "سطر\nسطر"}
    monkeypatch.setattr(vision, "_ask", ask)
    r = vision.ad({"make": "Kia", "model": "Cerato", "year": 2020, "km": 90000, "painted": ["كبوت"], "secret": "x", "notes": ""}, [b"a"])
    assert r == {"title": "كيا سيراتو 2020", "text": "سطر\nسطر"} and seen["n"] == 1
    assert '"painted": ["كبوت"]' in seen["p"] and "secret" not in seen["p"] and '"notes"' not in seen["p"] and "1 photos" in seen["p"]
    monkeypatch.setattr(vision, "_ask", lambda p, j, **k: {"title": "x"})
    with pytest.raises(vision.VisionError):
        vision.ad({"make": "Kia"})
