"""Shared plumbing for the Vercel functions in /api: DB connection, query string, JSON responses."""
import json
import os
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse


import psycopg  # noqa: E402


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
