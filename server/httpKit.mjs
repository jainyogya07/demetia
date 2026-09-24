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

export function json(res, status, body, extraHeaders = {}) {
  if (res.headersSent || res.writableEnded) return;
  const payload = JSON.stringify(body ?? {});
  const origin = process.env.CORS_ORIGIN?.trim() || '*';
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...extraHeaders,
  });
  res.end(payload);
}

export async function readBody(req, { limitBytes = 800_000, timeoutMs = 4_000 } = {}) {
  const chunks = [];
  let size = 0;
  const collect = (async () => {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > limitBytes) throw new Error('body too large');
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
  })();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('body timeout')), timeoutMs);
  });
  try {
    return await Promise.race([collect, timeout]);
  } finally {
    clearTimeout(timer);
  }
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
