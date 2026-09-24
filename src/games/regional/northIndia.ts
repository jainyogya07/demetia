/** North India / Hindi — Ganga, Taj Mahal, Diya, Kites */

export const sorting = {
  id: 'hindi-sorting',
  title: 'Chaat Street Food',
  subtitle: 'चाट',
  emoji: '🍽️',
  instruction: 'Sort the chaat ingredients into sweet and spicy categories',
  bgColor: '#fff8e1',
  categories: [
    { id: 'sweet', label: 'Meetha (Sweet)', emoji: '🍬', color: '#FF8F00' },
    { id: 'spicy', label: 'Teekha (Spicy)', emoji: '🌶️', color: '#D32F2F' },
    { id: 'crunchy', label: 'Kurkura (Crunchy)', emoji: '🥜', color: '#795548' },
  ],
  items: [
    { id: 1, label: 'Tamarind Chutney', emoji: '🟤', category: 'sweet' },
    { id: 2, label: 'Green Chili', emoji: '🌶️', category: 'spicy' },
    { id: 3, label: 'Sev', emoji: '🍜', category: 'crunchy' },
    { id: 4, label: 'Sweet Yogurt', emoji: '🥛', category: 'sweet' },
    { id: 5, label: 'Mint Chutney', emoji: '🟢', category: 'spicy' },
    { id: 6, label: 'Papdi', emoji: '🥠', category: 'crunchy' },
    { id: 7, label: 'Jaggery', emoji: '🍯', category: 'sweet' },
    { id: 8, label: 'Red Chili', emoji: '🔴', category: 'spicy' },
    { id: 9, label: 'Peanuts', emoji: '🥜', category: 'crunchy' },
  ],
};

export const rhythm = {
  id: 'hindi-rhythm',
  title: 'Ganga Aarti Diya',
  subtitle: 'गंगा आरती',
  emoji: '🪔',
  instruction: 'Tap gently to light the floating diyas in rhythm',
  bgColor: '#fff3e0',
  bpm: 54,
  pattern: [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
  beatEmoji: '🪔',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'hindi-match',
  title: 'Taj Mahal Symmetry',
  subtitle: 'ताज महल',
  emoji: '🕌',
  instruction: 'Match the identical architectural elements',
  bgColor: '#eceff1',
  pairs: [
    { id: 'p1', emoji: '🕌', label: 'Dome' },
    { id: 'p2', emoji: '🗼', label: 'Minaret' },
    { id: 'p3', emoji: '🚪', label: 'Arch' },
    { id: 'p4', emoji: '💎', label: 'Marble Inlay' },
    { id: 'p5', emoji: '🌿', label: 'Garden' },
    { id: 'p6', emoji: '💧', label: 'Reflection Pool' },
  ],
};

export const tracing = {
  id: 'hindi-tracing',
  title: 'Kite Maker',
  subtitle: 'पतंग',
  emoji: '🪁',
  instruction: 'Trace the diamond kite shape and its tail',
  bgColor: '#e1f5fe',
  points: [
    { x: 50, y: 5 }, { x: 20, y: 35 }, { x: 50, y: 65 },
    { x: 80, y: 35 }, { x: 50, y: 5 },
  ],
  strokeColor: '#0277BD',
  fillColor: '#B3E5FC',
};

export const navigation = {
  id: 'hindi-navigation',
  title: 'Village Well Walk',
  subtitle: 'गाँव का कुआँ',
  emoji: '🏘️',
  instruction: 'Navigate the village path to bring water from the well',
  bgColor: '#fff8e1',
  gridSize: 5,
  obstacles: ['🌳', '🐄', '🪨'],
  collectibles: ['🌾', '🌻', '🦚'],
  playerEmoji: '🚶',
  goalEmoji: '⛲',
};
