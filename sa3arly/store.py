"""Write results to Postgres (Supabase) when DATABASE_URL is set, else to JSONL files."""
from __future__ import annotations

import json
import os
import re
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

    def all_ids(self, source):
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


LISTING_COLS = ("source text, source_id text, url text, mk int, md int, make_raw text, model_raw text, trim_raw text, "
                "title text, year int, km int, transmission text, fuel text, body_type text, color text, city text, "
                "governorate text, price_egp bigint, seller_type text, description text, photo_count int, "
                "posted_on date, dk text, raw jsonb")

# One statement per batch: upsert every listing, then add a price-history row only where the price
# differs from the last one recorded (same rule as before, evaluated against the pre-statement snapshot).
BATCH_UPSERT = f"""
with b as (select * from jsonb_to_recordset(%s::jsonb) as x({LISTING_COLS})),
up as (
    insert into listings (source, source_id, url, make_id, model_id, make_raw, model_raw, trim_raw, title,
        year, km, transmission, fuel, body_type, color, city, governorate, price_egp, seller_type,
        description, photo_count, posted_on, dedupe_key, raw)
    select source, source_id, url, mk, md, make_raw, model_raw, trim_raw, title, year, km, transmission, fuel,
           body_type, color, city, governorate, price_egp, seller_type, description, photo_count, posted_on, dk,
           coalesce(raw, '{{}}'::jsonb)
    from b
    on conflict (source, source_id) do update set
        last_seen = now(), removed_at = null, price_egp = excluded.price_egp, km = coalesce(excluded.km, listings.km),
        trim_raw = coalesce(excluded.trim_raw, listings.trim_raw),
        description = coalesce(excluded.description, listings.description),
        posted_on = coalesce(excluded.posted_on, listings.posted_on),
        color = coalesce(excluded.color, listings.color),
        raw = listings.raw || excluded.raw
    returning id, price_egp
)
insert into listing_prices (listing_id, price_egp)
select up.id, up.price_egp from up
where up.price_egp is not null
  and up.price_egp is distinct from (select lp.price_egp from listing_prices lp
                                     where lp.listing_id = up.id order by lp.seen_at desc limit 1)
"""


class PgStore:
    BATCH = 200

    def __init__(self, url: str):
        import psycopg
        self.cx = psycopg.connect(url, autocommit=True)
        self._makes, self._models = {}, {}
        self._model_names: dict[int, list[str]] = {}     # make_id -> model names (N+1 fix for zero())
        self._pending: dict[tuple, dict] = {}            # (source, source_id) -> row, last one wins
        self._zero_rows: list[tuple] = []
        self._change_rows: list[tuple] = []

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
            if make_id in self._model_names and raw.strip() not in self._model_names[make_id]:
                self._model_names[make_id].append(raw.strip())
        return self._models[key]

    def catalog_model(self, make_raw, model_raw, source):
        """A model the listing sites list for a brand (even with no ads now), so the app can offer it."""
        if not getattr(self, "_catalog_ready", False):
            self.cx.execute("""create table if not exists model_catalog (
                                 model_id int primary key references models(id), source text not null,
                                 seen_on date not null default current_date)""")
            self._catalog_ready = True
        if not getattr(self, "_catalog_cleaned", False):
            # a first run filed brands as "<Brand> cars": drop those empty duplicates
            self.cx.execute("""delete from model_catalog where model_id in (select mo.id from models mo join makes mk on mk.id = mo.make_id
                                 where mk.slug like '%%-cars')""")
            self.cx.execute("""delete from models mo using makes mk where mk.id = mo.make_id and mk.slug like '%%-cars'
                                 and not exists (select 1 from listings l where l.model_id = mo.id)
                                 and not exists (select 1 from zero_prices z where z.model_id = mo.id)""")
            self.cx.execute("""delete from makes mk where mk.slug like '%%-cars'
                                 and not exists (select 1 from models mo where mo.make_id = mk.id)
                                 and not exists (select 1 from listings l where l.make_id = mk.id)""")
            self._catalog_cleaned = True
        md = self.model_id(self.make_id(make_raw), model_raw)
        if md:
            self.cx.execute("""insert into model_catalog (model_id, source) values (%s, %s)
                               on conflict (model_id) do update set seen_on = current_date""", (md, source))
        return md

    def _trims_ready(self):
        if not getattr(self, "_trim_tables", False):
            self.cx.execute("""create table if not exists trim_prices (
                                 model_id int not null references models(id), model_year int not null, trim text not null,
                                 price_egp int not null, source text not null, source_url text, seen_on date not null default current_date,
                                 primary key (model_id, model_year, trim, source))""")
            self.cx.execute("create table if not exists trim_pages (url text primary key, seen_on date not null default current_date)")
            self._trim_tables = True

    def trim_pages_done(self) -> set:
        self._trims_ready()
        return {r[0] for r in self.cx.execute("select url from trim_pages")}

    def trim_price(self, t, source):
        """One version of a model year with the price it sold for new (YallaMotor); an empty one only marks the page read."""
        self._trims_ready()
        if t.trim:
            md = self.model_id(self.make_id(t.make_raw), t.model_raw)
            if md:
                self.cx.execute("""insert into trim_prices (model_id, model_year, trim, price_egp, source, source_url)
                                   values (%s, %s, %s, %s, %s, %s)
                                   on conflict (model_id, model_year, trim, source)
                                   do update set price_egp = excluded.price_egp, seen_on = current_date""",
                                (md, t.model_year, t.trim, t.price_egp, source, t.source_url))
        if re.search(r"/\d{4}$", t.source_url or ""):
            self.cx.execute("insert into trim_pages (url) values (%s) on conflict do nothing", (t.source_url,))

    def models_of(self, make_id):
        """Model names of a make, read once per make per run and kept up to date as models are added."""
        if make_id not in self._model_names:
            self._model_names[make_id] = [r[0] for r in self.cx.execute(
                "select name_en from models where make_id = %s", (make_id,))]
        return self._model_names[make_id]

    def known_ids(self, source):
        return {r[0] for r in self.cx.execute(
            "select source_id from listings where source = %s and description is not null", (source,))}

    def all_ids(self, source):
        """Every ad of this source already stored: tells a new ad from one we are only refreshing."""
        return {r[0] for r in self.cx.execute("select source_id from listings where source = %s", (source,))}

    # -- writes (buffered: one round trip per batch instead of 1-2 per row)
    def listing(self, l: Listing):
        mk = self.make_id(l.make_raw)
        md = self.model_id(mk, l.model_raw)
        row = {**l.dict(), "mk": mk, "md": md, "dk": dedupe_key(l.make_raw, l.model_raw, l.year, l.km, l.price_egp)}
        key = (l.source, l.source_id)
        prev = self._pending.get(key)
        if prev is not None and prev.get("price_egp") != l.price_egp:
            self._flush_listings()          # keep both prices in the history, as the row-by-row version did
        self._pending[key] = row
        if len(self._pending) >= self.BATCH:
            self._flush_listings()

    def _flush_listings(self):
        if not self._pending:
            return
        rows = list(self._pending.values())
        self._pending = {}
        self.cx.execute(BATCH_UPSERT, (json.dumps(rows, ensure_ascii=False, default=str),))

    def zero(self, z: ZeroPrice):
        mk = self.make_id(z.make_raw)
        model, trim = split_zero_name(z.full_name, z.make_raw, self.models_of(mk), z.model_year)
        md = self.model_id(mk, model)
        self._zero_rows.append((mk, md, trim or z.full_name, z.model_year, z.price_egp, z.market_price_egp, z.source,
                                z.source_url, z.effective_on))
        if z.old_price_egp:
            self._change_rows.append((mk, md, trim or z.full_name, z.model_year, z.old_price_egp, z.price_egp,
                                      z.effective_on, z.source, z.source_url))
        if len(self._zero_rows) >= self.BATCH:
            self._flush_zero()

    def _flush_zero(self):
        with self.cx.cursor() as cur:
            if self._zero_rows:
                cur.executemany("""
                    insert into zero_prices (make_id, model_id, trim_name, model_year, price_egp, market_price_egp,
                                             source, source_url, effective_on)
                    values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    on conflict (make_id, trim_name, model_year, source, effective_on)
                    do update set price_egp = excluded.price_egp, market_price_egp = excluded.market_price_egp
                """, self._zero_rows)
            if self._change_rows:
                cur.executemany("""
                    insert into zero_price_changes (make_id, model_id, trim_name, model_year, old_price_egp,
                        new_price_egp, changed_on, source, source_url)
                    values (%s, %s, %s, %s, %s, %s, %s, %s, %s) on conflict do nothing
                """, self._change_rows)
        self._zero_rows, self._change_rows = [], []

    def flush(self):
        self._flush_listings()
        self._flush_zero()

    def run(self, source, pages=0, items=0, errors=0, note=None):
        self.flush()
        self.cx.execute("insert into scrape_runs (source, finished_at, pages, items, errors, note) values (%s, now(), %s, %s, %s, %s)",
                        (source, pages, items, errors, note))

    def mark_removed(self, source, days=21):
        """Ads not seen for `days` are treated as sold/removed (days-on-market signal)."""
        self.flush()
        self.cx.execute("update listings set removed_at = now() where source = %s and removed_at is null "
                        "and last_seen < now() - make_interval(days => %s)", (source, days))

    def close(self):
        try:
            self.flush()
        finally:
            self.cx.close()


def open_store():
    url = os.environ.get("DATABASE_URL")
    return PgStore(url) if url else JsonlStore()
