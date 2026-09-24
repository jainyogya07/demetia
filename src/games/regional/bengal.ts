/** Bengal — Ponds, Alpona, Durga Puja, Hilsa fish */

export const sorting = {
  id: 'bengal-sorting',
  title: 'Fish Market',
  subtitle: 'মাছের বাজার',
  emoji: '🐟',
  instruction: 'Sort the fresh fish into the correct baskets',
  bgColor: '#e0f7fa',
  categories: [
    { id: 'river', label: 'River Fish', emoji: '🏞️', color: '#0097A7' },
    { id: 'sea', label: 'Sea Fish', emoji: '🌊', color: '#01579B' },
    { id: 'pond', label: 'Pond Fish', emoji: '🪷', color: '#4CAF50' },
  ],
  items: [
    { id: 1, label: 'Hilsa', emoji: '🐟', category: 'river' },
    { id: 2, label: 'Pomfret', emoji: '🐠', category: 'sea' },
    { id: 3, label: 'Rohu', emoji: '🐡', category: 'pond' },
    { id: 4, label: 'Catla', emoji: '🐟', category: 'pond' },
    { id: 5, label: 'Prawn', emoji: '🦐', category: 'sea' },
    { id: 6, label: 'Pabda', emoji: '🐠', category: 'river' },
    { id: 7, label: 'Bhetki', emoji: '🐡', category: 'sea' },
    { id: 8, label: 'Magur', emoji: '🐟', category: 'pond' },
    { id: 9, label: 'Tengra', emoji: '🐠', category: 'river' },
  ],
};

export const rhythm = {
  id: 'bengal-rhythm',
  title: 'Rabindra Sangeet',
  subtitle: 'রবীন্দ্রসঙ্গীত',
  emoji: '🎶',
  instruction: 'Tap gently in time with the soothing melody',
  bgColor: '#fff8e1',
  bpm: 60,
  pattern: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  beatEmoji: '🎵',
  missEmoji: '💫',
  accentColor: '#F57F17',
};

export const match = {
  id: 'bengal-match',
  title: 'Durga Puja Pandal',
  subtitle: 'দুর্গাপূজা প্যান্ডেল',
  emoji: '🪔',
  instruction: 'Find the matching festive decorations',
  bgColor: '#fce4ec',
  pairs: [
    { id: 'p1', emoji: '🪔', label: 'Diya' },
    { id: 'p2', emoji: '🌺', label: 'Hibiscus' },
    { id: 'p3', emoji: '🪘', label: 'Dhak' },
    { id: 'p4', emoji: '🍬', label: 'Sandesh' },
    { id: 'p5', emoji: '🌸', label: 'Shiuli' },
    { id: 'p6', emoji: '🎭', label: 'Mask' },
  ],
};

export const tracing = {
  id: 'bengal-tracing',
  title: 'Alpona Drawing',
  subtitle: 'আলপনা',
  emoji: '🎨',
  instruction: 'Trace the beautiful Alpona pattern by connecting the dots',
  bgColor: '#fff3e0',
  points: [
    { x: 50, y: 5 }, { x: 25, y: 30 }, { x: 5, y: 50 },
    { x: 25, y: 70 }, { x: 50, y: 95 }, { x: 75, y: 70 },
    { x: 95, y: 50 }, { x: 75, y: 30 }, { x: 50, y: 5 },
  ],
  strokeColor: '#E65100',
  fillColor: '#FFECB3',
};

export const navigation = {
  id: 'bengal-navigation',
  title: 'Sundarbans Spotting',
  subtitle: 'সুন্দরবন',
  emoji: '🌿',
  instruction: 'Spot the gentle creatures hiding in the mangrove forest',
  bgColor: '#e8f5e9',
  gridSize: 5,
  obstacles: ['🌿', '🌳', '🌊'],
  collectibles: ['🦌', '🦜', '🦋'],
  playerEmoji: '🚣',
  goalEmoji: '🏡',
};
