from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import garage  # noqa: E402
from sa3arly.http_shared import connect, query, read_json, send, user_id  # noqa: E402


def signed_in(h):
    uid = user_id(h)
    if not uid:
        send(h, 401, {"error": "sign in"})
    return uid


def car_id(h):
    try:
        return int(query(h).get("id", ""))
    except ValueError:
        send(h, 400, {"error": "id"})
        return None


class handler(BaseHTTPRequestHandler):
    """عربياتي: GET (all, or ?id= with photos), POST (add), PUT ?id= (edit), DELETE ?id=. Each user sees only his own."""

    def do_GET(self):
        uid = signed_in(self)
        if not uid:
            return
        one = "id" in query(self)
        cid = car_id(self) if one else None
        if one and cid is None:
            return
        try:
            with connect() as cx:
                if one:
                    item = garage.get(cx, uid, cid)
                    return send(self, 200 if item else 404, {"item": item} if item else {"error": "not found"})
                send(self, 200, {"items": garage.listing(cx, uid)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_POST(self):
        uid = signed_in(self)
        if not uid:
            return
        f, why = garage.clean(read_json(self))
        if f is None:
            return send(self, 400, {"error": why})
        try:
            with connect() as cx:
                item = garage.add(cx, uid, f)
                if item == "full":
                    return send(self, 409, {"error": "full"})
                send(self, 200, {"item": item})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_PUT(self):
        uid = signed_in(self)
        if not uid:
            return
        cid = car_id(self)
        if cid is None:
            return
        f, why = garage.clean(read_json(self), partial=True)
        if f is None:
            return send(self, 400, {"error": why})
        try:
            with connect() as cx:
                item = garage.update(cx, uid, cid, f)
                send(self, 200 if item else 404, {"item": item} if item else {"error": "not found"})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})

    def do_DELETE(self):
        uid = signed_in(self)
        if not uid:
            return
        cid = car_id(self)
        if cid is None:
            return
        try:
            with connect() as cx:
                send(self, 200, {"ok": garage.remove(cx, uid, cid)})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
