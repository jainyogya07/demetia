import { createRequire } from 'node:module';
import { json, readBody, withDb, hasDatabaseUrl } from './httpKit.mjs';
import { analyzeWandering, douglasPeucker } from './spatialMath.mjs';

const require = createRequire(import.meta.url);
const MEMORIES_FALLBACK = require('../src/data/memoriesFallback.json');

const nowIso = () => new Date().toISOString();

const routineTasks = [
  { id: 'med-am', time: '7:30 AM', title: 'Morning Medicine', category: 'MEDICINE', completed: false },
  { id: 'water', time: '9:00 AM', title: 'Drink Water', category: 'ROUTINE', completed: false },
  { id: 'brain', time: '11:00 AM', title: 'Brain Activity', category: 'GAME', completed: false },
  { id: 'lunch', time: '1:00 PM', title: 'Lunch Time', category: 'ROUTINE', completed: false },
  { id: 'walk', time: '4:30 PM', title: 'Evening Walk', category: 'ACTIVITY', completed: false },
  { id: 'med-pm', time: '8:30 PM', title: 'Night Medicine', category: 'MEDICINE', completed: false },
];

const notifications = [
  {
    id: 'n-seed-1',
    type: 'alarm_upcoming',
    title: 'Evening walk soon',
    message: 'A short garden walk is coming up. We can go together.',
    time: nowIso(),
    read: false,
  },
];

const gamesLog = [];
const sosLog = [];
const assessments = [];
const trainFacts = [];
const doctorNotes = [];
const gameScores = [];
const familyPings = [];
const trails = [];

let lastHeartbeat = { at: null, kind: 'idle', place: null, lat: null, lng: null };
let lastSeverity = null;
let lastQuiz = null;

let careCircle = [
  { id: 'rina', name: 'Rina', relation: 'Daughter', role: 'Primary Caregiver', phone: '9876543210' },
  { id: 'doom', name: 'Doom', relation: 'Son', role: 'Family Member', phone: '9876500001' },
  { id: 'mina', name: 'Mina', relation: 'ASHA', role: 'Health Support', phone: '9876500002' },
];

let familiarPlaces = [
  { id: 'place_home', name: 'Home garden', lat: 26.16952, lng: 91.76785, radiusM: 280, city: 'assam' },
];

let safeZones = [
  { id: 'zone-home', name: 'Home garden', lat: 26.16952, lng: 91.76785, radiusM: 280, city: 'assam' },
];

let demoCity = 'assam';

const CITIES = {
  assam: { id: 'assam', label: 'Guwahati · Assam', home: { lat: 26.16952, lng: 91.76785, radiusM: 280 } },
  delhi: { id: 'delhi', label: 'Delhi', home: { lat: 28.6139, lng: 77.209, radiusM: 300 } },
};

const DOCTOR_ROSTER = [
  { id: 'aita', name: 'Latveria Sharma', age: 74, triageRisk: 'LOW', mmseScore: 24, medCompliance: '94%' },
  { id: 'ramesh', name: 'Ramesh Verma', age: 81, triageRisk: 'MODERATE', mmseScore: 19, medCompliance: '78%' },
];

const GAMES_CATALOGUE = [
  { id: 'memory-quiz', title: 'Memory Quiz' },
  { id: 'shape-draw', title: 'Shape Draw' },
  { id: 'memory-journey', title: 'Memory Journey' },
];

/** Every /api/v1 route the test suite and 405 matcher must know about. */
export const V1_CATALOG = [
  { method: 'GET', path: '/api/v1' },
  { method: 'GET', path: '/api/v1/health' },
  { method: 'GET', path: '/api/v1/health/detailed' },
  { method: 'GET', path: '/api/v1/patient/dashboard/summary' },
  { method: 'GET', path: '/api/v1/patient/:id/dashboard/summary' },
  { method: 'GET', path: '/api/v1/inbox/summary' },
  { method: 'POST', path: '/api/v1/safety/sos' },
  { method: 'POST', path: '/api/v1/sos' },
  { method: 'POST', path: '/api/v1/safety/check-in' },
  { method: 'GET', path: '/api/v1/safety/heartbeat' },
  { method: 'GET', path: '/api/v1/routine/today' },
  { method: 'PATCH', path: '/api/v1/routine/today' },
  { method: 'PATCH', path: '/api/v1/routine/tasks/:taskId/toggle' },
  { method: 'GET', path: '/api/v1/notifications' },
  { method: 'POST', path: '/api/v1/notifications' },
  { method: 'PATCH', path: '/api/v1/notifications/:id/read' },
  { method: 'GET', path: '/api/v1/notifications/alarms' },
  { method: 'GET', path: '/api/v1/alarms/upcoming' },
  { method: 'GET', path: '/api/v1/memories' },
  { method: 'POST', path: '/api/v1/memories' },
  { method: 'GET', path: '/api/v1/memories/search' },
  { method: 'GET', path: '/api/v1/caregiver/overview' },
  { method: 'POST', path: '/api/v1/caregiver/overview' },
  { method: 'GET', path: '/api/v1/caregiver/train-ai' },
  { method: 'POST', path: '/api/v1/caregiver/train-ai' },
  { method: 'GET', path: '/api/v1/caregiver/assessments' },
  { method: 'POST', path: '/api/v1/caregiver/assessment' },
  { method: 'GET', path: '/api/v1/doctor/roster' },
  { method: 'GET', path: '/api/v1/doctor/patients/:id/profile' },
  { method: 'POST', path: '/api/v1/doctor/notes' },
  { method: 'GET', path: '/api/v1/games/catalogue' },
  { method: 'POST', path: '/api/v1/games/session/complete' },
  { method: 'GET', path: '/api/v1/games/scores' },
  { method: 'GET', path: '/api/v1/games/quiz/latest' },
  { method: 'POST', path: '/api/v1/spatial/compute-trajectory' },
  { method: 'POST', path: '/api/v1/spatial/simplify' },
  { method: 'GET', path: '/api/v1/spatial/wandering-analysis' },
  { method: 'GET', path: '/api/v1/spatial/safe-zones' },
  { method: 'POST', path: '/api/v1/spatial/safe-zones' },
  { method: 'GET', path: '/api/v1/spatial/trails' },
  { method: 'POST', path: '/api/v1/spatial/trails' },
  { method: 'GET', path: '/api/v1/places/familiar' },
  { method: 'POST', path: '/api/v1/places/familiar' },
  { method: 'GET', path: '/api/v1/spatial/familiar-places' },
  { method: 'POST', path: '/api/v1/spatial/familiar-places' },
  { method: 'POST', path: '/api/v1/places/familiar/bulk' },
  { method: 'GET', path: '/api/v1/places/demo-city' },
  { method: 'POST', path: '/api/v1/places/demo-city' },
  { method: 'GET', path: '/api/v1/care-circle' },
  { method: 'POST', path: '/api/v1/care-circle' },
  { method: 'PATCH', path: '/api/v1/care-circle/:id' },
  { method: 'DELETE', path: '/api/v1/care-circle/:id' },
  { method: 'POST', path: '/api/v1/care-circle/ping' },
  { method: 'POST', path: '/api/v1/care-circle/ping/:id/ack' },
  { method: 'GET', path: '/api/v1/documents' },
  { method: 'POST', path: '/api/v1/telemetry/evaluate' },
  { method: 'GET', path: '/api/v1/telemetry/severity' },
];

function parsePath(path) {
  return path.replace(/\/$/, '') || '/';
}

function params(pattern, path) {
  const a = pattern.split('/').filter(Boolean);
  const b = path.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const out = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) out[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return out;
}

function allowedMethods(p) {
  const methods = new Set();
  for (const row of V1_CATALOG) {
    if (row.path.includes(':')) {
      if (params(row.path, p)) methods.add(row.method);
    } else if (row.path === p) {
      methods.add(row.method);
    }
  }
  return [...methods];
}

function evaluateSeverity(body = {}) {
  const functional = body.functional || {};
  const faqSum = Object.values(functional).reduce((sum, n) => sum + Math.max(0, Number(n) || 0), 0);
  const quizPct = Number(body.memoryQuiz?.percentage ?? lastQuiz?.percentage);
  const quizRisk = Number.isFinite(quizPct) ? Math.max(0, (100 - quizPct) / 100) * 0.2 : 0;
  const tap = Number(body.motor?.tap_latency_mean_ms || 280);
  const raw = Math.min(1, Math.max(0, (faqSum / 30) * 0.6 + (tap / 600) * 0.2 + quizRisk));
  let band = 'NORMAL';
  if (raw >= 0.75) band = 'SEVERE_IMPAIRMENT';
  else if (raw >= 0.5) band = 'MODERATE_IMPAIRMENT';
  else if (raw >= 0.25) band = 'MILD_COGNITIVE_CONCERN';
  const row = {
    patient_id: body.patient_id || 'aita',
    timestamp: nowIso(),
    calibrated_score: Number(raw.toFixed(3)),
    severity_band: band,
    source: 'node-bff',
  };
  lastSeverity = row;
  return row;
}

function searchMemories(list, q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return list;
  return list.filter((row) => {
    const blob = [row.title, row.body, row.person, row.place, row.album, row.lang]
      .map((x) => String(x || '').toLowerCase())
      .join(' ');
    return blob.includes(needle);
  });
}

async function memoriesFromDb() {
  const db = await withDb(async (client) => {
    const { rows } = await client.query(
      `SELECT id, title, body, photo_url, person, place, memory_date::text, lang, album
       FROM memories ORDER BY memory_date DESC NULLS LAST, title`,
    );
    return rows;
  });
  if (db.ok && db.result?.length) return { source: 'postgres', memories: db.result };
  return { source: 'fallback', memories: MEMORIES_FALLBACK, error: db.error || 'empty' };
}

async function insertMemory(row) {
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
  return db;
}

function greetingForHour(h) {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function queryCity(req) {
  try {
    const q = new URL(req.url || '/', 'http://local').searchParams.get('city');
    if (q && CITIES[q]) return q;
  } catch {
    /* ignore */
  }
  return demoCity;
}

function queryParam(req, key) {
  try {
    return new URL(req.url || '/', 'http://local').searchParams.get(key) || '';
  } catch {
    return '';
  }
}

function dashboardPayload() {
  const next = routineTasks.find((t) => !t.completed);
  const hour = new Date().getHours();
  return {
    greeting: greetingForHour(hour),
    patient: { id: 'aita', name: 'Latveria' },
    routineSnippet: next ? { id: next.id, title: next.title, time: next.time } : { title: 'Today’s list is done' },
    safety: { zoneLabel: 'Safe near Home', copy: 'We’re with you on the walk.', city: demoCity },
    quizDue: !lastQuiz,
    quizLatest: lastQuiz,
    heartbeat: lastHeartbeat,
    severity: lastSeverity,
    completedRoutine: routineTasks.filter((t) => t.completed).length,
    totalRoutine: routineTasks.length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    source: 'node-bff',
  };
}

function recordPing(body, kind) {
  const ping = {
    id: body.id || `${kind}-${Date.now()}`,
    kind: body.kind || kind,
    place: body.place || 'Home garden',
    lat: body.lat,
    lng: body.lng,
    from: body.from || body.fromMemberId || 'patient',
    to: body.to || body.toMemberId || null,
    at: nowIso(),
    ackedAt: null,
  };
  familyPings.unshift(ping);
  if (ping.kind === 'sos' || ping.kind === 'check-in' || ping.kind === 'heartbeat') {
    lastHeartbeat = { at: ping.at, kind: ping.kind, place: ping.place, lat: ping.lat, lng: ping.lng };
  }
  if (ping.kind === 'sos') sosLog.unshift(ping);
  notifications.unshift({
    id: `n-${ping.id}`,
    type: ping.kind === 'sos' ? 'sos' : 'check-in',
    title: ping.kind === 'sos' ? 'Help ping' : 'Safe check-in',
    message: ping.place,
    time: ping.at,
    read: false,
  });
  return ping;
}

function applyFamiliarBulk(list) {
  const incoming = Array.isArray(list) ? list : [];
  incoming.forEach((row) => {
    if (!row || !row.name) return;
    const place = {
      id: row.id || `place-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(row.name).slice(0, 80),
      lat: Number(row.lat),
      lng: Number(row.lng),
      radiusM: Number(row.radiusM) || 80,
      city: row.city || demoCity,
    };
    familiarPlaces = [place, ...familiarPlaces.filter((x) => x.id !== place.id)];
  });
  return familiarPlaces;
}

/**
 * BFF routes for the PWA. In-memory + Postgres memories.
 * App must still work if this handler is unreachable (client localStorage).
 */
export async function handleV1(req, res, path) {
  try {
    const p = parsePath(path);
    if (!p.startsWith('/api/v1')) return false;
    const method = req.method || 'GET';

    if (method === 'GET' && (p === '/api/v1/health' || p === '/api/v1')) {
      json(res, 200, {
        ok: true,
        service: 'smriti-bff',
        database: hasDatabaseUrl(),
        supabase: 'optional-client',
        polyglotRequired: false,
      });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/health/detailed') {
      json(res, 200, {
        ok: true,
        service: 'smriti-bff',
        database: hasDatabaseUrl(),
        demoCity,
        heartbeat: lastHeartbeat,
        quizLatest: lastQuiz,
        severity: lastSeverity,
        counts: {
          notifications: notifications.length,
          memoriesFallback: MEMORIES_FALLBACK.length,
          circle: careCircle.length,
          gameScores: gameScores.length,
          trails: trails.length,
        },
        cities: Object.keys(CITIES),
        uptimeSec: Math.round(process.uptime()),
        source: 'node-bff',
      });
      return true;
    }

    if (method === 'GET' && (p === '/api/v1/patient/dashboard/summary' || params('/api/v1/patient/:id/dashboard/summary', p))) {
      json(res, 200, dashboardPayload());
      return true;
    }

    if (method === 'GET' && p === '/api/v1/inbox/summary') {
      const upcoming = routineTasks.filter((t) => !t.completed).slice(0, 3).map((t) => ({
        id: `alarm-${t.id}`,
        title: t.title,
        time: t.time,
      }));
      json(res, 200, {
        notifications: notifications.slice(0, 40),
        alarms: upcoming,
        unread: notifications.filter((n) => !n.read).length,
        heartbeat: lastHeartbeat,
        source: 'node-bff',
      });
      return true;
    }

    if (method === 'POST' && (p === '/api/v1/safety/sos' || p === '/api/v1/sos')) {
      const body = await readBody(req).catch(() => ({}));
      const ping = recordPing(body, body.kind || 'sos');
      json(res, 201, { ok: true, ping, source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/safety/check-in') {
      const body = await readBody(req).catch(() => ({}));
      const ping = recordPing({ ...body, kind: 'check-in' }, 'check-in');
      json(res, 201, { ok: true, heartbeat: lastHeartbeat, ping, source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/safety/heartbeat') {
      json(res, 200, { heartbeat: lastHeartbeat, source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/routine/today') {
      json(res, 200, { date: nowIso().slice(0, 10), tasks: routineTasks, source: 'node-bff' });
      return true;
    }

    if (method === 'PATCH' && p === '/api/v1/routine/today') {
      const body = await readBody(req).catch(() => ({}));
      const incoming = Array.isArray(body.tasks) ? body.tasks : [];
      incoming.forEach((row) => {
        const hit = routineTasks.find((t) => t.id === row.id);
        if (hit && typeof row.completed === 'boolean') hit.completed = row.completed;
      });
      json(res, 200, { date: nowIso().slice(0, 10), tasks: routineTasks });
      return true;
    }

    const toggle = params('/api/v1/routine/tasks/:taskId/toggle', p);
    if (method === 'PATCH' && toggle) {
      const task = routineTasks.find((t) => t.id === toggle.taskId);
      if (!task) {
        json(res, 404, { error: 'Task not found' });
        return true;
      }
      task.completed = !task.completed;
      json(res, 200, { success: true, task });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/notifications') {
      json(res, 200, { notifications: notifications.slice(0, 40), source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/notifications') {
      const body = await readBody(req).catch(() => ({}));
      const row = {
        id: body.id || `n-${Date.now()}`,
        type: body.type || 'alarm',
        title: String(body.title || 'Note').slice(0, 120),
        message: String(body.message || '').slice(0, 400),
        time: nowIso(),
        read: false,
      };
      notifications.unshift(row);
      json(res, 201, { notification: row });
      return true;
    }

    const notifRead = params('/api/v1/notifications/:id/read', p);
    if (method === 'PATCH' && notifRead) {
      const row = notifications.find((n) => n.id === notifRead.id);
      if (!row) {
        json(res, 404, { error: 'Notification not found' });
        return true;
      }
      row.read = true;
      json(res, 200, { notification: row });
      return true;
    }

    if (method === 'GET' && (p === '/api/v1/notifications/alarms' || p === '/api/v1/alarms/upcoming')) {
      const upcoming = routineTasks.filter((t) => !t.completed).slice(0, 3).map((t) => ({
        id: `alarm-${t.id}`,
        title: t.title,
        time: t.time,
      }));
      json(res, 200, { alarms: upcoming, source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/memories/search') {
      const q = queryParam(req, 'q');
      const pack = await memoriesFromDb();
      json(res, 200, { ...pack, q, memories: searchMemories(pack.memories, q) });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/memories') {
      const pack = await memoriesFromDb();
      json(res, 200, pack);
      return true;
    }

    if (method === 'POST' && p === '/api/v1/memories') {
      const body = await readBody(req).catch(() => ({}));
      const row = {
        id: body.id || `m-${Date.now()}`,
        title: String(body.title || '').trim(),
        body: String(body.body || '').trim(),
        photo_url: String(body.photo_url || '/photos/garden.png'),
        person: String(body.person || ''),
        place: String(body.place || ''),
        memory_date: body.memory_date || nowIso().slice(0, 10),
        lang: body.lang || 'en',
        album: body.album || 'Special Moments',
      };
      if (!row.title || !row.body) {
        json(res, 400, { error: 'title and body are required' });
        return true;
      }
      const db = await insertMemory(row);
      if (!db.ok) {
        json(res, 201, { source: 'local-only', memory: row, error: db.error });
        return true;
      }
      json(res, 201, { source: 'postgres', memory: db.result });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/caregiver/overview') {
      json(res, 200, {
        patient: { id: 'aita', name: 'Latveria', zone: 'Home garden' },
        routineOpen: routineTasks.filter((t) => !t.completed).length,
        circle: careCircle,
        facts: trainFacts.slice(0, 8),
        lastSos: sosLog[0] || null,
        heartbeat: lastHeartbeat,
        quizLatest: lastQuiz,
        severity: lastSeverity,
        source: 'node-bff',
      });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/caregiver/overview') {
      const body = await readBody(req).catch(() => ({}));
      json(res, 200, { ok: true, received: Object.keys(body || {}), at: nowIso() });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/caregiver/train-ai') {
      json(res, 200, { facts: trainFacts.slice(0, 40), source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/caregiver/train-ai') {
      const body = await readBody(req).catch(() => ({}));
      const fact = {
        id: `fact-${Date.now()}`,
        category: body.category || 'about',
        text: String(body.text || '').slice(0, 500),
        source: body.source || 'caregiver',
        at: nowIso(),
      };
      trainFacts.unshift(fact);
      json(res, 201, { fact });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/caregiver/assessments') {
      json(res, 200, { assessments: assessments.slice(0, 20), source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/caregiver/assessment') {
      const body = await readBody(req).catch(() => ({}));
      const row = { id: `adl-${Date.now()}`, ...body, at: nowIso() };
      assessments.unshift(row);
      json(res, 201, { assessment: row, source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/doctor/roster') {
      json(res, 200, { total: DOCTOR_ROSTER.length, patients: DOCTOR_ROSTER, source: 'node-bff' });
      return true;
    }

    const profile = params('/api/v1/doctor/patients/:id/profile', p);
    if (method === 'GET' && profile) {
      const patient = DOCTOR_ROSTER.find((r) => r.id === profile.id) || DOCTOR_ROSTER[0];
      json(res, 200, {
        patient,
        clinical: {
          mmseScore: patient.mmseScore,
          medCompliance: patient.medCompliance,
          notes: doctorNotes.filter((n) => n.patientId === profile.id).slice(0, 5),
          quizLatest: lastQuiz,
          severity: lastSeverity,
        },
        source: 'node-bff',
      });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/doctor/notes') {
      const body = await readBody(req).catch(() => ({}));
      const note = {
        id: body.id || `dn-${Date.now()}`,
        patientId: body.patientId || 'aita',
        rel: body.rel || 'Doctor',
        text: String(body.text || '').slice(0, 800),
        date: 'Today',
        at: nowIso(),
      };
      doctorNotes.unshift(note);
      notifications.unshift({
        id: `n-note-${note.id}`,
        type: 'doctor',
        title: `Doctor note (${note.rel})`,
        message: note.text.slice(0, 160),
        time: note.at,
        read: false,
      });
      json(res, 201, { note, careCircleNotified: true });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/games/catalogue') {
      json(res, 200, { games: GAMES_CATALOGUE });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/games/scores') {
      json(res, 200, { scores: gameScores.slice(0, 40), source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/games/quiz/latest') {
      json(res, 200, { quiz: lastQuiz, source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/games/session/complete') {
      const body = await readBody(req).catch(() => ({}));
      const gameId = body.gameId || 'unknown';
      const row = {
        id: `gs-${Date.now()}`,
        gameId,
        score: Number(body.score) || 0,
        extra: body,
        at: nowIso(),
      };
      gameScores.unshift(row);
      gamesLog.unshift(row);
      if (gameId === 'memory-quiz' || gameId === 'quiz' || gameId === 'memory_quiz') {
        lastQuiz = {
          gameId,
          percentage: Number(body.percentage ?? body.score) || 0,
          score: Number(body.score) || 0,
          totalQuestions: Number(body.totalQuestions) || 0,
          at: row.at,
        };
      }
      json(res, 201, { status: 'recorded', ...row, source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && (p === '/api/v1/spatial/compute-trajectory' || p === '/api/v1/spatial/simplify')) {
      const body = await readBody(req).catch(() => ({}));
      const coords = Array.isArray(body.coordinates) ? body.coordinates : [];
      const epsilon = Number(body.epsilon) || 0.00012;
      const simplified = douglasPeucker(coords, epsilon);
      const city = CITIES[body.cityId] || CITIES[demoCity];
      const analysis = analyzeWandering(coords, city.home, city.home.radiusM);
      const trail = {
        id: `trail-${Date.now()}`,
        city: city.id,
        original_points: coords.length,
        simplified_points: simplified.length,
        coordinates: simplified,
        analysis,
        at: nowIso(),
      };
      trails.unshift(trail);
      json(res, 200, { ...trail, engine: 'node-douglas-peucker' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/spatial/wandering-analysis') {
      const city = CITIES[queryCity(req)] || CITIES.assam;
      json(res, 200, {
        city: city.id,
        ...analyzeWandering([{ ...city.home }], city.home, city.home.radiusM),
        source: 'node-bff',
      });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/spatial/safe-zones') {
      json(res, 200, { zones: safeZones, city: demoCity });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/spatial/safe-zones') {
      const body = await readBody(req).catch(() => ({}));
      const zone = {
        id: body.id || `zone-${Date.now()}`,
        name: String(body.name || 'Safe place').slice(0, 80),
        lat: Number(body.lat) || CITIES[demoCity].home.lat,
        lng: Number(body.lng) || CITIES[demoCity].home.lng,
        radiusM: Number(body.radiusM) || 200,
        city: body.city || demoCity,
      };
      safeZones = [zone, ...safeZones.filter((z) => z.id !== zone.id)];
      json(res, 201, { zone });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/spatial/trails') {
      json(res, 200, { trails: trails.slice(0, 20), source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/spatial/trails') {
      const body = await readBody(req).catch(() => ({}));
      const trail = {
        id: body.id || `trail-${Date.now()}`,
        city: body.city || demoCity,
        coordinates: Array.isArray(body.coordinates) ? body.coordinates : [],
        at: nowIso(),
      };
      trails.unshift(trail);
      json(res, 201, { trail });
      return true;
    }

    if (method === 'GET' && (p === '/api/v1/places/familiar' || p === '/api/v1/spatial/familiar-places')) {
      json(res, 200, { places: familiarPlaces, city: demoCity });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/places/familiar/bulk') {
      const body = await readBody(req).catch(() => ({}));
      applyFamiliarBulk(body.places || body);
      json(res, 200, { places: familiarPlaces, source: 'node-bff' });
      return true;
    }

    if (method === 'POST' && (p === '/api/v1/places/familiar' || p === '/api/v1/spatial/familiar-places')) {
      const body = await readBody(req).catch(() => ({}));
      if (Array.isArray(body.places)) {
        familiarPlaces = body.places;
      } else if (body.name) {
        applyFamiliarBulk([body]);
      }
      json(res, 200, { places: familiarPlaces });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/places/demo-city') {
      json(res, 200, { city: demoCity, cities: Object.values(CITIES) });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/places/demo-city') {
      const body = await readBody(req).catch(() => ({}));
      const next = String(body.city || body.id || '').toLowerCase();
      if (CITIES[next]) demoCity = next;
      json(res, 200, { city: demoCity });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/care-circle/ping') {
      const body = await readBody(req).catch(() => ({}));
      const ping = recordPing(body, body.kind || 'nudge');
      json(res, 201, { ping, source: 'node-bff' });
      return true;
    }

    const pingAck = params('/api/v1/care-circle/ping/:id/ack', p);
    if (method === 'POST' && pingAck) {
      const ping = familyPings.find((row) => row.id === pingAck.id);
      if (!ping) {
        json(res, 404, { error: 'Ping not found' });
        return true;
      }
      ping.ackedAt = nowIso();
      json(res, 200, { ping, source: 'node-bff' });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/care-circle') {
      json(res, 200, { members: careCircle });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/care-circle') {
      const body = await readBody(req).catch(() => ({}));
      const member = {
        id: body.id || `person-${Date.now()}`,
        name: String(body.name || 'Family').slice(0, 80),
        relation: String(body.relation || ''),
        role: String(body.role || ''),
        phone: String(body.phone || ''),
      };
      careCircle = [member, ...careCircle.filter((m) => m.id !== member.id)];
      json(res, 201, { member, members: careCircle });
      return true;
    }

    const circleId = params('/api/v1/care-circle/:id', p);
    if (circleId && circleId.id !== 'ping' && method === 'PATCH') {
      const body = await readBody(req).catch(() => ({}));
      careCircle = careCircle.map((m) => (m.id === circleId.id ? { ...m, ...body, id: m.id } : m));
      json(res, 200, { members: careCircle });
      return true;
    }
    if (circleId && circleId.id !== 'ping' && method === 'DELETE') {
      careCircle = careCircle.filter((m) => m.id !== circleId.id);
      json(res, 200, { members: careCircle });
      return true;
    }

    if (method === 'GET' && p === '/api/v1/documents') {
      json(res, 200, {
        documents: [
          { id: 'rx-demo', name: 'Latest prescription', kind: 'Rx', status: 'on-device' },
        ],
        source: 'node-bff-metadata',
      });
      return true;
    }

    if (method === 'POST' && p === '/api/v1/telemetry/evaluate') {
      const body = await readBody(req).catch(() => ({}));
      json(res, 200, evaluateSeverity(body));
      return true;
    }

    if (method === 'GET' && p === '/api/v1/telemetry/severity') {
      json(res, 200, { severity: lastSeverity || evaluateSeverity({}), source: 'node-bff' });
      return true;
    }

    const allow = allowedMethods(p);
    if (allow.length) {
      json(res, 405, { error: 'Method not allowed', allow }, { Allow: allow.join(', ') });
      return true;
    }

    json(res, 404, { error: 'Not found' });
    return true;
  } catch (err) {
    json(res, 500, { error: err?.message || 'API failed' });
    return true;
  }
}
