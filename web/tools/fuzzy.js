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
