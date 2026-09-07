#!/usr/bin/env node
/**
 * Connect to Postgres using DATABASE_URL from the environment.
 * Never put passwords in source. Fails clearly if the URL or `pg` is missing.
 *
 *   DATABASE_URL=postgres://USER:PASS@localhost:5432/saheli node scripts/db.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv, repoRootFrom } from './loadEnv.mjs';

const root = repoRootFrom(import.meta.url);
loadEnv(root);

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('DATABASE_URL is not set.');
  console.error('Copy .env.example to .env (not committed) and set DATABASE_URL, or export it in your shell.');
  console.error('Example: postgres://USER:PASSWORD@localhost:5432/saheli');
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
const client = new Client({ connectionString: url });
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
