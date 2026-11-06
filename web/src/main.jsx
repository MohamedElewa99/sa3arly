import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './App.jsx';
import { bindApp, loadCatalog, loadMarket } from './data.js';
import './app.css';
import './shell.css';

function Root() {
  return <Component ref={(r) => { if (r) { bindApp(r); } }} />;
}

createRoot(document.getElementById('root')).render(<Root />);
loadCatalog();
loadMarket();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
