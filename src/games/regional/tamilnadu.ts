/** Tamil Nadu — Temples, Kolam, Filter Coffee, Bharatanatyam */

export const sorting = {
  id: 'tamil-sorting',
  title: 'Filter Coffee',
  subtitle: 'ஃபில்டர் காபி',
  emoji: '☕',
  instruction: 'Arrange the coffee-making steps in the correct order',
  bgColor: '#efebe9',
  categories: [
    { id: 'brew', label: 'Brewing', emoji: '☕', color: '#4E342E' },
    { id: 'pour', label: 'Pouring', emoji: '🫗', color: '#795548' },
    { id: 'serve', label: 'Serving', emoji: '🍵', color: '#A1887F' },
  ],
  items: [
    { id: 1, label: 'Coffee Powder', emoji: '🟤', category: 'brew' },
    { id: 2, label: 'Hot Water', emoji: '♨️', category: 'brew' },
    { id: 3, label: 'Decoction', emoji: '🫖', category: 'brew' },
    { id: 4, label: 'To Davara', emoji: '🥃', category: 'pour' },
    { id: 5, label: 'To Tumbler', emoji: '🥛', category: 'pour' },
    { id: 6, label: 'Mix Milk', emoji: '🍶', category: 'pour' },
    { id: 7, label: 'Add Sugar', emoji: '🍬', category: 'serve' },
    { id: 8, label: 'Froth It', emoji: '🫧', category: 'serve' },
    { id: 9, label: 'Serve Hot', emoji: '☕', category: 'serve' },
  ],
};

export const rhythm = {
  id: 'tamil-rhythm',
  title: 'Pongal Pot',
  subtitle: 'பொங்கலோ பொங்கல்',
  emoji: '🍯',
  instruction: 'Tap "Pongalo Pongal" when the milk gently overflows',
  bgColor: '#fff3e0',
  bpm: 60,
  pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  beatEmoji: '🍯',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'tamil-match',
  title: 'Temple Gopuram',
  subtitle: 'கோபுரம்',
  emoji: '🛕',
  instruction: 'Match the colorful tiers of the temple gopuram',
  bgColor: '#fff9c4',
  pairs: [
    { id: 'p1', emoji: '🔴', label: 'Red Tier' },
    { id: 'p2', emoji: '🟡', label: 'Gold Tier' },
    { id: 'p3', emoji: '🟢', label: 'Green Tier' },
    { id: 'p4', emoji: '🔵', label: 'Blue Tier' },
    { id: 'p5', emoji: '🟠', label: 'Orange Tier' },
    { id: 'p6', emoji: '🤍', label: 'White Top' },
  ],
};

export const tracing = {
  id: 'tamil-tracing',
  title: 'Kolam Drawing',
  subtitle: 'கோலம்',
  emoji: '⚪',
  instruction: 'Connect the dots to draw a beautiful Kolam pattern',
  bgColor: '#fafafa',
  points: [
    { x: 50, y: 5 }, { x: 25, y: 25 }, { x: 5, y: 50 },
    { x: 25, y: 75 }, { x: 50, y: 95 }, { x: 75, y: 75 },
    { x: 95, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 5 },
  ],
  strokeColor: '#E65100',
  fillColor: '#FFF3E0',
};

export const navigation = {
  id: 'tamil-navigation',
  title: 'Temple Walk',
  subtitle: 'கோவில் நடை',
  emoji: '🛕',
  instruction: 'Walk through the temple corridors to reach the sanctum',
  bgColor: '#fff9c4',
  gridSize: 5,
  obstacles: ['🪨', '🏛️', '🌺'],
  collectibles: ['🪔', '🌸', '🍌'],
  playerEmoji: '🚶',
  goalEmoji: '🛕',
};
