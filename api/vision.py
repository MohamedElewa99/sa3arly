from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import vision  # noqa: E402
from sa3arly.http_shared import connect, read_json, send, user_id  # noqa: E402

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
    def do_POST(self):
        if not vision.provider():
            return send(self, 503, {"error": "off"})
        body = read_json(self)
        jpeg = vision.decode(body.get("image", ""))
        kind = body.get("kind")
        if not jpeg or kind not in ("car", "odo"):
            return send(self, 400, {"error": "image (data:image/jpeg) and kind car|odo are required"})
        uid = user_id(self)
        if not uid:
            return send(self, 401, {"error": "sign in"})
        if not allowed(uid):
            return send(self, 429, {"error": "slow down"})
        try:
            if kind == "odo":
                return send(self, 200, vision.odometer(jpeg))
            makes = body.get("makes") if isinstance(body.get("makes"), list) else None
            send(self, 200, vision.car(jpeg, [str(m)[:40] for m in makes] if makes else None))
        except Exception as e:
            send(self, 502, {"error": type(e).__name__})
