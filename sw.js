const CACHE_NAME = 'obsidian-drop-v2';
const STATIC_ASSETS = [
  '/obsidian_drop/',
  '/obsidian_drop/index.html',
  '/obsidian_drop/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Dropbox API リクエストはキャッシュしない
  if (event.request.url.includes('api.dropboxapi.com') ||
      event.request.url.includes('content.dropboxapi.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
