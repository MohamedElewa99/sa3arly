"""Shared plumbing for the Vercel functions in /api: DB connection, query string, JSON responses."""
from __future__ import annotations

import json
import os
from urllib.parse import parse_qs, urlparse

import psycopg


def connect():
    return psycopg.connect(os.environ["DATABASE_URL"], autocommit=True, connect_timeout=8)


def query(handler) -> dict:
    return {k: v[0] for k, v in parse_qs(urlparse(handler.path).query).items()}


def send(handler, status: int, body, cache: int = 0):
    data = json.dumps(body, ensure_ascii=False, default=str).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", f"public, s-maxage={cache}, stale-while-revalidate={cache * 4}" if cache else "no-store")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def supabase_url() -> str:
    """https://<ref>.supabase.co — from SUPABASE_URL, or worked out from the pooler user in DATABASE_URL (postgres.<ref>)."""
    if os.environ.get("SUPABASE_URL"):
        return os.environ["SUPABASE_URL"].rstrip("/")
    user = urlparse(os.environ.get("DATABASE_URL", "")).username or ""
    ref = user.split(".", 1)[1] if user.startswith("postgres.") else ""
    return f"https://{ref}.supabase.co" if ref else ""


def anon_key() -> str:
    return os.environ.get("SUPABASE_ANON_KEY", "") or os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")


def read_json(handler) -> dict:
    n = int(handler.headers.get("Content-Length") or 0)
    if not n or n > 2_500_000:
        return {}
    try:
        body = json.loads(handler.rfile.read(n))
    except ValueError:
        return {}
    return body if isinstance(body, dict) else {}


def user_id(handler) -> str | None:
    """The signed-in user's id, checked with Supabase Auth; None when the token is missing or not valid."""
    import urllib.request
    auth = handler.headers.get("Authorization", "")
    base, key = supabase_url(), anon_key()
    if not auth.startswith("Bearer ") or not base or not key:
        return None
    req = urllib.request.Request(base + "/auth/v1/user", headers={"Authorization": auth, "apikey": key})
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            return json.loads(r.read()).get("id")
    except Exception:
        return None
