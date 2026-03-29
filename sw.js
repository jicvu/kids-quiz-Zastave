const CACHE_NAME = 'zastave-sveta-v3';

// All flag codes
const FLAG_CODES = [
  'rs','fr','de','it','es','gb','hr','ba','me','si','gr','at','be','nl','se','no','pt','ch',
  'al','ad','by','bg','cy','cz','dk','ee','fi','ge','hu','is','ie','lv','li','lt','lu','mt',
  'md','mc','mk','pl','ro','ru','sm','sk','ua','va',
  'jp','cn','in','kr','tr','vn','th','id','il','sa','af','am','az','bh','bd','bt','bn','kh',
  'ir','iq','jo','kz','kw','kg','la','lb','my','mv','mn','mm','np','kp','om','pk','ps','ph',
  'qa','sg','lk','sy','tw','tj','tl','tm','ae','uz','ye',
  'eg','za','ng','ma','ke','dz','et','gh','ao','bj','bw','bf','bi','cv','cm','cf','td','km',
  'cg','cd','dj','gq','er','sz','ga','gm','gn','gw','ci','ls','lr','ly','mg','mw','ml','mr',
  'mu','mz','na','ne','rw','st','sn','sl','so','ss','sd','tz','tg','tn','ug','zm','zw',
  'us','ca','mx','cu','jm','pa','cr','gt','ag','bs','bb','bz','dm','do','sv','gd','ht','hn',
  'ni','kn','lc','vc','tt',
  'br','ar','cl','co','pe','uy','ve','bo','ec','gy','py','sr',
  'au','nz','fj','pg','vu','ws','ki','mh','fm','nr','pw','sb','to','tv'
];

// Core files to pre-cache
const PRECACHE_URLS = [
  './zastave_sveta_kviz.html',
  './manifest.json',
  './icon.svg',
  './tailwind.min.css',
  ...FLAG_CODES.map(c => `./flags/${c}.png`)
];

// Install: pre-cache everything
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

// Fetch: cache-first (everything is local now)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
