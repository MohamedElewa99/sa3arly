from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly.http_shared import connect, send  # noqa: E402
from sa3arly.web_api import market  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with connect() as cx:
                send(self, 200, market(cx), cache=900)
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
