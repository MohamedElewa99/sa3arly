from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly.http_shared import connect, query, send  # noqa: E402
from sa3arly.web_api import quote  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        q = query(self)
        try:
            year, km = int(q.get("year", "")), int(float(q.get("km", "0")))
        except ValueError:
            return send(self, 400, {"error": "year and km must be numbers"})
        if not q.get("make") or not q.get("model") or not (1980 <= year <= 2030) or not (0 <= km <= 2_000_000):
            return send(self, 400, {"error": "make, model, year (1980-2030) and km (0-2,000,000) are required"})
        try:
            with connect() as cx:
                send(self, 200, quote(cx, q["make"], q["model"], year, km, q.get("trim")), cache=1800)
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
