// Accounts: sign in with Google or an email link (Supabase Auth), and the user's saved pricings (/api/saved).
// Pricing works without an account; the app asks to sign in only when saving or turning on alerts.
import Component from './App.jsx';

const API = import.meta.env.VITE_API_BASE || '';
const PENDING = 'sa3.pending';          // what the user was doing before the sign-in redirect
let app = null;
let sb = null;

const auth = {
  ready: false,       // config loaded
  enabled: false,     // Supabase keys configured on the server
  googleOn: false,    // Google provider switched on in Supabase
  waOn: false,        // sign in with WhatsApp set up on the server
  user: null,         // { id, email, name }
  items: [],          // saved pricings, newest first
  profile: null,      // { name, showroom, phone, city, avatar }
  cities: [],
  garage: [],         // عربياتي: the user's own cars (list rows: cover photo only)
  garageReady: false,
  google, signIn, signUp, resetPass, newPass, signOut, save, remove, pending, takePending, saveProfile, photo,
  carGet, carAdd, carEdit, carRemove, carPhotos, waStart, waWait,
};
Component.auth = auth;

const refresh = () => { if (app) app.forceUpdate(); };

export function bindAuth(instance) { app = instance; }

export async function initAuth() {
  try {
    const cfg = await fetch(API + '/api/config').then((r) => r.json());
    auth.enabled = !!cfg.auth;
    auth.waOn = !!(cfg.auth && cfg.whatsapp);
    if (cfg.vision) { Component.readPhoto = readPhoto; Component.inspectPhotos = inspectPhotos; Component.writeAd = writeAd; }
    if (auth.enabled) {
      fetch(cfg.supabaseUrl + '/auth/v1/settings', { headers: { apikey: cfg.anonKey } })
        .then((r) => r.json()).then((st) => { auth.googleOn = !!(st.external && st.external.google); refresh(); }).catch(() => {});
      const { createClient } = await import('@supabase/supabase-js');
      sb = createClient(cfg.supabaseUrl, cfg.anonKey, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' } });
      sb.auth.onAuthStateChange((ev, session) => {
        setUser(session);
        // came back from the "forgot password" link: ask for the new password
        if (ev === 'PASSWORD_RECOVERY' && app && app.onRecovery) setTimeout(() => app.onRecovery(), 0);
      });
      const { data } = await sb.auth.getSession();
      await setUser(data.session);
    }
  } catch (e) { auth.enabled = false; }
  auth.ready = true;
  refresh();
}

async function setUser(session) {
  const u = session && session.user;
  const was = auth.user && auth.user.id;
  const viaPhone = u && /@phone\.sa3arly\.app$/.test(u.email || '');
  auth.user = u ? { id: u.id, email: viaPhone ? ((u.user_metadata && u.user_metadata.phone) || '') : u.email, name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '' } : null;
  auth.token = session ? session.access_token : null;
  if (!auth.user) { auth.items = []; auth.profile = null; auth.garage = []; auth.garageReady = false; refresh(); return; }
  if (was === auth.user.id) return;
  // clean the auth code out of the address bar after a redirect
  if (/[?&](code|error)=/.test(location.search)) history.replaceState(null, '', location.pathname);
  await load();
  await firstProfile(u);
  if (app && app.onSignedIn) app.onSignedIn();
  refresh();
}

async function call(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: Object.assign({ Authorization: 'Bearer ' + auth.token }, body ? { 'Content-Type': 'application/json' } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(path + ' ' + res.status);
  return res.json();
}

async function load() {
  await Promise.all([
    call('GET', '/api/saved').then((d) => { auth.items = d.items || []; }).catch(() => {}),
    call('GET', '/api/garage').then((d) => { auth.garage = d.items || []; auth.garageReady = true; }).catch(() => {}),
    call('GET', '/api/profile').then((d) => { auth.profile = d.profile || {}; auth.cities = d.cities || []; }).catch(() => {}),
  ]);
}

async function saveProfile(fields) {
  const d = await call('PUT', '/api/profile', fields);
  auth.profile = d.profile;
  refresh();
  return d.profile;
}

// a picked photo -> a small square JPEG data URL (256px), so it fits in the profile row
function photo(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error('type'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const n = 256, c = document.createElement('canvas'), side = Math.min(img.width, img.height);
      c.width = c.height = n;
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, n, n);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('read')); };
    img.src = url;
  });
}

function google() {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/' } })
    .then((r) => { if (r.error) throw r.error; });
}

// Accounts with a password. Supabase Auth keeps only a bcrypt hash of it; the app never stores or logs the password.
function signIn(address, password) {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.signInWithPassword({ email: address, password }).then((r) => { if (r.error) throw r.error; });
}

// 'in' when the account is open right away, 'confirm' when the project asks to confirm the email first.
// What the user typed about himself rides in the account's metadata and becomes his profile on the first sign-in.
function signUp(address, password, about) {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.signUp({ email: address, password, options: { emailRedirectTo: location.origin + '/', data: about } })
    .then((r) => { if (r.error) throw r.error; return r.data && r.data.session ? 'in' : 'confirm'; });
}

function resetPass(address) {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.resetPasswordForEmail(address, { redirectTo: location.origin + '/' }).then((r) => { if (r.error) throw r.error; });
}

function newPass(password) {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.updateUser({ password }).then((r) => { if (r.error) throw r.error; });
}

// first sign-in after sign-up: what he typed (role, name, showroom, phone) becomes the profile. The server checks every field again.
async function firstProfile(u) {
  const m = (u && u.user_metadata) || {};
  if (!m.role || (auth.profile && auth.profile.role)) return;
  const f = { role: m.role };
  for (const k of ['name', 'showroom', 'phone']) if (typeof m[k] === 'string' && m[k]) f[k] = m[k].slice(0, 60);
  try { await saveProfile(f); } catch (e) { /* he can fill it later from the profile screen */ }
}

async function signOut() {
  if (sb) await sb.auth.signOut();
  auth.user = null; auth.items = []; auth.profile = null; auth.garage = []; auth.garageReady = false; refresh();
}

// ---------- عربياتي ----------
const rowOf = (item) => { const r = Object.assign({}, item); delete r.photos; r.nPhotos = (item.photos || []).length; return r; };
const putRow = (item) => {
  const r = rowOf(item);
  auth.garage = [r].concat(auth.garage.filter((x) => x.id !== r.id));
};

async function carGet(id) {
  const { item } = await call('GET', '/api/garage?id=' + id);
  return item;
}
async function carAdd(body) {
  const { item } = await call('POST', '/api/garage', body);
  putRow(item); refresh();
  return item;
}
async function carEdit(id, fields) {
  const { item } = await call('PUT', '/api/garage?id=' + id, fields);
  putRow(item); refresh();
  return item;
}
async function carRemove(id) {
  await call('DELETE', '/api/garage?id=' + id);
  auth.garage = auth.garage.filter((x) => x.id !== id);
  refresh();
}
// photos picked in the app (blob: or data: URLs) -> { photos: up to 8 JPEGs ~800px, cover: one ~240px thumbnail }
// up to 20 photos per car: a few stay sharp, a long set is saved smaller so the car stays light to open
async function carPhotos(urls) {
  const list = (urls || []).filter(Boolean).slice(0, 20);
  const many = list.length > 8;
  const photos = [];
  let total = 0;
  for (const u of list) {
    try {
      const d = await shrinkUrl(u, many ? 600 : 800, many ? 0.6 : 0.72);
      if (total + d.length > 2300000) break;
      total += d.length;
      photos.push(d);
    } catch (e) { /* unreadable: skip it */ }
  }
  let cover = null;
  if (photos.length) { try { cover = await shrinkUrl(photos[0], 240, 0.7); } catch (e) { cover = null; } }
  return { photos, cover };
}

async function save(q) {
  const { item } = await call('POST', '/api/saved', q);
  auth.items = [item].concat(auth.items.filter((x) => x.id !== item.id));
  refresh();
  return item;
}

async function remove(id) {
  await call('DELETE', '/api/saved?id=' + id);
  auth.items = auth.items.filter((x) => x.id !== id);
  refresh();
}

// ---------- sign in with WhatsApp: the user sends us the code from his own WhatsApp (free) ----------
async function waStart() {
  const res = await fetch(API + '/api/phone', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start' }) });
  if (!res.ok) throw new Error('phone ' + res.status);
  return res.json();      // { code, wa, nonce, ttl }
}
// polls until the message arrives; resolves 'ok' (signed in), 'expired' or 'stopped' (ctl.stop = true)
async function waWait(nonce, ctl) {
  const until = Date.now() + 10 * 60 * 1000;
  while (!ctl.stop && Date.now() < until) {
    await new Promise((r) => setTimeout(r, 2000));
    if (ctl.stop) break;
    let d = null;
    try {
      const res = await fetch(API + '/api/phone', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'check', nonce }) });
      d = res.ok ? await res.json() : null;
    } catch (e) { d = null; }
    if (!d || d.state === 'waiting' || d.state === 'error') continue;
    if (d.state !== 'ok') return 'expired';
    const { error } = await sb.auth.verifyOtp({ token_hash: d.token_hash, type: 'magiclink' });
    if (error) throw error;
    // the number he signed in with becomes his profile phone, if he hasn't set one
    setTimeout(() => { if (auth.profile && !auth.profile.phone && d.phone && /^01/.test(d.phone)) saveProfile({ phone: d.phone }).catch(() => {}); }, 1500);
    return 'ok';
  }
  return ctl.stop ? 'stopped' : 'expired';
}

// remember an action across the Google / email-link redirect
function pending(action) {
  try { if (action) localStorage.setItem(PENDING, JSON.stringify(action)); else localStorage.removeItem(PENDING); } catch (e) { /* private mode */ }
}
function takePending() {
  try { const a = JSON.parse(localStorage.getItem(PENDING) || 'null'); localStorage.removeItem(PENDING); return a; } catch (e) { return null; }
}

// photo -> what the server's vision model sees: { make, model, years, trim, confidence, note } or { km, confidence }
async function readPhoto(kind, file, makes) {
  if (!auth.user) { const e = new Error('sign in'); e.status = 401; throw e; }
  const image = await shrink(file, 1024, 0.82);
  const res = await fetch(API + '/api/vision', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
    body: JSON.stringify({ kind, image, makes: makes || [] }),
  });
  if (!res.ok) {
    const e = new Error('vision ' + res.status); e.status = res.status;
    try { e.detail = (await res.json()).error || ''; } catch (x) { e.detail = ''; }
    throw e;
  }
  return res.json();
}

async function vision(body) {
  if (!auth.user) { const e = new Error('sign in'); e.status = 401; throw e; }
  const res = await fetch(API + '/api/vision', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const e = new Error('vision ' + res.status); e.status = res.status;
    try { e.detail = (await res.json()).error || ''; } catch (x) { e.detail = ''; }
    throw e;
  }
  return res.json();
}

// small copies of the photos, in order, that fit one request (the server reads at most 20)
async function smallSet(urls, most) {
  let list = (urls || []).filter(Boolean);
  if (list.length > most) {                       // a long set: spread evenly over it instead of taking the first ones
    const step = list.length / most;
    list = Array.from({ length: most }, (_, i) => list[Math.floor(i * step)]);
  }
  const size = list.length > 12 ? 560 : 720;
  const images = [], sent = [];
  let total = 0;
  for (const u of list) {
    try {
      const d = await shrinkUrl(u, size, 0.62);
      if (total + d.length > 3600000) break;
      total += d.length;
      images.push(d); sent.push(u);
    } catch (e) { /* unreadable: skip it */ }
  }
  return { images, sent };
}

// the whole set at once: the car, the km, a score per area and the visible defects. `sent` maps a defect's photo number back to the photo
async function inspectPhotos(urls, makes) {
  const { images, sent } = await smallSet(urls, 20);
  if (!images.length) { const e = new Error('no photos'); e.status = 400; throw e; }
  const r = await vision({ kind: 'inspect', images, makes: makes || [] });
  r.sent = sent;
  return r;
}

// a ready ad for one car of عربياتي
async function writeAd(car, photos) {
  const { images } = await smallSet(photos, 6);
  return vision({ kind: 'ad', car, images });
}

function shrink(file, max, q) {
  const url = URL.createObjectURL(file);
  return shrinkUrl(url, max, q).finally(() => URL.revokeObjectURL(url));
}

function shrinkUrl(url, max, q) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => reject(new Error('read'));
    img.src = url;
  });
}
