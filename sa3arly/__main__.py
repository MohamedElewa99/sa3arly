"""Sa3arly scraper CLI.

  python -m sa3arly probe                      # check every site, save page snapshots to probe_out/
  python -m sa3arly zero  --source hatla2ee    # zero prices (hatla2ee | contactcars)
  python -m sa3arly used  --source dubizzle    # used listings (hatla2ee | contactcars | dubizzle | facebook)
  python -m sa3arly daily                      # everything except facebook (what GitHub Actions runs)

Writes to Postgres when DATABASE_URL is set, otherwise to out/*.jsonl.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import traceback
from collections import Counter
from pathlib import Path

from .common import Fetcher
from .scrapers import contactcars, dubizzle, facebook, hatla2ee, more_sites
from .scrapers.generic import listings_from_json, parse_detail_labels, parse_generic_card
from .store import open_store

USED = {"hatla2ee": hatla2ee, "contactcars": contactcars, "dubizzle": dubizzle, "facebook": facebook,
        "yallamotor": more_sites, "opensooq": more_sites, "sylndr": more_sites}
# Live probe 4 Nov 2026: Dubizzle serves a "Security check" bot challenge, ContactCars answers 403
# after the first page, Facebook shows only price + place to logged-out visitors. Sa3arly does not
# try to get around any of that, so the daily run uses Hatla2ee only.
BLOCKED = {"dubizzle": "bot challenge", "contactcars": "403 after first page", "facebook": "no car details logged out",
           "yallamotor": "403 from the second page (5 Nov 2026)"}
ZERO = {"hatla2ee": hatla2ee, "contactcars": contactcars}


def run_zero(f, store, source, brands=None):
    n = 0
    gen = hatla2ee.scrape_zero(f, brands) if source == "hatla2ee" else contactcars.scrape_zero(f)
    for z in gen:
        store.zero(z)
        n += 1
    print(f"[{source}] zero prices saved: {n}")
    store.run(f"{source}:zero", pages=f.pages, items=n)
    return n


def run_models(f, store):
    n = 0
    for brand, model in hatla2ee.scrape_models(f):
        if hasattr(store, "catalog_model"):
            store.catalog_model(brand, model, "hatla2ee")
        n += 1
    print(f"[hatla2ee] models listed: {n}")
    store.run("hatla2ee:models", pages=f.pages, items=n)
    return n


def run_trims(f, store, max_pages):
    from .scrapers import yallamotor_trims as yt
    done = set()
    for url in store.trim_pages_done():
        p = yt._path(url)
        if len(p) == 3:
            done.add((p[0], p[1], int(p[2])))
    n = 0
    for t in yt.scrape(f, done=done, max_pages=max_pages):
        store.trim_price(t, yt.SOURCE)
        n += bool(t.trim)
    print(f"[yallamotor] versions saved: {n} ({f.pages} pages)")
    store.run("yallamotor:trims", pages=f.pages, items=n)
    return n


def run_used(f, store, source, max_pages, max_details=300):
    mod = USED[source]
    max_pages = max_pages or 100_000        # 0 = no limit: every page until the site itself runs out
    known = store.known_ids(source)
    have = store.all_ids(source) if hasattr(store, "all_ids") else set()
    n = new = 0
    if mod is more_sites:
        gen = more_sites.scrape_used(f, source, max_pages=max_pages)
    else:
        kw = {"max_details": max_details} if source == "hatla2ee" else {}
        gen = mod.scrape_used(f, max_pages=max_pages, known_ids=known, **kw)
    for l in gen:
        store.listing(l)
        n += 1
        new += l.source_id not in have
        if n % 100 == 0:
            print(f"[{source}] {n} listings")
    print(f"[{source}] listings saved: {n} ({new} new, {n - new} refreshed, {f.pages} pages)")
    store.run(f"{source}:used", pages=f.pages, items=n, note=f"{new} new")
    if not n:
        raise RuntimeError(f"{source} gave no ads at all: the site changed or is blocking, check it")
    full_sweep = source in ("opensooq", "sylndr") or max_pages >= 700   # small sites are read whole every run
    if hasattr(store, "mark_removed") and source != "facebook" and full_sweep:
        store.mark_removed(source)          # only after a full sweep, so unseen = really gone
    return n


# ------------------------------------------------------------------ probe

PROBE_PAGES = {
    "hatla2ee_price_change": ("https://eg.hatla2ee.com/en/new-car/price-change/hyundai", None),
    "hatla2ee_model_page": ("https://eg.hatla2ee.com/en/new-car/hyundai/tucson", None),
    "hatla2ee_new_index": ("https://eg.hatla2ee.com/en/new-car", None),
    "hatla2ee_used_list": ("https://eg.hatla2ee.com/en/car", hatla2ee.AD_RE),
    "hatla2ee_used_page2": ("https://eg.hatla2ee.com/en/car/page/2", hatla2ee.AD_RE),
    "contactcars_new_index": ("https://www.contactcars.com/en/new-cars", None),
    "contactcars_new_model": ("https://www.contactcars.com/en/new-cars/mg-zs", None),
    "contactcars_used_list": ("https://www.contactcars.com/en/used-cars", contactcars.AD_RE),
    "dubizzle_used_list": ("https://www.dubizzle.com.eg/en/vehicles/cars-for-sale/", dubizzle.AD_RE),
    "facebook_used_list": ("https://www.facebook.com/marketplace/cairo/vehicles", facebook.AD_RE),
}


def probe(out="probe_out", headless=True):
    d = Path(out)
    shutil.rmtree(d, ignore_errors=True)
    d.mkdir()
    f = Fetcher(min_gap=3, max_gap=6, headless=headless)
    report = []
    try:
        for name, (url, ad_re) in PROBE_PAGES.items():
            row = {"name": name, "url": url}
            try:
                html, text, links = f.get(url, scroll=bool(ad_re))
                (d / f"{name}.html").write_text(html, encoding="utf-8")
                (d / f"{name}.txt").write_text(text, encoding="utf-8")
                (d / f"{name}.links.txt").write_text("\n".join(links), encoding="utf-8")
                row["text_chars"], row["links"] = len(text), len(links)
                # most common link shapes (numbers -> N) to discover ad URL patterns
                shapes = Counter(re.sub(r"\d+", "N", l.split("?")[0]) for l in links)
                row["top_link_shapes"] = shapes.most_common(12)
                if name == "hatla2ee_price_change":
                    row["parsed"] = len(hatla2ee.parse_price_changes(text, "Hyundai", url))
                elif name == "hatla2ee_model_page":
                    row["parsed"] = len(hatla2ee.parse_model_page(text, "Hyundai", url))
                elif name == "contactcars_new_model":
                    row["parsed"] = len(contactcars.parse_new_car_page(text, url))
                if ad_re:
                    cards = f.cards(ad_re)
                    (d / f"{name}.cards.json").write_text(json.dumps(cards[:30], ensure_ascii=False, indent=1), encoding="utf-8")
                    row["ad_cards"] = len(cards)
                    if name.startswith("hatla2ee"):
                        parsed = [hatla2ee.parse_card(c["text"], c["href"]) for c in cards]
                    else:
                        parsed = [parse_generic_card(c["text"], c["href"], name, "x") for c in cards]
                    ok = [p for p in parsed if p]
                    row["cards_parsed"] = len(ok)
                    row["json_ads"] = len(listings_from_json(html, name, lambda dd, s: ""))
                    if ok:
                        row["sample"] = {k: v for k, v in ok[0].dict().items() if v not in (None, {}, "")}
                        # one ad page too
                        try:
                            _, t, _ = f.get(cards[0]["href"])
                            (d / f"{name}.ad.txt").write_text(t, encoding="utf-8")
                            if name.startswith("hatla2ee"):
                                ad = hatla2ee.parse_ad_page(t, ok[0])
                            else:
                                ad = parse_detail_labels(t, ok[0])
                            row["ad_sample"] = {k: (v[:120] if isinstance(v, str) else v)
                                                for k, v in ad.dict().items() if v not in (None, {}, "")}
                        except Exception as e:
                            row["ad_error"] = str(e)
                row["status"] = "OK" if row.get("parsed", 1) and row.get("cards_parsed", 1) else "CHECK"
            except Exception as e:
                row["status"] = "FAIL"
                row["error"] = f"{e}"
                (d / f"{name}.error.txt").write_text(traceback.format_exc(), encoding="utf-8")
            report.append(row)
            print(f"{row['status']:5} {name:24} parsed={row.get('parsed', row.get('cards_parsed', '-'))}")
    finally:
        f.close()
    (d / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    zip_path = shutil.make_archive("probe_out", "zip", d)
    print(f"\nSaved {zip_path} — send this file back so the parsers can be checked against the live sites.")


def main(argv=None):
    ap = argparse.ArgumentParser(prog="sa3arly")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("lockdown", help="row level security on every table, nothing granted to the public API roles")
    p = sub.add_parser("probe")
    p.add_argument("--show", action="store_true", help="open a visible browser window")
    z = sub.add_parser("zero")
    z.add_argument("--source", choices=ZERO, required=True)
    z.add_argument("--brands", help="comma-separated slugs, e.g. hyundai,kia (default: all)")
    sub.add_parser("models", help="every model of every brand on Hatla2ee (old ones too), for the app's pickers")
    tp = sub.add_parser("trims", help="every version of every model year with its price new (YallaMotor), resumable")
    tp.add_argument("--max-pages", type=int, default=1500)
    cc = sub.add_parser("catalog", help="print what the app's pickers show for some makes")
    cc.add_argument("--makes", default="Alfa Romeo,Proton,Hyundai")
    cc.add_argument("--top", type=int, default=0, help="instead: the N models with the most ads, all makes")
    u = sub.add_parser("used")
    u.add_argument("--source", choices=USED, required=True)
    u.add_argument("--max-pages", type=int, default=0, help="stop after this many list pages (0 = read every page to the end of the site)")
    u.add_argument("--max-details", type=int, default=300,
                   help="ad pages to open for description/colour/posted date (new ads only)")
    pr = sub.add_parser("price", help="fair market range for one car")
    pr.add_argument("--make", required=True)
    pr.add_argument("--model", required=True)
    pr.add_argument("--year", type=int, required=True)
    pr.add_argument("--km", type=int, required=True)
    pr.add_argument("--trim", default=None, help="e.g. VZ, Highline — narrows to the same trim when enough ads")
    pr.add_argument("--paint", default="", help="e.g. hood=repainted,door_fl=replaced")
    pr.add_argument("--repair", action="append", default=[], help="min-max EGP, e.g. 15000-35000 (repeatable)")
    bm = sub.add_parser("benchmark", help="compare Sa3arly ranges with Hatla2ee's own min/max on saved ads")
    bm.add_argument("--limit", type=int, default=200)
    im = sub.add_parser("import", help="import pages saved with the Sa3arly browser button")
    im.add_argument("--folder", default=str(Path.home() / "Downloads"))
    tn = sub.add_parser("train", help="train the AI price model on recent ads and store it in the database")
    tn.add_argument("--days", type=int, default=365)
    tn.add_argument("--min-rows", type=int, default=500)
    tn.add_argument("--experiment", action="store_true", help="compare model setups on the same split, save nothing")
    dl = sub.add_parser("daily")
    dl.add_argument("--max-pages", type=int, default=60)
    a = ap.parse_args(argv)

    if a.cmd == "lockdown":
        import os
        import psycopg
        from .secure import lockdown
        with psycopg.connect(os.environ["DATABASE_URL"], autocommit=True) as cx:
            before = cx.execute("select count(*) from pg_tables where schemaname = 'public' and not rowsecurity").fetchone()[0]
            left = lockdown(cx)
            grants = cx.execute("select count(*) from information_schema.role_table_grants where table_schema = 'public' and grantee in ('anon', 'authenticated')").fetchone()[0]
        print(f"[lockdown] tables without row level security: {before} before, {left} now; grants left to the public roles: {grants}")
        return 1 if left or grants else 0
    if a.cmd == "probe":
        return probe(headless=not a.show)

    if a.cmd == "catalog":
        import os
        import time
        import os
        import psycopg
        from .web_api import catalog
        cx = psycopg.connect(os.environ["DATABASE_URL"])
        t0 = time.time()
        c = catalog(cx)
        print(f"[catalog] {len(c['makes'])} makes, {sum(len(v) for v in c['makes'].values())} models in {time.time() - t0:.1f}s")
        if a.top:
            allm = sorted(((i["n"], mk, mo, i) for mk, ms in c["makes"].items() for mo, i in ms.items()), key=lambda x: -x[0])
            for n, mk, mo, info in allm[:a.top]:
                print(f"[top] {mk} | {mo} | years {info['years'][0]}-{info['years'][-1]} | ads {n} | official {bool(info.get('trimsByYear'))} | trims: {' < '.join(info['trims'][:8])}")
            return 0
        for mk in a.makes.split(","):
            for mo, info in sorted((c["makes"].get(mk.strip()) or {}).items()):
                print(f"[catalog] {mk} | {mo} | years {info['years'][0]}-{info['years'][-1]} | ads {info['n']} | trims: {' < '.join(info['trims'][:8])}")
        return 0

    if a.cmd == "train":
        import os
        import psycopg
        from . import ml
        with psycopg.connect(os.environ["DATABASE_URL"], autocommit=True) as cx:
            rows = ml.load_rows(cx, a.days)
            print(f"[train] {len(rows):,} ads from the last {a.days} days")
            if len(rows) < a.min_rows:
                print("[train] too few ads, keeping the current model")
                return 0
            if a.experiment:
                for name, m in ml.experiment(rows, cx).items():
                    print(f"[train] {name:24s} {m}")
                return 0
            model, metrics = ml.train(rows)
            model["blend"] = ml.learn_weights(cx, rows)
            print(f"[train] learned weights: { {k: v for k, v in model['blend'].items() if k != 'eval'} }")
            mid = ml.save(cx, model)
            print(f"[train] saved model #{mid}: {metrics}")
        return 0

    if a.cmd in ("price", "benchmark"):
        import os
        import psycopg
        from .pricing import Pricer
        cx = psycopg.connect(os.environ["DATABASE_URL"])
        pricer = Pricer(cx)
        if a.cmd == "price":
            paint = dict(kv.split("=", 1) for kv in a.paint.split(",") if "=" in kv)
            reps = [tuple(int(x) for x in r.split("-", 1)) for r in a.repair]
            q = pricer.quote(a.make, a.model, a.year, a.km, paint, reps, trim=a.trim)
            print(q.text())
            for c in q.comparables[:5]:
                print(f"   {c.source:9} {c.year} {c.km or 0:>7,} km  {c.price:>11,}  {c.url}")
            return 0
        rows = cx.execute("""select l.make_raw, l.model_raw, l.year, l.km, (l.raw->>'hatla2ee_market_min')::int,
                                    (l.raw->>'hatla2ee_market_max')::int, l.source_id
                             from listings l where l.raw ? 'hatla2ee_market_min' and l.km is not null
                             order by l.id desc limit %s""", (a.limit,)).fetchall()
        n = inside = overlap = 0
        errs = []
        for make, model, year, km, mn, mx, sid in rows:
            q = pricer.quote(make, model, year, km)
            if not q.mid or not mn or not mx:
                continue
            n += 1
            # Hatla2ee's own band sits below asking prices (checked: deal basis fits it better), so compare as is
            mid_a, low_a, high_a = q.mid, q.low, q.high
            ref = (mn + mx) / 2
            errs.append(abs(mid_a - ref) / ref)
            inside += mn <= mid_a <= mx
            overlap += not (high_a < mn or low_a > mx)
        if n:
            errs.sort()
            print(f"cars compared: {n}\nSa3arly midpoint inside Hatla2ee's min–max: {inside/n:.0%}\n"
                  f"ranges overlap: {overlap/n:.0%}\nmedian gap between midpoints: {errs[len(errs)//2]:.1%}")
        else:
            print("no comparable cars yet")
        return 0

    if a.cmd == "import":
        from .capture.importer import import_folder
        store = open_store()
        try:
            st = import_folder(store, a.folder)
        finally:
            store.close()
        print(f"imported {st['saved']} ads from {st['files']} pages ({st['skipped']} skipped) — files moved to "
              f"{Path(a.folder) / 'sa3arly-imported'}")
        return 0

    store = open_store()
    f = Fetcher()
    failures = 0
    try:
        if a.cmd == "zero":
            run_zero(f, store, a.source, a.brands.split(",") if a.brands else None)
        elif a.cmd == "models":
            run_models(f, store)
        elif a.cmd == "trims":
            from .scrapers.yallamotor_trims import HttpFetcher
            hf = HttpFetcher()
            try:
                run_trims(hf, store, a.max_pages)
            finally:
                hf.close()
        elif a.cmd == "used":
            if a.source in BLOCKED:
                print(f"[{a.source}] warning: {BLOCKED[a.source]} at last probe — expect few or no results")
            run_used(f, store, a.source, a.max_pages, a.max_details)
        else:
            jobs = [("zero", "hatla2ee"), ("used", "hatla2ee"), ("used", "opensooq"), ("used", "sylndr")]
            for kind, src in jobs:
                try:
                    run_zero(f, store, src) if kind == "zero" else run_used(f, store, src, a.max_pages)
                except Exception as e:   # one site failing never stops the others
                    failures += 1
                    print(f"[{src}] {kind} FAILED: {e}", file=sys.stderr)
                    store.run(f"{src}:{kind}", errors=1, note=str(e)[:500])
                    if f.blocked:
                        f.close()
                        f = Fetcher()
    finally:
        f.close()
        store.close()
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
