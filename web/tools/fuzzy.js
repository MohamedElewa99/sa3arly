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
