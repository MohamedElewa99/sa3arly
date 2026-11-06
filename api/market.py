from http.server import BaseHTTPRequestHandler

from _shared import connect, send
from sa3arly.web_api import market


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with connect() as cx:
                send(self, 200, market(cx), cache=900)
        except Exception as e:
            send(self, 503, {"error": type(e).__name__})
