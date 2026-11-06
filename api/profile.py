from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import profile  # noqa: E402
from sa3arly.http_shared import connect, read_json, send, user_id  # noqa: E402


def signed_in(h):
    uid = user_id(h)
    if not uid:
        send(h, 401, {"error": "sign in"})
    return uid


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        uid = signed_in(self)
        if not uid:
            return
        try:
            with connect() as cx:
                send(self, 200, {"profile": profile.get(cx, uid), "cities": profile.CITIES})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_PUT(self):
        uid = signed_in(self)
        if not uid:
            return
        fields, bad = profile.clean(read_json(self))
        if fields is None:
            return send(self, 400, {"error": bad})
        try:
            with connect() as cx:
                send(self, 200, {"profile": profile.put(cx, uid, fields)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
