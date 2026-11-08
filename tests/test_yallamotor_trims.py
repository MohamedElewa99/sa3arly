from sa3arly.scrapers import yallamotor_trims as yt

PAGE = """Hyundai Verna 2018 in Egypt
Available Versions : 6
Hyundai Verna 2018 Price and versions in Egypt
Hyundai Verna 2018 1.6 GL M/T (Base)

2018
EGP 159,500
Hyundai Verna 2018 1.6 GLS A/T (Tinted Glass)
2018
EGP 186,900
Hyundai Verna 2018 1.6 GLS M/T
2018
Price Coming Soon
Looking for Older Hyundai Verna 2018 Models?
"""


def test_year_page():
    rows = yt.parse_year_page(PAGE, "hyundai", "https://egypt.yallamotor.com/new-cars/hyundai/verna/2018")
    assert [(r.make_raw, r.model_raw, r.model_year, r.trim, r.price_egp) for r in rows] == [
        ("Hyundai", "Verna", 2018, "1.6 GL M/T (Base)", 159500), ("Hyundai", "Verna", 2018, "1.6 GLS A/T (Tinted Glass)", 186900)]
    mb = yt.parse_year_page("Mercedes-Benz C-Class 2015 in Egypt\nMercedes-Benz C-Class 2015 C 180\nEGP 500,000", "mercedes-benz", "u")
    assert mb[0].make_raw == "Mercedes-Benz" and mb[0].model_raw == "C-Class" and mb[0].trim == "C 180"


def test_links():
    L = ["https://egypt.yallamotor.com/new-cars/hyundai", "https://egypt.yallamotor.com/new-cars/hyundai/verna",
         "https://egypt.yallamotor.com/new-cars/hyundai/verna/2016", "https://egypt.yallamotor.com/new-cars/hyundai/prices",
         "https://egypt.yallamotor.com/new-cars/kia/rio/2015?x=1"]
    assert yt.make_links(L) == ["hyundai"]
    assert yt.model_links(L, "hyundai") == ["verna"]
    assert yt.year_links(L, "hyundai", "verna") == [2016]
