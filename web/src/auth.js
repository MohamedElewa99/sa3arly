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
  user: null,         // { id, email, name }
  items: [],          // saved pricings, newest first
  google, email, signOut, save, remove, pending, takePending,
};
Component.auth = auth;

const refresh = () => { if (app) app.forceUpdate(); };

export function bindAuth(instance) { app = instance; }

export async function initAuth() {
  try {
    const cfg = await fetch(API + '/api/config').then((r) => r.json());
    auth.enabled = !!cfg.auth;
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
  auth.user = u ? { id: u.id, email: u.email, name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '' } : null;
  auth.token = session ? session.access_token : null;
  if (!auth.user) { auth.items = []; refresh(); return; }
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
  try { auth.items = (await call('GET', '/api/saved')).items || []; } catch (e) { /* keep what we have */ }
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
  auth.user = null; auth.items = []; refresh();
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

// remember an action across the Google / email-link redirect
function pending(action) {
  try { if (action) localStorage.setItem(PENDING, JSON.stringify(action)); else localStorage.removeItem(PENDING); } catch (e) { /* private mode */ }
}
function takePending() {
  try { const a = JSON.parse(localStorage.getItem(PENDING) || 'null'); localStorage.removeItem(PENDING); return a; } catch (e) { return null; }
}
