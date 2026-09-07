import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './scripts/loadEnv.mjs'
import { handleApiRequest } from './server/handleApi.mjs'

const root = dirname(fileURLToPath(import.meta.url))
loadEnv(root)

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
  plugins: [react(), inlineApi()],
  server: {
    proxy: {
      '/auth-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-api/, ''),
      },
    },
  },
})
