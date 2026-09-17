/**
 * Caregiver household CRUD — localStorage under ss-caregiver-* keys.
 * Seeds from caregiverPlaceholders; does not touch assessment or Memory Quiz stores.
 */

import {
  CG_PROFILE,
  CG_CIRCLE,
  CG_MESSAGES,
  CG_CHECKINS,
  CG_DOCTOR_NOTES,
  CG_DOCS,
  CG_CALENDAR,
  CG_TODAY,
  CG_ROUTINE,
} from '../data/caregiverPlaceholders';

const EVENT = 'ss-caregiver-updated';

const KEYS = {
  profile: 'ss-caregiver-profile-v1',
  circle: 'ss-caregiver-circle-v1',
  messages: 'ss-caregiver-messages-v1',
  checkins: 'ss-caregiver-checkins-v1',
  doctorNotes: 'ss-caregiver-doctor-notes-v1',
  docs: 'ss-caregiver-docs-v1',
  calendar: 'ss-caregiver-calendar-v1',
  today: 'ss-caregiver-today-v1',
  todayDone: 'ss-caregiver-today-done-v1',
  routine: 'ss-caregiver-routine-v1',
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    /* ignore quota */
  }
}

export function uid(prefix = 'cg') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function withIds(list, mapFn) {
  return list.map((item, i) => mapFn(item, i));
}

function seedCircle() {
  return CG_CIRCLE.map((m) => ({ ...m }));
}

function seedMessages() {
  return withIds(CG_MESSAGES, (m, i) => ({
    id: `msg-seed-${i}`,
    from: m.from,
    time: m.time,
    rel: m.rel,
    text: m.text,
  }));
}

function seedCheckins() {
  return withIds(CG_CHECKINS, (c, i) => ({
    id: `chk-seed-${i}`,
    time: c.time,
    rel: c.rel,
    place: c.place,
    note: c.note,
  }));
}

function seedDoctorNotes() {
  return withIds(CG_DOCTOR_NOTES, (n, i) => ({
    id: `dn-seed-${i}`,
    date: n.date,
    rel: n.rel,
    text: n.text,
  }));
}

function seedDocs() {
  return withIds(CG_DOCS, (d, i) => ({
    id: `doc-seed-${i}`,
    name: d.name,
    kind: d.kind,
    updated: d.updated,
    shared: d.shared,
  }));
}

function seedCalendar() {
  return CG_CALENDAR.map((col) => ({
    day: col.day,
    today: col.today,
    items: col.items.map((item, i) => ({
      id: `cal-${col.day}-${i}`,
      t: item.t,
      kind: item.kind,
      label: item.label,
    })),
  }));
}

function seedToday() {
  return CG_TODAY.map((t) => ({ ...t }));
}

function seedRoutine() {
  return CG_ROUTINE.map((r, i) => ({
    id: `rt-seed-${i}`,
    time: r.time,
    title: r.title,
    status: r.status,
    note: r.note || '',
  }));
}

function ensureList(key, seeder) {
  const saved = readJson(key, null);
  if (Array.isArray(saved)) return saved;
  const seed = seeder();
  writeJson(key, seed);
  return seed;
}

function ensureObject(key, seeder) {
  const saved = readJson(key, null);
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
  const seed = seeder();
  writeJson(key, seed);
  return seed;
}

/* —— Profile —— */
export function getCaregiverProfile() {
  const saved = readJson(KEYS.profile, null);
  if (saved && typeof saved === 'object') {
    return {
      ...CG_PROFILE,
      ...saved,
      photoUrl: saved.photoUrl || CG_PROFILE.photoUrl,
    };
  }
  return { ...CG_PROFILE };
}

export function saveCaregiverProfile(patch) {
  const next = { ...getCaregiverProfile(), ...patch };
  writeJson(KEYS.profile, {
    name: next.name,
    role: next.role,
    place: next.place,
    phone: next.phone,
    note: next.note,
    photoUrl: typeof next.photoUrl === 'string' ? next.photoUrl : CG_PROFILE.photoUrl,
  });
  return getCaregiverProfile();
}

/* —— Circle —— */
export function getCircle() {
  const list = ensureList(KEYS.circle, seedCircle);
  return list.map((m) => {
    const seed = CG_CIRCLE.find((s) => s.id === m.id);
    return {
      ...m,
      photoUrl: m.photoUrl || seed?.photoUrl || '',
    };
  });
}

export function saveCircle(list) {
  writeJson(KEYS.circle, list);
  return getCircle();
}

export function upsertCircleMember(member) {
  const list = getCircle();
  const idx = list.findIndex((m) => m.id === member.id);
  const next = { ...member };
  if (idx >= 0) list[idx] = { ...list[idx], ...next };
  else list.push({ ...next, id: next.id || uid('person') });
  return saveCircle(list);
}

export function removeCircleMember(id) {
  return saveCircle(getCircle().filter((m) => m.id !== id));
}

/* —— Messages —— */
export function getMessages() {
  return ensureList(KEYS.messages, seedMessages);
}

export function saveMessages(list) {
  writeJson(KEYS.messages, list);
  return getMessages();
}

export function upsertMessage(msg) {
  const list = getMessages();
  const idx = list.findIndex((m) => m.id === msg.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...msg };
  else list.unshift({ ...msg, id: msg.id || uid('msg') });
  return saveMessages(list);
}

export function removeMessage(id) {
  return saveMessages(getMessages().filter((m) => m.id !== id));
}

/* —— Check-ins —— */
export function getCheckins() {
  return ensureList(KEYS.checkins, seedCheckins);
}

export function saveCheckins(list) {
  writeJson(KEYS.checkins, list);
  return getCheckins();
}

export function upsertCheckin(row) {
  const list = getCheckins();
  const idx = list.findIndex((c) => c.id === row.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...row };
  else list.unshift({ ...row, id: row.id || uid('chk') });
  return saveCheckins(list);
}

export function removeCheckin(id) {
  return saveCheckins(getCheckins().filter((c) => c.id !== id));
}

/* —— Doctor notes —— */
export function getDoctorNotes() {
  return ensureList(KEYS.doctorNotes, seedDoctorNotes);
}

export function saveDoctorNotes(list) {
  writeJson(KEYS.doctorNotes, list);
  return getDoctorNotes();
}

export function upsertDoctorNote(note) {
  const list = getDoctorNotes();
  const idx = list.findIndex((n) => n.id === note.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...note };
  else list.unshift({ ...note, id: note.id || uid('dn') });
  return saveDoctorNotes(list);
}

export function removeDoctorNote(id) {
  return saveDoctorNotes(getDoctorNotes().filter((n) => n.id !== id));
}

/* —— Documents —— */
export function getDocs() {
  return ensureList(KEYS.docs, seedDocs);
}

export function saveDocs(list) {
  writeJson(KEYS.docs, list);
  return getDocs();
}

export function upsertDoc(doc) {
  const list = getDocs();
  const idx = list.findIndex((d) => d.id === doc.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...doc };
  else list.push({ ...doc, id: doc.id || uid('doc') });
  return saveDocs(list);
}

export function removeDoc(id) {
  return saveDocs(getDocs().filter((d) => d.id !== id));
}

/* —— Calendar —— */
export function getCalendar() {
  return ensureList(KEYS.calendar, seedCalendar);
}

export function saveCalendar(list) {
  writeJson(KEYS.calendar, list);
  return getCalendar();
}

export function upsertCalendarItem(day, item) {
  const list = getCalendar().map((col) => {
    if (col.day !== day) return col;
    const items = [...col.items];
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) items[idx] = { ...items[idx], ...item };
    else items.push({ ...item, id: item.id || uid('cal') });
    return { ...col, items };
  });
  return saveCalendar(list);
}

export function removeCalendarItem(day, itemId) {
  const list = getCalendar().map((col) => {
    if (col.day !== day) return col;
    return { ...col, items: col.items.filter((i) => i.id !== itemId) };
  });
  return saveCalendar(list);
}

/* —— Today checklist —— */
export function getTodayTasks() {
  return ensureList(KEYS.today, seedToday);
}

export function saveTodayTasks(list) {
  writeJson(KEYS.today, list);
  return getTodayTasks();
}

export function upsertTodayTask(task) {
  const list = getTodayTasks();
  const idx = list.findIndex((t) => t.id === task.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...task };
  else list.push({ ...task, id: task.id || uid('task') });
  return saveTodayTasks(list);
}

export function getTodayDone() {
  const saved = readJson(KEYS.todayDone, null);
  if (saved && typeof saved === 'object') return saved;
  const seed = Object.fromEntries(seedToday().map((t) => [t.id, !!t.done]));
  writeJson(KEYS.todayDone, seed);
  return seed;
}

export function setTodayDone(id, done) {
  const map = { ...getTodayDone(), [id]: !!done };
  writeJson(KEYS.todayDone, map);
  return map;
}

export function toggleTodayDone(id) {
  const map = getTodayDone();
  return setTodayDone(id, !map[id]);
}

/* —— Routine —— */
export function getRoutine() {
  return ensureList(KEYS.routine, seedRoutine);
}

export function saveRoutine(list) {
  writeJson(KEYS.routine, list);
  return getRoutine();
}

export function upsertRoutineStep(step) {
  const list = getRoutine();
  const idx = list.findIndex((r) => r.id === step.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...step };
  else list.push({ ...step, id: step.id || uid('rt') });
  return saveRoutine(list);
}

export function removeRoutineStep(id) {
  return saveRoutine(getRoutine().filter((r) => r.id !== id));
}

export function subscribeCaregiverStore(handler) {
  const onStorage = (e) => {
    if (e.key && String(e.key).startsWith('ss-caregiver-')) handler();
  };
  const onCustom = () => handler();
  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT, onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT, onCustom);
  };
}

export { KEYS as CAREGIVER_STORAGE_KEYS };
