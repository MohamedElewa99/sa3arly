from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import phone_login  # noqa: E402
from sa3arly.http_shared import connect, read_json, send  # noqa: E402


class handler(BaseHTTPRequestHandler):
    """Sign in with WhatsApp. POST {"action": "start"} -> code + wa link + nonce; POST {"action": "check", "nonce"}."""

    def do_POST(self):
        if not phone_login.enabled():
            return send(self, 503, {"error": "off"})
        body = read_json(self)
        try:
            with connect() as cx:
                if body.get("action") == "start":
                    return send(self, 200, phone_login.start(cx))
                if body.get("action") == "check" and isinstance(body.get("nonce"), str):
                    return send(self, 200, phone_login.check(cx, body["nonce"]))
                send(self, 400, {"error": "action"})
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
