/** Telangana / Andhra — Godavari, Charminar, Kondapalli, Kuchipudi */

export const sorting = {
  id: 'telugu-sorting',
  title: 'Kondapalli Toys',
  subtitle: 'కొండపల్లి బొమ్మలు',
  emoji: '🪆',
  instruction: 'Sort the brightly painted wooden toys into their boxes',
  bgColor: '#fff8e1',
  categories: [
    { id: 'animal', label: 'Animals', emoji: '🐘', color: '#FF8F00' },
    { id: 'person', label: 'People', emoji: '👤', color: '#6A1B9A' },
    { id: 'vehicle', label: 'Vehicles', emoji: '🛒', color: '#1565C0' },
  ],
  items: [
    { id: 1, label: 'Elephant', emoji: '🐘', category: 'animal' },
    { id: 2, label: 'Farmer', emoji: '👨‍🌾', category: 'person' },
    { id: 3, label: 'Bullock Cart', emoji: '🛒', category: 'vehicle' },
    { id: 4, label: 'Parrot', emoji: '🦜', category: 'animal' },
    { id: 5, label: 'Dancer', emoji: '💃', category: 'person' },
    { id: 6, label: 'Boat', emoji: '🚣', category: 'vehicle' },
    { id: 7, label: 'Peacock', emoji: '🦚', category: 'animal' },
    { id: 8, label: 'King', emoji: '🤴', category: 'person' },
    { id: 9, label: 'Chariot', emoji: '🏇', category: 'vehicle' },
  ],
};

export const rhythm = {
  id: 'telugu-rhythm',
  title: 'Kuchipudi Dance',
  subtitle: 'కూచిపూడి',
  emoji: '💃',
  instruction: 'Tap your feet in time with the graceful Kuchipudi beats',
  bgColor: '#f3e5f5',
  bpm: 66,
  pattern: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
  beatEmoji: '💃',
  missEmoji: '✨',
  accentColor: '#6A1B9A',
};

export const match = {
  id: 'telugu-match',
  title: 'Charminar Pearls',
  subtitle: 'చార్మినార్ ముత్యాలు',
  emoji: '📿',
  instruction: 'Find the matching pairs of Hyderabadi pearls',
  bgColor: '#eceff1',
  pairs: [
    { id: 'p1', emoji: '⚪', label: 'White Pearl' },
    { id: 'p2', emoji: '🩷', label: 'Pink Pearl' },
    { id: 'p3', emoji: '🟡', label: 'Golden Pearl' },
    { id: 'p4', emoji: '⚫', label: 'Black Pearl' },
    { id: 'p5', emoji: '💎', label: 'Diamond' },
    { id: 'p6', emoji: '💜', label: 'Amethyst' },
  ],
};

export const tracing = {
  id: 'telugu-tracing',
  title: 'Muggu Pattern',
  subtitle: 'ముగ్గు',
  emoji: '⚪',
  instruction: 'Trace the traditional Muggu (rangoli) design on the doorstep',
  bgColor: '#fafafa',
  points: [
    { x: 50, y: 5 }, { x: 15, y: 30 }, { x: 5, y: 65 },
    { x: 30, y: 95 }, { x: 70, y: 95 }, { x: 95, y: 65 },
    { x: 85, y: 30 }, { x: 50, y: 5 },
  ],
  strokeColor: '#6A1B9A',
  fillColor: '#E1BEE7',
};

export const navigation = {
  id: 'telugu-navigation',
  title: 'Godavari Boat Ride',
  subtitle: 'గోదావరి నది',
  emoji: '🛶',
  instruction: 'Steer the coracle down the gentle Godavari river',
  bgColor: '#e0f7fa',
  gridSize: 5,
  obstacles: ['🪷', '🌊', '🪨'],
  collectibles: ['🐟', '🦆', '🌸'],
  playerEmoji: '🛶',
  goalEmoji: '🏘️',
};
