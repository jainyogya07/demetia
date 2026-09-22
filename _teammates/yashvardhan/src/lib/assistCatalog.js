import { CIRCLE_MEMBERS, getRoutineItems } from './liveState.js';
import { albumFromRemoveTag } from './memoryAlbums.js';

/** Keep in sync with BrainGames GAME_LIST ids — do not import BrainGames (circular). */
export const ASSIST_GAMES = [
  { id: 'story-solver', label: 'Past stories', aliases: ['past stories', 'kahani', 'kahaniyan', 'कहानी', 'কথা', 'story', 'stories', 'story solver', 'purani kahani'] },
  { id: 'match-pairs', label: 'Match pairs', aliases: ['match pairs', 'match the pairs', 'pairs', 'cards', 'jodi', 'matching', 'jooth', 'card game'] },
  { id: 'spot-diff', label: 'Spot difference', aliases: ['spot the difference', 'spot difference', 'difference', 'farak', 'फर्क', 'do tasveer'] },
  { id: 'balloon-pop', label: 'Balloon pop', aliases: ['balloon', 'balloon pop', 'gubbara', 'गुब्बारा', 'balloons'] },
  { id: 'sequence', label: 'Sequence', aliases: ['sequence', 'sequence recall', 'order', 'kram', 'क्रम', 'yaad kram'] },
  { id: 'faces', label: 'Familiar faces', aliases: ['familiar faces', 'faces', 'chehra', 'chehre', 'चेहरा', 'chehra pehchano'] },
  { id: 'object-find', label: 'Find object', aliases: ['find the object', 'object find', 'vastu', 'cheez dhoondo', 'find object', 'household'] },
];

const SCREEN_DEFS = [
  { id: 'home', open: 'home', label: 'Home', say: 'Home — daily dashboard', aliases: ['home', 'dashboard', 'shuruwat', 'shuru', 'होम', 'ঘৰ', 'main page', 'pehle page'] },
  { id: 'games', open: 'games', label: 'Games', say: 'Brain games', aliases: ['game', 'games', 'khel', 'khelo', 'khelna', 'puzzle', 'खेल', 'খেল', 'dimag', 'brain game', 'brain games'] },
  { id: 'stories', open: 'games', gameId: 'story-solver', label: 'Past stories', say: 'Past stories — a memory told aloud', aliases: ['past stor', 'kahani', 'कहानी', 'কথা', 'story', 'stories'] },
  { id: 'routine', open: 'routine', label: 'Routine', say: 'Today’s routine', aliases: ['routine', 'dincharya', 'schedule', 'aaj kya kar', 'today task', 'दिनचर्या', 'ৰুটিন', 'din ka kaam', 'timetable'] },
  { id: 'medicine', open: 'medicine', label: 'Medicine', say: 'Medicine and schemes', aliases: ['dawa', 'dawai', 'medicine', 'tablet', 'tablets', 'pill', 'pills', 'औषध', 'दवा', 'ঔষধ', 'oushod', 'scheme', 'schemes', 'ayushman', 'nphce'] },
  { id: 'progress', open: 'progress', label: 'Progress', say: 'Memory progress', aliases: ['progress', 'score', 'kitna yaad', 'memory progress', 'ank', 'scoreboard'] },
  { id: 'care-circle', open: 'care-circle', label: 'Family', say: 'Family care circle', aliases: ['care circle', 'parivar', 'family', 'family circle', 'परिवार', 'ghar wale', 'circle'] },
  { id: 'safety', open: 'safety', label: 'Safety', say: 'Safety — Zoo Road, Guwahati', aliases: ['safety', 'map', 'location', 'gps'] },
  { id: 'memory-book', open: 'memory-book', label: 'Memory Book', say: 'Memory Book — photos', aliases: ['memory book', 'memorybook', 'photo', 'photos', 'album', 'albums', 'tasveer', 'फोटो', 'ফটো', 'purani photo', 'family photo', 'nayi memory', 'add memory', 'yaad likho', 'special memory'] },
  { id: 'language', open: 'language', label: 'Language', say: 'Language and large type', aliases: ['bhasha', 'language', 'assamese', 'khasi', 'हिन्दी', 'অসমী', 'hindi', 'english'] },
  { id: 'documents', open: 'documents', label: 'Documents', say: 'My documents', aliases: ['document', 'documents', 'kagaz', 'kaagaz', 'paper', 'file', 'कागज', 'papers', 'documents kholo', 'my documents'] },
  { id: 'settings', open: 'settings', label: 'Settings', say: 'Settings', aliases: ['setting', 'settings', 'setting khol', 'awaz setting', 'voice change', 'avatar', 'profile', 'profile edit', 'naam phone', 'settings page'] },
  { id: 'help', open: 'help', label: 'Emergency', say: 'Emergency — 112, Elderline, Tele-MANAS', aliases: ['emergency', '112', 'bachao', 'elderline', 'tele-manas', 'tele manas', 'help now', 'madad abhi'] },
];

export const ASSIST_SCREENS = SCREEN_DEFS.map(({ id, open, gameId, label, say }) => ({
  id, open, gameId, label, say,
}));

const CALL_VERBS = ['call', 'phone', 'fon', 'फोन', 'কল', 'ring', 'dial', 'lagao', 'lagao phone'];
const SPEAK_VERBS = ['gupshup', 'care agent', 'companion', 'speak with', 'ai se baat', 'dost se baat'];
const STOP = new Set([
  'a', 'an', 'the', 'to', 'my', 'me', 'please', 'kholo', 'khol', 'dikhao', 'dikha', 'chalo', 'jao',
  'open', 'show', 'go', 'meri', 'mera', 'mere', 'mujhe', 'ko', 'ki', 'ke', 'ka', 'mein', 'me', 'se',
  'hai', 'hain', 'karo', 'kar', 'do', 'please', 'aap', 'ji', 'na', 'ek', 'ye', 'yeh', 'wo', 'woh',
  'the', 'for', 'of', 'and', 'aur', 'phir', 'then', 'page', 'screen', 'wala', 'wali',
]);
const CLAUSE_SPLIT = /\s*(?:,+|।|;|\baur\b|\band\b|\bphir\b|\bthen\b|\bbaad\b|और|আৰু|এবং|फिर)\s*/i;

const PARSE_DEBOUNCE_MS = 190;
const CLAUSE_GAP_MS = 280;
const INDEX_TTL_MS = 12000;

export { PARSE_DEBOUNCE_MS, CLAUSE_GAP_MS };

function fold(raw) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[?.!,।;:()[\]{}"“”‘’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(raw) {
  const text = fold(raw);
  if (!text) return [];
  const parts = text.split(' ').filter(Boolean);
  const out = [];
  for (let i = 0; i < parts.length; i += 1) {
    const w = parts[i];
    out.push(w);
    if (i + 1 < parts.length) out.push(`${w} ${parts[i + 1]}`);
  }
  return out;
}

function splitClauses(raw) {
  const prepared = String(raw || '')
    .toLowerCase()
    .normalize('NFKC');
  if (!prepared.trim()) return [];
  return prepared
    .split(CLAUSE_SPLIT)
    .map((c) => fold(c))
    .filter((c) => c.length >= 2);
}

function trieNode() {
  return { ch: new Map(), ids: [] };
}

function trieInsert(root, token, id) {
  let node = root;
  for (let i = 0; i < token.length; i += 1) {
    const c = token[i];
    let next = node.ch.get(c);
    if (!next) {
      next = trieNode();
      node.ch.set(c, next);
    }
    node = next;
  }
  if (!node.ids.includes(id)) node.ids.push(id);
}

function collectTokenHits(index, token, into) {
  const exact = index.inv.get(token);
  if (exact) {
    for (let i = 0; i < exact.length; i += 1) {
      const hit = exact[i];
      into.set(hit.id, (into.get(hit.id) || 0) + hit.w);
    }
  }
  if (token.length < 3 || token.includes(' ')) return;
  let node = index.trie;
  for (let i = 0; i < token.length; i += 1) {
    node = node.ch.get(token[i]);
    if (!node) return;
    if (i >= 2 && node.ids.length) {
      for (let j = 0; j < node.ids.length; j += 1) {
        const id = node.ids[j];
        into.set(id, (into.get(id) || 0) + Math.max(2, token.length - 1));
      }
    }
  }
  const stack = [node];
  let extra = 0;
  while (stack.length && extra < 8) {
    const n = stack.pop();
    for (let j = 0; j < n.ids.length; j += 1) {
      const id = n.ids[j];
      if (!into.has(id)) {
        into.set(id, 3);
        extra += 1;
      }
    }
    n.ch.forEach((child) => stack.push(child));
  }
}

function addTokens(index, id, aliases, weight) {
  const w = weight || 4;
  for (let a = 0; a < aliases.length; a += 1) {
    const phrase = fold(aliases[a]);
    if (!phrase) continue;
    const parts = phrase.split(' ').filter(Boolean);
    const bag = [phrase, ...parts];
    for (let p = 0; p < bag.length; p += 1) {
      const tok = bag[p];
      if (STOP.has(tok) && tok !== phrase) continue;
      let list = index.inv.get(tok);
      if (!list) {
        list = [];
        index.inv.set(tok, list);
      }
      list.push({ id, w: tok === phrase ? w + phrase.length : w });
      if (!tok.includes(' ')) trieInsert(index.trie, tok, id);
    }
  }
}

function pushEntry(index, row) {
  const id = index.entries.length;
  index.entries.push({ ...row, id });
  addTokens(index, id, row.aliases, row.weight);
  if (row.require) index.require.set(id, row.require.map(fold));
  return id;
}

function destFromOpenId(id) {
  const key = String(id || '').toLowerCase();
  if (key === 'ai' || key === 'companion' || key === 'speak' || key === 'care-agent') {
    return { kind: 'speak' };
  }
  if (!key) return null;
  if (key === 'stories' || key === 'story-solver') return { open: 'games', gameId: 'story-solver' };
  const game = ASSIST_GAMES.find((g) => g.id === key);
  if (game) return { open: 'games', gameId: game.id };
  const screen = SCREEN_DEFS.find((s) => s.id === key || s.open === key);
  if (screen) return { open: screen.open, gameId: screen.gameId };
  return { open: key };
}

export function destKey(dest) {
  if (!dest) return '';
  if (dest.call?.id) return `call:${dest.call.id}`;
  if (dest.kind === 'speak') return 'speak';
  if (dest.kind === 'orient-day') return 'orient-day';
  if (dest.kind === 'complete' || dest.kind === 'skip') return `complete:${dest.itemId || dest.title || ''}`;
  if (dest.kind === 'memory-draft' || dest.kind === 'memory-save') return `memory:${dest.kind}:${dest.ask || 'save'}`;
  if (dest.kind === 'remove-album') return `memory:remove:${dest.album || ''}`;
  if (dest.kind === 'remove-memory') return `memory:remove-item:${dest.memoryId || ''}`;
  if (dest.kind === 'settings-draft' || dest.kind === 'settings-save') return `settings:${dest.kind}:${dest.ask || 'save'}`;
  if (dest.kind === 'check-in') return 'check-in';
  if (dest.open === 'help' || dest.kind === 'emergency') return 'emergency';
  return `nav:${dest.open || dest.id || ''}:${dest.gameId || ''}`;
}

function buildIndex() {
  const index = {
    entries: [],
    inv: new Map(),
    trie: trieNode(),
    require: new Map(),
    builtAt: Date.now(),
  };

  for (let i = 0; i < SCREEN_DEFS.length; i += 1) {
    const s = SCREEN_DEFS[i];
    pushEntry(index, {
      key: destKey({ open: s.open, gameId: s.gameId }),
      dest: { open: s.open, gameId: s.gameId },
      label: s.label,
      say: s.say,
      group: 'screens',
      aliases: s.aliases,
      weight: s.id === 'memory-book' ? 8 : s.id === 'documents' ? 8 : 5,
      require: s.id === 'memory-book' ? ['memory book', 'memorybook', 'photo', 'photos', 'album', 'tasveer', 'फोटो', 'purani photo'] : undefined,
    });
  }

  for (let i = 0; i < ASSIST_GAMES.length; i += 1) {
    const g = ASSIST_GAMES[i];
    pushEntry(index, {
      key: destKey({ open: 'games', gameId: g.id }),
      dest: { open: 'games', gameId: g.id },
      label: g.label,
      say: g.label,
      group: 'games',
      aliases: g.aliases,
      weight: 7,
    });
  }

  for (let i = 0; i < CIRCLE_MEMBERS.length; i += 1) {
    const m = CIRCLE_MEMBERS[i];
    const relation = fold(m.relation);
    const extra = [];
    if (m.id === 'rina') extra.push('beti', 'daughter', 'anjali', 'बेटी', 'জীয়েক');
    if (m.id === 'doom') extra.push('beta', 'son', 'बेटा');
    if (m.id === 'mina') extra.push('asha', 'nurse', 'health worker', 'mina di');
    pushEntry(index, {
      key: destKey({ call: m }),
      dest: { call: m },
      label: `Call ${m.name}`,
      say: `Call ${m.name} (${m.relation})`,
      group: 'family',
      aliases: [m.name, m.id, relation, ...extra, ...CALL_VERBS],
      require: CALL_VERBS,
      weight: 9,
    });
  }

  pushEntry(index, {
    key: 'speak',
    dest: { kind: 'speak' },
    label: 'Speak',
    say: 'Use Speak for Care Agent',
    group: 'actions',
    aliases: SPEAK_VERBS.concat(['companion kholo', 'care agent se baat', 'gupshup karo']),
    require: SPEAK_VERBS,
    weight: 4,
  });

  pushEntry(index, {
    key: 'orient-day',
    dest: { kind: 'orient-day' },
    label: 'Today',
    say: 'What day it is',
    group: 'actions',
    aliases: [
      'aaj kaun sa din', 'aaj kya din', 'what day', 'what day is it', 'aaj tarikh',
      "today's date", 'aaj ka din', 'kaun sa din', 'কি দিন', 'আজি কি দিন',
      'आज कौन सा दिन', 'din kya hai', 'date kya hai', 'tarikh',
    ],
    weight: 8,
  });

  pushEntry(index, {
    key: 'nav:safety:',
    dest: { open: 'safety', kind: 'orient-place' },
    label: 'Where am I',
    say: 'Home on Zoo Road, Guwahati',
    group: 'actions',
    aliases: [
      'where am i', 'kahan hoon', 'kaha hun', 'main kahan', 'ghar kahan',
      'yeh kahan', 'where is home', 'मैं कहाँ', 'মই কত', 'ghar pe',
    ],
    weight: 8,
  });

  pushEntry(index, {
    key: 'nav:routine:',
    dest: { open: 'routine', kind: 'summary' },
    label: 'Today’s list',
    say: 'Today’s remaining tasks',
    group: 'actions',
    aliases: ['aaj kya hai', "today's tasks", 'today summary', 'aaj ka summary', 'kya pending', 'aaj kya karna'],
    weight: 6,
  });

  pushEntry(index, {
    key: 'nav:medicine:',
    dest: { open: 'medicine', kind: 'next-med' },
    label: 'Next medicine',
    say: 'Next medicine time',
    group: 'actions',
    aliases: ['kab leni', 'when to take', 'agli dawa', 'next medicine', 'medicine time', 'timing dawa'],
    weight: 7,
  });

  const items = getRoutineItems();
  for (let i = 0; i < items.length; i += 1) {
    const row = items[i];
    const open = row.type === 'medicine' ? 'medicine' : row.type === 'brain' ? 'games' : 'routine';
    pushEntry(index, {
      key: destKey({ open }),
      dest: { open, kind: 'routine-item', itemId: row.id },
      label: row.title,
      say: `${row.title} at ${row.time}`,
      group: 'actions',
      aliases: [row.title, row.type, row.subtitle],
      weight: 5,
    });
  }

  return index;
}

let cachedIndex = null;

function getIndex() {
  const now = Date.now();
  if (cachedIndex && now - cachedIndex.builtAt < INDEX_TTL_MS) return cachedIndex;
  cachedIndex = buildIndex();
  return cachedIndex;
}

function lookupClause(index, clause) {
  const text = fold(clause);
  if (text.length < 3) return null;
  const scores = new Map();
  const toks = tokenize(text);
  for (let i = 0; i < toks.length; i += 1) collectTokenHits(index, toks[i], scores);
  if (!scores.size) return null;

  let best = null;
  let bestScore = 0;
  scores.forEach((score, id) => {
    const req = index.require.get(id);
    if (req && !req.some((r) => text.includes(r))) return;
    const row = index.entries[id];
    if (score > bestScore) {
      bestScore = score;
      best = row;
    } else if (score === bestScore && best && (row.weight || 0) > (best.weight || 0)) {
      best = row;
    }
  });
  if (!best || bestScore < 5) return null;
  if (best.dest?.kind === 'speak') {
    let screen = null;
    let screenScore = 0;
    scores.forEach((score, id) => {
      const row = index.entries[id];
      if (!row || row.dest?.kind === 'speak') return;
      const req = index.require.get(id);
      if (req && !req.some((r) => text.includes(r))) return;
      if (score >= 5 && score >= screenScore) {
        screen = row;
        screenScore = score;
      }
    });
    if (screen) return screen;
  }
  return best;
}

function callsFromUtterance(text) {
  const t = fold(text);
  if (!CALL_VERBS.some((v) => t.includes(fold(v)))) return [];
  const hits = [];
  for (let i = 0; i < CIRCLE_MEMBERS.length; i += 1) {
    const m = CIRCLE_MEMBERS[i];
    const name = fold(m.name);
    const rel = fold(m.relation);
    if (t.includes(name) || t.includes(m.id)) hits.push({ call: m });
    else if (m.id === 'rina' && (/beti|daughter|बेटी/.test(t))) hits.push({ call: m });
    else if (m.id === 'doom' && (/beta|\bson\b|बेटा/.test(t))) hits.push({ call: m });
    else if (rel.length > 2 && t.includes(rel)) hits.push({ call: m });
  }
  return hits;
}

export function resolveAssistCommands(raw) {
  const text = fold(raw);
  if (text.length < 3) return [];
  const index = getIndex();
  const seen = new Set();
  const dests = [];

  const calls = callsFromUtterance(text);
  for (let i = 0; i < calls.length; i += 1) {
    const key = destKey(calls[i]);
    if (seen.has(key)) continue;
    seen.add(key);
    dests.push(calls[i]);
  }

  const clauses = splitClauses(raw);
  const parts = clauses.length ? clauses : [text];
  for (let i = 0; i < parts.length; i += 1) {
    const row = lookupClause(index, parts[i]);
    if (!row || row.dest.kind === 'speak') {
      if (row?.dest.kind === 'speak' && !seen.has('speak')) {
        seen.add('speak');
        dests.push(row.dest);
      }
      continue;
    }
    if (row.dest.call && calls.length) continue;
    const key = row.key || destKey(row.dest);
    if (seen.has(key)) continue;
    seen.add(key);
    dests.push(row.dest);
  }
  return dests;
}

export function resolveAssistCommand(raw) {
  return resolveAssistCommands(raw)[0] || null;
}

export function assistContextBlock(ctx = {}) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const day = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const items = getRoutineItems();
  const next = items.find((row) => !row.completed);
  const family = CIRCLE_MEMBERS.map((m) => `${m.name} (${m.relation}, ${m.phone})`).join('; ');
  const screens = ASSIST_SCREENS.map((s) => s.id).join(', ');
  const games = ASSIST_GAMES.map((g) => g.id).join(', ');
  const here = ctx.currentModuleId || 'home';
  const game = ctx.activeGameId ? ` activeGame=${ctx.activeGameId}` : '';
  return `NOW: ${day}, ${time}. Next: ${next ? `${next.title} ${next.time}` : 'all done'}.
CURRENT SCREEN the patient can see: ${here}${game}.
If they ask how this tab works, explain ${here} (what it is, what to tap). Do not reopen ${here}.
Family: ${family}. Home: Zoo Road, Guwahati.
OPEN ids: ${screens}. Game ids: ${games}. CALL: rina doom mina.
Never OPEN ai. Never say Speak dabaiye. Open the named screen. Care Agent only if they say gupshup or Care Agent.`;
}

export function assistChipGroups() {
  return [
    { title: 'Screens', items: ASSIST_SCREENS },
    { title: 'Games', items: ASSIST_GAMES.map((g) => ({ id: g.id, open: 'games', gameId: g.id, label: g.label, say: g.label })) },
    {
      title: 'Family',
      items: CIRCLE_MEMBERS.map((m) => ({
        id: `call-${m.id}`,
        call: m,
        label: `Call ${m.name}`,
        say: `Call ${m.name}`,
      })),
    },
  ];
}

export function parseSpokenNav(text) {
  return resolveAssistCommand(text);
}

export function parseAssistOpen(text) {
  const dests = parseAssistActions(text).filter((d) => d.open);
  return dests.length ? dests[dests.length - 1] : null;
}

export function parseAssistCall(text) {
  const dests = parseAssistActions(text).filter((d) => d.call);
  return dests.length ? dests[dests.length - 1].call : null;
}

export function parseAssistActions(text) {
  const raw = String(text || '');
  const dests = [];
  const seen = new Set();
  const re = /<<(OPEN|CALL|COMPLETE|MEMORY|SETTINGS|CHECKIN):([a-z0-9-]+)>>/gi;
  let m = re.exec(raw);
  while (m) {
    const kind = m[1].toUpperCase();
    const id = m[2].toLowerCase();
    let dest = null;
    if (kind === 'CALL') {
      const member = CIRCLE_MEMBERS.find((row) => row.id === id);
      if (member) dest = { call: member };
    } else if (kind === 'COMPLETE') {
      const items = getRoutineItems();
      const item = id === 'next'
        ? items.find((row) => !row.completed)
        : items.find((row) => row.id === id || fold(row.type) === id);
      if (item) dest = { kind: 'complete', itemId: item.id, title: item.title, open: 'routine' };
    } else if (kind === 'MEMORY') {
      if (id === 'new' || id === 'add') dest = { kind: 'memory-draft', ask: 'title', draft: {}, open: 'memory-book', say: 'Memory Book khol di. Title bolo — is yaad ka chhota naam.' };
      if (id === 'save') dest = { kind: 'memory-save', open: 'memory-book', say: 'Save kar rahi hoon.' };
      if (id.startsWith('remove')) {
        const album = albumFromRemoveTag(id);
        if (album) dest = { kind: 'remove-album', album, open: 'memory-book', say: `${album} book hata di.` };
      }
    } else if (kind === 'SETTINGS') {
      if (id === 'edit' || id === 'profile' || id === 'fill') dest = { kind: 'settings-draft', ask: 'name', draft: {}, open: 'settings', say: 'Settings khol di. Naam bolo.' };
      if (id === 'save') dest = { kind: 'settings-save', open: 'settings', say: 'Profile save kar rahi hoon.' };
    } else if (kind === 'CHECKIN') {
      dest = { kind: 'check-in', open: 'safety', say: 'Safety check-in kar rahi hoon.' };
    } else {
      dest = destFromOpenId(id);
    }
    const key = destKey(dest);
    if (dest && key && !seen.has(key)) {
      seen.add(key);
      dests.push(dest);
    }
    m = re.exec(raw);
  }
  return dests;
}

export function stripAssistTags(text) {
  return String(text || '')
    .replace(/<<(OPEN|CALL|COMPLETE|MEMORY|SETTINGS|CHECKIN):[a-z0-9-]+>>/gi, '')
    .trim();
}

export function isWakePhrase(text) {
  const t = fold(text);
  return /saarthi|sarthi|sarathy|सारथी|स्मृति\s*सारथी|\bguide\b/.test(t);
}

export function navigates(dest) {
  if (!dest) return false;
  if (dest.kind === 'speak' || dest.kind === 'orient-day') return false;
  return Boolean(dest.open || dest.call);
}
