#!/usr/bin/env node
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../scripts/loadEnv.mjs';
import { handleApiRequest } from './handleApi.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(root);

const PORT = Number(process.env.API_PORT || 8787);

const server = createServer(async (req, res) => {
  const handled = await handleApiRequest(req, res);
  if (!handled) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API on http://127.0.0.1:${PORT}`);
  if (!process.env.DATABASE_URL?.trim()) {
    console.log('DATABASE_URL is not set — auth OTP is on-screen; memories use fallback.');
  }
});
