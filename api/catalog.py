from http.server import BaseHTTPRequestHandler

from _shared import connect, send
from sa3arly.web_api import catalog


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with connect() as cx:
                send(self, 200, catalog(cx), cache=3600)
        except Exception as e:  # the app keeps its built-in catalog when this fails
            send(self, 503, {"error": type(e).__name__})
