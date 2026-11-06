"""Make / model / trim resolution across sites."""
from __future__ import annotations

import re
from typing import Optional

from .common import slugify

# Same make, different spellings across sites -> one slug.
MAKE_ALIASES = {
    "mercedes-benz": "mercedes", "mercedes benz": "mercedes", "mercedesbenz": "mercedes", "مرسيدس": "mercedes",
    "vw": "volkswagen", "فولكس": "volkswagen", "هيونداي": "hyundai", "هيونداى": "hyundai",
    "كيا": "kia", "تويوتا": "toyota", "نيسان": "nissan", "شيفروليه": "chevrolet",
    "chevy": "chevrolet", "شيري": "chery", "شيرى": "chery", "ام جي": "mg", "إم جي": "mg",
    "بي ام دبليو": "bmw", "بى ام دبليو": "bmw", "رينو": "renault", "بيجو": "peugeot",
    "سكودا": "skoda", "اوبل": "opel", "أوبل": "opel", "فيات": "fiat", "ميتسوبيشي": "mitsubishi",
    "سوزوكي": "suzuki", "هوندا": "honda", "مازدا": "mazda", "جيلي": "geely", "بروتون": "proton",
    "citroën": "citroen", "ستروين": "citroen", "سيات": "seat", "لادا": "lada", "دايو": "daewoo",
}

TRIM_START = re.compile(r"(?i)^(a/t|m/t|at|mt|cvt|dct|automatic|manual|\d\.\d|[\w+]+/[\w+]*)$")


def make_slug(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    s = raw.strip().lower()
    return MAKE_ALIASES.get(s, slugify(MAKE_ALIASES.get(slugify(s), s)))


def model_slug(raw: Optional[str]) -> Optional[str]:
    return slugify(raw) if raw else None


def split_zero_name(full_name: str, make: str, known_models: list[str] | None = None,
                    year: int | None = None) -> tuple[str, str]:
    """'Opel Mokka A/T / Black Edition 2026' -> ('Mokka', 'A/T / Black Edition').

    Only the model-year token is removed (the last one), so 'Peugeot 2008 2026 ...' keeps '2008'.
    """
    years = list(re.finditer(r"\b(19|20)\d{2}\b", full_name))
    if year is not None:
        years = [m for m in years if int(m.group()) == year]
    name = full_name
    if years:
        y = years[-1]
        name = full_name[:y.start()] + " " + full_name[y.end():]
    name = re.sub(r"\s+", " ", name).strip()
    if name.lower().startswith(make.lower()):
        name = name[len(make):].strip()
    # 1) longest known model name that prefixes the rest
    for m in sorted(known_models or [], key=len, reverse=True):
        if name.lower().startswith(m.lower() + " ") or name.lower() == m.lower():
            return m, name[len(m):].strip(" /")
    # 2) words until the first trim-looking token
    words = name.split()
    model = []
    for w in words:
        if model and TRIM_START.match(w):
            break
        model.append(w)
    return " ".join(model), name[len(" ".join(model)):].strip(" /")
