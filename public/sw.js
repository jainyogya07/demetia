const CACHE = 'smriti-app-offline-v7';
const CORE = [
  '/',
  '/index.html',
  '/keypad.html',
  '/manifest.json',
  '/favicon.png',
  '/smriti-saarthi-logo.png',
];

const DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (DEV) return;
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const p = url.pathname;
  if (
    p.startsWith('/@')
    || p.startsWith('/src/')
    || p.startsWith('/node_modules')
    || p.startsWith('/api')
    || p.startsWith('/auth-api')
    || p.startsWith('/keypad-api')
    || p.startsWith('/sms')
    || p.startsWith('/ussd')
    || p.startsWith('/sim')
    || p.startsWith('/sync')
    || p.endsWith('.jsx')
    || p.endsWith('.tsx')
  ) return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const ct = res.headers.get('content-type') || '';
        // Guard: never cache HTML fallback for JavaScript assets
        if (p.endsWith('.js') && ct.includes('text/html')) {
          return Response.error();
        }
        // Cache legitimate static assets
        if (p.startsWith('/assets/')) {
          const copy = res.clone();
          const cache = await caches.open(CACHE);
          cache.put(req, copy);
        }
      }
      return res;
    } catch {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        return (await caches.match('/index.html')) || (await caches.match('/keypad.html')) || Response.error();
      }
      return fetch(req);
    }
  })());
});

