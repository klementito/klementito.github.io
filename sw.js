const PREFIX = 'qh-mobile-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE = PREFIX + "44288efa5b3da5ce";
const FILES = ["./assets/index-B69RN2KP.js","./assets/index-swaSu_Sd.css","./guia-android.html","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./resources/Datos.txt"];
const absolute = path => new URL(path, self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(absolute))));
});
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const path = new URL(url.pathname, url.origin).href;
    // Only serve assets belonging to this release. Never mix an old shell with new scripts.
    const saved = await cache.match(path);
    if (saved) return saved;
    if (event.request.mode === 'navigate' && url.pathname === new URL(self.registration.scope).pathname) {
      return cache.match(absolute('./index.html'));
    }
    return fetch(event.request);
  })());
});
