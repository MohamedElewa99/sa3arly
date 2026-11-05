// Sa3arly capture button — reads ONLY the page the user has open, when the user clicks it.
// It never opens, scrolls or pages anything by itself. Saves one JSON file to Downloads.
(function () {
  var PRICE = /(EGP|E£|ج\.م|جنيه)\s*[\d,.]{4,}|[\d,.]{4,}\s*(EGP|E£|ج\.م|جنيه|ألف|مليون)/i;
  var YEAR = /\b(19[89]\d|20[0-3]\d)\b/;
  var anchors = Array.prototype.slice.call(document.querySelectorAll('a[href]'));
  var byHref = {};
  anchors.forEach(function (a) { (byHref[a.href.split('#')[0]] = byHref[a.href.split('#')[0]] || []).push(a); });
  // ads on one page share a URL shape (first two path parts + depth); phone/profile links do not
  function shape(h) {
    try { var p = new URL(h).pathname.split('/').filter(Boolean); return p.slice(0, 2).join('/') + '#' + p.length; }
    catch (e) { return h; }
  }
  function sameShapeCount(el, sh) {
    var s = {};
    el.querySelectorAll('a[href]').forEach(function (x) {
      var h = x.href.split('#')[0];
      if (shape(h) === sh) s[h] = 1;
    });
    return Object.keys(s).length;
  }
  // one line per text node: works whether the site uses blocks, inline spans or lazy rendering
  function textOf(el) {
    var out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentElement && n.parentElement.tagName;
      if (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') continue;
      var t = (n.nodeValue || '').replace(/\s+/g, ' ').trim();
      if (t && out[out.length - 1] !== t) out.push(t);
    }
    return out.join('\n');
  }
  var byEl = new Map();                       // card element -> {href: anchors pointing to it}
  Object.keys(byHref).forEach(function (href) {
    if (!/^https?:/.test(href)) return;
    var a = byHref[href][0], best = a, n = a.parentElement, d = 0;
    while (n && n !== document.body && d < 12) {
      if (sameShapeCount(n, shape(href)) > 1) break;   // stop before swallowing the next ad
      best = n; n = n.parentElement; d++;
    }
    if (!byEl.has(best)) byEl.set(best, {});
    byEl.get(best)[href] = best.querySelectorAll('a[href]').length ?
      Array.prototype.filter.call(best.querySelectorAll('a[href]'), function (x) { return x.href.split('#')[0] === href; }).length : 1;
  });
  var cards = [];
  byEl.forEach(function (hrefs, el) {
    // the ad link is the one used most inside its card (photo + title); profile/call links appear once
    var href = Object.keys(hrefs).sort(function (x, y) { return hrefs[y] - hrefs[x] || y.length - x.length; })[0];
    var t = textOf(el);
    if (t.length < 2500 && PRICE.test(t) && YEAR.test(t)) cards.push({ href: href, text: t });
  });
  var data = {
    tool: 'sa3arly-capture', version: 1, url: location.href, title: document.title,
    captured_at: new Date().toISOString(), cards: cards
  };
  var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  var link = document.createElement('a');
  var host = location.hostname.replace(/^www\./, '').split('.')[0];
  link.href = URL.createObjectURL(blob);
  link.download = 'sa3arly-' + host + '-' + Date.now() + '.json';
  document.body.appendChild(link); link.click(); link.remove();
  var note = document.createElement('div');
  note.textContent = 'سعرلي: اتحفظ ' + cards.length + ' إعلان من الصفحة دي';
  note.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;' +
    'background:#0f766e;color:#fff;padding:10px 18px;border-radius:8px;font:600 15px system-ui;direction:rtl';
  document.body.appendChild(note);
  setTimeout(function () { note.remove(); }, 2500);
})();
