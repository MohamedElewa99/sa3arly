// a theme the user picked in the app wins over the phone's setting
    try {
      var sp = document.getElementById('splash'), th = localStorage.getItem('sa3.theme');
      if (th) sp.classList.add(th);
      if (localStorage.getItem('sa3.seen')) sp.classList.add('quick');
    } catch (e) {}
