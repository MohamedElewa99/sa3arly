"""Run the /api functions locally (same handlers Vercel runs): python tools/api_dev.py [port]"""
import importlib.util
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

API = Path(__file__).resolve().parent.parent / "api"
sys.path.insert(0, str(API))
HANDLERS = {}
for f in API.glob("[!_]*.py"):
    spec = importlib.util.spec_from_file_location(f.stem, f)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    HANDLERS["/api/" + f.stem] = mod.handler


class Router(BaseHTTPRequestHandler):
    def do_GET(self):
        h = HANDLERS.get(urlparse(self.path).path)
        if not h:
            self.send_error(404)
            return
        h.do_GET(self)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    print("api on", port, sorted(HANDLERS))
    ThreadingHTTPServer(("127.0.0.1", port), Router).serve_forever()
