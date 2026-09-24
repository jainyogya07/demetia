import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import { handleApiRequest } from './handleApi.mjs';
import { V1_CATALOG } from './v1.mjs';

let server;
let base = '';

before(async () => {
  server = createServer(async (req, res) => {
    await handleApiRequest(req, res);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const addr = server.address();
  base = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

async function call(method, path, body) {
  const headers = body === undefined ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

function sampleBody(method, path) {
  if (method === 'GET' || method === 'DELETE') return undefined;
  if (path.includes('/toggle')) return undefined;
  if (path.endsWith('/read')) return {};
  if (path.includes('/telemetry/evaluate')) {
    return { patient_id: 'aita', functional: { faq_cooking_stove_safety: 1 }, memoryQuiz: { percentage: 80 } };
  }
  if (path.includes('/games/session/complete')) {
    return { gameId: 'memory-quiz', score: 8, percentage: 80, totalQuestions: 10 };
  }
  if (path.includes('/spatial/compute-trajectory') || path.includes('/spatial/simplify')) {
    return {
      cityId: 'assam',
      coordinates: [
        { lat: 26.16952, lng: 91.76785 },
        { lat: 26.1696, lng: 91.7679 },
        { lat: 26.17, lng: 91.768 },
        { lat: 26.1702, lng: 91.7682 },
      ],
    };
  }
  if (path.includes('/spatial/trails')) {
    return { city: 'delhi', coordinates: [{ lat: 28.61, lng: 77.2 }] };
  }
  if (path.includes('/familiar/bulk')) {
    return { places: [{ id: 'bulk-1', name: 'Kamakhya steps', lat: 26.166, lng: 91.705, radiusM: 90, city: 'assam' }] };
  }
  if (path.includes('familiar')) {
    return { name: 'Tea stall', lat: 26.17, lng: 91.77, radiusM: 60, city: 'assam' };
  }
  if (path.includes('safe-zones')) {
    return { name: 'Clinic gate', lat: 26.18, lng: 91.75, radiusM: 120, city: 'assam' };
  }
  if (path.includes('demo-city')) return { city: 'delhi' };
  if (path.includes('check-in')) return { kind: 'check-in', place: 'Home garden', lat: 26.16952, lng: 91.76785 };
  if (path.includes('/safety/sos') || path.endsWith('/sos')) return { kind: 'sos', place: 'Home garden' };
  if (path.includes('/care-circle/ping/') && path.endsWith('/ack')) return {};
  if (path.includes('/care-circle/ping')) return { kind: 'nudge', to: 'rina', place: 'Home garden' };
  if (path === '/api/v1/care-circle') return { name: 'Test Kin', relation: 'Niece', role: 'Family', phone: '9999999999' };
  if (path.includes('/care-circle/')) return { role: 'Family Member' };
  if (path.includes('/routine/today')) return { tasks: [{ id: 'water', completed: true }] };
  if (path === '/api/v1/notifications') return { title: 'Test note', message: 'From tests' };
  if (path === '/api/v1/memories') return { title: 'Test memory', body: 'A short garden story.' };
  if (path.includes('train-ai')) return { text: 'Loves second-cup tea', category: 'about' };
  if (path.includes('assessment')) return { total_score: 4, notes: 'ok' };
  if (path.includes('doctor/notes')) return { patientId: 'aita', text: 'Sleep is steadier.' };
  if (path.includes('caregiver/overview')) return { note: 'ok' };
  return {};
}

function concretePath(path) {
  return path
    .replace(':taskId', 'med-am')
    .replace(':id', path.includes('/doctor/patients/') ? 'aita' : path.includes('/notifications/') ? 'n-seed-1' : path.includes('/ping/') ? '__ping__' : 'rina');
}

test('GET /api/health', async () => {
  const { status, json } = await call('GET', '/api/health');
  assert.equal(status, 200);
  assert.equal(json.ok, true);
});

test('GET /api/v1 404 unknown path', async () => {
  const { status, json } = await call('GET', '/api/v1/does-not-exist');
  assert.equal(status, 404);
  assert.equal(json.error, 'Not found');
});

test('POST /api/v1/health method not allowed', async () => {
  const { status, json } = await call('POST', '/api/v1/health', {});
  assert.equal(status, 405);
  assert.equal(json.error, 'Method not allowed');
  assert.ok(Array.isArray(json.allow));
});

test('catalog covers every v1 route', async () => {
  assert.ok(V1_CATALOG.length >= 40);
  const ping = await call('POST', '/api/v1/care-circle/ping', { kind: 'nudge', to: 'rina' });
  assert.equal(ping.status, 201);
  const pingId = ping.json.ping.id;

  for (const row of V1_CATALOG) {
    let path = concretePath(row.path);
    if (path.includes('__ping__')) path = `/api/v1/care-circle/ping/${encodeURIComponent(pingId)}/ack`;
    const body = sampleBody(row.method, path);
    const { status, json } = await call(row.method, path, body);
    assert.ok(status < 500, `${row.method} ${path} crashed with ${status} ${JSON.stringify(json)}`);
    assert.equal(typeof json, 'object', `${row.method} ${path} not JSON`);
    assert.ok(status !== 404, `${row.method} ${path} was 404 — catalog/handler mismatch`);
    assert.ok(status !== 405, `${row.method} ${path} was 405 — catalog/handler mismatch`);
  }
});
