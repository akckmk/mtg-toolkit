/* Commander Table service worker: app shell offline, card images cached as you use them */
const VERSION = 'ct-v1.0.0';
const SHELL = ['./', './index.html', './print.html', './rules.html', './manifest.webmanifest',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];
const LIBS = ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).then(() =>
    Promise.all(LIBS.map(u => fetch(u, {mode: 'no-cors'}).then(r => c.put(u, r)).catch(() => {}))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'ct-img').map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // card art & images: cache first so backgrounds work offline
  if (/(^|\.)scryfall\.(io|com)$/.test(url.hostname) && (url.searchParams.get('format') === 'image' || url.hostname.startsWith('cards.'))) {
    e.respondWith(caches.open('ct-img').then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }))));
    return;
  }
  if (url.origin === location.origin || LIBS.includes(req.url)) {
    // network first for app files so updates arrive, cache fallback offline
    e.respondWith(fetch(req).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; })
      .catch(() => caches.match(req, {ignoreSearch: url.origin === location.origin}).then(h => h || caches.match('./index.html'))));
  }
});
