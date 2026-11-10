from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import vision  # noqa: E402
from sa3arly.http_shared import connect, query, read_json, send, user_id  # noqa: E402

PER_HOUR = 40     # photos one account can read per hour (keeps the shared free quota for everyone)


def allowed(uid: str) -> bool:
    try:
        with connect() as cx:
            cx.execute("create table if not exists vision_uses (user_id uuid not null, at timestamptz not null default now())")
            cx.execute("delete from vision_uses where at < now() - interval '1 hour'")
            n = cx.execute("select count(*) from vision_uses where user_id = %s", (uid,)).fetchone()[0]
            if n >= PER_HOUR:
                return False
            cx.execute("insert into vision_uses (user_id) values (%s)", (uid,))
    except Exception:
        pass          # the database being down shouldn't block reading a photo
    return True


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """/api/vision?check=1: is photo reading set up and working? (never shows the key)"""
        if query(self).get("check"):
            return send(self, 200, vision.check(), cache=600)   # cached: anyone can call it, and each real check spends AI quota
        send(self, 400, {"error": "POST a photo, or GET ?check=1"})

    def do_POST(self):
        if not vision.provider():
            return send(self, 503, {"error": "off"})
        body = read_json(self, 4_200_000)   # a set of small photos; Vercel itself stops at 4.5 MB
        kind = body.get("kind")
        if kind not in ("car", "odo", "inspect", "ad"):
            return send(self, 400, {"error": "kind car|odo|inspect|ad is required"})
        jpeg = jpegs = None
        if kind in ("car", "odo"):
            jpeg = vision.decode(body.get("image", ""))
            if not jpeg:
                return send(self, 400, {"error": "image (data:image/jpeg) is required"})
        else:
            jpegs = vision.decode_set(body.get("images"))
            if kind == "inspect" and not jpegs:
                return send(self, 400, {"error": "images (a list of data:image/jpeg) is required"})
            if kind == "ad" and not (isinstance(body.get("car"), dict) and body["car"].get("make")):
                return send(self, 400, {"error": "car {make, model, year} is required"})
        uid = user_id(self)
        if not uid:
            return send(self, 401, {"error": "sign in"})
        if not allowed(uid):
            return send(self, 429, {"error": "slow down"})
        makes = body.get("makes") if isinstance(body.get("makes"), list) else None
        makes = [str(m)[:40] for m in makes] if makes else None
        try:
            if kind == "odo":
                return send(self, 200, vision.odometer(jpeg))
            if kind == "inspect":
                return send(self, 200, vision.inspect(jpegs, makes))
            if kind == "ad":
                return send(self, 200, vision.ad(body["car"], jpegs[:6]))
            send(self, 200, vision.car(jpeg, makes))
        except vision.VisionError as e:
            send(self, 502, {"error": str(e)})
        except Exception as e:
            send(self, 502, {"error": type(e).__name__})
