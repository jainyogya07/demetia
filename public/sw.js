const CACHE = 'smriti-app-offline-v5';
const CORE = [
  '/',
  '/index.html',
  '/keypad.html',
  '/offline-pack.json',
  '/manifest.json',
  '/keypad-manifest.json',
  '/favicon.png',
  '/smriti-saarthi-logo.png',
];

const DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  if (DEV) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) => Promise.all(
      CORE.map((u) => cache.add(u).catch(() => undefined)),
    )),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if (DEV) {
      await self.registration.unregister();
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      windows.forEach((client) => client.navigate(client.url));
      return;
    }
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
        const copy = res.clone();
        const cache = await caches.open(CACHE);
        cache.put(req, copy);
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
