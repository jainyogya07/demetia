#!/usr/bin/env node
/**
 * Connect to Postgres using DATABASE_URL (or POSTGRES_URL) from the environment.
 * Never put passwords in source. Works with local Docker or a remote Neon/Supabase/Vercel URL.
 *
 *   npm run db:ping
 *   npm run db:migrate   # applies scripts/schema.sql
 *   npm run db:seed
 *
 * Production (Vercel): set DATABASE_URL in the project env, then migrate once from your machine:
 *   DATABASE_URL='postgres://…' npm run db:migrate
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv, repoRootFrom } from './loadEnv.mjs';
import { getDatabaseUrl, pgClientConfig } from '../server/httpKit.mjs';

const root = repoRootFrom(import.meta.url);
loadEnv(root);

const url = getDatabaseUrl();
if (!url) {
  console.error('DATABASE_URL is not set (also accepts POSTGRES_URL / POSTGRES_PRISMA_URL).');
  console.error('Local: copy .env.example → .env, run npm run stack, then retry.');
  console.error('Vercel: set DATABASE_URL in Project Settings → Environment Variables, then:');
  console.error("  DATABASE_URL='postgres://…' npm run db:migrate");
  process.exit(1);
}

let pg;
try {
  pg = await import('pg');
} catch {
  console.error('The `pg` package is not installed. From the repo root run: npm install pg');
  console.error('Then retry: node scripts/db.mjs');
  process.exit(1);
}

const { Client } = pg;
const client = new Client(pgClientConfig(url));
const action = process.argv[2] || 'ping';

try {
  await client.connect();
  if (action === 'ping') {
    const { rows } = await client.query('SELECT NOW() AS now');
    console.log('Connected. Server time:', rows[0].now);
  } else if (action === 'migrate') {
    await client.query(readFileSync(join(root, 'scripts/schema.sql'), 'utf8'));
    console.log('Applied scripts/schema.sql');
  } else if (action === 'seed') {
    await client.query(readFileSync(join(root, 'scripts/schema.sql'), 'utf8'));
    await client.query(readFileSync(join(root, 'scripts/seed_schemes.sql'), 'utf8'));
    await client.query(readFileSync(join(root, 'scripts/seed_memories.sql'), 'utf8'));
    const schemes = await client.query('SELECT COUNT(*)::int AS n FROM schemes');
    const memories = await client.query('SELECT COUNT(*)::int AS n FROM memories');
    console.log('Seeded schemes:', schemes.rows[0].n, 'memories:', memories.rows[0].n);
  } else {
    console.error('Unknown action. Use: ping | migrate | seed');
    process.exit(1);
  }
} catch (err) {
  console.error('Postgres error:', err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
