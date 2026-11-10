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
  // ---------- fuzzy search: Arabic or English, typos, wrong keyboard, spacing; predicts from the first letter ----------
  // returns [{ item, score, exact }] best first; key(item) gives the text, pop(item) (optional) breaks ties by popularity
  static fuzzy(q, items, key, pop) {
    var F = Component._fz || (Component._fz = Component.fzInit());
    var vs = F.variants(q);
    if (!vs.length) return [];
    var out = [];
    items.forEach(function (it) {
      var raw = key(it), best = null;
      vs.forEach(function (v) {
        var r = F.score(v.q, raw);
        if (r && (!best || r.score * v.pen > best.score)) best = { score: r.score * v.pen, exact: r.exact && v.pen === 1 };
      });
      if (best && best.score >= 0.6) out.push({ item: it, score: best.score, exact: best.exact, pop: pop ? pop(it) || 0 : 0 });
    });
    return out.sort(function (a, b) { return (b.score - a.score) || (b.pop - a.pop); });
  }
  static fzInit() {
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
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')                  // tashkeel, tatweel
        .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
        .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); })
        .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x6F0); })
        .replace(/([a-z\u0621-\u064A])(\d)/g, '$1 $2').replace(/(\d)([a-z\u0621-\u064A])/g, '$1 $2')
        .replace(/[^a-z0-9\u0621-\u064A]+/g, ' ').replace(/(.)\1{2,}/g, '$1$1').trim();
    }
    // typed with the wrong keyboard language: same keys, Arabic <-> English (PC layout)
    var KB = { q: 'ض', w: 'ص', e: 'ث', r: 'ق', t: 'ف', y: 'غ', u: 'ع', i: 'ه', o: 'خ', p: 'ح', '[': 'ج', ']': 'د', a: 'ش', s: 'س', d: 'ي', f: 'ب', g: 'ل', h: 'ا', j: 'ت', k: 'ن', l: 'م', ';': 'ك', "'": 'ط', z: 'ئ', x: 'ء', c: 'ؤ', v: 'ر', n: 'ى', m: 'ة', ',': 'و', '.': 'ز', '/': 'ظ', '`': 'ذ' };
    var KBR = {};
    Object.keys(KB).forEach(function (k) { KBR[KB[k]] = k; });
    function swapLayout(s) {
      var ar = /[\u0600-\u06FF]/.test(s);
      return String(s).toLowerCase().replace(/لا/g, ar ? 'b' : 'لا').split('').map(function (c) { return ar ? (KBR[c] || c) : (KB[c] || c); }).join('');
    }
    function variants(q) {
      var raw = String(q || '');
      var n = norm(raw);
      if (!n) return [];
      var out = [{ q: raw, pen: 1 }];
      var sw = swapLayout(raw);
      if (norm(sw) && norm(sw) !== n) out.push({ q: sw, pen: n.length >= 3 ? 0.96 : 0.8 });
      var noSym = raw.replace(/[^\w\u0600-\u06FF ]+/g, '');        // "e;antra" -> "eantra"
      if (noSym !== raw && norm(noSym)) out.push({ q: noSym, pen: 0.98 });
      return out;
    }
    // sound skeleton shared by both scripts: consonants only, close sounds merged
    function key(w) {
      var ar = /[\u0621-\u064A]/.test(w);
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
    // letters that are easy to hit by mistake: neighbours on the keyboard, and Arabic letters that sound alike
    var NEAR = {};
    ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].forEach(function (row) {
      for (var i = 0; i < row.length; i++) { NEAR[row[i]] = (NEAR[row[i]] || '') + (row[i - 1] || '') + (row[i + 1] || ''); }
    });
    ['سصث', 'تط', 'ذزظ', 'هحخ', 'كق', 'دض', 'اع', 'يى', 'ou', 'ie', 'ck', 'sz'].forEach(function (g) {
      g.split('').forEach(function (c) { NEAR[c] = (NEAR[c] || '') + g.replace(c, ''); });
    });
    function sub(a, b) { return a === b ? 0 : (NEAR[a] && NEAR[a].indexOf(b) >= 0) ? 0.5 : 1; }
    function lev(a, b, cap) {
      if (Math.abs(a.length - b.length) > cap) return cap + 1;
      var p = [], i, j;
      for (j = 0; j <= b.length; j++) p[j] = j;
      for (i = 1; i <= a.length; i++) {
        var c = [i], lo = i;
        for (j = 1; j <= b.length; j++) {
          c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + sub(a[i - 1], b[j - 1]));
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) c[j] = Math.min(c[j], pp[j - 2] + 0.5);   // swapped letters
          lo = Math.min(lo, c[j]);
        }
        if (lo > cap) return cap + 1;
        var pp = p; p = c;
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
      if (t.indexOf(q) === 0) return q.length === 1 ? 0.9 : 0.97 - 0.02 * Math.min(5, t.length - q.length) / 5;   // typing ahead
      if (q.length >= 3 && t.indexOf(q) > 0) return 0.85;
      if (q.length < 2) return 0;
      var L = Math.max(q.length, t.length), cap = L <= 3 ? 0.5 : L <= 5 ? 1 : L <= 8 ? 2 : 2.5;
      var d = lev(q, t, cap);
      var best = d <= cap ? 0.92 - 0.08 * d : 0;
      // a typo in a word still being typed: compare with the same-length start of the catalog word
      if (q.length >= 3 && t.length > q.length) {
        var dp = lev(q, t.slice(0, q.length), q.length <= 4 ? 1 : 1.5);
        if (dp <= (q.length <= 4 ? 1 : 1.5)) best = Math.max(best, 0.86 - 0.06 * dp);
      }
      var kq = key(q), kt = key(t);
      if (q.length === 2 && kq && kt.indexOf(kq) === 0) best = Math.max(best, 0.7);           // "ty" -> toyota
      if (kq.length >= 2 && kt.length >= 2) {
        if (kq === kt) best = Math.max(best, 0.88);
        else if (kt.indexOf(kq) === 0 && q.length >= 3) best = Math.max(best, 0.8);
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
    function joined(qAll, toks) {
      var b = 0;
      toks.forEach(function (t) { if (t.indexOf(' ') > 0) b = Math.max(b, sim(qAll, t.replace(/ /g, '')), sim1(qAll, norm(AL[t] || '').replace(/ /g, ''))); });
      return b;
    }
    function score(q, raw) {
      var qn = norm(q);
      if (!qn) return null;
      var qt = qn.split(' ').filter(function (w) { return !/^\d+$/.test(w); });
      var qy = (qn.match(/\b(19|20)\d\d\b/) || [])[0];
      var qAll = qt.join('');
      var n = norm(raw), toks = tokens(raw);
      // a short query only counts as exact at the start of a word ("t" isn't "elantra")
      var exact = qn.length >= 3 ? n.indexOf(qn) >= 0 : (' ' + n).indexOf(' ' + qn) >= 0;
      var s = 0;
      if (qt.length) {
        // the last word may still be half typed: it only has to start a catalog word
        var per = qt.map(function (w) {
          var b = 0;
          toks.forEach(function (t) { b = Math.max(b, sim(w, t)); });
          return b;
        });
        var min = Math.min.apply(null, per), avg = per.reduce(function (a, b) { return a + b; }, 0) / per.length;
        s = Math.max(min * 0.6 + avg * 0.4, joined(qAll, toks));
        if (qAll.length >= 4) toks.forEach(function (t) { s = Math.max(s, sim(qAll, t) * 0.95); });
      } else {
        // only numbers typed: a year (or the start of one)
        var num = qn.replace(/ /g, '');
        s = (String(raw).match(/\b(19|20)\d\d\b/g) || []).some(function (y) { return y.indexOf(num) === 0; }) ? 0.8 : 0;
      }
      var yr = (String(raw).match(/\b(19|20)\d\d\b/) || [])[0];
      if (qy && yr) s *= qy === yr ? 1 : 0.85;
      if (exact) s = Math.max(s, 1);
      return { score: s, exact: exact };
    }
    return { norm: norm, key: key, sim: sim, tokens: tokens, joined: joined, score: score, variants: variants };
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
      paint: {}, ex: {}, spin: true, angle: -35, dragging: false, last: '',
      mech: {}, open: null, k: 1, carSet: false, kmSet: false, hist: [], picked: {},
      gl: true, oth: {}, exOther: false, mo: {}, body: 'crossover', bodyAuto: true, heroOn: true, partsOpen: false, mf: 'all', paintReady: false, more: false, wm: 0, margin: 30000, receipt: false, hideBuy: false, copied: false, checked: {}, car: { make: 'كوبرا', model: 'فورمينتور', year: 2022, trim: 'VZ' }, picker: null, pickOther: '', sheet: null, login: null, wa: null, loginSent: false, loginEmail: '', loginErr: '', loginBusy: false, saving: false, flash: '', profile: false, pf: null, pfBusy: false, pfErr: '', photoBusy: false, item: null, shotPick: null, extras: [], ai: null, ad: null, deskPage: null, zq: '', zp: null, zpq: '', vis: { busy: false, note: '' }, folds: {}, role: null,
      mine: null, my: { price: '', status: 'available', notes: '' }, myBusy: false, myF: 'all', myOpen: null, myDel: false
    };
    // what this person did last time (car, km, paint, mechanics, margin, compare list, history) comes back
    try {
      var kept = JSON.parse(window.localStorage.getItem(Component.KEEP_KEY) || 'null');
      if (kept && kept.v === 1) ['hist', 'tray', 'margin', 'hideBuy', 'role'].forEach(function (k) { if (kept[k] !== undefined) this.state[k] = kept[k]; }, this);
    } catch (e) { /* first visit, private mode or the design canvas */ }
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
        // build the 3D car after the screen has slid in, so the tap itself stays instant
        clearTimeout(self[slot + 'B']);
        self[slot + 'B'] = setTimeout(function () {
        if (self[slot + 'El'] !== el || self[slot]) return;
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
        }, reduce ? 0 : 300);
      };
    };
    this._paintRef = mk('_paint', false);
    this._heroRef = mk('_hero', true);
  }
  // a model's trims, lowest first: that model year's official classes when we have them, else all of them
  static trimsOf(inf, year) {
    if (!inf) return [];
    var y = inf.trimsByYear && inf.trimsByYear[String(year)];
    return y && y.length ? y : inf.trims;
  }
  // the user picks make, then model, then year, then trim: each pick opens the next list
  pickField(k, v) {
    var CAT = Component.remoteCat || Component.CAT, c = Object.assign({}, this.state.car), patch = {};
    var picked = Object.assign({}, this.state.picked || {});
    c[k] = v;
    picked[k] = true;
    if (k === 'make') { var models = Object.keys(CAT[v] || {}); c.model = models[0] || c.model; picked.model = picked.year = picked.trim = false; }
    if (k === 'model') { picked.year = picked.trim = false; }
    if (k === 'year') { picked.trim = false; }
    if (k === 'make' || k === 'model') {
      var inf = (CAT[c.make] || {})[c.model];
      if (inf) { if (inf.years.indexOf(c.year) < 0) c.year = inf.years[inf.years.length - 2] || inf.years[0]; c.trim = Component.trimsOf(inf, c.year)[0]; patch.body = inf.body; patch.bodyAuto = true; }
    }
    var inf2 = (CAT[c.make] || {})[c.model];
    if (k === 'year' && inf2) {
      var yt = Component.trimsOf(inf2, c.year);
      if (yt.indexOf(c.trim) < 0) c.trim = yt[0];
      if (yt.length <= 1) picked.trim = true;      // one trim: nothing to choose
    }
    var next = !picked.model ? 'model' : !picked.year ? 'year' : !picked.trim ? 'trim' : null;
    patch.car = c; patch.picked = picked; patch.pickOther = ""; patch.checked = this.state.checked;
    patch.carSet = !!(picked.make && picked.model && picked.year && picked.trim);
    patch.picker = next; patch.sheet = next ? 'picker' : null; patch.pickDir = 'f';
    this.setState(patch);
  }
  // عربياتي: add (item null) or edit one of the user's own cars with the same car / paint / mechanics screens.
  // What the user was pricing is put aside and comes back when he leaves.
  startMine(item) {
    var S = this.state, stash = {};
    Component.KEEP.concat(['extras', 'vis', 'ai']).forEach(function (k) { stash[k] = S[k]; });
    if (S.mine) stash = S.mine.stash;
    var raw = (item && item.details && item.details.raw) || {};
    var patch = { mine: { id: item ? item.id : null, stash: stash }, myOpen: null, myDel: false, myBusy: false,
      paint: raw.paint || {}, ex: raw.ex || {}, exOther: !!raw.exOther, mech: raw.mech || {}, mo: raw.mo || {}, oth: raw.oth || {},
      extras: (item && item.photos) || [], ai: raw.ai ? Object.assign({}, raw.ai, { defs: (raw.ai.defs || []).map(function (d) { return Object.assign({}, d); }) }) : null, vis: { busy: false, note: '' }, sheet: null, menu: false,
      my: { price: item && item.price ? Math.round(item.price).toLocaleString('en-US') : '', status: (item && item.status) || 'available', notes: (item && item.notes) || '' } };
    if (item) {
      patch.car = Object.assign({}, item.car); patch.carSet = true; patch.picked = { make: true, model: true, year: true, trim: true };
      patch.km = item.km; patch.kmSet = true; patch.agencyKm = raw.agencyKm !== undefined ? raw.agencyKm : Math.min(60000, Math.floor(item.km / 10000) * 10000);
      if (raw.body) { patch.body = raw.body; patch.bodyAuto = false; }
    } else {
      patch.carSet = false; patch.picked = {}; patch.kmSet = false; patch.agencyKm = 0;
    }
    this.setState(patch);
    this.setState({ screen: 'car', dir: 'f', deskPage: null });
  }
  // open one car of عربياتي: the list has the small cover only, the photos come with the car
  openMy(row) {
    var self = this, A = Component.auth;
    this.setState({ myOpen: Object.assign({ loading: true }, row), myDel: false, ad: null });
    if (A && A.carGet) A.carGet(row.id).then(function (it) {
      if (self.state.myOpen && self.state.myOpen.id === row.id) self.setState({ myOpen: it });
    }, function () { if (self.state.myOpen && self.state.myOpen.id === row.id) self.setState({ myOpen: Object.assign({}, row, { loading: false, photos: [] }) }); });
  }
  setCar(c, km, screen) {
    var inf = ((Component.remoteCat || Component.CAT)[c.make] || {})[c.model];
    var patch = { car: Object.assign({}, c), carSet: true, picked: { make: true, model: true, year: true, trim: true }, paint: {}, ex: {}, mech: {}, mo: {}, menu: false, extras: [], ai: null, vis: { busy: false, note: '' } };
    if (inf) { patch.body = inf.body; patch.bodyAuto = true; }
    if (km) patch.kmSet = true;
    if (km !== undefined) patch.km = km;
    this.setState(patch);
    this.go(screen || 'car', 'f');
  }
  // after Google / email-link sign-in: finish what the user asked for before the redirect
  onRecovery() {
    this.setState({ login: 'newpass', loginSent: false, loginErr: '', loginBusy: false, lg: {}, menu: false, sheet: null });
  }
  onSignedIn() {
    var A = Component.auth, self = this;
    if (!A) return;
    var p = A.takePending ? A.takePending() : null, wasOpen = !!this.state.login;
    if (this.state.login === 'newpass') return;      // back from the reset link: the new-password form stays open
    this.setState({ login: null, lg: {} });
    if (p && p.kind === 'save' && p.q) A.save(p.q).then(function () { self.flashMsg('دخلت، والتسعيرة اتحفظت'); }, function () { self.flashMsg('دخلت، بس التسعيرة ماتحفظتش'); });
    else if (p && p.kind === 'garage') { this.go('garage', 'f'); this.flashMsg('دخلت، دي عربياتك'); }
    else if (p && p.kind === 'alerts') { this.setState({ sheet: 'alerts' }); this.flashMsg('دخلت، التنبيهات شغّالة'); }
    else if (p || wasOpen) this.flashMsg('أهلاً، دخلت');
    if ((this.state.extras || []).length && !this.state.ai && this.state.screen === 'car') this.queueInspect();
  }
  // photos were added: look at the whole set once the user stops adding
  queueInspect() {
    var self = this;
    clearTimeout(this._insT);
    this._insT = setTimeout(function () { self.inspectPics(); }, 900);
  }
  // one look at all the photos: which car, the km on the odometer, and a condition report with the visible defects
  inspectPics() {
    var self = this, look = Component.inspectPhotos, urls = this.state.extras || [];
    if (!urls.length) return;
    if (!look) return this.setState({ vis: { busy: false, note: 'فحص الصور مش متفعل على السيرفر لسه. الصور معاك، واختار العربية بإيدك تحت.' } });
    var A = Component.auth;
    if (A && !A.user) {
      if (A.pending) A.pending({ kind: 'photos' });
      return this.setState({ login: 'photos', loginSent: false, loginErr: '', vis: { busy: false, note: 'ادخل حسابك وإحنا نفحص الصور: نعرف العربية، نقرا العداد، ونطلّع تقرير بحالتها.' } });
    }
    var fail = function (e) {
      if (run !== self._insN) return;
      self.setState({ vis: { busy: false, note: e && e.status === 429 ? 'فحصت صور كتير الساعة دي. كمّل بإيدك وجرّب كمان شوية.'
        : e && (e.status === 503 || e.status === 501) ? 'فحص الصور مش شغال دلوقتي. اختار العربية بإيدك تحت.'
        : e && e.status === 401 ? 'دخولك خلص. اخرج وادخل تاني وجرّب.'
        : 'ماقدرناش نفحص الصور. جرّب تاني أو كمّل بإيدك.' + (e && e.detail ? ' (' + String(e.detail).slice(0, 90) + ')' : '') } });
    };
    var CAT = Component.remoteCat || Component.CAT;
    var fmtN = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
    var run = this._insN = (this._insN || 0) + 1;
    this.setState({ vis: { busy: true, note: '', n: urls.length } });
    look(urls, Object.keys(CAT)).then(function (r) {
      if (run !== self._insN) return;
      var S = self.state, patch = {}, notes = [];
      if (!r.make && r.score == null) return self.setState({ vis: { busy: false, note: 'مش باين في الصور عربية. جرّب صور أوضح للعربية كلها.' } });
      // the car: fill the fields like a manual pick would, unless the user already chose
      var mine = S.carSet || ((S.picked || {}).make && !S.vis.byAi);
      if (r.make && r.confidence >= 0.45 && !mine) {
        var seen = r.make + ' ' + (r.model || '') + (r.years ? ' ' + r.years[0] + '–' + r.years[1] : '');
        var mk = (Component.fuzzy(r.make, Object.keys(CAT), String)[0] || {});
        var md = mk.item && mk.score >= 0.8 && r.model ? (Component.fuzzy(r.model, Object.keys(CAT[mk.item]), String)[0] || {}) : {};
        if (!mk.item || mk.score < 0.8) notes.push('شكلها ' + seen + '، ومش لاقيينها عندنا. اختارها بإيدك تحت.');
        else if (!md.item || md.score < 0.75) notes.push('شكلها ' + seen + '. اختار الموديل بالظبط تحت.');
        else {
          var inf = CAT[mk.item][md.item], c = Object.assign({}, S.car, { make: mk.item, model: md.item });
          var y = S.car.year;
          if (r.years && (y < r.years[0] || y > r.years[1])) y = Math.min(r.years[1], inf.years[inf.years.length - 1]);
          if (inf.years.indexOf(y) < 0) y = inf.years[inf.years.length - 2] || inf.years[0];
          c.year = y;
          var tr = r.trim ? (Component.fuzzy(r.trim, inf.trims, String)[0] || {}) : {};
          c.trim = tr.item && tr.score >= 0.8 ? tr.item : (inf.trims.indexOf(c.trim) >= 0 ? c.trim : inf.trims[0]);
          var pk = Object.assign({}, S.picked || {}, { make: true, model: true });
          if (r.years) pk.year = true;
          if (tr.item && tr.score >= 0.8) pk.trim = true;
          patch.car = c; patch.picked = pk; patch.body = inf.body; patch.bodyAuto = true;
          notes.push('العربية: ' + mk.item + ' ' + md.item + (r.years ? ' (' + r.years[0] + '–' + r.years[1] + ')' : '') + (tr.item && tr.score >= 0.8 ? '، فئة ' + tr.item : '') + '. اتأكد من السنة والفئة تحت.');
        }
      }
      if (r.km != null && (!S.kmSet || S.vis.kmByAi)) { patch.km = r.km; patch.kmSet = true; notes.push('العداد: ' + fmtN(r.km) + ' كم.'); }
      // the report: defects the user already answered keep their answer
      var old = {};
      ((S.ai && S.ai.defs) || []).forEach(function (d) { if (d.ok != null) old[d.what] = d.ok; });
      if (r.score != null) patch.ai = { score: r.score, areas: r.areas || {}, summary: r.summary || '', missing: r.missing || [], n: r.photos || urls.length,
        defs: (r.defects || []).map(function (d) { return { area: d.area, what: d.what, sev: d.severity, pic: d.photo ? (r.sent || [])[d.photo - 1] || '' : '', ok: old[d.what] != null ? old[d.what] : null }; }) };
      patch.vis = { busy: false, byAi: !!patch.car || !!S.vis.byAi, kmByAi: patch.km != null || !!S.vis.kmByAi, note: notes.join(' ') };
      self.setState(patch);
    }, fail);
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
  componentDidMount() {
    if (this.state.screen === 'result' || this.state.screen === 'home') this.count();
    // the phone's back button steps back inside the app (closes what's open, then the previous screen);
    // on the home screen with nothing open it asks for a second press before leaving
    var self = this;
    try {
      if (!(history.state && history.state.sa3)) history.pushState({ sa3: 1 }, '');
      this._onPop = function () {
        if (self.backStep()) { history.pushState({ sa3: 1 }, ''); return; }
        if (Date.now() - (self._backAt || 0) > 2500) {
          self._backAt = Date.now();
          history.pushState({ sa3: 1 }, '');
          self.flashMsg('دوس رجوع تاني عشان تخرج');
        } else history.back();
      };
      window.addEventListener('popstate', this._onPop);
    } catch (e) { /* design canvas */ }
  }
  componentWillUnmount() { if (this._onPop) window.removeEventListener('popstate', this._onPop); }
  backStep() {
    var S = this.state;
    if (S.shotPick) { this.setState({ shotPick: null }); return true; }
    if (S.myOpen) { this.setState({ myOpen: null, myDel: false }); return true; }
    if (S.sheet) { this.setState({ sheet: null, picker: null, item: null }); return true; }
    if (S.login) { if (this._waCtl) this._waCtl.stop = true; this.setState({ login: null, wa: null }); return true; }
    if (S.profile) { this.setState({ profile: false, pf: null }); return true; }
    if (S.receipt) { this.setState({ receipt: false }); return true; }
    if (S.menu) { this.setState({ menu: false }); return true; }
    if (S.zp) { var z = S.zp; this.setState({ zpq: '', zp: z.trim ? { make: z.make, model: z.model } : z.model ? { make: z.make } : z.make ? {} : null }); return true; }
    if (S.deskPage) { this.setState({ deskPage: null }); return true; }
    if (S.screen === 'home') return false;
    var order = S.mine ? ['car', 'paint', 'mech', 'mysave'] : ['car', 'paint', 'mech', 'result'], i = order.indexOf(S.screen);
    this.go(i > 0 ? order[i - 1] : (S.mine ? 'garage' : 'home'), 'b');
    return true;
  }
  static get KEEP() { return ['car', 'carSet', 'picked', 'km', 'kmSet', 'agencyKm', 'paint', 'ex', 'exOther', 'mech', 'mo', 'oth', 'margin', 'tray', 'hist', 'checked', 'body', 'bodyAuto', 'hideBuy', 'role']; }
  static get KEEP_KEY() { return 'sa3.mine'; }
  componentDidUpdate(pp, ps) {
    var st = this.state;
    if (!st.mine && Component.KEEP.some(function (k) { return ps[k] !== st[k]; })) {
      clearTimeout(this._keepT);
      this._keepT = setTimeout(function () {
        try {
          var o = { v: 1 };
          Component.KEEP.forEach(function (k) { o[k] = st[k]; });
          window.localStorage.setItem(Component.KEEP_KEY, JSON.stringify(o));
        } catch (e) { /* storage full or blocked: nothing to keep */ }
      }, 250);
    }
    // a finished pricing goes to this phone's history (newest first, no repeats, last 20)
    if (st.screen === 'result' && ps.screen !== 'result' && st.carSet) {
      var c = st.car, key = [c.make, c.model, c.year, c.trim, st.km].join('|');
      var h = [{ car: Object.assign({}, c), km: st.km, at: new Date().toISOString() }].concat((st.hist || []).filter(function (x) { return [x.car.make, x.car.model, x.car.year, x.car.trim, x.km].join('|') !== key; })).slice(0, 20);
      this.setState({ hist: h });
    }
    if (ps.screen !== this.state.screen || ps.deskPage !== this.state.deskPage) {
      var sh = typeof document !== 'undefined' && document.querySelector('.desk');
      if (sh) sh.scrollTop = 0;
    }
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
    var paintBase = C(opts.look.paint), glassC = C('#0d1013'), stateC = [null, C('#E3232C'), C('#5B9CF5')];
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
      var bodyGeo = track(new THREE.ExtrudeGeometry(body, { depth: D, bevelEnabled: true, bevelThickness: BT, bevelSize: 0.05, bevelSegments: OUT ? 1 : 3, curveSegments: 16, steps: 1 }));
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
      var ghGeo = track(new THREE.ExtrudeGeometry(gh, { depth: GD, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: OUT ? 1 : 3, curveSegments: 14, steps: 1 }));
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
      var tireGeo = track(new THREE.CylinderGeometry(R, R, 0.27, 32)); tireGeo.rotateX(Math.PI / 2);
      var rimGeo = track(new THREE.CylinderGeometry(R * 0.65, R * 0.65, 0.275, 28)); rimGeo.rotateX(Math.PI / 2);
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
    if (this.state.mine && ['car', 'paint', 'mech', 'mysave'].indexOf(s) < 0) this.setState(Object.assign({ mine: null }, this.state.mine.stash));
    this.setState({ screen: s, dir: dir || 'f', menu: false, deskPage: null });
    if (s === 'result' || s === 'home') this.count();
  }
  renderVals() {
    var self = this, S = this.state;
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    // links come from scraped ads: only real web addresses may be opened
    var okUrl = function (u) { return typeof u === 'string' && /^https?:\/\//i.test(u) ? u : ''; };
    var nPics = function (n) { return n === 1 ? 'صورة واحدة' : n === 2 ? 'صورتين' : n <= 10 ? n + ' صور' : n + ' صورة'; };
    var t = S.dark ? {
      bg: '#000000', ink: '#F4F4F4', mute: '#8E8E93', line: '#232326', line2: '#3A3A3F', edge: '#5C5C62',
      body: '#1C1C20', glass: '#2C3036', soft: '#131315', tire: '#000000', rim: '#3A3A3F', warn: '#FF5A52', ac: '#E3232C'
    } : {
      bg: '#F5F6F7', ink: '#000000', mute: '#5B5E63', line: '#DDE0E3', line2: '#C5C9CE', edge: '#9AA0A6',
      body: '#E2E5E8', glass: '#B9C2CC', soft: '#EAECEE', tire: '#1A1A1A', rim: '#6B7076', warn: '#B80F1A', ac: '#D81E27'
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
    var stBg = [t.body, t.ac, '#5B9CF5'], stFg = [t.mute, '#FFFFFF', '#000000'], stBd = [t.edge, t.ac, '#5B9CF5'];
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
    // repair costs follow the car: parts for a German luxury car cost more than for a Chinese city car,
    // and a bigger, pricier car of the same brand costs more again
    var mkKey = String(S.car.make || '').toLowerCase().replace(/[^a-z\u0600-\u06ff]/g, '');
    var BR = { premium: ['mercedes', 'mercedesbenz', 'bmw', 'audi', 'porsche', 'landrover', 'rangerover', 'volvo', 'lexus', 'jaguar', 'mini', 'jeep', 'maserati', 'cadillac', 'genesis', 'infiniti', 'مرسيدس', 'بيامدبليو', 'اودي'],
      euro: ['volkswagen', 'skoda', 'seat', 'cupra', 'peugeot', 'citroen', 'citroën', 'ds', 'opel', 'renault', 'fiat', 'ford', 'alfaromeo', 'subaru', 'كوبرا', 'سكودا', 'بيجو', 'رينو', 'فيات', 'اوبل'],
      budget: ['lada', 'daewoo', 'speranza', 'proton', 'byd', 'brilliance', 'zotye', 'لادا', 'دايو'],
      china: ['chery', 'geely', 'mg', 'haval', 'changan', 'jetour', 'baic', 'dongfeng', 'jac', 'gac', 'exeed', 'bestune', 'kaiyi', 'soueast', 'dfsk', 'faw', 'شيري', 'جيلي'] };
    var brandF = BR.premium.indexOf(mkKey) >= 0 ? 2.2 : BR.euro.indexOf(mkKey) >= 0 ? 1.3 : BR.budget.indexOf(mkKey) >= 0 ? 0.8 : BR.china.indexOf(mkKey) >= 0 ? 0.85 : 1;
    var CAT0 = Component.remoteCat || Component.CAT, inf0 = (CAT0[S.car.make] || {})[S.car.model] || {};
    var val0 = inf0.zero || (inf0.ref ? inf0.ref * 1.4 : 0);
    var classF = val0 ? Math.max(0.8, Math.min(1.5, Math.pow(val0 / 1200000, 0.25))) : 1;
    var costF = brandF * classF;
    var cost = function (n) { return Math.round(n * costF / 500) * 500; };
    var mLo = 0, mHi = 0, mechNames = [];
    var k1 = function (n) { return n >= 1000 ? Math.round(n / 1000) + ' ألف' : n + ' جنيه'; };
    var cats = M.map(function (c) {
      var n = 0;
      var parts = c[2].map(function (p) {
        var on = !!S.mech[p[0]];
        var lo = cost(p[2]), hi = cost(p[3]);
        if (on) { n += 1; mLo += lo; mHi += hi; mechNames.push(p[1]); }
        return {
          name: p[1], cost: k1(lo) + ' لـ ' + k1(hi), on: on ? 'true' : 'false',
          bg: on ? t.ac : 'transparent', fg: on ? '#FFFFFF' : t.ink, bd: on ? t.ac : t.line2,
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
    var trimIx = Math.max(0, Component.trimsOf(info, car.year).indexOf(car.trim));
    var trimF = 1 + 0.035 * trimIx;
    var refMid = info.ref * Math.pow(1.07, (car.year || 2022) - 2022) * Math.pow(0.992, (S.km - 60000) / 10000) * trimF;
    if (info.zero) refMid = Math.min(refMid, info.zero * 0.95);   // a used car never prices above a new one
    var baseLo = Math.round(refMid * 0.955 / 5000) * 5000, baseHi = Math.round(refMid * 1.045 / 5000) * 5000, mid = (baseLo + baseHi) / 2;
    var nComps = known ? Math.max(5, Math.round(info.n * (1 - Math.abs((car.year || 2022) - 2022) * 0.12))) : 3;
    // the real app prices from the database; the design falls back to the sample estimate above
    var live = Component.remoteQuote ? Component.remoteQuote(car, S.km) : null;
    var quoteWait = !live && !!(Component.quoteLoading && Component.quoteLoading(car, S.km));
    if (live && live.low) { baseLo = live.low; baseHi = live.high; mid = (baseLo + baseHi) / 2; nComps = live.n; if (live.zero) info = Object.assign({}, info, { zero: live.zero }); }
    var liveComps = live && live.comparables ? live.comparables : null;
    var conf = live && live.confidence ? live.confidence : nComps >= 20 ? 'عالية' : nComps >= 8 ? 'متوسطة' : 'منخفضة';
    var aiQ = live && live.ai ? live.ai : null;
    var r5 = function (n) { return Math.round(n / 5000) * 5000; };
    var kmNow = S.kmSet ? (S.km || 0) : 0;
    var agencyEff = Math.min(S.agencyKm, Math.floor(kmNow / 10000) * 10000);
    var agencyShare = S.km ? Math.min(1, agencyEff / S.km) : 0;
    var agencyAdd = r5(0.02 * mid * agencyShare);
    var paintDed = r5(mid * paintPct / 100), replDed = r5(mid * replPct / 100), exDed = r5(mid * exPct / 100);
    // defects the photo check found and the user agreed to: a share of the price by how big each is (12% at most)
    var SEV = { light: [0.4, 'بسيط'], medium: [1, 'متوسط'], heavy: [2.5, 'كبير'] };
    var r1 = function (n) { return Math.round(n / 1000) * 1000; };
    var aiDefs = (S.ai && S.ai.defs) || [], aiPct = 0, aiNames = [];
    aiDefs.forEach(function (d) { if (d.ok === true) { aiPct += (SEV[d.sev] || SEV.light)[0]; aiNames.push(d.what); } });
    var aiDed = r1(mid * Math.min(aiPct, 12) / 100);
    var finalLo = r5(baseLo + agencyAdd - paintDed - replDed - exDed - aiDed - mHi);
    var finalHi = r5(baseHi + agencyAdd - paintDed - replDed - exDed - aiDed - mLo);
    var ease = 1 - Math.pow(1 - S.k, 3);
    var rows = [{ label: 'زيها فابريكا في السوق', val: fmt(baseLo) + ' – ' + fmt(baseHi), sw: 'transparent', fg: t.ink }];
    if (agencyAdd) rows.push({ label: 'صيانات توكيل', val: '+' + fmt(agencyAdd), sw: 'transparent', fg: t.ink });
    if (paintDed) rows.push({ label: 'رش: ' + paintNames.join('، '), val: '−' + fmt(paintDed), sw: t.ac, fg: t.ink });
    if (replDed) rows.push({ label: 'متغير: ' + replNames.join('، '), val: '−' + fmt(replDed), sw: '#5B9CF5', fg: t.ink });
    if (exDed) rows.push({ label: exNames.join('، '), val: '−' + fmt(exDed), sw: t.ink, fg: t.ink });
    if (aiDed) rows.push({ label: 'من الصور: ' + aiNames.join('، '), val: '−' + fmt(aiDed), sw: t.ac, fg: t.ink });
    if (mHi) rows.push({ label: mechNames.join('، '), val: '−(' + fmt(mLo) + ' – ' + fmt(mHi) + ')', sw: 'transparent', fg: t.ink });
    if (S.ai && S.ai.score != null) rows.push({ label: 'حالتها من ' + nPics(S.ai.n), val: S.ai.score + ' من 10', sw: 'transparent', fg: t.mute });
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
    }), function (c) { return c.name; }, function (c) { return (CAT[c.make][c.model] || {}).n || 0; }) : [];
    var sameMake = hits.length > 1 && hits[1].score === hits[0].score && hits[1].item.make === hits[0].item.make;
    var didYouMean = hits.length && q.length >= 3 && !hits[0].exact && hits[0].score < 0.9 ? hits[0].item.make + (sameMake ? '' : ' ' + hits[0].item.model) : '';
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
    var logo = function (mk) { return (Component.logoFor && Component.logoFor(mk)) || ''; };
    var pickOpts = [], pickTop = [];
    if (S.picker) {
      var list = S.picker === 'make' ? Object.keys(CAT).sort()
        : S.picker === 'model' ? Object.keys(CAT[car.make] || {}).sort()
        : S.picker === 'year' ? (known ? info.years.slice().reverse() : [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018])
        : Component.trimsOf(info, car.year);
      var pq = S.pickOther.trim();
      if (pq) list = Component.fuzzy(pq, list, String).map(function (h) { return h.item; });
      // lowest first: the first is the base trim, the last the top one
      var RANK = ['الفئة الأولى', 'الفئة التانية', 'الفئة التالتة', 'الفئة الرابعة', 'الفئة الخامسة', 'الفئة السادسة', 'الفئة السابعة', 'الفئة التامنة', 'الفئة التاسعة', 'الفئة العاشرة'];
      var allTrims = S.picker === 'trim' && known ? Component.trimsOf(info, car.year) : [];
      var rankOf = function (i, n) { var r = RANK[i] || ('الفئة ' + (i + 1)); return n > 1 && i === 0 ? r + ' (الأقل)' : n > 1 && i === n - 1 ? r + ' (الأعلى)' : r; };
      var mono = function (v) { var w = String(v).replace(/[^A-Za-z0-9\u0600-\u06ff ]/g, ' ').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : String(v).slice(0, 2)).toUpperCase(); };
      var makeAds = function (mk) { var m = CAT[mk] || {}; return Object.keys(m).reduce(function (a, k) { return a + (m[k].n || 0); }, 0); };
      var opt = function (v, i, n) {
        var on = String(car[S.picker]) === String(v) && (S.carSet || (S.picked || {})[S.picker]);
        var rk = allTrims.indexOf(v);
        var lg = S.picker === 'make' ? logo(v) : '';
        var inf3 = S.picker === 'model' ? (CAT[car.make] || {})[v] : null;
        var yrs = inf3 && inf3.years && inf3.years.length ? (inf3.years[0] === inf3.years[inf3.years.length - 1] ? String(inf3.years[0]) : inf3.years[0] + ' – ' + inf3.years[inf3.years.length - 1]) : '';
        return { label: String(v), logo: lg, hasLogo: !!lg, noLogo: S.picker === 'make' && !lg, mono: mono(v), on: !!on,
          count: S.picker === 'make' ? (Object.keys(CAT[v] || {}).length + ' موديل') : '',
          sub: S.picker === 'trim' ? (rk >= 0 && allTrims.length > 1 ? rankOf(rk, allTrims.length) : '') : S.picker === 'model' ? [yrs, inf3 && inf3.trims && inf3.trims.length > 1 ? inf3.trims.length + ' فئات' : ''].filter(Boolean).join('، ') : '',
          n: rk >= 0 ? rk + 1 : i + 1, level: allTrims.length > 1 && rk >= 0 ? Math.round(20 + 80 * rk / (allTrims.length - 1)) : 60,
          delay: Math.min(0.5, i * 0.025).toFixed(3),
          sel: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
          pick: function () { self.pickField(S.picker, v); } };
      };
      pickOpts = list.map(function (v, i) { return opt(v, i, list.length); });
      if (S.picker === 'make' && !pq) {
        pickTop = Object.keys(CAT).map(function (mk) { return [mk, makeAds(mk)]; }).filter(function (x) { return x[1] > 0; })
          .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8).map(function (x, i) { return opt(x[0], i, 8); });
      }
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
          go: function () { if (okUrl(cp.url) && window.open) window.open(cp.url, '_blank', 'noopener'); } };
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
        price: fmt(m.price), priceLabel: priceLabel, delta: dTxt, rot: m.up ? 0 : 180, chipBg: m.up ? t.ac : '#5B9CF5', chipFg: m.up ? '#FFFFFF' : '#000000',
        story: story, rows: rowsI, url: okUrl(m.url), hasLink: !!okUrl(m.url),
        priceBtnLabel: m.t === 'zero' ? 'سعّر مستعملة منها' : 'سعّرها بالتفصيل',
        priceBtnBg: okUrl(m.url) ? 'transparent' : t.ink, priceBtnFg: okUrl(m.url) ? t.ink : t.bg,
        price2: function () { self.setState({ sheet: null, item: null }); self.setCar(c, m.t === 'zero' ? 60000 : m.km); },
        compare: function () {
          var id = c.make + '|' + c.model + '|' + c.year, tr = self.state.tray.slice();
          if (tr.indexOf(id) < 0 && tr.length < 3) tr.push(id);
          self.setState({ tray: tr, sheet: null, item: null });
        }
      };
    }
    var order = S.mine ? ['car', 'paint', 'mech', 'mysave'] : ['car', 'paint', 'mech', 'result'];
    var idx = order.indexOf(S.screen);
    var stepLabels = ['1 العربية', '2 الدهان', '3 الميكانيكا', S.mine ? '4 الحفظ' : '4 السعر'];
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
    var waGo = function () {
      if (!A.waStart || (self.state.wa && self.state.wa.busy)) return;
      if (self._waCtl) self._waCtl.stop = true;
      var ctl = self._waCtl = { stop: false };
      self.setState({ wa: { busy: true }, loginErr: '' });
      A.waStart().then(function (d) {
        if (ctl.stop) return;
        self.setState({ wa: { code: d.code, link: d.wa } });
        return A.waWait(d.nonce, ctl).then(function (r) {
          if (r === 'ok') { if (!self.state.login) self.flashMsg('أهلاً، دخلت'); self.setState({ wa: null }); }
          else if (r === 'expired') self.setState({ wa: null, loginErr: 'الكود خلص وقته. دوس "ادخل بالواتساب" تاني.' });
        });
      }).catch(function () { if (!ctl.stop) self.setState({ wa: null, loginErr: 'حصلت مشكلة، جرّب تاني.' }); });
    };
    var L = S.lg || {}, lgMode = S.login === 'newpass' ? 'new' : (L.mode || 'in');
    var setLg = function (o) { self.setState({ lg: Object.assign({}, self.state.lg || {}, o), loginErr: '' }); };
    var mailNow = (S.loginEmail || '').trim().toLowerCase();
    // a password worth having: 8+, letters and digits, not the obvious ones, not the email or the name
    var passScore = (function () {
      var p = L.pass || '';
      if (!p) return [0, '8 حروف على الأقل، فيها حروف وأرقام.'];
      if (p.length < 8) return [1, 'قصير. لازم 8 حروف على الأقل.'];
      if (!/[A-Za-z؀-ۿ]/.test(p) || !/\d/.test(p)) return [1, 'لازم يبقى فيه حروف وأرقام مع بعض.'];
      var low = p.toLowerCase();
      if (/^(.)\1+$/.test(p) || /^(?:0?1234567890?|password\d*|qwerty\d*|abc12345?6?|a1234567|11111111a?|iloveyou\d*|sa3arly\d*)$/.test(low) || (mailNow && low === mailNow.split('@')[0]) || (mailNow && low === mailNow))
        return [1, 'ده باسورد سهل يتخمّن. اختار غيره.'];
      var kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(function (r) { return r.test(p); }).length;
      return p.length >= 12 && kinds >= 3 ? [3, 'باسورد قوي.'] : [2, 'مقبول. أطول أو فيه رموز يبقى أقوى.'];
    })();
    var phoneNorm = function (v) { v = String(v || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[\s\-()]/g, '').replace(/^(\+|00)20/, '0'); return /^01[0125]\d{8}$/.test(v) ? v : null; };
    var authErr = function (e) {
      var m = String((e && e.message) || ''), c = (e && e.code) || '';
      return /invalid login|invalid_credentials/i.test(m + c) ? 'الإيميل أو الباسورد غلط.'
        : /already registered|user_already_exists/i.test(m + c) ? 'الإيميل ده عليه حساب. ادخل بيه من "دخول".'
        : /not confirmed/i.test(m + c) ? 'أكّد الإيميل الأول من اللينك اللي بعتناهولك.'
        : /weak|pwned|should be at least|different from the old/i.test(m + c) ? 'الباسورد ضعيف أو مستخدم قبل كده. اختار غيره.'
        : /rate|seconds|too many/i.test(m + c) || (e && e.status === 429) ? 'محاولات كتير. استنى دقيقة وجرّب تاني.'
        : /signups? (are )?(not allowed|disabled)/i.test(m) ? 'فتح حسابات جديدة مقفول دلوقتي.'
        : /email_address_invalid|email address .* invalid|invalid.*email|validation_failed/i.test(m + c) ? 'الإيميل ده مش مقبول. راجع كتابته حرف حرف (خصوصاً اللي بعد @).'
        : /error sending|smtp|unexpected_failure|over_email_send/i.test(m + c) ? 'السيرفر ماقدرش يبعت إيميل التأكيد دلوقتي. جرّب كمان ساعة.'
        : /failed to fetch|network|load failed/i.test(m) ? 'مفيش اتصال. اتأكد من النت وجرّب تاني.'
        : 'حصلت مشكلة، جرّب تاني.' + (c || m ? ' (' + String(c || m).slice(0, 60) + ')' : '');
    };
    var lgSubmit = function () {
      if (self.state.loginBusy) return;
      var m = mailNow, p = L.pass || '';
      var bad = function (t) { self.setState({ loginErr: t }); };
      if (lgMode !== 'new' && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)) return bad('اكتب إيميل صح، مثلاً name@gmail.com');
      var busy = function () { self.setState({ loginBusy: true, loginErr: '' }); };
      var fail = function (e) { self.setState({ loginBusy: false, loginErr: authErr(e) }); };
      if (lgMode === 'in') {
        if (!p) return bad('اكتب الباسورد.');
        if (!A.signIn) return bad('الدخول مش متاح دلوقتي.');
        busy();
        return A.signIn(m, p).then(function () { self.setState({ loginBusy: false, lg: {} }); }, fail);
      }
      if (lgMode === 'reset') {
        busy();
        return A.resetPass(m).then(function () { self.setState({ loginBusy: false, loginSent: true, lg: { mode: 'in', sent: 'reset' } }); }, fail);
      }
      if (passScore[0] < 2) return bad(passScore[1]);
      if (lgMode === 'new') {
        busy();
        return A.newPass(p).then(function () { self.setState({ loginBusy: false, login: null, lg: {} }); self.flashMsg('الباسورد اتغيّر'); }, fail);
      }
      if (L.role !== 'dealer' && L.role !== 'user') return bad('اختار: معرض ولا مشتري؟');
      var name = (L.name || '').trim(), shop = (L.showroom || '').trim(), ph = (L.phone || '').trim();
      if (name.length < 2) return bad('اكتب اسمك.');
      if (L.role === 'dealer' && shop.length < 2) return bad('اكتب اسم المعرض.');
      if (!ph || !phoneNorm(ph)) return bad('اكتب رقم موبايل مصري صح، مثلاً 01012345678');
      busy();
      A.signUp(m, p, { role: L.role, name: name, showroom: L.role === 'dealer' ? shop : '', phone: phoneNorm(ph) }).then(function (r) {
        if (r === 'in') self.setState({ loginBusy: false, lg: {}, role: L.role });
        else self.setState({ loginBusy: false, loginSent: true, lg: { mode: 'in', sent: 'confirm' } });
      }, fail);
    };
    var P = (A.profile) || {};
    var pf = S.pf || { name: P.name || '', showroom: P.showroom || '', phone: P.phone || '', city: P.city || '' };
    var pfDirty = !!S.pf && ['name', 'showroom', 'phone', 'city'].some(function (k) { return (pf[k] || '') !== (P[k] || ''); });
    var phoneDigits = String(pf.phone || '').replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); }).replace(/[\s\-()]/g, '').replace(/^(\+|00)20/, '0');
    var phoneBad = !!pf.phone && !/^01[0125]\d{8}$/.test(phoneDigits);
    var setPf = function (k) { return function (e) { var n = Object.assign({}, pf); n[k] = e.target.value; self.setState({ pf: n, pfErr: '' }); }; };
    var displayName = P.name || (me && me.name) || '';
    var openAccount = function () { if (!me) return needLogin('account', null); self.setState({ profile: true, pf: null, pfErr: '', menu: false }); };
    // ---------- zero prices: makes -> models -> trims -> one trim ----------
    var ZP = S.zp, zpData = null, zpFail = false;
    if (ZP) {
      var key = ZP.model ? [ZP.make, ZP.model] : ZP.make ? [ZP.make] : [];
      var got = Component.remoteZero ? Component.remoteZero(key[0], key[1]) : 'failed';
      if (got && typeof got === 'object') zpData = got;
      else if (got === 'failed') zpFail = true;
      if (zpFail) {                                      // no API (design canvas / offline): from the catalog
        var mks = Object.keys(CAT).filter(function (m) { return Object.keys(CAT[m]).some(function (md) { return CAT[m][md].zero; }); });
        if (!ZP.make) zpData = { items: mks.map(function (m) { var zs = Object.keys(CAT[m]).map(function (md) { return CAT[m][md].zero; }).filter(Boolean); return { make: m, models: zs.length, trims: zs.length, from: Math.min.apply(null, zs) }; }) };
        else if (!ZP.model) zpData = { items: Object.keys(CAT[ZP.make] || {}).filter(function (md) { return CAT[ZP.make][md].zero; }).map(function (md) { var c = CAT[ZP.make][md]; return { model: md, trims: c.trims.length, from: c.zero, to: Math.round(c.zero * 1.15), year: c.years[c.years.length - 1] }; }) };
        else { var cc = (CAT[ZP.make] || {})[ZP.model]; zpData = { items: !cc ? [] : cc.trims.map(function (tr, i) { return { trim: tr, full: tr, year: cc.years[cc.years.length - 1], price: Math.round(cc.zero * (1 + i * 0.06) / 1000) * 1000, history: [] }; }) }; }
      }
    }
    var zpItems = zpData ? zpData.items : [];
    var zpQ = S.zpq.trim();
    var zpKeyOf = function (it) { return it.trim ? it.trim + ' ' + it.year : it.model || it.make; };
    if (zpQ && !(ZP && ZP.trim)) zpItems = Component.fuzzy(zpQ, zpItems, zpKeyOf).map(function (h) { return h.item; });
    var zpTrim = ZP && ZP.trim ? (zpData ? zpData.items : []).filter(function (it) { return it.full + '|' + it.year === ZP.trim; })[0] : null;
    var dmy = function (iso) { var d = new Date(iso); return isNaN(d) ? '' : d.getDate() + ' ' + ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][d.getMonth()] + ' ' + d.getFullYear(); };
    var chg = function (c) { return c ? (c > 0 ? '▲ +' : '▼ −') + fmt(Math.abs(c)) : ''; };
    var openZp = function () { self.setState({ zp: {}, zpq: '', menu: false, sheet: null }); };
    var siteUrl = typeof location !== 'undefined' && location.origin && location.origin.indexOf('http') === 0 ? location.origin : 'https://sa3arly-6c4z.vercel.app';
    var ago = function (iso) {
      var d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
      return d <= 0 ? 'النهارده' : d === 1 ? 'امبارح' : d === 2 ? 'من يومين' : 'من ' + d + ' يوم';
    };

    // ---------- who's using it: a showroom / trader, or someone buying or selling his own car ----------
    var role = S.role || (A.profile && A.profile.role) || null;
    var isDealer = role !== 'user';
    var setRole = function (r) {
      self.setState({ role: r });
      if (A.user && A.saveProfile) A.saveProfile({ role: r }).catch(function () {});
      self.flashMsg(r === 'dealer' ? 'الحساب بقى معرض / تاجر' : 'الحساب بقى مستخدم عادي');
    };
    // ---------- عربياتي ----------
    var openGarage = function () {
      if (!me) return needLogin('garage', { kind: 'garage' });
      self.setState({ menu: false, sheet: null, zp: null });
      self.go('garage', 'f');
    };
    var MY_ST = { available: ['متاحة', '#3FB57A'], reserved: ['محجوزة', '#E6A23C'], sold: ['اتباعت', t.mute] };
    var myAll = A.garage || [];
    var myCount = { all: myAll.length, available: 0, reserved: 0, sold: 0 };
    myAll.forEach(function (x) { myCount[x.status] = (myCount[x.status] || 0) + 1; });
    var myStock = myAll.filter(function (x) { return x.status !== 'sold'; }).reduce(function (a, x) { return a + (x.price || 0); }, 0);
    var digits = function (v) { return String(v || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[^0-9]/g, ''); };
    var myPriceN = parseInt(digits(S.my.price), 10) || 0;
    var myPriceBad = !!S.my.price && (myPriceN < 1000 || myPriceN > 100000000);
    var carName = function (c) { return c.make + ' ' + c.model + ' ' + c.year; };
    var doSaveMine = function () {
      if (!me) return needLogin('garage', { kind: 'garage' });
      if (self.state.myBusy || myPriceBad) return;
      var st = self.state;
      var urls = st.extras || [];
      var aiKeep = !st.ai ? null : { score: st.ai.score, areas: st.ai.areas, summary: st.ai.summary, missing: [], n: st.ai.n,
        defs: st.ai.defs.filter(function (d) { return d.ok !== false; }).map(function (d) { return { area: d.area, what: d.what, sev: d.sev, ok: d.ok, pic: '' }; }) };
      var body = { car: { make: car.make, model: car.model, year: car.year, trim: car.trim || '' }, km: st.km,
        price: myPriceN || null, status: st.my.status, notes: st.my.notes,
        details: { paint: paintNames, repl: replNames, other: exNames, mech: mechNames,
          report: aiKeep ? { score: aiKeep.score, summary: aiKeep.summary, defects: aiKeep.defs.map(function (d) { return d.what; }) } : null,
          raw: { ai: aiKeep, paint: st.paint, ex: st.ex, exOther: st.exOther, mech: st.mech, mo: st.mo, oth: st.oth, body: st.body, agencyKm: st.agencyKm } } };
      var id = st.mine && st.mine.id;
      self.setState({ myBusy: true });
      A.carPhotos(urls).then(function (ph) {
        body.photos = ph.photos; body.cover = ph.cover;
        return id ? A.carEdit(id, body) : A.carAdd(body);
      }).then(function () {
        self.setState({ myBusy: false });
        self.go('garage', 'b');
        self.flashMsg(id ? 'التعديلات اتحفظت' : 'العربية اتضافت لعربياتك');
      }, function () { self.setState({ myBusy: false }); self.flashMsg('ماتحفظتش، جرّب تاني'); });
    };
    var mo2 = S.myOpen;
    var myRows = !mo2 ? [] : [
      ['الفئة', mo2.car.trim || '—'], ['العداد', fmt(mo2.km) + ' كم'],
      ['الدهان', (mo2.details.paint || []).length || (mo2.details.repl || []).length
        ? [(mo2.details.paint || []).length ? 'رش: ' + mo2.details.paint.join('، ') : '', (mo2.details.repl || []).length ? 'متغير: ' + mo2.details.repl.join('، ') : ''].filter(Boolean).join('، ')
        : 'فابريكا بالكامل'],
      ['الميكانيكا', (mo2.details.mech || []).length ? mo2.details.mech.join('، ') : 'مفيش ملاحظات'],
      ['حاجات تانية', (mo2.details.other || []).length ? mo2.details.other.join('، ') : ''],
      ['حالتها من الصور', mo2.details.report && mo2.details.report.score != null ? mo2.details.report.score + ' من 10' : ''],
      ['اتضافت', ago(mo2.at)]
    ].filter(function (r) { return r[1]; }).map(function (r) { return { k: r[0], v: r[1] }; });

    var menuAcc = me ? { label: displayName || me.email, go: openAccount } : { label: 'ادخل حسابك', go: function () { needLogin('account', null); } };
    var menuItems = [
      { label: 'سعّر عربية', go: function () { if (self.state.mine) self.go('home'); self.go('car'); } },
      { label: 'قارن عربيات', go: function () { self.go('compare'); } },
      { label: 'سعر الزيرو', go: function () { openZp(); } },
      { label: 'تسعيراتي', gap: 14, go: function () { self.setState({ menu: false, more: true }); self.go('home', 'b'); } },
      { label: 'عربياتي', go: function () { openGarage(); } },
      { label: 'تنبيهاتي', go: function () { if (!me) return needLogin('alerts', { kind: 'alerts' }); self.setState({ menu: false, sheet: 'alerts' }); } }
    ].filter(function (m) { return isDealer || m.label !== 'عربياتي'; }).map(function (m, i) { m.delay = (0.05 + i * 0.04).toFixed(2); m.gap = m.gap || 0; return m; });
    var roleSeg = [['dealer', 'معرض / تاجر'], ['user', 'مستخدم عادي']].map(function (r) {
      var on = (r[0] === 'dealer') === isDealer;
      return { label: r[1], sel: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.mute, pick: function () { if (!on) setRole(r[0]); } };
    });

    return {
      t: t, dark: S.dark, light: !S.dark, darkStr: S.dark ? 'true' : 'false',
      themeLabel: S.dark ? 'الوضع النهاري' : 'الوضع الليلي',
      swBg: S.dark ? t.ink : 'transparent', swKnob: S.dark ? t.bg : t.ink, knob: S.dark ? 3 : 25,
      toggleTheme: function () { var d = !self.state.dark; self.setState({ dark: d }); if (Component.saveTheme) Component.saveTheme(d); },
      enterCls: S.dir === 'b' ? 'enter-b' : 'enter-f',
      isHome: S.screen === 'home', isCompare: S.screen === 'compare', isFlow: idx >= 0,
      isCar: S.screen === 'car', isPaint: S.screen === 'paint', isMech: S.screen === 'mech', isResult: S.screen === 'result',
      menu: S.menu, menuItems: menuItems, menuAcc: menuAcc, roleSeg: roleSeg,
      openMenu: function () { self.setState({ menu: true }); }, closeMenu: function () { self.setState({ menu: false }); },
      goCar: function () { if (self.state.mine) self.go('home', 'f'); self.go('car', 'f'); }, goPaint: function () { self.go('paint', 'f'); },
      carNext: function () {
        if (!self.state.carSet) return self.setState({ picker: 'make', pickOther: '', sheet: 'picker' });
        if (!self.state.kmSet) { var el = document.querySelector('input[name=km]'); if (el) el.focus(); return self.flashMsg('اكتب العداد الأول'); }
        self.go('paint', 'f');
      },
      carNextLabel: !S.carSet ? 'اختار العربية الأول' : !S.kmSet ? 'اكتب العداد' : 'التالي: الدهان',
      carNextOp: S.carSet && S.kmSet ? 1 : 0.55,
      goMech: function () { self.go('mech', 'f'); }, goResult: function () { self.go(S.mine ? 'mysave' : 'result', 'f'); },
      mechCostNote: 'الأسعار متظبطة على ' + (S.car.make || 'العربية') + (costF >= 1.6 ? ' (قطع غيارها غالية)' : costF <= 0.9 ? ' (قطع غيارها رخيصة)' : '') + '.',
      mechNextLabel: S.mine ? 'التالي: السعر والحالة' : 'احسب السعر',
      goCompare: function () { self.go('compare', 'f'); }, goHomeBack: function () { self.go('home', 'b'); },
      back: function () { self.go(idx > 0 ? order[idx - 1] : (S.mine ? 'garage' : 'home'), 'b'); },
      flowAria: S.mine ? 'خطوات إضافة العربية' : 'خطوات التسعير',
      steps: steps,
      q: S.q, onQ: function (e) { self.setState({ q: e.target.value }); },
      results: results, hasResults: results.length > 0, noQuery: !S.q.trim(), didYouMean: didYouMean, canCompare: S.tray.length >= 2, trayCount: S.tray.length,
      cmp: cmp,
      firstCmpName: cmpCars[0].name,
      priceFirstCmp: function () { var c = cmpCars[0]; self.setCar({ make: c.make, model: c.model, year: c.year, trim: CAT[c.make][c.model].trims[0] }, 60000); },
      km: S.km, kmTxt: fmt(S.km),
      onKm: function (e) {
        var v = parseInt(String(e.target.value).replace(/[^0-9]/g, ''), 10) || 0;
        self.setState({ km: v, kmSet: v > 0 });     // the agency slider keeps its value; it's capped at the km where it's used
      },
      kmInput: S.kmSet ? fmt(S.km) : '',
      kmErr: S.kmSet && S.km <= 0, kmBorder: S.kmSet && S.km <= 0 ? t.warn : t.edge,
      agencyKm: agencyEff, agencyMax: Math.max(10000, Math.floor(kmNow / 10000) * 10000), agencyTxt: !S.kmSet ? '—' : agencyEff ? fmt(agencyEff) + ' كم' : 'مفيش',
      agencyOff: S.kmSet ? undefined : true, agencyOp: S.kmSet ? 1 : 0.45,
      agencyHint: !S.kmSet ? 'اكتب العداد الأول، وبعدين حدد صيانات التوكيل.' : 'الصيانة كل 10,000 كم. يعني ' + Math.floor(agencyEff / 10000) + ' صيانة من ' + Math.floor(kmNow / 10000) + ' اتعملوا في التوكيل.',
      onAgency: function (e) { self.setState({ agencyKm: parseInt(e.target.value, 10) || 0 }); },
      agencyCount: Math.floor(agencyEff / 10000), serviceCount: services,
      faces: faces, glass: glass, wheels: wheels, extras: extras,
      nF: counts[0], nP: counts[1], nR: counts[2],
      paintLine: S.last ? S.last : (counts[1] || counts[2] ? counts[0] + ' فابريكا، ' + counts[1] + ' رش، ' + counts[2] + ' متغير' : 'كلها فابريكا. دوس على أي جزء.'),
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
      market: MARKET.slice().sort(function (a, b) { return (b.city && b.city === P.city ? 1 : 0) - (a.city && a.city === P.city ? 1 : 0); }).filter(function (m) { return S.mf === 'all' || m.t === S.mf; }).slice(0, S.more ? 20 : 2).map(function (m) {
        var d = m.delta * ease;
        var dtxt = m.pct ? (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1).replace('.0', '') + '%' : (d > 0 ? '+' : '−') + fmt(Math.abs(Math.round(d / 1000) * 1000));
        if (!m.pct && d < 0) dtxt = '−' + fmt(Math.abs(Math.round(d / 1000) * 1000));
        return { name: m.name, kind: m.kind, when: m.when, price: fmt(m.price), delta: dtxt,
          dc: m.up ? t.warn : '#5B9CF5', rot: m.up ? 0 : 180, aria: m.name + '، ' + m.kind + '، التفاصيل',
          go: function () { self.setState({ sheet: 'item', item: m }); } };
      }),
      recent: (S.hist || []).map(function (x, i) {
        var cur = qKey(x.car, x.km, 0, 0) === qKey(car, S.km, 0, 0);
        return { name: x.car.make + ' ' + x.car.model + ' ' + x.car.year + '، ' + fmt(x.km) + ' كم', range: cur ? fmt(finalLo) + ' – ' + fmt(finalHi) : 'افتحها',
          note: (i === 0 ? 'آخر تسعير ليك' : ago(x.at)) + (cur && isSaved ? '، محفوظة' : ''), noteFg: i === 0 ? '#5B9CF5' : t.mute,
          go: function () { if (cur) self.go('result', 'f'); else self.setCar(x.car, x.km, 'result'); } };
      }).concat((me ? A.items || [] : []).filter(function (x) {
        return !(S.hist || []).some(function (h) { return qKey(h.car, h.km, 0, 0) === qKey(x.car, x.km, 0, 0); });
      }).map(function (x) {
        return { name: x.car.make + ' ' + x.car.model + ' ' + x.car.year + '، ' + fmt(x.km) + ' كم', range: fmt(x.low) + ' – ' + fmt(x.high), note: 'محفوظة ' + ago(x.at), noteFg: t.mute,
          go: function () { self.setCar({ make: x.car.make, model: x.car.model, year: x.car.year, trim: x.car.trim || '' }, x.km, 'result'); } };
      })).slice(0, S.more ? 30 : 4),
      noRecent: !(S.hist || []).length && !(me && (A.items || []).length),
      hasRecent: !!((S.hist || []).length || (me && (A.items || []).length)),
      recentLogin: !me && A.enabled !== false,
      openLogin: function () { needLogin('account', null); },
      doSave: doSave, savePressed: isSaved ? 'true' : 'false', saveFill: isSaved ? t.ink : 'none',
      saveAria: isSaved ? 'اتحفظت في تسعيراتك' : S.saving ? 'بتتحفظ' : 'احفظ التسعيرة',
      login: !!S.login, loginOff: A.ready && A.enabled === false, loginAsk: !S.loginSent && A.enabled !== false && lgMode !== 'new', loginSent: S.loginSent,
      loginTitle: { save: 'احفظ التسعيرة دي', alerts: 'شغّل التنبيهات', photos: 'خلّينا نقرا الصور', newpass: 'اختار باسورد جديد' }[S.login] || 'ادخل حسابك',
      loginWhy: { save: 'ادخل مرة واحدة، وكل تسعيرة تحفظها هتلاقيها على أي موبايل أو كمبيوتر.', alerts: 'هنقولك أول ما سعر الزيرو يتغير أو تنزل عربية أرخص من السوق.', photos: 'بعد ما تدخل، صوّر العربية وإحنا نعرف الماركة والموديل، ونقرا العداد لوحدنا.' }[S.login] || 'تسعيراتك وتنبيهاتك تفضل معاك على أي جهاز. التسعير نفسه شغال من غير حساب.',
      loginEmail: S.loginEmail, onLoginEmail: function (e) { self.setState({ loginEmail: e.target.value, loginErr: '' }); },
      lg: (function () {
        var seg = function (on) { return { bg: on ? t.bg : 'transparent', fg: on ? t.ink : t.mute }; };
        var card = function (on) { return { bd: on ? t.ac : t.line2, bg: on ? t.ac : 'transparent', fg: on ? '#FFFFFF' : t.ink }; };
        var si = seg(lgMode === 'in' || lgMode === 'reset'), su = seg(lgMode === 'up'), cd = card(L.role === 'dealer'), cu = card(L.role === 'user');
        var change = function (k) { return function (e) { setLg((function (o) { o[k] = e.target.value; return o; })({})); }; };
        return {
          isIn: lgMode === 'in', isUp: lgMode === 'up', isReset: lgMode === 'reset', isNew: lgMode === 'new' && !S.loginSent, needPass: lgMode !== 'reset',
          inSel: lgMode !== 'up' ? 'true' : 'false', upSel: lgMode === 'up' ? 'true' : 'false', inBg: si.bg, inFg: si.fg, upBg: su.bg, upFg: su.fg,
          goIn: function () { setLg({ mode: 'in' }); }, goUp: function () { setLg({ mode: 'up' }); }, goReset: function () { setLg({ mode: 'reset' }); },
          dealerOn: L.role === 'dealer' ? 'true' : 'false', userOn: L.role === 'user' ? 'true' : 'false', isDealer: L.role === 'dealer',
          dealerBd: cd.bd, dealerBg: cd.bg, dealerFg: cd.fg, userBd: cu.bd, userBg: cu.bg, userFg: cu.fg,
          setDealer: function () { setLg({ role: 'dealer' }); }, setUser: function () { setLg({ role: 'user' }); },
          name: L.name || '', showroom: L.showroom || '', phone: L.phone || '', pass: L.pass || '',
          onName: change('name'), onShowroom: change('showroom'), onPhone: change('phone'), onPass: change('pass'),
          passType: L.show ? 'text' : 'password', passAuto: lgMode === 'in' ? 'current-password' : 'new-password',
          passHint: lgMode === 'in' ? 'الباسورد' : 'باسورد: 8 حروف وأرقام على الأقل',
          showOn: L.show ? 'true' : 'false', showLabel: L.show ? 'إخفاء' : 'إظهار', toggleShow: function () { setLg({ show: !L.show }); },
          strPct: [0, 33, 66, 100][passScore[0]], strBg: [t.line, t.warn, t.mute, t.ink][passScore[0]], strTxt: passScore[1],
          submit: lgSubmit, off: !!S.loginBusy, op: S.loginBusy ? 0.5 : 1,
          btn: S.loginBusy ? 'لحظة…' : { in: 'ادخل', up: 'اعمل الحساب', reset: 'ابعتلي لينك أغيّر الباسورد', new: 'احفظ الباسورد الجديد' }[lgMode],
          sentTxt: L.sent === 'reset' ? 'لو الإيميل ده عليه حساب، هيوصله لينك تغيّر بيه الباسورد. افتحه من نفس الجهاز ده. لو مش لاقيه بصّ في الـ Spam.'
            : 'بعتنالك لينك تأكيد. افتحه وبعدين ادخل بالإيميل والباسورد. لو الإيميل عليه حساب قبل كده مش هيوصلك حاجة، ادخل بيه عادي. لو مش لاقيه بصّ في الـ Spam.'
        };
      })(),
      loginErr: S.loginErr, hasLoginErr: !!S.loginErr,
      waOn: !!A.waOn, waIdle: !!A.waOn && !S.wa, waWaiting: !!(S.wa && S.wa.code), waBusy: !!(S.wa && S.wa.busy),
      waGo: waGo, waCode: S.wa && S.wa.code ? S.wa.code.slice(0, 3) + ' ' + S.wa.code.slice(3) : '', waLink: (S.wa && S.wa.link) || '',
      waCancel: function () { if (self._waCtl) self._waCtl.stop = true; self.setState({ wa: null }); },
      loginKey: function (e) {
        if (e.key === 'Escape') { if (A.pending) A.pending(null); self.setState({ login: null }); }
        else if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') { e.preventDefault(); lgSubmit(); }
      },
      goGoogle: function () {
        if (!A.google) return;
        self.setState({ loginErr: '' });
        A.google().catch(function () { self.setState({ loginErr: 'الدخول بجوجل مش متاح دلوقتي. ادخل بالإيميل والباسورد.' }); });
      },
      googleOn: A.googleOn !== false,
      closeLogin: function () { if (A.pending) A.pending(null); if (self._waCtl) self._waCtl.stop = true; self.setState({ login: null, wa: null, lg: {} }); },
      editEmail: function () { self.setState({ loginSent: false, lg: { mode: 'in' } }); },
      hasFlash: !!S.flash, flash: S.flash,
      isDealer: isDealer, isUser: !isDealer, showBuyRow: isDealer && !S.hideBuy,
      goHomeTop: function () { self.setState({ sheet: null, zp: null, menu: false, myOpen: null }); self.go('home', 'b'); },
      isGarage: S.screen === 'garage', isMySave: S.screen === 'mysave', openGarage: openGarage,
      startMine: function () { self.startMine(null); },
      myTotal: myCount.all, myHasAny: myCount.all > 0, myEmpty: !!A.garageReady && myCount.all === 0, myLoadingList: !A.garageReady && !!me,
      mySummary: myCount.available + ' متاحة، ' + myCount.reserved + ' محجوزة، ' + myCount.sold + ' اتباعت',
      myStockTxt: myStock ? 'العربيات اللي لسه عندك بـ ' + fmt(myStock) + ' ج' : '',
      myHasStock: !!myStock,
      myHomeSub: myCount.all ? myCount.available + ' متاحة، ' + myCount.reserved + ' محجوزة، ' + myCount.sold + ' اتباعت' : 'العربيات اللي عندك في المعرض وأسعارها',
      myFilters: [['all', 'الكل'], ['available', 'متاحة'], ['reserved', 'محجوزة'], ['sold', 'اتباعت']].map(function (f) {
        var on = S.myF === f[0];
        return { label: f[1] + ' ' + (myCount[f[0]] || 0), sel: on ? 'true' : 'false', bg: on ? t.ink : 'transparent', fg: on ? t.bg : t.ink, bd: on ? t.ink : t.line2,
          pick: function () { self.setState({ myF: f[0] }); } };
      }),
      myList: myAll.filter(function (x) { return S.myF === 'all' || x.status === S.myF; }).map(function (x, i) {
        var st2 = MY_ST[x.status] || MY_ST.available;
        return { name: carName(x.car), sub: [x.car.trim, fmt(x.km) + ' كم'].filter(Boolean).join('، '),
          price: x.price ? fmt(x.price) : 'من غير سعر', priceOp: x.price ? 1 : 0.5,
          stLabel: st2[0], stColor: st2[1], hasCover: !!x.cover, noCover: !x.cover, cover: x.cover || '',
          op: x.status === 'sold' ? 0.6 : 1, delay: Math.min(0.4, i * 0.04).toFixed(2),
          aria: carName(x.car) + '، ' + st2[0] + (x.price ? '، ' + fmt(x.price) + ' جنيه' : ''),
          go: function () { self.openMy(x); } };
      }),
      myFilterEmpty: myCount.all > 0 && !myAll.some(function (x) { return S.myF === 'all' || x.status === S.myF; }),
      // the save step of the add / edit flow
      myTitle: S.mine && S.mine.id ? 'عدّل العربية' : 'ضيفها لعربياتك',
      myCarName: carName(car) + (car.trim ? ' ' + car.trim : '') + '، ' + fmt(S.km) + ' كم',
      myPrice: S.my.price,
      onMyPrice: function (e) { var d = digits(e.target.value); self.setState({ my: Object.assign({}, self.state.my, { price: d ? parseInt(d, 10).toLocaleString('en-US') : '' }) }); },
      myPriceBad: myPriceBad,
      myNotes: S.my.notes,
      onMyNotes: function (e) { self.setState({ my: Object.assign({}, self.state.my, { notes: e.target.value.slice(0, 2000) }) }); },
      myStatuses: ['available', 'reserved', 'sold'].map(function (k) {
        var on = S.my.status === k, c = MY_ST[k][1];
        return { label: MY_ST[k][0], sel: on ? 'true' : 'false', bd: on ? c : t.line2, bg: on ? c : 'transparent', fg: on ? '#000000' : t.ink,
          pick: function () { self.setState({ my: Object.assign({}, self.state.my, { status: k }) }); } };
      }),
      myPhotoTxt: S.extras.length ? (S.extras.length > 20 ? 'أول 20 صورة هتتحفظ معاها' : nPics(S.extras.length) + ' هتتحفظ معاها') : 'من غير صور. ممكن ترجع للخطوة الأولى وتضيف.',
      mySaveLabel: S.myBusy ? 'بنحفظ…' : (S.mine && S.mine.id ? 'احفظ التعديلات' : 'احفظ في عربياتي'),
      mySaveOp: S.myBusy || myPriceBad ? 0.55 : 1,
      saveMine: doSaveMine,
      // one car, opened from the list
      myOpenOn: !!mo2, myO: !mo2 ? {} : {
        name: carName(mo2.car), price: mo2.price ? fmt(mo2.price) : 'من غير سعر', hasPrice: !!mo2.price,
        loading: !!mo2.loading, hasPhotos: !!(mo2.photos && mo2.photos.length),
        photos: (mo2.photos || []).map(function (u, i) { return { src: u, alt: 'صورة ' + (i + 1) }; }),
        rows: myRows, hasNotes: !!mo2.notes, notes: mo2.notes || '',
        statuses: ['available', 'reserved', 'sold'].map(function (k) {
          var on = mo2.status === k, c = MY_ST[k][1];
          return { label: MY_ST[k][0], sel: on ? 'true' : 'false', bd: on ? c : t.line2, bg: on ? c : 'transparent', fg: on ? '#000000' : t.ink,
            pick: function () {
              if (on || mo2.loading) return;
              var prev = self.state.myOpen.status;
              self.setState({ myOpen: Object.assign({}, self.state.myOpen, { status: k }) });
              A.carEdit(mo2.id, { status: k }).then(function () { self.flashMsg('بقت ' + MY_ST[k][0]); }, function () {
                if (self.state.myOpen && self.state.myOpen.id === mo2.id) self.setState({ myOpen: Object.assign({}, self.state.myOpen, { status: prev }) });
                self.flashMsg('ماتغيرتش، جرّب تاني');
              });
            } };
        }),
        adIdle: !!Component.writeAd && !mo2.loading && !S.ad, adBusy: !!(S.ad && S.ad.busy), hasAd: !!(S.ad && !S.ad.busy && S.ad.text),
        adText: (S.ad && S.ad.text) || '', hasAdErr: !!(S.ad && S.ad.err), adErr: (S.ad && S.ad.err) || '',
        copyLabel: S.ad && S.ad.copied ? 'اتنسخ' : 'انسخ الإعلان',
        onAd: function (e) { self.setState({ ad: Object.assign({}, self.state.ad, { text: e.target.value, copied: false }) }); },
        copyAd: function () {
          var txt = (self.state.ad && self.state.ad.text) || '';
          var done = function () { self.setState({ ad: Object.assign({}, self.state.ad, { copied: true }) }); self.flashMsg('الإعلان اتنسخ'); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { self.flashMsg('ماتنسخش، علّم على النص وانسخه'); });
          else self.flashMsg('علّم على النص وانسخه');
        },
        writeAd: function () {
          if (!Component.writeAd || (self.state.ad && self.state.ad.busy)) return;
          var d = mo2.details || {}, id = mo2.id;
          self.setState({ ad: { busy: true } });
          Component.writeAd({ make: mo2.car.make, model: mo2.car.model, year: mo2.car.year, trim: mo2.car.trim, km: mo2.km, price: mo2.price, notes: mo2.notes,
            painted: d.paint, replaced: d.repl, other: d.other, mechanical: d.mech, report: d.report }, mo2.photos || []).then(function (r) {
            if (!self.state.myOpen || self.state.myOpen.id !== id) return;
            self.setState({ ad: { text: (r.title ? r.title + '\n\n' : '') + r.text } });
          }, function (e) {
            if (!self.state.myOpen || self.state.myOpen.id !== id) return;
            self.setState({ ad: null });
            self.flashMsg(e && e.status === 429 ? 'كتبت إعلانات كتير الساعة دي، جرّب كمان شوية' : 'الإعلان ماتكتبش، جرّب تاني');
          });
        },
        delLabel: S.myDel ? 'دوس تاني عشان تمسحها' : 'امسحها', delFg: S.myDel ? '#E5484D' : t.mute,
        edit: function () { if (!mo2.loading) self.startMine(mo2); },
        del: function () {
          if (!self.state.myDel) return self.setState({ myDel: true });
          A.carRemove(mo2.id).then(function () { self.setState({ myOpen: null, myDel: false }); self.flashMsg('اتمسحت'); },
            function () { self.flashMsg('ماتمسحتش، جرّب تاني'); });
        }
      },
      closeMy: function () { self.setState({ myOpen: null, myDel: false, ad: null }); },
      myKey: function (e) { if (e.key === 'Escape') self.setState({ myOpen: null, myDel: false }); },
      zpOpen: !!S.zp, zpKey: !S.zp ? '' : [S.zp.make || '', S.zp.model || '', S.zp.trim || ''].join('|'),
      zpBack: function () {
        var z = self.state.zp || {};
        self.setState({ zpq: '', zp: z.trim ? { make: z.make, model: z.model } : z.model ? { make: z.make } : z.make ? {} : null });
      },
      zpBackAria: !S.zp ? '' : S.zp.make ? 'ارجع' : 'اقفل',
      zpClose: function () { self.setState({ zp: null, zpq: '' }); },
      zpKeyDown: function (e) { if (e.key === 'Escape') self.setState({ zp: null, zpq: '' }); },
      zpCrumb: !ZP ? '' : ['أسعار الزيرو'].concat(ZP.make ? [ZP.make] : [], ZP.model ? [ZP.model] : []).join(' › '),
      zpTitle: !ZP ? '' : zpTrim ? zpTrim.trim : ZP.model ? ZP.model + ' — الفئات' : ZP.make ? ZP.make + ' — الموديلات' : 'سعر الزيرو',
      zpList: !!ZP && !ZP.trim, zpDetail: !!zpTrim, zpLoading: !!ZP && !zpData,
      zpSearchPh: !ZP ? '' : ZP.model ? 'دوّر في الفئات' : ZP.make ? 'دوّر في موديلات ' + ZP.make : 'دوّر على ماركة: تويوتا، كيا…',
      zpEmpty: !!zpData && zpItems.length === 0, zpEmptyTxt: zpQ ? 'مفيش حاجة بالاسم ده.' : 'مفيش أسعار زيرو متسجلة هنا لسه.',
      zpRows: !ZP || ZP.trim ? [] : zpItems.map(function (it) {
        if (!ZP.make) return { title: it.make, logo: logo(it.make), hasLogo: !!logo(it.make), sub: it.models + ' موديل، ' + it.trims + ' فئة', right: 'من ' + fmt(it.from), rightSub: '', rsColor: t.mute,
          go: function () { self.setState({ zp: { make: it.make }, zpq: '' }); } };
        if (!ZP.model) return { title: it.model + ' ' + it.year, sub: it.trims + (it.trims === 1 ? ' فئة' : ' فئات'), right: fmt(it.from), rightSub: it.to > it.from ? 'لحد ' + fmt(it.to) : '', rsColor: t.mute,
          go: function () { self.setState({ zp: { make: ZP.make, model: it.model }, zpq: '' }); } };
        return { title: it.trim, sub: 'موديل ' + it.year + (it.changed_on ? '، من ' + dmy(it.changed_on) : ''), right: fmt(it.price), rightSub: chg(it.change), rsColor: it.change > 0 ? t.warn : '#5B9CF5',
          go: function () { self.setState({ zp: { make: ZP.make, model: ZP.model, trim: it.full + '|' + it.year }, zpq: '' }); } };
      }),
      zdYear: zpTrim ? zpTrim.year : '', zdPrice: zpTrim ? fmt(zpTrim.price) : '',
      zdHasChange: !!(zpTrim && zpTrim.change), zdChange: zpTrim && zpTrim.change ? chg(zpTrim.change) + ' عن السعر اللي قبله (' + fmt(zpTrim.prev) + ')' : '',
      zdChangeColor: zpTrim && zpTrim.change > 0 ? t.warn : '#5B9CF5',
      zdRows: !zpTrim ? [] : [{ k: 'الماركة', v: ZP.make }, { k: 'الموديل', v: ZP.model }, { k: 'الفئة', v: zpTrim.trim }, { k: 'سنة الموديل', v: String(zpTrim.year) }]
        .concat(zpTrim.market ? [{ k: 'سعر السوق (هتلاقي)', v: fmt(zpTrim.market) + (zpTrim.market > zpTrim.price ? ' (أوفر برايس ' + fmt(zpTrim.market - zpTrim.price) + ')' : '') }] : [])
        .concat([{ k: 'آخر تحديث', v: dmy(zpTrim.changed_on) || '—' }, { k: 'المصدر', v: zpTrim.source || 'هتلاقي' }]),
      zdHasHist: !!(zpTrim && zpTrim.history && zpTrim.history.length > 1),
      zdHist: !zpTrim || !zpTrim.history ? [] : zpTrim.history.slice().reverse().map(function (h, i, arr) {
        var nx = arr[i + 1], d = nx ? h.price - nx.price : 0;
        return { date: dmy(h.date), price: fmt(h.price), d: d ? (d > 0 ? '+' : '−') + fmt(Math.abs(d)) : '', c: d > 0 ? t.warn : '#5B9CF5' };
      }),
      zdHasUrl: !!(zpTrim && okUrl(zpTrim.url)), zdUrl: zpTrim ? okUrl(zpTrim.url) : '', zdSource: zpTrim && zpTrim.source ? zpTrim.source : 'هتلاقي',
      zdPrice2: function () {
        var inf = (CAT[ZP.make] || {})[ZP.model];
        var mk = inf ? ZP.make : (Component.fuzzy(ZP.make, Object.keys(CAT), String)[0] || {}).item;
        var md = inf ? ZP.model : mk ? (Component.fuzzy(ZP.model, Object.keys(CAT[mk]), String)[0] || {}).item : null;
        self.setState({ zp: null, zpq: '' });
        if (!mk || !md) return self.flashMsg('مفيش إعلانات مستعمل كفاية للموديل ده لسه');
        var c2 = CAT[mk][md], tr = (Component.fuzzy(zpTrim.trim, c2.trims, String)[0] || {}).item || c2.trims[0];
        self.setCar({ make: mk, model: md, year: c2.years[c2.years.length - 1], trim: tr }, 60000);
      },
      zdAlert: function () {
        if (!me) return needLogin('alerts', { kind: 'alerts' });
        self.flashMsg('هنبعتلك لما سعر ' + ZP.model + ' ' + zpTrim.trim + ' يتغيّر');
      },
      zpQ: S.zpq, onZpQ: function (e) { self.setState({ zpq: e.target.value }); },
      installShow: !desk && !!Component.install && Component.install.show() && !S.installHidden,
      installSub: Component.install && Component.install.ios ? 'دوس مشاركة ⬆ وبعدين Add to Home Screen' : 'يفتح زي أي أبلكيشن، من غير ستور',
      installBtn: Component.install && Component.install.ios ? 'إزاي؟' : 'نزّله',
      doInstall: function () {
        var I = Component.install; if (!I) return;
        if (I.ios) return self.flashMsg('دوس زرار المشاركة ⬆ تحت، وبعدين Add to Home Screen');
        I.prompt().then(function (ok) { if (ok) self.setState({ installHidden: true }); });
      },
      hideInstall: function () { if (Component.install) Component.install.dismiss(); self.setState({ installHidden: true }); },
      desk: desk, shellCls: !desk ? '' : 'desk' + (idx < 0 && S.screen !== 'compare' && S.screen !== 'garage' ? ' desk-over' : ''),
      shellStyle: desk ? 'height: 100dvh; overflow-y: auto; display: flex; flex-direction: column; background: ' + t.bg + '; color: ' + t.ink + '; font-family: Alexandria, sans-serif; transition: background .4s ease, color .4s ease; --ac: ' + t.ac : 'display: contents; --ac: ' + t.ac,
      deskRow: !desk ? 'display: contents' : (idx >= 0 || S.screen === 'compare' || S.screen === 'garage')
        ? 'width: 100%; padding: 0 0 40px; box-sizing: border-box; display: flex; flex-direction: column; gap: 48px'
        : 'width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px 40px 0; box-sizing: border-box; display: flex; flex-direction: column; gap: 56px',
      deskLinks: [['الرئيسية', 'home'], ['سعّر عربية', 'car'], ['قارن عربيات', 'compare'], ['أسعار الزيرو', 'zero']].concat(isDealer ? [['عربياتي', 'garage']] : []).map(function (l) {
        var on = l[1] === 'zero' ? !!S.zp : (l[1] === 'car' ? idx >= 0 && !S.mine : l[1] === 'garage' ? S.screen === 'garage' || !!S.mine : S.screen === l[1]) && S.deskPage !== 'zero';
        return { label: l[0], cur: on ? 'page' : 'false', bg: on ? t.soft : 'transparent', fg: on ? t.ink : t.mute,
          go: function () { if (l[1] === 'garage') return openGarage(); if (l[1] === 'zero') { if (self.state.screen !== 'home') self.go('home', 'f'); openZp(); } else { self.setState({ sheet: null, zp: null }); if (self.state.mine) self.go('home', 'f'); self.go(l[1], 'f'); } } };
      }),
      deskAccount: me ? (P.showroom || displayName || 'حسابك') : 'ادخل',
      deskKey: S.deskPage === 'zero' ? 'zero' : idx >= 0 ? 'flow' : S.screen, deskHome: S.screen === 'home' && S.deskPage !== 'zero', deskFlow: idx >= 0, deskZeroPage: S.deskPage === 'zero',
      zeroEmpty: !!(desk && S.deskPage === 'zero' && S.zq.trim()) && false,
      zq: S.zq, onZq: function (e) { self.setState({ zq: e.target.value }); },
      deskHow: [
        { n: '01', title: 'صوّر واختار العربية', body: 'صوّر قدام وورا والعداد، واختار الماركة والموديل والسنة والفئة. البحث بيفهم لو كتبت غلط.' },
        { n: '02', title: 'علّم الدهان والميكانيكا', body: 'لف العربية ودوس على أي جزء: رش أو متغير. وعلّم أي عيب في الموتور أو الفتيس أو العفشة.' },
        { n: '03', title: 'خد السعر والإيصال', body: 'رينج عادل من إعلانات حقيقية شبهها، وأقصى سعر تشتري بيه، وإيصال تبعته للزبون على واتساب.' }
      ],
      deskSaved: S.screen === 'home' && S.deskPage !== 'zero' && !!me && (A.items || []).length > 0,
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
      openZero: function () { openZp(); },
      zeroAll: !desk || S.deskPage !== 'zero' ? [] : (function () {
        var out = [];
        Object.keys(CAT).forEach(function (mk) { Object.keys(CAT[mk]).forEach(function (md) { var c = CAT[mk][md]; if (c.zero) out.push({ mk: mk, md: md, c: c, name: mk + ' ' + md }); }); });
        var zq = S.zq.trim();
        var list = zq ? Component.fuzzy(zq, out, function (z) { return z.name; }).map(function (h) { return h.item; }) : out.sort(function (a, b) { return a.name.localeCompare(b.name); });
        return list.map(function (z) {
          var y = z.c.years[z.c.years.length - 1];
          return { name: z.name + ' ' + y, n: fmt(z.c.n || 0), price: fmt(z.c.zero), go: function () { self.setCar({ make: z.mk, model: z.md, year: y, trim: z.c.trims[0] }, 0); } };
        });
      })(),
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
          go: function () { if (okUrl(cp.url) && window.open) window.open(cp.url, '_blank', 'noopener'); } };
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
      askTxt: fmt(r5(finalHi * 1.03)), targetTxt: fmt(r5((finalLo + finalHi) / 2)),
      maxBuyTxt: fmt(r5((finalLo + finalHi) / 2 - S.margin)),
      histLine: hist.line, histArea: hist.area, histX: hist.x, histY: hist.y, histLabels: hist.labels,
      histTop: hist.top, histTopY: hist.topY, histChange: hist.change, histAria: hist.aria,
      issues: (info.issues || (Component.issuesFor && Component.issuesFor(car.make, car.model)) || Component.GENERIC_ISSUES).map(function (it) {
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
      waHref: 'https://wa.me/?text=' + encodeURIComponent('تسعير سعرلي: ' + carName + '، ' + fmt(S.km) + ' كم\nالسعر العادل: ' + fmt(finalLo) + ' – ' + fmt(finalHi) + ' جنيه' + (S.hideBuy || !isDealer ? '' : '\nأقصى سعر شرا: ' + fmt(r5((finalLo + finalHi) / 2 - S.margin))) + ((P.showroom || P.name) ? '\n— ' + (P.showroom || P.name) + (P.phone ? '، ' + P.phone : '') : '') + '\n' + siteUrl),
      carName: carName, carShort: carShort, nComps: nComps, compsBtn: 'شوف الـ ' + nComps + ' عربية',
      confTxt: nComps === 0 ? 'ثقة ' + conf + '. مفيش إعلانات قريبة للعربية دي دلوقتي.' : 'ثقة ' + conf + '. قارنّا بـ ' + nComps + ' عربية من نفس الفئة وعدادها قريب، آخر 60 يوم.' + (known ? ' وشلنا الإعلانات اللي أسعارها شاذة.' : ' الموديل ده مش عندنا كفاية، فالرينج أعرض.'),
      axisLo: fmt(lo), axisHi: fmt(hi),
      hasAi: !!aiQ, aiMid: aiQ ? fmt(aiQ.mid) : '',
      aiSub: !aiQ ? '' : 'اتعلّم من ' + fmt(aiQ.n_train || 0) + ' إعلان إزاي السعر بيتغيّر مع الموديل والسنة والعداد والفئة. '
        + (aiQ.weight >= 1 && !nComps ? 'مفيش إعلانات قريبة كفاية، فده تقدير تقريبي منه، والرينج واسع على قد غلطه.' : aiQ.weight === 0 ? 'للموديل ده لسه مش أدق من الإعلانات القريبة، فبيراجع السعر بس ومش داخل فيه.' : 'وزنه في السعر ' + Math.round(aiQ.weight * 100) + '٪، والباقي من العربيات اللي شبهها.')
        + (aiQ.error ? ' غلطه المعتاد حوالي ' + Math.round(aiQ.error * 100) + '٪.' : ''),
      aiWarn: !live || !live.lines ? '' : (live.lines.filter(function (l) { return l.indexOf('الإعلانات القريبة') === 0 || l.indexOf('فاعتمدنا على الإعلانات') > 0; })[0] || ''),
      detectTxt: S.vis.note ? S.vis.note : S.extras.length ? 'الصور معاك في التسعيرة دي.' : 'ارفع صور العربية كلها مرة واحدة، وإحنا نعرف الموديل، نقرا العداد، ونطلّع تقرير بحالتها والعيوب اللي باينة.',
      visCap: 'بنفحص ' + (S.vis.n > 1 ? nPics(S.vis.n) : 'الصورة') + '…',
      picsCount: S.extras.length ? nPics(S.extras.length) : 'أي عدد',
      pics: S.extras.map(function (u, i) { return { src: u, alt: 'صورة ' + (i + 1), rm: 'امسح صورة ' + (i + 1), remove: function () { var a = self.state.extras.slice(); a.splice(i, 1); self.setState({ extras: a }); } }; }),
      hasRep: !!(S.ai && S.ai.score != null),
      rep: !S.ai ? {} : (function () {
        var ai = S.ai, sc = ai.score;
        var tone = function (v) { return v >= 7 ? t.ink : v >= 5 ? t.mute : t.warn; };
        var setDef = function (i, ok) { var defs = self.state.ai.defs.map(function (d, j) { return j === i ? Object.assign({}, d, { ok: d.ok === ok ? null : ok }) : d; }); self.setState({ ai: Object.assign({}, self.state.ai, { defs: defs }) }); };
        var open = ai.defs.filter(function (d) { return d.ok == null; }).length;
        return {
          score: String(sc), from: 'حالتها من ' + nPics(ai.n),
          word: sc >= 8.5 ? 'ممتازة' : sc >= 7 ? 'نضيفة' : sc >= 5.5 ? 'متوسطة' : sc >= 4 ? 'محتاجة شغل' : 'تعبانة',
          areas: [['body', 'البودي'], ['interior', 'الدواخل'], ['tyres', 'الكاوتش'], ['lights', 'الفوانيس']].map(function (a) {
            var v = ai.areas[a[0]];
            return { label: a[1], pct: v ? Math.round(v.score * 10) : 0, score: v ? String(v.score) : '—', bar: v ? (v.score >= 5 ? t.ink : t.ac) : 'transparent',
              fg: v ? tone(v.score) : t.mute, hasNote: !!(v && v.note) || !v, note: v ? v.note : 'مش باين في الصور' };
          }),
          summary: ai.summary, hasDefs: ai.defs.length > 0,
          defsTitle: open ? 'اللي لقيناه في الصور. اللي توافق عليه بس يتخصم من السعر.' : 'اللي لقيناه في الصور.',
          defs: ai.defs.map(function (d, i) {
            var sv = SEV[d.sev] || SEV.light, amt = r1(mid * sv[0] / 100);
            return { what: d.what, pic: d.pic, hasPic: !!d.pic, op: d.ok === false ? 0.42 : 1,
              sub: d.ok === false ? 'مش هيتحسب' : 'عيب ' + sv[1] + (S.carSet && amt ? '، حوالي −' + fmt(amt) : ''), subFg: d.ok === true ? t.warn : t.mute,
              yesOn: d.ok === true ? 'true' : 'false', yesLabel: d.ok === true ? 'متخصم' : 'اخصمه',
              yesBg: d.ok === true ? t.ac : 'transparent', yesFg: d.ok === true ? '#FFFFFF' : t.ink, yesBd: d.ok === true ? t.ac : t.line2,
              noLabel: d.ok === false ? 'رجّعه' : 'مش عيب', noAria: (d.ok === false ? 'رجّع: ' : 'مش عيب: ') + d.what,
              yes: function () { setDef(i, true); }, no: function () { setDef(i, false); } };
          }),
          hasMissing: ai.missing.length > 0, missing: 'عشان التقرير يبقى أدق ضيف: ' + ai.missing.join('، ') + '.',
          again: function () { self.inspectPics(); }
        };
      })(),
      fields: [['make', 'الماركة', car.make], ['model', 'الموديل', car.model], ['year', 'السنة', String(car.year)], ['trim', 'الفئة', car.trim]].map(function (f) {
        var done = S.carSet || (S.picked || {})[f[0]];
        var shown = done ? f[2] : 'اختار';
        var flg = f[0] === 'make' && done ? logo(f[2]) : '';
        return { label: f[1], value: shown, logo: flg, hasLogo: !!flg, fg: done ? t.ink : t.mute, aria: f[1] + ': ' + shown + '، غيّر', open: function () { self.setState({ picker: f[0], pickOther: '', sheet: 'picker' }); } };
      }),
      addShot: function () { self.setState({ shotPick: 'extra' }); },
      shotOpen: !!S.shotPick,
      shotTitle: 'أضف صور العربية',
      onShotFile: function (e) {
        var files = [].slice.call(e.target.files || []).filter(function (f) { return /^image\//.test(f.type); });
        e.target.value = '';
        if (!files.length) return;
        var urls = files.map(function (f) { return URL.createObjectURL(f); });
        self.setState({ extras: self.state.extras.concat(urls).slice(0, 60), shotPick: null });
        self.queueInspect();
      },
      closeShot: function () { self.setState({ shotPick: null }); },
      shotKey: function (e) { if (e.key === 'Escape') self.setState({ shotPick: null }); },
      openAlerts: function () { self.setState({ sheet: 'alerts' }); },
      openComps: function () { self.setState({ sheet: 'comps' }); },
      closeSheet: function () { self.setState({ sheet: null, picker: null, item: null }); },
      sheetKey: function (e) { if (e.key === 'Escape') self.setState({ sheet: null, picker: null }); },
      sheetOpen: !!S.sheet,
      isItem: S.sheet === 'item' && !!S.item, it: itemView,
      isPicker: S.sheet === 'picker', isList: S.sheet === 'alerts' || S.sheet === 'zero' || S.sheet === 'comps',
      sheetTitle: S.sheet === 'item' && S.item ? S.item.name : S.sheet === 'picker' ? ({ make: 'اختار الماركة', model: 'اختار الموديل', year: 'اختار السنة', trim: 'اختار الفئة' }[S.picker]) : S.sheet === 'alerts' ? 'التنبيهات' : S.sheet === 'zero' ? 'أسعار الزيرو النهارده' : S.sheet === 'comps' ? ('العربيات اللي اتقارنت (' + nComps + ')') : '',
      sheetNote: S.sheet === 'item' && S.item ? S.item.kind + '، ' + S.item.when : S.sheet === 'comps' ? 'مقارنة بالرينج لعربية فابريكا' : S.sheet === 'zero' ? 'من هتلاقي' : '',
      pickOpts: pickOpts, pickTop: pickTop, pickHasTop: pickTop.length > 3,
      pickIsMake: S.picker === 'make', pickIsModel: S.picker === 'model', pickIsYear: S.picker === 'year', pickIsTrim: S.picker === 'trim',
      pickKey: 'pk-' + (S.picker || ''), pickAnim: S.pickDir === 'b' ? 'enter-b' : 'enter-f',
      pickTyped: !!S.pickOther.trim(), pickShowCrumbs: S.picker !== 'make' || !!(S.picked || {}).make || S.carSet,
      pickCrumbs: (function () {
        var order2 = ['make', 'model', 'year', 'trim'], names = { make: 'الماركة', model: 'الموديل', year: 'السنة', trim: 'الفئة' }, pk = S.picked || {};
        var cur = order2.indexOf(S.picker);
        return order2.map(function (k, i) {
          var done = S.carSet || pk[k], isCur = k === S.picker, can = i <= cur || done;
          return { k: names[k], v: done && !isCur ? String(car[k]) : isCur ? '…' : '', cur: isCur ? 'step' : 'false', off: can ? undefined : true,
            bg: isCur ? t.ink : 'transparent', fg: isCur ? t.bg : done ? t.ink : t.mute, bd: isCur ? t.ink : t.line2,
            go: function () { if (can && !isCur) self.setState({ picker: k, pickOther: '', pickDir: i < cur ? 'b' : 'f' }); } };
        });
      })(),
      pickOther: S.pickOther, onPickOther: function (e) { self.setState({ pickOther: e.target.value }); },
      pickOtherEmpty: !S.pickOther.trim(), pickOtherOp: S.pickOther.trim() ? 1 : 0.4,
      pickOtherAria: 'حاجة تانية مش في القايمة', pickOtherPh: 'مش في القايمة؟ اكتبها…',
      pickNone: !!S.pickOther.trim() && pickOpts.length === 0,
      pickOtherKey: function (e) { if (e.key === 'Enter') { e.preventDefault(); useOther(); } },
      usePickOther: function () { useOther(); },
      sheetRows: sheetRows,
      fold: ['how', 'hist', 'issues', 'ex'].reduce(function (o, k) { o[k] = function () { var f = Object.assign({}, self.state.folds); f[k] = !f[k]; self.setState({ folds: f }); }; return o; }, {}),
      foldOpen: ['how', 'hist', 'issues', 'ex'].reduce(function (o, k) { o[k] = S.folds[k] ? 'true' : 'false'; return o; }, {}),
      foldShow: ['how', 'hist', 'issues', 'ex'].reduce(function (o, k) { o[k] = !!S.folds[k]; return o; }, {}),
      foldRot: ['how', 'hist', 'issues', 'ex'].reduce(function (o, k) { o[k] = S.folds[k] ? 180 : 0; return o; }, {}),
      exCount: (function () { var n = Object.keys(S.ex || {}).filter(function (k) { return S.ex[k]; }).length + (S.exOther ? 1 : 0); return n ? '(' + n + ')' : 'شاسيه، عمود، دواخل…'; })(),
      visBusy: !!S.vis.busy, visIdle: !S.vis.busy,
      quoteLoading: quoteWait, quoteReady: !quoteWait,
      paintLoading: !S.paintReady, paintOp: S.paintReady ? 1 : 0,
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
<header style={css(`position: sticky; top: 0; z-index: 40; height: 72px; flex: none; display: flex; align-items: center; gap: 28px; padding: 0 40px; border-bottom: 1px solid ${v.t.line}; background: ${v.t.bg}`)}>
<button onClick={v.goHomeBack} aria-label="سعرلي، الرئيسية" style={css(`background: none; border: none; padding: 0; color: ${v.t.ink}; cursor: pointer`)}>
<span translate="no" style={css("font-family: 'Aref Ruqaa', serif; font-size: 40px; font-weight: 700; line-height: 1")}>سعرلي</span>
</button>
<nav aria-label="الأقسام" className="desk-nav" style={css("display: flex; gap: 4px; flex: 1")}>
{(v.deskLinks || []).map((dl, i1) => (<React.Fragment key={i1}>
<button className="press" onClick={dl.go} aria-current={dl.cur} style={css(`height: 40px; padding: 0 16px; border-radius: 12px; border: none; background: ${dl.bg}; color: ${dl.fg}; font-size: 14px; font-weight: 500`)}>{dl.label}</button>
</React.Fragment>))}
</nav>
<button className="press" onClick={v.toggleTheme} aria-label={v.themeLabel} style={css(`width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M15.5 11.2A7 7 0 0 1 6.8 2.5a7 7 0 1 0 8.7 8.7z" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button className="press" onClick={v.openAccount} style={css(`height: 40px; padding: 0 6px 0 16px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; gap: 10px; font-size: 14px`)}>
{(v.hasAvatar) && (<><img src={v.avatarSrc} alt="" width="28" height="28" style={css("width: 28px; height: 28px; border-radius: 50%; object-fit: cover")} /></>)}
{(v.hasInitial) && (<><span aria-hidden="true" style={css(`width: 28px; height: 28px; border-radius: 50%; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center`)}>{v.initial}</span></>)}
<span style={css("padding-left: 10px")}>{v.deskAccount}</span>
</button>
</header>
</>)}
<div style={css(v.deskRow)}>
<div className="app-col" dir="rtl" style={css(`width: 100%; max-width: 520px; height: 100dvh; margin: 0 auto; position: relative; overflow: hidden; color-scheme: ${v.scheme}; background: ${v.t.bg}; color: ${v.t.ink}; font-family: 'Alexandria', sans-serif; transition: background .4s ease, color .4s ease`)}>
{(v.isHome) && (<>
<div data-scr="home" className={v.enterCls} style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 60px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.openMenu} aria-label="القائمة" aria-haspopup="dialog" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M0 1h22M0 7h22M8 13h14" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<div style={css("display: flex; gap: 2px")}>
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
<div style={css(`display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 16px; border-radius: 14px; background: ${v.t.soft}`)}>
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke={v.t.mute} strokeWidth="1.4" fill="none"></circle><path d="M11 11l4 4" stroke={v.t.mute} strokeWidth="1.4"></path></svg>
<label htmlFor="q" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>دوّر على عربية تقارنها</label>
<input id="q" name="search" value={v.q} onChange={v.onQ} placeholder="قارن عربيات… مثلاً: كورولا 2020" autoComplete="off" style={css(`flex: 1; min-width: 0; height: 44px; border: none; background: transparent; color: ${v.t.ink}; caret-color: ${v.t.ac}; font-family: 'Alexandria', sans-serif; font-size: 15px`)} />
</div>
{(v.noQuery) && (<>
<div style={css("margin-top: 12px; display: flex; gap: 8px")}>
<button className="press" onClick={v.openZero} style={css(`flex: 1; min-width: 0; height: 46px; padding: 0 14px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500`)}>
<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" style={css("flex: none")}><path d="M2 9.5V2.5h7l9 9-7 7z" stroke={v.t.ac} strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><circle cx="6" cy="6" r="1.4" fill={v.t.ac}></circle></svg>
        سعر الزيرو
      </button>
{(v.isDealer) && (<>
<button className="press" onClick={v.openGarage} style={css(`flex: 1; min-width: 0; height: 46px; padding: 0 14px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500`)}>
<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" style={css("flex: none")}><path d="M2 18V8l8-5 8 5v10" stroke={v.t.ac} strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><path d="M5.5 18v-5h9v5M5.5 15.5h9" stroke={v.t.ac} strokeWidth="1.6" fill="none"></path></svg>
        عربياتي{(v.myHasAny) && (<><span className="num" style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.myTotal}</span></>)}
</button>
</>)}
</div>
</>)}
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
<button className="press" onClick={r.toggle} aria-pressed={r.pressed} style={css(`flex: none; min-height: 40px; padding: 0 16px; border-radius: 12px; border: 1px solid ${r.bd}; background: ${r.bg}; color: ${r.fg}; font-size: 13px`)}>{r.btn}</button>
</div>
</React.Fragment>))}
</div>
</>)}
{(v.noResults) && (<>
<p className="fade" aria-live="polite" style={css(`margin: 10px 4px 0; font-size: 13px; color: ${v.t.mute}; line-height: 1.7`)}>مفيش عربية بالاسم ده. جرّب اسم الماركة بس، أو الموديل من غير السنة.</p>
</>)}
{(v.canCompare) && (<>
<button className="press pop" onClick={v.goCompare} style={css(`margin-top: 12px; height: 48px; border-radius: 14px; border: 1px solid ${v.t.ink}; background: none; color: ${v.t.ink}; font-size: 15px; font-weight: 500`)}>قارن الـ {v.trayCount} عربيات</button>
</>)}
<section aria-labelledby="mkt" style={css("margin-top: 40px; display: flex; flex-direction: column")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 id="mkt" style={css(`margin: 0; font-size: 13px; font-weight: 500; color: ${v.t.mute}`)}>السوق النهارده</h2>
<button className="press" onClick={v.toggleMore} style={css(`min-height: 40px; padding: 0; background: none; border: none; color: ${v.t.mute}; font-size: 13px`)}>{v.moreLabel}</button>
</div>
{(v.moreOpen) && (<>
<div role="tablist" aria-label="نوع التغيير" className="fu" style={css("margin-top: 12px; display: flex; gap: 6px; overflow-x: auto")}>
{(v.mFilters || []).map((mf, i3) => (<React.Fragment key={i3}>
<button className="press" role="tab" aria-selected={mf.sel} onClick={mf.pick} style={css(`flex: none; min-height: 36px; padding: 0 14px; border-radius: 12px; border: 1px solid ${mf.bd}; background: ${mf.bg}; color: ${mf.fg}; font-size: 13px`)}>{mf.label}</button>
</React.Fragment>))}
</div>
</>)}
<ul style={css("list-style: none; margin: 6px 0 0; padding: 0")}>
{(v.market || []).map((mk, i4) => (<React.Fragment key={i4}>
<li style={css(`border-bottom: 1px solid ${v.t.line}`)}>
<button className="press" onClick={mk.go} aria-label={mk.aria} style={css(`width: 100%; min-height: 60px; padding: 8px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right`)}>
<span style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css("font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{mk.name}</span>
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
{(v.hasRecent) && (<>
<section aria-labelledby="mine" style={css("margin-top: 36px; display: flex; flex-direction: column")}>
<h2 id="mine" style={css(`margin: 0 0 4px; font-size: 13px; font-weight: 500; color: ${v.t.mute}`)}>تسعيراتك</h2>
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
</>)}
</main>
{(v.installShow) && (<>
<div className="fu" role="region" aria-label="نزّل الأبلكيشن" style={css(`flex: none; margin: 0 12px 8px; padding: 10px 10px 10px 14px; border-radius: 16px; background: ${v.t.soft}; border: 1px solid ${v.t.line}; display: flex; align-items: center; gap: 12px`)}>
<img src="/icon-192.png" alt="" width="40" height="40" style={css("flex: none; width: 40px; height: 40px; border-radius: 10px")} />
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
<span style={css("font-size: 14px; font-weight: 600")}>نزّل سعرلي على موبايلك</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.5`)}>{v.installSub}</span>
</span>
<button className="press" onClick={v.doInstall} style={css(`flex: none; height: 36px; padding: 0 14px; border-radius: 9px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 13px; font-weight: 600`)}>{v.installBtn}</button>
<button className="press" onClick={v.hideInstall} aria-label="مش دلوقتي" style={css(`flex: none; width: 32px; height: 36px; background: none; border: none; color: ${v.t.mute}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
<svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.6"></path></svg>
</button>
</div>
</>)}
<footer style={css(`flex: none; padding: 10px 20px 24px; background: ${v.t.bg}; border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.goCar} style={css(`width: 100%; height: 54px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px`)}>
<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 4h4l2-3h6l2 3h4v11H1z" stroke="currentColor" strokeWidth="1.5" fill="none"></path><circle cx="10" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.5" fill="none"></circle></svg>
      سعّر عربية
    </button>
</footer>
</div>
</>)}
{(v.isFlow) && (<>
<div data-scr="flow" style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 64px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.back} aria-label="رجوع" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button onClick={v.goHomeTop} aria-label="سعرلي، الرئيسية" translate="no" style={css(`background: none; border: none; padding: 0 8px; color: ${v.t.ink}; cursor: pointer; font-family: 'Aref Ruqaa', serif; font-size: 26px; font-weight: 700; line-height: 1.4`)}>سعرلي</button>
<span style={css("width: 44px")} aria-hidden="true"></span>
</header>
<ol aria-label={v.flowAria} style={css("list-style: none; margin: 0; padding: 2px 20px 0; flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px")}>
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
<div style={css("display: flex; flex-direction: column; gap: 12px")}>
<div style={css("display: flex; justify-content: space-between; align-items: baseline; gap: 12px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>صور العربية</span>
<span className="num" style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.picsCount}</span>
</div>
<div style={css("display: flex; gap: 8px; overflow-x: auto; margin: 0 -20px; padding: 0 20px 2px; scrollbar-width: none")}>
<button className="press" onClick={v.addShot} aria-label="أضف صور للعربية" style={css(`flex: none; width: 84px; height: 84px; border: 1px dashed ${v.t.edge}; border-radius: 10px; background: transparent; color: ${v.t.ink}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; font-size: 12px; padding: 0`)}>
<svg width="22" height="18" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 4h4l2-3h6l2 3h4v11H1z" stroke="currentColor" strokeWidth="1.2" fill="none"></path><path d="M10 6v6M7 9h6" stroke={v.t.ac} strokeWidth="1.5" strokeLinecap="round"></path></svg>
            أضف صور
          </button>
{(v.pics || []).map((pc, i7) => (<React.Fragment key={i7}>
<div style={css(`flex: none; position: relative; width: 84px; height: 84px; border-radius: 10px; overflow: hidden; background: ${v.t.soft}`)}>
<img src={pc.src} alt={pc.alt} style={css("width: 100%; height: 100%; object-fit: cover")} />
<button className="press" onClick={pc.remove} aria-label={pc.rm} style={css("position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; border: none; background: rgba(0,0,0,0.66); color: #FFFFFF; font-size: 15px; line-height: 1; padding: 0")}>×</button>
</div>
</React.Fragment>))}
</div>
{(v.visBusy) && (<><div style={css(`padding: 6px 0; display: flex; justify-content: center; color: ${v.t.mute}`)}><div className="ld" role="status"><svg width="132" height="40" viewBox="0 0 132 40" aria-hidden="true"><path className="wind" d="M112 13h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind b" d="M116 19h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind c" d="M110 25h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><g className="body"><path d="M8 28V23Q10 19 18 18L32 16L44 9Q54 5.5 70 6.5Q82 7.5 90 15L104 17Q110 18 111 22V28" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><path d="M8 28H17M37 28H82M102 28H111" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path><path d="M47 15L52 10Q58 8 66 8.5V15ZM70 15V8.7Q79 9.5 84 15Z" fill="currentColor" opacity=".25"></path><circle className="lamp" cx="10.5" cy="21.5" r="1.8" fill={v.t.ac}></circle></g><g className="wh"><circle cx="27" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M27 22.5v11M21.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><g className="wh"><circle cx="92" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M92 22.5v11M86.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><path className="road" d="M0 37.5H132" stroke={v.t.ac} strokeWidth="1.4" strokeLinecap="round"></path></svg><span className="cap">{v.visCap}</span></div></div></>)}
{(v.visIdle) && (<><p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>{v.detectTxt}</p></>)}
{(v.hasRep) && (<>
<section className="fu" aria-label="تقرير حالة العربية من الصور" style={css(`border: 1px solid ${v.t.line2}; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 14px`)}>
<div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
<div style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.rep.from}</span>
<span style={css("font-size: 17px; font-weight: 600")}>{v.rep.word}</span>
</div>
<span className="num" dir="ltr" style={css("flex: none; font-size: 46px; font-weight: 300; line-height: .9")}>{v.rep.score}<span style={css(`font-size: 15px; color: ${v.t.mute}`)}>/10</span></span>
</div>
<dl style={css("margin: 0; display: flex; flex-direction: column; gap: 9px")}>
{(v.rep.areas || []).map((ar, i8) => (<React.Fragment key={i8}>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<div style={css("display: flex; align-items: center; gap: 10px")}>
<dt style={css("flex: none; width: 58px; font-size: 13px")}>{ar.label}</dt>
<span aria-hidden="true" style={css(`flex: 1; height: 4px; border-radius: 2px; background: ${v.t.line}; overflow: hidden; display: flex`)}><span className="grow" style={css(`width: ${ar.pct}%; background: ${ar.bar}`)}></span></span>
<dd className="num" style={css(`margin: 0; flex: none; width: 30px; text-align: left; font-size: 13px; color: ${ar.fg}`)}>{ar.score}</dd>
</div>
{(ar.hasNote) && (<><span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>{ar.note}</span></>)}
</div>
</React.Fragment>))}
</dl>
<p style={css("margin: 0; font-size: 14px; line-height: 1.8")}>{v.rep.summary}</p>
{(v.rep.hasDefs) && (<>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>{v.rep.defsTitle}</span>
<ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
{(v.rep.defs || []).map((df, i9) => (<React.Fragment key={i9}>
<li style={css(`display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid ${v.t.line}; opacity: ${df.op}; transition: opacity .25s ease`)}>
{(df.hasPic) && (<><img src={df.pic} alt="" style={css("flex: none; width: 44px; height: 44px; border-radius: 8px; object-fit: cover")} /></>)}
<div style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
<span style={css("font-size: 13px; line-height: 1.5")}>{df.what}</span>
<span className="num" style={css(`font-size: 12px; color: ${df.subFg}`)}>{df.sub}</span>
</div>
<button className="press" onClick={df.yes} aria-pressed={df.yesOn} style={css(`flex: none; height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid ${df.yesBd}; background: ${df.yesBg}; color: ${df.yesFg}; font-size: 12px; font-weight: 600`)}>{df.yesLabel}</button>
<button className="press" onClick={df.no} aria-label={df.noAria} style={css(`flex: none; height: 34px; padding: 0 6px; border: none; background: none; color: ${v.t.mute}; font-size: 12px`)}>{df.noLabel}</button>
</li>
</React.Fragment>))}
</ul>
</div>
</>)}
{(v.rep.hasMissing) && (<><p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>{v.rep.missing}</p></>)}
<div style={css("display: flex; justify-content: space-between; align-items: center; gap: 12px")}>
<span style={css(`font-size: 11px; color: ${v.t.mute}; line-height: 1.6`)}>ده اللي باين في الصور بس. الموتور والفتيس والشاسيه محتاجين كشف.</span>
<button className="press" onClick={v.rep.again} style={css(`flex: none; min-height: 34px; padding: 0; border: none; background: none; color: ${v.t.ink}; font-size: 12px; text-decoration: underline; text-underline-offset: 4px`)}>افحص تاني</button>
</div>
</section>
</>)}
</div>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px")}>
{(v.fields || []).map((fd, i10) => (<React.Fragment key={i10}>
<div style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{fd.label}</span>
<button className="press" onClick={fd.open} aria-haspopup="dialog" aria-label={fd.aria} style={css(`height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0; border: none; border-bottom: 1px solid ${v.t.edge}; background: none; color: ${v.t.ink}; font-size: 16px; text-align: right; min-width: 0`)}>
<span style={css("display: flex; align-items: center; gap: 8px; min-width: 0")}>
{(fd.hasLogo) && (<><span aria-hidden="true" style={css("flex: none; width: 34px; height: 26px; border-radius: 7px; background: #FFFFFF; display: flex; align-items: center; justify-content: center")}><img src={fd.logo} alt="" style={css("max-width: 28px; max-height: 19px; object-fit: contain")} /></span></>)}
<span style={css(`overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${fd.fg}`)}>{fd.value}</span>
</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css("flex: none")}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
</div>
</React.Fragment>))}
<label style={css(`grid-column: span 2; display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: ${v.t.mute}`)}>العداد (كم)
          <input name="km" autoComplete="off" inputMode="numeric" aria-invalid={v.kmErr} aria-describedby="kmErr" value={v.kmInput} placeholder="مثلاً 85,000" onChange={v.onKm} style={css(`height: 46px; background: ${v.t.bg}; color: ${v.t.ink}; border: none; border-bottom: 1px solid ${v.kmBorder}; font-family: 'Alexandria', sans-serif; font-size: 22px; font-weight: 300; padding: 0; direction: ltr; text-align: right`)} />
{(v.kmErr) && (<><span id="kmErr" role="alert" style={css(`font-size: 12px; color: ${v.t.warn}`)}>اكتب العداد بالكيلومتر، مثلاً 85,000. من غيره السعر مش هيبقى دقيق.</span></>)}
</label>
</div>
<div style={css(`display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: ${v.t.soft}`)}>
<label htmlFor="agency" style={css("display: flex; justify-content: space-between; align-items: baseline; font-size: 13px")}>
<span>صيانات توكيل لحد كام كم؟</span>
<span style={css("font-size: 17px; font-weight: 500; direction: ltr")}>{v.agencyTxt}</span>
</label>
<input id="agency" type="range" min="0" max={v.agencyMax} step="10000" value={v.agencyKm} onChange={v.onAgency} disabled={v.agencyOff} style={css(`width: 100%; height: 30px; accent-color: ${v.t.ink}; direction: ltr; opacity: ${v.agencyOp}; transition: opacity .3s ease`)} />
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>{v.agencyHint}</span>
</div>
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.carNext} style={css(`width: 100%; height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600; opacity: ${v.carNextOp}`)}>{v.carNextLabel}</button>
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
<div style={css("position: relative; align-self: stretch; display: flex; justify-content: center")}>
{(v.paintLoading) && (<><div style={css(`position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: ${v.t.mute}; pointer-events: none`)}><div className="ld" role="status"><svg width="132" height="40" viewBox="0 0 132 40" aria-hidden="true"><path className="wind" d="M112 13h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind b" d="M116 19h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind c" d="M110 25h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><g className="body"><path d="M8 28V23Q10 19 18 18L32 16L44 9Q54 5.5 70 6.5Q82 7.5 90 15L104 17Q110 18 111 22V28" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><path d="M8 28H17M37 28H82M102 28H111" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path><path d="M47 15L52 10Q58 8 66 8.5V15ZM70 15V8.7Q79 9.5 84 15Z" fill="currentColor" opacity=".25"></path><circle className="lamp" cx="10.5" cy="21.5" r="1.8" fill={v.t.ac}></circle></g><g className="wh"><circle cx="27" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M27 22.5v11M21.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><g className="wh"><circle cx="92" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M92 22.5v11M86.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><path className="road" d="M0 37.5H132" stroke={v.t.ac} strokeWidth="1.4" strokeLinecap="round"></path></svg><span className="cap">بنجهّز العربية…</span></div></div></>)}
<canvas ref={v.paintRef} width="350" height="240" role="img" aria-label="عربية 3D: لفّها بصباعك ودوس على أي جزء" style={css(`width: 100%; max-width: 560px; height: clamp(200px, 58vw, 300px); display: block; position: relative; flex: none; align-self: center; touch-action: none; cursor: grab; opacity: ${v.paintOp}; transition: opacity .4s ease`)}></canvas>
</div>
</>)}
{(v.noGl) && (<>
<p style={css(`margin: 0; padding: 20px 0; font-size: 13px; color: ${v.t.mute}; text-align: center`)}>الجهاز ده مش بيعرض 3D. علّم على الأجزاء من القايمة تحت.</p>
</>)}
<div style={css("display: flex; align-items: center; justify-content: space-between; gap: 10px")}>
<p aria-live="polite" style={css(`margin: 0; font-size: 13px; color: ${v.t.mute}`)}>{v.paintLine}</p>
<button className="press" onClick={v.toggleSpin} style={css(`flex: none; min-height: 36px; padding: 0 14px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; font-size: 12px`)}>{v.spinLabel}</button>
</div>
<div role="group" aria-label="اختيارات سريعة" style={css("display: flex; gap: 8px; overflow-x: auto; margin: 6px -20px 0; padding: 2px 20px 4px; scrollbar-width: none")}>
{(v.presets || []).map((ps, i11) => (<React.Fragment key={i11}>
<button className="press" onClick={ps.pick} aria-pressed={ps.pressed} title={ps.sub} style={css(`flex: none; min-height: 40px; padding: 0 16px; border-radius: 12px; border: 1px solid ${ps.bd}; background: ${ps.bg}; color: ${ps.fg}; font-size: 13px; white-space: nowrap`)}>{ps.label}</button>
</React.Fragment>))}
<button className="press" onClick={v.resetAll} style={css(`flex: none; min-height: 40px; padding: 0 14px; border-radius: 12px; border: none; background: none; color: ${v.t.mute}; font-size: 13px; white-space: nowrap`)}>ريست</button>
</div>
<div style={css(`border-top: 1px solid ${v.t.line}; margin-top: 8px`)}>
<button className="press" onClick={v.fold.ex} aria-expanded={v.foldOpen.ex} style={css(`width: 100%; min-height: 52px; padding: 0; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: ${v.t.ink}; font-size: 14px; text-align: right`)}>
<span>عيوب تانية في البودي <span style={css(`color: ${v.t.mute}; font-size: 12px`)}>{v.exCount}</span></span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.foldRot.ex}deg); transition: transform .25s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.foldShow.ex) && (<>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 10px; padding-bottom: 12px")}>
<div style={css("display: flex; gap: 8px; flex-wrap: wrap")}>
{(v.extras || []).map((x, i12) => (<React.Fragment key={i12}>
<button className="press" onClick={x.toggle} aria-pressed={x.on} style={css(`min-height: 40px; padding: 0 16px; border-radius: 12px; border: 1px solid ${x.bd}; background: ${x.bg}; color: ${x.fg}; font-size: 13px`)}>{x.label}</button>
</React.Fragment>))}
<button className="press" onClick={v.toggleExOther} aria-pressed={v.exOtherStr} style={css(`min-height: 40px; padding: 0 16px; border-radius: 12px; border: 1px dashed ${v.t.edge}; background: ${v.exOtherBg}; color: ${v.exOtherFg}; font-size: 13px`)}>حاجة تانية</button>
</div>
{(v.exOther) && (<>
<input className="fade" name="paint_other" autoComplete="off" aria-label="إيه اللي متدهن أو متغير؟" placeholder="مثلاً: سقف الشنطة من جوه…" style={css(`height: 44px; margin-top: 4px; background: ${v.t.soft}; color: ${v.t.ink}; border: none; border-radius: 10px; padding: 0 10px; font-family: 'Alexandria', sans-serif; font-size: 14px`)} />
</>)}
</div>
</>)}
</div>
<button className="press" onClick={v.toggleParts} aria-expanded={v.partsStr} style={css(`min-height: 44px; display: flex; align-items: center; justify-content: space-between; background: none; border: none; border-top: 1px solid ${v.t.line}; color: ${v.t.ink}; font-size: 13px; padding: 0`)}>
<span>قايمة الأجزاء (لو اللمس على العربية صعب)</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.partsRot}deg); transition: transform .3s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.partsOpen) && (<>
<div className="fu" style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px")}>
{(v.faces || []).map((f, i13) => (<React.Fragment key={i13}>
<button className="press" onClick={f.cycle} aria-label={f.aria} style={css(`min-height: 44px; padding: 4px 6px; border-radius: 10px; border: 1px solid ${f.bd}; background: ${f.bg}; color: ${f.fg}; font-size: 12px; line-height: 1.3; transition: background .3s ease`)}>{f.full}</button>
</React.Fragment>))}
</div>
</>)}
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.goMech} style={css(`width: 100%; height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600`)}>التالي: الميكانيكا</button>
</footer>
</div>
</>)}
{(v.isMech) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 8px; display: flex; flex-direction: column")}>
<h1 style={css("margin: 0 0 4px; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>الميكانيكا</h1>
<p style={css(`margin: 0 0 12px; font-size: 13px; color: ${v.t.mute}`)}>افتح أي بند وعلّم على الحاجة اللي محتاجة تتغير بس. {v.mechCostNote}</p>
{(v.cats || []).map((c, i14) => (<React.Fragment key={i14}>
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
{(c.parts || []).map((pt, i15) => (<React.Fragment key={i15}>
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
<button className="press" onClick={v.goResult} style={css(`width: 100%; height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600`)}>{v.mechNextLabel}</button>
</footer>
</div>
</>)}
{(v.isMySave) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 8px; display: flex; flex-direction: column; gap: 18px")}>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>{v.myTitle}</h1>
<p className="num" style={css(`margin: 0; font-size: 14px; color: ${v.t.mute}`)}>{v.myCarName}</p>
</div>
<div style={css("display: flex; flex-direction: column; gap: 8px")}>
<label htmlFor="myPrice" style={css(`font-size: 13px; color: ${v.t.mute}`)}>هتبيعها بكام</label>
<div style={css(`display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 16px; border-radius: 14px; background: ${v.t.soft}`)}>
<input id="myPrice" name="price" inputMode="numeric" autoComplete="off" value={v.myPrice} onChange={v.onMyPrice} placeholder="مثلاً 950,000" aria-describedby="myPriceHint" style={css(`flex: 1; min-width: 0; height: 52px; border: none; background: transparent; color: ${v.t.ink}; caret-color: ${v.t.ac}; font-family: 'Alexandria', sans-serif; font-size: 20px; direction: ltr; text-align: right`)} />
<span style={css(`flex: none; font-size: 14px; color: ${v.t.mute}`)}>جنيه</span>
</div>
<span id="myPriceHint" style={css(`font-size: 12px; color: ${v.t.mute}`)}>ممكن تسيبه فاضي وتكتبه بعدين.</span>
{(v.myPriceBad) && (<><span role="alert" style={css(`font-size: 12px; color: ${v.t.warn}`)}>السعر ده مش مظبوط، اكتبه بالجنيه، مثلاً 950,000.</span></>)}
</div>
<div role="radiogroup" aria-label="حالة العربية" style={css("display: flex; flex-direction: column; gap: 8px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>الحالة</span>
<div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
{(v.myStatuses || []).map((ms, i16) => (<React.Fragment key={i16}>
<button className="press" role="radio" aria-checked={ms.sel} onClick={ms.pick} style={css(`height: 48px; border-radius: 14px; border: 1px solid ${ms.bd}; background: ${ms.bg}; color: ${ms.fg}; font-size: 14px; font-weight: 600`)}>{ms.label}</button>
</React.Fragment>))}
</div>
</div>
<div style={css("display: flex; flex-direction: column; gap: 8px")}>
<label htmlFor="myNotes" style={css(`font-size: 13px; color: ${v.t.mute}`)}>ملاحظات</label>
<textarea id="myNotes" name="notes" rows="4" value={v.myNotes} onChange={v.onMyNotes} placeholder="مثلاً: صاحبها التاني، الرخصة لآخر 2027، محجوزة لأستاذ أحمد…" style={css(`width: 100%; box-sizing: border-box; resize: vertical; min-height: 96px; padding: 12px 14px; border-radius: 14px; border: none; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; font-family: 'Alexandria', sans-serif; font-size: 14px; line-height: 1.7`)}></textarea>
</div>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}`)}>{v.myPhotoTxt}</p>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>عربياتك بتبان ليك انت بس. محدش تاني بيشوفها.</p>
</main>
<footer style={css("flex: none; padding: 12px 20px 26px")}>
<button className="press" onClick={v.saveMine} style={css(`width: 100%; height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600; opacity: ${v.mySaveOp}`)}>{v.mySaveLabel}</button>
</footer>
</div>
</>)}
{(v.isResult) && (<>
<div className={v.enterCls} style={css("flex: 1; min-height: 0; display: flex; flex-direction: column")}>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 16px 20px 8px; display: flex; flex-direction: column")}>
<span style={css("font-size: 14px")}>{v.carName}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; margin-top: 3px`)}>{v.kmTxt} كم، صيانات توكيل لحد {v.agencyTxt}</span>
{(v.quoteLoading) && (<>
<div style={css(`margin-top: 34px; min-height: 150px; display: flex; align-items: center; justify-content: center; color: ${v.t.mute}`)}><div className="ld" role="status"><svg width="132" height="40" viewBox="0 0 132 40" aria-hidden="true"><path className="wind" d="M112 13h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind b" d="M116 19h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind c" d="M110 25h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><g className="body"><path d="M8 28V23Q10 19 18 18L32 16L44 9Q54 5.5 70 6.5Q82 7.5 90 15L104 17Q110 18 111 22V28" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><path d="M8 28H17M37 28H82M102 28H111" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path><path d="M47 15L52 10Q58 8 66 8.5V15ZM70 15V8.7Q79 9.5 84 15Z" fill="currentColor" opacity=".25"></path><circle className="lamp" cx="10.5" cy="21.5" r="1.8" fill={v.t.ac}></circle></g><g className="wh"><circle cx="27" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M27 22.5v11M21.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><g className="wh"><circle cx="92" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M92 22.5v11M86.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><path className="road" d="M0 37.5H132" stroke={v.t.ac} strokeWidth="1.4" strokeLinecap="round"></path></svg><span className="cap">بنقارنها بالإعلانات الحقيقية…</span></div></div>
</>)}
{(v.quoteReady) && (<>
<div style={css("margin-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 0")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>السعر العادل</span>
<span style={css("display: flex; align-items: baseline; gap: 10px")}><span style={css(`font-size: 16px; color: ${v.t.mute}`)}>من</span><span style={css("font-size: 46px; font-weight: 200; direction: ltr; font-variant-numeric: tabular-nums")}>{v.shownLo}</span></span>
<span style={css("display: flex; align-items: baseline; gap: 10px")}><span style={css(`font-size: 16px; color: ${v.t.mute}`)}>لـ</span><span style={css("font-size: 46px; font-weight: 200; direction: ltr; font-variant-numeric: tabular-nums")}>{v.shownHi}</span></span>
<span style={css("font-size: 14px; margin-top: 2px")}>جنيه</span>
</div>
</>)}
<div dir="ltr" role="img" aria-label={v.stripAria} style={css("margin-top: 22px; position: relative; height: 44px; flex: none")}>
<div className="grow" style={css(`position: absolute; top: 21px; left: 0; right: 0; height: 1px; background: ${v.t.line2}`)}></div>
<div className="fade d4" style={css(`position: absolute; top: 12px; height: 19px; left: ${v.bandL}px; width: ${v.bandW}px; border: 1px solid ${v.t.ink}; border-radius: 10px; box-sizing: border-box`)}></div>
{(v.dots || []).map((d, i17) => (<React.Fragment key={i17}>
<span className="pop" style={css(`position: absolute; top: 18px; left: ${d.x}px; width: 7px; height: 7px; border-radius: 50%; background: ${d.c}; animation-delay: ${d.delay}s`)}></span>
</React.Fragment>))}
<span style={css(`position: absolute; top: 33px; left: 0; font-size: 11px; color: ${v.t.mute}`)}>{v.axisLo}</span>
<span style={css(`position: absolute; top: 33px; right: 0; font-size: 11px; color: ${v.t.mute}`)}>{v.axisHi}</span>
</div>
<p style={css(`margin: 8px 0 0; font-size: 12px; color: ${v.t.mute}; text-align: center; line-height: 1.7`)}>{v.confTxt}</p>
{(v.isUser) && (<>
<section aria-labelledby="deal-u" style={css("margin-top: 34px; display: flex; flex-direction: column; gap: 12px")}>
<h2 id="deal-u" style={css("margin: 0; font-size: 17px; font-weight: 600")}>هتعمل بيها إيه؟</h2>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
<div style={css(`display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 14px; background: ${v.t.ink}; color: ${v.t.bg}`)}>
<span style={css("font-size: 12px; opacity: .8")}>لو بتبيعها، اعرضها بـ</span>
<span className="num" style={css("font-size: 20px; font-weight: 500; direction: ltr; text-align: right")}>{v.askTxt}</span>
</div>
<div style={css(`display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 14px; border: 1px solid ${v.t.line2}`)}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>لو بتشتريها، فاصل لحد</span>
<span className="num" style={css("font-size: 20px; font-weight: 300; direction: ltr; text-align: right")}>{v.targetTxt}</span>
</div>
</div>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7`)}>الناس بتفاصل غالباً 3–5% من سعر العرض. المعارض بتشتري أقل من السعر ده عشان تكسب فيها.</p>
</section>
</>)}
{(v.isDealer) && (<>
<section aria-labelledby="deal" style={css("margin-top: 34px; display: flex; flex-direction: column; gap: 12px")}>
<h2 id="deal" style={css("margin: 0; font-size: 17px; font-weight: 600")}>تشتريها بكام؟</h2>
<label htmlFor="margin" style={css(`display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; color: ${v.t.mute}`)}>
<span>عايز تكسب فيها</span>
<span className="num" style={css(`font-size: 16px; color: ${v.t.ink}; direction: ltr`)}>{v.marginTxt}</span>
</label>
<input id="margin" type="range" min="0" max="150000" step="5000" value={v.margin} onChange={v.onMargin} style={css(`width: 100%; height: 30px; accent-color: ${v.t.ac}; direction: ltr`)} />
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
</>)}
<div style={css("margin-top: 30px")}>
<div style={css(`border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.fold.how} aria-expanded={v.foldOpen.how} style={css(`width: 100%; min-height: 56px; padding: 0; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: ${v.t.ink}; font-size: 15px; text-align: right`)}>
<span>إزاي حسبنا السعر</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.foldRot.how}deg); transition: transform .25s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.foldShow.how) && (<>
<div className="fu" style={css("padding-bottom: 18px")}>
{(v.hasAi) && (<>
<div className="fu" style={css(`margin-top: 14px; padding: 12px 14px; border-radius: 14px; border: 1px solid ${v.t.line2}; display: flex; gap: 12px; align-items: flex-start`)}>
<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={css("flex: none; margin-top: 2px")}><path d="M3 14a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"></path><path d="M10 14l3.6-5" stroke={v.t.ac} strokeWidth="1.8" strokeLinecap="round"></path><circle cx="10" cy="14" r="1.4" fill="currentColor"></circle></svg>
<div style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
<span style={css("font-size: 14px; font-weight: 500")}>الذكاء الاصطناعي توقّع <span className="num">{v.aiMid}</span> جنيه</span>
<span style={css(`font-size: 12px; line-height: 1.7; color: ${v.t.mute}`)}>{v.aiSub}</span>
{(v.aiWarn) && (<>
<span role="note" style={css(`font-size: 12px; line-height: 1.7; color: ${v.t.warn}`)}>{v.aiWarn}</span>
</>)}
</div>
</div>
</>)}
<dl style={css("margin: 14px 0 0; display: flex; flex-direction: column")}>
{(v.rows || []).map((rw, i18) => (<React.Fragment key={i18}>
<div className="fu" style={css(`display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 11px 0; border-top: 1px solid ${v.t.line}; animation-delay: ${rw.delay}s`)}>
<dt style={css(`font-size: 13px; color: ${rw.fg}; display: flex; align-items: center; gap: 8px`)}><span style={css(`width: 8px; height: 8px; border-radius: 2px; flex: none; background: ${rw.sw}`)}></span>{rw.label}</dt>
<dd className="num" style={css(`margin: 0; font-size: 13px; color: ${rw.fg}; direction: ltr; white-space: nowrap`)}>{rw.val}</dd>
</div>
</React.Fragment>))}
</dl>
</div>
</>)}
</div>
<div style={css(`border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.fold.hist} aria-expanded={v.foldOpen.hist} style={css(`width: 100%; min-height: 56px; padding: 0; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: ${v.t.ink}; font-size: 15px; text-align: right`)}>
<span>السعر آخر 6 شهور</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.foldRot.hist}deg); transition: transform .25s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.foldShow.hist) && (<>
<div className="fu" style={css("padding-bottom: 18px")}>
<section aria-labelledby="hist" style={css(" display: flex; flex-direction: column; gap: 10px")}>
<div style={css("display: flex; justify-content: space-between; align-items: baseline")}>
<span id="hist" style={css(`font-size: 13px; color: ${v.t.mute}`)}>نص الرينج بالشهر</span>
<span className="num" style={css("font-size: 13px; color: #5B9CF5; direction: ltr")}>{v.histChange}</span>
</div>
<svg width="100%" viewBox="0 0 350 150" role="img" aria-label={v.histAria} style={css("display: block; overflow: visible; max-width: 560px; height: auto")}>
<path d="M0 120 H350" stroke={v.t.line} strokeWidth="1"></path>
<path d="M0 70 H350" stroke={v.t.line} strokeWidth="1" strokeDasharray="2 4"></path>
<path d={v.histArea} fill={v.t.soft}></path>
<path className="draw" d={v.histLine} stroke={v.t.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
<circle cx={v.histX} cy={v.histY} r="4.5" fill={v.t.ac}></circle>
{(v.histLabels || []).map((hl, i19) => (<React.Fragment key={i19}>
<text x={hl.x} y="142" fill={v.t.mute} fontSize="11" textAnchor="middle" fontFamily="Alexandria, sans-serif">{hl.m}</text>
</React.Fragment>))}
<text x="350" y={v.histTopY} fill={v.t.mute} fontSize="11" textAnchor="end" fontFamily="Alexandria, sans-serif" className="num">{v.histTop}</text>
</svg>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}`)}>نص الرينج لـ{v.carShort} بالشهر، من الإعلانات اللي اتقارنت.</p>
</section>
</div>
</>)}
</div>
<div style={css(`border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.fold.issues} aria-expanded={v.foldOpen.issues} style={css(`width: 100%; min-height: 56px; padding: 0; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: ${v.t.ink}; font-size: 15px; text-align: right`)}>
<span>اتأكد من دول في الموديل ده</span>
<svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" style={css(`transform: rotate(${v.foldRot.issues}deg); transition: transform .25s ease`)}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
{(v.foldShow.issues) && (<>
<div className="fu" style={css("padding-bottom: 18px")}>
<section aria-labelledby="issues" style={css(" display: flex; flex-direction: column")}>
<p style={css(`margin: 0 0 8px; font-size: 12px; color: ${v.t.mute}`)}>أشهر حاجات الملاك بيشتكوا منها. علّم على اللي فحصته.</p>
{(v.issues || []).map((is, i20) => (<React.Fragment key={i20}>
<label style={css(`display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-top: 1px solid ${v.t.line}; cursor: pointer`)}>
<input type="checkbox" checked={is.done} onChange={is.toggle} style={css(`flex: none; width: 20px; height: 20px; margin: 2px 0 0; accent-color: ${v.t.ac}`)} />
<span style={css("display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 14px; font-weight: 500")}>{is.name}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}; line-height: 1.6`)}>{is.how}</span>
</span>
</label>
</React.Fragment>))}
</section>
</div>
</>)}
</div>
</div>
</main>
<footer style={css(`flex: none; padding: 10px 20px 22px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid ${v.t.line}`)}>
<div style={css("display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 52px; gap: 8px")}>
<button className="press" onClick={v.openReceipt} style={css(`height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600`)}>إيصال التسعير</button>
<button className="press" onClick={v.openComps} style={css(`height: 52px; border-radius: 14px; background: none; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; font-size: 15px; font-weight: 500`)}>{v.compsBtn}</button>
<button className="press" onClick={v.doSave} aria-label={v.saveAria} aria-pressed={v.savePressed} style={css(`height: 52px; border-radius: 14px; background: none; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
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
<div data-scr="compare" className={v.enterCls} style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 64px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.goHomeBack} aria-label="رجوع" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button onClick={v.goHomeTop} aria-label="سعرلي، الرئيسية" translate="no" style={css(`background: none; border: none; padding: 0 8px; color: ${v.t.ink}; cursor: pointer; font-family: 'Aref Ruqaa', serif; font-size: 26px; font-weight: 700; line-height: 1.4`)}>سعرلي</button>
<span style={css("width: 44px")}></span>
</header>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 14px 20px 24px; display: flex; flex-direction: column; gap: 18px")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>مقارنة</h1>
{(v.cmp || []).map((cc, i21) => (<React.Fragment key={i21}>
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
<button className="press" onClick={v.priceFirstCmp} style={css(`height: 52px; flex: none; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>سعّر {v.firstCmpName}</button>
</main>
</div>
</>)}
{(v.isGarage) && (<>
<div data-scr="garage" className={v.enterCls} style={css("position: absolute; inset: 0; display: flex; flex-direction: column")}>
<header style={css("height: 64px; flex: none; padding: 0 12px; display: flex; align-items: center; justify-content: space-between")}>
<button className="press" onClick={v.goHomeBack} aria-label="رجوع" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
</button>
<button onClick={v.goHomeTop} aria-label="سعرلي، الرئيسية" translate="no" style={css(`background: none; border: none; padding: 0 8px; color: ${v.t.ink}; cursor: pointer; font-family: 'Aref Ruqaa', serif; font-size: 26px; font-weight: 700; line-height: 1.4`)}>سعرلي</button>
<span style={css("width: 44px")}></span>
</header>
<main style={css("flex: 1; min-height: 0; overflow-y: auto; padding: 10px 20px 24px; display: flex; flex-direction: column; gap: 14px")}>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<h1 style={css("margin: 0; font-family: 'Aref Ruqaa', serif; font-weight: 700; font-size: 40px; line-height: 1.1")}>عربياتي</h1>
{(v.myHasAny) && (<><p className="num" style={css(`margin: 0; font-size: 13px; color: ${v.t.mute}`)}>{v.mySummary}</p></>)}
{(v.myHasStock) && (<><p className="num" style={css(`margin: 0; font-size: 13px; color: ${v.t.mute}`)}>{v.myStockTxt}</p></>)}
</div>
{(v.myHasAny) && (<>
<div role="tablist" aria-label="الحالة" style={css("display: flex; gap: 6px; overflow-x: auto; flex: none")}>
{(v.myFilters || []).map((mf2, i22) => (<React.Fragment key={i22}>
<button className="press num" role="tab" aria-selected={mf2.sel} onClick={mf2.pick} style={css(`flex: none; min-height: 36px; padding: 0 14px; border-radius: 12px; border: 1px solid ${mf2.bd}; background: ${mf2.bg}; color: ${mf2.fg}; font-size: 13px`)}>{mf2.label}</button>
</React.Fragment>))}
</div>
</>)}
{(v.myLoadingList) && (<>
<div style={css(`padding: 30px 0; display: flex; justify-content: center; color: ${v.t.mute}`)}><span className="cap" style={css("font-size: 13px")}>بنجيب عربياتك…</span></div>
</>)}
{(v.myEmpty) && (<>
<div className="fu" style={css(`padding: 26px 18px; border-radius: 18px; background: ${v.t.soft}; display: flex; flex-direction: column; gap: 8px`)}>
<span style={css("font-size: 16px; font-weight: 600")}>لسه مضفتش ولا عربية</span>
<span style={css(`font-size: 13px; color: ${v.t.mute}; line-height: 1.8`)}>ضيف العربيات اللي عندك: البيانات والدهان والصور وسعرك، وغيّر حالتها لما تتحجز أو تتباع.</span>
</div>
</>)}
{(v.myFilterEmpty) && (<>
<p style={css(`margin: 6px 4px; font-size: 13px; color: ${v.t.mute}`)}>مفيش عربيات في الحالة دي.</p>
</>)}
<ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
{(v.myList || []).map((mc, i23) => (<React.Fragment key={i23}>
<li className="fu" style={css(`border-bottom: 1px solid ${v.t.line}; animation-delay: ${mc.delay}s`)}>
<button className="press" onClick={mc.go} aria-label={mc.aria} style={css(`width: 100%; min-height: 80px; padding: 10px 0; display: flex; align-items: center; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right; opacity: ${mc.op}`)}>
{(mc.hasCover) && (<><img src={mc.cover} alt="" width="72" height="54" style={css(`flex: none; width: 72px; height: 54px; border-radius: 10px; object-fit: cover; background: ${v.t.soft}`)} /></>)}
{(mc.noCover) && (<><span aria-hidden="true" style={css(`flex: none; width: 72px; height: 54px; border-radius: 10px; background: ${v.t.soft}; color: ${v.t.mute}; display: flex; align-items: center; justify-content: center`)}><svg width="30" height="14" viewBox="0 0 30 14" aria-hidden="true"><path d="M1 11V8.5Q2 6.5 5 6l5-1 4-3.5Q17 0.5 21 1q3 .5 5 4l2 .6q1 .4 1 2V11" stroke="currentColor" strokeWidth="1.2" fill="none"></path><circle cx="8" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="none"></circle><circle cx="23" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="none"></circle></svg></span></>)}
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{mc.name}</span>
<span className="num" style={css(`font-size: 12px; color: ${v.t.mute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{mc.sub}</span>
</span>
<span style={css("flex: none; display: flex; flex-direction: column; align-items: flex-start; gap: 5px")}>
<span className="num" style={css(`font-size: 15px; direction: ltr; opacity: ${mc.priceOp}`)}>{mc.price}</span>
<span style={css(`display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${mc.stColor}`)}><span aria-hidden="true" style={css(`width: 7px; height: 7px; border-radius: 50%; background: ${mc.stColor}`)}></span>{mc.stLabel}</span>
</span>
</button>
</li>
</React.Fragment>))}
</ul>
</main>
<footer style={css(`flex: none; padding: 10px 20px 24px; border-top: 1px solid ${v.t.line}`)}>
<button className="press" onClick={v.startMine} style={css(`width: 100%; height: 54px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 16px; font-weight: 600`)}>+ ضيف عربية</button>
</footer>
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
{(v.pickShowCrumbs) && (<>
<nav aria-label="خطوات اختيار العربية" style={css("display: flex; align-items: center; gap: 6px; overflow-x: auto; margin: -4px 0 2px; scrollbar-width: none")}>
{(v.pickCrumbs || []).map((pc, i24) => (<React.Fragment key={i24}>
<button className="press" onClick={pc.go} disabled={pc.off} aria-current={pc.cur} style={css(`flex: none; height: 32px; padding: 0 12px; border-radius: 9px; border: 1px solid ${pc.bd}; background: ${pc.bg}; color: ${pc.fg}; font-size: 12px; display: flex; align-items: center; gap: 6px; transition: background .25s ease, color .25s ease`)}>
<span style={css("opacity: .6")}>{pc.k}</span><span style={css("font-weight: 600; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{pc.v}</span>
</button>
</React.Fragment>))}
</nav>
</>)}
<div style={css(`display: flex; align-items: center; gap: 8px; height: 48px; padding: 0 14px; border-radius: 14px; background: ${v.t.soft}`)}>
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={css("flex: none")}><circle cx="7" cy="7" r="5.5" stroke={v.t.mute} strokeWidth="1.4" fill="none"></circle><path d="M11 11l4 4" stroke={v.t.mute} strokeWidth="1.4"></path></svg>
<input value={v.pickOther} onChange={v.onPickOther} onKeyDown={v.pickOtherKey} name="other_value" autoComplete="off" aria-label={v.pickOtherAria} placeholder={v.pickOtherPh} style={css(`flex: 1; min-width: 0; height: 44px; background: transparent; color: ${v.t.ink}; caret-color: ${v.t.ac}; border: none; font-family: 'Alexandria', sans-serif; font-size: 15px`)} />
{(v.pickTyped) && (<>
<button className="press pop" onClick={v.usePickOther} style={css(`flex: none; height: 34px; padding: 0 14px; border-radius: 9px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 13px; font-weight: 600`)}>استخدمها</button>
</>)}
</div>
{(v.pickNone) && (<>
<p aria-live="polite" style={css(`margin: 0 4px; font-size: 13px; color: ${v.t.mute}`)}>مش لاقيها في القايمة. دوس "استخدمها" وهنسعّر بالاسم ده.</p>
</>)}
<div key={v.pickKey} className={v.pickAnim} style={css("display: flex; flex-direction: column; gap: 14px")}>
{(v.pickIsMake) && (<>
{(v.pickHasTop) && (<>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>الأكتر انتشاراً</span>
<div style={css("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px")}>
{(v.pickTop || []).map((pt, i25) => (<React.Fragment key={i25}>
<button className="press fu" onClick={pt.pick} aria-pressed={pt.sel} aria-label={pt.label} style={css(`animation-delay: ${pt.delay}s; min-height: 84px; padding: 10px 4px 8px; border-radius: 16px; border: 1px solid ${pt.bd}; background: ${pt.bg}; color: ${pt.fg}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-width: 0`)}>
{(pt.hasLogo) && (<><span aria-hidden="true" style={css("width: 46px; height: 34px; border-radius: 10px; background: #FFFFFF; display: flex; align-items: center; justify-content: center")}><img src={pt.logo} alt="" loading="lazy" style={css("max-width: 38px; max-height: 24px; object-fit: contain")} /></span></>)}
{(pt.noLogo) && (<><span aria-hidden="true" style={css(`width: 46px; height: 34px; border-radius: 10px; background: ${v.t.line}; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; letter-spacing: .5px`)}>{pt.mono}</span></>)}
<span style={css("font-size: 12px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{pt.label}</span>
</button>
</React.Fragment>))}
</div>
<span style={css(`font-size: 12px; color: ${v.t.mute}; margin-top: 4px`)}>كل الماركات</span>
</>)}
<ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
{(v.pickOpts || []).map((po, i26) => (<React.Fragment key={i26}>
<li className="fu" style={css(`animation-delay: ${po.delay}s; border-bottom: 1px solid ${v.t.line}`)}>
<button className="press" onClick={po.pick} aria-pressed={po.sel} style={css(`width: 100%; min-height: 56px; padding: 6px 4px; display: flex; align-items: center; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right`)}>
{(po.hasLogo) && (<><span aria-hidden="true" style={css("flex: none; width: 42px; height: 30px; border-radius: 8px; background: #FFFFFF; display: flex; align-items: center; justify-content: center")}><img src={po.logo} alt="" loading="lazy" style={css("max-width: 34px; max-height: 21px; object-fit: contain")} /></span></>)}
{(po.noLogo) && (<><span aria-hidden="true" style={css(`flex: none; width: 42px; height: 30px; border-radius: 8px; background: ${v.t.line}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700`)}>{po.mono}</span></>)}
<span style={css("flex: 1; min-width: 0; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{po.label}</span>
<span className="num" style={css(`flex: none; font-size: 12px; color: ${v.t.mute}`)}>{po.count}</span>
{(po.on) && (<><svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" style={css("flex: none")}><path d="M1 6l5 5L15 1" stroke={v.t.ac} strokeWidth="2" fill="none"></path></svg></>)}
</button>
</li>
</React.Fragment>))}
</ul>
</>)}
{(v.pickIsModel) && (<>
<ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
{(v.pickOpts || []).map((po, i27) => (<React.Fragment key={i27}>
<li className="fu" style={css(`animation-delay: ${po.delay}s; border-bottom: 1px solid ${v.t.line}`)}>
<button className="press" onClick={po.pick} aria-pressed={po.sel} style={css(`width: 100%; min-height: 56px; padding: 6px 4px; display: flex; align-items: center; gap: 12px; background: none; border: none; color: ${v.t.ink}; text-align: right`)}>
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
<span style={css("font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{po.label}</span>
<span className="num" style={css(`font-size: 12px; color: ${v.t.mute}`)}>{po.sub}</span>
</span>
{(po.on) && (<><svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" style={css("flex: none")}><path d="M1 6l5 5L15 1" stroke={v.t.ac} strokeWidth="2" fill="none"></path></svg></>)}
<span aria-hidden="true" style={css(`flex: none; color: ${v.t.mute}`)}>‹</span>
</button>
</li>
</React.Fragment>))}
</ul>
</>)}
{(v.pickIsYear) && (<>
<div style={css("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px")}>
{(v.pickOpts || []).map((po, i28) => (<React.Fragment key={i28}>
<button className="press num fu" onClick={po.pick} aria-pressed={po.sel} style={css(`animation-delay: ${po.delay}s; height: 50px; border-radius: 14px; border: 1px solid ${po.bd}; background: ${po.bg}; color: ${po.fg}; font-size: 16px`)}>{po.label}</button>
</React.Fragment>))}
</div>
</>)}
{(v.pickIsTrim) && (<>
<ol style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px")}>
{(v.pickOpts || []).map((po, i29) => (<React.Fragment key={i29}>
<li className="fu" style={css(`animation-delay: ${po.delay}s`)}>
<button className="press" onClick={po.pick} aria-pressed={po.sel} style={css(`width: 100%; min-height: 62px; padding: 10px 14px; border-radius: 16px; border: 1px solid ${po.bd}; background: ${po.bg}; color: ${po.fg}; display: flex; align-items: center; gap: 12px; text-align: right`)}>
<span className="num" aria-hidden="true" style={css("flex: none; width: 28px; height: 28px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 13px; opacity: .8")}>{po.n}</span>
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
<span style={css("font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{po.label}</span>
<span style={css("font-size: 11px; opacity: .65")}>{po.sub}</span>
</span>
<span aria-hidden="true" style={css(`flex: none; width: 46px; height: 5px; border-radius: 3px; background: ${v.t.line}; overflow: hidden`)}><span className="grow" style={css(`display: block; height: 100%; width: ${po.level}%; background: ${v.t.ac}; transform-origin: right`)}></span></span>
</button>
</li>
</React.Fragment>))}
</ol>
</>)}
</div>
</>)}
{(v.isItem) && (<>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 14px")}>
<div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
<div style={css("display: flex; flex-direction: column; gap: 2px")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{v.it.priceLabel}</span>
<span className="num" style={css("font-size: 34px; font-weight: 300; direction: ltr; text-align: right")}>{v.it.price}</span>
</div>
<span className="num" style={css(`flex: none; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 12px; background: ${v.it.chipBg}; color: ${v.it.chipFg}; font-size: 14px; font-weight: 600; direction: ltr`)}>
<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true" style={css(`transform: rotate(${v.it.rot}deg)`)}><path d="M4.5 1L8 7H1z" fill="currentColor"></path></svg>{v.it.delta}
          </span>
</div>
<p style={css("margin: 0; font-size: 14px; line-height: 1.7")}>{v.it.story}</p>
<dl style={css("margin: 0; display: flex; flex-direction: column")}>
{(v.it.rows || []).map((ir, i30) => (<React.Fragment key={i30}>
<div style={css(`display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-top: 1px solid ${v.t.line}`)}>
<dt style={css(`font-size: 13px; color: ${v.t.mute}`)}>{ir.k}</dt>
<dd className="num" style={css("margin: 0; font-size: 13px; text-align: left")}>{ir.v}</dd>
</div>
</React.Fragment>))}
</dl>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
{(v.it.hasLink) && (<>
<a href={v.it.url} target="_blank" rel="noopener" className="press" style={css(`height: 50px; border-radius: 14px; background: ${v.t.ink}; color: ${v.t.bg}; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; text-decoration: none`)}>افتح الإعلان</a>
</>)}
<button className="press" onClick={v.it.price2} style={css(`height: 50px; border-radius: 14px; border: 1px solid ${v.t.ink}; background: ${v.it.priceBtnBg}; color: ${v.it.priceBtnFg}; font-size: 14px; font-weight: 600`)}>{v.it.priceBtnLabel}</button>
<button className="press" onClick={v.it.compare} style={css(`height: 50px; border-radius: 14px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; font-size: 14px`)}>ضيفها للمقارنة</button>
</div>
</div>
</>)}
{(v.isList) && (<>
<ul style={css("list-style: none; margin: 0; padding: 0")}>
{(v.sheetRows || []).map((sr, i31) => (<React.Fragment key={i31}>
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
{(v.myOpenOn) && (<>
<div style={css("position: absolute; inset: 0; z-index: 13")}>
<button className="fade" onClick={v.closeMy} aria-label="اقفل" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-label={v.myO.name} onKeyDown={v.myKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; max-height: 90%; overflow-y: auto; overscroll-behavior: contain; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 20px 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 40px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
{(v.myO.hasPhotos) && (<>
<div style={css("display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 -20px; padding: 0 20px")}>
{(v.myO.photos || []).map((mp, i32) => (<React.Fragment key={i32}>
<img src={mp.src} alt={mp.alt} style={css(`flex: none; width: 78%; max-width: 420px; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 14px; scroll-snap-align: center; background: ${v.t.soft}`)} />
</React.Fragment>))}
</div>
</>)}
{(v.myO.loading) && (<>
<div aria-hidden="true" style={css(`height: 120px; border-radius: 14px; background: ${v.t.soft}`)}></div>
</>)}
<div style={css("display: flex; flex-direction: column; gap: 2px")}>
<h2 style={css("margin: 0; font-size: 20px; font-weight: 600")}>{v.myO.name}</h2>
<span className="num" style={css("font-size: 30px; font-weight: 300; direction: ltr; text-align: right")}>{v.myO.price}</span>
</div>
<div role="radiogroup" aria-label="حالة العربية" style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
{(v.myO.statuses || []).map((os, i33) => (<React.Fragment key={i33}>
<button className="press" role="radio" aria-checked={os.sel} onClick={os.pick} style={css(`height: 44px; border-radius: 12px; border: 1px solid ${os.bd}; background: ${os.bg}; color: ${os.fg}; font-size: 14px; font-weight: 600`)}>{os.label}</button>
</React.Fragment>))}
</div>
<dl style={css("margin: 0; display: flex; flex-direction: column")}>
{(v.myO.rows || []).map((or, i34) => (<React.Fragment key={i34}>
<div style={css(`display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-top: 1px solid ${v.t.line}`)}>
<dt style={css(`flex: none; font-size: 13px; color: ${v.t.mute}`)}>{or.k}</dt>
<dd className="num" style={css("margin: 0; font-size: 13px; text-align: left; line-height: 1.7")}>{or.v}</dd>
</div>
</React.Fragment>))}
</dl>
{(v.myO.hasNotes) && (<>
<div style={css(`padding: 12px 14px; border-radius: 14px; background: ${v.t.soft}; display: flex; flex-direction: column; gap: 4px`)}>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>ملاحظات</span>
<p style={css("margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap")}>{v.myO.notes}</p>
</div>
</>)}
{(v.myO.adIdle) && (<>
<button className="press" onClick={v.myO.writeAd} style={css(`flex: none; height: 50px; border-radius: 14px; border: 1px solid ${v.t.ink}; background: none; color: ${v.t.ink}; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px`)}>
<svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 16l1-4L12.5 2.5l3 3L6 15z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"></path><path d="M10.5 4.5l3 3" stroke={v.t.ac} strokeWidth="1.4"></path></svg>
        اكتب إعلان للعربية دي
      </button>
</>)}
{(v.myO.adBusy) && (<>
<p role="status" style={css(`margin: 0; padding: 14px; border-radius: 14px; background: ${v.t.soft}; font-size: 14px; color: ${v.t.mute}; text-align: center`)}>بنكتب الإعلان من بيانات العربية وصورها…</p>
</>)}
{(v.myO.hasAd) && (<>
<div className="fu" style={css("flex: none; display: flex; flex-direction: column; gap: 10px")}>
<label htmlFor="adText" style={css(`font-size: 13px; color: ${v.t.mute}`)}>الإعلان. عدّل فيه براحتك وبعدين انسخه.</label>
<textarea id="adText" rows="11" value={v.myO.adText} onChange={v.myO.onAd} style={css(`width: 100%; box-sizing: border-box; resize: vertical; min-height: 220px; padding: 12px 14px; border-radius: 14px; border: none; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; font-family: 'Alexandria', sans-serif; font-size: 14px; line-height: 1.9`)}></textarea>
<div style={css("display: grid; grid-template-columns: 1.4fr 1fr; gap: 8px")}>
<button className="press" onClick={v.myO.copyAd} style={css(`height: 48px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600`)}>{v.myO.copyLabel}</button>
<button className="press" onClick={v.myO.writeAd} style={css(`height: 48px; border-radius: 14px; border: 1px solid ${v.t.line2}; background: none; color: ${v.t.ink}; font-size: 14px`)}>اكتب واحد تاني</button>
</div>
</div>
</>)}
{(v.myO.hasAdErr) && (<><p role="alert" style={css(`margin: 0; font-size: 13px; color: ${v.t.warn}; line-height: 1.7`)}>{v.myO.adErr}</p></>)}
<button className="press" onClick={v.myO.edit} style={css(`flex: none; height: 50px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>عدّل البيانات والسعر</button>
<div style={css("display: flex; justify-content: space-between")}>
<button className="press" onClick={v.myO.del} style={css(`height: 44px; background: none; border: none; color: ${v.myO.delFg}; font-size: 14px; padding: 0`)}>{v.myO.delLabel}</button>
<button className="press" onClick={v.closeMy} style={css(`height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 14px; padding: 0`)}>اقفل</button>
</div>
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
{(v.showBuyRow) && (<><div style={css("display: flex; justify-content: space-between; gap: 12px")}><dt style={css(`color: ${v.t.mute}`)}>أقصى سعر شرا</dt><dd className="num" style={css("margin: 0; direction: ltr")}>{v.maxBuyTxt}</dd></div></>)}
</dl>
{(v.hasFrom) && (<>
<div style={css(`display: flex; justify-content: space-between; gap: 12px; padding-top: 10px; border-top: 1px dashed ${v.t.line2}; font-size: 13px`)}>
<span style={css("font-weight: 500")}>{v.fromName}</span>
<span className="num" dir="ltr" style={css(`color: ${v.t.mute}`)}>{v.fromPhone}</span>
</div>
</>)}
{(v.isDealer) && (<>
<label style={css("display: flex; align-items: center; gap: 10px; font-size: 13px; min-height: 40px; cursor: pointer")}>
<input type="checkbox" checked={v.hideBuy} onChange={v.toggleHideBuy} style={css(`width: 18px; height: 18px; margin: 0; accent-color: ${v.t.ac}`)} />
        خبّي سعر الشرا لو هتبعته للزبون
      </label>
</>)}
</div>
<div style={css(`display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 6px 0 14px; border-radius: 12px; background: ${v.t.soft}`)}>
<span className="num" style={css("flex: 1; min-width: 0; font-size: 14px; direction: ltr; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{v.siteHost}</span>
<button className="press" onClick={v.copyLink} style={css(`height: 36px; padding: 0 14px; border-radius: 9px; border: 1px solid ${v.t.line2}; background: ${v.t.bg}; color: ${v.t.ink}; font-size: 13px`)}>{v.copyLabel}</button>
</div>
<a href={v.waHref} target="_blank" rel="noopener" className="press" style={css(`height: 52px; border-radius: 14px; background: ${v.t.ac}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 600; text-decoration: none`)}>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 16l1.2-3.6A7 7 0 1 1 5.6 15z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"></path></svg>
      ابعته واتساب
    </a>
<button className="press" onClick={v.closeReceipt} style={css(`height: 40px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>اقفل</button>
</section>
</div>
</>)}
{(v.zpOpen) && (<>
<div className="enter-f" key={v.zpKey} role="dialog" aria-modal="true" aria-labelledby="zp-t" onKeyDown={v.zpKeyDown} style={css(`position: absolute; inset: 0; z-index: 11; background: ${v.t.bg}; color: ${v.t.ink}; display: flex; flex-direction: column`)}>
<header style={css("flex: none; display: flex; align-items: center; gap: 6px; padding: 10px 10px 4px")}>
<button className="press" onClick={v.zpBack} aria-label={v.zpBackAria} style={css(`width: 44px; height: 44px; border: none; background: none; color: ${v.t.ink}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" fill="none"></path></svg>
</button>
<div style={css("flex: 1; min-width: 0; display: flex; flex-direction: column")}>
<span style={css(`font-size: 12px; color: ${v.t.mute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{v.zpCrumb}</span>
<h2 id="zp-t" style={css("margin: 0; font-size: 20px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{v.zpTitle}</h2>
</div>
<button className="press" onClick={v.zpClose} aria-label="اقفل أسعار الزيرو" style={css(`width: 44px; height: 44px; border: none; background: none; color: ${v.t.mute}; display: flex; align-items: center; justify-content: center; padding: 0`)}>
<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.6"></path></svg>
</button>
</header>
<div style={css("flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 6px 20px 28px; width: 100%; max-width: 760px; margin: 0 auto; box-sizing: border-box")}>
{(v.zpList) && (<>
<div style={css(`display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 14px; border-radius: 12px; background: ${v.t.soft}; margin: 4px 0 8px`)}>
<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke={v.t.mute} strokeWidth="1.4" fill="none"></circle><path d="M11 11l4 4" stroke={v.t.mute} strokeWidth="1.4"></path></svg>
<input name="zero_search" value={v.zpQ} onChange={v.onZpQ} aria-label={v.zpSearchPh} placeholder={v.zpSearchPh} autoComplete="off" style={css(`flex: 1; min-width: 0; height: 42px; border: none; background: transparent; color: ${v.t.ink}; font-family: 'Alexandria', sans-serif; font-size: 15px`)} />
</div>
{(v.zpLoading) && (<>
<div style={css(`padding: 48px 0; display: flex; justify-content: center; color: ${v.t.mute}`)}><div className="ld" role="status"><svg width="132" height="40" viewBox="0 0 132 40" aria-hidden="true"><path className="wind" d="M112 13h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind b" d="M116 19h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><path className="wind c" d="M110 25h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path><g className="body"><path d="M8 28V23Q10 19 18 18L32 16L44 9Q54 5.5 70 6.5Q82 7.5 90 15L104 17Q110 18 111 22V28" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"></path><path d="M8 28H17M37 28H82M102 28H111" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path><path d="M47 15L52 10Q58 8 66 8.5V15ZM70 15V8.7Q79 9.5 84 15Z" fill="currentColor" opacity=".25"></path><circle className="lamp" cx="10.5" cy="21.5" r="1.8" fill={v.t.ac}></circle></g><g className="wh"><circle cx="27" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M27 22.5v11M21.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><g className="wh"><circle cx="92" cy="28" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none"></circle><path d="M92 22.5v11M86.5 28h11" stroke="currentColor" strokeWidth="1"></path></g><path className="road" d="M0 37.5H132" stroke={v.t.ac} strokeWidth="1.4" strokeLinecap="round"></path></svg><span className="cap">بنجيب أسعار الزيرو…</span></div></div>
</>)}
{(v.zpRows || []).map((zr, i35) => (<React.Fragment key={i35}>
<button className="press" onClick={zr.go} style={css(`width: 100%; min-height: 64px; padding: 10px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; text-align: right`)}>
{(zr.hasLogo) && (<><span aria-hidden="true" style={css("flex: none; width: 44px; height: 32px; border-radius: 8px; background: #FFFFFF; display: flex; align-items: center; justify-content: center")}><img src={zr.logo} alt="" loading="lazy" style={css("max-width: 36px; max-height: 24px; object-fit: contain")} /></span></>)}
<span style={css("flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 15px; font-weight: 500")}>{zr.title}</span>
<span style={css(`font-size: 12px; color: ${v.t.mute}`)}>{zr.sub}</span>
</span>
<span style={css("flex: none; display: flex; align-items: center; gap: 10px")}>
<span style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 3px")}>
<span className="num" style={css("font-size: 15px; direction: ltr")}>{zr.right}</span>
<span className="num" style={css(`font-size: 12px; color: ${zr.rsColor}; direction: ltr`)}>{zr.rightSub}</span>
</span>
<span aria-hidden="true" style={css(`color: ${v.t.mute}`)}>‹</span>
</span>
</button>
</React.Fragment>))}
{(v.zpEmpty) && (<>
<p style={css(`margin: 18px 4px; font-size: 14px; color: ${v.t.mute}`)}>{v.zpEmptyTxt}</p>
</>)}
</>)}
{(v.zpDetail) && (<>
<section className="fu" style={css("display: flex; flex-direction: column; gap: 18px; padding-top: 8px")}>
<div style={css("display: flex; flex-direction: column; gap: 6px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>سعر الزيرو، موديل {v.zdYear}</span>
<span className="num" style={css("font-size: 44px; font-weight: 200; line-height: 1.15")}>{v.zdPrice} <span style={css(`font-size: 16px; color: ${v.t.mute}`)}>جنيه</span></span>
{(v.zdHasChange) && (<>
<span className="num" style={css(`font-size: 14px; color: ${v.zdChangeColor}`)}>{v.zdChange}</span>
</>)}
</div>
<div style={css("display: flex; flex-direction: column")}>
{(v.zdRows || []).map((zd, i36) => (<React.Fragment key={i36}>
<div style={css(`min-height: 50px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid ${v.t.line}; font-size: 14px`)}>
<span style={css(`color: ${v.t.mute}`)}>{zd.k}</span>
<span className="num" style={css("text-align: left")}>{zd.v}</span>
</div>
</React.Fragment>))}
</div>
{(v.zdHasHist) && (<>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<h3 style={css("margin: 0 0 4px; font-size: 15px; font-weight: 600")}>السعر اتغيّر إزاي</h3>
{(v.zdHist || []).map((zh, i37) => (<React.Fragment key={i37}>
<div style={css(`min-height: 40px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; border-bottom: 1px solid ${v.t.line}`)}>
<span style={css(`color: ${v.t.mute}`)}>{zh.date}</span>
<span className="num" style={css("direction: ltr")}>{zh.price} <span style={css(`color: ${zh.c}; margin-left: 8px`)}>{zh.d}</span></span>
</div>
</React.Fragment>))}
</div>
</>)}
<div style={css("display: flex; flex-direction: column; gap: 10px; margin-top: 4px")}>
<button className="press" onClick={v.zdPrice2} style={css(`height: 52px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600`)}>سعّر مستعملة منها</button>
{(v.zdHasUrl) && (<>
<a className="press" href={v.zdUrl} target="_blank" rel="noopener" style={css(`height: 52px; border-radius: 14px; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; font-size: 15px; display: flex; align-items: center; justify-content: center; text-decoration: none`)}>شوفها على {v.zdSource}</a>
</>)}
<button className="press" onClick={v.zdAlert} style={css(`min-height: 44px; border: none; background: none; color: ${v.t.mute}; font-size: 14px`)}>نبّهني لو سعرها اتغيّر</button>
</div>
</section>
</>)}
</div>
</div>
</>)}
{(v.shotOpen) && (<>
<div style={css("position: absolute; inset: 0; z-index: 12")}>
<button className="fade" onClick={v.closeShot} aria-label="اقفل" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.6); padding: 0")}></button>
<section className="rise" role="dialog" aria-modal="true" aria-labelledby="sh-t" onKeyDown={v.shotKey} style={css(`position: absolute; left: 0; right: 0; bottom: 0; background: ${v.t.bg}; border-radius: 22px 22px 0 0; padding: 10px 20px 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px`)}>
<span aria-hidden="true" style={css(`align-self: center; width: 36px; height: 4px; border-radius: 2px; background: ${v.t.line2}`)}></span>
<h2 id="sh-t" style={css("margin: 4px 0 2px; font-size: 18px; font-weight: 600")}>{v.shotTitle}</h2>
<label className="press" style={css(`position: relative; height: 54px; border-radius: 14px; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer`)}>
<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 4h4l2-3h6l2 3h4v11H1z" stroke="currentColor" strokeWidth="1.5" fill="none"></path><circle cx="10" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.5" fill="none"></circle></svg>
      افتح الكاميرا
      <input type="file" accept="image/*" capture="environment" onChange={v.onShotFile} aria-label="صوّر بالكاميرا" style={css("position: absolute; inset: 0; opacity: 0; cursor: pointer")} />
</label>
<label className="press" style={css(`position: relative; height: 54px; border-radius: 14px; border: 1px solid ${v.t.ink}; color: ${v.t.ink}; font-size: 16px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer`)}>
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" fill="none"></rect><circle cx="6" cy="6.5" r="1.6" fill="currentColor"></circle><path d="M1.5 14l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg>
      اختار من الصور
      <input type="file" accept="image/*" multiple={true} onChange={v.onShotFile} aria-label="اختار من الصور" style={css("position: absolute; inset: 0; opacity: 0; cursor: pointer")} />
</label>
<p style={css(`margin: 0; font-size: 12px; color: ${v.t.mute}; line-height: 1.7; text-align: center`)}>أي عدد من الصور: برّه، جوّه، العداد، الكاوتش، وأي عيب من قريب.</p>
<button className="press" onClick={v.closeShot} style={css(`min-height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>إلغاء</button>
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
{(v.waOn) && (<>
{(v.waIdle) && (<>
<button className="press" onClick={v.waGo} style={css("height: 54px; border-radius: 14px; border: none; background: #25D366; color: #000000; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px")}>
<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"></path></svg>
              ادخل برقمك على الواتساب
            </button>
</>)}
{(v.waBusy) && (<>
<div style={css(`height: 54px; display: flex; align-items: center; justify-content: center; color: ${v.t.mute}; font-size: 14px`)}>لحظة…</div>
</>)}
{(v.waWaiting) && (<>
<div className="fu" role="status" style={css("display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 16px; border: 1px solid #25D366")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>ابعت الكود ده من الواتساب بتاعك:</span>
<span className="num" dir="ltr" style={css("font-size: 34px; font-weight: 600; letter-spacing: 4px; text-align: center")}>{v.waCode}</span>
<a href={v.waLink} target="_blank" rel="noopener" className="press" style={css("height: 50px; border-radius: 14px; background: #25D366; color: #000000; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; text-decoration: none")}>افتح الواتساب وابعته</a>
<span style={css(`font-size: 12px; line-height: 1.8; color: ${v.t.mute}`)}>الرسالة هتتكتب لوحدها، دوس إرسال وارجع هنا. أول ما توصلنا هتدخل على طول برقمك. الكود شغال 10 دقايق.</span>
<button className="press" onClick={v.waCancel} style={css(`align-self: flex-start; min-height: 36px; padding: 0; background: none; border: none; color: ${v.t.mute}; font-size: 13px; text-decoration: underline`)}>إلغاء</button>
</div>
</>)}
<div aria-hidden="true" style={css(`display: flex; align-items: center; gap: 12px; color: ${v.t.mute}; font-size: 12px; margin: 4px 0`)}>
<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>أو<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>
</div>
</>)}
{(v.googleOn) && (<>
<button className="press" onClick={v.goGoogle} style={css(`height: 54px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px`)}>
<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"></path><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.2z"></path><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"></path></svg>
            كمّل بجوجل
          </button>
<div aria-hidden="true" style={css(`display: flex; align-items: center; gap: 12px; color: ${v.t.mute}; font-size: 12px; margin: 4px 0`)}>
<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>أو<span style={css(`flex: 1; height: 1px; background: ${v.t.line}`)}></span>
</div>
</>)}
<div role="tablist" aria-label="دخول أو حساب جديد" style={css(`display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 12px; background: ${v.t.soft}`)}>
<button className="press" role="tab" aria-selected={v.lg.inSel} onClick={v.lg.goIn} style={css(`height: 40px; border-radius: 9px; border: none; background: ${v.lg.inBg}; color: ${v.lg.inFg}; font-size: 14px; font-weight: 600`)}>دخول</button>
<button className="press" role="tab" aria-selected={v.lg.upSel} onClick={v.lg.goUp} style={css(`height: 40px; border-radius: 9px; border: none; background: ${v.lg.upBg}; color: ${v.lg.upFg}; font-size: 14px; font-weight: 600`)}>حساب جديد</button>
</div>
{(v.lg.isUp) && (<>
<div className="fu" style={css("display: flex; flex-direction: column; gap: 10px")}>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>إنت مين؟</span>
<div role="radiogroup" aria-label="نوع الحساب" style={css("display: grid; grid-template-columns: 1fr 1fr; gap: 8px")}>
<button className="press" role="radio" aria-checked={v.lg.dealerOn} onClick={v.lg.setDealer} style={css(`min-height: 64px; padding: 10px 12px; border-radius: 12px; border: 1px solid ${v.lg.dealerBd}; background: ${v.lg.dealerBg}; color: ${v.lg.dealerFg}; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; text-align: right`)}><span style={css("font-size: 15px; font-weight: 600")}>معرض أو تاجر</span><span style={css("font-size: 11px; opacity: .8")}>بشتري وببيع عربيات</span></button>
<button className="press" role="radio" aria-checked={v.lg.userOn} onClick={v.lg.setUser} style={css(`min-height: 64px; padding: 10px 12px; border-radius: 12px; border: 1px solid ${v.lg.userBd}; background: ${v.lg.userBg}; color: ${v.lg.userFg}; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; text-align: right`)}><span style={css("font-size: 15px; font-weight: 600")}>مشتري</span><span style={css("font-size: 11px; opacity: .8")}>بشتري أو ببيع عربيتي</span></button>
</div>
<label htmlFor="lg-name" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>اسمك</label>
<input id="lg-name" type="text" name="name" autoComplete="name" maxLength="60" value={v.lg.name} onChange={v.lg.onName} placeholder="اسمك" style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box`)} />
{(v.lg.isDealer) && (<>
<label htmlFor="lg-shop" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>اسم المعرض</label>
<input id="lg-shop" type="text" name="organization" autoComplete="organization" maxLength="60" value={v.lg.showroom} onChange={v.lg.onShowroom} placeholder="اسم المعرض" style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box`)} />
</>)}
<label htmlFor="lg-phone" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>رقم الموبايل</label>
<input id="lg-phone" type="tel" name="tel" autoComplete="tel" inputMode="tel" dir="ltr" maxLength="16" value={v.lg.phone} onChange={v.lg.onPhone} placeholder="01xxxxxxxxx" style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box; text-align: left`)} />
</div>
</>)}
<label htmlFor="lg-mail" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>الإيميل</label>
<input id="lg-mail" type="email" name="email" autoComplete="username" inputMode="email" dir="ltr" maxLength="120" value={v.loginEmail} onChange={v.onLoginEmail} placeholder="name@gmail.com" style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box; text-align: left`)} />
{(v.lg.needPass) && (<>
<div style={css("position: relative")}>
<label htmlFor="lg-pass" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>الباسورد</label>
<input id="lg-pass" type={v.lg.passType} name="password" autoComplete={v.lg.passAuto} dir="ltr" maxLength="72" value={v.lg.pass} onChange={v.lg.onPass} placeholder={v.lg.passHint} style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box; text-align: left; padding-right: 64px`)} />
<button className="press" onClick={v.lg.toggleShow} aria-pressed={v.lg.showOn} style={css(`position: absolute; top: 6px; right: 6px; height: 40px; padding: 0 10px; border: none; background: none; color: ${v.t.mute}; font-size: 12px`)}>{v.lg.showLabel}</button>
</div>
</>)}
{(v.lg.isUp) && (<>
<div style={css("display: flex; align-items: center; gap: 10px")}>
<span aria-hidden="true" style={css(`flex: none; width: 72px; height: 4px; border-radius: 2px; background: ${v.t.line}; overflow: hidden; display: flex`)}><span style={css(`width: ${v.lg.strPct}%; background: ${v.lg.strBg}; transition: width .25s ease`)}></span></span>
<span style={css(`font-size: 12px; line-height: 1.6; color: ${v.t.mute}`)}>{v.lg.strTxt}</span>
</div>
</>)}
<button className="press" onClick={v.lg.submit} disabled={v.lg.off} style={css(`height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600; opacity: ${v.lg.op}`)}>{v.lg.btn}</button>
{(v.hasLoginErr) && (<>
<p role="alert" style={css(`margin: 0; font-size: 13px; line-height: 1.6; color: ${v.t.warn}`)}>{v.loginErr}</p>
</>)}
{(v.lg.isIn) && (<>
<button className="press" onClick={v.lg.goReset} style={css(`align-self: flex-start; min-height: 36px; padding: 0; background: none; border: none; color: ${v.t.ink}; font-size: 13px; text-decoration: underline; text-underline-offset: 4px`)}>نسيت الباسورد؟</button>
</>)}
{(v.lg.isReset) && (<>
<button className="press" onClick={v.lg.goIn} style={css(`align-self: flex-start; min-height: 36px; padding: 0; background: none; border: none; color: ${v.t.ink}; font-size: 13px; text-decoration: underline; text-underline-offset: 4px`)}>رجوع للدخول</button>
</>)}
</div>
</>)}
{(v.lg.isNew) && (<>
<div style={css("display: flex; flex-direction: column; gap: 12px")}>
<div style={css("position: relative")}>
<label htmlFor="lg-new" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>الباسورد الجديد</label>
<input id="lg-new" type={v.lg.passType} name="new-password" autoComplete="new-password" dir="ltr" maxLength="72" value={v.lg.pass} onChange={v.lg.onPass} placeholder="8 حروف وأرقام على الأقل" style={css(`height: 52px; border-radius: 12px; border: 1px solid ${v.t.line2}; background: ${v.t.soft}; color: ${v.t.ink}; caret-color: ${v.t.ac}; padding: 0 16px; font-family: 'Alexandria', sans-serif; font-size: 16px; width: 100%; box-sizing: border-box; text-align: left; padding-right: 64px`)} />
<button className="press" onClick={v.lg.toggleShow} aria-pressed={v.lg.showOn} style={css(`position: absolute; top: 6px; right: 6px; height: 40px; padding: 0 10px; border: none; background: none; color: ${v.t.mute}; font-size: 12px`)}>{v.lg.showLabel}</button>
</div>
<span style={css(`font-size: 12px; line-height: 1.6; color: ${v.t.mute}`)}>{v.lg.strTxt}</span>
<button className="press" onClick={v.lg.submit} disabled={v.lg.off} style={css(`height: 52px; border-radius: 14px; border: none; background: ${v.t.ac}; color: #FFFFFF; font-size: 15px; font-weight: 600; opacity: ${v.lg.op}`)}>{v.lg.btn}</button>
{(v.hasLoginErr) && (<>
<p role="alert" style={css(`margin: 0; font-size: 13px; line-height: 1.6; color: ${v.t.warn}`)}>{v.loginErr}</p>
</>)}
</div>
</>)}
{(v.loginSent) && (<>
<div className="fu" role="status" style={css(`display: flex; flex-direction: column; gap: 12px; padding: 18px; border-radius: 16px; border: 1px solid ${v.t.line2}`)}>
<svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true"><rect x="1" y="1" width="32" height="24" rx="3" stroke={v.t.ink} strokeWidth="1.4" fill="none"></rect><path d="M2 3l15 11L32 3" stroke={v.t.ac} strokeWidth="1.6" fill="none"></path></svg>
<span style={css("font-size: 16px; font-weight: 600")}>بصّ على الإيميل</span>
<span style={css(`font-size: 13px; line-height: 1.8; color: ${v.t.mute}`)}>{v.lg.sentTxt}</span>
<button className="press" onClick={v.editEmail} style={css(`align-self: flex-start; min-height: 40px; padding: 0; background: none; border: none; color: ${v.t.ink}; font-size: 13px; text-decoration: underline`)}>رجوع</button>
</div>
</>)}
<button className="press" onClick={v.closeLogin} style={css(`min-height: 44px; background: none; border: none; color: ${v.t.mute}; font-size: 14px`)}>مش دلوقتي، كمّل من غير حساب</button>
<p style={css(`margin: 0; font-size: 11px; line-height: 1.7; color: ${v.t.mute}; text-align: center`)}>الباسورد بيتخزن متشفر ومحدش عندنا يقدر يشوفه. مش هنبعتلك إعلانات.</p>
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
{(v.cities || []).map((ct, i38) => (<React.Fragment key={i38}>
<option value={ct}>{ct}</option>
</React.Fragment>))}
</select>
<span style={css(`font-size: 11px; color: ${v.t.mute}`)}>لقطات مدينتك هتظهرلك الأول في السوق.</span>
</label>
{(v.hasPfErr) && (<>
<p role="alert" style={css(`margin: 0; font-size: 13px; color: ${v.t.warn}`)}>{v.pfErr}</p>
</>)}
<button className="press" onClick={v.savePf} disabled={v.pfSaveOff} style={css(`height: 52px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 16px; font-weight: 600; opacity: ${v.pfSaveOp}`)}>{v.pfSaveLabel}</button>
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
<div className="toast" role="status" aria-live="polite" style={css(`position: absolute; left: 50%; top: 72px; transform: translateX(-50%); z-index: 14; padding: 12px 18px; border-radius: 12px; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 14px; line-height: 1.6; text-align: center; width: max-content; max-width: calc(100% - 40px); box-sizing: border-box; box-shadow: 0 8px 24px rgba(0,0,0,0.25)`)}>{v.flash}</div>
</>)}
{(v.menu) && (<>
<div style={css("position: absolute; inset: 0; z-index: 10")}>
<button className="fade" onClick={v.closeMenu} aria-label="اقفل القائمة" style={css("position: absolute; inset: 0; border: none; background: rgba(0,0,0,0.55); padding: 0")}></button>
<nav className="sheet" role="dialog" aria-modal="true" aria-label="القائمة" onKeyDown={v.menuKey} style={css(`position: absolute; top: 0; bottom: 0; right: 0; width: 284px; background: ${v.t.bg}; border-left: 1px solid ${v.t.line}; display: flex; flex-direction: column; padding: 14px 14px 22px; box-sizing: border-box`)}>
<div style={css("display: flex; align-items: center; justify-content: space-between")}>
<button onClick={v.goHomeTop} aria-label="سعرلي، الرئيسية" translate="no" style={css(`background: none; border: none; padding: 0; color: ${v.t.ink}; cursor: pointer; font-family: 'Aref Ruqaa', serif; font-size: 34px; font-weight: 700; line-height: 1.4`)}>سعرلي</button>
<button className="press" onClick={v.closeMenu} aria-label="اقفل" style={css(`width: 44px; height: 44px; background: none; border: none; color: ${v.t.ink}; padding: 0; display: flex; align-items: center; justify-content: center`)}>
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4"></path></svg>
</button>
</div>
<button className="press fu" onClick={v.menuAcc.go} style={css(`margin-top: 14px; min-height: 60px; padding: 0 12px; border-radius: 16px; border: none; background: ${v.t.soft}; color: ${v.t.ink}; display: flex; align-items: center; gap: 12px; text-align: right`)}>
{(v.hasAvatar) && (<><img src={v.avatarSrc} alt="" width="36" height="36" style={css("flex: none; width: 36px; height: 36px; border-radius: 50%; object-fit: cover")} /></>)}
{(v.hasInitial) && (<><span aria-hidden="true" style={css(`flex: none; width: 36px; height: 36px; border-radius: 50%; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center`)}>{v.initial}</span></>)}
{(v.noUser) && (<><span aria-hidden="true" style={css(`flex: none; width: 36px; height: 36px; border-radius: 50%; border: 1px solid ${v.t.line2}; display: flex; align-items: center; justify-content: center`)}><svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.5" r="3.8" stroke="currentColor" strokeWidth="1.4" fill="none"></circle><path d="M2.5 19c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" stroke="currentColor" strokeWidth="1.4" fill="none"></path></svg></span></>)}
<span style={css("flex: 1; min-width: 0; font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{v.menuAcc.label}</span>
</button>
<div style={css("margin-top: 10px; display: flex; flex-direction: column; overflow-y: auto; min-height: 0")}>
{(v.menuItems || []).map((m, i39) => (<React.Fragment key={i39}>
<button className="press fu" onClick={m.go} style={css(`flex: none; min-height: 50px; margin-top: ${m.gap}px; display: flex; align-items: center; background: none; border: none; color: ${v.t.ink}; text-align: right; padding: 0 12px; font-size: 16px; animation-delay: ${m.delay}s`)}>{m.label}</button>
</React.Fragment>))}
</div>
<div style={css("margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 10px")}>
<div role="radiogroup" aria-label="نوع الحساب" style={css(`display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 12px; background: ${v.t.soft}`)}>
{(v.roleSeg || []).map((rs, i40) => (<React.Fragment key={i40}>
<button className="press" role="radio" aria-checked={rs.sel} onClick={rs.pick} style={css(`height: 36px; border-radius: 9px; border: none; background: ${rs.bg}; color: ${rs.fg}; font-size: 13px; font-weight: 500`)}>{rs.label}</button>
</React.Fragment>))}
</div>
<div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 44px; padding: 0 12px")}>
<span style={css("font-size: 14px")}>الوضع الليلي</span>
<button className="press" onClick={v.toggleTheme} role="switch" aria-checked={v.darkStr} aria-label="الوضع الليلي" style={css(`width: 52px; height: 30px; border-radius: 9px; border: 1px solid ${v.t.ink}; background: ${v.swBg}; position: relative; padding: 0`)}>
<span style={css(`position: absolute; top: 3px; right: 3px; width: 22px; height: 22px; border-radius: 50%; background: ${v.swKnob}; transform: translateX(${v.knobX}px); transition: transform .25s ease`)}></span>
</button>
</div>
</div>
</nav>
</div>
</>)}
</div>
{(v.desk) && (<>
<div className="fu" key={v.deskKey} style={css("display: flex; flex-direction: column; gap: 88px; padding-bottom: 40px")}>
{(v.deskHome) && (<>
<section data-reveal="" style={css("display: flex; flex-direction: column; align-items: center; text-align: center; gap: 22px; padding: 56px 0 8px")}>
<span translate="no" className="wm" data-parallax="" style={css("font-family: 'Aref Ruqaa', serif; font-size: 120px; font-weight: 700; line-height: 1.1")}>سعرلي</span>
<h1 style={css("margin: 0; font-size: 48px; line-height: 1.3; font-weight: 600; max-width: 820px")}>اعرف تمن أي عربية مستعملة في مصر، قبل ما تدفع.</h1>
<div style={css("display: flex; gap: 12px; margin-top: 8px")}>
<button className="press" onClick={v.goCar} style={css(`height: 56px; padding: 0 34px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 17px; font-weight: 600`)}>سعّر عربية</button>
<button className="press" onClick={v.goCompare} style={css(`height: 56px; padding: 0 30px; border-radius: 14px; border: 1px solid ${v.t.ink}; background: none; color: ${v.t.ink}; font-size: 17px; font-weight: 500`)}>قارن عربيات</button>
</div>
<div style={css("display: flex; gap: 64px; margin-top: 28px")}>
{(v.deskStats || []).map((ds, i41) => (<React.Fragment key={i41}>
<div style={css("display: flex; flex-direction: column; gap: 4px")}>
<span className="num" data-count={ds.n} style={css("font-size: 40px; font-weight: 200")}>{ds.n}</span>
<span style={css(`font-size: 14px; color: ${v.t.mute}`)}>{ds.label}</span>
</div>
</React.Fragment>))}
</div>
</section>
<section data-reveal="" aria-labelledby="dk-q" style={css("display: flex; flex-direction: column; gap: 14px; max-width: 760px; width: 100%; margin: 0 auto")}>
<h2 id="dk-q" style={css("margin: 0; font-size: 26px; font-weight: 600")}>دوّر على عربية</h2>
<div style={css(`display: flex; align-items: center; gap: 12px; height: 60px; padding: 0 22px; border-radius: 14px; background: ${v.t.soft}; border: 1px solid ${v.t.line}`)}>
<svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke={v.t.mute} strokeWidth="1.4" fill="none"></circle><path d="M11 11l4 4" stroke={v.t.mute} strokeWidth="1.4"></path></svg>
<input name="search_desk" value={v.q} onChange={v.onQ} aria-labelledby="dk-q" placeholder="اكتبها زي ما تحب: كورولا 2020، النترا، tucson…" autoComplete="off" style={css(`flex: 1; min-width: 0; height: 52px; border: none; background: transparent; color: ${v.t.ink}; font-family: 'Alexandria', sans-serif; font-size: 17px`)} />
</div>
{(v.didYouMean) && (<>
<p aria-live="polite" style={css(`margin: 0 8px; font-size: 14px; color: ${v.t.mute}`)}>قصدك <span style={css(`color: ${v.t.ink}`)}>{v.didYouMean}</span>؟</p>
</>)}
{(v.results || []).map((r, i42) => (<React.Fragment key={i42}>
<div style={css(`min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid ${v.t.line}`)}>
<div style={css("display: flex; flex-direction: column; gap: 3px")}>
<span style={css("font-size: 16px")}>{r.name}</span>
<span className="num" style={css(`font-size: 13px; color: ${v.t.mute}`)}>مستعمل {r.used}</span>
</div>
<button className="press" onClick={r.toggle} aria-pressed={r.pressed} style={css(`flex: none; min-height: 42px; padding: 0 20px; border-radius: 12px; border: 1px solid ${r.bd}; background: ${r.bg}; color: ${r.fg}; font-size: 14px`)}>{r.btn}</button>
</div>
</React.Fragment>))}
{(v.noResults) && (<>
<p style={css(`margin: 0 8px; font-size: 14px; color: ${v.t.mute}`)}>مفيش عربية بالاسم ده. جرّب اسم الماركة بس.</p>
</>)}
{(v.canCompare) && (<>
<button className="press" onClick={v.goCompare} style={css(`align-self: flex-start; height: 50px; padding: 0 28px; border-radius: 14px; border: none; background: ${v.t.ink}; color: ${v.t.bg}; font-size: 15px; font-weight: 600`)}>قارن الـ {v.trayCount} عربيات</button>
</>)}
</section>
<section data-reveal="" aria-labelledby="dk-mkt" style={css("display: flex; flex-direction: column; gap: 18px")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 16px")}>
<h2 id="dk-mkt" style={css("margin: 0; font-size: 30px; font-weight: 600")}>السوق النهارده</h2>
<span style={css(`font-size: 14px; color: ${v.t.mute}`)}>تغييرات أسعار الزيرو، ولقطات نزلت أرخص من السوق</span>
</div>
<div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px")}>
{(v.deskMarket || []).map((dm, i43) => (<React.Fragment key={i43}>
<button data-reveal="" className="press" onClick={dm.go} style={css(`min-height: 140px; padding: 20px; border-radius: 18px; border: 1px solid ${v.t.line}; background: ${v.t.soft}; color: ${v.t.ink}; text-align: right; display: flex; flex-direction: column; justify-content: space-between; gap: 14px`)}>
<span style={css("display: flex; flex-direction: column; gap: 6px")}>
<span style={css("font-size: 16px; font-weight: 500; line-height: 1.5")}>{dm.name}</span>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>{dm.kind}، {dm.when}</span>
</span>
<span style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 8px")}>
<span className="num" style={css("font-size: 24px; font-weight: 300; direction: ltr")}>{dm.price}</span>
<span className="num" style={css(`font-size: 14px; color: ${dm.dc}; direction: ltr`)}>{dm.delta}</span>
</span>
</button>
</React.Fragment>))}
</div>
</section>
<section data-reveal="" aria-labelledby="dk-zero" style={css("display: flex; flex-direction: column; gap: 12px")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between")}>
<h2 id="dk-zero" style={css("margin: 0; font-size: 30px; font-weight: 600")}>أسعار الزيرو</h2>
<button className="press" onClick={v.openZero} style={css(`background: none; border: none; color: ${v.t.ink}; font-size: 15px; padding: 0; min-height: 40px; text-decoration: underline`)}>كل الأسعار ←</button>
</div>
<div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 48px")}>
{(v.deskZero || []).map((dz, i44) => (<React.Fragment key={i44}>
<button data-reveal="" className="press" onClick={dz.go} style={css(`min-height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span style={css("font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{dz.name}</span>
<span className="num" style={css("flex: none; font-size: 16px; direction: ltr")}>{dz.price}</span>
</button>
</React.Fragment>))}
</div>
</section>
{(v.deskSaved) && (<>
<section data-reveal="" aria-labelledby="dk-mine" style={css("display: flex; flex-direction: column")}>
<h2 id="dk-mine" style={css("margin: 0 0 10px; font-size: 30px; font-weight: 600")}>تسعيراتك</h2>
{(v.recent || []).map((rc, i45) => (<React.Fragment key={i45}>
<button className="press" onClick={rc.go} style={css(`min-height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span style={css("font-size: 15px")}>{rc.name} <span style={css(`color: ${rc.noteFg}; font-size: 13px; margin-right: 10px`)}>{rc.note}</span></span>
<span className="num" style={css("font-size: 16px; direction: ltr")}>{rc.range}</span>
</button>
</React.Fragment>))}
</section>
</>)}
<section data-reveal="" aria-labelledby="dk-how" style={css("display: flex; flex-direction: column; gap: 22px")}>
<h2 id="dk-how" style={css("margin: 0; font-size: 30px; font-weight: 600")}>بيشتغل إزاي</h2>
<ol style={css("margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px")}>
{(v.deskHow || []).map((hw, i46) => (<React.Fragment key={i46}>
<li data-reveal="" style={css(`padding: 24px; border-radius: 18px; border: 1px solid ${v.t.line}; display: flex; flex-direction: column; gap: 10px`)}>
<span className="num" style={css(`font-size: 15px; color: ${v.t.ac}`)}>{hw.n}</span>
<span style={css("font-size: 18px; font-weight: 600")}>{hw.title}</span>
<span style={css(`font-size: 14px; line-height: 1.8; color: ${v.t.mute}`)}>{hw.body}</span>
</li>
</React.Fragment>))}
</ol>
</section>
</>)}
{(v.deskZeroPage) && (<>
<section data-reveal="" aria-labelledby="dk-zp" style={css("display: flex; flex-direction: column; gap: 16px; padding-top: 40px")}>
<h1 id="dk-zp" style={css("margin: 0; font-size: 44px; font-weight: 600")}>أسعار الزيرو النهارده</h1>
<p style={css(`margin: 0; font-size: 16px; color: ${v.t.mute}`)}>أرخص فئة لكل موديل، من هتلاقي. دوس على أي عربية تسعّر مستعمل منها.</p>
<input name="zero_filter" value={v.zq} onChange={v.onZq} aria-label="دوّر في أسعار الزيرو" placeholder="دوّر: كيا، تويوتا كامري…" autoComplete="off" style={css(`height: 56px; max-width: 520px; border-radius: 14px; border: 1px solid ${v.t.line}; background: ${v.t.soft}; color: ${v.t.ink}; padding: 0 22px; font-family: 'Alexandria', sans-serif; font-size: 16px`)} />
<div role="table" aria-labelledby="dk-zp" style={css("display: flex; flex-direction: column; margin-top: 8px")}>
<div role="row" style={css(`display: grid; grid-template-columns: minmax(0, 1fr) 160px 160px; gap: 16px; padding: 0 0 10px; border-bottom: 1px solid ${v.t.line2}; font-size: 13px; color: ${v.t.mute}`)}>
<span role="columnheader">العربية</span><span role="columnheader">الإعلانات المستعملة</span><span role="columnheader" style={css("text-align: left")}>سعر الزيرو</span>
</div>
{(v.zeroAll || []).map((za, i47) => (<React.Fragment key={i47}>
<button className="press" role="row" onClick={za.go} style={css(`min-height: 58px; display: grid; grid-template-columns: minmax(0, 1fr) 160px 160px; align-items: center; gap: 16px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span role="cell" style={css("font-size: 15px")}>{za.name}</span>
<span role="cell" className="num" style={css(`font-size: 14px; color: ${v.t.mute}`)}>{za.n}</span>
<span role="cell" className="num" style={css("font-size: 16px; direction: ltr; text-align: left")}>{za.price}</span>
</button>
</React.Fragment>))}
</div>
{(v.zeroEmpty) && (<>
<p style={css(`margin: 0; font-size: 14px; color: ${v.t.mute}`)}>مفيش موديل بالاسم ده.</p>
</>)}
</section>
</>)}
{(v.deskFlow) && (<>
<section data-reveal="" aria-labelledby="dk-cmp" style={css("display: flex; flex-direction: column; max-width: 980px; width: 100%; margin: 0 auto; padding: 0 40px; box-sizing: border-box")}>
<div style={css("display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px")}>
<h2 id="dk-cmp" style={css("margin: 0; font-size: 26px; font-weight: 600")}>العربيات اللي اتقارنت ({v.nComps})</h2>
<span style={css(`font-size: 13px; color: ${v.t.mute}`)}>مقارنة بالرينج لعربية فابريكا</span>
</div>
<div role="table" aria-labelledby="dk-cmp" style={css("display: flex; flex-direction: column")}>
{(v.deskComps || []).map((dc, i48) => (<React.Fragment key={i48}>
<button className="press" role="row" onClick={dc.go} style={css(`min-height: 58px; display: grid; grid-template-columns: minmax(0, 1fr) 180px 130px 90px; align-items: center; gap: 16px; background: none; border: none; border-bottom: 1px solid ${v.t.line}; color: ${v.t.ink}; padding: 0; text-align: right`)}>
<span role="cell" style={css("font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>{dc.name}</span>
<span role="cell" style={css(`font-size: 13px; color: ${v.t.mute}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)}>{dc.sub}</span>
<span role="cell" className="num" style={css("font-size: 15px; direction: ltr; text-align: right")}>{dc.val}</span>
<span role="cell" style={css(`font-size: 13px; color: ${dc.tagFg}`)}>{dc.tag}</span>
</button>
</React.Fragment>))}
</div>
</section>
</>)}
<footer data-reveal="" className="site-foot" style={css(`display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 28px 0 8px; max-width: 1200px; width: 100%; margin: 0 auto; box-sizing: border-box; border-top: 1px solid ${v.t.line}; color: ${v.t.mute}; font-size: 13px`)}>
<span translate="no" style={css(`font-family: 'Aref Ruqaa', serif; font-size: 30px; font-weight: 700; color: ${v.t.ink}`)}>سعرلي</span>
<span>الأسعار من إعلانات حقيقية بتتحدث كل يوم. السعر تقديري، اتأكد من العربية بنفسك قبل ما تشتري.</span>
</footer>
</div>
</>)}
</div>
</div>
    );
  }
}

export default Component;
