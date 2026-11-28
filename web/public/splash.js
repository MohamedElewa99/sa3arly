// a theme the user picked in the app wins over the phone's setting
    try {
      var sp = document.getElementById('splash'), th = localStorage.getItem('sa3.theme');
      if (th) sp.classList.add(th);
      if (localStorage.getItem('sa3.seen')) sp.classList.add('quick');
    } catch (e) {}

// the intro: every time the site or the app is opened on the first screen (a website tab kept open for days
// would otherwise never show it again); never for someone whose phone or computer asks for less motion
try {
  var d = document.documentElement;
  if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && location.pathname === '/') {
    d.setAttribute('data-intro', 'on');
    document.querySelector('#intro .skip').addEventListener('click', function () {
      d.setAttribute('data-intro', 'skip');
      window.dispatchEvent(new Event('sa3-skip'));
    });
  }
} catch (e) { document.documentElement.removeAttribute('data-intro'); }
