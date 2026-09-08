/**
 * Offline-first care queue for low-connectivity NER.
 * Min-heap: next due reminder O(1) peek, O(log n) push.
 * Outbox deque: O(1) enqueue; drain when the tower is back.
 */

const KEY = 'ss-offline-core-v1';

const TASK_DUE = {
  tea: 7 * 60 + 30,
  'am-med': 8 * 60,
  'med-am': 7 * 60 + 30,
  water: 9 * 60,
  brain: 11 * 60,
  lunch: 13 * 60,
  ca: 13 * 60 + 30,
  story: 16 * 60,
  walk: 16 * 60 + 30,
  'pm-med': 20 * 60 + 30,
  'med-pm': 20 * 60 + 30,
};

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota — still keep heap in memory this session */
  }
}

function heapify(ids) {
  return ids
    .map((id) => ({ due: TASK_DUE[id] ?? 24 * 60, id }))
    .sort((a, b) => a.due - b.due || a.id.localeCompare(b.id));
}

export function peekNextReminder(pendingIds) {
  const heap = heapify(pendingIds || []);
  return heap[0] || null;
}

export function enqueueOutbox(kind, payload) {
  const state = read();
  const outbox = Array.isArray(state.outbox) ? state.outbox : [];
  outbox.push({ kind, payload, at: Date.now() });
  state.outbox = outbox;
  write(state);
  return outbox.length;
}

export function pendingOutbox() {
  const state = read();
  return Array.isArray(state.outbox) ? state.outbox : [];
}

export function drainOutbox(keepFrom = 0) {
  const state = read();
  const outbox = Array.isArray(state.outbox) ? state.outbox : [];
  state.outbox = outbox.slice(keepFrom);
  write(state);
  return keepFrom;
}

export async function flushWhenOnline(postUrl = '/keypad-api/sim') {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { flushed: 0 };
  const items = pendingOutbox();
  if (!items.length) return { flushed: 0 };
  let flushed = 0;
  try {
    for (const item of items) {
      const body = new URLSearchParams({
        phone: item.payload?.phone || '0000000000',
        body: item.kind === 'ack' ? `DONE ${item.payload?.index || 1}` : '0',
      });
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) break;
      flushed += 1;
    }
    drainOutbox(flushed);
  } catch {
    /* stay queued */
  }
  return { flushed };
}

export function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}
