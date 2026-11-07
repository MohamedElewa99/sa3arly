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

BASE = ["make", "model", "age", "km", "log_km", "trim", "source", "gearbox", "body", "city", "seller", "log_zero"]
TE = ["model_te", "make_te"]                      # what this model / make usually sells for, learned out-of-fold
TEXT = ["fabrika", "paint", "accident", "first_owner", "agency"]
AD = ["photos", "dom", "drops", "h_market", "km_year"]
FEATURES = BASE                                    # measured best on the real ads (see train --experiment)
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


# words in the ad text that move the price (Egyptian spellings, with and without hamza/taa)
WORDS = {
    "fabrika": ("فابريكا", "فبريكا", "فابريكه", "بدون رش", "بدون دهان", "zero paint"),
    "paint": ("رش", "دهان", "مرشوش", "متدهن", "سمكره", "سمكرة"),
    "accident": ("حادث", "حوادث", "اكسيدنت", "ضربه", "ضربة", "مضروب", "مقلوب"),
    "first_owner": ("اول مالك", "أول مالك", "مالك اول", "مالك أول", "first owner"),
    "agency": ("صيانات توكيل", "صيانة توكيل", "صيانات بالتوكيل", "توكيل بالكامل", "agency"),
}
NO_WORDS = ("بدون رش", "بدون دهان", "مفيهاش رش", "بدون حوادث", "مفيهاش حوادث", "لا يوجد رش")


def text_flags(text: Optional[str]) -> dict:
    """1 when the ad says it, 0 otherwise ("بدون رش" counts as fabrika, not as paint)."""
    t = " ".join((text or "").lower().replace("أ", "ا").replace("إ", "ا").replace("ة", "ه").split())
    cleaned = t
    for w in NO_WORDS:
        cleaned = cleaned.replace(w.replace("ة", "ه"), " ")
    out = {}
    for k, words in WORDS.items():
        src = t if k == "fabrika" else cleaned
        out[k] = 1.0 if any(w.replace("أ", "ا").replace("ة", "ه") in src for w in words) else 0.0
    return out


def row_features(make: str, model: str, year: int, km: Optional[int], trim: Optional[str] = None,
                 source: str = "", gearbox: str = "", body: str = "", city: str = "", seller: str = "",
                 zero: Optional[int] = None, today: Optional[int] = None, text: Optional[str] = None,
                 photos: Optional[int] = None, dom: Optional[float] = None, drops: Optional[float] = None,
                 h_market: Optional[int] = None) -> dict:
    """One car as model input. For a car being priced (not an ad) the ad-only fields stay at their typical values:
    no condition words, a fresh ad, no price drops, no site estimate."""
    today = today or date.today().year
    age = max(0, today - int(year))
    flags = text_flags(text)
    return {**flags,
        "km_year": (float(km) / max(1, age)) if km is not None else None,
        "photos": float(photos) if photos is not None else None,
        "dom": float(dom) if dom is not None else 0.0,
        "drops": float(drops) if drops is not None else 0.0,
        "h_market": (math.log(h_market) - math.log(zero)) if (h_market and zero) else (math.log(h_market) if h_market else None),
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
),
p as (
  select listing_id, count(distinct price_egp) - 1 as changes, max(price_egp) as top
  from listing_prices group by listing_id
)
select mk.name_en, mo.name_en, l.year, l.km, l.price_egp, l.trim_raw, l.source, l.transmission, l.body_type,
       coalesce(l.governorate, l.city), l.seller_type, z.zero, coalesce(l.raw->'badges', '[]'::jsonb),
       concat_ws(' ', l.title, l.description), l.photo_count,
       extract(epoch from (l.last_seen - l.first_seen)) / 86400.0,
       case when p.top > 0 then (p.top - l.price_egp)::float / p.top end,
       nullif(((l.raw->>'hatla2ee_market_min')::numeric + (l.raw->>'hatla2ee_market_max')::numeric) / 2, 0),
       (l.raw ? 'installment_egp'), l.url, l.trim_raw
from listings l
join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
left join z on z.model_id = l.model_id
left join p on p.listing_id = l.id
where l.price_egp between 50000 and 50000000 and l.year between 1990 and %s
  and l.last_seen > now() - make_interval(days => %s)
"""


def load_rows(cx, days: int = 365) -> list[tuple[dict, float]]:
    from .pricing import EXCLUDE_BADGES
    today = date.today().year
    out = []
    for (mk, mo, y, km, price, trim, src, gear, body, city, seller, zero, badges, text, photos, dom, drop, hm,
         installment, url, trim_raw) in cx.execute(TRAIN_SQL, (today + 1, days)):
        if set(badges or []) & EXCLUDE_BADGES:
            continue
        if installment and zero and price < 0.5 * zero:
            continue                                  # an installment ad showing the down payment
        if km is not None and km < 1000 and y >= today:
            continue
        if zero and not (0.2 * zero <= price <= 1.4 * zero):
            continue
        f = row_features(mk, mo, y, km, trim, src, _gearbox(gear) or "", body or "", city or "", seller or "", zero, today,
                         text, photos, dom, drop, int(hm) if hm else None)
        f["_ad"] = (mk, mo, y, km, trim_raw, url)        # not a feature: lets a test ad be priced by the comparables too
        out.append((f, math.log(price)))           # target is made relative to the zero price in train()
    return out


def _encode(rows: list[dict], maps: Optional[dict] = None, features: Optional[list] = None) -> tuple[list[list[float]], dict]:
    """Categories -> integer codes (rare ones -> 0 = other). Missing numbers -> NaN."""
    features = features or FEATURES
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
        for f in features:
            if f in CATEGORICAL:
                x.append(float(maps[f].get(r.get(f, ""), 0)))
            else:
                v = r.get(f)
                x.append(float("nan") if v is None else float(v))
        X.append(x)
    return X, maps


def _target(f: dict, y: float) -> float:
    """With a zero price the model learns retention, log(price / zero): how cars lose value is shared across
    models, so a model with few ads still gets a good curve. Without one it learns log(price) directly."""
    return y - f["log_zero"] if f["log_zero"] is not None else y


def _untarget(f: dict, t: float) -> float:
    return t + f["log_zero"] if f["log_zero"] is not None else t


def _age_adjusted(f: dict, y: float) -> float:
    """log price brought to a common age / km, so a model's average isn't just 'its ads are newer'."""
    return _target(f, y) + 0.09 * f["age"] + 0.006 * ((f["km"] or 0) / 10_000)


def te_maps(rows: list[tuple[dict, float]], k: float = 8.0) -> dict:
    """Smoothed mean of the age/km-adjusted target per model and per make (toward the overall mean)."""
    tot = [_age_adjusted(f, y) for f, y in rows]
    g = sum(tot) / max(1, len(tot))
    out = {}
    for key in ("model", "make"):
        acc: dict[str, list] = {}
        for (f, _), v in zip(rows, tot):
            acc.setdefault(f[key], []).append(v)
        out[key] = {c: (sum(v) + k * g) / (len(v) + k) for c, v in acc.items()}
    out["_global"] = g
    return out


def apply_te(rows: list[tuple[dict, float]], maps: dict) -> list[tuple[dict, float]]:
    g = maps["_global"]
    return [({**f, "model_te": maps["model"].get(f["model"], maps["make"].get(f["make"], g)),
              "make_te": maps["make"].get(f["make"], g)}, y) for f, y in rows]


def oof_te(rows: list[tuple[dict, float]], folds: int = 5, seed: int = 3) -> list[tuple[dict, float]]:
    """Target encoding for training rows computed without the row's own fold (no leak)."""
    import random
    idx = list(range(len(rows)))
    random.Random(seed).shuffle(idx)
    out = [None] * len(rows)
    for k in range(folds):
        hold = set(idx[k::folds])
        maps = te_maps([rows[i] for i in idx if i not in hold])
        for i in hold:
            out[i] = apply_te([rows[i]], maps)[0]
    return out


def train(rows: list[tuple[dict, float]], seed: int = 7, rounds: int = 3000, features: Optional[list] = None,
          clean: bool = False, lr: float = 0.03, leaves: int = 15, min_leaf: int = 25, l2: float = 5.0,
          mad_k: float = 5.0, refit: bool = True) -> tuple[dict, dict]:
    """Fit the three quantile models; returns (model_json, metrics).

    70 % train / 15 % valid (early stopping) / 15 % test. With clean=True a first model flags the ads whose
    price is far from what everything else says (3 robust deviations: typos, down payments, wrecks) and the
    final model is trained without them. The test error is reported on all test ads and on the clean ones."""
    import random

    import lightgbm as lgb
    import numpy as np

    features = features or FEATURES
    cats = [features.index(c) for c in CATEGORICAL if c in features]
    rnd = random.Random(seed)
    idx = list(range(len(rows)))
    rnd.shuffle(idx)
    a, b = int(len(idx) * 0.70), int(len(idx) * 0.85)
    tr, va, te = [rows[i] for i in idx[:a]], [rows[i] for i in idx[a:b]], [rows[i] for i in idx[b:]]
    use_te = any(f in features for f in TE)
    if use_te:
        m_tr = te_maps(tr)
        tr, va, te = oof_te(tr), apply_te(va, m_tr), apply_te(te, m_tr)

    def arr(part, maps):
        X, maps = _encode([r[0] for r in part], maps, features)
        return np.array(X), np.array([_target(r[0], r[1]) for r in part]), maps

    def fit(train_rows, valid_rows, alphas=QUANTILES, n=rounds):
        X, y, maps = arr(train_rows, None)
        Xv, yv, _ = arr(valid_rows, maps) if valid_rows else (None, None, None)
        out, best = {}, {}
        for name, al in alphas.items():
            params = {"objective": "quantile", "alpha": al, "learning_rate": lr, "num_leaves": leaves,
                      "min_data_in_leaf": min_leaf, "feature_fraction": 0.85, "bagging_fraction": 0.85, "bagging_freq": 1,
                      "lambda_l2": l2, "cat_smooth": 10, "min_data_per_group": 10, "max_cat_threshold": 64,
                      "verbose": -1, "seed": seed}
            ds = lgb.Dataset(X, y, categorical_feature=cats, free_raw_data=False)
            if Xv is not None:
                dv = lgb.Dataset(Xv, yv, categorical_feature=cats, reference=ds)
                bst = lgb.train(params, ds, num_boost_round=n, valid_sets=[dv],
                                callbacks=[lgb.early_stopping(100, verbose=False)])
                best[name] = bst.best_iteration or n
            else:
                bst = lgb.train(params, ds, num_boost_round=n)
                best[name] = n
            out[name] = bst
        return out, maps, best

    def residuals(boost, maps, part):
        X, y, _ = arr(part, maps)
        return y - boost["mid"].predict(X, num_iteration=boost["mid"].best_iteration or None)

    def robust_keep(res):
        med = float(np.median(res))
        mad = float(np.median(np.abs(res - med))) * 1.4826 or 0.05
        return np.abs(res - med) <= mad_k * mad

    dropped = 0
    if clean:
        first, maps0, _ = fit(tr, va, {"mid": 0.5})
        keep_tr = robust_keep(residuals(first, maps0, tr))
        keep_va = robust_keep(residuals(first, maps0, va))
        dropped = int((~keep_tr).sum() + (~keep_va).sum())
        tr = [r for r, k in zip(tr, keep_tr) if k]
        va = [r for r, k in zip(va, keep_va) if k]
        keep_te = robust_keep(residuals(first, maps0, te))
    boosters, maps, best = fit(tr, va)

    X, _, _ = arr(te, maps)
    yte = np.array([r[1] for r in te])
    base = np.array([r[0]["log_zero"] if r[0]["log_zero"] is not None else 0.0 for r in te])
    pred = boosters["mid"].predict(X, num_iteration=best["mid"]) + base
    lo = boosters["lo"].predict(X, num_iteration=best["lo"]) + base
    hi = boosters["hi"].predict(X, num_iteration=best["hi"]) + base
    ape = np.abs(np.exp(pred) - np.exp(yte)) / np.exp(yte)
    m = {"n_test": len(te), "mape": round(float(np.mean(ape)), 4), "median_ape": round(float(np.median(ape)), 4),
         "within_10pct": round(float(np.mean(ape <= 0.10)), 4),
         "range_hit": round(float(np.mean((yte >= lo) & (yte <= hi))), 4), "rounds": best,
         "dropped_outliers": dropped, "trained_at": time.strftime("%Y-%m-%d %H:%M")}
    if clean:
        c = ape[keep_te]
        m.update(clean_median_ape=round(float(np.median(c)), 4), clean_mape=round(float(np.mean(c)), 4),
                 clean_within_10pct=round(float(np.mean(c <= 0.10)), 4), clean_share=round(float(np.mean(keep_te)), 3))

    # final: everything clean (train + valid + test), each quantile with the rounds early stopping chose
    if not refit:                                   # keep the split model: for measuring blends on the test ads
        model = {"version": 4, "te": te_maps(tr) if use_te else None, "features": features,
                 "categorical": [c for c in CATEGORICAL if c in features], "maps": maps,
                 "trees": {k: _compact(bst.dump_model(num_iteration=best[k])) for k, bst in boosters.items()}, "metrics": m}
        m["_test"] = te
        return model, m
    allrows = tr + va + ([r for r, k in zip(te, keep_te) if k] if clean else te)
    te_full = None
    if use_te:
        te_full = te_maps(allrows)
        allrows = oof_te(allrows)
    final = {}
    X, y, maps = arr(allrows, None)
    for name, al in QUANTILES.items():
        params = {"objective": "quantile", "alpha": al, "learning_rate": lr, "num_leaves": leaves, "min_data_in_leaf": min_leaf,
                  "feature_fraction": 0.85, "bagging_fraction": 0.85, "bagging_freq": 1, "lambda_l2": l2,
                  "cat_smooth": 10, "min_data_per_group": 10, "max_cat_threshold": 64, "verbose": -1, "seed": seed}
        final[name] = lgb.train(params, lgb.Dataset(X, y, categorical_feature=cats), num_boost_round=max(50, int(best[name] * 1.1)))
    m["n_train"] = len(tr)
    m["n_all"] = len(allrows)
    model = {"version": 4, "te": te_full, "features": features, "categorical": [c for c in CATEGORICAL if c in features], "maps": maps,
             "trees": {k: _compact(bst.dump_model()) for k, bst in final.items()}, "metrics": m}
    return model, m


VARIANTS = {
    "A v2 (live now)":         {"features": BASE, "lr": 0.05, "leaves": 31, "min_leaf": 15, "l2": 1.0},
    "B small trees":           {"features": BASE},
    "C B + model/make level":  {"features": BASE + TE},
    "D C + gentle clean":      {"features": BASE + TE, "clean": True},
    "E C + condition words":   {"features": BASE + TE + TEXT},
    "F C + ad signals":        {"features": BASE + TE + TEXT + AD},
}


def comps_error(cx, n: int = 300, seed: int = 5, wide: bool = True) -> dict:
    """The comparables engine on its own, measured the same way: price random recent ads with that ad left out."""
    import random
    import statistics
    from .pricing import DEAL_DISCOUNT, Pricer
    ads = cx.execute("""select mk.name_en, mo.name_en, l.year, l.km, l.trim_raw, l.url, l.price_egp
                        from listings l join makes mk on mk.id = l.make_id join models mo on mo.id = l.model_id
                        where l.price_egp between 50000 and 50000000 and l.km is not null and l.year is not null
                          and l.last_seen > now() - interval '60 days'""").fetchall()
    random.Random(seed).shuffle(ads)
    pr = Pricer(cx, use_ai=False, wide=wide)
    errs, priced = [], 0
    for mk, mo, y, km, trim, url, price in ads[:n]:
        pr.exclude_url = url
        q = pr.quote(mk, mo, y, km, trim=trim)
        if q.mid:
            priced += 1
            errs.append(abs(q.mid / (1 - DEAL_DISCOUNT["default"]) - price) / price)
    if not errs:
        return {}
    return {"median_ape": round(statistics.median(errs), 4), "mape": round(statistics.mean(errs), 4),
            "within_10pct": round(sum(e <= 0.10 for e in errs) / len(errs), 4), "priced_share": round(priced / min(n, len(ads)), 3)}


def blend_eval(cx, rows, n: int = 400, **kw) -> dict:
    """On ads the model never saw: comparables alone vs model alone vs blends, by how many close ads there were."""
    import statistics
    from .pricing import DEAL_DISCOUNT, Pricer
    model, m = train(rows, refit=False, **kw)
    M = Model(model)
    pr = Pricer(cx, use_ai=False)
    disc = 1 - DEAL_DISCOUNT["default"]
    res: dict[str, dict[str, list]] = {}
    for f, y in m["_test"][:n]:
        mk, mo, yr, km, trim, url = f["_ad"]
        price = math.exp(y)
        pr.exclude_url = url
        q = pr.quote(mk, mo, yr, km, trim=trim)
        ml_ask = M.predict(f | {"source": "hatla2ee", "dom": 0.0, "drops": 0.0})["mid"]
        nq = next((int(l.split()[0]) for l in q.lines if "عربية شبهها" in l and l.split()[0].isdigit()), 0) if q.mid else 0
        bucket = "no ads" if not q.mid else "<8 ads" if nq < 8 else "8-19 ads" if nq < 20 else "20+ ads"
        comps_ask = q.mid / disc if q.mid else None
        for w in (0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 1.0):
            est = ml_ask if comps_ask is None else w * ml_ask + (1 - w) * comps_ask
            if comps_ask is None and w != 1.0:
                continue
            res.setdefault(bucket, {}).setdefault(f"w={w}", []).append(abs(est - price) / price)
    out = {}
    for b, ws in res.items():
        out[b] = {w: (round(statistics.median(e), 4), len(e)) for w, e in ws.items()}
    return out


BUCKETS = ("<8 ads", "8-19 ads", "20+ ads")


def learn_weights(cx, rows, min_n: int = 40) -> dict:
    """How much the model should count, per number of close ads, chosen on left-out real ads.
    A bucket with too few test ads keeps the model out (weight 0) until there is evidence."""
    ev = blend_eval(cx, rows, n=800)
    out = {}
    for b in BUCKETS:
        ws = ev.get(b, {})
        if not ws or next(iter(ws.values()))[1] < min_n:
            out[b] = 0.0
            continue
        best = min(ws.items(), key=lambda kv: kv[1][0])
        base = ws.get("w=0.0", (1, 0))[0]
        # only trust it if it really helps (at least 0.3 points better than the ads alone)
        out[b] = min(0.7, float(best[0][2:])) if base - best[1][0] >= 0.003 else 0.0   # the ads always keep a say
    none = ev.get("no ads", {}).get("w=1.0")
    out["no_ads_error"] = none[0] if none else None
    out["eval"] = ev
    return out


def experiment(rows, cx=None) -> dict:
    """Train every variant on the same split and return their test metrics (for choosing the setup)."""
    out = {}
    if cx is not None:
        out["comps narrow (before)"] = comps_error(cx, wide=False)
        out["comps wide (now)"] = comps_error(cx, wide=True)
    for name, kw in VARIANTS.items():
        _, m = train(rows, **kw)
        out[name] = {k: m.get(k) for k in ("median_ape", "mape", "within_10pct", "clean_median_ape", "clean_within_10pct", "range_hit", "dropped_outliers")}
    if cx is not None:
        for b, ws in blend_eval(cx, rows, **VARIANTS["B small trees"]).items():
            out[f"blend {b}"] = ws
    return out


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
        self.blend = data.get("blend")          # learned weights per bucket, None on older models

    def vector(self, f: dict) -> list[float]:
        if self.d.get("te"):
            f = apply_te([(f, 0.0)], self.d["te"])[0][0]
        X, _ = _encode([f], self.d["maps"], self.d.get("features"))
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
