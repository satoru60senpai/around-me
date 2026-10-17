/* Service worker Around Me — cache statique + fallback hors-ligne */
const CACHE = 'around-me-v2';
const CORE = ['/', '/icons/icon-192.png', '/icons/icon-512.png', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // toujours réseau (fallback local dans l'app)

  const isStatic =
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons') ||
    url.pathname.startsWith('/images') ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname);

  if (isStatic) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
    return;
  }

  // Navigation / pages : réseau d'abord, cache en secours
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((h) => h || caches.match('/')))
  );
});
