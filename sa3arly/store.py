"""Write results to Postgres (Supabase) when DATABASE_URL is set, else to JSONL files."""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from .common import Listing, ZeroPrice, dedupe_key
from .normalize import make_slug, model_slug, split_zero_name


class JsonlStore:
    def __init__(self, folder: str = "out"):
        self.dir = Path(folder)
        self.dir.mkdir(exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        self._files = {}
        self.stamp = stamp

    def _f(self, kind):
        if kind not in self._files:
            self._files[kind] = open(self.dir / f"{kind}-{self.stamp}.jsonl", "a", encoding="utf-8")
        return self._files[kind]

    def known_ids(self, source):
        return set()

    def listing(self, l: Listing):
        d = l.dict()
        d["dedupe_key"] = dedupe_key(l.make_raw, l.model_raw, l.year, l.km, l.price_egp)
        self._f("listings").write(json.dumps(d, ensure_ascii=False) + "\n")

    def zero(self, z: ZeroPrice):
        self._f("zero_prices").write(json.dumps(z.dict(), ensure_ascii=False) + "\n")

    def run(self, source, **kw):
        pass

    def close(self):
        for f in self._files.values():
            f.close()


class PgStore:
    def __init__(self, url: str):
        import psycopg
        self.cx = psycopg.connect(url, autocommit=True)
        self._makes, self._models = {}, {}

    # -- catalogue
    def make_id(self, raw):
        slug = make_slug(raw)
        if not slug:
            return None
        if slug not in self._makes:
            row = self.cx.execute(
                "insert into makes (slug, name_en) values (%s, %s) on conflict (slug) do update set slug = excluded.slug returning id",
                (slug, raw.strip().title() if raw.isascii() else slug.title())).fetchone()
            self._makes[slug] = row[0]
        return self._makes[slug]

    def model_id(self, make_id, raw):
        slug = model_slug(raw)
        if not (make_id and slug):
            return None
        key = (make_id, slug)
        if key not in self._models:
            row = self.cx.execute(
                "insert into models (make_id, slug, name_en) values (%s, %s, %s) "
                "on conflict (make_id, slug) do update set slug = excluded.slug returning id",
                (make_id, slug, raw.strip())).fetchone()
            self._models[key] = row[0]
        return self._models[key]

    def models_of(self, make_id):
        return [r[0] for r in self.cx.execute("select name_en from models where make_id = %s", (make_id,))]

    def known_ids(self, source):
        return {r[0] for r in self.cx.execute(
            "select source_id from listings where source = %s and description is not null", (source,))}

    # -- writes
    def listing(self, l: Listing):
        mk = self.make_id(l.make_raw)
        md = self.model_id(mk, l.model_raw)
        row = self.cx.execute("""
            insert into listings (source, source_id, url, make_id, model_id, make_raw, model_raw, trim_raw, title,
                year, km, transmission, fuel, body_type, color, city, governorate, price_egp, seller_type,
                description, photo_count, posted_on, dedupe_key, raw)
            values (%(source)s, %(source_id)s, %(url)s, %(mk)s, %(md)s, %(make_raw)s, %(model_raw)s, %(trim_raw)s,
                %(title)s, %(year)s, %(km)s, %(transmission)s, %(fuel)s, %(body_type)s, %(color)s, %(city)s,
                %(governorate)s, %(price_egp)s, %(seller_type)s, %(description)s, %(photo_count)s, %(posted_on)s,
                %(dk)s, %(raw)s)
            on conflict (source, source_id) do update set
                last_seen = now(), removed_at = null, price_egp = excluded.price_egp, km = coalesce(excluded.km, listings.km),
                trim_raw = coalesce(excluded.trim_raw, listings.trim_raw),
                description = coalesce(excluded.description, listings.description),
                posted_on = coalesce(excluded.posted_on, listings.posted_on),
                color = coalesce(excluded.color, listings.color),
                raw = listings.raw || excluded.raw
            returning id, (select price_egp from listing_prices lp where lp.listing_id = listings.id
                           order by seen_at desc limit 1)
        """, {**l.dict(), "mk": mk, "md": md,
              "dk": dedupe_key(l.make_raw, l.model_raw, l.year, l.km, l.price_egp),
              "raw": json.dumps(l.raw, ensure_ascii=False)}).fetchone()
        lid, last_price = row
        if l.price_egp and l.price_egp != last_price:
            self.cx.execute("insert into listing_prices (listing_id, price_egp) values (%s, %s)", (lid, l.price_egp))

    def zero(self, z: ZeroPrice):
        mk = self.make_id(z.make_raw)
        model, trim = split_zero_name(z.full_name, z.make_raw, self.models_of(mk), z.model_year)
        md = self.model_id(mk, model)
        self.cx.execute("""
            insert into zero_prices (make_id, model_id, trim_name, model_year, price_egp, market_price_egp,
                                     source, source_url, effective_on)
            values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            on conflict (make_id, trim_name, model_year, source, effective_on)
            do update set price_egp = excluded.price_egp, market_price_egp = excluded.market_price_egp
        """, (mk, md, trim or z.full_name, z.model_year, z.price_egp, z.market_price_egp, z.source,
              z.source_url, z.effective_on))
        if z.old_price_egp:
            self.cx.execute("""
                insert into zero_price_changes (make_id, model_id, trim_name, model_year, old_price_egp, new_price_egp,
                    changed_on, source, source_url)
                values (%s, %s, %s, %s, %s, %s, %s, %s, %s) on conflict do nothing
            """, (mk, md, trim or z.full_name, z.model_year, z.old_price_egp, z.price_egp, z.effective_on,
                  z.source, z.source_url))

    def run(self, source, pages=0, items=0, errors=0, note=None):
        self.cx.execute("insert into scrape_runs (source, finished_at, pages, items, errors, note) values (%s, now(), %s, %s, %s, %s)",
                        (source, pages, items, errors, note))

    def mark_removed(self, source, days=21):
        """Ads not seen for `days` are treated as sold/removed (days-on-market signal)."""
        self.cx.execute("update listings set removed_at = now() where source = %s and removed_at is null "
                        "and last_seen < now() - make_interval(days => %s)", (source, days))

    def close(self):
        self.cx.close()


def open_store():
    url = os.environ.get("DATABASE_URL")
    return PgStore(url) if url else JsonlStore()
