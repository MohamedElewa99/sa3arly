"""Parsers on page text saved from the live Hatla2ee site (probe, 4 Nov 2026)."""
import json
from pathlib import Path

from sa3arly.common import Listing
from sa3arly.normalize import split_zero_name
from sa3arly.scrapers import hatla2ee as h

FX = Path(__file__).parent / "fixtures"


def test_model_page_classes_official_and_market():
    rows = h.parse_model_page((FX / "hatla2ee_model_tucson.txt").read_text(encoding="utf-8"), "Hyundai", "u")
    by = {(r.full_name, r.model_year): r for r in rows}
    assert len(rows) == 13                                   # 7 classes 2027 + 6 classes 2025
    r27 = by[("Hyundai Tucson 2027 A/T / SHADOW", 2027)]
    assert (r27.price_egp, r27.market_price_egp) == (1_850_000, None)
    r25 = by[("Hyundai Tucson 2025 A/T / N-Line", 2025)]
    assert (r25.price_egp, r25.market_price_egp) == (2_099_000, 2_099_000)
    assert not any("Used" in r.full_name for r in rows)


def test_price_change_live_page():
    rows = h.parse_price_changes((FX / "hatla2ee_price_change_live.txt").read_text(encoding="utf-8"), "Hyundai", "u")
    first = rows[0]
    assert (first.full_name, first.old_price_egp, first.price_egp, first.effective_on) == \
        ("Hyundai Tucson A/T / SHADOW 2027", 1_625_000, 1_700_000, "2026-05-06")
    assert all(r.model_year and r.old_price_egp and r.price_egp for r in rows)
    assert len(rows) >= 20


def test_live_cards_all_parse():
    cards = json.loads((FX / "hatla2ee_cards_live.json").read_text(encoding="utf-8"))
    parsed = [h.parse_card(c["text"], c["href"]) for c in cards]
    assert all(parsed)
    t = parsed[0]
    assert (t.title, t.year, t.km, t.price_egp, t.city, t.governorate, t.make_raw, t.model_raw) == \
        ("Hyundai Tucson GDI 2021", 2021, 125_000, 1_370_000, "Nasr city, Cairo", "Cairo", "Hyundai", "Tucson GDI")
    skoda = next(p for p in parsed if p.source_id == "7303710")
    assert "Personal Use" in skoda.raw["badges"] and skoda.city == "Tagamo3 - New Cairo, Cairo"


def test_financed_card_with_installment():
    txt = ("View All (9)\nNext slide\n1 / 9\nPremium\nHyundai Tucson 2022\n2022\n97,000 KM\nAutomatic\nGas\n"
           "1,750,000 EGP\n10,000\nEGP\n/mo\nIsmailia\nHyundai\nTucson\nA/T / Shadow\nFinanced\nCall")
    l = h.parse_card(txt, "https://eg.hatla2ee.com/en/car/hyundai/tucson/7300001")
    assert (l.price_egp, l.raw["installment_egp"], l.city, l.trim_raw) == (1_750_000, 10_000, "Ismailia", "A/T / Shadow")
    assert l.raw["badges"] == ["Premium", "Financed"]


def test_live_ad_page():
    l = Listing(source="hatla2ee", source_id="7298753", url="u")
    h.parse_ad_page((FX / "hatla2ee_ad_live.txt").read_text(encoding="utf-8"), l)
    assert (l.color, l.posted_on, l.photo_count) == ("Silver", "2026-10-06", 9)
    assert l.description.startswith("فابريكة بالكامل") and "إمكانية الكشف" in l.description
    assert (l.raw["hatla2ee_market_min"], l.raw["hatla2ee_market_max"]) == (1_377_000, 1_445_000)


def test_split_names_keep_numeric_models():
    assert split_zero_name("Hyundai Tucson 2025 A/T / SHADOW", "Hyundai", year=2025) == ("Tucson", "A/T / SHADOW")
    assert split_zero_name("Peugeot 2008 2026 A/T / Active", "Peugeot", year=2026) == ("2008", "A/T / Active")
