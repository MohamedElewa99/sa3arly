"""Trims of popular older models in Egypt, lowest first, for the years official price lists don't cover.

Checked against YallaMotor's price lists of those years and Hatla2ee's model reviews (Nov 2026). Names follow the
classes Hatla2ee sellers pick in their ads, so a quote still finds ads of the same trim.
(make, model family, first year, last year, trims lowest first[, 'exact']) — the family also covers 'Lancer EX',
'Lancer Shark'…, unless 'exact' (plain 'Elantra' is not 'Elantra AD').
"""
REF = [
    ("Hyundai", "Verna", 2006, 2019, ["M/T GL", "M/T GL (Tinted glass)", "M/T GLS", "M/T GLS (Tinted glass)", "A/T GLS", "A/T GLS (Tinted glass)"]),
    ("Hyundai", "Elantra HD", 2007, 2016, ["M/T GL", "A/T GL", "A/T GLS", "A/T GLS Full Option"]),
    ("Hyundai", "Elantra HD", 2017, 2024, ["A/T GL", "A/T GL SR", "A/T GL DAB ABS", "A/T GL Highline"]),
    ("Hyundai", "Elantra MD", 2011, 2016, ["M/T GL", "A/T GL", "A/T GLS", "A/T GLS Full Option"]),
    ("Hyundai", "Elantra", 2017, 2020, ["A/T GL", "A/T GL SR", "A/T GL DAB ABS", "A/T GL Highline", "A/T GLS Exclusive",
                                        "A/T GLS Full Option", "A/T GLS Limited"], "exact"),
    ("Hyundai", "Accent RB", 2011, 2026, ["M/T GL", "A/T GL", "A/T SR", "A/T DAB ABS", "A/T Highline"]),
    ("Kia", "Cerato", 2014, 2018, ["LX", "EX", "EX Sunroof", "Top"]),
    ("Kia", "Cerato", 2019, 2025, ["LX", "EX", "MPI Highline", "SX"]),
    ("Nissan", "Sentra", 2013, 2019, ["S", "SV", "Premium S", "Premium SV"]),
    ("Mitsubishi", "Lancer", 2008, 2020, ["1.6 GLX", "1.6 GLS", "2.0 GT"]),
    ("Renault", "Logan", 2015, 2023, ["M/T / E1", "A/T / E1", "A/T / E2", "A/T / E3"]),
    ("Chevrolet", "Aveo", 2012, 2020, ["1.5 M/T", "1.5 A/T", "1.5 A/T Highline"]),
]


def _slug(s: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")


def ref_for(make: str, model: str, years: set) -> dict:
    """{year: trims} from REF for this model (or its family, the longest name that fits wins) in the years given."""
    me, out, best = _slug(model), {}, {}
    for mk, fam, y0, y1, trims, *flags in REF:
        f = _slug(fam)
        if _slug(mk) != _slug(make) or not (me == f or (me.startswith(f + "-") and "exact" not in flags)):
            continue
        for y in range(y0, y1 + 1):
            if y in years and len(f) >= best.get(y, -1):
                out[y], best[y] = trims, len(f)
    return out
