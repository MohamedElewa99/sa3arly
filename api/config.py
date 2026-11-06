from http.server import BaseHTTPRequestHandler

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # repo root, for the sa3arly package

from sa3arly import vision  # noqa: E402
from sa3arly.http_shared import anon_key, send, supabase_url  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # public values only: the project URL and its anon (publishable) key, used by the app to sign in
        url, key = supabase_url(), anon_key()
        send(self, 200, {"supabaseUrl": url, "anonKey": key, "auth": bool(url and key), "vision": bool(vision.provider())}, cache=300)
