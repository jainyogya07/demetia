/** Best-effort BFF. Never throw — PWA stays usable offline / without keys. */

const TIMEOUT_MS = 2800;

export async function bffFetch(path, options = {}) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), options.timeoutMs || TIMEOUT_MS) : null;
  try {
    const res = await fetch(path, {
      ...options,
      signal: ctrl?.signal,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) return null;
    return await res.json().catch(() => null);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function bffSilent(method, path, body) {
  const opts = { method };
  if (body !== undefined) opts.body = JSON.stringify(body);
  bffFetch(path, opts);
}

export async function getDashboardSummary() {
  const remote = await bffFetch('/api/v1/patient/dashboard/summary');
  if (remote) return remote;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return {
    greeting,
    patient: { name: 'Latveria' },
    routineSnippet: { title: 'Today’s list is on this device' },
    safety: { zoneLabel: 'Safe near Home', copy: 'We’re with you on the walk.' },
    quizDue: false,
    source: 'local',
  };
}

export function postSos(payload) {
  bffSilent('POST', '/api/v1/safety/sos', payload);
}

export function postTrajectory(coordinates, cityId) {
  if (!Array.isArray(coordinates) || coordinates.length < 4) return;
  bffSilent('POST', '/api/v1/spatial/compute-trajectory', { coordinates, cityId });
}

export function postGameSession(payload) {
  bffSilent('POST', '/api/v1/games/session/complete', payload);
}

export function postDemoCity(city) {
  bffSilent('POST', '/api/v1/places/demo-city', { city });
}
