(function() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      document.documentElement.classList.toggle('menu-open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.documentElement.classList.remove('menu-open');
      });
    });
  }

  var io = new IntersectionObserver(function(es) {
    es.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

  document.fonts.ready.then(function(){ document.documentElement.classList.add('fonts-ready'); });
})();
