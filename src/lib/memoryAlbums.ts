const HIDDEN_KEY = 'sarthi-hidden-albums-v1';

export const MEMORY_ALBUMS = [
  { title: 'My Family', album: 'My Family', aliases: ['family', 'parivar', 'my family', 'ghar wale'] },
  { title: 'My Home & Village', album: 'My Home & Village', aliases: ['village', 'home village', 'my home', 'ghar', 'gaon'] },
  { title: 'Special Moments', album: 'Special Moments', aliases: ['special', 'special moments', 'special memory'] },
  { title: 'Favorite Sounds', album: 'Favorite Sounds', aliases: ['sound', 'sounds', 'favorite sounds', 'awaaz', 'awaz'], type: 'sound' },
];

function readHidden() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHidden(rows) {
  try {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export function hiddenAlbums() {
  return readHidden();
}

export function isAlbumHidden(name) {
  return readHidden().includes(name);
}

export function hideAlbum(name) {
  const next = [...new Set([...readHidden(), name])];
  writeHidden(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sarthi:memory-album', { detail: { action: 'remove', album: name } }));
  }
  return next;
}

const MEMORY_IDS_KEY = 'sarthi-hidden-memories-v1';

function readHiddenIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MEMORY_IDS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function hiddenMemoryIds() {
  return readHiddenIds();
}

export function hideMemory(id) {
  const key = String(id || '');
  if (!key) return readHiddenIds();
  const next = [...new Set([...readHiddenIds(), key])];
  try {
    localStorage.setItem(MEMORY_IDS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sarthi:memory-item', { detail: { action: 'remove', id: key } }));
  }
  return next;
}

export function matchAlbumName(raw) {
  const text = String(raw || '').toLowerCase();
  const hit = MEMORY_ALBUMS.find((row) => row.aliases.some((alias) => text.includes(alias)) || text.includes(row.album.toLowerCase()));
  return hit?.album || '';
}

export function albumFromRemoveTag(id) {
  const key = String(id || '').toLowerCase();
  if (key.includes('family') || key.includes('parivar')) return 'My Family';
  if (key.includes('village') || key.includes('home')) return 'My Home & Village';
  if (key.includes('special')) return 'Special Moments';
  if (key.includes('sound')) return 'Favorite Sounds';
  return '';
}
