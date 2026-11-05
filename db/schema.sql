-- Sa3arly (سعرلي) — Phase 1 schema (Supabase / Postgres 15+)
-- Run once in Supabase SQL editor.

create extension if not exists pg_trgm;

-- ---------- Catalogue ----------
create table if not exists makes (
  id          serial primary key,
  slug        text unique not null,          -- 'hyundai'
  name_en     text not null,                 -- 'Hyundai'
  name_ar     text
);

create table if not exists models (
  id          serial primary key,
  make_id     int not null references makes(id) on delete cascade,
  slug        text not null,                 -- 'elantra-ad'
  name_en     text not null,                 -- 'Elantra AD'
  aliases     text[] not null default '{}',  -- other spellings seen on sites
  unique (make_id, slug)
);

-- ---------- Zero (new) prices ----------
create table if not exists zero_prices (
  id            bigserial primary key,
  make_id       int not null references makes(id),
  model_id      int references models(id),
  trim_name     text not null,               -- 'A/T / Top Line'
  model_year    int not null,
  price_egp     bigint not null,               -- official price
  market_price_egp bigint,                     -- Hatla2ee market price (over/under official), if shown
  source        text not null,               -- 'hatla2ee' | 'contactcars'
  source_url    text,
  effective_on  date not null,               -- change date from site, or scrape date
  scraped_at    timestamptz not null default now(),
  unique (make_id, trim_name, model_year, source, effective_on)
);
create index if not exists zero_prices_lookup on zero_prices (make_id, model_id, model_year, effective_on desc);

-- Explicit change events (feed the "zero price changed" alert)
create table if not exists zero_price_changes (
  id            bigserial primary key,
  make_id       int not null references makes(id),
  model_id      int references models(id),
  trim_name     text not null,
  model_year    int not null,
  old_price_egp bigint not null,
  new_price_egp bigint not null,
  change_egp    bigint generated always as (new_price_egp - old_price_egp) stored,
  changed_on    date not null,
  source        text not null,
  source_url    text,
  scraped_at    timestamptz not null default now(),
  unique (make_id, trim_name, model_year, changed_on, source)
);

-- ---------- Used listings ----------
create table if not exists listings (
  id              bigserial primary key,
  source          text not null,             -- 'hatla2ee' | 'contactcars' | 'dubizzle' | 'facebook'
  source_id       text not null,             -- site's ad id
  url             text not null,
  make_id         int references makes(id),
  model_id        int references models(id),
  make_raw        text,
  model_raw       text,
  trim_raw        text,
  title           text,
  year            int,
  km              int,
  transmission    text,                      -- 'automatic' | 'manual'
  fuel            text,
  body_type       text,
  color           text,
  city            text,
  governorate     text,
  price_egp       bigint,
  seller_type     text,                      -- 'dealer' | 'owner' | null
  description     text,                      -- kept: paint/accident words are mined from it
  photo_count     int,
  posted_on       date,
  first_seen      timestamptz not null default now(),
  last_seen       timestamptz not null default now(),
  removed_at      timestamptz,               -- set when the ad disappears
  dedupe_key      text,                      -- cross-site duplicate key
  raw             jsonb,
  unique (source, source_id)
);
create index if not exists listings_comp on listings (make_id, model_id, year, last_seen desc) where removed_at is null;
create index if not exists listings_dedupe on listings (dedupe_key);

-- Every price we ever saw for a listing (asking-price history, days on market)
create table if not exists listing_prices (
  listing_id  bigint not null references listings(id) on delete cascade,
  price_egp   bigint not null,
  seen_at     timestamptz not null default now(),
  primary key (listing_id, seen_at)
);

-- ---------- Spare parts (for repair ranges) ----------
create table if not exists part_prices (
  id          bigserial primary key,
  make_id     int references makes(id),
  model_id    int references models(id),
  part_key    text not null,                 -- 'front_shocks', 'brake_pads_front', ...
  grade       text not null,                 -- 'original' | 'aftermarket' | 'used'
  price_egp   bigint not null,
  source      text not null,
  url         text,
  scraped_at  timestamptz not null default now()
);

-- ---------- Scrape runs (monitoring) ----------
create table if not exists scrape_runs (
  id          bigserial primary key,
  source      text not null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  pages       int default 0,
  items       int default 0,
  errors      int default 0,
  note        text
);

-- upgrade path for databases created before market_price_egp existed
alter table zero_prices add column if not exists market_price_egp bigint;
