import math

import pytest

from sa3arly import ml
from sa3arly.pricing import Pricer, _ai_weight
from tests.test_pricing import URL, db, true_price  # noqa: F401  (fixture)

NAN = float("nan")


def test_walk_numeric_categorical_missing():
    # feat 2 (age) <= 5 -> left 0.1 else right 0.2 ; NaN goes left (default_left, missing NaN)
    t = [2, 0, 5.0, 1, 2, 0.1, 0.2]
    assert ml._walk(t, [0, 0, 3.0]) == 0.1 and ml._walk(t, [0, 0, 9.0]) == 0.2 and ml._walk(t, [0, 0, NAN]) == 0.1
    # categorical on feat 1: codes 1 and 4 go left
    c = [1, 1, [1, 4], 0, 0, -0.5, 0.5]
    assert ml._walk(c, [0, 4.0]) == -0.5 and ml._walk(c, [0, 2.0]) == 0.5 and ml._walk(c, [0, NAN]) == 0.5


def test_ai_weight():
    assert _ai_weight(0, False, False) == 1.0
    assert _ai_weight(5, True, True) > _ai_weight(12, True, True) > _ai_weight(30, True, True)
    assert _ai_weight(5, False, False) < _ai_weight(5, True, False)
    assert _ai_weight(5, True, True, 0.12) == _ai_weight(5, True, True) / 2


def test_features():
    f = ml.row_features("Hyundai", "Elantra AD", 2020, 90000, "A/T / Top", "hatla2ee", zero=1_200_000, today=2026)
    assert f["age"] == 6 and f["gearbox"] == "auto" and f["model"] == "hyundai|elantra ad" and abs(f["log_zero"] - math.log(1_200_000)) < 1e-9
    assert ml.row_features("Kia", "Rio", 2015, None)["log_km"] is None


def _flat_model(log_retention: float, models=("hyundai|elantra ad",)) -> dict:
    """A one-leaf model per quantile: price = zero * exp(r) (or exp(r) without a zero)."""
    maps = {c: {} for c in ml.CATEGORICAL}
    maps["model"] = {m: i + 1 for i, m in enumerate(models)}
    leaf = {"lo": log_retention - 0.05, "mid": log_retention, "hi": log_retention + 0.05}
    return {"version": 2, "features": ml.FEATURES, "categorical": ml.CATEGORICAL, "maps": maps,
            "trees": {k: [v] for k, v in leaf.items()}, "metrics": {"n_train": 1000, "n_all": 1200, "median_ape": 0.05}}


@pytest.mark.skipif(not URL, reason="set TEST_DATABASE_URL to run")
def test_quote_blends_ai_and_prices_unknown_cars(db):  # noqa: F811
    ml._cache.update(at=0.0, model=None)
    base = Pricer(db, use_ai=False).quote("Hyundai", "Elantra AD", 2020, 100_000)
    assert base.ai is None
    # a model that thinks this car is worth ~20% more than the ads say
    ai_mid = base.mid * 1.2 / 0.95
    ml.save(db, _flat_model(math.log(ai_mid)))
    ml._cache.update(at=0.0, model=None)
    q = Pricer(db).quote("Hyundai", "Elantra AD", 2020, 100_000)
    assert q.ai and 0 < q.ai["weight"] < 1
    assert base.mid < q.mid < base.mid * 1.2                                    # pulled toward the model, not replaced
    assert any("الذكاء الاصطناعي" in line for line in q.lines)
    assert any("أرخص بـ" in line for line in q.lines)                          # flags the disagreement
    # Cupra Formentor has 2 ads + a zero price: the model alone prices it now
    ml.save(db, _flat_model(math.log(0.8), models=("cupra|formentor",)))
    ml._cache.update(at=0.0, model=None)
    f = Pricer(db).quote("Cupra", "Formentor", 2022, 80_000)
    assert f.mid and f.ai
    db.execute("drop table price_models")
    ml._cache.update(at=0.0, model=None)


def test_train_and_parity():
    lgb = pytest.importorskip("lightgbm")
    np = pytest.importorskip("numpy")
    import random
    rnd = random.Random(2)
    rows = []
    for i in range(1500):
        mdl = rnd.choice(["A", "B", "C"])
        zero = {"A": 1_000_000, "B": 1_600_000, "C": 700_000}[mdl]
        age, km = rnd.randint(0, 12), rnd.randint(0, 250_000)
        price = zero * 0.9 ** age * (1 - 0.006) ** (km / 10_000) * rnd.lognormvariate(0, 0.05)
        f = ml.row_features("X", mdl, 2026 - age, km, rnd.choice(["Std", "Top"]), "hatla2ee", zero=zero, today=2026)
        rows.append((f, math.log(price)))
    model, metrics = ml.train(rows, rounds=150)
    assert metrics["median_ape"] < 0.08
    m = ml.Model(model)
    f = ml.row_features("X", "B", 2020, 90_000, "Std", "hatla2ee", zero=1_600_000, today=2026)
    want = 1_600_000 * 0.9 ** 6 * (1 - 0.006) ** 9
    assert abs(m.predict(f)["mid"] / want - 1) < 0.1
