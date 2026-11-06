import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './App.jsx';
import { bindApp, loadCatalog, loadMarket } from './data.js';
import { bindAuth, initAuth } from './auth.js';
import './app.css';
import './shell.css';

// first theme: what the user picked before, else the phone's dark / light mode
let saved = null;
try { saved = localStorage.getItem('sa3.theme'); } catch (e) { /* private mode */ }
const night = saved ? saved === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches;
Component.saveTheme = (dark) => { try { localStorage.setItem('sa3.theme', dark ? 'dark' : 'light'); } catch (e) { /* private mode */ } };

function Root() {
  return <Component night={night} ref={(r) => { if (r) { appRef = r; bindApp(r); bindAuth(r); } }} />;
}

// wide screens get the website layout (top nav + the app beside a data panel); phones get the app
const wide = window.matchMedia('(min-width: 1024px)');
Component.desk = wide.matches;
let appRef = null;
const onWide = () => { Component.desk = wide.matches; if (appRef) appRef.forceUpdate(); };
if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);

// phone browser (not the installed app): offer to install; the installed app never shows this
const HIDE = 'sa3.installHide';
let deferred = null;
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
Component.install = {
  ios,
  show() {
    if (standalone()) return false;
    try { if (Date.now() < +(localStorage.getItem(HIDE) || 0)) return false; } catch (e) { /* private mode */ }
    return ios || !!deferred;
  },
  prompt() {
    if (!deferred) return Promise.resolve(false);
    const d = deferred; deferred = null;
    d.prompt();
    return d.userChoice.then((c) => c.outcome === 'accepted').finally(() => { if (appRef) appRef.forceUpdate(); });
  },
  dismiss() { try { localStorage.setItem(HIDE, String(Date.now() + 14 * 864e5)); } catch (e) { /* private mode */ } },
};
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; if (appRef) appRef.forceUpdate(); });
window.addEventListener('appinstalled', () => { deferred = null; if (appRef) appRef.forceUpdate(); });

createRoot(document.getElementById('root')).render(<Root />);
// keep the splash up until the first real data is in (no jumping content), at least 1.6s, at most 4s
const started = Date.now();
const firstData = Promise.allSettled([loadCatalog(), loadMarket(), initAuth()]);
const hideSplash = () => {
  const el = document.getElementById('splash');
  if (!el || el.classList.contains('out')) return;
  el.classList.add('out');
  setTimeout(() => el.remove(), 600);
};
Promise.race([firstData, new Promise((r) => setTimeout(r, 4000))])
  .then(() => setTimeout(hideSplash, Math.max(0, 1600 - (Date.now() - started))));

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
