const VERSION = 'v1';

const CACHE_PREFIX = 'gorinto-tile-helper-'

const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;

const APP_STATIC_RESOURCES = [
  '/gorinto-tile-helper/',
  '/gorinto-tile-helper/index.html',
  '/gorinto-tile-helper/scripts.js',
  '/gorinto-tile-helper/styles.css',
  '/gorinto-tile-helper/manifest.json',
  '/gorinto-tile-helper/images/GorintoBoxCover-small.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if ((name !== CACHE_NAME) && (name.startsWith(CACHE_PREFIX))) {
            return caches.delete(name);
          }
        }),
      );
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('/gorinto-tile-helper/'));
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response(null, { status: 404 });
    })(),
  );
});
