from pathlib import Path
from sa3arly.common import Listing
from sa3arly.scrapers import hatla2ee as h

FX = Path(__file__).parent / "fixtures"


def test_price_changes_multiline():
    rows = h.parse_price_changes((FX / "hatla2ee_price_change_a.txt").read_text(encoding="utf-8"), "Opel")
    assert [(r.full_name, r.old_price_egp, r.price_egp, r.effective_on) for r in rows] == [
        ("Opel Mokka A/T / Black Edition 2026", 1_390_000, 1_550_000, "2026-04-15"),
        ("Opel Corsa A/T / Sport Topline Plus 2026", 1_150_000, 1_250_000, "2026-04-15"),
        ("Opel Mokka A/T / Black Edition 2026", 1_490_000, 1_390_000, "2025-09-14"),
    ]
    assert all(r.model_year == 2026 for r in rows)


def test_price_changes_single_line_with_trend_word():
    rows = h.parse_price_changes((FX / "hatla2ee_price_change_b.txt").read_text(encoding="utf-8"), "Opel")
    assert [(r.full_name, r.old_price_egp, r.price_egp) for r in rows] == [
        ("Opel Grandland A/T / Top Line 2024", 2_074_990, 1_849_990),
        ("Opel Grandland A/T / Highline + 2024", 1_949_990, 1_699_990),
        ("Opel Mokka A/T / GS Line 2024", 1_749_990, 1_549_990),
    ]


def test_card():
    l = h.parse_card((FX / "hatla2ee_card.txt").read_text(encoding="utf-8"), "https://eg.hatla2ee.com/en/car/hyundai/elantra/7228179")
    assert (l.source_id, l.year, l.km, l.transmission, l.fuel, l.price_egp, l.city, l.governorate,
            l.make_raw, l.model_raw) == ("7228179", 2022, 80_000, "automatic", "gas", 830_000,
                                         "El Haram, Giza", "Giza", "Hyundai", "Elantra")


def test_ad_page():
    l = Listing(source="hatla2ee", source_id="7210670", url="x")
    h.parse_ad_page((FX / "hatla2ee_ad.txt").read_text(encoding="utf-8"), l)
    assert l.color == "Black" and l.posted_on == "2026-04-30" and l.city == "Giza"
    assert l.description.startswith("فئاه اولا")
    assert l.raw["hatla2ee_market_min"] == 1_012_000 and l.raw["hatla2ee_market_max"] == 1_090_000


def test_card_with_trim_and_badge():
    txt = "Hyundai Elantra AD 2019\n2019\n104,000 KM\nAutomatic\nDiesel\n800,000\nEGP\nGiza\nHyundai\nElantra AD\nA/T / GL SR AD\nCall"
    l = h.parse_card(txt, "https://eg.hatla2ee.com/en/car/hyundai/Elantra-AD/7000001")
    assert (l.model_raw, l.trim_raw, l.fuel, l.km) == ("Elantra AD", "A/T / GL SR AD", "diesel", 104_000)
    txt2 = "Hyundai Elantra AD 2016\n2016\n72,000 KM\nAutomatic\nGas\n900,000\nEGP\nZagazig, Sharqia\nHyundai\nElantra AD\nDisabled\nCall"
    l2 = h.parse_card(txt2, "https://eg.hatla2ee.com/en/car/hyundai/Elantra-AD/7000002")
    assert l2.raw["badges"] == ["Disabled"] and l2.trim_raw is None and l2.governorate == "Sharqia"


def test_brand_page_lists_every_model():
    from sa3arly.scrapers.hatla2ee import parse_brand_models
    text = "Used Alfa Romeo cars for sale in Egypt\nOther Models\nStelvio\n(6)\n156\n(5)"
    links = ["https://eg.hatla2ee.com/en/car/alpha-romeo/Stelvio", "https://eg.hatla2ee.com/en/car/alpha-romeo/156",
             "https://eg.hatla2ee.com/en/car/alpha-romeo/Giulietta%20Quadrifoglio%20Verde",
             "https://eg.hatla2ee.com/en/car/alpha-romeo/year/2020", "https://eg.hatla2ee.com/en/car/alpha-romeo/body",
             "https://eg.hatla2ee.com/en/car/alpha-romeo/Stelvio/year/2026", "https://eg.hatla2ee.com/en/car/kia/Rio"]
    brand, models = parse_brand_models(text, links, "alpha-romeo")
    assert brand == "Alfa Romeo" and models == ["Stelvio", "156", "Giulietta Quadrifoglio Verde"]
