const CACHE_NAME = 'cinematch-ml-v1.0';
const ASSETS = [
  './',
  './index.html',
  './favicon.ico',
  './css/style.css',
  './js/data.js',
  './js/storage.js',
  './js/ml-engine.js',
  './js/sound.js',
  './js/app.js',
  './manifest.json',
  './icons/logo.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => console.warn('Cache addAll non-blocking warning:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first fetch strategy; bypass cache for live APIs
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; // Fall through to direct network call
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
