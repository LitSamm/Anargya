const CACHE_NAME = 'anargya-pwa-v2';
const PRECACHE_ASSETS = [
  '/',
  '/store',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip API routes so dynamic database data is never cached stale
  if (url.pathname.startsWith('/api/')) return;

  // If same origin, use network-first for HTML pages, cache-first/stale-while-revalidate for static assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // If offline and request is an HTML page, serve cached root or store
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match(event.request).then((res) => res || caches.match('/'));
            }
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
