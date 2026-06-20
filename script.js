(function() {
  /* ── Nav injection ── */
  var navRoot = document.getElementById('nav-root');
  if (navRoot) {
    var s = document.querySelector('script[src$="script.js"]');
    var navUrl = (s ? s.getAttribute('src').replace(/script\.js$/, '') : '') + 'nav.html';
    fetch(navUrl)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        navRoot.innerHTML = html;
        initNav();
      })
      .catch(function() {});
  }

  function initNav() {
    /* Hamburger */
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

    /* aria-current="page" */
    var currentPath = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('#navbar .nav-links a, #mobileMenu a').forEach(function(link) {
      var href = link.getAttribute('href').replace(/\/$/, '');
      if (href === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });

    /* Nav scroll (transparent → opaque) */
    var nav = document.getElementById('navbar');
    if (nav) {
      window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      });
    }
  }

  /* ── Scroll reveal ── */
  var io = new IntersectionObserver(function(es) {
    es.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

  /* ── Loader + fonts-ready ── */
  var lt = setTimeout(function(){ document.documentElement.classList.add('show-loader'); }, 400);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function(){
    clearTimeout(lt);
    document.documentElement.classList.add('fonts-ready');
    document.documentElement.classList.remove('show-loader');
  });

  /* ── Lightbox ── */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var items = document.querySelectorAll('.gi');
    var lbImgWrap = document.getElementById('lbImgWrap');
    var lbPlaceholder = document.getElementById('lbPlaceholder');
    var lbCap = document.getElementById('lbCap');
    var lbClose = document.getElementById('lbClose');
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    var currentIndex = -1;

    function loadItem(idx) {
      var item = items[idx];
      if (!item) return;
      currentIndex = idx;
      var src = item.getAttribute('data-src');
      var label = item.getAttribute('data-label') || '';
      var cap = item.querySelector('.gi-cap');
      var caption = cap ? cap.textContent : label;

      lbPlaceholder.style.display = 'none';
      var existing = lbImgWrap.querySelector('img');
      if (existing) existing.remove();

      lbCap.textContent = caption;

      if (src) {
        var img = document.createElement('img');
        img.alt = caption;
        img.onload = function() { lbPlaceholder.style.display = 'none'; };
        img.onerror = function() {
          img.remove();
          lbPlaceholder.querySelector('.gi-lbl').textContent = label || 'Nahrať fotografiu';
          lbPlaceholder.querySelector('.lb-placeholder-txt').textContent = 'Súbor ' + src + ' sa nenašiel';
          lbPlaceholder.style.display = 'flex';
        };
        img.src = src;
        lbImgWrap.appendChild(img);
      } else {
        lbPlaceholder.querySelector('.gi-lbl').textContent = label || 'Pridať fotografiu';
        lbPlaceholder.querySelector('.lb-placeholder-txt').textContent = 'Nahraďte súborom v galérii';
        lbPlaceholder.style.display = 'flex';
      }

      lbPrev.style.display = idx > 0 ? '' : 'none';
      lbNext.style.display = idx < items.length - 1 ? '' : 'none';
    }

    items.forEach(function(item, i) {
      item.addEventListener('click', function() {
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadItem(i);
      });
    });

    function closeLB() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
      var img = lbImgWrap.querySelector('img');
      if (img) img.remove();
      lbPlaceholder.style.display = 'flex';
      currentIndex = -1;
    }

    lbClose.addEventListener('click', closeLB);
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft' && currentIndex > 0) loadItem(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) loadItem(currentIndex + 1);
    });
    lbPrev.addEventListener('click', function() { if (currentIndex > 0) loadItem(currentIndex - 1); });
    lbNext.addEventListener('click', function() { if (currentIndex < items.length - 1) loadItem(currentIndex + 1); });
  }

  /* ── Service worker ── */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
})();
