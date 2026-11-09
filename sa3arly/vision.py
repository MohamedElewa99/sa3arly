"""Read a car photo: which make / model / trim it is, or the km on the odometer.

Uses whichever vision model has a key set on the server:
  GEMINI_API_KEY      Google Gemini (free tier), model GEMINI_MODEL (default: tries current Flash models in turn)
  ANTHROPIC_API_KEY   Claude, model ANTHROPIC_MODEL (default: claude-haiku-5-5)
"""
from __future__ import annotations

import base64
import json
import os
import re
import time
import urllib.error
import urllib.request

MAX_IMAGE = 1_600_000          # bytes of JPEG after the app shrinks it (~1024px)

CAR_PROMPT = """You are helping a used-car trader in Egypt. Look at the photo and identify the car.
Answer with JSON only:
{"make": str|null, "model": str|null, "years": [from, to]|null, "trim": str|null, "body": "sedan"|"hatch"|"crossover"|"suv"|"pickup"|"van"|null, "confidence": 0..1, "note": str}
- Use the English make and model names as they are sold in Egypt (e.g. "Hyundai", "Elantra"; "Kia", "Cerato"; "Mercedes", "C 180").
- "years" is the production range of this generation / facelift you can see.
- "trim" only if a badge or a clear feature shows it, else null.
- "note": one short line in Egyptian Arabic about what you saw (e.g. "باين من الشبكة والفوانيس إنها الفيس ليفت").
- If there is no car, make is null and confidence 0.
{hints}"""

ODO_PROMPT = """Read the car's odometer in this photo (the total distance, ODO, not TRIP A/B).
Answer with JSON only: {"value": int|null, "unit": "km"|"mi"|null, "confidence": 0..1}
If you can't read it clearly, value is null."""


def provider() -> str:
    if os.environ.get("GEMINI_API_KEY"):
        return "gemini"
    if os.environ.get("ANTHROPIC_API_KEY"):
        return "anthropic"
    return ""


def _json(text: str) -> dict:
    m = re.search(r"\{.*\}", text or "", re.S)
    if not m:
        return {}
    try:
        out = json.loads(m.group(0))
    except ValueError:
        return {}
    return out if isinstance(out, dict) else {}


class VisionError(RuntimeError):
    """What the vision API answered, short enough to show (never contains the key)."""


def _post(url: str, body: dict, headers: dict, timeout: int = 14) -> dict:
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", **headers})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            msg = (json.loads(e.read() or b"{}").get("error") or {}).get("message", "")
        except ValueError:
            msg = ""
        raise VisionError(f"HTTP {e.code}: {msg[:160]}") from None
    except urllib.error.URLError as e:
        raise VisionError(f"network: {e.reason}") from None
    except (TimeoutError, OSError) as e:
        raise VisionError(f"network: {type(e).__name__}") from None


# tried in order until one answers; when all are retired the API's own model list is asked for the newest Flash
GEMINI_MODELS = ("gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest")   # 3.6 answers in ~1.5s; 3.8 is often busy on the free tier
_good: list = []          # the model that answered last: tried first next time
_BASE = "https://generativelanguage.googleapis.com/v1beta"
_found: list = []
_trace: list = []         # [model, with thinking setting, seconds, result] of the last calls, for ?check=1


def _discover() -> list:
    """Flash models this key can call, newest first (cached for the life of the function instance)."""
    if _found:
        return _found
    req = urllib.request.Request(_BASE + "/models?pageSize=200", headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"].strip()})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            models = json.loads(r.read()).get("models") or []
    except Exception:
        return []
    out = []
    for m in models:
        name = (m.get("name") or "").split("/")[-1]
        v = re.fullmatch(r"gemini-(\d+(?:\.\d+)?)-flash", name)
        if v and "generateContent" in (m.get("supportedGenerationMethods") or []):
            out.append((float(v.group(1)), name))
    _found.extend(n for _, n in sorted(out, reverse=True))
    return _found


def _thinking(model: str) -> dict | None:
    """Keep the answer fast: a photo read doesn't need long reasoning."""
    if re.search(r"gemini-3", model) or "latest" in model:
        return {"thinkingLevel": "low"}
    if "2.5" in model:
        return {"thinkingBudget": 0}
    return None


def _gemini(parts: list, json_out: bool = True) -> dict:
    key = {"x-goog-api-key": os.environ["GEMINI_API_KEY"].strip()}
    models = [os.environ["GEMINI_MODEL"]] if os.environ.get("GEMINI_MODEL") else []
    models += [m for m in _good + list(GEMINI_MODELS) if m not in models]
    last, t0, i = None, time.time(), 0
    while i < len(models) and i < 5 and time.time() - t0 < 40:
        model = models[i]
        i += 1
        cfg = {"responseMimeType": "application/json"} if json_out else {}
        think = _thinking(model)
        for cfg_try in ([dict(cfg, thinkingConfig=think), cfg] if think else [cfg]):
            t1 = time.time()
            try:
                r = _post(f"{_BASE}/models/{model}:generateContent",
                          {"contents": [{"parts": parts}], "generationConfig": cfg_try}, key, timeout=12)
                _trace.append([model, "thinkingConfig" in cfg_try, round(time.time() - t1, 1), "ok"])
                _good[:] = [model]
                return r
            except VisionError as e:
                _trace.append([model, "thinkingConfig" in cfg_try, round(time.time() - t1, 1), str(e)[:80]])
                last = VisionError(f"{model}: {e}")
                if re.match(r"HTTP (401|403|429)", str(e)) or "API key" in str(e):
                    raise last from None       # a bad key or a used-up quota won't get better with another model
                if not str(e).startswith("HTTP 400"):
                    break                      # only a 400 is worth retrying without the thinking setting
        if i == len(models):
            models += [m for m in _discover() if m not in models]
    raise last or VisionError("no model")


def check() -> dict:
    """A one-word text request: is the key set and accepted? For /api/vision?check=1."""
    p = provider()
    if not p:
        return {"ok": False, "provider": None, "error": "no GEMINI_API_KEY / ANTHROPIC_API_KEY on the server"}
    t0 = time.time()
    del _trace[:]
    try:
        if p == "gemini":
            _gemini([{"text": "Reply with the word ok."}], json_out=False)
        else:
            _ask("Reply with the word ok.", None)
        return {"ok": True, "provider": p, "seconds": round(time.time() - t0, 1), "tries": _trace[-6:]}
    except VisionError as e:
        return {"ok": False, "provider": p, "error": str(e), "seconds": round(time.time() - t0, 1), "tries": _trace[-6:]}


def _ask(prompt: str, jpeg: bytes | None) -> dict:
    b64 = base64.b64encode(jpeg).decode() if jpeg else ""
    p = provider()
    if p == "gemini":
        r = _gemini([{"inline_data": {"mime_type": "image/jpeg", "data": b64}}, {"text": prompt}])
        parts = (((r.get("candidates") or [{}])[0].get("content") or {}).get("parts") or [])
        return _json("".join(x.get("text", "") for x in parts))
    if p == "anthropic":
        r = _post("https://api.anthropic.com/v1/messages",
                  {"model": os.environ.get("ANTHROPIC_MODEL", "claude-haiku-5-5"), "max_tokens": 400,
                   "messages": [{"role": "user", "content": ([
                       {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}}] if b64 else [])
                       + [{"type": "text", "text": prompt}]}]},
                  {"x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"})
        return _json("".join(c.get("text", "") for c in r.get("content", []) if c.get("type") == "text"))
    raise RuntimeError("no vision key")


def decode(image: str) -> bytes | None:
    """The app sends a data: URL (JPEG). None when it isn't one or it's too big."""
    m = re.match(r"^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$", image or "")
    if not m:
        return None
    raw = base64.b64decode(m.group(2))
    return raw if 0 < len(raw) <= MAX_IMAGE else None


def car(jpeg: bytes, makes: list[str] | None = None) -> dict:
    hints = ""
    if makes:
        hints = "Makes we have prices for (prefer these spellings): " + ", ".join(sorted(set(makes))[:120])
    out = _ask(CAR_PROMPT.replace("{hints}", hints), jpeg)
    conf = out.get("confidence")
    try:
        conf = max(0.0, min(1.0, float(conf)))
    except (TypeError, ValueError):
        conf = 0.0
    years = out.get("years") if isinstance(out.get("years"), list) and len(out.get("years")) == 2 else None
    return {"make": out.get("make") or None, "model": out.get("model") or None, "trim": out.get("trim") or None,
            "years": years, "body": out.get("body") or None, "confidence": conf, "note": str(out.get("note") or "")[:160]}


def odometer(jpeg: bytes) -> dict:
    out = _ask(ODO_PROMPT, jpeg)
    try:
        v = int(str(out.get("value")).replace(",", "").replace(" ", ""))
    except (TypeError, ValueError):
        return {"km": None, "confidence": 0.0}
    km = int(round(v * 1.609344)) if out.get("unit") == "mi" else v
    if not 0 <= km <= 2_000_000:
        return {"km": None, "confidence": 0.0}
    try:
        conf = max(0.0, min(1.0, float(out.get("confidence"))))
    except (TypeError, ValueError):
        conf = 0.5
    return {"km": km, "confidence": conf}
