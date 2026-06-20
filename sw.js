const CACHE = 'bbs-v2';
const URLS = [
  '/',
  '/styles.css',
  '/script.js',
  '/clenovia/',
  '/galeria/',
  '/o-nas/',
  '/clanky/zlate-pasmo.html',
  '/clanky/turne-bologna.html',
  '/clanky/vitazi-kategorie.html',
  '/ochrana-osobnych-udajov.html',
  '/head_photo.jpg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});
