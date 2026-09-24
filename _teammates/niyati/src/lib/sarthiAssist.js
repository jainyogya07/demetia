import {
  CIRCLE_MEMBERS,
  getProgressSnapshot,
  getRoutineItems,
  loadGameLog,
  markRoutineDone,
  pingLive,
  recordCheckIn,
  todayKey,
  unmarkRoutineDone,
} from './liveState.js';
import { MEMORIES_FALLBACK } from '../data/memoriesFallback.js';
import {
  ASSIST_GAMES,
  destKey,
  parseAssistActions,
  resolveAssistCommands,
} from './assistCatalog.js';
import {
  explainScreen,
  helpForTopic,
  namedScreenFromText,
  readScreen,
  visualOpenLine,
} from './assistScreens.js';
import { hideAlbum, hideMemory, matchAlbumName } from './memoryAlbums.js';

const TASKS_KEY = 'sarthi-assist-tasks-v1';
const UNDO_KEY = 'sarthi-assist-undo-v1';
const QUEUE_KEY = 'sarthi-assist-queue-v1';
const AUDIT_KEY = 'sarthi-assist-audit-v1';
const MEMORY_DRAFT_KEY = 'sarthi-memory-draft-v1';
const SETTINGS_DRAFT_KEY = 'sarthi-settings-draft-v1';
const SCALE_STEPS = [100, 110, 125, 140, 160];
const MEMORY_FIELDS = ['title', 'body', 'person', 'place'];
const SETTINGS_FIELDS = ['name', 'phone', 'state', 'district'];
const MEMORY_ASK = {
  title: 'Memory Book khol di. Title bolo — is yaad ka chhota naam.',
  body: 'Ab bolo kya hua tha. Jo aap kahoge wahi likhungi.',
  person: 'Isme kaun tha? Naam bolo, ya skip.',
  place: 'Yeh kahan hua? Jagah bolo, ya skip.',
};
const SETTINGS_ASK = {
  name: 'Settings khol di. Naam bolo.',
  phone: 'Mobile number bolo, ya skip.',
  state: 'State bolo, ya skip.',
  district: 'District bolo, ya skip.',
};
const MEMORY_START = ['nayi memory', 'naya memory', 'new memory', 'memory add', 'yaad likho', 'add a memory', 'memory book mein naya', 'नई मेमोरी', 'नयी मेमोरी', 'मेमोरी बनानी', 'मेमोरी बनाओ', 'memory banani', 'nayi memori', 'banayo'];
const SETTINGS_START = ['settings edit', 'profile edit', 'profile bharo', 'settings bharo', 'naam phone', 'settings mein bharo', 'profile change', 'setting page', 'settings page', 'setting kholo', 'settings kholo', 'setting pe jao', 'settings pe jao', 'setting page pe', 'settings page pe'];
const NAV_VERBS = ['kholo', 'khol', 'jao', 'jana', 'chalo', 'open', 'page pe', 'pe jao', 'pe jana', 'mein jana', 'mein jao', 'tab khol', 'screen khol'];
const META_FILL = [
  'english mein likho', 'english me likho', 'english mein bolo', 'english me bolo',
  'hindi mein hi', 'hindi mein chahiye', 'hindi me chahiye', 'hindi mein bolo', 'hindi me bolo',
  'english chahiye', 'bhasha badlo', 'language change',
  'likho vishesh', 'banani hai', 'बनानी', 'hame ek', 'pehli to', 'pehle to', 'achcha suno',
  'field mein', 'is field',
];

function leftoverAfter(text, phrases) {
  let next = fold(text);
  phrases.forEach((phrase) => {
    next = next.replace(phrase, ' ');
  });
  return next.replace(/\b(kholo|khoolo|karo|kar do|please|pls|jao|jana|chalo|page|pe)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function isBareNav(value) {
  const next = fold(value);
  return !next || /^(pe|jao|jana|chalo|kholo|khol|page|screen|karo|open)$/.test(next);
}

function fold(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[?!,.;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function has(text, words) {
  return words.some((word) => text.includes(word));
}

function readJson(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const parsed = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function readTasks() {
  const rows = readJson(TASKS_KEY, []);
  return Array.isArray(rows) ? rows.filter((row) => !row.deleted) : [];
}

function writeTasks(rows) {
  writeJson(TASKS_KEY, rows);
}

function pushUndo(entry) {
  const stack = readJson(UNDO_KEY, []);
  writeJson(UNDO_KEY, [entry, ...stack].slice(0, 20));
}

function pushAudit(entry) {
  const rows = readJson(AUDIT_KEY, []);
  writeJson(AUDIT_KEY, [{ ts: Date.now(), ...entry }, ...rows].slice(0, 80));
}

function enqueueOffline(entry) {
  const rows = readJson(QUEUE_KEY, []);
  writeJson(QUEUE_KEY, [...rows, { ...entry, queuedAt: Date.now() }]);
}

function nextScale(current, dir) {
  const now = SCALE_STEPS.includes(current) ? current : 100;
  const idx = SCALE_STEPS.indexOf(now);
  if (dir === 'reset') return 100;
  if (dir === 'up') return SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, idx + 1)];
  if (dir === 'down') return SCALE_STEPS[Math.max(0, idx - 1)];
  return now;
}

function shiftDate(isoDay, days) {
  const date = new Date(`${isoDay}T12:00:00`);
  date.setDate(date.getDate() + days);
  return todayKey(date);
}

function parseWhen(text) {
  const tomorrow = has(text, ['kal', 'tomorrow']);
  const day = tomorrow ? shiftDate(todayKey(), 1) : todayKey();
  const timeMatch = text.match(/(\d{1,2})\s*(?::(\d{2}))?\s*(baje|am|pm)?/);
  let time = '';
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minute = timeMatch[2] ? Number(timeMatch[2]) : 0;
    if (timeMatch[3] === 'pm' && hour < 12) hour += 12;
    time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  return { date: day, time, tomorrow };
}

function emitPage(name, detail) {
  const fire = () => window.dispatchEvent(new CustomEvent(name, { detail }));
  fire();
  window.setTimeout(fire, 450);
}

function writeMemoryDraft(draft, ask) {
  const clean = { ...(draft || {}) };
  delete clean._kind;
  delete clean._ask;
  const next = ask || nextMemoryAsk(clean);
  writeJson(MEMORY_DRAFT_KEY, { ...clean, _kind: 'memory-draft', _ask: next || 'save' });
}

function writeSettingsDraft(draft, ask) {
  const clean = { ...(draft || {}) };
  delete clean._kind;
  delete clean._ask;
  const next = ask || SETTINGS_FIELDS.find((key) => !String(clean[key] || '').trim()) || null;
  writeJson(SETTINGS_DRAFT_KEY, { ...clean, _kind: 'settings-draft', _ask: next || 'save' });
}

export function activeAssistFill() {
  const mem = readJson(MEMORY_DRAFT_KEY, {});
  if (mem._kind === 'memory-draft') return mem;
  const set = readJson(SETTINGS_DRAFT_KEY, {});
  if (set._kind === 'settings-draft') return set;
  return null;
}

function restoreFillDest(last) {
  if (last?.kind === 'memory-draft' || last?.kind === 'settings-draft') return last;
  const stored = activeAssistFill();
  if (stored?._kind === 'memory-draft') {
    return { kind: 'memory-draft', draft: stored, ask: stored._ask || 'title', open: 'memory-book' };
  }
  if (stored?._kind === 'settings-draft') {
    return { kind: 'settings-draft', draft: stored, ask: stored._ask || 'name', open: 'settings' };
  }
  return last;
}

function nextMemoryAsk(draft) {
  return MEMORY_FIELDS.find((key) => !String(draft?.[key] || '').trim()) || null;
}

function memoryDest(draft, ask, say) {
  const clean = { ...(draft || {}) };
  delete clean._kind;
  delete clean._ask;
  const next = ask || nextMemoryAsk(clean);
  writeMemoryDraft(clean, next);
  if (!next && clean.title && clean.body) {
    return { kind: 'memory-save', draft: clean, open: 'memory-book', say: say || 'Save kar rahi hoon.' };
  }
  return {
    kind: 'memory-draft',
    draft: clean,
    ask: next || 'title',
    open: 'memory-book',
    say: say || MEMORY_ASK[next || 'title'],
  };
}

function settingsDest(draft, ask, say) {
  const clean = { ...(draft || {}) };
  delete clean._kind;
  delete clean._ask;
  const next = ask || SETTINGS_FIELDS.find((key) => !String(clean[key] || '').trim()) || null;
  writeSettingsDraft(clean, next);
  if (!next) {
    return { kind: 'settings-save', draft: clean, open: 'settings', say: say || 'Profile save kar rahi hoon.' };
  }
  return {
    kind: 'settings-draft',
    draft: clean,
    ask: next,
    open: 'settings',
    say: say || SETTINGS_ASK[next],
  };
}

const WRITE_BITS = String.raw`likho|likh do|लिखो|लिख दो|rakho|rakhna|rakh do|रखो|रखना|naam rakho`;
const INSTRUCTION_BITS = /बनाओ|banayo|banani|नई मेमोरी|नयी मेमोरी|nayi memory|settings mein|memory book pe|jana|jao|kholo|टाइटल में|title mein/i;

function stripWriteVerbs(value) {
  return String(value || '')
    .replace(new RegExp(`\\s*(?:${WRITE_BITS})\\s*`, 'gi'), ' ')
    .replace(/\s*(?:pehle|pehli|पहले|तो|to|naam|नाम)\s*/gi, ' ')
    .replace(/[.,;।]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sliceAfterCue(text, cues) {
  const cue = `(?:${cues})`;
  const re = new RegExp(`${cue}\\s*(?:में|mein|me|to|ko|is|:|-)?\\s*(?:${WRITE_BITS})?\\s*(.+)$`, 'i');
  const m = String(text || '').match(re);
  if (!m) return '';
  let value = stripWriteVerbs(m[1]);
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length > 6) value = words.slice(-4).join(' ');
  return value;
}

export function extractMemoryFields(raw) {
  const text = String(raw || '').trim();
  const out = {};
  const spelled = (text.match(/\b(?:[A-Za-z]\s+){2,}[A-Za-z]\b/) || [])[0];
  const fromSpelled = spelled ? spelled.replace(/\s+/g, '') : '';
  const title = sliceAfterCue(text, 'title|टाइटल|titel|heading')
    || (fromSpelled && /title|टाइटल/i.test(text) ? fromSpelled : '');
  const body = sliceAfterCue(text, 'what happened|kya hua|क्या हुआ');
  const person = sliceAfterCue(text, 'person|kaun|लोग|people');
  const place = sliceAfterCue(text, 'place|jagah|kahan|जगह');
  if (title) out.title = title;
  if (body) out.body = body;
  if (person) out.person = person;
  if (place) out.place = place;
  return out;
}

function isNavUtterance(text) {
  const named = namedScreenFromText(text);
  return Boolean(named && has(text, NAV_VERBS));
}

function isMetaOrCommand(text) {
  return isNavUtterance(text) || has(text, META_FILL) || INSTRUCTION_BITS.test(String(text || '')) || Boolean(languageSwitchDest(text));
}

function languageSwitchDest(text) {
  const folded = fold(text);
  if (has(folded, ['hindi kar', 'hindi mein', 'hindi me', 'hindi chahiye', 'hindi bolo', 'हिंदी'])) {
    return { kind: 'language', code: 'hi', say: 'Hindi kar di.' };
  }
  if (has(folded, ['english kar', 'english mein', 'english me', 'english chahiye', 'english bolo', 'अंग्रेजी'])) {
    return { kind: 'language', code: 'en', say: 'English kar di.' };
  }
  if (has(folded, ['assamese', 'অসমীয়া'])) {
    return { kind: 'language', code: 'as', say: 'Assamese kar di.' };
  }
  return null;
}

function usableFieldValue(raw, field) {
  const value = String(raw || '').trim();
  if (!value) return '';
  const folded = fold(value);
  if (field === 'name') {
    const named = extractProfileName(value);
    if (named) return named;
  }
  if (isNavUtterance(folded) || isNavUtterance(value)) return '';
  if (languageSwitchDest(value)) return '';
  if (has(folded, META_FILL) || INSTRUCTION_BITS.test(String(value || ''))) return '';
  if (INSTRUCTION_BITS.test(value) && value.split(/\s+/).length > 3) return '';
  if (has(folded, ['mein jana', 'pe jana', 'page pe'])) return '';
  if (field === 'phone' && !/\d{5,}/.test(value)) return '';
  if (field === 'name' && (value.length > 42 || value.split(/\s+/).length > 4 || has(folded, ['settings', 'memory book', 'jana']))) return '';
  return stripWriteVerbs(value);
}

export function pickSpokenField(raw, field) {
  if (field === 'name') return extractProfileName(raw) || usableFieldValue(raw, 'name');
  const labeled = extractMemoryFields(raw);
  if (labeled[field]) return labeled[field];
  return usableFieldValue(raw, field);
}

function extractProfileName(raw) {
  const text = String(raw || '').trim();
  const jagah = text.match(/(?:ki\s*jagah|जगह)\s+(.+?)\s*(?:likh|लिख|rakho|rakh do|$)/i);
  if (jagah?.[1]) return jagah[1].replace(/[।.]+$/g, '').trim();
  const en = text.match(/english mein likho\s+([A-Za-z\u0900-\u097F]+)/i);
  if (en?.[1] && en[1].length < 40) return en[1].trim();
  return '';
}

function albumRemoveDest(raw) {
  const text = fold(raw);
  if (!has(text, ['hata', 'remove', 'delete', 'mita do', 'nikal do', 'हटा', 'निकाल'])) return null;
  if (has(text, ['photo', 'pfp', 'tasveer', 'title', 'picture', 'image'])) return null;
  const album = matchAlbumName(raw);
  if (!album) return null;
  const bookish = has(text, ['book', 'album', 'memory book', 'yaadein', 'yaad kitab', 'wali book', 'wala book']);
  const named = has(text, ['special moments', 'favorite sounds', 'my family', 'home & village', 'parivar', 'gaon', 'special memory', 'परिवार', 'गाँव', 'गांव']);
  if (!bookish && !named) return null;
  return { kind: 'remove-album', album, open: 'memory-book', say: `${album} book hata di.` };
}

function memoryCardRemoveDest(raw) {
  const text = fold(raw);
  if (!has(text, ['hata', 'remove', 'delete', 'हटा'])) return null;
  if (albumRemoveDest(raw)) return null;
  if (!has(text, ['memory', 'yaad', 'card', 'wali photo'])) return null;
  const hit = MEMORIES_FALLBACK.find((row) => fold(row.title) && text.includes(fold(row.title)));
  if (!hit) return null;
  return { kind: 'remove-memory', memoryId: hit.id, title: hit.title, open: 'memory-book', say: `${hit.title} hata di.` };
}

function fillClearKeys(text, kind) {
  if (albumRemoveDest(text) || memoryCardRemoveDest(text)) return null;
  if (!has(text, ['hata do', 'hatao', 'hata dena', 'remove', 'clear', 'mita do', 'nikal do', 'remove kar', 'hata kar'])) {
    return null;
  }
  if (kind === 'memory') {
    if (has(text, ['sab', 'saari', 'all', 'poora'])) return ['title', 'body', 'person', 'place', 'photo'];
    const keys = [];
    if (has(text, ['photo', 'pic', 'tasveer', 'image', 'pfp', 'picture'])) keys.push('photo');
    if (has(text, ['title', 'heading'])) keys.push('title');
    if (has(text, ['what happened', 'kya hua', 'body'])) keys.push('body');
    if (has(text, ['person', 'log', 'kaun', 'people'])) keys.push('person');
    if (has(text, ['place', 'jagah'])) keys.push('place');
    return keys.length ? keys : ['__current__'];
  }
  if (has(text, ['sab', 'saari', 'all', 'poora'])) return ['name', 'phone', 'state', 'district', 'photo'];
  const keys = [];
  if (has(text, ['photo', 'pic', 'pfp', 'picture'])) keys.push('photo');
  if (has(text, ['naam', 'name'])) keys.push('name');
  if (has(text, ['phone', 'mobile', 'number'])) keys.push('phone');
  if (has(text, ['state'])) keys.push('state');
  if (has(text, ['district'])) keys.push('district');
  return keys.length ? keys : ['__current__'];
}

function navAwayFromFill(text, here) {
  const named = namedScreenFromText(text);
  if (!named) return null;
  if (!has(text, NAV_VERBS) && !has(text, SETTINGS_START)) return null;
  if (named === here) return { kind: 'ignore-nav' };
  try {
    localStorage.removeItem(MEMORY_DRAFT_KEY);
    if (named !== 'settings') localStorage.removeItem(SETTINGS_DRAFT_KEY);
  } catch {
    /* ignore */
  }
  if (named === 'settings' || has(text, SETTINGS_START)) return settingsDest({}, 'name');
  if (named === 'memory-book') return memoryDest({}, 'title');
  return { open: named, say: visualOpenLine(named) };
}

function matchRoutineItem(text) {
  const items = getRoutineItems();
  const pending = items.filter((row) => !row.completed);
  const named = pending.find((row) => has(text, [fold(row.title), row.id, row.type])
    || (row.type === 'medicine' && has(text, ['dawa', 'dawai', 'medicine', 'goli', 'tablet']))
    || (row.type === 'water' && has(text, ['paani', 'water', 'pani']))
    || (row.type === 'walk' && has(text, ['walk', 'sair']))
    || (row.type === 'meal' && has(text, ['lunch', 'khana', 'breakfast', 'dinner']))
    || (row.type === 'brain' && has(text, ['brain', 'game wala routine'])));
  if (named) return named;
  return pending.find((row) => row.status === 'due') || pending[0] || null;
}

function findTask(text) {
  const tasks = readTasks();
  const folded = fold(text);
  return tasks.find((row) => folded.includes(fold(row.title)))
    || getRoutineItems().find((row) => folded.includes(fold(row.title)) || folded.includes(row.type));
}

function familyMember(text) {
  const folded = fold(text);
  return CIRCLE_MEMBERS.find((row) => folded.includes(fold(row.name)) || folded.includes(row.id))
    || (has(folded, ['beti', 'daughter', 'anjali']) ? CIRCLE_MEMBERS.find((row) => row.id === 'rina') : null)
    || (has(folded, ['beta', 'son']) ? CIRCLE_MEMBERS.find((row) => row.id === 'doom') : null)
    || (has(folded, ['family', 'caregiver', 'ghar wale']) ? CIRCLE_MEMBERS[0] : null);
}

function medicines() {
  return getRoutineItems().filter((row) => row.type === 'medicine');
}

function searchIndex(query) {
  const q = fold(query);
  const hits = [];
  readTasks().forEach((row) => {
    if (fold(`${row.title} ${row.notes}`).includes(q)) hits.push({ kind: 'task', title: row.title, dest: { kind: 'read-task', taskId: row.id } });
  });
  getRoutineItems().forEach((row) => {
    if (fold(`${row.title} ${row.subtitle}`).includes(q)) hits.push({ kind: 'routine', title: row.title, dest: { open: 'routine' } });
  });
  MEMORIES_FALLBACK.forEach((row) => {
    if (fold(`${row.title} ${row.body} ${row.person} ${row.place} ${row.album}`).includes(q)) {
      hits.push({ kind: 'memory', title: row.title, dest: { kind: 'photo-search', query: row.person || row.album, open: 'memory-book' } });
    }
  });
  ASSIST_GAMES.forEach((row) => {
    if (fold(`${row.label} ${row.aliases.join(' ')}`).includes(q)) hits.push({ kind: 'game', title: row.label, dest: { open: 'games', gameId: row.id } });
  });
  return hits.slice(0, 5);
}

export function confirmationLevel(dest) {
  if (dest?.call || dest?.kind === 'sms' || dest?.kind === 'alert-family') return 3;
  if (dest?.kind === 'delete-task') return 2;
  if (dest?.kind === 'emergency' || dest?.open === 'help') return 0;
  if (dest?.kind === 'complete' || dest?.kind === 'create-task') return 1;
  return 0;
}

export function todaySummary() {
  const items = getRoutineItems();
  const due = items.find((row) => row.status === 'due' && !row.completed);
  const next = items.find((row) => !row.completed);
  const med = medicines().find((row) => !row.completed);
  const extra = readTasks().filter((row) => row.date === todayKey() && !row.completed);
  const progress = getProgressSnapshot();
  const bits = [];
  if (med) bits.push(`Agli dawa: ${med.title} ${med.time}`);
  if (due) bits.push(`${due.title} ab due hai`);
  else if (next) bits.push(`Next: ${next.title} ${next.time}`);
  if (extra[0]) bits.push(`Task: ${extra[0].title}`);
  bits.push(`${progress.routineDone}/${progress.routineTotal} routine done`);
  return bits.join('. ') || 'Aaj ki list clear hai.';
}

export function whatNext() {
  const items = getRoutineItems();
  const due = items.find((row) => row.status === 'due' && !row.completed);
  const next = items.find((row) => !row.completed);
  const med = medicines().find((row) => row.status === 'due' && !row.completed);
  if (med) return `Abhi ${med.title} leni hai ${med.time} par. Kya main Routine khol doon?`;
  if (due) return `Abhi ${due.title} karo. Uske baad aaram.`;
  if (next) return `Ab ${next.title} at ${next.time}.`;
  return 'Ab koi pending routine nahi. Paani pi lo, ya ek chhota game khelo.';
}

export function resolveUtterance(raw, context = {}) {
  const text = fold(raw);
  if (!text) return [];
  const moduleId = context.currentModuleId || 'home';
  const gameId = context.activeGameId || null;
  const last = restoreFillDest(context.lastDest);

  if (has(text, ['stop', 'ruk jao', 'band karo', 'bas karo', 'chup'])) {
    return [{ kind: 'stop', say: 'Ruk gayi.' }];
  }
  if (has(text, ['phir se bolo', 'repeat', 'dobara'])) {
    return [{ kind: 'repeat', say: context.lastSaid || explainScreen(moduleId, { gameId }) }];
  }
  if (has(text, ['slowly', 'dheere bolo', 'voice slow'])) {
    return [{ kind: 'voice-rate', rate: 'slow', say: 'Dheere bolungi.' }];
  }
  if (has(text, ['voice loud', 'zor se', 'tez bolo'])) {
    return [{ kind: 'voice-rate', rate: 'loud', say: 'Thoda tez bolungi.' }];
  }
  if (has(text, ['undo', 'wapas karo', 'jo abhi kiya'])) {
    return [{ kind: 'undo', say: 'Wapas kar rahi hoon.' }];
  }

  if (last && has(text, ['kal kar', 'kal kar dena', 'tomorrow kar', 'shift kar'])) {
    return [{ kind: 'reschedule', taskId: last.taskId || last.itemId, days: 1, say: 'Kal ke liye shift karti hoon.' }];
  }

  if (last?.kind === 'memory-draft') {
    const lang = languageSwitchDest(text);
    if (lang) {
      const draft = { ...(last.draft || {}) };
      delete draft._kind;
      delete draft._ask;
      return [lang, memoryDest(draft, last.ask || 'title')];
    }
    const leave = navAwayFromFill(text, 'memory-book');
    if (leave && leave.kind !== 'ignore-nav') return [leave];
    const albumRm = albumRemoveDest(raw);
    if (albumRm) return [albumRm];
    const cardRm = memoryCardRemoveDest(raw);
    if (cardRm) return [cardRm];
    const draft = { ...(last.draft || {}) };
    delete draft._kind;
    delete draft._ask;
    if (has(text, SETTINGS_START) || (namedScreenFromText(text) === 'settings' && has(text, NAV_VERBS))) {
      return [settingsDest({}, 'name')];
    }
    const wipe = fillClearKeys(text, 'memory');
    if (wipe) {
      const keys = wipe[0] === '__current__' ? [last.ask || 'title'] : wipe;
      keys.forEach((key) => {
        if (key === 'photo' || key === 'photo_url') draft.photo_url = '';
        else draft[key] = '';
      });
      const dest = memoryDest(draft, last.ask || nextMemoryAsk(draft) || 'title', 'Hata diya.');
      dest.clear = keys;
      return [dest];
    }
    if (has(text, ['save', 'save kar', 'likh do', 'book mein daal']) && !extractMemoryFields(raw).title) {
      return [memoryDest(draft, null, 'Jo bola woh save karti hoon.')];
    }
    if (has(text, MEMORY_START)) {
      const extra = leftoverAfter(raw, MEMORY_START);
      const labeledStart = extractMemoryFields(raw);
      if (labeledStart.title || labeledStart.body) {
        return [memoryDest({ ...draft, ...labeledStart }, nextMemoryAsk({ ...draft, ...labeledStart }))];
      }
      if (!extra || isBareNav(extra) || isMetaOrCommand(text)) return [memoryDest(draft, last.ask || 'title')];
      const value = usableFieldValue(extra, 'title');
      if (!value) return [memoryDest(draft, last.ask || 'title')];
      draft.title = draft.title || value;
      return [memoryDest(draft, nextMemoryAsk(draft))];
    }
    const labeled = extractMemoryFields(raw);
    const merged = { ...draft, ...labeled };
    if (!Object.keys(labeled).length) {
      if (leave?.kind === 'ignore-nav' || isMetaOrCommand(text) || isNavUtterance(text)) {
        return [memoryDest(draft, last.ask || 'title')];
      }
      const field = last.ask || nextMemoryAsk(draft) || 'title';
      if (has(text, ['skip', 'chhodo', 'baad mein', 'nahi pata'])) merged[field] = merged[field] || '—';
      else {
        const value = usableFieldValue(raw, field);
        if (!value) return [memoryDest(draft, field)];
        merged[field] = value;
      }
    }
    const ask = nextMemoryAsk(merged);
    return [memoryDest(merged, ask)];
  }

  if (last?.kind === 'settings-draft') {
    const lang = languageSwitchDest(text);
    if (lang) {
      const kept = { ...(last.draft || {}) };
      delete kept._kind;
      delete kept._ask;
      return [lang, settingsDest(kept, last.ask || 'name')];
    }
    const leave = navAwayFromFill(text, 'settings');
    if (leave && leave.kind !== 'ignore-nav') return [leave];
    const draft = { ...(last.draft || {}) };
    delete draft._kind;
    delete draft._ask;
    if (has(text, MEMORY_START) || (namedScreenFromText(text) === 'memory-book' && has(text, NAV_VERBS))) {
      return [memoryDest({}, 'title')];
    }
    const wipe = fillClearKeys(text, 'settings');
    if (wipe) {
      const keys = wipe[0] === '__current__' ? [last.ask || 'name'] : wipe;
      keys.forEach((key) => {
        if (key === 'photo') draft.photoDataUrl = '';
        else draft[key] = '';
      });
      const dest = settingsDest(draft, last.ask || 'name', 'Hata diya.');
      dest.clear = keys;
      return [dest];
    }
    if (has(text, ['save', 'save kar', 'profile save'])) {
      return [settingsDest(draft, null)];
    }
    if (leave?.kind === 'ignore-nav' || isNavUtterance(text)) {
      return [settingsDest(draft, last.ask || 'name')];
    }
    if (has(text, SETTINGS_START)) {
      const extra = leftoverAfter(raw, SETTINGS_START);
      if (!extra || isBareNav(extra) || isMetaOrCommand(text)) return [settingsDest(draft, last.ask || 'name')];
      const value = usableFieldValue(extra, 'name');
      if (!value) return [settingsDest(draft, last.ask || 'name')];
      draft.name = draft.name || value;
      return [settingsDest(draft)];
    }
    const field = last.ask || SETTINGS_FIELDS.find((key) => !String(draft[key] || '').trim()) || 'name';
    if (has(text, ['skip', 'chhodo', 'baad mein', 'nahi pata'])) draft[field] = draft[field] || '—';
    else if (field === 'name' && extractProfileName(raw)) draft.name = extractProfileName(raw);
    else {
      const value = usableFieldValue(raw, field);
      if (!value) return [settingsDest(draft, field)];
      draft[field] = value.replace(/^(naam|name|phone|mobile|state|district|jagah)\s*(hai|is|:)?\s*/i, '').trim();
    }
    return [settingsDest(draft)];
  }

  const albumRm = albumRemoveDest(raw);
  if (albumRm) return [albumRm];
  const cardRm = memoryCardRemoveDest(raw);
  if (cardRm) return [cardRm];

  if (has(text, MEMORY_START)) {
    const labeled = extractMemoryFields(raw);
    if (labeled.title || labeled.body) return [memoryDest(labeled, nextMemoryAsk(labeled))];
    const extra = leftoverAfter(raw, MEMORY_START);
    const value = usableFieldValue(extra, 'title');
    return [memoryDest(value ? { title: value } : {}, value ? nextMemoryAsk({ title: value }) : 'title')];
  }

  if (has(text, SETTINGS_START)) {
    return [settingsDest({}, 'name')];
  }

  const howThis = has(text, ['kaise kaam', 'how does this', 'how this', 'ye tab', 'is tab', 'ye page kaise', 'yeh kaise', 'kaise use']);
  const named = namedScreenFromText(text);
  if (howThis || has(text, ['samjhao', 'ye kya hai', 'explain', 'ye page kya', 'samajh nahi', 'kya hai ye'])) {
    const screen = named || moduleId;
    const mode = has(text, ['simple', 'short']) ? 'simple' : howThis ? 'how' : 'explain';
    const open = named && named !== moduleId ? named : undefined;
    return [{ kind: 'explain', say: explainScreen(screen, { mode, gameId: open ? null : gameId }), open }];
  }
  if (named && has(text, ['kaise', 'how', 'kya hai', 'kya hota'])) {
    return [{ kind: 'explain', say: helpForTopic(text), open: named }];
  }
  if (has(text, ['simple language', 'simple karke', 'short mein', 'dheere samjhao'])) {
    return [{ kind: 'simplify', say: explainScreen(moduleId, { mode: 'simple', gameId }) }];
  }
  if (has(text, ['screen padh', 'read this', 'padh ke sunao', 'ye screen padh'])) {
    return [{ kind: 'read-screen', say: readScreen(moduleId, gameId) }];
  }
  if (has(text, ['app kaise', 'ye app', 'offline mode kya', 'caregiver kya dekh', 'games ka kya purpose', 'memory book kya'])) {
    return [{ kind: 'help', say: helpForTopic(text) }];
  }
  if (has(text, ['mujhe yaad nahi', 'yaad nahi'])) {
    if (moduleId === 'medicine' || has(text, ['dawa', 'medicine'])) return [{ kind: 'what-next', say: whatNext(), open: 'routine' }];
    if (moduleId === 'routine') return [{ kind: 'what-next', say: whatNext(), open: 'routine' }];
    return [{ kind: 'summary', say: todaySummary(), open: 'routine' }];
  }

  if (has(text, ['ab mujhe kya', 'what next', 'ab kya karna', 'kya karna chahiye'])) {
    return [{ kind: 'what-next', say: whatNext(), open: 'routine' }];
  }
  if (has(text, ['aaj kya', 'today summary', 'pura din', 'aaj ka din', 'aaj mujhe kya'])) {
    return [{ kind: 'summary', say: todaySummary(), open: 'routine' }];
  }

  const lang = languageSwitchDest(text);
  if (lang) return [lang];

  if (has(text, ['simple mode'])) return [{ kind: 'simple-mode', on: !has(text, ['off', 'normal']), say: 'Simple mode on.' }];
  if (has(text, ['normal mode', 'normal kar do']) && !has(text, ['text', 'font', 'zoom'])) {
    return [{ kind: 'simple-mode', on: false, say: 'Normal mode.' }];
  }

  if (has(text, ['text bada', 'font bada', 'thoda bada', 'zoom karo', 'bahut bada', 'font chhota', 'screen zoom', '125', '140', '160'])) {
    const dir = has(text, ['normal']) ? 'reset' : has(text, ['chhota']) ? 'down' : 'up';
    const big = has(text, ['bahut', '140', '160']);
    const exact = has(text, ['125']) ? 125 : has(text, ['110']) ? 110 : has(text, ['160']) ? 160 : has(text, ['140']) ? 140 : null;
    return [{ kind: 'scale', dir: big ? 'max' : dir, scale: exact, say: 'Text size badal rahi hoon.' }];
  }
  if (has(text, ['contrast badhao', 'contrast'])) {
    return [{ kind: 'contrast', on: !has(text, ['off', 'kam']), say: 'Contrast badal diya.' }];
  }
  if (has(text, ['captions on', 'captions off', 'captions'])) {
    return [{ kind: 'captions', on: !has(text, ['off']), say: has(text, ['off']) ? 'Captions band.' : 'Captions on.' }];
  }

  if (has(text, ['photo badi', 'zoom in', 'badi karo', 'zoom out', 'next photo', 'previous photo', 'pichli photo', 'agli photo', 'slideshow', 'fullscreen', 'is photo mein kya'])) {
    const action = has(text, ['next', 'agli'])
      ? 'next'
      : has(text, ['previous', 'pichli'])
        ? 'previous'
        : has(text, ['out', 'chhoti'])
          ? 'zoom-out'
          : has(text, ['slideshow'])
            ? 'slideshow'
            : has(text, ['fullscreen'])
              ? 'fullscreen'
              : has(text, ['kya hai', 'mein kya'])
                ? 'describe'
                : 'zoom-in';
    return [{ kind: 'photo', action, open: 'memory-book', say: visualOpenLine('memory-book') }];
  }
  if (has(text, ['family photo', 'beti ki photo', 'daughter ki photo', 'rina wali', 'birthday', 'shillong', '2010'])) {
    const query = has(text, ['birthday']) ? 'birthday' : has(text, ['shillong']) ? 'shillong' : has(text, ['2010']) ? '2010' : 'family';
    return [{ kind: 'photo-search', query, open: 'memory-book', say: 'Photos Memory Book mein dhundh rahi hoon.' }];
  }

  if (has(text, ['last game', 'kal wala game', 'resume game', 'continue karo', 'jo kal khela'])) {
    const lastGame = loadGameLog()[0];
    return [{
      open: 'games',
      gameId: lastGame?.gameId || 'match-pairs',
      say: lastGame ? `${lastGame.title} wapas khol rahi hoon.` : 'Pehla memory game khol rahi hoon.',
    }];
  }
  if (has(text, ['mera score', 'meri progress', 'memory progress'])) {
    const snap = getProgressSnapshot();
    return [{ open: 'progress', say: `Is hafte accuracy ${snap.accuracy}%. Streak ${snap.streak} din.` }];
  }
  if (has(text, ['easy game', 'difficult game', 'memory game dhoondo', 'attention game', 'ye game samajh'])) {
    if (has(text, ['samajh'])) {
      return [{ kind: 'explain', say: explainScreen('games', { mode: 'how', gameId: gameId || 'match-pairs' }), open: gameId ? undefined : 'games' }];
    }
    const gameIdPick = has(text, ['easy', 'balloon']) ? 'balloon-pop' : has(text, ['difficult', 'sequence']) ? 'sequence' : 'match-pairs';
    return [{ open: 'games', gameId: gameIdPick, say: visualOpenLine('games', gameIdPick) }];
  }

  if (has(text, ['complete', 'ho gayi', 'le li', 'kar li', 'mark done', 'mark complete', 'tick kar', 'ho gaya', 'le liya', 'skip'])) {
    if (!(has(text, ['game', 'khel']) && !has(text, ['routine', 'dawa', 'walk', 'medicine']))) {
      const skip = has(text, ['skip']);
      const item = matchRoutineItem(text);
      if (item) {
        return [{
          kind: skip ? 'skip' : 'complete',
          itemId: item.id,
          title: item.title,
          open: 'routine',
          say: `${item.title} ${skip ? 'skip' : 'complete'} mark karti hoon.`,
        }];
      }
    }
  }

  if (has(text, ['note add', 'note lagao'])) {
    const task = findTask(text) || last;
    const note = text.replace(/.*note (add karo|lagao)( ki)?/i, '').trim() || 'Note saved';
    if (task) return [{ kind: 'note-task', taskId: task.id || task.taskId, note, say: 'Note save karti hoon.' }];
  }
  if (has(text, ['important mark', 'priority'])) {
    const task = findTask(text) || last;
    if (task) return [{ kind: 'priority', taskId: task.id || task.taskId, say: 'Important mark kiya.' }];
  }
  if (has(text, ['hata do', 'delete kar', 'reminder hata'])) {
    const task = findTask(text) || last;
    if (task) return [{ kind: 'delete-task', taskId: task.id || task.taskId, title: task.title, say: `${task.title} hata doon?` }];
  }
  if (has(text, ['duplicate', 'kal ke liye bhi', 'same task kal'])) {
    const task = findTask(text) || last;
    if (task) return [{ kind: 'duplicate-task', taskId: task.id || task.taskId, say: 'Kal ke liye copy bana rahi hoon.' }];
  }
  if (has(text, ['roz karna', 'har monday', 'repeat'])) {
    const task = findTask(text) || last;
    if (task) return [{ kind: 'repeat-task', taskId: task.id || task.taskId, repeat: has(text, ['monday']) ? 'weekly' : 'daily', say: 'Repeat laga diya.' }];
  }
  if (has(text, ['snooze', 'minute baad', 'aadhe ghante'])) {
    const mins = has(text, ['aadhe', '30']) ? 30 : has(text, ['15']) ? 15 : 10;
    const task = findTask(text) || last;
    return [{ kind: 'snooze', taskId: task?.id || task?.taskId, minutes: mins, say: `${mins} minute baad yaad dilungi.` }];
  }
  if (has(text, ['time', 'baje kar do', 'se ']) && has(text, ['kar do', 'shift', 'change']) && findTask(text)) {
    const task = findTask(text);
    const when = parseWhen(text);
    return [{ kind: 'edit-task', taskId: task.id, time: when.time, say: `${task.title} ka time badal rahi hoon.` }];
  }
  if (has(text, ['task bana', 'reminder laga', 'yaad dila', 'task bana do'])) {
    const when = parseWhen(text);
    const title = text
      .replace(/(kal|aaj|tomorrow|today|task bana do|reminder laga do|yaad dila do|yaad dilana|\d+\s*baje|minute baad)/g, ' ')
      .trim() || 'Reminder';
    return [{ kind: 'create-task', title, date: when.date, time: when.time, say: `“${title}” save kar di.` }];
  }
  if (has(text, ['mere aaj ke task', 'next task', 'kal ke task', 'tasks kya'])) {
    const day = has(text, ['kal']) ? shiftDate(todayKey(), 1) : todayKey();
    const rows = readTasks().filter((row) => row.date === day && !row.completed);
    const line = rows.length ? rows.map((row) => row.title).join(', ') : 'Koi extra task nahi. Routine dekho.';
    return [{ kind: 'reply', say: line, open: 'routine' }];
  }

  if (has(text, ['agli medicine', 'next medicine', 'aaj kitni medicine', 'meri medicine', 'meri dawa', 'dawa batao', 'ye medicine kisliye', 'kal dawa li'])) {
    const list = medicines();
    const next = list.find((row) => !row.completed);
    if (has(text, ['kisliye'])) return [{ kind: 'reply', say: next ? `${next.title}: ${next.subtitle}` : 'Saved medicine note nahi mili. Dosage nahi badalti.' }];
    if (has(text, ['kal dawa'])) return [{ kind: 'reply', say: 'Jo dawa kal complete mark hui, wahi history hai. Nayi dawa invent nahi karti.' }];
    if (has(text, ['kitni'])) return [{ kind: 'reply', say: `Aaj ${list.length} medicine items hain.`, open: 'routine' }];
    return [{ kind: 'reply', say: next ? `Agli: ${next.title} ${next.time}.` : 'Aaj ki dawa complete hai.', open: 'routine' }];
  }
  if (has(text, ['dawa ke', 'minute pehle reminder']) && has(text, ['reminder'])) {
    return [{ kind: 'create-task', title: 'Medicine reminder', say: 'Medicine reminder save kiya. Dosage nahi badli.' }];
  }

  if (has(text, ['check in', 'check-in', 'checkin', 'main safe', 'safe hoon', 'check in kar'])) {
    return [{ kind: 'check-in', open: 'safety', say: 'Safety check-in kar rahi hoon.' }];
  }
  if (has(text, ['location refresh', 'gps refresh', 'location update'])) {
    return [{ kind: 'location-refresh', open: 'safety', say: 'Location refresh kar rahi hoon.' }];
  }
  if (has(text, ['kahan hoon', 'where am i', 'meri location', 'location batao', 'safety status'])) {
    return [{ kind: 'location', say: 'Location dekh rahi hoon.' }];
  }
  if (has(text, ['family ko alert', 'help chahiye', 'bachao'])) {
    return [{ kind: 'alert-family', call: CIRCLE_MEMBERS[0], say: `${CIRCLE_MEMBERS[0].name} ko alert karun?` }];
  }

  if (has(text, ['appointment', 'doctor kab', 'next appointment'])) {
    return [{ kind: 'reply', say: 'Koi saved appointment nahi mili. Family se poochh kar add karo.' }];
  }
  if (has(text, ['notification', 'alerts batao', 'sab read'])) {
    return [{ kind: 'reply', say: 'Koi naya notification nahi. Emergency Help sidebar mein hai.' }];
  }

  if (has(text, ['naya document', 'document add', 'file upload', 'kaagaz add'])) {
    return [{ kind: 'reply', say: 'Documents khol di. File aapke phone se chunna hoga — main upload nahi kar sakti.', open: 'documents' }];
  }

  if (has(text, ['naam kar do', 'naam rakh', 'name change', 'profile naam'])) {
    const name = String(raw || '').replace(/.*(?:naam|name)\s+(?:kar do|rakh do|rakho|is|ko)\s*/i, '').replace(/kar do|rakh do/gi, '').trim();
    if (name) return [{ kind: 'profile-set', name, open: 'settings', say: `Naam “${name}” save karti hoon.` }];
  }
  if (has(text, ['mera naam', 'meri profile'])) {
    return [{ kind: 'profile', say: context.profileName ? `Aapka naam ${context.profileName} hai.` : 'Profile Settings mein hai.', open: 'settings' }];
  }

  if (has(text, ['message karo', 'sms', 'message bhejo', 'bata do ki'])) {
    const member = familyMember(text) || CIRCLE_MEMBERS[0];
    const body = has(text, ['theek hoon', "i'm okay", 'theek hun'])
      ? 'Main theek hoon.'
      : has(text, ['medicine le li', 'dawa le li'])
        ? 'Maine medicine le li.'
        : text.replace(/.*(message karo|sms|bata do)( ki)?/i, '').trim() || 'Main theek hoon.';
    return [{ kind: 'sms', call: member, body, say: `${member.name} ko yeh bhejun: “${body}”?` }];
  }

  if (has(text, ['dhoondo', 'find it', 'dhundo', 'search'])) {
    const q = text.replace(/.*(dhoondo|dhundo|find|search)/, '').trim() || text;
    const hits = searchIndex(q);
    if (!hits.length) return [{ kind: 'reply', say: 'Mujhe woh cheez saved data mein nahi mili.' }];
    return [hits[0].dest, { kind: 'reply', say: `${hits[0].title} mil gayi.` }];
  }

  const tagged = parseAssistActions(raw);
  const local = resolveAssistCommands(raw);
  const merged = [];
  const seen = new Set();
  [...tagged, ...local].forEach((dest) => {
    const key = destKey(dest) || `${dest.kind}:${dest.title || dest.action || dest.taskId || ''}`;
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(dest);
  });
  return merged;
}

export function spokenFor(dest) {
  if (!dest) return 'Theek hai.';
  if (dest.say) return dest.say;
  if (dest.call) return `${dest.call.name} ko call karun?`;
  if (dest.kind === 'speak') return 'Care Agent khol rahi hoon.';
  if (dest.kind === 'sms') return `${dest.call?.name} ko message bhejun?`;
  if (dest.gameId) {
    const game = ASSIST_GAMES.find((row) => row.id === dest.gameId);
    return visualOpenLine('games', dest.gameId) || `${game?.label || 'Game'} khol di.`;
  }
  if (dest.open) return visualOpenLine(dest.open);
  return 'Theek hai.';
}

export function runAssistAction(dest, deps) {
  const { openModule, openEmergency, updatePrefs, setLang, currentScale = 100 } = deps;
  const started = Date.now();

  const done = (line, extra = {}) => {
    pushAudit({ intent: dest.kind || dest.open, tool: dest.kind || 'open', success: true, latency: Date.now() - started, ...extra });
    return line;
  };

  if (dest.kind === 'stop' || dest.kind === 'reply' || dest.kind === 'explain' || dest.kind === 'simplify' || dest.kind === 'read-screen' || dest.kind === 'what-next' || dest.kind === 'summary' || dest.kind === 'help' || dest.kind === 'profile' || dest.kind === 'repeat') {
    if (dest.open) openModule?.(dest.open);
    return done(spokenFor(dest));
  }
  if (dest.kind === 'language' && dest.code) {
    pushUndo({ kind: 'language', prev: deps.currentLang });
    setLang?.(dest.code);
    return done(spokenFor(dest));
  }
  if (dest.kind === 'scale') {
    pushUndo({ kind: 'scale', prev: currentScale });
    const scale = dest.scale || (dest.dir === 'max' ? 160 : nextScale(currentScale, dest.dir));
    updatePrefs?.({ accessibility: { uiScale: scale } });
    return done(`Text ${scale}% kar diya.`);
  }
  if (dest.kind === 'contrast') {
    pushUndo({ kind: 'contrast', prev: !dest.on });
    updatePrefs?.({ accessibility: { highContrast: dest.on !== false } });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'captions') {
    updatePrefs?.({ privacy: { captions: dest.on !== false } });
    deps.onCaptions?.(dest.on !== false);
    return done(spokenFor(dest));
  }
  if (dest.kind === 'simple-mode') {
    updatePrefs?.({ accessibility: { simpleMode: dest.on !== false } });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'voice-rate') {
    updatePrefs?.({ voice: { rate: dest.rate } });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'photo') {
    openModule?.('memory-book');
    window.dispatchEvent(new CustomEvent('sarthi:photo-control', { detail: { action: dest.action } }));
    return done(spokenFor(dest));
  }
  if (dest.kind === 'memory-draft') {
    openModule?.('memory-book');
    writeMemoryDraft(dest.draft || {}, dest.ask);
    emitPage('sarthi:memory-form', {
      action: dest.draft?.title || dest.draft?.body ? 'fill' : 'start',
      fields: { ...(dest.draft || {}), _ask: dest.ask },
      ask: dest.ask,
      clear: dest.clear || [],
    });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'remove-album' && dest.album) {
    hideAlbum(dest.album);
    openModule?.('memory-book');
    return done(spokenFor(dest));
  }
  if (dest.kind === 'remove-memory' && dest.memoryId) {
    hideMemory(dest.memoryId);
    openModule?.('memory-book');
    return done(spokenFor(dest));
  }
  if (dest.kind === 'memory-save') {
    const draft = dest.draft || readJson(MEMORY_DRAFT_KEY, {});
    openModule?.('memory-book');
    emitPage('sarthi:memory-form', { action: 'save', fields: draft });
    try { localStorage.removeItem(MEMORY_DRAFT_KEY); } catch { /* ignore */ }
    return done(spokenFor(dest));
  }
  if (dest.kind === 'settings-draft') {
    try { localStorage.removeItem(MEMORY_DRAFT_KEY); } catch { /* ignore */ }
    openModule?.('settings');
    writeSettingsDraft(dest.draft || {}, dest.ask);
    emitPage('sarthi:settings-control', {
      action: dest.draft?.name ? 'fill' : 'start',
      fields: { ...(dest.draft || {}), _ask: dest.ask },
      ask: dest.ask,
      clear: dest.clear || [],
    });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'settings-save') {
    const draft = dest.draft || readJson(SETTINGS_DRAFT_KEY, {});
    updatePrefs?.({
      profile: {
        name: draft.name === '—' ? '' : (draft.name || ''),
        phone: draft.phone === '—' ? '' : (draft.phone || ''),
        state: draft.state === '—' ? '' : (draft.state || ''),
        district: draft.district === '—' ? '' : (draft.district || ''),
      },
    });
    openModule?.('settings');
    emitPage('sarthi:settings-control', { action: 'save', fields: draft });
    try { localStorage.removeItem(SETTINGS_DRAFT_KEY); } catch { /* ignore */ }
    return done('Profile save ho gaya.');
  }
  if (dest.kind === 'check-in') {
    openModule?.('safety');
    emitPage('sarthi:safety-control', { action: 'check-in' });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'location-refresh') {
    openModule?.('safety');
    emitPage('sarthi:safety-control', { action: 'refresh' });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'profile-set' && dest.name) {
    updatePrefs?.({ profile: { name: dest.name } });
    openModule?.('settings');
    emitPage('sarthi:settings-control', { action: 'fill-profile', profile: { name: dest.name } });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'complete' && dest.itemId) {
    pushUndo({ kind: 'complete', itemId: dest.itemId });
    markRoutineDone(dest.itemId);
    pingLive?.();
    enqueueOffline({ kind: 'complete', itemId: dest.itemId });
    openModule?.('routine');
    emitPage('sarthi:routine-control', { action: dest.kind === 'skip' ? 'skip' : 'complete', itemId: dest.itemId });
    return done(`${dest.title} complete.`);
  }
  if (dest.kind === 'skip' && dest.itemId) {
    pushUndo({ kind: 'complete', itemId: dest.itemId });
    markRoutineDone(dest.itemId);
    pingLive?.();
    openModule?.('routine');
    emitPage('sarthi:routine-control', { action: 'skip', itemId: dest.itemId });
    return done(`${dest.title} skip.`);
  }
  if (dest.kind === 'create-task') {
    const row = {
      id: `task-${Date.now()}`,
      title: dest.title,
      date: dest.date || todayKey(),
      time: dest.time || '',
      notes: '',
      priority: 'normal',
      repeat: 'none',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const all = [{ ...row }, ...readJson(TASKS_KEY, [])];
    writeTasks(all);
    pushUndo({ kind: 'create-task', taskId: row.id });
    enqueueOffline({ kind: 'create-task', row });
    return done(`${dest.title} save ho gaya.`);
  }
  if (dest.kind === 'edit-task' && dest.taskId) {
    const all = readJson(TASKS_KEY, []);
    const prev = all.find((row) => row.id === dest.taskId);
    writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, time: dest.time || row.time, title: dest.title || row.title } : row)));
    pushUndo({ kind: 'edit-task', prev });
    return done(spokenFor(dest));
  }
  if (dest.kind === 'note-task' && dest.taskId) {
    const all = readJson(TASKS_KEY, []);
    writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, notes: dest.note } : row)));
    return done('Note save ho gaya.');
  }
  if (dest.kind === 'priority' && dest.taskId) {
    const all = readJson(TASKS_KEY, []);
    writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, priority: 'high' } : row)));
    return done('Important mark kiya.');
  }
  if (dest.kind === 'delete-task' && dest.taskId) {
    const all = readJson(TASKS_KEY, []);
    const prev = all.find((row) => row.id === dest.taskId);
    writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, deleted: true } : row)));
    pushUndo({ kind: 'delete-task', prev });
    return done(`${dest.title || 'Task'} hata diya.`);
  }
  if (dest.kind === 'duplicate-task' && dest.taskId) {
    const src = readJson(TASKS_KEY, []).find((row) => row.id === dest.taskId);
    if (!src) return done('Woh task nahi mila.');
    const copy = { ...src, id: `task-${Date.now()}`, date: shiftDate(src.date || todayKey(), 1), deleted: false };
    writeTasks([copy, ...readJson(TASKS_KEY, [])]);
    return done('Kal ke liye copy ban gayi.');
  }
  if (dest.kind === 'repeat-task' && dest.taskId) {
    const all = readJson(TASKS_KEY, []);
    writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, repeat: dest.repeat || 'daily' } : row)));
    return done('Repeat laga diya.');
  }
  if (dest.kind === 'snooze') {
    const until = Date.now() + (dest.minutes || 10) * 60000;
    if (dest.taskId) {
      const all = readJson(TASKS_KEY, []);
      writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, snoozeUntil: until } : row)));
    }
    return done(spokenFor(dest));
  }
  if (dest.kind === 'reschedule') {
    const all = readJson(TASKS_KEY, []);
    const prev = all.find((row) => row.id === dest.taskId);
    if (prev) {
      writeTasks(all.map((row) => (row.id === dest.taskId ? { ...row, date: shiftDate(row.date || todayKey(), dest.days || 1) } : row)));
      pushUndo({ kind: 'edit-task', prev });
      return done('Kal ke liye shift ho gaya.');
    }
    return done('Jo task chal raha tha woh nahi mila. Pehle naam lo.');
  }
  if (dest.kind === 'undo') {
    const stack = readJson(UNDO_KEY, []);
    const last = stack[0];
    if (!last) return done('Wapas karne layak last action nahi mili.');
    writeJson(UNDO_KEY, stack.slice(1));
    if (last.kind === 'complete' && last.itemId) {
      unmarkRoutineDone(last.itemId);
      pingLive?.();
      return done('Complete wapas le liya.');
    }
    if (last.kind === 'scale') {
      updatePrefs?.({ accessibility: { uiScale: last.prev || 100 } });
      return done('Text size wapas.');
    }
    if (last.kind === 'language' && last.prev) {
      setLang?.(last.prev);
      return done('Language wapas.');
    }
    if (last.kind === 'create-task' && last.taskId) {
      writeTasks(readJson(TASKS_KEY, []).map((row) => (row.id === last.taskId ? { ...row, deleted: true } : row)));
      return done('Naya task hata diya.');
    }
    if (last.kind === 'delete-task' && last.prev) {
      writeTasks(readJson(TASKS_KEY, []).map((row) => (row.id === last.prev.id ? { ...last.prev, deleted: false } : row)));
      return done('Task wapas aa gaya.');
    }
    if (last.kind === 'edit-task' && last.prev) {
      writeTasks(readJson(TASKS_KEY, []).map((row) => (row.id === last.prev.id ? last.prev : row)));
      return done('Edit wapas.');
    }
    return done('Ye action reverse nahi kiya ja sakta.');
  }
  if (dest.kind === 'photo-search') {
    openModule?.('memory-book');
    window.dispatchEvent(new CustomEvent('sarthi:photo-control', { detail: { action: 'search', query: dest.query } }));
    return done(spokenFor(dest));
  }
  if (dest.kind === 'location') {
    if (!navigator.geolocation) return done('Main abhi aapki location confirm nahi kar pa rahi hoon.');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        deps.onLocation?.(`Aap yahan ho: ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}.`);
      },
      () => deps.onLocation?.('Main abhi aapki location confirm nahi kar pa rahi hoon.'),
      { timeout: 8000 },
    );
    return done(spokenFor(dest));
  }
  if (dest.kind === 'sms' && dest.call) {
    const phone = String(dest.call.phone || '').replace(/\D/g, '');
    const body = encodeURIComponent(dest.body || 'Main theek hoon.');
    if (phone) window.location.href = `sms:${phone}?body=${body}`;
    return done(`${dest.call.name} ko message draft khol diya.`);
  }
  if (dest.kind === 'alert-family' && dest.call) {
    const phone = String(dest.call.phone || '').replace(/\D/g, '');
    if (phone) window.location.href = `sms:${phone}?body=${encodeURIComponent('Help chahiye. Sarthi Assist se.')}`;
    return done(`${dest.call.name} ko alert draft khol diya.`);
  }
  if (dest.kind === 'speak') {
    openModule?.('ai', {
      startVoice: true,
      assistHandoff: {
        source: 'assist',
        intent: dest.intent || 'talk',
        memoryId: dest.memoryId,
        photoId: dest.photoId,
        topic: dest.topic,
        language: dest.language,
      },
    });
    return done(spokenFor(dest));
  }
  if (dest.call) {
    const phone = String(dest.call.phone || '').replace(/\D/g, '');
    if (phone) window.location.href = `tel:${phone}`;
    return done(`${dest.call.name} ko call lag rahi hai.`);
  }
  if (dest.open === 'help' || dest.kind === 'emergency') {
    openEmergency?.();
    return done('Emergency numbers khol diye.');
  }
  if (dest.open) {
    openModule?.(dest.open, dest.gameId ? { gameId: dest.gameId } : {});
    return done(spokenFor(dest));
  }
  return done(spokenFor(dest));
}

export function familyHint() {
  return CIRCLE_MEMBERS.map((row) => `${row.name} (${row.relation})`).join(', ');
}

export { visualOpenLine, explainScreen, readScreen };
