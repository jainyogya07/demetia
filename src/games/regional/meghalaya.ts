/** Meghalaya — Living Root Bridges, Cherrapunji, Bamboo */

export const sorting = {
  id: 'meghalaya-sorting',
  title: 'Bamboo Basket Weaving',
  subtitle: 'Bamboo Craft',
  emoji: '🧺',
  instruction: 'Sort the bamboo strips by size for basket weaving',
  bgColor: '#e8f5e9',
  categories: [
    { id: 'thin', label: 'Thin Strips', emoji: '🪡', color: '#558B2F' },
    { id: 'medium', label: 'Medium Strips', emoji: '🎋', color: '#33691E' },
    { id: 'thick', label: 'Thick Poles', emoji: '🪵', color: '#827717' },
  ],
  items: [
    { id: 1, label: 'Thread Strip', emoji: '🧵', category: 'thin' },
    { id: 2, label: 'Rope Strip', emoji: '🪢', category: 'medium' },
    { id: 3, label: 'Bamboo Pole', emoji: '🎋', category: 'thick' },
    { id: 4, label: 'Fine Strip', emoji: '📏', category: 'thin' },
    { id: 5, label: 'Weave Strip', emoji: '🪡', category: 'medium' },
    { id: 6, label: 'Trunk Piece', emoji: '🪵', category: 'thick' },
    { id: 7, label: 'Needle Strip', emoji: '🪡', category: 'thin' },
    { id: 8, label: 'Band Strip', emoji: '🎀', category: 'medium' },
    { id: 9, label: 'Log Piece', emoji: '🪵', category: 'thick' },
  ],
};

export const rhythm = {
  id: 'meghalaya-rhythm',
  title: 'Raindrop Rhythm',
  subtitle: 'Cherrapunji Rain',
  emoji: '🌧️',
  instruction: 'Tap in time with the gentle rainfall of Cherrapunji',
  bgColor: '#e3f2fd',
  bpm: 56,
  pattern: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  beatEmoji: '💧',
  missEmoji: '☁️',
  accentColor: '#1565C0',
};

export const match = {
  id: 'meghalaya-match',
  title: 'Forest Sounds',
  subtitle: 'Nature Match',
  emoji: '🌿',
  instruction: 'Match the nature sounds to their pictures',
  bgColor: '#e8f5e9',
  pairs: [
    { id: 'p1', emoji: '🐦', label: 'Bird Song' },
    { id: 'p2', emoji: '🌊', label: 'Waterfall' },
    { id: 'p3', emoji: '🌧️', label: 'Rain' },
    { id: 'p4', emoji: '🍃', label: 'Wind' },
    { id: 'p5', emoji: '🦗', label: 'Crickets' },
    { id: 'p6', emoji: '🐸', label: 'Frog' },
  ],
};

export const tracing = {
  id: 'meghalaya-tracing',
  title: 'Root Bridge Builder',
  subtitle: 'Living Root Bridge',
  emoji: '🌿',
  instruction: 'Trace the intertwined roots to complete the bridge',
  bgColor: '#e8f5e9',
  points: [
    { x: 5, y: 40 }, { x: 20, y: 30 }, { x: 35, y: 25 },
    { x: 50, y: 20 }, { x: 65, y: 25 }, { x: 80, y: 30 },
    { x: 95, y: 40 },
  ],
  strokeColor: '#33691E',
  fillColor: '#C8E6C9',
};

export const navigation = {
  id: 'meghalaya-navigation',
  title: 'Misty Hill Walk',
  subtitle: 'Cloud Walk',
  emoji: '🌫️',
  instruction: 'Navigate through the misty hills to find the waterfall',
  bgColor: '#eceff1',
  gridSize: 5,
  obstacles: ['🌫️', '🪨', '🌳'],
  collectibles: ['🌸', '🦋', '🍄'],
  playerEmoji: '🚶',
  goalEmoji: '💦',
};
