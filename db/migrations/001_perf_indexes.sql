-- 001 — performance indexes for the pricing engine (Sa3arly)
-- Safe to run while the scraper is idle. CREATE/DROP INDEX CONCURRENTLY does not lock writes,
-- but it cannot run inside a transaction: run the statements one by one (Supabase SQL editor: one per run).
--
-- Why: Pricer.comparables filters listings by make_id + model_id + year range + recency, with
--      "removed_at is null OR removed_at recent". The old partial index (where removed_at is null)
--      cannot serve that OR, so Postgres scanned the whole table (measured: Seq Scan).
-- Write overhead: one index replaced by one index -> unchanged per-row cost.

create index concurrently if not exists listings_make_model_year
    on listings (make_id, model_id, year) include (last_seen, removed_at, price_egp, km);

drop index concurrently if exists listings_comp;

-- rollback:
--   create index concurrently if not exists listings_comp on listings (make_id, model_id, year, last_seen desc) where removed_at is null;
--   drop index concurrently if exists listings_make_model_year;
