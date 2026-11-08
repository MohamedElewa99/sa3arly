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
  google, email, signOut, save, remove, pending, takePending, saveProfile, photo,
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
    if (cfg.vision) Component.readPhoto = readPhoto;
    if (auth.enabled) {
      fetch(cfg.supabaseUrl + '/auth/v1/settings', { headers: { apikey: cfg.anonKey } })
        .then((r) => r.json()).then((st) => { auth.googleOn = !!(st.external && st.external.google); refresh(); }).catch(() => {});
      const { createClient } = await import('@supabase/supabase-js');
      sb = createClient(cfg.supabaseUrl, cfg.anonKey, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' } });
      sb.auth.onAuthStateChange((_ev, session) => { setUser(session); });
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

function email(address) {
  if (!sb) return Promise.reject(new Error('off'));
  return sb.auth.signInWithOtp({ email: address, options: { emailRedirectTo: location.origin + '/' } })
    .then((r) => { if (r.error) throw r.error; });
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
async function carPhotos(urls) {
  const list = (urls || []).filter(Boolean).slice(0, 8);
  const photos = [];
  for (const u of list) {
    try { photos.push(await shrinkUrl(u, 800, 0.72)); } catch (e) { /* unreadable: skip it */ }
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
  if (!res.ok) { const e = new Error('vision ' + res.status); e.status = res.status; throw e; }
  return res.json();
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
