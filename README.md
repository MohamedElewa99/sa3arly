# Sa3arly (سعرلي) — Phase 1: data

Scrapes Egyptian car prices into one Postgres database.

## What is collected (checked live, 4 Nov 2026)

| Source | Status | What |
| --- | --- | --- |
| Hatla2ee — new cars | ✅ working | Every class of every model: official price, Hatla2ee market price (over/under official), model year. Plus every official price change (old, new, date), all pages |
| Hatla2ee — used | ✅ working | ~20,000 ads (729 list pages): price, km, year, class, city, badges (Factory Paint, Financed, Disabled, Personal Use…), instalment. Ad pages add description (e.g. "فابريكة بالكامل"), colour, posted date and Hatla2ee's own min/max price for that model-year |
| Sylndr | ✅ working | ~1,200 inspected cars at fixed prices (closest thing to real deal prices): make, model, year, class, km, price, instalment |
| OpenSooq | ✅ working | ~950 ads: make, model, trim, year, km, fuel, city, seller title (often has "فابريكا"). Zero-km dealer stock is skipped |
| YallaMotor | ⛔ off | Search page opens, every next page answers 403 |
| Dubizzle | ⛔ off | Serves a "Security check" bot challenge |
| ContactCars | ⛔ off | Answers 403 from the second page |
| Facebook Marketplace | ⛔ off | Logged-out visitors see only price + place, no car name/year/km |

Sa3arly never tries to get around a block, a challenge or a login.
The code for the three blocked sources stays in `sa3arly/scrapers/` in case they open up
(or agree to a data partnership).

## Commands

```powershell
py -m sa3arly zero --source hatla2ee                    # all brands, ~1.5–2 h
py -m sa3arly zero --source hatla2ee --brands hyundai,kia
py -m sa3arly used --source hatla2ee                    # newest 60 pages + 300 new ad pages
py -m sa3arly used --source hatla2ee --max-pages 800 --max-details 0   # full weekly sweep
py -m sa3arly probe                                     # health check of every source
```

Without `DATABASE_URL` results go to `out/*.jsonl`.

## Speed and politeness

Hatla2ee takes ~10 s per page even for a plain request. The fetcher waits 2–5 s between pages,
blocks images, and **doubles its wait whenever a page takes over 20 s**; after 3 slow pages in a
row it stops opening ad pages for that run and only reads list pages. A captcha/403/429 stops the source.

| Run | When | Work | Time |
| --- | --- | --- | --- |
| Daily | 03:17 Cairo | zero prices, then newest 60 list pages + ≤300 new ad pages (one after the other, never in parallel) | ~3 h |
| Weekly | Friday 05:17 Cairo | all list pages, no ad pages (every price refreshed, removed ads marked) | ~3.5 h |

The ~20k-ad description backlog fills at 300/day; pricing does not need it (price, km, year,
class are on the list pages), it only sharpens the paint and condition learning.

## Setup

### 1. Database (Supabase, free)
1. supabase.com → New project → **SQL Editor** → paste `db/schema.sql` → Run.
2. **Project Settings → Database → Connection string → URI** (*Session pooler*), copy it.

### 2. Daily runs (GitHub Actions)
1. Create a GitHub repo and push this folder.
2. **Settings → Secrets and variables → Actions → New repository secret**: `DATABASE_URL` = the URI.
3. **Actions → scrape → Run workflow** once to test.

Minutes: the schedule uses ~100 h/month. A **public** repo has unlimited free Actions minutes
(the database password stays hidden in Secrets); a private repo gets 2,000 min/month, which is not enough.

## Tests

```powershell
py -m pytest -q tests
```
Parsers are tested on page text saved from the live site, the crawler on a local mock site,
and (with `TEST_DATABASE_URL`) a full Postgres round trip.
