/** FIFO field typer: look human, finish fast. Newer text for the same field replaces the old job. */

const jobs = [];
const genByField = new Map();
const idleWaiters = [];
let raf = 0;
let timeout = 0;

function prefersInstant() {
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  } catch {
    return false;
  }
}

function flushIdle() {
  if (jobs.length || raf || timeout) return;
  const waiters = idleWaiters.splice(0);
  waiters.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
}

function clearTimers() {
  if (typeof window === 'undefined') return;
  if (raf) window.cancelAnimationFrame(raf);
  if (timeout) window.clearTimeout(timeout);
  raf = 0;
  timeout = 0;
}

function schedule() {
  if (!jobs.length) {
    clearTimers();
    flushIdle();
    return;
  }
  if (typeof window === 'undefined') {
    while (jobs.length) step();
    return;
  }
  if (raf || timeout) return;
  timeout = window.setTimeout(() => {
    timeout = 0;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      step();
    });
  }, jobs[0]?.i ? 10 : 8);
}

function step() {
  const job = jobs[0];
  if (!job) {
    flushIdle();
    return;
  }
  if (job.gen !== genByField.get(job.fieldId)) {
    jobs.shift();
    schedule();
    return;
  }
  const full = job.text;
  if (prefersInstant() || !full.length) {
    job.onTick?.(full, job.fieldId);
    jobs.shift();
    if (job.gen === genByField.get(job.fieldId)) job.onDone?.(full, job.fieldId);
    schedule();
    return;
  }
  const remain = full.length - job.i;
  const chunk = job.i === 0 ? Math.min(2, remain) : remain > 18 ? 3 : 2;
  job.i = Math.min(full.length, job.i + Math.max(1, chunk));
  job.onTick?.(full.slice(0, job.i), job.fieldId);
  if (job.i >= full.length) {
    jobs.shift();
    if (job.gen === genByField.get(job.fieldId)) job.onDone?.(full, job.fieldId);
  }
  schedule();
}

export function enqueueFieldType(fieldId, text, { onTick, onDone } = {}) {
  if (!fieldId) return;
  const next = String(text ?? '');
  const gen = (genByField.get(fieldId) || 0) + 1;
  genByField.set(fieldId, gen);
  const idx = jobs.findIndex((row) => row.fieldId === fieldId);
  const job = {
    fieldId,
    text: next,
    gen,
    i: 0,
    onTick,
    onDone,
  };
  if (idx >= 0) jobs[idx] = job;
  else jobs.push(job);
  schedule();
}

export function whenTypeQueueIdle(fn) {
  if (typeof fn !== 'function') return;
  if (!jobs.length && !raf && !timeout) {
    fn();
    return;
  }
  idleWaiters.push(fn);
}

export function cancelFieldIds(ids) {
  const set = new Set(ids || []);
  set.forEach((id) => genByField.set(id, (genByField.get(id) || 0) + 1));
  for (let i = jobs.length - 1; i >= 0; i -= 1) {
    if (set.has(jobs[i].fieldId)) jobs.splice(i, 1);
  }
  if (!jobs.length) {
    clearTimers();
    flushIdle();
  }
}

export function clearTypeQueue() {
  jobs.length = 0;
  genByField.clear();
  clearTimers();
  idleWaiters.length = 0;
}

export function focusField(fieldId) {
  if (typeof document === 'undefined' || !fieldId) return;
  document.getElementById(fieldId)?.focus();
}
