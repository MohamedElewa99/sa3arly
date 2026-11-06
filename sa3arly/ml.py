"""A learned price model on top of the comparables.

The comparables give a market range from the closest ads. This model learns from *every* ad how price moves
with make, model, age, km, trim, gearbox, body, city, seller and the zero price, so it can:
  - price a car that has few or no close ads (it borrows what it learned from similar models),
  - correct the comparables when the few ads we have are unusual.

Training (nightly, in GitHub Actions — needs lightgbm + numpy):
    python -m sa3arly train
writes the model as plain JSON into the `price_models` table. Serving reads that JSON and walks the trees
in pure Python, so the Vercel functions need neither lightgbm nor numpy.

The model predicts log(asking price) at three quantiles (25 %, 50 %, 75 %): a learned middle and a learned range.
"""
from __future__ import annotations

import json
import math
import time
from datetime import date
from typing import Optional

FEATURES = ["make", "model", "age", "km", "log_km", "trim", "source", "gearbox", "body", "city", "seller", "log_zero"]
CATEGORICAL = ["make", "model", "trim", "source", "gearbox", "body", "city", "seller"]
QUANTILES = {"lo": 0.25, "mid": 0.5, "hi": 0.75}
MIN_CAT = 5            # a category value seen fewer times than this is folded into "other"

MIGRATION = """
create table if not exists price_models (
  id         bigserial primary key,
  created_at timestamptz not null default now(),
  n_train    int not null,
  metrics    jsonb not null,
  model      jsonb not null
);
alter table price_models enable row level security;
"""


# ----------------------------------------------------------------------------- features
def _gearbox(t: Optional[str]) -> str:
    t = (t or "").lower()
    if any(w in t for w in ("auto", "a/t", "اوتوماتيك", "أوتوماتيك", "cvt", "dsg")):
        return "auto"
    if any(w in t for w in ("manual", "m/t", "مانيوال", "عادي")):
        return "manual"
    return ""


def _trim_key(t: Optional[str]) -> str:
    return " ".join((t or "").lower().replace("-", " ").replace("/", " ").split())


def row_features(make: str, model: str, year: int, km: Optional[int], trim: Optional[str] = None,
                 source: str = "", gearbox: str = "", body: str = "", city: str = "", seller: str = "",
                 zero: Optional[int] = None, today: Optional[int] = None) -> dict:
    today = today or date.today().year
    return {
        "make": (make or "").lower(), "model": f"{(make or '').lower()}|{(model or '').lower()}",
        "age": max(0, today - int(year)), "km": float(km) if km is not None else None,
        "log_km": math.log1p(km) if km is not None else None,
        "trim": f"{(model or '').lower()}|{_trim_key(trim)}" if trim else "",
        "source": source or "", "gearbox": gearbox or _gearbox(trim), "body": (body or "").lower(),
        "city": (city or "").strip(), "seller": (seller or "").lower(),
        "log_zero": math.log(zero) if zero else None,
    }


# ----------------------------------------------------------------------------- training
TRAIN_SQL = """
with z as (
  select model_id, (array_agg(price_egp order by model_year desc, effective_on desc))[1] as zero
  from zero_prices where effective_on > now() - interval '120 days' and model_id is not null group by model_id
)
select mk.name_en, mo.name_en, l.year, l.km, l.price_egp, l.trim_raw, l.source, l.transmission, l.body_type,
       coalesce(l.governorate, l.city), l.seller_type, z.zero, coalesce(l.raw->'badges', '[]'::jsonb)
from listings l
join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
left join z on z.model_id = l.model_id
where l.price_egp between 50000 and 50000000 and l.year between 1990 and %s
  and l.last_seen > now() - make_interval(days => %s)
"""


def load_rows(cx, days: int = 180) -> list[tuple[dict, float]]:
    from .pricing import EXCLUDE_BADGES
    today = date.today().year
    out = []
    for mk, mo, y, km, price, trim, src, gear, body, city, seller, zero, badges in cx.execute(TRAIN_SQL, (today + 1, days)):
        if set(badges or []) & EXCLUDE_BADGES:
            continue
        if km is not None and km < 1000 and y >= today:
            continue
        if zero and not (0.2 * zero <= price <= 1.4 * zero):
            continue
        f = row_features(mk, mo, y, km, trim, src, _gearbox(gear) or "", body or "", city or "", seller or "", zero, today)
        out.append((f, math.log(price)))           # target is made relative to the zero price in train()
    return out


def _encode(rows: list[dict], maps: Optional[dict] = None) -> tuple[list[list[float]], dict]:
    """Categories -> integer codes (rare ones -> 0 = other). Missing numbers -> NaN."""
    if maps is None:
        maps = {}
        for c in CATEGORICAL:
            counts: dict[str, int] = {}
            for r in rows:
                if r[c]:
                    counts[r[c]] = counts.get(r[c], 0) + 1
            keep = sorted(k for k, n in counts.items() if n >= MIN_CAT)
            maps[c] = {k: i + 1 for i, k in enumerate(keep)}
    X = []
    for r in rows:
        x = []
        for f in FEATURES:
            if f in CATEGORICAL:
                x.append(float(maps[f].get(r[f], 0)))
            else:
                v = r[f]
                x.append(float("nan") if v is None else float(v))
        X.append(x)
    return X, maps


def _target(f: dict, y: float) -> float:
    """With a zero price the model learns retention, log(price / zero): how cars lose value is shared across
    models, so a model with few ads still gets a good curve. Without one it learns log(price) directly."""
    return y - f["log_zero"] if f["log_zero"] is not None else y


def _untarget(f: dict, t: float) -> float:
    return t + f["log_zero"] if f["log_zero"] is not None else t


def train(rows: list[tuple[dict, float]], seed: int = 7, rounds: int = 400) -> tuple[dict, dict]:
    """Fit the three quantile models; returns (model_json, metrics). Holds out 15 % to measure the error."""
    import random

    import lightgbm as lgb
    import numpy as np

    rnd = random.Random(seed)
    idx = list(range(len(rows)))
    rnd.shuffle(idx)
    cut = int(len(idx) * 0.85)
    tr, te = [rows[i] for i in idx[:cut]], [rows[i] for i in idx[cut:]]

    def fit(train_rows, maps=None):
        X, maps = _encode([r[0] for r in train_rows], maps)
        y = np.array([_target(r[0], r[1]) for r in train_rows])
        X = np.array(X)
        cats = [FEATURES.index(c) for c in CATEGORICAL]
        boosters = {}
        for name, a in QUANTILES.items():
            params = {"objective": "quantile", "alpha": a, "learning_rate": 0.05, "num_leaves": 31,
                      "min_data_in_leaf": 15, "feature_fraction": 0.9, "bagging_fraction": 0.9, "bagging_freq": 1,
                      "cat_smooth": 10, "min_data_per_group": 10, "max_cat_threshold": 64, "verbose": -1, "seed": seed}
            ds = lgb.Dataset(X, y, categorical_feature=cats, free_raw_data=False)
            boosters[name] = lgb.train(params, ds, num_boost_round=rounds)
        return boosters, maps

    boosters, maps = fit(tr)
    Xte, _ = _encode([r[0] for r in te], maps)
    Xte = np.array(Xte)
    yte = np.array([r[1] for r in te])
    base = np.array([r[0]["log_zero"] if r[0]["log_zero"] is not None else 0.0 for r in te])
    pred = boosters["mid"].predict(Xte) + base
    lo, hi = boosters["lo"].predict(Xte) + base, boosters["hi"].predict(Xte) + base
    ape = np.abs(np.exp(pred) - np.exp(yte)) / np.exp(yte)
    inside = float(np.mean((yte >= lo) & (yte <= hi)))
    metrics = {"n_train": len(tr), "n_test": len(te), "mape": round(float(np.mean(ape)), 4),
               "median_ape": round(float(np.median(ape)), 4), "within_10pct": round(float(np.mean(ape <= 0.10)), 4),
               "range_hit": round(inside, 4), "trained_at": time.strftime("%Y-%m-%d %H:%M")}

    # refit on everything for serving
    boosters, maps = fit(rows)
    metrics["n_all"] = len(rows)
    model = {"version": 2, "features": FEATURES, "categorical": CATEGORICAL, "maps": maps,
             "trees": {k: _compact(b.dump_model()) for k, b in boosters.items()}, "metrics": metrics}
    return model, metrics


def _compact(dump: dict) -> list:
    """LightGBM's JSON dump -> nested lists: leaf = number; split = [feat, kind, thr, default_left, missing, left, right]."""
    def node(n):
        if "leaf_value" in n:
            return round(n["leaf_value"], 7)
        if n["decision_type"] == "==":
            thr = sorted(int(v) for v in str(n["threshold"]).split("||"))
            kind = 1
        else:
            thr = n["threshold"]
            kind = 0
        return [n["split_feature"], kind, thr, 1 if n.get("default_left") else 0,
                {"None": 0, "Zero": 1, "NaN": 2}.get(n.get("missing_type"), 0), node(n["left_child"]), node(n["right_child"])]
    return [node(t["tree_structure"]) for t in dump["tree_info"]]


def save(cx, model: dict) -> int:
    cx.execute(MIGRATION)
    r = cx.execute("insert into price_models (n_train, metrics, model) values (%s, %s::jsonb, %s::jsonb) returning id",
                   (model["metrics"]["n_train"], json.dumps(model["metrics"]), json.dumps(model, separators=(",", ":")))).fetchone()
    cx.execute("delete from price_models where id not in (select id from price_models order by created_at desc limit 3)")
    return r[0]


# ----------------------------------------------------------------------------- serving (pure Python)
def _walk(t, x: list[float]) -> float:
    while isinstance(t, list):
        feat, kind, thr, dleft, missing, left, right = t
        v = x[feat]
        nan = v != v
        if kind == 1:                                        # categorical: listed codes go left
            if nan or v < 0:
                t = right
            else:
                t = left if int(v) in thr else right
            continue
        if missing == 2 and nan:
            t = left if dleft else right
        elif missing == 1 and (nan or v == 0.0):
            t = left if dleft else right
        else:
            if nan:
                v = 0.0
            t = left if v <= thr else right
    return t


class Model:
    def __init__(self, data: dict):
        self.d = data
        self.metrics = data.get("metrics", {})

    def vector(self, f: dict) -> list[float]:
        X, _ = _encode([f], self.d["maps"])
        return X[0]

    def known(self, f: dict) -> dict:
        """Which of the car's descriptors the model has actually seen enough of."""
        m = self.d["maps"]
        return {"model": f["model"] in m["model"], "make": f["make"] in m["make"], "trim": bool(f["trim"]) and f["trim"] in m["trim"]}

    def predict(self, f: dict) -> dict:
        x = self.vector(f)
        out = {k: math.exp(_untarget(f, sum(_walk(t, x) for t in trees))) for k, trees in self.d["trees"].items()}
        lo, mid, hi = sorted([out["lo"], out["mid"], out["hi"]])
        return {"lo": lo, "mid": mid, "hi": hi}


_cache: dict = {"at": 0.0, "model": None}


def latest(cx, ttl: int = 3600) -> Optional[Model]:
    """The newest trained model, cached for an hour per server instance. None until the first training."""
    if _cache["model"] is not None and time.time() - _cache["at"] < ttl:
        return _cache["model"]
    try:
        if not cx.execute("select to_regclass('price_models')").fetchone()[0]:
            return None
        r = cx.execute("select model from price_models order by created_at desc limit 1").fetchone()
    except Exception:
        return None
    _cache.update(at=time.time(), model=Model(r[0]) if r else None)
    return _cache["model"]
