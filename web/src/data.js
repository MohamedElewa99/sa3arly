// Live data for the app: catalog, quotes and market come from /api; the design's sample data stays as fallback.
import Component from './App.jsx';

const API = import.meta.env.VITE_API_BASE || '';
let app = null;                 // the mounted app, re-rendered when data arrives
const quotes = new Map();       // key -> quote | 'loading' | 'failed'

export function bindApp(instance) { app = instance; }
const refresh = () => { if (app) app.forceUpdate(); };

async function getJSON(path, opts) {
  const res = await fetch(API + path, opts);
  if (!res.ok) throw new Error(path + ' ' + res.status);
  return res.json();
}

export async function loadCatalog() {
  try {
    const data = await getJSON('/api/catalog');
    if (data && data.makes && Object.keys(data.makes).length) {
      Component.remoteCat = data.makes;
      // start the app on a car that really exists in the database
      // the car the app falls back to internally; a car the user picked (kept on the phone) stays
      if (app && data.default && !app.state.carSet) app.setState({ car: data.default, body: data.default.body || app.state.body });
      refresh();
    }
  } catch (e) { /* offline or API not deployed yet: keep the sample catalog */ }
}

export async function loadMarket() {
  try {
    const data = await getJSON('/api/market');
    if (data && data.items && data.items.length) { Component.remoteMarket = data.items; refresh(); }
  } catch (e) { /* keep sample market */ }
}

Component.remoteQuote = function (car, km) {
  if (!Component.remoteCat) return null;              // sample catalog: no live pricing
  const key = [car.make, car.model, car.year, car.trim, Math.round(km / 5000)].join('|');
  const hit = quotes.get(key);
  if (hit && typeof hit === 'object') return hit;
  if (!hit) {
    quotes.set(key, 'loading');
    const q = new URLSearchParams({ make: car.make, model: car.model, year: String(car.year), km: String(km), trim: car.trim || '' });
    getJSON('/api/price?' + q.toString())
      .then((d) => { quotes.set(key, d && d.low ? d : 'failed'); refresh(); })
      .catch(() => { quotes.set(key, 'failed'); });
  }
  return null;
};

Component.quoteLoading = function (car, km) {
  if (!Component.remoteCat) return false;
  return quotes.get([car.make, car.model, car.year, car.trim, Math.round(km / 5000)].join('|')) === 'loading';
};

// zero prices: makes -> models -> trims (one request per level, cached)
const zeros = new Map();
Component.remoteZero = function (make, model) {
  const key = (make || '') + '|' + (model || '');
  const hit = zeros.get(key);
  if (hit && typeof hit === 'object') return hit;
  if (!hit) {
    zeros.set(key, 'loading');
    const q = new URLSearchParams();
    if (make) q.set('make', make);
    if (model) q.set('model', model);
    getJSON('/api/zero?' + q.toString())
      .then((d) => { zeros.set(key, d && d.items ? d : 'failed'); refresh(); })
      .catch(() => { zeros.set(key, 'failed'); refresh(); });
  }
  return hit === 'failed' ? 'failed' : null;
};
