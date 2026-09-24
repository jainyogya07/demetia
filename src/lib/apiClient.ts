/**
 * Thin browser client for `/api/v1`.
 * 4s timeout, AbortController, never throws — callers treat `null` as “use local data”.
 */

const DEFAULT_TIMEOUT_MS = 4000;

type ApiOptions = RequestInit & { timeoutMs?: number };

function apiOrigin(): string {
  const raw = String(import.meta.env.VITE_API_ORIGIN || '').trim().replace(/\/$/, '');
  return raw;
}

export function apiUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = apiOrigin();
  if (!origin) return path;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiRequest(path: string, options: ApiOptions = {}): Promise<any | null> {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const { timeoutMs: _ignored, ...fetchOpts } = options;
    const headers: Record<string, string> = {
      ...(fetchOpts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(fetchOpts.headers as Record<string, string> | undefined),
    };
    const res = await fetch(apiUrl(path), {
      ...fetchOpts,
      signal: ctrl?.signal,
      headers,
    });
    if (!res.ok) return null;
    return await res.json().catch(() => null);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function apiSilent(method: string, path: string, body?: unknown) {
  const opts: ApiOptions = { method };
  if (body !== undefined) opts.body = JSON.stringify(body);
  void apiRequest(path, opts);
}

export function debounce<T extends (...args: never[]) => void>(fn: T, waitMs = 320): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const wrapped = ((...args: never[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  }) as T;
  return wrapped;
}

export async function getDashboardSummary() {
  const remote = await apiRequest('/api/v1/patient/dashboard/summary');
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

export function postSos(payload: unknown) {
  apiSilent('POST', '/api/v1/safety/sos', payload);
}

export function postCheckIn(payload: unknown) {
  apiSilent('POST', '/api/v1/safety/check-in', payload);
}

export function postTrajectory(coordinates: unknown, cityId?: string) {
  if (!Array.isArray(coordinates) || coordinates.length < 4) return;
  apiSilent('POST', '/api/v1/spatial/compute-trajectory', { coordinates, cityId });
}

export function postGameSession(payload: unknown) {
  apiSilent('POST', '/api/v1/games/session/complete', payload);
}

export function postDemoCity(city: unknown) {
  apiSilent('POST', '/api/v1/places/demo-city', { city });
}
