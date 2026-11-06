// generated from the design file by tools/dc2jsx.py — edit the design, then re-run
import React from 'react';
import { css } from './css.js';

class Component extends React.Component {
  // example catalog for the prototype: ref = market middle for a factory car, model year 2022, 60,000 km
  static get CAT() {
    return {
      'كوبرا': {
        'فورمينتور': { body: 'crossover', trims: ['VZ', 'Style'], years: [2021, 2022, 2023, 2024, 2025, 2026], ref: 1620000, zero: 2150000, n: 14,
          issues: [['water', 'طرمبة المية وعلبة الثرموستات', 'بص تحت الموتور على تسريب أو بقع بينك، واتأكد إن المية ثابتة.'],
                   ['dsg', 'فتيس DSG', 'جرّب تقف وتتحرك في الزحمة: أي رعشة أو خبطة في الغيار الأول والتاني علامة.'],
                   ['oil', 'استهلاك الزيت', 'اسأل كل قد إيه بيزوّد زيت، واتأكد من سجل الصيانة.'],
                   ['screen', 'الشاشة والبرمجيات', 'شغّلها 5 دقايق: هنج أو ريستارت لوحدها محتاج تحديث في التوكيل.']] },
        'ليون': { body: 'hatch', trims: ['FR', 'Style'], years: [2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1350000, zero: 1750000, n: 18 }
      },
      'تويوتا': {
        'كورولا': { body: 'sedan', trims: ['Standard', 'Comfort', 'Elite'], years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1180000, zero: 1485000, n: 63,
          issues: [['cvt', 'فتيس CVT', 'اسمع وانت بتدوس بنزين: زنة عالية أو تأخير في السحب علامة.'],
                   ['susp', 'العفشة الأمامية', 'لف الدركسيون للآخر وانت واقف واسمع أي طقطقة.'],
                   ['ac', 'التكييف', 'شغّله على أقل درجة 10 دقايق واتأكد إنه ثابت.']] },
        'هايلكس': { body: 'pickup', trims: ['Standard', 'Full Option'], years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1650000, zero: 2300000, n: 22 },
        'هايس': { body: 'van', trims: ['Standard', 'High Roof'], years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1900000, zero: 2700000, n: 16 }
      },
      'كيا': {
        'سبورتاج': { body: 'suv', trims: ['LX', 'EX', 'GT Line'], years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1450000, zero: 1950000, n: 31 },
        'سيراتو': { body: 'sedan', trims: ['Standard', 'Top Line'], years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 950000, zero: 1250000, n: 54 }
      },
      'هيونداي': {
        'إلنترا': { body: 'sedan', trims: ['Standard', 'Smart', 'Top'], years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 980000, zero: 1230000, n: 48 },
        'توسان': { body: 'suv', trims: ['Standard', 'Top'], years: [2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 1500000, zero: 2000000, n: 27 }
      },
      'نيسان': {
        'صني': { body: 'sedan', trims: ['Baseline', 'Super Saloon'], years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ref: 610000, zero: 900000, n: 88 }
      }
    };
  }
  static get GENERIC_ISSUES() {
    return [['body', 'الشاسيه والدهان', 'افحص بجهاز قياس سُمك الدهان وبص على اللحامات تحت الشنطة والكبوت.'],
            ['gear', 'الفتيس', 'جرّبه بارد وسخن: أي خبطة أو تأخير في النقل علامة.'],
            ['susp', 'العفشة', 'امشي على مطب بالراحة واسمع أي خبط أو زيقة.'],
            ['ac', 'التكييف', 'شغّله على أقل درجة 10 دقايق واتأكد إنه ثابت.']];
  }
  // ---------- fuzzy search: Arabic or English, typos, spacing ----------
  // returns [{ item, score, exact }] best first; key(item) gives the text to search
  static fuzzy(q, items, key) {
    var F = Component._fz || (Component._fz = Component.fzInit());
    var qn = F.norm(q);
    if (!qn) return [];
    var qt = qn.split(' ').filter(function (w) { return !/^\d+$/.test(w); });
    var qy = (qn.match(/\b(19|20)\d\d\b/) || [])[0];
    var qAll = qt.join(''), qRaw = F.norm(String(q).replace(/[^\w\u0600-\u06FF ]+/g, '')).split(' ').filter(function (w) { return !/^\d+$/.test(w); });
    return items.map(function (it) {
      var raw = key(it), n = F.norm(raw), toks = F.tokens(raw);
      var exact = n.indexOf(qn) >= 0;
      var s = 0;
      if (qt.length) {
        var per = qt.map(function (w) {
          var b = 0;
          toks.forEach(function (t) { b = Math.max(b, F.sim(w, t)); });
          return b;
        });
        var min = Math.min.apply(null, per), avg = per.reduce(function (a, b) { return a + b; }, 0) / per.length;
        s = Math.max(min * 0.6 + avg * 0.4, F.joined(qAll, toks));
        toks.forEach(function (t) { s = Math.max(s, F.sim(qAll, t) * 0.95); qRaw.forEach(function (w) { if (w.length >= 4) s = Math.max(s, F.sim(w, t) * 0.92); }); });
      } else s = 0.7;                                    // only a year typed
      var yr = (String(raw).match(/\b(19|20)\d\d\b/) || [])[0];
      if (qy && yr) s *= qy === yr ? 1 : 0.85;
      if (exact) s = Math.max(s, 1);
      return { item: it, score: s, exact: exact };
    }).filter(function (r) { return r.score >= 0.62; })
      .sort(function (a, b) { return b.score - a.score; });
  }
  static fzInit() {
    // common Egyptian spellings for brands and models, English <-> Arabic
    var AL = {
      toyota: 'تويوتا', corolla: 'كورولا', camry: 'كامري', yaris: 'ياريس', fortuner: 'فورتشنر', hilux: 'هايلكس', hiace: 'هايس', rav4: 'راف فور', 'land cruiser': 'لاند كروزر', 'c-hr': 'سي اتش ار', belta: 'بيلتا', rush: 'راش',
      hyundai: 'هيونداي', elantra: 'النترا', tucson: 'توسان', accent: 'اكسنت', verna: 'فيرنا', creta: 'كريتا', i10: 'اي تن', i20: 'اي عشرين', i30: 'اي تلاتين', 'santa fe': 'سانتافي', matrix: 'ماتريكس', avante: 'افانتي', bayon: 'بايون',
      kia: 'كيا', cerato: 'سيراتو', sportage: 'سبورتاج', picanto: 'بيكانتو', rio: 'ريو', sorento: 'سورينتو', pegas: 'بيجاس', seltos: 'سيلتوس', sonet: 'سونيت', soul: 'سول', xceed: 'اكسيد', carens: 'كارينز',
      nissan: 'نيسان', sunny: 'صني', sentra: 'سنترا', qashqai: 'قشقاي', juke: 'جوك', 'x-trail': 'اكس تريل', patrol: 'باترول',
      chevrolet: 'شيفروليه', aveo: 'افيو', optra: 'اوبترا', lanos: 'لانوس', cruze: 'كروز', captiva: 'كابتيفا', spark: 'سبارك', 'n300': 'ان تلاتمية',
      mitsubishi: 'ميتسوبيشي', lancer: 'لانسر', pajero: 'باجيرو', eclipse: 'اكليبس', attrage: 'اتراج', xpander: 'اكسباندر', mirage: 'ميراج',
      renault: 'رينو', logan: 'لوجان', sandero: 'سانديرو', duster: 'داستر', megane: 'ميجان', fluence: 'فلوانس', kadjar: 'كادجار', austral: 'اوسترال', taliant: 'تاليانت',
      peugeot: 'بيجو', skoda: 'سكودا', octavia: 'اوكتافيا', fabia: 'فابيا', kodiaq: 'كودياك', karoq: 'كاروك', kamiq: 'كاميك', superb: 'سوبيرب', rapid: 'رابيد', scala: 'سكالا',
      volkswagen: 'فولكس', vw: 'فولكس', golf: 'جولف', passat: 'باسات', polo: 'بولو', tiguan: 'تيجوان', jetta: 'جيتا', touareg: 'طوارق',
      mercedes: 'مرسيدس', 'mercedes-benz': 'مرسيدس', bmw: 'بي ام دبليو', audi: 'اودي', opel: 'اوبل', astra: 'استرا', corsa: 'كورسا', insignia: 'انسجنيا', mokka: 'موكا', grandland: 'جراندلاند', crossland: 'كروسلاند',
      fiat: 'فيات', tipo: 'تيبو', '500': 'خمسمية', seat: 'سيات', ibiza: 'ابيزا', leon: 'ليون', arona: 'ارونا', ateca: 'اتيكا', cupra: 'كوبرا', formentor: 'فورمينتور',
      honda: 'هوندا', civic: 'سيفيك', accord: 'اكورد', city: 'سيتي', 'cr-v': 'سي ار في', suzuki: 'سوزوكي', swift: 'سويفت', ciaz: 'سياز', dzire: 'ديزاير', alto: 'التو', ertiga: 'ارتيجا', vitara: 'فيتارا', celerio: 'سيليريو',
      mg: 'ام جي', zs: 'زد اس', mg5: 'ام جي فايف', rx5: 'ار اكس فايف', hs: 'اتش اس', chery: 'شيري', tiggo: 'تيجو', arrizo: 'اريزو', geely: 'جيلي', emgrand: 'امجراند', coolray: 'كولراي', byd: 'بي واي دي', jetour: 'جيتور', haval: 'هافال', jeep: 'جيب', 'grand cherokee': 'جراند شيروكي', wrangler: 'رانجلر',
      mazda: 'مازدا', subaru: 'سوبارو', ford: 'فورد', focus: 'فوكس', fiesta: 'فييستا', kuga: 'كوجا', proton: 'بروتون', saga: 'ساجا', citroen: 'ستروين', 'c4': 'سي فور', 'c-elysee': 'سي اليزيه', speranza: 'سبرانزا', daewoo: 'دايو', lada: 'لادا', granta: 'جرانتا', changan: 'شانجان', bestune: 'بيستون', dongfeng: 'دونج فينج', baic: 'بايك', 'land rover': 'لاند روفر', 'range rover': 'رينج روفر', volvo: 'فولفو', lexus: 'لكزس', porsche: 'بورش', ssangyong: 'سانج يونج'
    };
    var rev = {};
    Object.keys(AL).forEach(function (en) { var a = norm(AL[en]); (rev[a] = rev[a] || []).push(en); (rev[a.replace(/ /g, '')] = rev[a.replace(/ /g, '')] || []).push(en); });
    function norm(s) {
      return String(s == null ? '' : s).toLowerCase()
        .replace(/[ً-ٰٟـ]/g, '')                  // tashkeel, tatweel
        .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
        .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); })
        .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x6F0); })
        .replace(/([a-zء-ي])(\d)/g, '$1 $2').replace(/(\d)([a-zء-ي])/g, '$1 $2')
        .replace(/[^a-z0-9ء-ي]+/g, ' ').trim();
    }
    // sound skeleton shared by both scripts: consonants only, close sounds merged
    function key(w) {
      var ar = /[ء-ي]/.test(w);
      if (ar) {
        w = w.replace(/^ال(?=..)/, '').replace(/ه$/, '');
        var m = { 'ب': 'b', 'ت': 't', 'ط': 't', 'ث': 's', 'ج': 'g', 'ح': 'h', 'خ': 'k', 'د': 'd', 'ض': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ظ': 'z', 'س': 's', 'ص': 's', 'ش': 's', 'غ': 'g', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h' };
        return w.split('').map(function (c) { return m[c] || (/\d/.test(c) ? c : ''); }).join('').replace(/(.)\1+/g, '$1');
      }
      w = w.replace(/ph/g, 'f').replace(/ch|sh/g, 's').replace(/th/g, 't').replace(/kh/g, 'k').replace(/gh/g, 'g')
        .replace(/c(?=[eiy])/g, 's').replace(/[cq]/g, 'k').replace(/x/g, 'ks').replace(/v/g, 'f').replace(/p/g, 'b').replace(/j/g, 'g')
        .replace(/h(?![aeiouy])/g, '').replace(/[aeiouyw]/g, '');
      return w.replace(/(.)\1+/g, '$1');
    }
    function lev(a, b, cap) {
      if (Math.abs(a.length - b.length) > cap) return cap + 1;
      var p = [], i, j;
      for (j = 0; j <= b.length; j++) p[j] = j;
      for (i = 1; i <= a.length; i++) {
        var c = [i], lo = i;
        for (j = 1; j <= b.length; j++) {
          c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          lo = Math.min(lo, c[j]);
        }
        if (lo > cap) return cap + 1;
        p = c;
      }
      return p[b.length];
    }
    // every spelling a catalog word can be found by
    var cache = {};
    function forms(t) {
      if (cache[t]) return cache[t];
      var f = [t];
      if (AL[t]) f.push(norm(AL[t]), norm(AL[t]).replace(/ /g, ''));
      if (rev[t]) f.push.apply(f, rev[t]);
      return (cache[t] = f);
    }
    function sim1(q, t) {
      if (q === t) return 1;
      if (t.indexOf(q) === 0 && q.length >= 2) return 0.97 - 0.02 * Math.min(5, t.length - q.length) / 5;
      if (q.length >= 3 && t.indexOf(q) > 0) return 0.85;
      var L = Math.max(q.length, t.length), cap = L <= 3 ? 0 : L <= 5 ? 1 : 2;
      var d = lev(q, t, cap);
      var best = d <= cap ? 0.9 - 0.08 * d : 0;
      var kq = key(q), kt = key(t);
      if (kq.length >= 2 && kt.length >= 2) {
        if (kq === kt) best = Math.max(best, 0.88);
        else if (kt.indexOf(kq) === 0 && kq.length >= 2 && q.length >= 3) best = Math.max(best, 0.8);
        else {
          var kc = Math.max(kq.length, kt.length) <= 3 ? 0 : 1;
          if (kc && lev(kq, kt, kc) <= kc) best = Math.max(best, 0.74);
        }
      }
      return best;
    }
    function sim(q, t) {
      var b = 0;
      forms(t).forEach(function (f) { b = Math.max(b, sim1(q, f)); });
      return b;
    }
    function tokens(s) {
      var n = norm(s).split(' ').filter(function (w) { return w && !/^\d+$/.test(w); });
      var out = n.slice();
      for (var i = 0; i + 1 < n.length; i++) out.push(n[i] + ' ' + n[i + 1]);  // two-word names: land rover
      return out;
    }
    // the whole typed text against the catalog name with spaces removed ("لاندروفر", "landcruiser")
    function joined(qAll, toks) {
      var b = 0;
      toks.forEach(function (t) { if (t.indexOf(' ') > 0) b = Math.max(b, sim(qAll, t.replace(/ /g, '')), sim1(qAll, norm(AL[t] || '').replace(/ /g, ''))); });
      return b;
    }
    return { norm: norm, key: key, sim: sim, tokens: tokens, joined: joined };
  }
  static get MARKET() {
    return [
      { t: 'zero', name: 'تويوتا كورولا 2026، فئة Elite', kind: 'سعر الزيرو', when: 'النهارده', price: 1485000, old: 1450000, delta: 35000, up: true, source: 'هتلاقي',
        car: { make: 'تويوتا', model: 'كورولا', year: 2026, trim: 'Elite' }, km: 0 },
      { t: 'deal', name: 'كيا سبورتاج 2021، 78,000 كم', kind: 'لقطة على هتلاقي', when: 'من 3 ساعات', price: 1190000, median: 1280000, delta: -7, pct: true, up: false, source: 'هتلاقي', city: 'القاهرة', url: '',
        car: { make: 'كيا', model: 'سبورتاج', year: 2021, trim: 'EX' }, km: 78000 },
      { t: 'zero', name: 'هيونداي إلنترا 2026، فئة Smart', kind: 'سعر الزيرو', when: 'امبارح', price: 1230000, old: 1250000, delta: -20000, up: false, source: 'هتلاقي',
        car: { make: 'هيونداي', model: 'إلنترا', year: 2026, trim: 'Smart' }, km: 0 },
      { t: 'used', name: 'كوبرا فورمينتور 2022', kind: 'رينج المستعمل', when: 'الأسبوع ده', price: 1520000, old: 1545000, delta: -1.5, pct: true, up: false, source: '14 إعلان',
        car: { make: 'كوبرا', model: 'فورمينتور', year: 2022, trim: 'VZ' }, km: 100000 },
      { t: 'deal', name: 'نيسان صني 2019، 96,000 كم', kind: 'لقطة على السوق المفتوح', when: 'من 5 ساعات', price: 495000, median: 545000, delta: -9, pct: true, up: false, source: 'السوق المفتوح', city: 'الجيزة', url: '',
        car: { make: 'نيسان', model: 'صني', year: 2019, trim: 'Baseline' }, km: 96000 }
    ];
  }
  constructor(props) {
    super(props);
    this.state = {
      screen: props.start || 'home', dir: 'f', dark: props.night !== false, menu: false,
      q: '', tray: [], km: 100000, agencyKm: 60000,
      paint: { bumperF: 2, doorRL: 1, fenderRR: 1 }, ex: {}, spin: true, angle: -35, dragging: false, last: '',
      mech: { shocksF: true, arms: true }, open: 'susp', k: 1,
      gl: true, oth: {}, exOther: false, mo: {}, body: 'crossover', bodyAuto: true, heroOn: true, partsOpen: false, mf: 'all', paintReady: false, more: false, wm: 0, margin: 30000, receipt: false, hideBuy: false, copied: false, checked: {}, car: { make: 'كوبرا', model: 'فورمينتور', year: 2022, trim: 'VZ' }, picker: null, pickOther: '', sheet: null, login: null, loginSent: false, loginEmail: '', loginErr: '', loginBusy: false, saving: false, flash: '', profile: false, pf: null, pfBusy: false, pfErr: '', photoBusy: false, item: null, shotsDone: { front: true, back: true }, extraShots: 0
    };
    this._raf = null; this._paint = null; this._hero = null;
    var self = this;
    var mk = function (slot, hero) {
      return function (el) {
        if (!el) {
          // React may detach and re-attach the same canvas on a re-render: wait a tick before tearing down
          clearTimeout(self[slot + 'T']);
          self[slot + 'T'] = setTimeout(function () {
            if (self[slot]) { self[slot].dispose(); self[slot] = null; self[slot + 'El'] = null; }
            if (slot === '_hero') clearInterval(self._cycle);
            if (slot === '_paint') self.setState({ paintReady: false });
          }, 0);
          return;
        }
        clearTimeout(self[slot + 'T']);
        if (self[slot] && self[slot + 'El'] === el) return;
        if (self[slot]) { self[slot].dispose(); self[slot] = null; }
        self[slot + 'El'] = el;
        if (!window.THREE) { self.setState({ gl: false }); return; }
        var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        try {
          self[slot] = self.sa3Scene(window.THREE, el, {
            hero: hero, look: { paint: self.paintHex() }, body: hero ? 'crossover' : self.state.body,
            states: hero ? {} : self.state.paint, spin: reduce ? false : (hero ? self.state.heroOn : self.state.spin),
            onPick: function (k) { self.pick(k); },
            onSpin: function (on) { self.setState({ spin: on }); }
          });
          if (!hero) self.setState({ paintReady: true });
          if (hero && !reduce && self.state.heroOn) {
            var order = ['crossover', 'sedan', 'suv', 'hatch', 'pickup', 'van'], ix = 0;
            clearInterval(self._cycle);
            self._cycle = setInterval(function () { ix = (ix + 1) % order.length; if (self._hero) self._hero.setBody(order[ix]); }, 4500);
          }
        } catch (e) { self.setState({ gl: false }); }
      };
    };
    this._paintRef = mk('_paint', false);
    this._heroRef = mk('_hero', true);
  }
  pickField(k, v) {
    var CAT = Component.remoteCat || Component.CAT, c = Object.assign({}, this.state.car), patch = {};
    c[k] = v;
    if (k === 'make') { var models = Object.keys(CAT[v] || {}); c.model = models[0] || c.model; }
    if (k === 'make' || k === 'model') {
      var inf = (CAT[c.make] || {})[c.model];
      if (inf) { if (inf.years.indexOf(c.year) < 0) c.year = inf.years[inf.years.length - 2] || inf.years[0]; c.trim = inf.trims[0]; patch.body = inf.body; patch.bodyAuto = true; }
    }
    patch.car = c; patch.sheet = null; patch.picker = null; patch.pickOther = ""; patch.checked = this.state.checked;
    this.setState(patch);
  }
  setCar(c, km, screen) {
    var inf = ((Component.remoteCat || Component.CAT)[c.make] || {})[c.model];
    var patch = { car: Object.assign({}, c), paint: {}, ex: {}, mech: {}, mo: {}, menu: false };
    if (inf) { patch.body = inf.body; patch.bodyAuto = true; }
    if (km !== undefined) { patch.km = km; patch.agencyKm = Math.min(this.state.agencyKm, Math.floor(km / 10000) * 10000); }
    this.setState(patch);
    this.go(screen || 'car', 'f');
  }
  // after Google / email-link sign-in: finish what the user asked for before the redirect
  onSignedIn() {
    var A = Component.auth, self = this;
    if (!A) return;
    var p = A.takePending ? A.takePending() : null, wasOpen = !!this.state.login;
    this.setState({ login: null });
    if (p && p.kind === 'save' && p.q) A.save(p.q).then(function () { self.flashMsg('دخلت، والتسعيرة اتحفظت'); }, function () { self.flashMsg('دخلت، بس التسعيرة ماتحفظتش'); });
    else if (p && p.kind === 'alerts') { this.setState({ sheet: 'alerts' }); this.flashMsg('دخلت، التنبيهات شغّالة'); }
    else if (p || wasOpen) this.flashMsg('أهلاً، دخلت');
  }
  flashMsg(m) {
    var self = this;
    clearTimeout(this._flashT);
    this.setState({ flash: m });
    this._flashT = setTimeout(function () { self.setState({ flash: '' }); }, 2800);
  }
  paintHex() { return this.state.dark ? '#000000' : '#F5F6F7'; }
  pick(k) {
    var names = { bumperF: 'إكصدام قدام', bumperR: 'إكصدام ورا', hood: 'كبوت', trunk: 'شنطة', roof: 'سقف',
      fenderFR: 'رفرف قدام يمين', doorFR: 'باب قدام يمين', doorRR: 'باب ورا يمين', fenderRR: 'رفرف ورا يمين',
      fenderFL: 'رفرف قدام شمال', doorFL: 'باب قدام شمال', doorRL: 'باب ورا شمال', fenderRL: 'رفرف ورا شمال' };
    var st = ['فابريكا', 'رش', 'متغير'];
    var n = Object.assign({}, this.state.paint);
    n[k] = ((n[k] || 0) + 1) % 3;
    this.setState({ paint: n, spin: false, last: (names[k] || k) + ': ' + st[n[k]] });
    if (this._paint) { this._paint.update(n); this._paint.setSpin(false); }
  }
  componentDidMount() { if (this.state.screen === 'result' || this.state.screen === 'home') this.count(); }
  componentDidUpdate(pp, ps) {
    if (this._paint && ps.paint !== this.state.paint) this._paint.update(this.state.paint);
    if (this._paint && ps.body !== this.state.body) this._paint.setBody(this.state.body);
    if (ps.dark !== this.state.dark) {
      if (this._paint) this._paint.setPaint(this.paintHex(), this.state.paint);
      if (this._hero) this._hero.setPaint(this.paintHex(), {});
    }
  }
  componentWillUnmount() {
    if (this._raf) cancelAnimationFrame(this._raf);
    clearTimeout(this._paintT); clearTimeout(this._heroT); clearInterval(this._cycle);
    if (this._paint) this._paint.dispose();
    if (this._hero) this._hero.dispose();
  }
  sa3Scene(THREE, canvas, opts) {
    var w = canvas.clientWidth || 350, h = canvas.clientHeight || 260;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    var envTex = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    var key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(4, 2.2, 5); scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(-4, 2.2, -5); scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.55));
  
    var C = function (hex) { return new THREE.Color(hex).convertSRGBToLinear(); };
    var OUT = opts.outline !== false;
    var lineC = new THREE.Color(0xffffff);
    var lum = function (c) { return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; };
    var paintBase = C(opts.look.paint), glassC = C('#0d1013'), stateC = [null, C('#F2A93B'), C('#5B9CF5')];
    lineC.copy(lum(paintBase) > 0.3 ? C('#000000') : C('#EDEAE4'));
    var states = opts.states || {};
    var PAINT = { metalness: 0.25, roughness: 0.38, clearcoat: 0.25, clearcoatRoughness: 0.25, envMapIntensity: 0.07 };
  
    // body types: x front→rear, heights in metres
    var TYPES = {
      sedan:     { xf: 2.3, xr: -2.32, yb: 0.26, yn: 0.56, yh: 0.86, belt: 0.92, deck: 0.97, gx1: 0.86, gx2: -0.05, gx3: -0.8, gx4: -1.48, yr: 1.32, wf: 1.42, wr: -1.36, wr0: 0.34, ar: 0.42, D: 1.7, rear: 'fast' },
      hatch:     { xf: 2.05, xr: -1.98, yb: 0.27, yn: 0.58, yh: 0.88, belt: 0.95, deck: 0.95, gx1: 0.72, gx2: -0.1, gx3: -1.42, gx4: -1.92, yr: 1.4, wf: 1.3, wr: -1.27, wr0: 0.34, ar: 0.42, D: 1.68, rear: 'steep' },
      crossover: { xf: 2.2, xr: -2.2, yb: 0.34, yn: 0.66, yh: 0.95, belt: 1.0, deck: 1.0, gx1: 0.78, gx2: -0.12, gx3: -1.45, gx4: -2.06, yr: 1.52, wf: 1.36, wr: -1.32, wr0: 0.38, ar: 0.46, D: 1.74, rear: 'mid', flares: true },
      suv:       { xf: 2.32, xr: -2.34, yb: 0.4, yn: 0.78, yh: 1.06, belt: 1.12, deck: 1.12, gx1: 0.9, gx2: 0.12, gx3: -1.98, gx4: -2.28, yr: 1.78, wf: 1.46, wr: -1.46, wr0: 0.41, ar: 0.49, D: 1.84, rear: 'steep', flares: true, rails: true },
      pickup:    { xf: 2.6, xr: -2.66, yb: 0.42, yn: 0.82, yh: 1.1, belt: 1.12, deck: 1.12, gx1: 1.05, gx2: 0.45, gx3: -0.3, gx4: -0.46, yr: 1.78, wf: 1.75, wr: -1.62, wr0: 0.41, ar: 0.49, D: 1.84, rear: 'steep', bed: true, flares: true },
      van:       { xf: 2.4, xr: -2.44, yb: 0.32, yn: 0.72, yh: 1.02, belt: 1.06, deck: 1.06, gx1: 1.25, gx2: 0.62, gx3: -2.3, gx4: -2.4, yr: 1.98, wf: 1.62, wr: -1.56, wr0: 0.37, ar: 0.45, D: 1.84, rear: 'steep' }
    };
  
    var car = null, built = null;
    var build = function (type) {
      var T = TYPES[type] || TYPES.sedan;
      var g = new THREE.Group(), disp = [], mirrors = [], fillMats = [];
      var _head = null, _tail = null;
      var headMatRef = function () { return _head || (_head = track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf4f1ea, emissiveIntensity: 1.1 }))); };
      var tailMatRef = function () { return _tail || (_tail = track(new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff2a2a, emissiveIntensity: 1.3 }))); };
      var paintMatRef = function () { return pillarMatEarly; };
      var track = function (o) { disp.push(o); return o; };
      var D = T.D, BT = 0.06;
  
      var body = new THREE.Shape();
      body.moveTo(T.xf, T.yb + 0.02);
      body.quadraticCurveTo(T.xf + 0.08, T.yb + (T.yn - T.yb) * 0.45, T.xf + 0.04, T.yn);
      body.quadraticCurveTo(T.xf - 0.03, T.yn + 0.13, T.xf - 0.55, T.yn + 0.2);
      body.lineTo(T.gx1, T.yh);
      body.lineTo(Math.min(T.gx4, T.xr + 0.25), T.belt);
      if (T.gx4 > T.xr + 0.25) body.lineTo(T.xr + 0.2, T.deck);
      body.quadraticCurveTo(T.xr - 0.01, T.deck - 0.02, T.xr, T.deck - 0.18);
      body.lineTo(T.xr + 0.02, T.yb + 0.12);
      body.quadraticCurveTo(T.xr + 0.03, T.yb, T.xr + 0.15, T.yb);
      body.lineTo(T.wr - T.ar - 0.05, T.yb);
      body.lineTo(T.wr - T.ar, T.yb + 0.02);
      body.absarc(T.wr, T.yb + 0.02, T.ar, Math.PI, 0, true);
      body.lineTo(T.wr + T.ar + 0.05, T.yb);
      body.lineTo(T.wf - T.ar - 0.05, T.yb);
      body.lineTo(T.wf - T.ar, T.yb + 0.02);
      body.absarc(T.wf, T.yb + 0.02, T.ar, Math.PI, 0, true);
      body.lineTo(T.wf + T.ar + 0.05, T.yb);
      body.lineTo(T.xf - 0.1, T.yb);
      body.quadraticCurveTo(T.xf - 0.01, T.yb, T.xf, T.yb + 0.02);
      var bodyGeo = track(new THREE.ExtrudeGeometry(body, { depth: D, bevelEnabled: true, bevelThickness: BT, bevelSize: 0.05, bevelSegments: OUT ? 1 : 6, curveSegments: 28, steps: 1 }));
      bodyGeo.translate(0, 0, -D / 2);
      if (bodyGeo.index) bodyGeo = bodyGeo.toNonIndexed();
  
      var dMid, dEnd;
      if (T.bed) { dMid = (T.gx1 + T.gx4) / 2; dEnd = T.gx4; }
      else { var dl = (T.gx1 - (T.wr + T.ar * 0.7)) / 2; dMid = T.gx1 - dl; dEnd = T.gx1 - 2 * dl; }
      var sideKey = function (x, z) {
        var s = z > 0 ? 'R' : 'L';
        if (x > T.gx1) return 'fenderF' + s;
        if (x > dMid) return 'doorF' + s;
        if (x > dEnd) return 'doorR' + s;
        return 'fenderR' + s;
      };
      var low = T.yb + 0.36;
      var classify = function (geo, fn) {
        var p = geo.attributes.position.array, keys = [];
        var a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Vector3(), e = new THREE.Vector3();
        for (var i = 0; i < p.length; i += 9) {
          a.set(p[i], p[i + 1], p[i + 2]); b.set(p[i + 3], p[i + 4], p[i + 5]); c.set(p[i + 6], p[i + 7], p[i + 8]);
          m.copy(a).add(b).add(c).multiplyScalar(1 / 3);
          e.copy(c).sub(a);
          n.copy(b).sub(a).cross(e).normalize();
          keys.push(fn(m, n));
        }
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.length), 3));
        return keys;
      };
      var bodyKeys = classify(bodyGeo, function (m, n) {
        if (Math.abs(n.z) > 0.7) return 'cap:' + sideKey(m.x, m.z);
        if (m.x > T.xf - 0.35 && m.y < low) return 'bumperF';
        if (m.x < T.xr + 0.3 && m.y < T.yb + 0.3) return 'bumperR';
        if (n.x > 0.3 && m.x > T.xf - 0.3) return m.y < T.yn - 0.05 ? 'bumperF' : 'hood';
        if (n.x < -0.3 && m.x < T.xr + 0.3) return 'trunk';
        if (n.y > 0.45 && m.x > T.gx1) return 'hood';
        if (n.y > 0.45 && m.x < Math.min(T.gx4, T.xr + 0.3)) return 'trunk';
        return 'body';
      });
      var paintMat = track(new THREE.MeshPhysicalMaterial(Object.assign({ color: 0xffffff, vertexColors: true }, PAINT)));
      var pillarMatEarly = track(new THREE.MeshPhysicalMaterial(Object.assign({ color: 0xffffff }, PAINT)));
      var bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
      bodyMesh.userData.keys = bodyKeys;
      g.add(bodyMesh);
  
      // side panels laid over the body sides
      var pts = body.getPoints(28);
      var clipX = function (poly, x0, keepGreater) {
        var out = [];
        for (var i = 0; i < poly.length; i++) {
          var A = poly[i], B = poly[(i + 1) % poly.length];
          var ina = keepGreater ? A.x >= x0 : A.x <= x0, inb = keepGreater ? B.x >= x0 : B.x <= x0;
          if (ina) out.push(A);
          if (ina !== inb) { var t = (x0 - A.x) / (B.x - A.x); out.push(new THREE.Vector2(x0, A.y + t * (B.y - A.y))); }
        }
        return out;
      };
      var ranges = { fenderF: [T.gx1, 9], doorF: [dMid, T.gx1], doorR: [dEnd, dMid], fenderR: [-9, dEnd] };
      var panels = [];
      Object.keys(ranges).forEach(function (k) {
        var r = ranges[k], gap = 0.012;
        var poly = clipX(clipX(pts, r[0] + gap, true), r[1] - gap, false);
        if (poly.length < 3) return;
        var geo = track(new THREE.ShapeGeometry(new THREE.Shape(poly)));
        [1, -1].forEach(function (sgn) {
          var mat = track(new THREE.MeshPhysicalMaterial(Object.assign({ color: 0xffffff, side: THREE.DoubleSide }, PAINT)));
          var mesh = new THREE.Mesh(geo, mat);
          mesh.position.z = sgn * (D / 2 + BT + 0.003);
          mesh.userData.panel = k + (sgn > 0 ? 'R' : 'L');
          g.add(mesh);
          panels.push(mesh);
        });
      });
  
      // greenhouse
      var gh = new THREE.Shape();
      gh.moveTo(T.gx1, T.yh - 0.03);
      gh.quadraticCurveTo((T.gx1 + T.gx2) / 2 + 0.04, (T.yh + T.yr) / 2 + 0.07, T.gx2, T.yr);
      gh.quadraticCurveTo((T.gx2 + T.gx3) / 2, T.yr + 0.04, T.gx3, T.yr - 0.01);
      if (T.rear === 'steep') gh.quadraticCurveTo(T.gx4 + 0.05, T.yr - 0.03, T.gx4, T.belt - 0.03);
      else if (T.rear === 'mid') gh.quadraticCurveTo(T.gx4 + 0.22, T.yr - 0.06, T.gx4, T.belt - 0.03);
      else gh.quadraticCurveTo(T.gx3 + (T.gx4 - T.gx3) * 0.45, T.yr - 0.05, T.gx4, T.belt - 0.03);
      gh.lineTo(T.gx1, T.yh - 0.03);
      var GD = D - 0.16;
      var ghGeo = track(new THREE.ExtrudeGeometry(gh, { depth: GD, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: OUT ? 1 : 6, curveSegments: 24, steps: 1 }));
      ghGeo.translate(0, 0, -GD / 2);
      if (ghGeo.index) ghGeo = ghGeo.toNonIndexed();
      (function () {   // tumblehome: the glasshouse leans in towards the roof
        var pa = ghGeo.attributes.position, span = T.yr - T.belt;
        for (var q = 0; q < pa.count; q++) {
          var f = Math.min(1, Math.max(0, (pa.getY(q) - T.belt) / span));
          pa.setZ(q, pa.getZ(q) * (1 - 0.13 * f));
        }
        pa.needsUpdate = true;
        ghGeo.computeVertexNormals();
      })();
      var ghKeys = classify(ghGeo, function (m, n) { return (n.y > 0.8 && m.y > T.yr - 0.08) ? 'roof' : 'glass'; });
      var ghMesh = new THREE.Mesh(ghGeo, paintMat);
      ghMesh.userData.keys = ghKeys;
      g.add(ghMesh);
      var pillarMat = pillarMatEarly;
      var ph = T.yr - T.yh;
      var pillar = new THREE.Mesh(track(new THREE.BoxGeometry(0.1, ph * 0.9, GD * 0.94 + 0.12)), pillarMat);
      pillar.position.set(T.bed ? (T.gx1 + T.gx4) / 2 : dMid, T.yh + ph * 0.46, 0);
      g.add(pillar);
  
      var dark = track(new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.5, metalness: 0.2, envMapIntensity: 0.3 }));
      var chrome = track(new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 1, roughness: 0.25 }));
      var sideZ = D / 2 + BT;
      var glassLen = (T.gx1 - T.gx4);
      var belt = new THREE.Mesh(track(new THREE.BoxGeometry(glassLen + 0.05, 0.025, 0.02)), chrome);
      [1, -1].forEach(function (sg) {
        var b = belt.clone(); b.position.set((T.gx1 + T.gx4) / 2, T.belt - 0.04, sg * (sideZ + 0.008)); g.add(b);
        var hGeo = track(new THREE.BoxGeometry(0.16, 0.03, 0.03));
        if (!OUT) [T.gx1 - 0.35, (T.bed ? (T.gx1 + T.gx4) / 2 : dMid) - 0.3].forEach(function (hx) {
          var hd = new THREE.Mesh(hGeo, chrome); hd.position.set(hx, T.belt - 0.14, sg * (sideZ + 0.012)); g.add(hd);
        });
        if (!OUT) {
        var mir = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.08, 0.12)), dark);
        mir.position.set(T.gx1 - 0.08, T.yh + 0.08, sg * (sideZ + 0.06)); g.add(mir); mirrors.push(mir);
        }
        var sl = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.05, 0.02)), headMatRef());
        sl.position.set(T.xf - 0.12, T.yn + 0.02, sg * (sideZ + 0.004)); g.add(sl);
        var tl2 = new THREE.Mesh(track(new THREE.BoxGeometry(0.2, 0.06, 0.02)), tailMatRef());
        tl2.position.set(T.xr + 0.1, T.deck - 0.14, sg * (sideZ + 0.004)); g.add(tl2);
        if (T.flares && !OUT) {
          [T.wf, T.wr].forEach(function (wx) {
            var fl = new THREE.Mesh(track(new THREE.TorusGeometry(T.ar + 0.02, 0.035, 8, 40, Math.PI)), dark);
            fl.position.set(wx, T.yb + 0.02, sg * (sideZ + 0.01)); g.add(fl);
          });
        }
        if (T.rails && !OUT) {
          var rl = new THREE.Mesh(track(new THREE.BoxGeometry((T.gx2 - T.gx3) * 0.9, 0.04, 0.04)), dark);
          rl.position.set((T.gx2 + T.gx3) / 2, T.yr + 0.07, sg * (GD / 2 - 0.12)); g.add(rl);
        }
      });
      if (T.bed) {
        var bed = new THREE.Mesh(track(new THREE.PlaneGeometry(T.gx4 - 0.1 - (T.xr + 0.14), D - 0.1)), dark);
        bed.rotation.x = -Math.PI / 2;
        bed.position.set((T.gx4 - 0.1 + T.xr + 0.14) / 2, T.belt + 0.002, 0);
        g.add(bed);
      }
      var grille = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, (T.yn - T.yb) * 0.42, D * 0.58)), dark);
      grille.position.set(T.xf + 0.05, T.yb + (T.yn - T.yb) * 0.5, 0);
      g.add(grille);
      var headMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf4f1ea, emissiveIntensity: 1.2 }));
      var tailMat = track(new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff2a2a, emissiveIntensity: 1.4 }));
      var hlGeo = track(new THREE.BoxGeometry(0.05, 0.06, D * 0.26)), tlGeo = track(new THREE.BoxGeometry(0.05, 0.07, D * 0.3));
      [D * 0.32, -D * 0.32].forEach(function (z) {
        var hl = new THREE.Mesh(hlGeo, headMat); hl.position.set(T.xf + 0.0, T.yn + 0.06, z); hl.rotation.z = -0.6; g.add(hl);
        var tl = new THREE.Mesh(tlGeo, tailMat); tl.position.set(T.xr - 0.01, T.deck - 0.14, z); g.add(tl);
      });
      var R = T.wr0;
      var tireGeo = track(new THREE.CylinderGeometry(R, R, 0.27, 48)); tireGeo.rotateX(Math.PI / 2);
      var rimGeo = track(new THREE.CylinderGeometry(R * 0.65, R * 0.65, 0.275, 40)); rimGeo.rotateX(Math.PI / 2);
      var hubGeo = track(new THREE.CylinderGeometry(0.06, 0.06, 0.29, 20)); hubGeo.rotateX(Math.PI / 2);
      var tireMat = track(new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.95, envMapIntensity: 0.2 }));
      var rimMat = track(new THREE.MeshStandardMaterial({ color: 0x3a3d42, metalness: 1, roughness: 0.3 }));
      var spokeMat = track(new THREE.MeshStandardMaterial({ color: 0xc4c8ce, metalness: 1, roughness: 0.2 }));
      var spokeGeo = track(new THREE.BoxGeometry(R * 1.17, 0.055, 0.04));
      var wz = D / 2 - 0.02;
      [[T.wf, wz], [T.wf, -wz], [T.wr, wz], [T.wr, -wz]].forEach(function (p) {
        [new THREE.Mesh(tireGeo, tireMat), new THREE.Mesh(rimGeo, rimMat), new THREE.Mesh(hubGeo, dark)].forEach(function (o) { o.position.set(p[0], R, p[1]); g.add(o); });
        if (!OUT) for (var sp = 0; sp < 5; sp++) { var s = new THREE.Mesh(spokeGeo, spokeMat); s.position.set(p[0], R, p[1] + (p[1] > 0 ? 0.125 : -0.125)); s.rotation.z = sp * Math.PI / 5; g.add(s); }
      });
      var sc = document.createElement('canvas'); sc.width = sc.height = 128;
      var cx = sc.getContext('2d'), grd = cx.createRadialGradient(64, 64, 4, 64, 64, 64);
      grd.addColorStop(0, 'rgba(0,0,0,0.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = grd; cx.fillRect(0, 0, 128, 128);
      var len = T.xf - T.xr;
      var shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(len * 1.2, D * 1.7)), track(new THREE.MeshBasicMaterial({ map: track(new THREE.CanvasTexture(sc)), transparent: true, depthWrite: false })));
      shadow.rotation.x = -Math.PI / 2; shadow.position.set((T.xf + T.xr) / 2, 0.005, 0);
      g.add(shadow);
      g.position.set(-(T.xf + T.xr) / 2, -T.yr * 0.48, 0);
      if (OUT) {
        var lineMat = track(new THREE.LineBasicMaterial({ color: lineC, toneMapped: false, transparent: true, opacity: 0.9 }));
        var fillMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
        var meshes = [];
        g.traverse(function (o) { if (o.isMesh && o !== shadow) meshes.push(o); });
        meshes.forEach(function (o) {
          var vc = !!(o.material && o.material.vertexColors);
          if (o === bodyMesh || o === ghMesh) {
            o.material = track(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
          } else if (o.userData.panel) {
            o.material = track(new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
          } else if (o.material === tailMatRef() || o.material === headMatRef()) {
            o.material = track(new THREE.MeshBasicMaterial({ color: o.material === tailMatRef() ? 0xff5a4a : 0xffffff, toneMapped: false }));
          } else {
            o.material = fillMat;
          }
          var e = new THREE.LineSegments(track(new THREE.EdgesGeometry(o.geometry, 24)), lineMat);
          e.position.copy(o.position); e.rotation.copy(o.rotation); e.scale.copy(o.scale);
          if (o.parent) o.parent.add(e);
        });
        shadow.visible = false;
        fillMats.push(fillMat);
        if (pillarMat) pillarMat.color.set(0xffffff);
      }
      return { group: g, disp: disp, bodyMesh: bodyMesh, ghMesh: ghMesh, panels: panels, pillarMat: pillarMat, len: len, fillMats: fillMats };
    };
  
    var colorOf = function (k) { var v = states[k] || 0; return v ? stateC[v] : paintBase; };
    var paintGeo = function (mesh) {
      var col = mesh.geometry.attributes.color, keys = mesh.userData.keys, c;
      for (var t = 0; t < keys.length; t++) {
        var k = keys[t];
        if (k === 'glass') c = OUT ? paintBase.clone().lerp(lineC, 0.035) : glassC;
        else if (k === 'body') c = paintBase;
        else if (k.indexOf('cap:') === 0) c = OUT ? paintBase : paintBase.clone().multiplyScalar(0.35);
        else c = colorOf(k);
        for (var v = 0; v < 3; v++) col.setXYZ(t * 3 + v, c.r, c.g, c.b);
      }
      col.needsUpdate = true;
    };
    var update = function (st) {
      if (st) states = st;
      paintGeo(built.bodyMesh); paintGeo(built.ghMesh);
      built.panels.forEach(function (p) { p.material.color.copy(colorOf(p.userData.panel)); });
      built.pillarMat.color.copy(paintBase);
      if (built.fillMats) built.fillMats.forEach(function (f) { f.color.copy(paintBase); });
      built.group.traverse(function (o) { if (o.isLineSegments) o.material.color.copy(lineC); if (o.isMesh && o.material && o.material.isMeshBasicMaterial && o.material.color && o !== built.bodyMesh && o !== built.ghMesh && !o.userData.panel && o.material.color.getHex() !== 0xff5a4a && o.material.color.getHex() !== 0xffffff) {} });
    };
    var setBody = function (type) {
      if (built) { scene.remove(built.group); built.disp.forEach(function (d) { d.dispose(); }); }
      built = build(type);
      scene.add(built.group);
      update();
      if (controls) { controls.minDistance = 5.2 * built.len / 4.6; }
    };
  
    var controls = null;
    var camera = new THREE.PerspectiveCamera(opts.hero ? 30 : 33, w / h, 0.1, 60);
    camera.position.set(opts.hero ? 5.6 : 5.0, opts.hero ? 1.5 : 2.3, opts.hero ? 4.4 : 4.9);
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enablePan = false; controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.minDistance = 5.2; controls.maxDistance = 10; controls.minPolarAngle = 0.55; controls.maxPolarAngle = 1.5;
    controls.autoRotate = opts.spin !== false; controls.autoRotateSpeed = opts.hero ? 0.9 : 1.6;
    controls.enabled = !opts.hero;
    controls.addEventListener('start', function () { controls.autoRotate = false; if (opts.onSpin) opts.onSpin(false); });
    setBody(opts.body || 'sedan');
    var fit = function () {
      var d = 7.3 * Math.max(1, built.len / 4.6) * (opts.hero ? 1.05 : 1);
      camera.position.setLength(d);
      controls.update();
    };
    fit();
  
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), down = null;
    var onDown = function (e) { down = { x: e.clientX, y: e.clientY }; };
    var onUp = function (e) {
      if (!down || opts.hero) return;
      var moved = Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y);
      down = null;
      if (moved > 6) return;
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObjects([built.bodyMesh, built.ghMesh].concat(built.panels), false)[0];
      if (!hit) return;
      var k = hit.object.userData.panel || (hit.object.userData.keys && hit.object.userData.keys[hit.faceIndex]);
      if (k && k.indexOf('cap:') === 0) k = k.slice(4);
      if (k && k !== 'body' && k !== 'glass' && opts.onPick) opts.onPick(k);
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
  
    var turn = 0, raf = 0, Y = new THREE.Vector3(0, 1, 0);
    var loop = function () {
      raf = requestAnimationFrame(loop);
      if (Math.abs(turn) > 0.001) { var step = turn * 0.12; camera.position.applyAxisAngle(Y, step); turn -= step; }
      controls.update();
      renderer.render(scene, camera);
    };
    loop();
  
    return {
      update: update,
      setBody: function (type) { setBody(type); fit(); },
      setPaint: function (hex, st) { paintBase.copy(C(hex)); lineC.copy(lum(paintBase) > 0.3 ? C('#000000') : C('#EDEAE4')); update(st); },
      setSpin: function (on) { controls.autoRotate = on; },
      rotate: function (rad) { controls.autoRotate = false; turn += rad; },
      dispose: function () {
        cancelAnimationFrame(raf);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerup', onUp);
        controls.dispose();
        if (built) built.disp.forEach(function (d) { d.dispose(); });
        envTex.dispose(); pmrem.dispose(); renderer.dispose();
      }
    };
  }
  count() {
    var self = this;
    if (this._raf) cancelAnimationFrame(this._raf);
    var t0 = null;
    this.setState({ k: 0 });
    var step = function (now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / 1200);
      self.setState({ k: p });
      if (p < 1) self._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }
  go(s, dir) {
    this.setState({ screen: s, dir: dir || 'f', menu: false });
    if (s === 'result' || s === 'home') this.count();
  }
  renderVals() {
    var self = this, S = this.state;
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    var t = S.dark ? {
      bg: '#000000', ink: '#EDEAE4', mute: '#9A978F', line: '#26262A', line2: '#3A3A3F', edge: '#5E5C57',
      body: '#1C1C20', glass: '#2C3036', soft: '#141416', tire: '#000000', rim: '#3A3A3F', warn: '#F2A93B'
    } : {
      bg: '#F5F6F7', ink: '#000000', mute: '#5B5E63', line: '#DDE0E3', line2: '#C5C9CE', edge: '#9AA0A6',
      body: '#E2E5E8', glass: '#B9C2CC', soft: '#EAECEE', tire: '#1A1A1A', rim: '#6B7076', warn: '#9A5B00'
    };

    // ---------- paint ----------
    var P = [
      ['bumperF', 'إكصدام', 'إكصدام قدام', 120, 56, 'translate3d(-130px,20px,0) rotateY(-90deg)', 0.5],
      ['bumperR', 'إكصدام', 'إكصدام ورا', 120, 56, 'translate3d(130px,20px,0) rotateY(90deg)', 0.5],
      ['hood', 'كبوت', 'كبوت', 75, 120, 'translate3d(-92.5px,-8px,0) rotateX(90deg)', 2],
      ['trunk', 'شنطة', 'شنطة', 65, 120, 'translate3d(97.5px,-8px,0) rotateX(90deg)', 2],
      ['roof', 'سقف', 'سقف', 120, 104, 'translate3d(5px,-50px,0) rotateX(90deg)', 6],
      ['fenderFR', 'رفرف', 'رفرف قدام يمين', 60, 56, 'translate3d(-100px,20px,60px)', 1.5],
      ['doorFR', 'باب', 'باب قدام يمين', 70, 56, 'translate3d(-35px,20px,60px)', 1.5],
      ['doorRR', 'باب', 'باب ورا يمين', 70, 56, 'translate3d(35px,20px,60px)', 1.5],
      ['fenderRR', 'رفرف', 'رفرف ورا يمين', 60, 56, 'translate3d(100px,20px,60px)', 3],
      ['fenderFL', 'رفرف', 'رفرف قدام شمال', 60, 56, 'translate3d(-100px,20px,-60px) rotateY(180deg)', 1.5],
      ['doorFL', 'باب', 'باب قدام شمال', 70, 56, 'translate3d(-35px,20px,-60px) rotateY(180deg)', 1.5],
      ['doorRL', 'باب', 'باب ورا شمال', 70, 56, 'translate3d(35px,20px,-60px) rotateY(180deg)', 1.5],
      ['fenderRL', 'رفرف', 'رفرف ورا شمال', 60, 56, 'translate3d(100px,20px,-60px) rotateY(180deg)', 3]
    ];
    var stName = ['فابريكا', 'رش', 'متغير'];
    var stBg = [t.body, '#F2A93B', '#5B9CF5'], stFg = [t.mute, '#000000', '#000000'], stBd = [t.edge, '#F2A93B', '#5B9CF5'];
    var counts = [0, 0, 0], paintPct = 0, replPct = 0, paintNames = [], replNames = [];
    var faces = P.map(function (d) {
      var v = S.paint[d[0]] || 0;
      counts[v] += 1;
      if (v === 1) { paintPct += d[6]; paintNames.push(d[2]); }
      if (v === 2) { replPct += d[6] * 1.3; replNames.push(d[2]); }
      return {
        label: d[1], full: d[2], aria: d[2] + '، ' + stName[v],
        bg: v ? stBg[v] : 'transparent', fg: v ? stFg[v] : t.ink, bd: v ? stBd[v] : t.line2,
        cycle: function () { self.pick(d[0]); }
      };
    });
    var G = [[104, 42, 'translate3d(-55px,-29px,0) rotateY(-90deg)'], [104, 42, 'translate3d(65px,-29px,0) rotateY(90deg)'],
      [120, 42, 'translate3d(5px,-29px,52px)'], [120, 42, 'translate3d(5px,-29px,-52px) rotateY(180deg)']];
    var glass = G.map(function (g) { return { w: g[0], h: g[1], l: -g[0] / 2, tp: -g[1] / 2, tf: g[2] }; });
    var wheels = [
      { tf: 'translate3d(-100px,46px,61px)' }, { tf: 'translate3d(100px,46px,61px)' },
      { tf: 'translate3d(-100px,46px,-61px) rotateY(180deg)' }, { tf: 'translate3d(100px,46px,-61px) rotateY(180deg)' }
    ];
    var EX = [['pillar', 'عمود متدهن', 4], ['chassis', 'شاسيه متلحم', 10], ['inside', 'دواخل متدهنة', 1.5]];
    var exPct = 0, exNames = [];
    var extras = EX.map(function (d) {
      var on = !!S.ex[d[0]];
      if (on) { exPct += d[2]; exNames.push(d[1]); }
      return {
        label: d[1], on: on ? 'true' : 'false',
        bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
        toggle: function () { var n = Object.assign({}, self.state.ex); n[d[0]] = !n[d[0]]; self.setState({ ex: n }); }
      };
    });

    // ---------- mech ----------
    var M = [
      ['engine', 'الموتور', [['gaskets', 'جوانات وتسريب زيت', 3000, 8000], ['waterpump', 'طرمبة مية', 2500, 6000], ['timing', 'سير أو جنزير الكاتينة', 6000, 15000], ['coils', 'كويلات وبوجيهات', 3000, 9000], ['overhaul', 'عَمرة موتور', 40000, 90000]]],
      ['gear', 'الفتيس', [['gearoil', 'زيت وفلتر فتيس', 2500, 5000], ['mechatronic', 'ميكاترونيك', 25000, 55000], ['clutch', 'دبرياج', 12000, 30000], ['gearoverhaul', 'عَمرة فتيس', 30000, 70000]]],
      ['susp', 'العفشة', [['shocksF', 'مساعدين قدام', 6000, 12000], ['shocksR', 'مساعدين ورا', 4000, 9000], ['arms', 'مقصات', 3000, 8000], ['bearings', 'بلي عجل', 1500, 4000], ['bushings', 'جلب وكوبلن', 1500, 5000]]],
      ['brakes', 'الفرامل', [['pads', 'تيل', 1200, 3000], ['discs', 'طنابير', 3000, 7000]]],
      ['ac', 'التكييف', [['freon', 'شحن فريون', 600, 1200], ['compressor', 'كمبروسر', 8000, 18000]]],
      ['elec', 'الكهربا', [['battery', 'بطارية', 3500, 5500], ['alternator', 'دينامو', 4000, 9000], ['starter', 'مارش', 3000, 7000]]],
      ['tires', 'الكاوتش', [['tires2', '2 كاوتش', 6000, 10000], ['tires4', '4 كاوتش', 12000, 20000]]]
    ];
    var mLo = 0, mHi = 0, mechNames = [];
    var k1 = function (n) { return Math.round(n / 1000) + ' ألف'; };
    var cats = M.map(function (c) {
      var n = 0;
      var parts = c[2].map(function (p) {
        var on = !!S.mech[p[0]];
        if (on) { n += 1; mLo += p[2]; mHi += p[3]; mechNames.push(p[1]); }
        return {
          name: p[1], cost: k1(p[2]) + ' لـ ' + k1(p[3]), on: on ? 'true' : 'false',
          bg: on ? '#F2A93B' : 'transparent', fg: on ? '#000000' : t.ink, bd: on ? '#F2A93B' : t.line2,
          toggle: function () { var m = Object.assign({}, self.state.mech); m[p[0]] = !m[p[0]]; self.setState({ mech: m }); }
        };
      });
      var open = S.open === c[0];
      var o = S.mo[c[0]] || {};
      var oLo = parseInt(String(o.lo || '').replace(/[^0-9]/g, ''), 10) || 0;
      var oHi = parseInt(String(o.hi || '').replace(/[^0-9]/g, ''), 10) || oLo;
      if (oHi < oLo) { var sw = oLo; oLo = oHi; oHi = sw; }
      if (o.on && (oLo || oHi)) { n += 1; mLo += oLo; mHi += Math.max(oLo, oHi); mechNames.push(o.name || 'حاجة تانية'); }
      var setO = function (patch) {
        var all = Object.assign({}, self.state.mo);
        all[c[0]] = Object.assign({}, all[c[0]] || {}, patch);
        self.setState({ mo: all });
      };
      return {
        otherOn: !!o.on, otherStr: o.on ? 'true' : 'false',
        otherBg: o.on ? t.ink : 'transparent', otherFg: o.on ? t.bg : t.ink, otherBd: o.on ? t.ink : t.edge,
        otherToggle: function () { setO({ on: !o.on }); },
        oName: o.name || '', oLo: o.lo || '', oHi: o.hi || '',
        onName: function (e) { setO({ name: e.target.value }); },
        onLo: function (e) { setO({ lo: e.target.value }); },
        onHi: function (e) { setO({ hi: e.target.value }); },
        name: c[1], parts: parts, open: open, expanded: open ? 'true' : 'false', rot: open ? 180 : 0,
        sum: n ? (n === 1 ? 'حاجة واحدة' : n + ' حاجات') : 'سليم', sumFg: n ? t.warn : t.mute,
        toggle: function () { self.setState({ open: open ? '' : c[0] }); }
      };
    });

    // ---------- price ----------
    var CAT = Component.remoteCat || Component.CAT;
    var car = S.car, info = (CAT[car.make] && CAT[car.make][car.model]) || null;
    var known = !!info;
    if (!info) info = { body: S.body || 'sedan', trims: [car.trim || 'عادية'], years: [], ref: 900000, zero: 0, n: 4 };
    var trimIx = Math.max(0, info.trims.indexOf(car.trim));
    var trimF = 1 + 0.035 * trimIx;
    var refMid = info.ref * Math.pow(1.07, (car.year || 2022) - 2022) * Math.pow(0.992, (S.km - 60000) / 10000) * trimF;
    if (info.zero) refMid = Math.min(refMid, info.zero * 0.95);   // a used car never prices above a new one
    var baseLo = Math.round(refMid * 0.955 / 5000) * 5000, baseHi = Math.round(refMid * 1.045 / 5000) * 5000, mid = (baseLo + baseHi) / 2;
    var nComps = known ? Math.max(5, Math.round(info.n * (1 - Math.abs((car.year || 2022) - 2022) * 0.12))) : 3;
    // the real app prices from the database; the design falls back to the sample estimate above
    var live = Component.remoteQuote ? Component.remoteQuote(car, S.km) : null;
    if (live && live.low) { baseLo = live.low; baseHi = live.high; mid = (baseLo + baseHi) / 2; nComps = live.n; if (live.zero) info = Object.assign({}, info, { zero: live.zero }); }
    var liveComps = live && live.comparables ? live.comparables : null;
    var conf = nComps >= 20 ? 'عالية' : nComps >= 8 ? 'متوسطة' : 'منخفضة';
    var r5 = function (n) { return Math.round(n / 5000) * 5000; };
    var agencyShare = S.km ? Math.min(1, S.agencyKm / S.km) : 0;
    var agencyAdd = r5(0.02 * mid * agencyShare);
    var paintDed = r5(mid * paintPct / 100), replDed = r5(mid * replPct / 100), exDed = r5(mid * exPct / 100);
    var finalLo = r5(baseLo + agencyAdd - paintDed - replDed - exDed - mHi);
    var finalHi = r5(baseHi + agencyAdd - paintDed - replDed - exDed - mLo);
    var ease = 1 - Math.pow(1 - S.k, 3);
    var rows = [{ label: 'زيها فابريكا في السوق', val: fmt(baseLo) + ' – ' + fmt(baseHi), sw: 'transparent', fg: t.ink }];
    if (agencyAdd) rows.push({ label: 'صيانات توكيل', val: '+' + fmt(agencyAdd), sw: 'transparent', fg: t.ink });
    if (paintDed) rows.push({ label: 'رش: ' + paintNames.join('، '), val: '−' + fmt(paintDed), sw: '#F2A93B', fg: t.ink });
    if (replDed) rows.push({ label: 'متغير: ' + replNames.join('، '), val: '−' + fmt(replDed), sw: '#5B9CF5', fg: t.ink });
    if (exDed) rows.push({ label: exNames.join('، '), val: '−' + fmt(exDed), sw: t.ink, fg: t.ink });
    if (mHi) rows.push({ label: mechNames.join('، '), val: '−(' + fmt(mLo) + ' – ' + fmt(mHi) + ')', sw: 'transparent', fg: t.ink });
    rows.push({ label: 'سعر الزيرو النهارده', val: info.zero ? fmt(info.zero) : 'مش متاح', sw: 'transparent', fg: t.mute });
    rows.forEach(function (r, i) { r.delay = (0.5 + i * 0.08).toFixed(2); });
    var hist = (function () {
      var months = ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر'];
      var mid = (finalLo + finalHi) / 2;
      var vals = [1.045, 1.04, 1.03, 1.028, 1.012, 1].map(function (f) { return mid * f; });
      var lo = Math.min.apply(null, vals) * 0.985, hi = Math.max.apply(null, vals) * 1.01;
      var X = function (i) { return Math.round(12 + i * (326 / 5)); };
      var Y = function (v) { return Math.round(118 - (v - lo) / (hi - lo) * 100); };
      var d = vals.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ' ' + Y(v); }).join(' ');
      var ch = (vals[5] / vals[0] - 1) * 100;
      return {
        line: d, area: d + ' L' + X(5) + ' 120 L' + X(0) + ' 120 Z', x: X(5), y: Y(vals[5]),
        labels: months.map(function (m, i) { return { m: m, x: X(i) }; }),
        top: fmt(r5(vals[0])), topY: Math.max(12, Y(vals[0]) - 8),
        change: (ch < 0 ? '−' : '+') + Math.abs(ch).toFixed(1) + '% في 6 شهور',
        aria: 'السعر نزل من ' + fmt(r5(vals[0])) + ' في يونيو لـ ' + fmt(r5(vals[5])) + ' في نوفمبر'
      };
    })();
    var spread = [0.86, 0.9, 0.92, 0.94, 0.955, 0.965, 0.98, 0.985, 0.995, 1.01, 1.025, 1.045, 1.07, 1.11];
    var prices = spread.slice(0, Math.min(spread.length, Math.max(5, nComps))).map(function (f) { return r5(mid * f); });
    var lo = r5(mid * 0.84), hi = r5(mid * 1.12), W = 343;
    var X = function (p) { return Math.max(0, Math.min(W, Math.round((p - lo) / (hi - lo) * W))); };
    var dots = prices.map(function (p, i) { return { x: X(p), c: (p >= finalLo && p <= finalHi) ? t.ink : t.edge, delay: (0.2 + i * 0.05).toFixed(2) }; });

    // ---------- search / compare ----------
    var CARS = [];
    Object.keys(CAT).forEach(function (mk) {
      Object.keys(CAT[mk]).forEach(function (md) {
        var c = CAT[mk][md], y = c.years[Math.max(0, c.years.length - 3)], m = c.ref * Math.pow(1.07, y - 2022);
        CARS.push({ id: mk + '|' + md + '|' + y, make: mk, model: md, year: y, name: mk + ' ' + md + ' ' + y, zero: c.zero, lo: r5(m * 0.955), hi: r5(m * 1.045), n: c.n });
      });
    });
    var q = S.q.trim();
    // the year typed wins when the model was sold that year
    var qYear = parseInt((Component._fz || (Component._fz = Component.fzInit())).norm(q).match(/\b(19|20)\d\d\b/) || 0, 10);
    var hits = q ? Component.fuzzy(q, CARS.map(function (c) {
      var cc = CAT[c.make][c.model];
      if (!qYear || cc.years.indexOf(qYear) < 0) return c;
      var m = Math.min(cc.ref * Math.pow(1.07, qYear - 2022), cc.zero ? cc.zero * 0.95 : Infinity);
      return Object.assign({}, c, { id: c.make + '|' + c.model + '|' + qYear, year: qYear, name: c.make + ' ' + c.model + ' ' + qYear, lo: r5(m * 0.955), hi: r5(m * 1.045) });
    }), function (c) { return c.name; }) : [];
    var sameMake = hits.length > 1 && hits[1].score === hits[0].score && hits[1].item.make === hits[0].item.make;
    var didYouMean = hits.length && !hits[0].exact && hits[0].score < 0.97 ? hits[0].item.make + (sameMake ? '' : ' ' + hits[0].item.model) : '';
    var results = hits.slice(0, 4).map(function (h) { return h.item; }).map(function (c) {
      var inTray = S.tray.indexOf(c.id) >= 0;
      return {
        name: c.name, used: fmt(c.lo) + ' – ' + fmt(c.hi), pressed: inTray ? 'true' : 'false',
        btn: inTray ? 'اتضافت' : 'قارن', bg: inTray ? t.ink : 'transparent', fg: inTray ? t.bg : t.ink, bd: inTray ? t.ink : t.line2,
        toggle: function () {
          var tr = self.state.tray.slice(), i = tr.indexOf(c.id);
          if (i >= 0) tr.splice(i, 1); else if (tr.length < 3) tr.push(c.id);
          self.setState({ tray: tr });
        }
      };
   });
    var findCar = function (id) {
      var hit = CARS.filter(function (x) { return x.id === id; })[0];
      if (hit) return hit;
      var p = id.split('|'), cc = (CAT[p[0]] || {})[p[1]], y = parseInt(p[2], 10) || 2022;
      if (!cc) return CARS[0];
      var mm = Math.min(cc.ref * Math.pow(1.07, y - 2022), cc.zero ? cc.zero * 0.95 : Infinity);
      return { id: id, make: p[0], model: p[1], year: y, name: p[0] + ' ' + p[1] + ' ' + y, zero: cc.zero, lo: r5(mm * 0.955), hi: r5(mm * 1.045), n: cc.n };
    };
    var cmpIds = S.tray.length >= 2 ? S.tray : [CARS[0].id, CARS[CARS.length - 1].id];
    var cmpCars = cmpIds.map(findCar);
    var cmp = cmpIds.map(function (id, i) {
      var c = findCar(id);
      return { name: c.name, zero: c.zero ? fmt(c.zero) : 'مش متاح', used: fmt(c.lo) + ' – ' + fmt(c.hi), n: c.n, ret: c.zero ? Math.round((c.lo + c.hi) / 2 / c.zero * 100) : 0, retTxt: c.zero ? Math.round((c.lo + c.hi) / 2 / c.zero * 100) + '%' : 'مفيش سعر زيرو', delay: (0.1 + i * 0.12).toFixed(2) };
    });

    var carName = car.make + ' ' + car.model + ' ' + car.trim + ' ' + car.year;
    var carShort = car.make + ' ' + car.model + ' ' + car.year;
    var MARKET = Component.remoteMarket || Component.MARKET;
    var pickOpts = [];
    if (S.picker) {
      var list = S.picker === 'make' ? Object.keys(CAT).sort()
        : S.picker === 'model' ? Object.keys(CAT[car.make] || {}).sort()
        : S.picker === 'year' ? (known ? info.years.slice().reverse() : [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018])
        : info.trims;
      var pq = S.pickOther.trim();
      if (pq) list = Component.fuzzy(pq, list, String).map(function (h) { return h.item; });
      pickOpts = list.map(function (v) {
        var on = String(car[S.picker]) === String(v);
        return { label: String(v), sel: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
          pick: function () { self.pickField(S.picker, v); } };
      });
    }
    // typed in the picker: take the closest catalog name when it's clearly the same, else use the text as written
    var useOther = function () {
      var v = self.state.pickOther.trim(); if (!v) return;
      var k = self.state.picker;
      if (k === 'year') { var F = Component._fz || (Component._fz = Component.fzInit()); v = String(parseInt(F.norm(v), 10) || self.state.car.year); }
      if (pickOpts.length && k !== 'year') {
        var top = Component.fuzzy(v, pickOpts.map(function (o) { return o.label; }), String)[0];
        if (top && top.score >= 0.8) return pickOpts.filter(function (o) { return o.label === top.item; })[0].pick();
      }
      if (k === 'make' || k === 'model') return self.pickField(k, v);
      var c = Object.assign({}, self.state.car);
      c[k] = k === 'year' ? parseInt(v, 10) : v;
      self.setState({ car: c, sheet: null, picker: null, pickOther: '' });
    };
    var sheetRows = [];
    if (S.sheet === 'alerts') {
      sheetRows = MARKET.map(function (m) {
        return { name: m.name, sub: m.kind + '، ' + m.when, val: fmt(m.price), tag: m.pct ? (m.delta > 0 ? '+' : '−') + Math.abs(m.delta) + '%' : (m.delta > 0 ? '+' : '−') + fmt(Math.abs(m.delta)),
          tagFg: m.up ? t.warn : '#5B9CF5', go: function () { self.setState({ sheet: 'item', item: m }); } };
      });
    } else if (S.sheet === 'zero') {
      Object.keys(CAT).forEach(function (mk) {
        Object.keys(CAT[mk]).forEach(function (md) {
          var c = CAT[mk][md];
          sheetRows.push({ name: mk + ' ' + md + ' ' + c.years[c.years.length - 1], sub: 'أرخص فئة', val: fmt(c.zero), tag: '', tagFg: t.mute,
            go: function () { self.setState({ sheet: null }); self.setCar({ make: mk, model: md, year: c.years[c.years.length - 1], trim: c.trims[0] }, 0); } });
        });
      });
    } else if (S.sheet === 'comps' && liveComps) {
      sheetRows = liveComps.map(function (cp) {
        // compared with the market range for a factory car, before this car's paint and repairs
        var inR = cp.adjusted >= baseLo && cp.adjusted <= baseHi;
        return { name: car.make + ' ' + car.model + ' ' + cp.year + (cp.km ? '، ' + fmt(cp.km) + ' كم' : ''), sub: cp.source + (cp.trim ? '، ' + cp.trim : ''), val: fmt(cp.price),
          tag: inR ? 'في الرينج' : (cp.adjusted < baseLo ? 'أرخص' : 'أغلى'), tagFg: inR ? t.ink : t.mute,
          go: function () { if (cp.url && window.open) window.open(cp.url, '_blank', 'noopener'); } };
      });
    } else if (S.sheet === 'comps') {
      var srcs = ['هتلاقي', 'السوق المفتوح', 'Sylndr', 'هتلاقي', 'هتلاقي', 'السوق المفتوح'];
      sheetRows = prices.map(function (p, i) {
        var y = (car.year || 2022) + (i % 3 === 0 ? -1 : i % 3 === 1 ? 0 : 1);
        var kmc = Math.max(5000, Math.round((S.km + (i - 6) * 9000) / 1000) * 1000);
        var inRange = p >= finalLo && p <= finalHi;
        return { name: car.make + ' ' + car.model + ' ' + y + '، ' + fmt(kmc) + ' كم', sub: srcs[i % srcs.length] + '، من ' + (2 + i * 3) + ' يوم', val: fmt(p),
          tag: inRange ? 'في الرينج' : (p < finalLo ? 'أرخص' : 'أغلى'), tagFg: inRange ? t.ink : t.mute, go: function () {} };
      });
    }
    var itemView = null;
    if (S.sheet === 'item' && S.item) {
      var m = S.item, c = m.car || {}, carTxt = (c.make || '') + ' ' + (c.model || '');
      var dAbs = m.pct ? Math.abs(m.delta) + '%' : fmt(Math.abs(m.delta));
      var dTxt = (m.delta > 0 ? '+' : '−') + dAbs;
      var rowsI = [], story = '', priceLabel = 'السعر';
      if (m.t === 'zero') {
        priceLabel = 'سعر الزيرو الجديد';
        story = 'الوكيل ' + (m.up ? 'زوّد' : 'نزّل') + ' سعر ' + carTxt + ' فئة ' + (c.trim || '—') + ' موديل ' + c.year + ' ' + fmt(Math.abs(m.delta)) + ' جنيه.';
        rowsI = [{ k: 'الفئة', v: c.trim || '—' }, { k: 'السعر القديم', v: m.old ? fmt(m.old) : '—' }, { k: 'السعر الجديد', v: fmt(m.price) },
          { k: 'الفرق', v: dTxt + (m.old ? ' (' + ((m.price / m.old - 1) * 100).toFixed(1) + '%)' : '') }, { k: 'اتغيّر', v: m.when }, { k: 'المصدر', v: m.source || 'هتلاقي' }];
      } else if (m.t === 'deal') {
        priceLabel = 'سعر الإعلان';
        story = 'الإعلان ده أرخص من نص السوق لنفس الموديل والسنة بـ ' + Math.abs(m.delta) + '%. اتأكد من الحالة قبل ما تتحرك: الفرق الكبير ساعات بيبقى حادثة أو ورق.';
        rowsI = [{ k: 'الفئة', v: c.trim || '—' }, { k: 'السنة', v: String(c.year) }, { k: 'العداد', v: m.km ? fmt(m.km) + ' كم' : '—' },
          { k: 'نص السوق', v: m.median ? fmt(m.median) : '—' }, { k: 'أرخص بـ', v: m.median ? fmt(m.median - m.price) + ' جنيه' : dAbs }, { k: 'المصدر', v: m.source || '' }, { k: 'المكان', v: m.city || '—' }, { k: 'نزل', v: m.when }];
      } else {
        priceLabel = 'نص الرينج دلوقتي';
        story = 'رينج المستعمل لـ ' + carTxt + ' ' + c.year + ' ' + (m.up ? 'طلع' : 'نزل') + ' ' + dAbs + ' ' + m.when + '، محسوب من ' + (m.source || 'الإعلانات') + '.';
        rowsI = [{ k: 'قبلها', v: m.old ? fmt(m.old) : '—' }, { k: 'دلوقتي', v: fmt(m.price) }, { k: 'التغيير', v: dTxt }, { k: 'الفترة', v: m.when }];
      }
      itemView = {
        price: fmt(m.price), priceLabel: priceLabel, delta: dTxt, rot: m.up ? 0 : 180, chipBg: m.up ? '#F2A93B' : '#5B9CF5',
        story: story, rows: rowsI, url: m.url || '', hasLink: !!m.url,
        priceBtnLabel: m.t === 'zero' ? 'سعّر مستعملة منها' : 'سعّرها بالتفصيل',
        priceBtnBg: m.url ? 'transparent' : t.ink, priceBtnFg: m.url ? t.ink : t.bg,
        price2: function () { self.setState({ sheet: null, item: null }); self.setCar(c, m.t === 'zero' ? 60000 : m.km); },
        compare: function () {
          var id = c.make + '|' + c.model + '|' + c.year, tr = self.state.tray.slice();
          if (tr.indexOf(id) < 0 && tr.length < 3) tr.push(id);
          self.setState({ tray: tr, sheet: null, item: null });
        }
      };
    }
    var order = ['car', 'paint', 'mech', 'result'];
    var idx = order.indexOf(S.screen);
    var stepLabels = ['1 العربية', '2 الدهان', '3 الميكانيكا', '4 السعر'];
    var steps = stepLabels.map(function (l, i) { return { label: l, bar: i <= idx ? t.ink : t.line2, fg: i === idx ? t.ink : t.mute }; });
    var services = Math.floor(S.km / 10000);

    var desk = !!Component.desk;
    // ---------- account ----------
    var A = Component.auth || { ready: true, enabled: true, user: null, items: [] };
    var me = A.user;
    var saveQ = { car: { make: car.make, model: car.model, year: car.year, trim: car.trim || '' }, km: S.km, low: finalLo, high: finalHi,
      details: { paint: paintNames, repl: replNames, other: exNames, mech: mechNames, n: nComps } };
    var qKey = function (c, km, lo, hi) { return [c.make, c.model, c.year, c.trim || '', km, lo, hi].join('|'); };
    var isSaved = (A.items || []).some(function (x) { return qKey(x.car, x.km, x.low, x.high) === qKey(saveQ.car, S.km, finalLo, finalHi); });
    var needLogin = function (why, action) {
      if (A.pending) A.pending(action);
      self.setState({ login: why, loginSent: false, loginErr: '', loginBusy: false, menu: false, sheet: null });
    };
    var doSave = function () {
      if (!me) return needLogin('save', { kind: 'save', q: saveQ });
      if (isSaved || self.state.saving) return;
      self.setState({ saving: true });
      A.save(saveQ).then(function () { self.setState({ saving: false }); self.flashMsg('اتحفظت في تسعيراتك'); },
        function () { self.setState({ saving: false }); self.flashMsg('ماتحفظتش، جرّب تاني'); });
    };
    var mailOk = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(S.loginEmail.trim());
    var sendLink = function () {
      var m = self.state.loginEmail.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)) return self.setState({ loginErr: 'اكتب إيميل صح، مثلاً name@gmail.com' });
      if (!A.email) return self.setState({ loginSent: true, loginErr: '' });
      self.setState({ loginBusy: true, loginErr: '' });
      A.email(m).then(function () { self.setState({ loginBusy: false, loginSent: true }); },
        function (e) { self.setState({ loginBusy: false, loginErr: /rate|seconds/i.test(String(e && e.message)) ? 'استنى دقيقة وجرّب تاني.' : 'ماقدرناش نبعت اللينك. اتأكد من الإيميل وجرّب تاني.' }); });
    };
    var P = (A.profile) || {};
    var pf = S.pf || { name: P.name || '', showroom: P.showroom || '', phone: P.phone || '', city: P.city || '' };
    var pfDirty = !!S.pf && ['name', 'showroom', 'phone', 'city'].some(function (k) { return (pf[k] || '') !== (P[k] || ''); });
    var phoneDigits = String(pf.phone || '').replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); }).replace(/[\s\-()]/g, '').replace(/^(\+|00)20/, '0');
    var phoneBad = !!pf.phone && !/^01[0125]\d{8}$/.test(phoneDigits);
    var setPf = function (k) { return function (e) { var n = Object.assign({}, pf); n[k] = e.target.value; self.setState({ pf: n, pfErr: '' }); }; };
    var displayName = P.name || (me && me.name) || '';
    var openAccount = function () { if (!me) return needLogin('account', null); self.setState({ profile: true, pf: null, pfErr: '', menu: false }); };
    var siteUrl = typeof location !== 'undefined' && location.origin && location.origin.indexOf('http') === 0 ? location.origin : 'https://sa3arly-6c4z.vercel.app';
    var ago = function (iso) {
      var d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
      return d <= 0 ? 'النهارده' : d === 1 ? 'امبارح' : d === 2 ? 'من يومين' : 'من ' + d + ' يوم';
    };

    var menuItems = [
      me ? { label: displayName || me.email, sub: 'حسابك: الصورة والمعرض والموبايل', go: openAccount, soon: false }
         : { label: 'ادخل حسابك', sub: 'احفظ تسعيراتك وشغّل التنبيهات', go: function () { needLogin('account', null); }, soon: false },
      { label: 'سعّر عربية', sub: 'من الصور والشيك ليست', go: function () { self.go('car'); }, soon: false },
      { label: 'قارن عربيات', sub: 'الزيرو والمستعمل جنب بعض', go: function () { self.go('compare'); }, soon: false },
      { label: 'أسعار الزيرو', sub: 'كل الماركات، بتتحدث كل يوم', go: function () { self.setState({ menu: false, sheet: 'zero' }); }, soon: false },
      { label: 'تنبيهاتي', sub: 'لما الزيرو يتغير أو تنزل عربية رخيصة', go: function () { if (!me) return needLogin('alerts', { kind: 'alerts' }); self.setState({ menu: false, sheet: 'alerts' }); }, soon: false },
      { label: 'تسعيراتي', sub: 'كل العربيات اللي سعّرتها', go: function () { self.setState({ menu: false, more: true }); self.go('home', 'b'); }, soon: false }
    ].map(function (m, i) { m.delay = (0.08 + i * 0.05).toFixed(2); m.op = m.soon ? 0.55 : 1; return m; });

    return {
      t: t, dark: S.dark, light: !S.dark, darkStr: S.dark ? 'true' : 'false',
      themeLabel: S.dark ? 'الوضع النهاري' : 'الوضع الليلي',
      swBg: S.dark ? t.ink : 'transparent', swKnob: S.dark ? t.bg : t.ink, knob: S.dark ? 3 : 25,
      toggleTheme: function () { self.setState({ dark: !self.state.dark }); },
      enterCls: S.dir === 'b' ? 'enter-b' : 'enter-f',
      isHome: S.screen === 'home', isCompare: S.screen === 'compare', isFlow: idx >= 0,
      isCar: S.screen === 'car', isPaint: S.screen === 'paint', isMech: S.screen === 'mech', isResult: S.screen === 'result',
      menu: S.menu, menuItems: menuItems,
      openMenu: function () { self.setState({ menu: true }); }, closeMenu: function () { self.setState({ menu: false }); },
      goCar: function () { self.go('car', 'f'); }, goPaint: function () { self.go('paint', 'f'); },
      goMech: function () { self.go('mech', 'f'); }, goResult: function () { self.go('result', 'f'); },
      goCompare: function () { self.go('compare', 'f'); }, goHomeBack: function () { self.go('home', 'b'); },
      back: function () { self.go(idx > 0 ? order[idx - 1] : 'home', 'b'); },
      steps: steps,
      q: S.q, onQ: function (e) { self.setState({ q: e.target.value }); },
      results: results, hasResults: results.length > 0, didYouMean: didYouMean, canCompare: S.tray.length >= 2, trayCount: S.tray.length,
      cmp: cmp,
      firstCmpName: cmpCars[0].name,
      priceFirstCmp: function () { var c = cmpCars[0]; self.setCar({ make: c.make, model: c.model, year: c.year, trim: CAT[c.make][c.model].trims[0] }, 60000); },
      km: S.km, kmTxt: fmt(S.km),
      onKm: function (e) {
        var v = parseInt(String(e.target.value).replace(/[^0-9]/g, ''), 10) || 0;
        self.setState({ km: v, agencyKm: Math.min(self.state.agencyKm, Math.floor(v / 10000) * 10000) });
      },
      kmErr: S.km <= 0, kmBorder: S.km <= 0 ? t.warn : t.edge,
      agencyKm: S.agencyKm, agencyTxt: S.agencyKm ? fmt(S.agencyKm) + ' كم' : 'مفيش',
      onAgency: function (e) { self.setState({ agencyKm: parseInt(e.target.value, 10) || 0 }); },
      agencyCount: Math.floor(S.agencyKm / 10000), serviceCount: services,
      faces: faces, glass: glass, wheels: wheels, extras: extras,
      nF: counts[0], nP: counts[1], nR: counts[2],
      lastTxt: S.last,
      resetPaint: function () { self.setState({ paint: {}, last: 'كل الأجزاء فابريكا' }); if (self._paint) self._paint.update({}); },
      bodyName: { sedan: 'سيدان', hatch: 'هاتشباك', crossover: 'كروس أوفر', suv: 'SUV', pickup: 'بيك أب', van: 'فان' }[S.body],
      bodyNote: S.bodyAuto ? ' (من الموديل)' : '',
      bodies: [['sedan', 'سيدان'], ['hatch', 'هاتشباك'], ['crossover', 'كروس أوفر'], ['suv', 'SUV'], ['pickup', 'بيك أب'], ['van', 'فان']].map(function (b) {
        var on = S.body === b[0];
        return { name: b[1], on: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
          pick: function () { self.setState({ body: b[0], bodyAuto: false }); } };
      }),
      scheme: S.dark ? 'dark' : 'light',
      mFilters: [['all', 'الكل'], ['zero', 'الزيرو'], ['deal', 'لقطات'], ['used', 'المستعمل']].map(function (f) {
        var on = S.mf === f[0];
        return { label: f[1], sel: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
          pick: function () { self.setState({ mf: f[0] }); } };
      }),
      market: MARKET.slice().sort(function (a, b) { return (b.city && b.city === P.city ? 1 : 0) - (a.city && a.city === P.city ? 1 : 0); }).filter(function (m) { return S.mf === 'all' || m.t === S.mf; }).slice(0, S.more ? 20 : 3).map(function (m) {
        var d = m.delta * ease;
        var dtxt = m.pct ? (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1).replace('.0', '') + '%' : (d > 0 ? '+' : '−') + fmt(Math.abs(Math.round(d / 1000) * 1000));
        if (!m.pct && d < 0) dtxt = '−' + fmt(Math.abs(Math.round(d / 1000) * 1000));
        return { name: m.name, kind: m.kind, when: m.when, price: fmt(m.price), delta: dtxt,
          dc: m.up ? t.warn : '#5B9CF5', rot: m.up ? 0 : 180, aria: m.name + '، ' + m.kind + '، التفاصيل',
          go: function () { self.setState({ sheet: 'item', item: m }); } };
      }),
      recent: [
        { name: carShort + '، ' + fmt(S.km) + ' كم', range: fmt(finalLo) + ' – ' + fmt(finalHi), note: isSaved ? 'آخر تسعير ليك، محفوظة' : 'آخر تسعير ليك', noteFg: '#5B9CF5', go: function () { self.go('result', 'f'); } }
      ].concat((me ? A.items || [] : []).filter(function (x) { return qKey(x.car, x.km, x.low, x.high) !== qKey(saveQ.car, S.km, finalLo, finalHi); }).map(function (x) {
        return { name: x.car.make + ' ' + x.car.model + ' ' + x.car.year + '، ' + fmt(x.km) + ' كم', range: fmt(x.low) + ' – ' + fmt(x.high), note: 'محفوظة ' + ago(x.at), noteFg: t.mute,
          go: function () { self.setCar({ make: x.car.make, model: x.car.model, year: x.car.year, trim: x.car.trim || '' }, x.km, 'result'); } };
      })).slice(0, S.more ? 30 : 4),
      recentLogin: !me && A.enabled !== false,
      openLogin: function () { needLogin('account', null); },
      doSave: doSave, savePressed: isSaved ? 'true' : 'false', saveFill: isSaved ? t.ink : 'none',
      saveAria: isSaved ? 'اتحفظت في تسعيراتك' : S.saving ? 'بتتحفظ' : 'احفظ التسعيرة',
      login: !!S.login, loginOff: A.ready && A.enabled === false, loginAsk: !S.loginSent && A.enabled !== false, loginSent: S.loginSent,
      loginTitle: { save: 'احفظ التسعيرة دي', alerts: 'شغّل التنبيهات' }[S.login] || 'ادخل حسابك',
      loginWhy: { save: 'ادخل مرة واحدة، وكل تسعيرة تحفظها هتلاقيها على أي موبايل أو كمبيوتر.', alerts: 'هنقولك أول ما سعر الزيرو يتغير أو تنزل عربية أرخص من السوق.' }[S.login] || 'تسعيراتك وتنبيهاتك تفضل معاك على أي جهاز. التسعير نفسه شغال من غير حساب.',
      loginEmail: S.loginEmail, onLoginEmail: function (e) { self.setState({ loginEmail: e.target.value, loginErr: '' }); },
      emailBtn: S.loginBusy ? 'بيتبعت…' : 'ابعتلي لينك الدخول', emailDisabled: S.loginBusy || !mailOk, emailOp: S.loginBusy || !mailOk ? 0.45 : 1,
      sendLink: sendLink, loginErr: S.loginErr, hasLoginErr: !!S.loginErr,
      loginKey: function (e) {
        if (e.key === 'Escape') { if (A.pending) A.pending(null); self.setState({ login: null }); }
        else if (e.key === 'Enter' && e.target && e.target.name === 'email') { e.preventDefault(); sendLink(); }
      },
      goGoogle: function () {
        if (!A.google) return;
        self.setState({ loginErr: '' });
        A.google().catch(function () { self.setState({ loginErr: 'الدخول بجوجل مش متاح دلوقتي. ادخل بالإيميل.' }); });
      },
      googleOn: A.googleOn !== false,
      mailBg: A.googleOn === false ? t.ink : 'transparent', mailFg: A.googleOn === false ? t.bg : t.ink,
      closeLogin: function () { if (A.pending) A.pending(null); self.setState({ login: null }); },
      editEmail: function () { self.setState({ loginSent: false }); },
      hasFlash: !!S.flash, flash: S.flash,
      installShow: !desk && !!Component.install && Component.install.show() && !S.installHidden,
      installSub: Component.install && Component.install.ios ? 'دوس مشاركة ⬆ وبعدين Add to Home Screen' : 'يفتح زي أي أبلكيشن، من غير ستور',
      installBtn: Component.install && Component.install.ios ? 'إزاي؟' : 'نزّله',
      doInstall: function () {
        var I = Component.install; if (!I) return;
        if (I.ios) return self.flashMsg('دوس زرار المشاركة ⬆ تحت، وبعدين Add to Home Screen');
        I.prompt().then(function (ok) { if (ok) self.setState({ installHidden: true }); });
      },
      hideInstall: function () { if (Component.install) Component.install.dismiss(); self.setState({ installHidden: true }); },
      desk: desk, shellCls: desk ? 'desk' : '',
      shellStyle: desk ? 'height: 100dvh; display: flex; flex-direction: column; background: ' + t.bg + '; color: ' + t.ink + '; font-family: Alexandria, sans-serif; transition: background .4s ease, color .4s ease' : 'display: contents',
      deskRow: desk ? 'flex: 1; min-height: 0; width: 100%; max-width: 1400px; margin: 0 auto; padding: 24px 40px 0; box-sizing: border-box; display: flex; gap: 56px' : 'display: contents',
      deskLinks: [['الرئيسية', 'home'], ['سعّر عربية', 'car'], ['قارن عربيات', 'compare'], ['أسعار الزيرو', 'zero']].map(function (l) {
        var on = l[1] === 'zero' ? S.sheet === 'zero' : (l[1] === 'car' ? idx >= 0 : S.screen === l[1]) && S.sheet !== 'zero';
        return { label: l[0], cur: on ? 'page' : 'false', bg: on ? t.soft : 'transparent', fg: on ? t.ink : t.mute,
          go: function () { if (l[1] === 'zero') self.setState({ sheet: 'zero' }); else { self.setState({ sheet: null }); self.go(l[1], 'f'); } } };
      }),
      deskAccount: me ? (P.showroom || displayName || 'حسابك') : 'ادخل',
      deskKey: idx >= 0 ? 'flow' : 'home', deskHome: idx < 0, deskFlow: idx >= 0,
      deskSaved: idx < 0 && !!me && (A.items || []).length > 0,
      deskStats: (function () {
        var mk = Object.keys(CAT), models = 0, ads = 0;
        mk.forEach(function (m) { Object.keys(CAT[m]).forEach(function (md) { models++; ads += CAT[m][md].n || 0; }); });
        return [{ n: fmt(ads), label: 'إعلان بنقارن بيهم' }, { n: fmt(models), label: 'موديل' }, { n: fmt(mk.length), label: 'ماركة' }];
      })(),
      deskMarket: !desk ? [] : MARKET.slice().sort(function (a, b) { return (b.city && b.city === P.city ? 1 : 0) - (a.city && a.city === P.city ? 1 : 0); }).slice(0, 12).map(function (m) {
        var dtxt = m.pct ? (m.delta > 0 ? '+' : '−') + Math.abs(m.delta).toFixed(1).replace('.0', '') + '%' : (m.delta > 0 ? '+' : '−') + fmt(Math.abs(Math.round(m.delta / 1000) * 1000));
        return { name: m.name, kind: m.kind, when: m.when, price: fmt(m.price), delta: dtxt, dc: m.up ? t.warn : '#5B9CF5',
          go: function () { self.setState({ sheet: 'item', item: m }); } };
      }),
      openZero: function () { self.setState({ sheet: 'zero' }); },
      deskZero: !desk ? [] : (function () {
        var out = [];
        Object.keys(CAT).forEach(function (mk) { Object.keys(CAT[mk]).forEach(function (md) { var c = CAT[mk][md]; if (c.zero) out.push({ mk: mk, md: md, c: c }); }); });
        return out.sort(function (a, b) { return (b.c.n || 0) - (a.c.n || 0); }).slice(0, 12).map(function (z) {
          var y = z.c.years[z.c.years.length - 1];
          return { name: z.mk + ' ' + z.md + ' ' + y, price: fmt(z.c.zero), go: function () { self.setCar({ make: z.mk, model: z.md, year: y, trim: z.c.trims[0] }, 0); } };
        });
      })(),
      deskComps: !desk || idx < 0 ? [] : liveComps ? liveComps.slice(0, 30).map(function (cp) {
        var inR = cp.adjusted >= baseLo && cp.adjusted <= baseHi;
        return { name: car.make + ' ' + car.model + ' ' + cp.year + (cp.km ? '، ' + fmt(cp.km) + ' كم' : ''), sub: cp.source + (cp.trim ? '، ' + cp.trim : ''), val: fmt(cp.price),
          tag: inR ? 'في الرينج' : (cp.adjusted < baseLo ? 'أرخص' : 'أغلى'), tagFg: inR ? t.ink : t.mute,
          go: function () { if (cp.url && window.open) window.open(cp.url, '_blank', 'noopener'); } };
      }) : prices.map(function (pr, i) {
        var y = (car.year || 2022) + (i % 3 === 0 ? -1 : i % 3 === 1 ? 0 : 1), kmc = Math.max(5000, Math.round((S.km + (i - 6) * 9000) / 1000) * 1000);
        var inRange = pr >= finalLo && pr <= finalHi;
        return { name: car.make + ' ' + car.model + ' ' + y + '، ' + fmt(kmc) + ' كم', sub: ['هتلاقي', 'السوق المفتوح', 'Sylndr'][i % 3] + '، من ' + (2 + i * 3) + ' يوم', val: fmt(pr),
          tag: inRange ? 'في الرينج' : (pr < finalLo ? 'أرخص' : 'أغلى'), tagFg: inRange ? t.ink : t.mute, go: function () {} };
      }),
      openAccount: openAccount, accountAria: me ? 'حسابك' : 'ادخل حسابك',
      hasAvatar: !!(me && P.avatar), avatarSrc: P.avatar || '', hasInitial: !!(me && !P.avatar), noUser: !me,
      initial: (displayName || (me && me.email) || '؟').trim().charAt(0).toUpperCase(),
      profileOpen: !!S.profile && !!me,
      closeProfile: function () { self.setState({ profile: false, pf: null }); },
      profileKey: function (e) { if (e.key === 'Escape') self.setState({ profile: false, pf: null }); },
      pfHasPhoto: !!P.avatar, pfNoPhoto: !P.avatar, pfPhoto: P.avatar || '',
      pfTitle: P.showroom || displayName || 'حسابك', userEmail: me ? me.email : '',
      photoNote: S.photoBusy ? 'بنرفع الصورة…' : P.avatar ? 'دوس على الصورة عشان تغيّرها' : 'دوس على الدايرة وحط صورتك',
      pickPhoto: function (e) {
        var f = e.target.files && e.target.files[0]; e.target.value = '';
        if (!f || !A.photo) return;
        self.setState({ photoBusy: true });
        A.photo(f).then(function (url) { return A.saveProfile({ avatar: url }); })
          .then(function () { self.setState({ photoBusy: false }); self.flashMsg('الصورة اتغيّرت'); },
            function () { self.setState({ photoBusy: false, pfErr: 'الصورة دي ماتنفعش، جرّب صورة تانية.' }); });
      },
      pfName: pf.name, pfShowroom: pf.showroom, pfPhone: pf.phone, pfCity: pf.city,
      onPfName: setPf('name'), onPfShowroom: setPf('showroom'), onPfPhone: setPf('phone'), onPfCity: setPf('city'),
      pfPhoneBd: phoneBad ? t.warn : t.line2,
      cities: (A.cities && A.cities.length) ? A.cities : ['القاهرة', 'الجيزة', 'الإسكندرية'],
      pfErr: S.pfErr || (phoneBad ? 'رقم الموبايل لازم يبقى 11 رقم ويبدأ بـ 01' : ''), hasPfErr: !!S.pfErr || phoneBad,
      pfSaveOff: !pfDirty || phoneBad || S.pfBusy, pfSaveOp: !pfDirty || phoneBad || S.pfBusy ? 0.45 : 1,
      pfSaveLabel: S.pfBusy ? 'بيتحفظ…' : 'احفظ',
      savePf: function () {
        if (!A.saveProfile) return;
        self.setState({ pfBusy: true, pfErr: '' });
        A.saveProfile({ name: pf.name, showroom: pf.showroom, phone: pf.phone, city: pf.city })
          .then(function () { self.setState({ pfBusy: false, pf: null }); self.flashMsg('اتحفظ'); },
            function () { self.setState({ pfBusy: false, pfErr: 'ماتحفظش. اتأكد من البيانات وجرّب تاني.' }); });
      },
      savedCount: (A.items || []).length,
      signOutNow: function () { self.setState({ profile: false, pf: null }); A.signOut().then(function () { self.flashMsg('خرجت من الحساب'); }); },
      hasFrom: !!(me && (P.showroom || P.name || P.phone)), fromName: P.showroom || P.name || '', fromPhone: P.phone || '',
      knobX: S.dark ? 0 : -22,
      noResults: !!q && results.length === 0,
      menuKey: function (e) { if (e.key === 'Escape') self.setState({ menu: false }); },
      heroOn: S.heroOn, heroOff: !S.heroOn, heroLabel: S.heroOn ? 'وقّف حركة العربية' : 'شغّل حركة العربية',
      toggleHero: function () {
        var on = !self.state.heroOn; self.setState({ heroOn: on });
        if (self._hero) self._hero.setSpin(on);
        clearInterval(self._cycle);
        if (on && self._hero) { var order = ['crossover', 'sedan', 'suv', 'hatch', 'pickup', 'van'], ix = 0; self._cycle = setInterval(function () { ix = (ix + 1) % order.length; if (self._hero) self._hero.setBody(order[ix]); }, 4500); }
      },
      presets: (function () {
        // each quick choice describes the whole car, so only one can match at a time
        var SIDES = ['fenderFR', 'fenderFL', 'fenderRR', 'fenderRL', 'doorFR', 'doorFL', 'doorRR', 'doorRL'];
        var FLATS = ['hood', 'roof', 'trunk'];
        var BUMPERS = ['bumperF', 'bumperR'];
        var ALL = SIDES.concat(FLATS, BUMPERS);
        var mapOf = function (painted) { var m = {}; ALL.forEach(function (k) { m[k] = painted.indexOf(k) >= 0 ? 1 : 0; }); return m; };
        var choices = [
          { label: 'رشة الجنبين', sub: '4 رفارف و4 أبواب بس', map: mapOf(SIDES), msg: 'الجنبين رش، والباقي فابريكا' },
          { label: 'فابريكا مسطحات', sub: 'كبوت وسقف وشنطة بس', map: mapOf(SIDES.concat(BUMPERS)), msg: 'المسطحات بس فابريكا، والباقي رش' },
          { label: 'رشة كاملة', sub: 'كل الأجزاء', map: mapOf(ALL), msg: 'العربية كلها رش' }
        ];
        return choices.map(function (c) {
          var on = ALL.every(function (k) { return (S.paint[k] || 0) === c.map[k]; });
          return {
            label: c.label, sub: c.sub, pressed: on ? 'true' : 'false',
            bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
            pick: function () {
              var n = on ? {} : Object.assign({}, c.map);   // a second tap takes the choice off again
              self.setState({ paint: n, spin: false, last: on ? 'اتشال الاختيار، العربية كلها فابريكا' : c.msg });
              if (self._paint) { self._paint.update(n); self._paint.setSpin(false); }
            }
          };
        });
      })(),
      resetAll: function () {
        self.setState({ paint: {}, ex: {}, exOther: false, spin: false, last: 'رجعت كل حاجة فابريكا' });
        if (self._paint) { self._paint.update({}); self._paint.setSpin(false); }
      },
      margin: S.margin, marginTxt: fmt(S.margin) + ' جنيه',
      onMargin: function (e) { self.setState({ margin: parseInt(e.target.value, 10) || 0 }); },
      sellTxt: fmt(r5((finalLo + finalHi) / 2)),
      maxBuyTxt: fmt(r5((finalLo + finalHi) / 2 - S.margin)),
      histLine: hist.line, histArea: hist.area, histX: hist.x, histY: hist.y, histLabels: hist.labels,
      histTop: hist.top, histTopY: hist.topY, histChange: hist.change, histAria: hist.aria,
      issues: (info.issues || Component.GENERIC_ISSUES).map(function (it) {
        var key = car.model + ':' + it[0];
        return { name: it[1], how: it[2], done: !!S.checked[key],
          toggle: function () { var c = Object.assign({}, self.state.checked); c[key] = !c[key]; self.setState({ checked: c }); } };
      }),
      receipt: S.receipt,
      openReceipt: function () { self.setState({ receipt: true, copied: false }); },
      closeReceipt: function () { self.setState({ receipt: false }); },
      receiptKey: function (e) { if (e.key === 'Escape') self.setState({ receipt: false }); },
      hideBuy: S.hideBuy, toggleHideBuy: function () { self.setState({ hideBuy: !self.state.hideBuy }); },
      paintSummary: (paintNames.length || replNames.length) ? ((paintNames.length ? paintNames.length + ' رش' : '') + (paintNames.length && replNames.length ? '، ' : '') + (replNames.length ? replNames.length + ' متغير' : '')) : 'فابريكا بالكامل',
      mechSummary: mHi ? mechNames.length + ' حاجات، ' + fmt(mLo) + ' – ' + fmt(mHi) : 'سليمة',
      copyLabel: S.copied ? 'اتنسخ' : 'انسخ',
      receiptDate: (function () { var d = new Date(); return d.getDate() + ' ' + ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][d.getMonth()] + ' ' + d.getFullYear(); })(),
      siteHost: siteUrl.replace(/^https?:\/\//, ''),
      copyLink: function () {
        try { if (navigator.clipboard) navigator.clipboard.writeText(siteUrl); } catch (e) {}
        self.setState({ copied: true });
      },
      waHref: 'https://wa.me/?text=' + encodeURIComponent('تسعير سعرلي: ' + carName + '، ' + fmt(S.km) + ' كم\nالسعر العادل: ' + fmt(finalLo) + ' – ' + fmt(finalHi) + ' جنيه' + (S.hideBuy ? '' : '\nأقصى سعر شرا: ' + fmt(r5((finalLo + finalHi) / 2 - S.margin))) + ((P.showroom || P.name) ? '\n— ' + (P.showroom || P.name) + (P.phone ? '، ' + P.phone : '') : '') + '\n' + siteUrl),
      carName: carName, carShort: carShort, nComps: nComps, compsBtn: 'شوف الـ ' + nComps + ' عربية',
      confTxt: 'ثقة ' + conf + '. قارنّا بـ ' + nComps + ' عربية من نفس الفئة وعدادها قريب، آخر 60 يوم.' + (known ? ' وشلنا الإعلانات اللي أسعارها شاذة.' : ' الموديل ده مش عندنا كفاية، فالرينج أعرض.'),
      axisLo: fmt(lo), axisHi: fmt(hi),
      detectTxt: (S.shotsDone.front || S.shotsDone.back || S.shotsDone.side) ? ('من الصور: ' + car.make + ' ' + car.model + '، فئة ' + car.trim + '. لو غلط غيّرها تحت.') : 'صوّر قدام أو ورا علشان نعرف الفئة لوحدنا.',
      fields: [['make', 'الماركة', car.make], ['model', 'الموديل', car.model], ['year', 'السنة', String(car.year)], ['trim', 'الفئة', car.trim]].map(function (f) {
        return { label: f[1], value: f[2], aria: f[1] + ': ' + f[2] + '، غيّر', open: function () { self.setState({ picker: f[0], pickOther: '', sheet: 'picker' }); } };
      }),
      shots: [['front', 'قدام'], ['back', 'ورا'], ['side', 'الجنب'], ['odo', 'العداد']].map(function (s2) {
        var d2 = !!S.shotsDone[s2[0]];
        return { label: s2[1], done: d2, todo: !d2, pressed: d2 ? 'true' : 'false', aria: (d2 ? 'اتصورت: ' : 'صوّر: ') + s2[1],
          line: d2 ? 'solid' : 'dashed', bd: d2 ? t.ink : t.edge, bg: d2 ? t.soft : 'transparent', fg: d2 ? t.ink : t.mute,
          toggle: function () { var o = Object.assign({}, self.state.shotsDone); o[s2[0]] = !o[s2[0]]; self.setState({ shotsDone: o }); } };
      }),
      addShot: function () { self.setState({ extraShots: self.state.extraShots + 1 }); },
      extraShotsLabel: S.extraShots ? ('+ صور تانية (' + S.extraShots + ' اتضافت)') : '+ صور تانية (الدواخل، الشاسيه، أي عيب)',
      openAlerts: function () { self.setState({ sheet: 'alerts' }); },
      openComps: function () { self.setState({ sheet: 'comps' }); },
      closeSheet: function () { self.setState({ sheet: null, picker: null, item: null }); },
      sheetKey: function (e) { if (e.key === 'Escape') self.setState({ sheet: null, picker: null }); },
      sheetOpen: !!S.sheet,
      isItem: S.sheet === 'item' && !!S.item, it: itemView,
      isPicker: S.sheet === 'picker', isList: S.sheet === 'alerts' || S.sheet === 'zero' || S.sheet === 'comps',
      sheetTitle: S.sheet === 'item' && S.item ? S.item.name : S.sheet === 'picker' ? ({ make: 'اختار الماركة', model: 'اختار الموديل', year: 'اختار السنة', trim: 'اختار الفئة' }[S.picker]) : S.sheet === 'alerts' ? 'التنبيهات' : S.sheet === 'zero' ? 'أسعار الزيرو النهارده' : S.sheet === 'comps' ? ('العربيات اللي اتقارنت (' + nComps + ')') : '',
      sheetNote: S.sheet === 'item' && S.item ? S.item.kind + '، ' + S.item.when : S.sheet === 'comps' ? 'مقارنة بالرينج لعربية فابريكا' : S.sheet === 'zero' ? 'من هتلاقي' : '',
      pickOpts: pickOpts,
      pickOther: S.pickOther, onPickOther: function (e) { self.setState({ pickOther: e.target.value }); },
      pickOtherEmpty: !S.pickOther.trim(), pickOtherOp: S.pickOther.trim() ? 1 : 0.4,
      pickOtherAria: 'حاجة تانية مش في القايمة', pickOtherPh: 'مش في القايمة؟ اكتبها…',
      pickNone: !!S.pickOther.trim() && pickOpts.length === 0,
      pickOtherKey: function (e) { if (e.key === 'Enter') { e.preventDefault(); useOther(); } },
      usePickOther: function () { useOther(); },
      sheetRows: sheetRows,
      paintLoading: !S.paintReady,
      wmKey: 'w' + S.wm, penKey: 'p' + S.wm,
      rewrite: function () { self.setState({ wm: self.state.wm + 1 }); },
      moreOpen: S.more, moreLabel: S.more ? 'أقل' : 'كل التغييرات',
      toggleMore: function () { self.setState({ more: !self.state.more, mf: 'all' }); },
      partsOpen: S.partsOpen, partsStr: S.partsOpen ? 'true' : 'false', partsRot: S.partsOpen ? 180 : 0,
      toggleParts: function () { self.setState({ partsOpen: !self.state.partsOpen }); },
      gl: S.gl, noGl: !S.gl, paintRef: this._paintRef, heroRef: this._heroRef,
      sel: ['make', 'model', 'year', 'trim'].reduce(function (acc, k) {
        acc[k] = function (e) {
          var o = Object.assign({}, self.state.oth); o[k] = e.target.value === '__other';
          var patch = { oth: o };
          var MAP = { 'فورمينتور': 'crossover', 'ليون': 'hatch', 'كورولا': 'sedan', 'سبورتاج': 'suv', 'هايلكس': 'pickup', 'هايس': 'van' };
          if (k === 'model' && MAP[e.target.value]) { patch.body = MAP[e.target.value]; patch.bodyAuto = true; }
          self.setState(patch);
        };
        return acc;
      }, {}),
      oth: S.oth,
      exOther: S.exOther, exOtherStr: S.exOther ? 'true' : 'false',
      exOtherBg: S.exOther ? t.ink : 'transparent', exOtherFg: S.exOther ? t.bg : t.ink,
      toggleExOther: function () { self.setState({ exOther: !self.state.exOther }); },
      spinLabel: S.spin ? 'وقّف اللفّ' : 'لفّ تلقائي',
      toggleSpin: function () { var on = !self.state.spin; self.setState({ spin: on }); if (self._paint) self._paint.setSpin(on); },
      carTf: 'rotateX(-20deg) rotateY(' + S.angle + 'deg)',
      carTr: S.dragging ? 'none' : 'transform .6s cubic-bezier(.2,.7,.2,1)',
      rotL: function () { self.setState({ spin: false }); if (self._paint) self._paint.rotate(Math.PI / 4); },
      rotR: function () { self.setState({ spin: false }); if (self._paint) self._paint.rotate(-Math.PI / 4); },
      dDown: function (e) { self._moved = false; self._drag = { x: e.clientX, a: self.state.spin ? -35 : self.state.angle }; },
      dMove: function (e) {
        if (!self._drag) return;
        var dx = e.clientX - self._drag.x;
        if (Math.abs(dx) > 5) self._moved = true;
        if (self._moved) self.setState({ spin: false, dragging: true, angle: self._drag.a + dx * 0.7 });
      },
      dUp: function () { self._drag = null; if (self.state.dragging) self.setState({ dragging: false }); },
      cats: cats, mechTxt: mHi ? fmt(mLo) + ' – ' + fmt(mHi) : 'مفيش',
      shownLo: fmt(r5(finalLo * ease)), shownHi: fmt(r5(finalHi * ease)),
      finalLoTxt: fmt(finalLo), finalHiTxt: fmt(finalHi),
      rows: rows, dots: dots, bandL: X(finalLo) - 6, bandW: Math.max(19, X(finalHi) - X(finalLo) + 19),
      stripAria: '14 عربية شبيهة، السعر العادل من ' + fmt(finalLo) + ' لـ ' + fmt(finalHi)
    };
  }

  render() {
    const v = this.renderVals();
    return (
<div className={v.shellCls} dir="rtl" style={css(v.shellStyle)}>
{(v.desk) && (<>
<header style={css(`height: 72px; flex: none; display: flex; align-items: center; gap: 28px; padding: 0 40px; border-bottom: 1px solid ${v.t.line}`)}>
<button onClick={v.goHomeBack} aria-label="سعرلي، الرئيسية" style={css(`background: none; border: none; padding: 0; color: ${v.t.ink}; cursor: pointer`)}>
<span translate="no" style={css("font-family: 'Aref Ruqaa', serif; font-size: 40px; font-weight: 700; line-height: 1")}>سعرلي</span>
</button>
<nav aria-label="الأقسام" style={css("display: flex; gap: 4px; flex: 1")}>
{(v.deskLinks || []).map((dl, i1) => (<React.Fragment key={i1}>
<button className="press" onClick={dl.go} aria-current={dl.cur} style={css(`height: 40px; padding: 0 16px; border-radius: 999px; border: none; background: ${dl.bg}; color: ${dl.fg}; font-size: 14px; font-weight: 500`)}>{dl.label}</button>
</React.Fragment>))}
</nav>
<button className="press" onClick={v.toggleTheme} aria-label={v.themeLabel} style={css(`width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M15.5 11.2A7 7 0 0 1 6.8 2.5a7 7 0 1 0 8.7 8.7z" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button className="press" onClick={v.openAccount} style={css(`height: 40px; padding: 0 6px 0 16px; border-radius: 999px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; gap: 10px; font-size: 14px`)}>
{(v.hasAvatar) && (<><img src={v.avatarSrc} alt="" width="28" height="28" style={css("width: 28px; height: 28px; border-radius: 50%; object-fit: cover")} /></>)}
{(v.hasInitial) && (<><span aria-hidden="true" style={css(`width: 28px; height: 28px; border-radius: 50%; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center`)}>{v.initial}</span></>)}
<span style={css("padding-left: 10px")}>{v.deskAccount}</span>
</button>
</header>
</>)}
<div style={css(v.deskRow)}>
<div className="app-col" dir="rtl" style={css(`width: 100%; max-width: 520px; height: 100dvh; margin: 0 auto; position: relative; overflow: hidden; color-scheme: ${v.scheme}; background: ${v.t.bg}; color: ${v.t.ink}; font-family: 'Alexandria', sans-serif; transition: background .4s ease, color .4s ease`)}>
{(v.isHome) && (<>
<div className={v.enterCls} style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 60px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.openMenu} aria-label="القائمة" aria-haspopup="dialog" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M0 1h22M0 7h22M8 13h14" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<div style={css("display: flex; gap: 2px")}>
<button className="press" onClick={v.toggleTheme} aria-label={v.themeLabel} style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
{(v.dark) && (<>
<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" fill="none"></circle><path d="M10 1v2.5M10 16.5V19M1 10h2.5M16.5 10H19M3.6 3.6l1.8 1.8M14.6 14.6l1.8 1.8M3.6 16.4l1.8-1.8M14.6 5.4l1.8-1.8" stroke="currentColor" strokeWidth="1.4"></path></svg>
</>)}
{(v.light) && (<>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M15.5 11.2A7 7 0 0 1 6.8 2.5a7 7 0 1 0 8.7 8.7z" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</>)}
</button>
<button className="press" onClick={v.openAlerts} aria-label="التنبيهات، 3 جديدة" aria-haspopup="dialog" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0; position: relative`)}>
<svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path d="M3 16V9a7 7 0 0 1 14 0v7l2 2H1zM7.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
<span className="num" style={css("position: absolute; top: 6px; left: 5px; min-width: 16px; height: 16px; border-radius: 8px; background: #F2A93B; color: #000000; font-size: 10px; font-weight: 600; display: flex; align-items: center; justify-content: center")}>3</span>
</button>
<button className="press" onClick={v.openAccount} aria-label={v.accountAria} aria-haspopup="dialog" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
{(v.hasAvatar) && (<>
<img src={v.avatarSrc} alt="" width="30" height="30" style={css(`width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid ${v.t.line2}`)} />
</>)}
{(v.hasInitial) && (<>
<span aria-hidden="true" style={css(`width: 30px; height: 30px; border-radius: 50%; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center`)}>{v.initial}</span>
</>)}
{(v.noUser) && (<>
<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.5" r="3.8" stroke="currentColor" strokeWidth="1.4" fill="none"></circle><path d="M2.5 19c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</>)}
</button>
</div>
</header>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px 20px; display: flex; flex-direction: column")}>
<div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: -26px")}>
<h1 translate="no" style={css("margin: 0; position: relative")}>
<button onClick={v.rewrite} aria-label="سعرلي" style={css(`background: none; border: none; padding: 0; color: ${v.t.ink}; cursor: pointer; position: relative; display: block`)}>
<span key={v.wmKey} className="write" style={css("display: block; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 76px; line-height: 1.35")}>سعرلي</span>
<span key={v.penKey} className="pen" aria-hidden="true"></span>
</button>
</h1>
<p style={css(`margin: 0 0 24px; max-width: 130px; font-size: 13px; line-height: 1.6; color: ${v.t.mute}`)}>اعرف تمن العربية قبل ما تدفع.</p>
</div>
<div style={css(`display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 16px; border-radius: 999px; background: ${v.t.soft}`)}>
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke={v.t.mute} strokeWidth="1.4" fill="none"></circle><path d="M11 11l4 4" stroke={v.t.mute} strokeWidth="1.4"></path></svg>
<label htmlFor="q" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>دوّر على عربية تقارنها</label>
<input id="q" name="search" value={v.q} onChange={v.onQ} placeholder="قارن عربيات… مثلاً: كورولا 2020" autoComplete="off" style={css(`flex: 1; min-width: 0; height: 44px; border: none; background: transparent; color: ${v.t.ink}; caret-color: #F2A93B; font-family: 'Alexandria', sans-serif; font-size: 15px`)} />
</div>
{(v.hasResults) && (<>
<div className="fade" style={css("display: flex; flex-direction: column; margin-top: 4px")}>
{(v.didYouMean) && (<>
<p aria-live="polite" style={css(`margin: 8px 4px 0; font-size: 13px; color: ${v.t.mute}`)}>قصدك <span style={css(`color: ${v.t.ink}`)}>{v.didYouMean}</span>؟</p>
</>)}
{(v.results || []).map((r, i2) => (<React.Fragment key={i2}>
<div style={css(`min-height: 60px; padding: 8px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid ${v.t.line}`)}>
<div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
<span style={css("font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{r.name}</span>
<span className="num" style={css(`font-size: 12px; color: ${v.t.mute}`)}>مستعمل {r.used}</span>
</div>
<button className="press" onClick={r.toggle} aria-pressed={r.pressed} style={css(`flex: none; min-height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid ${r.bd}; background: ${r.bg}; color: ${r.fg}; font-size: 13px`)}>{r.btn}</button>
</div>
</React.Fragment>))}
</div>
</>)}
{(v.noResults) && (<>
<p className="fade" aria-live="polite" style={css(`margin: 10px 4px 0; font-size: 13px; color: ${v.t.mute}; line-height: 1.7`)}>مفيش عربية بالاسم ده. جرّب اسم الماركة بس، أو الموديل من غير السنة.</p>
</>)}
{(v.canCompare) && (<>
<button className="press pop" onClick={v.goCompare} style={css(`margin-top: 12px; height: 48px; border-radius: 999px; border: 1px solid ${v.t.ink}; background: none; color: ${v.t.ink}; font-size: 15px; font-weight: 500`)}>قارن الـ {v.trayCount} عربيات</button>
</>)}
<section aria-labelledby="mkt" style={css("margin-top: 36px; display: flex; flex-direction: column")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 id="mkt" style={css("margin: 0; font-size: 17px; font-weight: 600")}>السوق النهارده</h2>
<button className="press" onClick={v.toggleMore} style={css(`min-height: 40px; padding: 0; background: none; border: none; color: ${v.t.mute}; font-size: 13px`)}>{v.moreLabel}</button>
</div>
{(v.moreOpen) && (<>
<div role="tablist" aria-label="نوع التغيير" className="fu" style={css("margin-top: 12px; display: flex; gap: 6px; overflow-x: auto")}>
{(v.mFilters || []).map((mf, i3) => (<React.Fragment key={i3}>
<button className="press" role="tab" aria-selected={mf.sel} onClick={mf.pick} style={css(`flex: none; min-height: 36px; padding: 0 14px; border-radius: 999px; border: 1px solid ${mf.bd}; background: ${mf.bg}; color: ${mf.fg}; font-size: 13px`)}>{mf.label}</button>
</React.Fragment>))}
</div>
</>)}
<ul style={css("list-style: none; margin: 6px 0 0; padding: 0")}>
{(v.market || []).map((mk, i4) => (<React.Fragment key={i4}>
<li style={css(`border-bottom: 1px solid ${v.t.line}`)}>
<button className="press" onClick={mk.go} aria-label={mk.aria} style={css(`width: 100%; min-height: 68px; padding: 10px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right`)}>
<span style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css("font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{mk.name}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{mk.kind}، {mk.when}</span>
</span>
<span style={css("flex: none; display: flex; flex-direction: column; align-items: flex-start; gap: 3px")}>
<span className="num" style={css("font-size: 15px; direction: ltr")}>{mk.price}</span>
<span className="num" style={css(`font-size: 12px; font-weight: 600; color: ${mk.dc}; direction: ltr; display: flex; align-items: center; gap: 4px`)}>
<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true" style={css(`transform: rotate(${mk.rot}deg)`)}><path d="M4.5 1L8 7H1z" fill="currentColor"></path></svg>{mk.delta}
                </span>
</span>
</button>
</li>
</React.Fragment>))}
</ul>
</section>
<section aria-labelledby="mine" style={css("margin-top: 36px; display: flex; flex-direction: column")}>
<h2 id="mine" style={css("margin: 0 0 4px; font-size: 17px; font-weight: 600")}>تسعيراتك</h2>
{(v.recent || []).map((rc, i5) => (<React.Fragment key={i5}>
<button className="press" onClick={rc.go} style={css(`min-height: 68px; padding: 10px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; text-align: right`)}>
<span style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css("font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{rc.name}</span>
<span style={css(`font-size: 12px; color: ${rc.noteFg}`)}>{rc.note}</span>
</span>
<span className="num" style={css("flex: none; font-size: 13px; direction: ltr")}>{rc.range}</span>
</button>
</React.Fragment>))}
{(v.recentLogin) && (<>
<button className="press" onClick={v.openLogin} style={css(`min-height: 48px; padding: 0; background: none; border: none; color: ${v.t.mute}; font-size: 13px; text-align: right`)}>ادخل حسابك عشان تسعيراتك تتحفظ وتلاقيها على أي موبايل ←</button>
</>)}
</section>
</main>
{(v.installShow) && (<>
<div className="fu" role="region" aria-label="نزّل الأبلكيشن" style={css(`flex: none; margin: 0 12px 8px; padding: 10px 10px 10px 14px; border-radius: 16px; background: ${v.t.soft}; border: 1px solid ${v.t.line}; display: flex; align-items: center; gap: 12px`)}>
<img src="/icon-192.png" alt="" width="40" height="40" style={css("flex: none; width: 40px; height: 40px; border-radius: 10px")} />
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
<span style={css("font-size: 14px; font-weight: 600")}>نزّل سعرلي على موبايلك</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.5`)}>{v.installSub}</span>
</span>
<button className="press" onClick={v.doInstall} style={css("flex: none; height: 36px; padding: 0 14px; border-radius: 999px; border: none; background: #F2A93B; color: #000000; font-size: 13px; font-weight: 600")}>{v.installBtn}</button>
<button className="press" onClick={v.hideInstall} aria-label="مش دلوقتي" style={css(`flex: none; width: 32px; height: 36px; background: none; border: none; color: ${v.t.mute}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
<svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.6"></path></svg>
</button>
</div>
</>)}
<footer style={css(`flex: none; padding: 10px 20px 24px; background: ${v.t.bg}; border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.goCar} style={css(`width: 100%; height: 54px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px`)}>
<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 4h4l2-3h6l2 3h4v11H1z" stroke="currentColor" strokeWidth="1.5" fill="none"></path><circle cx="10" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.5" fill="none"></circle></svg>
      سعّر عربية
    </button>
</footer>
</div>
</>)}
{(v.isFlow) && (<>
<div style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 64px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.back} aria-label="رجوع" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<span style={css("font-family: 'Aref Ruqaa', serif; font-size: 26px; font-weight: 700")} translate="no">سعرلي</span>
<button className="press" onClick={v.toggleTheme} aria-label={v.themeLabel} style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
{(v.dark) && (<>
<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" fill="none"></circle><path d="M10 1v2.5M10 16.5V19M1 10h2.5M16.5 10H19M3.6 3.6l1.8 1.8M14.6 14.6l1.8 1.8M3.6 16.4l1.8-1.8M14.6 5.4l1.8-1.8" stroke="currentColor" strokeWidth="1.4"></path></svg>
</>)}
{(v.light) && (<>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M15.5 11.2A7 7 0 0 1 6.8 2.5a7 7 0 1 0 8.7 8.7z" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</>)}
</button>
</header>
<ol aria-label="خطوات التسعير" style={css("list-style: none; margin: 0; padding: 2px 20px 0; flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px")}>
{(v.steps || []).map((s, i6) => (<React.Fragment key={i6}>
<li style={css("display: flex; flex-direction: column; gap: 8px")}>
<span style={css(`height: 2px; background: ${s.bar}; transition: background .5s ease`)}></span>
<span style={css(`font-size: 12px; color: ${s.fg}`)}>{s.label}</span>
</li>
</React.Fragment>))}
</ol>
{(v.isCar) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 20px 20px 8px; display: flex; flex-direction: column; gap: 20px")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>العربية</h1>
<div style={css("display: flex; flex-direction: column; gap: 10px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>صوّر العربية، وإحنا نعرف الفئة ونشوف البرّا</span>
<div style={css("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px")}>
{(v.shots || []).map((sh, i7) => (<React.Fragment key={i7}>
<button className="press" onClick={sh.toggle} aria-pressed={sh.pressed} aria-label={sh.aria} style={css(`height: 74px; border: 1px ${sh.line} ${sh.bd}; border-radius: 12px; background: ${sh.bg}; color: ${sh.fg}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 11px; padding: 0`)}>
{(sh.done) && (<>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9.5l3.5 3.5L15 4.5" stroke="currentColor" strokeWidth="1.6" fill="none"></path></svg>
</>)}
{(sh.todo) && (<>
<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 4h4l2-3h6l2 3h4v11H1z" stroke="currentColor" strokeWidth="1.2" fill="none"></path><circle cx="10" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.2" fill="none"></circle></svg>
</>)}
              {sh.label}
            </button>
</React.Fragment>))}
</div>
<button className="press" onClick={v.addShot} style={css(`align-self: flex-start; min-height: 36px; padding: 0 14px; border-radius: 999px; border: 1px dashed ${v.t.edge}; background: none; color: ${v.t.ink}; font-size: 12px`)}>{v.extraShotsLabel}</button>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>{v.detectTxt}</p>
</div>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px")}>
{(v.fields || []).map((fd, i8) => (<React.Fragment key={i8}>
<div style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{fd.label}</span>
<button className="press" onClick={fd.open} aria-haspopup="dialog" aria-label={fd.aria} style={css(`height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0; border: none; border-bottom: 1px solid ${v.t.edge}; background: none; color: ${v.t.ink}; font-size: 16px; text-align: right; min-width: 0`)}>
<span style={css("overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{fd.value}</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css("flex: none")}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
</div>
</React.Fragment>))}
<label style={css(`grid-column: span 2; display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: ${v.t.mute}`)}>العداد (كم)
          <input name="km" autoComplete="off" inputMode="numeric" aria-invalid={v.kmErr} aria-describedby="kmErr" value={v.kmTxt} onChange={v.onKm} style={css(`height: 46px; background: ${v.t.bg}; color: ${v.t.ink}; border: none; border-bottom: 1px solid ${v.kmBorder}; font-family: 'Alexandria', sans-serif; font-size: 22px; font-weight: 300; padding: 0; direction: ltr; text-align: right`)} />
{(v.kmErr) && (<><span id="kmErr" role="alert" style={css(`font-size: 12px; color: ${v.t.warn}`)}>اكتب العداد بالكيلومتر، مثلاً 85,000. من غيره السعر مش هيبقى دقيق.</span></>)}
</label>
</div>
<div style={css(`display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: ${v.t.soft}`)}>
<label htmlFor="agency" style={css("display: flex; justify-content: space-between; align-items: baseline; font-size: 13px")}>
<span>صيانات توكيل لحد كام كم؟</span>
<span style={css("font-size: 17px; font-weight: 500; direction: ltr")}>{v.agencyTxt}</span>
</label>
<input id="agency" type="range" min="0" max={v.km} step="10000" value={v.agencyKm} onChange={v.onAgency} style={css(`width: 100%; height: 30px; accent-color: ${v.t.ink}; direction: ltr`)} />
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>الصيانة كل 10,000 كم. يعني {v.agencyCount} صيانة من {v.serviceCount} اتعملوا في التوكيل.</span>
</div>
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.goPaint} style={css(`width: 100%; height: 52px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>التالي: الدهان</button>
</footer>
</div>
</>)}
{(v.isPaint) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 8px; display: flex; flex-direction: column; gap: 10px")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>الدهان</h1>
<button className="press" onClick={v.resetPaint} style={css(`min-height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 13px; padding: 0`)}>كله فابريكا</button>
</div>
<p style={css(`margin: 0; font-size: 13px; color: ${v.t.mute}; line-height: 1.6`)}>لفّ العربية بصباعك، ودوس على أي جزء: فابريكا ثم رش ثم متغير.</p>
{(v.gl) && (<>
<div style={css("position: relative; align-self: center")}>
{(v.paintLoading) && (<><span aria-hidden="true" style={css(`position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: ${v.t.mute}`)}>بنجهّز العربية…</span></>)}
<canvas ref={v.paintRef} width="350" height="240" role="img" aria-label="عربية 3D: لفّها بصباعك ودوس على أي جزء" style={css("width: 350px; height: 240px; display: block; position: relative; flex: none; align-self: center; touch-action: none; cursor: grab")}></canvas>
</div>
</>)}
{(v.noGl) && (<>
<p style={css(`margin: 0; padding: 20px 0; font-size: 13px; color: ${v.t.mute}; text-align: center`)}>الجهاز ده مش بيعرض 3D. علّم على الأجزاء من القايمة تحت.</p>
</>)}
<div style={css("display: flex; justify-content: center; gap: 10px")}>
<button className="press" onClick={v.rotL} aria-label="لفّ يمين" style={css(`width: 44px; height: 44px; border-radius: 50%; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M2 8a7 7 0 1 0 2-5M2 1v4h4" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button className="press" onClick={v.toggleSpin} style={css(`min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; font-size: 13px`)}>{v.spinLabel}</button>
<button className="press" onClick={v.rotR} aria-label="لفّ شمال" style={css(`width: 44px; height: 44px; border-radius: 50%; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M16 8a7 7 0 1 1-2-5M16 1v4h-4" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
</div>
<p aria-live="polite" style={css("margin: 0; min-height: 20px; text-align: center; font-size: 13px")}>{v.lastTxt}</p>
<div role="group" aria-label="اختيارات سريعة" style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px")}>
{(v.presets || []).map((ps, i9) => (<React.Fragment key={i9}>
<button className="press" onClick={ps.pick} aria-pressed={ps.pressed} style={css(`min-height: 52px; padding: 6px 8px; border-radius: 12px; border: 1px solid ${ps.bd}; background: ${ps.bg}; color: ${ps.fg}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px`)}>
<span style={css("font-size: 13px; font-weight: 500")}>{ps.label}</span>
<span style={css("font-size: 11px; opacity: .75")}>{ps.sub}</span>
</button>
</React.Fragment>))}
<button className="press" onClick={v.resetAll} style={css(`min-height: 52px; padding: 6px 8px; border-radius: 12px; border: 1px dashed ${v.t.edge}; background: transparent; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 500`)}>
<svg width="16" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M2 8a7 7 0 1 0 2-5M2 1v4h4" stroke="currentColor" strokeWidth="1.5" fill="none"></path></svg>
          ريست
        </button>
</div>
<div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
<div style={css(`display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-top: 1px solid ${v.t.ink}`)}>
<span style={css("font-size: 22px; font-weight: 300")}>{v.nF}</span><span style={css(`font-size: 12px; color: ${v.t.mute}`)}>فابريكا</span>
</div>
<div style={css("display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-top: 3px solid #F2A93B")}>
<span style={css("font-size: 22px; font-weight: 300")}>{v.nP}</span><span style={css(`font-size: 12px; color: ${v.t.mute}`)}>رش</span>
</div>
<div style={css("display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-top: 3px solid #5B9CF5")}>
<span style={css("font-size: 22px; font-weight: 300")}>{v.nR}</span><span style={css(`font-size: 12px; color: ${v.t.mute}`)}>متغير</span>
</div>
</div>
<div style={css("display: flex; gap: 8px; flex-wrap: wrap")}>
{(v.extras || []).map((x, i10) => (<React.Fragment key={i10}>
<button className="press" onClick={x.toggle} aria-pressed={x.on} style={css(`min-height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid ${x.bd}; background: ${x.bg}; color: ${x.fg}; font-size: 13px`)}>{x.label}</button>
</React.Fragment>))}
<button className="press" onClick={v.toggleExOther} aria-pressed={v.exOtherStr} style={css(`min-height: 40px; padding: 0 16px; border-radius: 999px; border: 1px dashed ${v.t.edge}; background: ${v.exOtherBg}; color: ${v.exOtherFg}; font-size: 13px`)}>حاجة تانية</button>
</div>
{(v.exOther) && (<>
<input className="fade" name="paint_other" autoComplete="off" aria-label="إيه اللي متدهن أو متغير؟" placeholder="مثلاً: سقف الشنطة من جوه…" style={css(`height: 44px; margin-top: 4px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 10px; padding: 0 10px; font-family: 'Alexandria', sans-serif; font-size: 14px`)} />
</>)}
<button className="press" onClick={v.toggleParts} aria-expanded={v.partsStr} style={css(`min-height: 44px; display: flex; align-items: center; justify-content: space-between; background: none; border: none; border-top: 1px solid ${v.t.line}; color: ${v.t.ink}; font-size: 13px; padding: 0`)}>
<span>قايمة الأجزاء (لو اللمس على العربية صعب)</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.partsRot}deg); transition: transform .3s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.partsOpen) && (<>
<div className="fu" style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px")}>
{(v.faces || []).map((f, i11) => (<React.Fragment key={i11}>
<button className="press" onClick={f.cycle} aria-label={f.aria} style={css(`min-height: 44px; padding: 4px 6px; border-radius: 10px; border: 1px solid ${f.bd}; background: ${f.bg}; color: ${f.fg}; font-size: 12px; line-height: 1.3; transition: background .3s ease`)}>{f.full}</button>
</React.Fragment>))}
</div>
</>)}
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.goMech} style={css(`width: 100%; height: 52px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>التالي: الميكانيكا</button>
</footer>
</div>
</>)}
{(v.isMech) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 8px; display: flex; flex-direction: column")}>
<h1 style={css("margin: 0 0 4px; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>الميكانيكا</h1>
<p style={css(`margin: 0 0 12px; font-size: 13px; color: ${v.t.mute}`)}>افتح أي بند وعلّم على الحاجة اللي محتاجة تتغير بس.</p>
{(v.cats || []).map((c, i12) => (<React.Fragment key={i12}>
<div style={css(`border-top: 1px solid ${v.t.line}; padding-top: 4px`)}>
<button className="press" onClick={c.toggle} aria-expanded={c.expanded} style={css(`width: 100%; min-height: 54px; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: ${v.t.ink}; padding: 0`)}>
<span style={css("font-size: 15px")}>{c.name}</span>
<span style={css("display: flex; align-items: center; gap: 10px")}>
<span style={css(`font-size: 12px; color: ${c.sumFg}`)}>{c.sum}</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${c.rot}deg); transition: transform .3s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</span>
</button>
{(c.open) && (<>
<div className="fu" style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding: 0 0 14px")}>
{(c.parts || []).map((pt, i13) => (<React.Fragment key={i13}>
<button className="press" onClick={pt.toggle} aria-pressed={pt.on} style={css(`min-height: 56px; padding: 8px 12px; border-radius: 12px; border: 1px solid ${pt.bd}; background: ${pt.bg}; color: ${pt.fg}; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 3px; text-align: right; transition: background .25s ease`)}>
<span style={css("font-size: 13px; font-weight: 500")}>{pt.name}</span>
<span style={css("font-size: 11px; opacity: .8")}>{pt.cost}</span>
</button>
</React.Fragment>))}
<button className="press" onClick={c.otherToggle} aria-pressed={c.otherStr} style={css(`min-height: 56px; padding: 8px 12px; border-radius: 12px; border: 1px dashed ${c.otherBd}; background: ${c.otherBg}; color: ${c.otherFg}; font-size: 13px; text-align: right`)}>حاجة تانية</button>
{(c.otherOn) && (<>
<div className="fade" style={css("grid-column: span 2; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
<input value={c.oName} onChange={c.onName} name="part_name" autoComplete="off" aria-label="اسم القطعة أو العطل" placeholder="مثلاً: كاتينة…" style={css(`grid-column: span 2; height: 44px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 10px; padding: 0 10px; font-family: 'Alexandria', sans-serif; font-size: 14px`)} />
<input value={c.oLo} onChange={c.onLo} name="part_lo" autoComplete="off" inputMode="numeric" aria-label="التكلفة من (جنيه)" placeholder="من…" style={css(`height: 44px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 10px; padding: 0 10px; font-family: 'Alexandria', sans-serif; font-size: 14px; direction: ltr; text-align: right`)} />
<input value={c.oHi} onChange={c.onHi} name="part_hi" autoComplete="off" inputMode="numeric" aria-label="التكلفة لحد (جنيه)" placeholder="لحد…" style={css(`height: 44px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 10px; padding: 0 10px; font-family: 'Alexandria', sans-serif; font-size: 14px; direction: ltr; text-align: right`)} />
</div>
</>)}
</div>
</>)}
</div>
</React.Fragment>))}
<div style={css(`display: flex; align-items: baseline; justify-content: space-between; border-top: 1px solid ${v.t.ink}; padding-top: 14px; margin-top: 4px`)}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>تصليح متوقع</span>
<span style={css("font-size: 17px; font-weight: 400; direction: ltr")}>{v.mechTxt}</span>
</div>
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.goResult} style={css(`width: 100%; height: 52px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>احسب السعر</button>
</footer>
</div>
</>)}
{(v.isResult) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 16px 20px 8px; display: flex; flex-direction: column")}>
<span style={css("font-size: 14px")}>{v.carName}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; margin-top: 3px`)}>{v.kmTxt} كم، صيانات توكيل لحد {v.agencyTxt}</span>
<div style={css("margin-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 0")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>السعر العادل</span>
<span style={css("display: flex; align-items: baseline; gap: 10px")}><span style={css(`font-size: 16px; color: ${v.t.mute}`)}>من</span><span style={css("font-size: 46px; font-weight: 200; direction: ltr; font-variant-numeric: tabular-nums")}>{v.shownLo}</span></span>
<span style={css("display: flex; align-items: baseline; gap: 10px")}><span style={css(`font-size: 16px; color: ${v.t.mute}`)}>لـ</span><span style={css("font-size: 46px; font-weight: 200; direction: ltr; font-variant-numeric: tabular-nums")}>{v.shownHi}</span></span>
<span style={css("font-size: 14px; margin-top: 2px")}>جنيه</span>
</div>
<div dir="ltr" role="img" aria-label={v.stripAria} style={css("margin-top: 22px; position: relative; height: 44px; flex: none")}>
<div className="grow" style={css(`position: absolute; top: 21px; left: 0; right: 0; height: 1px; background: ${v.t.line2}`)}></div>
<div className="fade d4" style={css(`position: absolute; top: 12px; height: 19px; left: ${v.bandL}px; width: ${v.bandW}px; border: 1px solid ${v.t.ink}; border-radius: 10px; box-sizing: border-box`)}></div>
{(v.dots || []).map((d, i14) => (<React.Fragment key={i14}>
<span className="pop" style={css(`position: absolute; top: 18px; left: ${d.x}px; width: 7px; height: 7px; border-radius: 50%; background: ${d.c}; animation-delay: ${d.delay}s`)}></span>
</React.Fragment>))}
<span style={css(`position: absolute; top: 33px; left: 0; font-size: 11px; color: ${v.t.mute}`)}>{v.axisLo}</span>
<span style={css(`position: absolute; top: 33px; right: 0; font-size: 11px; color: ${v.t.mute}`)}>{v.axisHi}</span>
</div>
<p style={css(`margin: 8px 0 0; font-size: 12px; color: ${v.t.mute}; text-align: center; line-height: 1.7`)}>{v.confTxt}</p>
<dl style={css("margin: 20px 0 0; display: flex; flex-direction: column")}>
{(v.rows || []).map((rw, i15) => (<React.Fragment key={i15}>
<div className="fu" style={css(`display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 11px 0; border-top: 1px solid ${v.t.line}; animation-delay: ${rw.delay}s`)}>
<dt style={css(`font-size: 13px; color: ${rw.fg}; display: flex; align-items: center; gap: 8px`)}><span style={css(`width: 8px; height: 8px; border-radius: 2px; flex: none; background: ${rw.sw}`)}></span>{rw.label}</dt>
<dd className="num" style={css(`margin: 0; font-size: 13px; color: ${rw.fg}; direction: ltr; white-space: nowrap`)}>{rw.val}</dd>
</div>
</React.Fragment>))}
</dl>
<section aria-labelledby="deal" style={css("margin-top: 30px; display: flex; flex-direction: column; gap: 12px")}>
<h2 id="deal" style={css("margin: 0; font-size: 17px; font-weight: 600")}>تشتريها بكام؟</h2>
<label htmlFor="margin" style={css(`display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; color: ${v.t.mute}`)}>
<span>عايز تكسب فيها</span>
<span className="num" style={css(`font-size: 16px; color: ${v.t.ink}; direction: ltr`)}>{v.marginTxt}</span>
</label>
<input id="margin" type="range" min="0" max="150000" step="5000" value={v.margin} onChange={v.onMargin} style={css("width: 100%; height: 30px; accent-color: #F2A93B; direction: ltr")} />
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
<div style={css(`display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 14px; background: ${v.t.ink}; color: ${v.t.bg}`)}>
<span style={css("font-size: 12px; opacity: .8")}>ماتدفعش أكتر من</span>
<span className="num" style={css("font-size: 20px; font-weight: 500; direction: ltr; text-align: right")}>{v.maxBuyTxt}</span>
</div>
<div style={css(`display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 14px; border: 1px solid ${v.t.line2}`)}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>هتبيعها غالباً بـ</span>
<span className="num" style={css("font-size: 20px; font-weight: 300; direction: ltr; text-align: right")}>{v.sellTxt}</span>
</div>
</div>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>البيع محسوب على نص الرينج العادل، والتصليح متخصم خلاص من فوق.</p>
</section>
<section aria-labelledby="hist" style={css("margin-top: 30px; display: flex; flex-direction: column; gap: 10px")}>
<div style={css("display: flex; justify-content: space-between; align-items: baseline")}>
<h2 id="hist" style={css("margin: 0; font-size: 17px; font-weight: 600")}>السعر آخر 6 شهور</h2>
<span className="num" style={css("font-size: 13px; color: #5B9CF5; direction: ltr")}>{v.histChange}</span>
</div>
<svg width="350" height="150" viewBox="0 0 350 150" role="img" aria-label={v.histAria} style={css("display: block; overflow: visible")}>
<path d="M0 120 H350" stroke={v.t.line} strokeWidth="1"></path>
<path d="M0 70 H350" stroke={v.t.line} strokeWidth="1" strokeDasharray="2 4"></path>
<path d={v.histArea} fill={v.t.soft}></path>
<path className="draw" d={v.histLine} stroke={v.t.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
<circle cx={v.histX} cy={v.histY} r="4.5" fill="#F2A93B"></circle>
{(v.histLabels || []).map((hl, i16) => (<React.Fragment key={i16}>
<text x={hl.x} y="142" fill={v.t.mute} fontSize="11" textAnchor="middle" fontFamily="Alexandria, sans-serif">{hl.m}</text>
</React.Fragment>))}
<text x="350" y={v.histTopY} fill={v.t.mute} fontSize="11" textAnchor="end" fontFamily="Alexandria, sans-serif" className="num">{v.histTop}</text>
</svg>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}`)}>نص الرينج لـ{v.carShort} بالشهر، من الإعلانات اللي اتقارنت.</p>
</section>
<section aria-labelledby="issues" style={css("margin-top: 30px; display: flex; flex-direction: column")}>
<h2 id="issues" style={css("margin: 0 0 4px; font-size: 17px; font-weight: 600")}>اتأكد من دول في الموديل ده</h2>
<p style={css(`margin: 0 0 8px; font-size: 12px; color: ${v.t.mute}`)}>أشهر حاجات الملاك بيشتكوا منها. علّم على اللي فحصته.</p>
{(v.issues || []).map((is, i17) => (<React.Fragment key={i17}>
<label style={css(`display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-top: 1px solid ${v.t.line}; cursor: pointer`)}>
<input type="checkbox" checked={is.done} onChange={is.toggle} style={css("flex: none; width: 20px; height: 20px; margin: 2px 0 0; accent-color: #F2A93B")} />
<span style={css("display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 14px; font-weight: 500")}>{is.name}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>{is.how}</span>
</span>
</label>
</React.Fragment>))}
</section>
</main>
<footer style={css(`flex: none; padding: 10px 20px 22px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid ${v.t.line}`)}>
<div style={css("display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 52px; gap: 8px")}>
<button className="press" onClick={v.openReceipt} style={css(`height: 52px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>إيصال التسعير</button>
<button className="press" onClick={v.openComps} style={css(`height: 52px; border-radius: 999px; background: none; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; font-size: 15px; font-weight: 500`)}>{v.compsBtn}</button>
<button className="press" onClick={v.doSave} aria-label={v.saveAria} aria-pressed={v.savePressed} style={css(`height: 52px; border-radius: 999px; background: none; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
<svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true"><path d="M2 1.5h12v17l-6-4.2-6 4.2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={v.saveFill}></path></svg>
</button>
</div>
<button className="press" onClick={v.goCar} style={css(`height: 40px; background: none; border: none; font-size: 14px; color: ${v.t.mute}`)}>سعّر عربية تانية</button>
</footer>
</div>
</>)}
</div>
</>)}
{(v.isCompare) && (<>
<div className={v.enterCls} style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 64px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.goHomeBack} aria-label="رجوع" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<span style={css("font-family: 'Aref Ruqaa', serif; font-size: 26px; font-weight: 700")} translate="no">سعرلي</span>
<span style={css("width: 44px")}></span>
</header>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 14px 20px 24px; display: flex; flex-direction: column; gap: 18px")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>مقارنة</h1>
{(v.cmp || []).map((cc, i18) => (<React.Fragment key={i18}>
<div className="fu" style={css(`display: flex; flex-direction: column; gap: 10px; padding: 16px; border-radius: 16px; background: ${v.t.soft}; animation-delay: ${cc.delay}s`)}>
<span style={css("font-size: 16px; font-weight: 500")}>{cc.name}</span>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
<div style={css("display: flex; flex-direction: column; gap: 2px")}><span style={css(`font-size: 11px; color: ${v.t.mute}`)}>الزيرو النهارده</span><span style={css("font-size: 14px; direction: ltr; text-align: right")}>{cc.zero}</span></div>
<div style={css("display: flex; flex-direction: column; gap: 2px")}><span style={css(`font-size: 11px; color: ${v.t.mute}`)}>إعلانات شبيهة</span><span style={css("font-size: 14px")}>{cc.n}</span></div>
<div style={css("grid-column: span 2; display: flex; flex-direction: column; gap: 2px")}><span style={css(`font-size: 11px; color: ${v.t.mute}`)}>المستعمل</span><span style={css("font-size: 16px; direction: ltr; text-align: right")}>{cc.used}</span></div>
</div>
<div style={css("display: flex; flex-direction: column; gap: 6px")}>
<div style={css("display: flex; justify-content: space-between; font-size: 12px")}><span style={css(`color: ${v.t.mute}`)}>بتحتفظ بقيمتها</span><span>{cc.retTxt}</span></div>
<div style={css(`height: 6px; border-radius: 3px; background: ${v.t.line}; overflow: hidden`)}><div className="grow" style={css(`height: 100%; width: ${cc.ret}%; background: ${v.t.ink}; border-radius: 3px`)}></div></div>
</div>
</div>
</React.Fragment>))}
<button className="press" onClick={v.priceFirstCmp} style={css(`height: 52px; flex: none; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>سعّر {v.firstCmpName}</button>
</main>
</div>
</>)}
{(v.sheetOpen) && (<>
<div style={css("position: absolute; inset: 0; z-index: 13")}>
<button className="fade" onClick={v.closeSheet} aria-label="اقفل" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-label={v.sheetTitle} onKeyDown={v.sheetKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; max-height: 86%; overflow-y: auto; overscroll-behavior: contain; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 20px 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 40px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 style={css("margin: 0; font-size: 18px; font-weight: 600")}>{v.sheetTitle}</h2>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.sheetNote}</span>
</div>
{(v.isPicker) && (<>
<div style={css("display: flex; gap: 8px; align-items: center")}>
<input value={v.pickOther} onChange={v.onPickOther} onKeyDown={v.pickOtherKey} name="other_value" autoComplete="off" aria-label={v.pickOtherAria} placeholder={v.pickOtherPh} style={css(`flex: 1; min-width: 0; height: 48px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 12px; padding: 0 12px; font-family: 'Alexandria', sans-serif; font-size: 15px`)} />
<button className="press" onClick={v.usePickOther} disabled={v.pickOtherEmpty} style={css(`flex: none; height: 48px; padding: 0 18px; border-radius: 12px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 14px; font-weight: 600; opacity: ${v.pickOtherOp}`)}>استخدمها</button>
</div>
{(v.pickNone) && (<>
<p aria-live="polite" style={css(`margin: 0 4px; font-size: 13px; color: ${v.t.mute}`)}>مش لاقيها في القايمة. دوس "استخدمها" وهنسعّر بالاسم ده.</p>
</>)}
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
{(v.pickOpts || []).map((po, i19) => (<React.Fragment key={i19}>
<button className="press" onClick={po.pick} aria-pressed={po.sel} style={css(`min-height: 52px; padding: 6px 12px; border-radius: 12px; border: 1px solid ${po.bd}; background: ${po.bg}; color: ${po.fg}; font-size: 15px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{po.label}</button>
</React.Fragment>))}
</div>
</>)}
{(v.isItem) && (<>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 14px")}>
<div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
<div style={css("display: flex; flex-direction: column; gap: 2px")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.it.priceLabel}</span>
<span className="num" style={css("font-size: 34px; font-weight: 300; direction: ltr; text-align: right")}>{v.it.price}</span>
</div>
<span className="num" style={css(`flex: none; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: ${v.it.chipBg}; color: #000000; font-size: 14px; font-weight: 600; direction: ltr`)}>
<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true" style={css(`transform: rotate(${v.it.rot}deg)`)}><path d="M4.5 1L8 7H1z" fill="currentColor"></path></svg>{v.it.delta}
          </span>
</div>
<p style={css("margin: 0; font-size: 14px; line-height: 1.7")}>{v.it.story}</p>
<dl style={css("margin: 0; display: flex; flex-direction: column")}>
{(v.it.rows || []).map((ir, i20) => (<React.Fragment key={i20}>
<div style={css(`display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-top: 1px solid ${v.t.line}`)}>
<dt style={css(`font-size: 13px; color: ${v.t.mute}`)}>{ir.k}</dt>
<dd className="num" style={css("margin: 0; font-size: 13px; text-align: left")}>{ir.v}</dd>
</div>
</React.Fragment>))}
</dl>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
{(v.it.hasLink) && (<>
<a href={v.it.url} target="_blank" rel="noopener" className="press" style={css(`height: 50px; border-radius: 999px; background: ${v.t.ink}; color: ${v.t.bg}; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; text-decoration: none`)}>افتح الإعلان</a>
</>)}
<button className="press" onClick={v.it.price2} style={css(`height: 50px; border-radius: 999px; border: 1px solid ${v.t.ink}; background: ${v.it.priceBtnBg}; color: ${v.it.priceBtnFg}; font-size: 14px; font-weight: 600`)}>{v.it.priceBtnLabel}</button>
<button className="press" onClick={v.it.compare} style={css(`height: 50px; border-radius: 999px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; font-size: 14px`)}>ضيفها للمقارنة</button>
</div>
</div>
</>)}
{(v.isList) && (<>
<ul style={css("list-style: none; margin: 0; padding: 0")}>
{(v.sheetRows || []).map((sr, i21) => (<React.Fragment key={i21}>
<li style={css(`border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={sr.go} style={css(`width: 100%; min-height: 62px; padding: 10px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right`)}>
<span style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css("font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{sr.name}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{sr.sub}</span>
</span>
<span style={css("flex: none; display: flex; flex-direction: column; align-items: flex-start; gap: 3px")}>
<span className="num" style={css("font-size: 14px; direction: ltr")}>{sr.val}</span>
<span className="num" style={css(`font-size: 12px; color: ${sr.tagFg}; direction: ltr`)}>{sr.tag}</span>
</span>
</button>
</li>
</React.Fragment>))}
</ul>
</>)}
<button className="press" onClick={v.closeSheet} style={css(`height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>اقفل</button>
</section>
</div>
</>)}
{(v.receipt) && (<>
<div style={css("position: absolute; inset: 0; z-index: 12")}>
<button className="fade" onClick={v.closeReceipt} aria-label="اقفل الإيصال" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-label="إيصال التسعير" onKeyDown={v.receiptKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; max-height: 92%; overflow-y: auto; overscroll-behavior: contain; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 20px 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 40px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
<div style={css(`border: 1px solid ${v.t.line2}; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 12px`)}>
<div style={css("display: flex; justify-content: space-between; align-items: center")}>
<span translate="no" style={css("font-family: 'Aref Ruqaa', serif; font-size: 30px; font-weight: 700; line-height: 1.2")}>سعرلي</span>
<span className="num" style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.receiptDate}</span>
</div>
<div style={css("display: flex; flex-direction: column; gap: 2px")}>
<span style={css("font-size: 16px; font-weight: 600")}>{v.carName}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.kmTxt} كم، صيانات توكيل لحد {v.agencyTxt}</span>
</div>
<div style={css(`display: flex; flex-direction: column; gap: 2px; padding: 12px 0; border-top: 1px dashed ${v.t.line2}; border-bottom: 1px dashed ${v.t.line2}`)}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>السعر العادل</span>
<span className="num" style={css("font-size: 24px; font-weight: 300; direction: ltr; text-align: right")}>{v.finalLoTxt} – {v.finalHiTxt}</span>
</div>
<dl style={css("margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 13px")}>
<div style={css("display: flex; justify-content: space-between; gap: 12px")}><dt style={css(`color: ${v.t.mute}`)}>الدهان</dt><dd style={css("margin: 0; text-align: left")}>{v.paintSummary}</dd></div>
<div style={css("display: flex; justify-content: space-between; gap: 12px")}><dt style={css(`color: ${v.t.mute}`)}>الميكانيكا</dt><dd style={css("margin: 0; text-align: left")}>{v.mechSummary}</dd></div>
<div style={css("display: flex; justify-content: space-between; gap: 12px")}><dt style={css(`color: ${v.t.mute}`)}>اتقارنت بـ</dt><dd style={css("margin: 0")}>{v.nComps} عربية، آخر 60 يوم</dd></div>
<div style={css("display: flex; justify-content: space-between; gap: 12px")}><dt style={css(`color: ${v.t.mute}`)}>أقصى سعر شرا</dt><dd className="num" style={css("margin: 0; direction: ltr")}>{v.maxBuyTxt}</dd></div>
</dl>
{(v.hasFrom) && (<>
<div style={css(`display: flex; justify-content: space-between; gap: 12px; padding-top: 10px; border-top: 1px dashed ${v.t.line2}; font-size: 13px`)}>
<span style={css("font-weight: 500")}>{v.fromName}</span>
<span className="num" dir="ltr" style={css(`color: ${v.t.mute}`)}>{v.fromPhone}</span>
</div>
</>)}
<label style={css("display: flex; align-items: center; gap: 10px; font-size: 13px; min-height: 40px; cursor: pointer")}>
<input type="checkbox" checked={v.hideBuy} onChange={v.toggleHideBuy} style={css("width: 18px; height: 18px; margin: 0; accent-color: #F2A93B")} />
        خبّي سعر الشرا لو هتبعته للزبون
      </label>
</div>
<div style={css(`display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 6px 0 14px; border-radius: 999px; background: ${v.t.soft}`)}>
<span className="num" style={css("flex: 1; min-width: 0; font-size: 14px; direction: ltr; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{v.siteHost}</span>
<button className="press" onClick={v.copyLink} style={css(`height: 36px; padding: 0 14px; border-radius: 999px; border: 1px solid ${v.t.line2}; background: ${v.t.bg}; color: ${v.t.ink}; font-size: 13px`)}>{v.copyLabel}</button>
</div>
<a href={v.waHref} target="_blank" rel="noopener" className="press" style={css("height: 52px; border-radius: 999px; background: #F2A93B; color: #000000; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 600; text-decoration: none")}>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 16l1.2-3.6A7 7 0 1 1 5.6 15z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"></path></svg>
      ابعته واتساب
    </a>
<button className="press" onClick={v.closeReceipt} style={css(`height: 40px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>اقفل</button>
</section>
</div>
</>)}
{(v.login) && (<>
<div style={css("position: absolute; inset: 0; z-index: 12")}>
<button className="fade" onClick={v.closeLogin} aria-label="اقفل" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-labelledby="lg-t" onKeyDown={v.loginKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; max-height: 94%; overflow-y: auto; overscroll-behavior: contain; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 22px 26px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 36px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
<span className="fu" style={css("font-family: 'Aref Ruqaa', serif; font-size: 46px; font-weight: 700; line-height: 1.1; margin-top: 6px")} translate="no">سعرلي</span>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 6px; animation-delay: .05s")}>
<h2 id="lg-t" style={css("margin: 0; font-size: 21px; font-weight: 600")}>{v.loginTitle}</h2>
<p style={css(`margin: 0; font-size: 13px; line-height: 1.7; color: ${v.t.mute}`)}>{v.loginWhy}</p>
</div>
{(v.loginOff) && (<>
<p role="status" style={css(`margin: 0; padding: 12px 14px; border-radius: 12px; background: ${v.t.soft}; font-size: 13px; line-height: 1.7`)}>الدخول لسه بيتجهّز. تقدر تكمّل تسعير عادي، وهنفتحه قريب.</p>
</>)}
{(v.loginAsk) && (<>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 10px; animation-delay: .1s")}>
{(v.googleOn) && (<>
<button className="press" onClick={v.goGoogle} style={css(`height: 54px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px`)}>
<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"></path><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.2z"></path><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"></path></svg>
            كمّل بجوجل
          </button>
<div aria-hidden="true" style={css(`display: flex; align-items: center; gap: 12px; color: ${v.t.mute}; font-size: 12px; margin: 4px 0`)}>
<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>أو بالإيميل<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>
</div>
</>)}
<label htmlFor="lg-mail" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>الإيميل</label>
<input id="lg-mail" type="email" name="email" autoComplete="email" inputMode="email" dir="ltr" value={v.loginEmail} onChange={v.onLoginEmail} placeholder="name@gmail.com" style={css(`height: 52px; border-radius: 14px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: #F2A93B; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; text-align: left`)} />
<button className="press" onClick={v.sendLink} disabled={v.emailDisabled} style={css(`height: 52px; border-radius: 999px; background: ${v.mailBg}; border: 1px solid ${v.t.ink}; color: ${v.mailFg}; font-size: 15px; font-weight: 600; opacity: ${v.emailOp}`)}>{v.emailBtn}</button>
{(v.hasLoginErr) && (<>
<p role="alert" style={css(`margin: 0; font-size: 13px; line-height: 1.6; color: ${v.t.warn}`)}>{v.loginErr}</p>
</>)}
</div>
</>)}
{(v.loginSent) && (<>
<div className="fu" role="status" style={css(`display: flex; flex-direction: column; gap: 12px; padding: 18px; border-radius: 16px; border: 1px solid ${v.t.line2}`)}>
<svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true"><rect x="1" y="1" width="32" height="24" rx="3" stroke={v.t.ink} strokeWidth="1.4" fill="none"></rect><path d="M2 3l15 11L32 3" stroke="#F2A93B" strokeWidth="1.6" fill="none"></path></svg>
<span style={css("font-size: 16px; font-weight: 600")}>بصّ على الإيميل</span>
<span style={css(`font-size: 13px; line-height: 1.8; color: ${v.t.mute}`)}>بعتنالك لينك دخول على <span dir="ltr" style={css(`color: ${v.t.ink}`)}>{v.loginEmail}</span>. افتحه من الموبايل ده وهتدخل على طول. لو مش لاقيه، بصّ في الـ Spam.</span>
<button className="press" onClick={v.editEmail} style={css(`align-self: flex-start; min-height: 40px; padding: 0; background: none; border: none; color: ${v.t.ink}; font-size: 13px; text-decoration: underline`)}>غيّر الإيميل</button>
</div>
</>)}
<button className="press" onClick={v.closeLogin} style={css(`min-height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>مش دلوقتي، كمّل من غير حساب</button>
<p style={css(`margin: 0; font-size: 11px; line-height: 1.7; color: ${v.t.mute}; text-align: center`)}>بنستخدم الإيميل للدخول بس. مش هنبعتلك إعلانات.</p>
</section>
</div>
</>)}
{(v.profileOpen) && (<>
<div style={css("position: absolute; inset: 0; z-index: 12")}>
<button className="fade" onClick={v.closeProfile} aria-label="اقفل" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-labelledby="pf-t" onKeyDown={v.profileKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; max-height: 94%; overflow-y: auto; overscroll-behavior: contain; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 22px 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 36px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
<h2 id="pf-t" style={css("margin: 4px 0 0; font-size: 20px; font-weight: 600")}>حسابك</h2>
<div className="fu" style={css("display: flex; align-items: center; gap: 16px")}>
<label style={css(`position: relative; flex: none; width: 84px; height: 84px; border-radius: 50%; overflow: hidden; background: ${v.t.soft}; border: 1px solid ${v.t.line2}; cursor: pointer; display: flex; align-items: center; justify-content: center`)}>
{(v.pfHasPhoto) && (<>
<img src={v.pfPhoto} alt="صورتك" width="84" height="84" style={css("width: 100%; height: 100%; object-fit: cover")} />
</>)}
{(v.pfNoPhoto) && (<>
<span aria-hidden="true" style={css("font-size: 32px; font-weight: 500")}>{v.initial}</span>
</>)}
<input type="file" accept="image/*" onChange={v.pickPhoto} aria-label="غيّر الصورة" style={css("position: absolute; inset: 0; opacity: 0; cursor: pointer")} />
</label>
<div style={css("display: flex; flex-direction: column; gap: 4px; min-width: 0")}>
<span style={css("font-size: 16px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{v.pfTitle}</span>
<span dir="ltr" style={css(`font-size: 12px; color: ${v.t.mute}; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{v.userEmail}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.photoNote}</span>
</div>
</div>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 12px; animation-delay: .05s")}>
<label style={css(`display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: ${v.t.mute}`)}>الاسم
        <input name="name" autoComplete="name" value={v.pfName} onChange={v.onPfName} placeholder="اسمك" maxLength="60" style={css(`height: 50px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; padding: 0 14px; font-family: 'Alexandria', sans-serif; font-size: 16px`)} />
</label>
<label style={css(`display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: ${v.t.mute}`)}>اسم المعرض
        <input name="showroom" autoComplete="organization" value={v.pfShowroom} onChange={v.onPfShowroom} placeholder="بيظهر على الإيصال، مثلاً: معرض طارق" maxLength="60" style={css(`height: 50px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; padding: 0 14px; font-family: 'Alexandria', sans-serif; font-size: 16px`)} />
</label>
<label style={css(`display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: ${v.t.mute}`)}>موبايل / واتساب
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={v.pfPhone} onChange={v.onPfPhone} placeholder="01012345678" style={css(`height: 50px; border-radius: 12px; border: 1px solid ${v.pfPhoneBd}; background: ${v.t.soft}; color: ${v.t.ink}; padding: 0 14px; font-family: 'Alexandria', sans-serif; font-size: 16px; text-align: left`)} />
</label>
<label style={css(`display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: ${v.t.mute}`)}>المدينة
        <select name="city" value={v.pfCity} onChange={v.onPfCity} style={css(`height: 50px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; padding: 0 12px; font-family: 'Alexandria', sans-serif; font-size: 16px`)}>
<option value="">اختار مدينتك</option>
{(v.cities || []).map((ct, i22) => (<React.Fragment key={i22}>
<option value={ct}>{ct}</option>
</React.Fragment>))}
</select>
<span style={css(`font-size: 11px; color: ${v.t.mute}`)}>لقطات مدينتك هتظهرلك الأول في السوق.</span>
</label>
{(v.hasPfErr) && (<>
<p role="alert" style={css(`margin: 0; font-size: 13px; color: ${v.t.warn}`)}>{v.pfErr}</p>
</>)}
<button className="press" onClick={v.savePf} disabled={v.pfSaveOff} style={css(`height: 52px; border-radius: 999px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; opacity: ${v.pfSaveOp}`)}>{v.pfSaveLabel}</button>
</div>
<div style={css(`display: flex; align-items: center; justify-content: space-between; min-height: 48px; border-top: 1px solid ${v.t.line}; font-size: 14px`)}>
<span style={css(`color: ${v.t.mute}`)}>تسعيرات محفوظة</span>
<span className="num">{v.savedCount}</span>
</div>
<button className="press" onClick={v.signOutNow} style={css(`min-height: 44px; background: none; border: none; color: ${v.t.warn}; font-size: 14px; text-align: right; padding: 0`)}>اخرج من الحساب</button>
</section>
</div>
</>)}
{(v.hasFlash) && (<>
<div className="fu" role="status" aria-live="polite" style={css(`position: absolute; left: 50%; top: 72px; transform: translateX(-50%); z-index: 14; padding: 12px 18px; border-radius: 999px; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 14px; line-height: 1.6; text-align: center; width: max-content; max-width: calc(100% - 40px); box-sizing: border-box; box-shadow: 0 8px 24px rgba(0,0,0,0.25)`)}>{v.flash}</div>
</>)}
{(v.menu) && (<>
<div style={css("position: absolute; inset: 0; z-index: 10")}>
<button className="fade" onClick={v.closeMenu} aria-label="اقفل القائمة" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.55); padding: 0")}></button>
<nav className="sheet" role="dialog" aria-modal="true" aria-label="القائمة" onKeyDown={v.menuKey} style={css(`position: absolute; top: 0; bottom: 0; right: 0; width: 300px; background: ${v.t.bg}; border-left: 1px solid ${v.t.line}; display: flex; flex-direction: column; padding: 18px 22px 26px; box-sizing: border-box`)}>
<div style={css("display: flex; align-items: center; justify-content: space-between")}>
<span style={css("font-family: 'Aref Ruqaa', serif; font-size: 34px; font-weight: 700")} translate="no">سعرلي</span>
<button className="press" onClick={v.closeMenu} aria-label="اقفل" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4"></path></svg>
</button>
</div>
<div style={css("margin-top: 18px; display: flex; flex-direction: column")}>
{(v.menuItems || []).map((m, i23) => (<React.Fragment key={i23}>
<button className="press fu" onClick={m.go} disabled={m.soon} style={css(`min-height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; text-align: right; padding: 0; animation-delay: ${m.delay}s; opacity: ${m.op}`)}>
<span style={css("display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 16px; font-weight: 500")}>{m.label}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{m.sub}</span>
</span>
{(m.soon) && (<><span style={css(`font-size: 11px; color: ${v.t.mute}; border: 1px solid ${v.t.line2}; border-radius: 999px; padding: 3px 10px`)}>قريب</span></>)}
</button>
</React.Fragment>))}
</div>
<div style={css("margin-top: auto; display: flex; align-items: center; justify-content: space-between; min-height: 52px")}>
<span style={css("font-size: 14px")}>الوضع الليلي</span>
<button className="press" onClick={v.toggleTheme} role="switch" aria-checked={v.darkStr} aria-label="الوضع الليلي" style={css(`width: 52px; height: 30px; border-radius: 999px; border: 1px solid ${v.t.ink}; background: ${v.swBg}; position: relative; padding: 0`)}>
<span style={css(`position: absolute; top: 3px; right: 3px; width: 22px; height: 22px; border-radius: 50%; background: ${v.swKnob}; transform: translateX(${v.knobX}px); transition: transform .25s ease`)}></span>
</button>
</div>
</nav>
</div>
</>)}
</div>
{(v.desk) && (<>
<aside className="enter-f" key={v.deskKey} style={css("flex: 1; min-width: 0; height: 100%; overflow-y: auto; scrollbar-width: thin; padding: 8px 4px 40px 8px; box-sizing: border-box; display: flex; flex-direction: column; gap: 36px")}>
{(v.deskHome) && (<>
<section style={css("display: flex; flex-direction: column; gap: 14px; padding-top: 18px")}>
<h2 style={css("margin: 0; font-size: 44px; line-height: 1.25; font-weight: 600; max-width: 640px")}>اعرف تمن أي عربية مستعملة في مصر، قبل ما تدفع.</h2>
<p style={css(`margin: 0; font-size: 16px; line-height: 1.8; color: ${v.t.mute}; max-width: 560px`)}>بنقارن عربيتك بإعلانات حقيقية شبهها من هتلاقي والسوق المفتوح وSylndr، ونخصم الرش والمتغير والميكانيكا، ونطلعلك رينج عادل وأقصى سعر تشتري بيه.</p>
<div style={css("display: flex; gap: 40px; margin-top: 10px")}>
{(v.deskStats || []).map((ds, i24) => (<React.Fragment key={i24}>
<div style={css("display: flex; flex-direction: column; gap: 2px")}>
<span className="num" style={css("font-size: 34px; font-weight: 300")}>{ds.n}</span>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>{ds.label}</span>
</div>
</React.Fragment>))}
</div>
</section>
<section aria-labelledby="dk-mkt" style={css("display: flex; flex-direction: column; gap: 12px")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 id="dk-mkt" style={css("margin: 0; font-size: 20px; font-weight: 600")}>السوق النهارده</h2>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>تغييرات الزيرو ولقطات نزلت أرخص من السوق</span>
</div>
<div style={css("display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px")}>
{(v.deskMarket || []).map((dm, i25) => (<React.Fragment key={i25}>
<button className="press" onClick={dm.go} style={css(`min-height: 112px; padding: 16px; border-radius: 16px; border: 1px solid ${v.t.line}; background: ${v.t.soft}; color: ${v.t.ink}; text-align: right; display: flex; flex-direction: column; justify-content: space-between; gap: 12px`)}>
<span style={css("display: flex; flex-direction: column; gap: 4px")}>
<span style={css("font-size: 15px; font-weight: 500; line-height: 1.5")}>{dm.name}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{dm.kind}، {dm.when}</span>
</span>
<span style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 8px")}>
<span className="num" style={css("font-size: 20px; font-weight: 300; direction: ltr")}>{dm.price}</span>
<span className="num" style={css(`font-size: 13px; color: ${dm.dc}; direction: ltr`)}>{dm.delta}</span>
</span>
</button>
</React.Fragment>))}
</div>
</section>
<section aria-labelledby="dk-zero" style={css("display: flex; flex-direction: column; gap: 8px")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 id="dk-zero" style={css("margin: 0; font-size: 20px; font-weight: 600")}>أسعار الزيرو</h2>
<button className="press" onClick={v.openZero} style={css(`background: none; border: none; color: ${v.t.mute}; font-size: 13px; padding: 0; min-height: 36px`)}>كل الأسعار</button>
</div>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px")}>
{(v.deskZero || []).map((dz, i26) => (<React.Fragment key={i26}>
<button className="press" onClick={dz.go} style={css(`min-height: 52px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span style={css("font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{dz.name}</span>
<span className="num" style={css("flex: none; font-size: 14px; direction: ltr")}>{dz.price}</span>
</button>
</React.Fragment>))}
</div>
</section>
</>)}
{(v.deskFlow) && (<>
<section style={css("display: flex; flex-direction: column; gap: 10px; padding-top: 18px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>بنسعّر دلوقتي</span>
<h2 style={css("margin: 0; font-size: 34px; font-weight: 600; line-height: 1.3")}>{v.carName}</h2>
<span className="num" style={css(`font-size: 14px; color: ${v.t.mute}`)}>{v.kmTxt} كم</span>
<div style={css("display: flex; align-items: baseline; gap: 14px; margin-top: 14px")}>
<span className="num" style={css("font-size: 60px; font-weight: 200; direction: ltr; line-height: 1.1")}>{v.finalLoTxt} – {v.finalHiTxt}</span>
<span style={css(`font-size: 16px; color: ${v.t.mute}`)}>جنيه</span>
</div>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>السعر بيتحدّث وانت بتعلّم على الدهان والميكانيكا.</span>
</section>
<section aria-labelledby="dk-cmp" style={css("display: flex; flex-direction: column")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 6px")}>
<h2 id="dk-cmp" style={css("margin: 0; font-size: 20px; font-weight: 600")}>العربيات اللي اتقارنت ({v.nComps})</h2>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>مقارنة بالرينج لعربية فابريكا</span>
</div>
<div role="table" aria-labelledby="dk-cmp" style={css("display: flex; flex-direction: column")}>
{(v.deskComps || []).map((dc, i27) => (<React.Fragment key={i27}>
<button className="press" role="row" onClick={dc.go} style={css(`min-height: 56px; display: grid; grid-template-columns: minmax(0, 1fr) 140px 110px 90px; align-items: center; gap: 16px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span role="cell" style={css("font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{dc.name}</span>
<span role="cell" style={css(`font-size: 13px; color: ${v.t.mute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{dc.sub}</span>
<span role="cell" className="num" style={css("font-size: 14px; direction: ltr; text-align: right")}>{dc.val}</span>
<span role="cell" style={css(`font-size: 12px; color: ${dc.tagFg}`)}>{dc.tag}</span>
</button>
</React.Fragment>))}
</div>
</section>
</>)}
{(v.deskSaved) && (<>
<section aria-labelledby="dk-mine" style={css("display: flex; flex-direction: column")}>
<h2 id="dk-mine" style={css("margin: 0 0 6px; font-size: 20px; font-weight: 600")}>تسعيراتك</h2>
{(v.recent || []).map((rc, i28) => (<React.Fragment key={i28}>
<button className="press" onClick={rc.go} style={css(`min-height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span style={css("font-size: 14px")}>{rc.name} <span style={css(`color: ${rc.noteFg}; font-size: 12px; margin-right: 8px`)}>{rc.note}</span></span>
<span className="num" style={css("font-size: 14px; direction: ltr")}>{rc.range}</span>
</button>
</React.Fragment>))}
</section>
</>)}
</aside>
</>)}
</div>
</div>
    );
  }
}

export default Component;
