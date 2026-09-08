import { Client } from 'pg';

export function json(res, status, body) {
  const payload = JSON.stringify(body ?? {});
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export async function withDb(fn) {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return { ok: false, error: 'DATABASE_URL is not set' };
  const client = new Client({ connectionString: url });
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

export function apiPath(req) {
  const raw = (req.url || '/').split('?')[0] || '/';
  const path = raw.replace(/\/$/, '') || '/';
  if (path === '/api' || path.startsWith('/api/')) return path;
  return path === '/' ? '/api' : `/api${path.startsWith('/') ? path : `/${path}`}`;
}
