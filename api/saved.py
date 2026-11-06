from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import saved  # noqa: E402
from sa3arly.http_shared import connect, query, read_json, send, user_id  # noqa: E402


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
                send(self, 200, {"items": saved.listing(cx, uid)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_POST(self):
        uid = signed_in(self)
        if not uid:
            return
        q = saved.clean(read_json(self))
        if not q:
            return send(self, 400, {"error": "car, km, low and high are required"})
        try:
            with connect() as cx:
                send(self, 200, {"item": saved.save(cx, uid, q)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_DELETE(self):
        uid = signed_in(self)
        if not uid:
            return
        try:
            qid = int(query(self).get("id", ""))
        except ValueError:
            return send(self, 400, {"error": "id"})
        try:
            with connect() as cx:
                send(self, 200, {"ok": saved.remove(cx, uid, qid)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
