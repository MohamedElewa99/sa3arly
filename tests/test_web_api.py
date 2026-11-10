"""App API queries on the same synthetic market as the pricing tests (needs TEST_DATABASE_URL)."""
import pytest

from tests.test_pricing import URL, db, true_price  # noqa: F401  (db is the shared fixture)

pytestmark = pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")


def test_catalog_lists_models_with_enough_ads(db):
    from sa3arly.web_api import catalog
    c = catalog(db)
    elantra = c["makes"]["Hyundai"]["Elantra AD"]
    assert elantra["n"] >= 40 and elantra["years"] == [2019, 2020, 2021]
    assert elantra["body"] == "sedan" and elantra["trims"]
    # anchor price = asking price at 2022 / 60,000 km, close to the known market
    assert abs(elantra["ref"] / (true_price(2022, 60_000) / 0.95) - 1) < 0.15
    assert "Formentor" in c["makes"]["Cupra"]             # few ads still listed: every model we know is pickable
    assert c["default"]["make"] == "Hyundai" and c["default"]["model"] == "Elantra AD"


def test_quote_is_a_range_with_comparables(db):
    from sa3arly.web_api import quote
    q = quote(db, "Hyundai", "Elantra AD", 2020, 100_000)
    truth = true_price(2020, 100_000)
    assert q["low"] <= truth <= q["high"]
    assert q["n"] >= 30 and q["comparables"] and all("adjusted" in c for c in q["comparables"])


def test_market_shows_zero_changes_and_cheap_new_ads(db):
    from sa3arly.web_api import market
    mk = db.execute("select id from makes where name_en = 'Hyundai'").fetchone()[0]
    mo = db.execute("select id from models where make_id = %s", (mk,)).fetchone()[0]
    db.execute("""insert into zero_price_changes (make_id, model_id, trim_name, model_year, old_price_egp, new_price_egp, changed_on, source)
                  values (%s, %s, 'Top', 2026, 1200000, 1230000, current_date, 'hatla2ee')""", (mk, mo))
    db.execute("""insert into listings (source, source_id, url, make_id, model_id, year, km, price_egp)
                  values ('hatla2ee', 'cheap', 'c', %s, %s, 2020, 90000, 700000)""", (mk, mo))
    items = market(db)["items"]
    zero = [i for i in items if i["t"] == "zero"]
    deals = [i for i in items if i["t"] == "deal"]
    assert zero and zero[0]["delta"] == 30000 and zero[0]["up"] and zero[0]["car"]["model"] == "Elantra AD"
    assert "فئة Top" in zero[0]["name"] and zero[0]["old"] == 1200000
    assert any(d["price"] == 700000 and d["delta"] < -10 and d["km"] == 90000 and d["median"] > 700000 and d["url"] == "c" for d in deals)


def test_junk_names():
    from sa3arly.web_api import _junk
    assert _junk("Other") and _junk(" others ") and _junk("أخرى") and not _junk("Corolla")


def test_zero_drilldown(db):
    from datetime import date, timedelta
    from sa3arly.common import ZeroPrice
    from sa3arly.store import PgStore
    from sa3arly.web_api import zero
    s = PgStore(URL)
    old = (date.today() - timedelta(days=20)).isoformat()
    s.zero(ZeroPrice(source="hatla2ee", make_raw="Cupra", full_name="Cupra Formentor 2026 VZ", model_year=2026,
                     price_egp=2_500_000, effective_on=old))
    s.zero(ZeroPrice(source="hatla2ee", make_raw="Cupra", full_name="Cupra Formentor 2026 VZ", model_year=2026,
                     price_egp=2_600_000, effective_on=date.today().isoformat()))
    s.flush()
    s.close()
    makes = zero(db)
    assert makes["level"] == "makes" and any(m["make"] == "Cupra" and m["from"] == 2_049_000 for m in makes["items"])
    models = zero(db, "cupra")
    assert models["items"][0]["model"] == "Formentor" and models["items"][0]["trims"] == 2
    trims = zero(db, "Cupra", "Formentor")["items"]
    assert [t["price"] for t in trims] == [2_049_000, 2_600_000]                     # cheapest first
    vz = trims[1]
    assert vz["trim"] == "VZ" and vz["prev"] == 2_500_000 and vz["change"] == 100_000 and len(vz["history"]) == 2
    assert trims[0]["trim"] == "Automatic"


def test_official_trims_lowest_first_and_per_year():
    from sa3arly.web_api import _official_trims, _merge_case
    allt, per = _official_trims([(2025, 900, "Top"), (2025, 700, "Base"), (2025, 800, "Mid"), (2025, 820, "Mid"),
                                 (2019, 300, "Base"), (2019, 380, "Old Luxury")])
    assert per[2025] == ["Base", "Mid", "Top"] and per[2019] == ["Base", "Old Luxury"]
    assert allt.index("Base") == 0 and allt.index("Old Luxury") > allt.index("Mid")
    assert _merge_case(["1st Category", "1st category", "1st Category"]) == {"1st category": "1st Category"}


def test_catalog_lists_models_with_no_ads(db):
    from sa3arly.web_api import catalog, _trims_by_level
    assert _trims_by_level([]) == []
    db.execute("create table if not exists model_catalog (model_id int primary key references models(id), source text not null, seen_on date not null default current_date)")
    mk = db.execute("insert into makes (slug, name_en) values ('alfa-romeo', 'Alfa Romeo') on conflict (slug) do update set slug = excluded.slug returning id").fetchone()[0]
    mo = db.execute("insert into models (make_id, slug, name_en) values (%s, 'giulietta', 'Giulietta') on conflict (make_id, slug) do update set slug = excluded.slug returning id", (mk,)).fetchone()[0]
    db.execute("insert into model_catalog (model_id, source) values (%s, 'hatla2ee') on conflict do nothing", (mo,))
    try:
        g = catalog(db)["makes"]["Alfa Romeo"]["Giulietta"]
        assert g["trims"] == ["Standard"] and g["n"] == 0 and g["years"]
    finally:
        db.execute("drop table model_catalog")


def test_family_trims():
    from sa3arly.web_api import _family_trims
    zmap = {("Hyundai", "Elantra"): [(2010, 100, "GL", None), (2010, 120, "GLS", None), (2020, 300, "Top", None)],
            ("Hyundai", "Verna"): [(2010, 90, "GL", None)]}
    assert sorted(_family_trims(zmap, "Hyundai", "Elantra HD", {2009, 2010})) == [(2010, 100, "GL"), (2010, 120, "GLS")]
    assert _family_trims(zmap, "Hyundai", "Accent", {2010}) == []


def test_researched_trims():
    from sa3arly.trims_ref import ref_for
    r = ref_for("Hyundai", "Elantra HD", {2010, 2018, 2030})
    assert r[2010][0] == "M/T GL" and r[2018][-1] == "A/T GL Highline" and 2030 not in r
    assert ref_for("Mitsubishi", "Lancer EX Shark", {2016})[2016] == ["1.6 GLX", "1.6 GLS", "2.0 GT"]
    assert ref_for("Hyundai", "Elantra AD", {2018}) == {}            # its own official trims, not plain Elantra's


def test_fix_official_names():
    from sa3arly.web_api import _fix_official as f
    assert f("GAC", "GS4 Automtic / GE", "GAC GS4 2025 Automtic / GE") == ("GS4", "A/T / GE")
    assert f("BMW", "IX2 Automtic", "BMW IX2 Automtic 2027") == ("IX2", "A/T")
    assert f("Hyundai", "Elantra", "A/T / Smart") == ("Elantra", "A/T / Smart")


def test_lockdown_leaves_no_open_table(db):
    from sa3arly import secure
    from pathlib import Path
    db.execute("create table if not exists zz_open (id int)")
    assert secure.lockdown(db) == 0
    assert db.execute("select rowsecurity from pg_tables where tablename = 'zz_open'").fetchone()[0] is True
    assert (Path(__file__).parent.parent / "db/migrations/007_lockdown.sql").read_text() == secure.LOCKDOWN
    db.execute("drop table zz_open")
