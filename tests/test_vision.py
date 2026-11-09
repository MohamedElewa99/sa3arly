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
    assert vision.car(b"x")["make"] == "Kia" and tried == ["gemini-3.8-flash", "gemini-flash-latest"]
    monkeypatch.setattr(vision, "_post", lambda *a, **k: (_ for _ in ()).throw(vision.VisionError("HTTP 400: API key not valid")))
    c = vision.check()
    assert c["ok"] is False and "API key not valid" in c["error"] and c["error"].startswith("gemini-")
