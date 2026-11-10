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


def _gemini(parts: list, json_out: bool = True, timeout: int = 12) -> dict:
    key = {"x-goog-api-key": os.environ["GEMINI_API_KEY"].strip()}
    models = [os.environ["GEMINI_MODEL"]] if os.environ.get("GEMINI_MODEL") else []
    models += [m for m in _good + list(GEMINI_MODELS) if m not in models]
    last, t0, i = None, time.time(), 0
    while i < len(models) and i < 5 and time.time() - t0 < max(40, timeout + 8):
        model = models[i]
        i += 1
        cfg = {"responseMimeType": "application/json"} if json_out else {}
        think = _thinking(model)
        for cfg_try in ([dict(cfg, thinkingConfig=think), cfg] if think else [cfg]):
            t1 = time.time()
            try:
                r = _post(f"{_BASE}/models/{model}:generateContent",
                          {"contents": [{"parts": parts}], "generationConfig": cfg_try}, key, timeout=timeout)
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


def _ask(prompt: str, jpeg, timeout: int = 12, max_tokens: int = 400) -> dict:
    """Ask about no photo, one photo (bytes) or several (a list of bytes)."""
    jpegs = [jpeg] if isinstance(jpeg, (bytes, bytearray)) else list(jpeg or [])
    b64s = [base64.b64encode(j).decode() for j in jpegs]
    p = provider()
    if p == "gemini":
        r = _gemini([{"inline_data": {"mime_type": "image/jpeg", "data": b}} for b in b64s] + [{"text": prompt}], timeout=timeout)
        parts = (((r.get("candidates") or [{}])[0].get("content") or {}).get("parts") or [])
        return _json("".join(x.get("text", "") for x in parts))
    if p == "anthropic":
        r = _post("https://api.anthropic.com/v1/messages",
                  {"model": os.environ.get("ANTHROPIC_MODEL", "claude-haiku-5-5"), "max_tokens": max_tokens,
                   "messages": [{"role": "user", "content": [
                       {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": b}} for b in b64s]
                       + [{"type": "text", "text": prompt}]}]},
                  {"x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"}, timeout=timeout)
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


# ---------- the whole set of photos: which car, the km, and what state it is in ----------
MAX_PHOTOS = 20                 # photos looked at in one go (the app sends them small)
MAX_SET_IMAGE = 400_000         # bytes each
AREAS = ("body", "interior", "tyres", "lights")
SEVERITY = ("light", "medium", "heavy")

INSPECT_PROMPT = """You are an experienced used-car inspector in Egypt helping a trader. You get {n} photos of ONE car
(any order: outside, inside, dashboard, tyres, close-ups). Look at all of them and answer with JSON only:
{"make": str|null, "model": str|null, "years": [from, to]|null, "trim": str|null, "confidence": 0..1,
 "km": int|null,
 "areas": {"body": {"score": 0..10, "note": str}|null, "interior": {...}|null, "tyres": {...}|null, "lights": {...}|null},
 "score": 0..10|null,
 "summary": str,
 "defects": [{"area": "body"|"interior"|"tyres"|"lights", "what": str, "severity": "light"|"medium"|"heavy", "photo": int}],
 "missing": [str]}
Rules:
- make/model: English names as sold in Egypt. "years" = production range of the generation you see. "trim" only from a badge or a clear feature.
- "km": the odometer total (ODO, not TRIP) if a photo shows it clearly, else null. Convert miles to km.
- An area is null when no photo shows it. Never guess an area you cannot see.
- Scores: 10 = like new, 8 = clean used car, 6 = visible wear, 4 = needs real work, 2 = bad.
- "defects": only what is actually visible in a photo: scratches, dents, repainted-looking panels (colour or gloss mismatch, uneven panel gaps), rust, cracked or foggy lights, cracked glass, torn or dirty seats, worn steering wheel, dashboard warning lights that are on, worn or mismatched tyres, kerbed rims. "photo" is the 1-based number of the photo that shows it. At most 12, the most important first. If the car looks clean, return an empty list. Do not invent defects, and do not report dirt, reflections or shadows as damage.
- severity: light = cosmetic touch-up, medium = needs a body shop or a part, heavy = big repair or a sign of an accident.
- "summary": 2 short sentences in Egyptian Arabic, as one trader tells another what he saw. "what" and every "note" are short Egyptian Arabic too.
- "missing": up to 3 short Egyptian Arabic hints of photos that would make the report better (e.g. "صورة للعداد", "صور الكاوتش من قريب"), empty when the set is complete.
- You only see photos: never claim anything about the engine, gearbox or chassis unless a photo really shows it.
- If the photos show no car, make is null, score is null and summary says so.
{hints}"""

AD_PROMPT = """Write a used-car ad for an Egyptian dealer to post on Facebook Marketplace / Hatla2ee / OLX.
The car (facts from the dealer, JSON): {facts}
{photos}
Answer with JSON only: {"title": str, "text": str}
Rules:
- Egyptian Arabic, the way good dealers write: clear, confident, short lines. No English except the car's name and trim.
- "title": one line: make, model, year, trim and the strongest selling point (max 70 characters).
- "text": 6 to 12 short lines separated by \n: the car and year, km, the condition, what is original and what was painted or changed EXACTLY as the facts say, notable features you can see in the photos or that the trim is known for, the price if given (with "قابل للتفاوض البسيط" only if no note says otherwise), and a last line asking serious buyers to message or call.
- Be honest: use only the facts given and what the photos clearly show. If the facts list painted or replaced parts or mechanical issues, mention them plainly in one line; hiding them loses the buyer at the inspection. Never write "فابريكا بالكامل" unless the facts say nothing is painted or replaced.
- Do not invent a phone number, a location, an owner count, a licence date or service history.
- At most 3 emojis in the whole text, none in the title. No hashtags.
"""


def _clamp(v, lo, hi, default=None):
    try:
        return max(lo, min(hi, float(v)))
    except (TypeError, ValueError):
        return default


def decode_set(images) -> list:
    """The app's list of data: URLs as JPEG bytes: bad or oversized ones are dropped, at most MAX_PHOTOS kept."""
    out = []
    for im in (images if isinstance(images, list) else [])[:MAX_PHOTOS * 2]:
        m = re.match(r"^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$", im if isinstance(im, str) else "")
        if not m:
            continue
        raw = base64.b64decode(m.group(2))
        if 0 < len(raw) <= MAX_SET_IMAGE:
            out.append(raw)
        if len(out) >= MAX_PHOTOS:
            break
    return out


def inspect(jpegs: list, makes: list[str] | None = None) -> dict:
    """One answer for a set of photos: the car, the km if a photo shows it, a score per area and the visible defects."""
    hints = ""
    if makes:
        hints = "Makes we have prices for (prefer these spellings): " + ", ".join(sorted(set(makes))[:120])
    out = _ask(INSPECT_PROMPT.replace("{n}", str(len(jpegs))).replace("{hints}", hints), jpegs, timeout=40, max_tokens=1500)
    years = out.get("years") if isinstance(out.get("years"), list) and len(out.get("years")) == 2 else None
    km = None
    try:
        km = int(str(out.get("km")).replace(",", "").replace(" ", ""))
        if not 0 <= km <= 2_000_000:
            km = None
    except (TypeError, ValueError):
        km = None
    areas = {}
    raw_areas = out.get("areas") if isinstance(out.get("areas"), dict) else {}
    for a in AREAS:
        v = raw_areas.get(a)
        sc = _clamp(v.get("score"), 0, 10) if isinstance(v, dict) else None
        areas[a] = None if sc is None else {"score": round(sc, 1), "note": str(v.get("note") or "")[:140]}
    seen = [v["score"] for v in areas.values() if v]
    score = _clamp(out.get("score"), 0, 10)
    if score is None and seen:
        score = sum(seen) / len(seen)
    defects = []
    for d in (out.get("defects") if isinstance(out.get("defects"), list) else [])[:12]:
        if not isinstance(d, dict) or not str(d.get("what") or "").strip():
            continue
        try:
            ph = int(d.get("photo"))
            ph = ph if 1 <= ph <= len(jpegs) else None
        except (TypeError, ValueError):
            ph = None
        defects.append({"area": d.get("area") if d.get("area") in AREAS else "body", "what": str(d["what"]).strip()[:120],
                        "severity": d.get("severity") if d.get("severity") in SEVERITY else "light", "photo": ph})
    return {"make": out.get("make") or None, "model": out.get("model") or None, "trim": out.get("trim") or None, "years": years,
            "confidence": _clamp(out.get("confidence"), 0, 1, 0.0), "km": km,
            "areas": areas, "score": None if score is None or not out.get("make") and not seen else round(score, 1),
            "summary": str(out.get("summary") or "")[:400], "defects": defects,
            "missing": [str(x)[:60] for x in (out.get("missing") if isinstance(out.get("missing"), list) else []) if x][:3],
            "photos": len(jpegs)}


def ad(facts: dict, jpegs: list | None = None) -> dict:
    """A ready ad for one car of the dealer's stock, from what he saved about it (and its photos when there are any)."""
    keep = {k: facts.get(k) for k in ("make", "model", "year", "trim", "km", "price", "notes", "painted", "replaced", "other", "mechanical", "report")
            if facts.get(k) not in (None, "", [], {})}
    text = json.dumps(keep, ensure_ascii=False)[:2500]
    photos = (f"{len(jpegs)} photos of the car are attached: use what they clearly show (colour, body style, visible features)."
              if jpegs else "No photos are attached: write from the facts only and do not describe the colour.")
    out = _ask(AD_PROMPT.replace("{facts}", text).replace("{photos}", photos), jpegs or [], timeout=40, max_tokens=900)
    body = str(out.get("text") or "").strip()
    if not body:
        raise VisionError("empty ad")
    return {"title": str(out.get("title") or "").strip()[:120], "text": body[:2000]}
