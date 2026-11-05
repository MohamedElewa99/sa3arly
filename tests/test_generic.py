from sa3arly.common import Listing, parse_price, parse_km
from sa3arly.normalize import split_zero_name, make_slug
from sa3arly.scrapers import contactcars
from sa3arly.scrapers.generic import parse_generic_card, km_from_value, parse_detail_labels


def test_price_and_km_formats():
    assert parse_price("EGP 1,300,000") == 1_300_000
    assert parse_price("1.3 مليون") == 1_300_000
    assert parse_price("٨٥٠٬٠٠٠ ج.م") == 850_000
    assert parse_km("120K km") == 120_000
    assert parse_km("80 ألف كم") == 80_000
    assert km_from_value("100,000 to 119,999") == 109_999
    assert km_from_value("140,000 KM") == 140_000


def test_facebook_style_card():
    l = parse_generic_card("EGP850,000\n2019 Hyundai Elantra\nCairo, Egypt\n120K km", "u", "facebook", "1")
    assert (l.price_egp, l.year, l.km, l.title) == (850_000, 2019, 120_000, "2019 Hyundai Elantra")


def test_dubizzle_style_card_and_detail():
    l = parse_generic_card("EGP 1,050,000\nHyundai Elantra AD 2020\n2020\n100,000 - 119,999 km\nAutomatic\nNasr City, Cairo\n2 days ago",
                           "https://www.dubizzle.com.eg/en/ad/x-ID123.html", "dubizzle", "123")
    assert (l.price_egp, l.year, l.transmission, l.raw["posted_ago"]) == (1_050_000, 2020, "automatic", "2 days ago")
    d = parse_detail_labels("Details\nBrand\nHyundai\nModel\nElantra\nYear\n2020\nKilometers\n100000 to 119999\n"
                            "Fuel Type\nBenzine\nColor\nSilver\nDescription\nفابريكا بالكامل ماعدا الكبوت رش\nLocation\nNasr City",
                            Listing(source="dubizzle", source_id="1", url="u"))
    assert (d.make_raw, d.model_raw, d.km, d.color, d.raw["km_raw"]) == ("Hyundai", "Elantra", 109_999, "Silver", "100000 to 119999")
    assert d.description == "فابريكا بالكامل ماعدا الكبوت رش"


def test_contactcars_new_price_row():
    rows = contactcars.parse_new_car_page("| MG ZS 2025 Other Trims | 980,000 EGP |\n| Toyota Urban Cruiser 2024 Other Trims | 1,600,000 EGP |", "u")
    assert [(r.full_name, r.price_egp, r.model_year) for r in rows] == [
        ("MG ZS 2025 Other Trims", 980_000, 2025), ("Toyota Urban Cruiser 2024 Other Trims", 1_600_000, 2024)]


def test_split_zero_name():
    assert split_zero_name("Opel Mokka A/T / Black Edition 2026", "Opel") == ("Mokka", "A/T / Black Edition")
    assert split_zero_name("Hyundai Elantra AD A/T / Smart 2025", "Hyundai", ["Elantra", "Elantra AD"]) == ("Elantra AD", "A/T / Smart")
    assert make_slug("Mercedes-Benz") == "mercedes" and make_slug("هيونداي") == "hyundai"
