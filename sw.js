const CACHE_NAME = 'zastave-sveta-v1';

// Files to cache immediately on install
const PRECACHE_URLS = [
  './zastave_sveta_kviz.html',
  './manifest.json',
  './icon.svg',
];

// Install: pre-cache the core files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network, then cache the result
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const networkFetch = fetch(event.request, { mode: 'cors' })
          .catch(() => fetch(event.request, { mode: 'no-cors' }))
          .then(response => {
            // Cache successful responses from CDN and flag images
            if (response && (response.status === 200 || response.type === 'opaque')) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cached); // If network fails, return cached version

        // Return cached version immediately if available, update in background
        return cached || networkFetch;
      })
    )
  );
});
