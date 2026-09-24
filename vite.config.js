import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './scripts/loadEnv.mjs'
import { handleApiRequest } from './server/handleApi.mjs'

const root = dirname(fileURLToPath(import.meta.url))
loadEnv(root)

function killDevServiceWorker() {
  const body = `
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    await self.registration.unregister();
    var keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    var clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(function (client) { client.navigate(client.url); });
  })());
});
`;
  const handle = (req, res, next) => {
    const path = (req.url || '').split('?')[0]
    if (path !== '/sw.js') {
      next()
      return
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('Service-Worker-Allowed', '/')
    res.end(body)
  }
  return {
    name: 'kill-dev-service-worker',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.stack.unshift({ route: '', handle })
    },
  }
}

function inlineApi() {
  const use = async (req, res, next) => {
    const path = (req.url || '').split('?')[0]
    if (!path.startsWith('/api')) {
      next()
      return
    }
    try {
      const handled = await handleApiRequest(req, res)
      if (!handled) next()
    } catch (err) {
      console.error('API', err)
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message || 'API failed' }))
      }
    }
  }
  return {
    name: 'inline-api',
    configureServer(server) {
      server.middlewares.use(use)
    },
    configurePreviewServer(server) {
      server.middlewares.use(use)
    },
  }
}

export default defineConfig({
  plugins: [killDevServiceWorker(), react(), inlineApi()],
  server: {
    proxy: {
      '/auth-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-api/, ''),
      },
      '/keypad-api': {
        target: 'http://127.0.0.1:8010',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/keypad-api/, ''),
      },
    },
  },
})
