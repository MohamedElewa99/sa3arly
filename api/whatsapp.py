from http.server import BaseHTTPRequestHandler

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import phone_login  # noqa: E402
from sa3arly.http_shared import connect, query, send  # noqa: E402


class handler(BaseHTTPRequestHandler):
    """Meta's WhatsApp Cloud API webhook: GET is the one-time subscribe check, POST brings incoming messages."""

    def do_GET(self):
        q = query(self)
        token = os.environ.get("WA_VERIFY_TOKEN", "")
        if token and q.get("hub.mode") == "subscribe" and q.get("hub.verify_token") == token:
            data = q.get("hub.challenge", "").encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        send(self, 403, {"error": "verify token"})

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(n) if 0 < n < 1_000_000 else b""
        if not phone_login.signature_ok(raw, self.headers.get("X-Hub-Signature-256", "")):
            return send(self, 403, {"error": "signature"})
        try:
            payload = json.loads(raw)
            with connect() as cx:
                phone_login.received(cx, payload)
        except Exception:
            pass                          # always 200, or Meta keeps retrying the same message
        send(self, 200, {"ok": True})
