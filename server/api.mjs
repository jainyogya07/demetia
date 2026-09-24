#!/usr/bin/env node
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../scripts/loadEnv.mjs';
import { handleApiRequest } from './handleApi.mjs';
import { hasDatabaseUrl } from './httpKit.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(root);

const PORT = Number(process.env.PORT || process.env.API_PORT || 8787);
const HOST = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');

const server = createServer(async (req, res) => {
  const handled = await handleApiRequest(req, res);
  if (!handled) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API on http://${HOST}:${PORT}`);
  if (!hasDatabaseUrl()) {
    console.log('DATABASE_URL is not set — auth OTP is on-screen; memories use fallback.');
  }
});
