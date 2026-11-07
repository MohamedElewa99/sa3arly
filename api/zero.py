from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly.http_shared import connect, query, send  # noqa: E402
from sa3arly.web_api import zero  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        q = query(self)
        try:
            with connect() as cx:
                send(self, 200, zero(cx, q.get("make") or None, q.get("model") or None), cache=1800)
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
