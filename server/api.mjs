#!/usr/bin/env node
/**
 * Local memories API. Reads DATABASE_URL from .env.
 * Serves GET/POST /api/memories. Falls back to bundled JSON if Postgres is down.
 *
 *   node server/api.mjs
 */
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../scripts/loadEnv.mjs';
import { MEMORIES_FALLBACK } from '../src/data/memoriesFallback.js';
import { createAuthHandlers } from './auth.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
loadEnv(root);

const PORT = Number(process.env.API_PORT || 8787);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function withDb(fn) {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return { ok: false, error: 'DATABASE_URL is not set' };
  let pg;
  try {
    pg = await import('pg');
  } catch {
    return { ok: false, error: 'pg is not installed' };
  }
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    const result = await fn(client);
    return { ok: true, result };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await client.end().catch(() => {});
  }
}

const auth = createAuthHandlers({ withDb, json, readBody });

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    json(res, 204, {});
    return;
  }

  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (await auth.handle(req, res, path)) return;

  if (req.method === 'GET' && (path === '/api/health' || path === '/health')) {
    json(res, 200, { ok: true, database: Boolean(process.env.DATABASE_URL?.trim()) });
    return;
  }

  if (req.method === 'GET' && path === '/api/memories') {
    const db = await withDb(async (client) => {
      const { rows } = await client.query(
        `SELECT id, title, body, photo_url, person, place, memory_date::text, lang, album
         FROM memories ORDER BY memory_date DESC NULLS LAST, title`,
      );
      return rows;
    });
    if (db.ok && db.result?.length) {
      json(res, 200, { source: 'postgres', memories: db.result });
      return;
    }
    json(res, 200, {
      source: 'fallback',
      error: db.error || 'empty',
      memories: MEMORIES_FALLBACK,
    });
    return;
  }

  if (req.method === 'POST' && path === '/api/memories') {
    let body;
    try {
      body = await readBody(req);
    } catch {
      json(res, 400, { error: 'Invalid JSON' });
      return;
    }
    const row = {
      id: body.id || `m-${Date.now()}`,
      title: String(body.title || '').trim(),
      body: String(body.body || '').trim(),
      photo_url: String(body.photo_url || '/photos/garden.png'),
      person: String(body.person || ''),
      place: String(body.place || ''),
      memory_date: body.memory_date || new Date().toISOString().slice(0, 10),
      lang: body.lang || 'en',
      album: body.album || 'Special Moments',
    };
    if (!row.title || !row.body) {
      json(res, 400, { error: 'title and body are required' });
      return;
    }
    const db = await withDb(async (client) => {
      await client.query(
        `INSERT INTO memories (id, title, body, photo_url, person, place, memory_date, lang, album)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title, body = EXCLUDED.body, photo_url = EXCLUDED.photo_url,
           person = EXCLUDED.person, place = EXCLUDED.place, memory_date = EXCLUDED.memory_date,
           lang = EXCLUDED.lang, album = EXCLUDED.album`,
        [row.id, row.title, row.body, row.photo_url, row.person, row.place, row.memory_date, row.lang, row.album],
      );
      return row;
    });
    if (!db.ok) {
      json(res, 503, { error: db.error, memory: row, source: 'local-only' });
      return;
    }
    json(res, 201, { source: 'postgres', memory: db.result });
    return;
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Memories API on http://127.0.0.1:${PORT}`);
  if (!process.env.DATABASE_URL?.trim()) {
    console.log('DATABASE_URL is not set — GET /api/memories will serve fallback rows.');
  }
});
