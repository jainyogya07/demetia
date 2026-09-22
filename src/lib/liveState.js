const ROUTINE_KEY = 'ss-routine-done-v1';
const GAME_LOG_KEY = 'ss-game-log-v1';
export const CHECKIN_KEY = 'smriti-safety-checkins';

export const ROUTINE_TEMPLATE = [
  { id: 'med-am', hour: 7, minute: 30, title: 'Morning Medicine', subtitle: 'Take your prescribed medicine', type: 'medicine' },
  { id: 'water', hour: 9, minute: 0, title: 'Drink Water', subtitle: 'Stay hydrated', type: 'water' },
  { id: 'brain', hour: 11, minute: 0, title: 'Brain Activity', subtitle: "Complete today's memory activity", type: 'brain' },
  { id: 'lunch', hour: 13, minute: 0, title: 'Lunch Time', subtitle: 'Have a healthy meal', type: 'meal' },
  { id: 'walk', hour: 16, minute: 30, title: 'Evening Walk', subtitle: 'A short walk outside', type: 'walk' },
  { id: 'med-pm', hour: 20, minute: 30, title: 'Night Medicine', subtitle: 'Take your night medicine', type: 'medicine' },
];

export const CIRCLE_MEMBERS = [
  { id: 'rina', name: 'Rina', relation: 'Daughter', role: 'Primary Caregiver', location: 'Guwahati', type: 'primary', phone: '9876543210' },
  { id: 'doom', name: 'Doom', relation: 'Son', role: 'Family Member', location: 'Shillong', type: 'family', phone: '9876500001' },
  { id: 'mina', name: 'Mina', relation: 'Community Health Worker', role: 'Health Support', location: 'Local Health Centre', type: 'health', phone: '9876500002' },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadCheckIns() {
  const parsed = readJson(CHECKIN_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function minutesSince(iso) {
  if (!iso) return null;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function getRoutineItems(now = new Date()) {
  const doneMap = readJson(ROUTINE_KEY, {});
  const done = doneMap[todayKey(now)] || {};
  return ROUTINE_TEMPLATE.map((item) => {
    const dueAt = new Date(now);
    dueAt.setHours(item.hour, item.minute, 0, 0);
    const completed = Boolean(done[item.id]);
    let status = 'upcoming';
    if (completed) status = 'completed';
    else if (now >= dueAt) status = 'due';
    return {
      ...item,
      time: dueAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
      completed,
      status,
      dueAt,
    };
  });
}

export function markRoutineDone(id, now = new Date()) {
  const all = readJson(ROUTINE_KEY, {});
  const day = todayKey(now);
  const row = { ...(all[day] || {}), [id]: now.toISOString() };
  writeJson(ROUTINE_KEY, { ...all, [day]: row });
  return getRoutineItems(now);
}

export function unmarkRoutineDone(id, now = new Date()) {
  const all = readJson(ROUTINE_KEY, {});
  const day = todayKey(now);
  const row = { ...(all[day] || {}) };
  delete row[id];
  writeJson(ROUTINE_KEY, { ...all, [day]: row });
  return getRoutineItems(now);
}

export function recordGamePlay({ gameId, title, score, category = 'Memory' }) {
  const log = readJson(GAME_LOG_KEY, []);
  const next = [
    {
      id: `${Date.now()}`,
      gameId,
      title,
      score,
      category,
      at: new Date().toISOString(),
    },
    ...log,
  ].slice(0, 40);
  writeJson(GAME_LOG_KEY, next);
  return next;
}

export function loadGameLog() {
  const log = readJson(GAME_LOG_KEY, []);
  return Array.isArray(log) ? log : [];
}

export function getProgressSnapshot(now = new Date()) {
  const routine = getRoutineItems(now);
  const done = routine.filter((r) => r.completed).length;
  const log = loadGameLog();
  const today = todayKey(now);
  const todayPlays = log.filter((row) => row.at?.slice(0, 10) === today).length;
  const weekPlays = log.filter((row) => Date.now() - new Date(row.at).getTime() < 7 * 86400000);
  const avgScore = weekPlays.length
    ? Math.round(weekPlays.reduce((s, r) => s + Number(r.score || 0), 0) / weekPlays.length)
    : 70 + done * 2;
  const streak = (() => {
    let n = 0;
    for (let i = 0; i < 14; i += 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const dayDone = readJson(ROUTINE_KEY, {})[key];
      const played = log.some((row) => row.at?.slice(0, 10) === key);
      if (dayDone && Object.keys(dayDone).length) n += 1;
      else if (played) n += 1;
      else if (i === 0) continue;
      else break;
    }
    return Math.max(n, todayPlays ? 1 : 0);
  })();
  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const key = todayKey(d);
    const plays = log.filter((row) => row.at?.slice(0, 10) === key).length;
    const rdone = Object.keys(readJson(ROUTINE_KEY, {})[key] || {}).length;
    return Math.min(100, 38 + plays * 12 + rdone * 6);
  });
  return {
    routineDone: done,
    routineTotal: routine.length,
    todayPlays,
    activities: weekPlays.length + done,
    planned: 21,
    accuracy: Math.min(94, Math.max(62, avgScore)),
    overall: Math.min(92, 58 + done * 4 + todayPlays * 6),
    streak,
    weekBars,
    recent: log.slice(0, 6),
    next: routine.find((r) => !r.completed) || routine[routine.length - 1],
  };
}

export function recordCheckIn({ lat, lng, place }) {
  const row = {
    id: `${Date.now()}`,
    at: new Date().toISOString(),
    place: place || 'Home',
    lat,
    lng,
  };
  const next = [row, ...loadCheckIns()].slice(0, 8);
  writeJson(CHECKIN_KEY, next);
  pingLive();
  return row;
}

export function getCircleStatus(now = new Date()) {
  const checkIns = loadCheckIns();
  const last = checkIns[0];
  const mins = minutesSince(last?.at);
  const hour = now.getHours();
  return CIRCLE_MEMBERS.map((member) => {
    if (member.id === 'rina') {
      const status = mins != null && mins < 90 ? `Saw check-in ${mins} min ago` : hour < 22 ? 'Online' : 'Available';
      return { ...member, status, available: true };
    }
    if (member.id === 'doom') {
      const status = hour >= 9 && hour <= 18 ? 'At work · Shillong' : 'Available this evening';
      return { ...member, status, available: hour < 9 || hour > 18 };
    }
    const status = hour >= 10 && hour <= 16 ? 'On field visits' : 'Next visit: tomorrow';
    return { ...member, status, available: false };
  });
}

export function subscribeLive(onChange) {
  const handler = () => onChange();
  window.addEventListener('storage', handler);
  window.addEventListener('ss-live', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('ss-live', handler);
  };
}

export function pingLive() {
  window.dispatchEvent(new Event('ss-live'));
}
