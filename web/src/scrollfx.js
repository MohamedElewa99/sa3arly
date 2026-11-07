// Website (wide screens): sections and cards rise in as you scroll, the numbers count up,
// the big wordmark drifts away, and a thin line under the nav shows how far down you are.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

let io = null;
let scroller = null;
let bar = null;
let raf = 0;

function countUp(el) {
  const target = parseInt(String(el.dataset.count).replace(/[^0-9]/g, ''), 10);
  if (!target || el.dataset.counted) return;
  el.dataset.counted = '1';
  const t0 = performance.now(), dur = 1400;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(target * e).toLocaleString('en-US');
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function reveal(entries) {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    // cards in the same row come in one after another
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    const i = Math.max(0, sibs.indexOf(el));
    el.style.transitionDelay = (sibs.length > 1 ? Math.min(i, 8) * 70 : 0) + 'ms';
    el.dataset.in = '1';
    el.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(el);
  });
}

function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    if (!scroller) return;
    const y = scroller.scrollTop, max = scroller.scrollHeight - scroller.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    const wm = scroller.querySelector('[data-parallax]');
    if (wm) {
      wm.style.transform = 'translateY(' + y * 0.35 + 'px) scale(' + Math.max(0.85, 1 - y / 3000) + ')';
      wm.style.opacity = String(Math.max(0, 1 - y / 520));
    }
  });
}

function scan() {
  const desk = document.querySelector('.desk');
  if (!desk || reduce.matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => { el.dataset.in = '1'; });
    return;
  }
  if (scroller !== desk) {
    if (scroller) scroller.removeEventListener('scroll', onScroll);
    scroller = desk;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    if (io) io.disconnect();
    io = new IntersectionObserver(reveal, { root: scroller, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }
  if (!bar || !bar.isConnected) {
    bar = document.createElement('div');
    bar.className = 'scroll-bar';
    document.body.appendChild(bar);
  }
  scroller.querySelectorAll('[data-reveal]:not([data-in]):not([data-watched])').forEach((el) => {
    el.dataset.watched = '1';
    io.observe(el);
  });
  onScroll();
}

export function startScrollFx() {
  // pages and lists change as the app re-renders: watch for new things to reveal
  new MutationObserver(() => { clearTimeout(startScrollFx.t); startScrollFx.t = setTimeout(scan, 60); })
    .observe(document.getElementById('root'), { childList: true, subtree: true });
  scan();
}
