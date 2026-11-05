"""Card texts copied from the live pages (5 Nov 2026)."""
from sa3arly.scrapers.more_sites import parse_sooq_card, parse_sylndr_card, parse_yalla_card

YALLA = ("4\nUsed Renault Fluence 1.6L LE 2016\n560,000\nEGP\nExact match\nرينو فلوانس 2016 فابريكه بالكامل\n"
         "Year\n2016\nMileage\n158,000 KM\nFuel type\nPetrol\nTransmission\nCVT\nRegional specs\nEuropean Specs\n"
         "Cairo\nPerfect Inside And Out\nNo Accident History\nShow Number\nWhatsApp\nView details")
YALLA_URL = "https://egypt.yallamotor.com/used-cars/renault/fluence/2016/used-renault-fluence-2016-cairo-2154689?utm_source=used_cars_search"

SOOQ = ("3\nVerified User\n320,000 EGP\nجيلى امجراند 7 2015 السياره بها رخصة سنتين مرور الإسكندرية مانيوال فبريكا بالكامل\n"
        "2015\nGeely\nEmgrand\nX7\nUsed\n2,250 km\nGasoline\nOther Specs\nFifth Settlement, Cairo\nCars for Sale\n011478280XX\nChat\n7 hours ago")

SYL = "New Price\nChery Tiggo 7\n2023\n•\n1st Category\n•\n93K KM\n860,000\nEGP\n17,443\n/\nmonth"
SYL_URL = "https://sylndr.com/en/car-details/used-cars/chery/tiggo-7/0a1b2c3d-1111-2222-3333-6ba95c2bea22"


def test_yalla():
    l = parse_yalla_card(YALLA, YALLA_URL)
    assert (l.source_id, l.make_raw, l.model_raw, l.year, l.km, l.price_egp, l.transmission, l.city) == \
        ("2154689", "Renault", "fluence", 2016, 158_000, 560_000, "automatic", "Cairo")
    assert l.description == "رينو فلوانس 2016 فابريكه بالكامل"
    assert l.raw["badges"] == ["Perfect Inside And Out", "No Accident History"] and l.trim_raw == "1.6L LE"
    assert "?" not in l.url


def test_sooq():
    l = parse_sooq_card(SOOQ, "https://eg.opensooq.com/en/search/289647350")
    assert (l.source_id, l.price_egp, l.year, l.make_raw, l.model_raw, l.trim_raw, l.km, l.fuel, l.city, l.governorate) == \
        ("289647350", 320_000, 2015, "Geely", "Emgrand", "X7", 2_250, "gasoline", "Fifth Settlement, Cairo", "Cairo")
    assert "فبريكا بالكامل" in l.description


def test_sooq_skips_new_cars():
    assert parse_sooq_card(SOOQ.replace("\nUsed\n", "\nNew\n"), "https://eg.opensooq.com/en/search/1234567") is None


def test_sylndr():
    l = parse_sylndr_card(SYL, SYL_URL)
    assert (l.make_raw, l.model_raw, l.year, l.trim_raw, l.km, l.price_egp, l.raw["installment_egp"]) == \
        ("Chery", "Tiggo 7", 2023, "1st Category", 93_000, 860_000, 17_443)
    assert l.raw["fixed_price_inspected"] and l.raw["badges"] == ["New Price"]
