// a theme the user picked in the app wins over the phone's setting
    try {
      var sp = document.getElementById('splash'), th = localStorage.getItem('sa3.theme');
      if (th) sp.classList.add(th);
      if (localStorage.getItem('sa3.seen')) sp.classList.add('quick');
    } catch (e) {}

// the intro: once per visit, on the first screen only, never for someone who asked the phone for less motion
try {
  var d = document.documentElement;
  if (!sessionStorage.getItem('sa3.intro') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && location.pathname === '/') {
    sessionStorage.setItem('sa3.intro', '1');
    d.setAttribute('data-intro', 'on');
    document.querySelector('#intro .skip').addEventListener('click', function () {
      d.setAttribute('data-intro', 'skip');
      window.dispatchEvent(new Event('sa3-skip'));
    });
  }
} catch (e) { document.documentElement.removeAttribute('data-intro'); }
