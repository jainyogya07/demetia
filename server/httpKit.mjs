import { Client } from 'pg';

/** Hosted Postgres env names used by Neon / Supabase / Vercel Postgres. */
const DB_URL_KEYS = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'DATABASE_URL_UNPOOLED',
  'POSTGRES_URL_NON_POOLING',
];

export function getDatabaseUrl() {
  for (const key of DB_URL_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return '';
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl());
}

function isLocalHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/** Neon / Supabase / Vercel Postgres need TLS; local Docker does not. */
export function pgClientConfig(connectionString = getDatabaseUrl()) {
  const config = {
    connectionString,
    connectionTimeoutMillis: 8_000,
    query_timeout: 12_000,
  };

  let useSsl = false;
  try {
    const parsed = new URL(connectionString);
    const sslMode = (parsed.searchParams.get('sslmode') || '').toLowerCase();
    if (sslMode === 'disable') {
      useSsl = false;
    } else if (sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full') {
      useSsl = true;
    } else {
      useSsl = !isLocalHost(parsed.hostname);
    }
  } catch {
    useSsl = !/localhost|127\.0\.0\.1/i.test(connectionString);
  }

  if (useSsl) {
    // Hosted providers often present certs that Node rejects in serverless without extra CA bundles.
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

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
  const url = getDatabaseUrl();
  if (!url) return { ok: false, error: 'DATABASE_URL is not set' };
  const client = new Client(pgClientConfig(url));
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
