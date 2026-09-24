/** Assam — Tea gardens, Brahmaputra, Bihu, silk */

export const sorting = {
  id: 'assam-sorting',
  title: 'Tea Garden Sorting',
  subtitle: 'চাহ বাগিচা',
  emoji: '🍵',
  instruction: 'Sort the tea leaves into the correct baskets',
  bgColor: '#e8f5e9',
  categories: [
    { id: 'green', label: 'Green Tea', emoji: '🌿', color: '#388E3C' },
    { id: 'black', label: 'Black Tea', emoji: '🫖', color: '#5D4037' },
    { id: 'white', label: 'White Tea', emoji: '🤍', color: '#9E9E9E' },
  ],
  items: [
    { id: 1, label: 'Fresh Leaf', emoji: '🌱', category: 'green' },
    { id: 2, label: 'Dark Leaf', emoji: '🍂', category: 'black' },
    { id: 3, label: 'Silver Tip', emoji: '🪶', category: 'white' },
    { id: 4, label: 'Young Bud', emoji: '🌿', category: 'green' },
    { id: 5, label: 'Dried Leaf', emoji: '🍁', category: 'black' },
    { id: 6, label: 'Pale Bud', emoji: '🌸', category: 'white' },
    { id: 7, label: 'Rolled Leaf', emoji: '🌀', category: 'green' },
    { id: 8, label: 'Crushed Leaf', emoji: '🫖', category: 'black' },
    { id: 9, label: 'Tiny Bud', emoji: '✨', category: 'white' },
  ],
};

export const rhythm = {
  id: 'assam-rhythm',
  title: 'Bihu Rhythm Tap',
  subtitle: 'বিহু তাল',
  emoji: '🪘',
  instruction: 'Tap in time with the Bihu dhol beats',
  bgColor: '#fff3e0',
  bpm: 72,
  pattern: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  beatEmoji: '🪘',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'assam-match',
  title: 'Mekhela Chador Match',
  subtitle: 'মেখেলা চাদৰ',
  emoji: '🧣',
  instruction: 'Match the identical silk embroidery patterns',
  bgColor: '#fce4ec',
  pairs: [
    { id: 'p1', emoji: '🧣', label: 'Red Silk' },
    { id: 'p2', emoji: '🌺', label: 'Kopou Phool' },
    { id: 'p3', emoji: '🪷', label: 'Lotus Motif' },
    { id: 'p4', emoji: '🦚', label: 'Peacock' },
    { id: 'p5', emoji: '🌿', label: 'Leaf Border' },
    { id: 'p6', emoji: '⭐', label: 'Star Pattern' },
  ],
};

export const tracing = {
  id: 'assam-tracing',
  title: 'Majuli Mask Painting',
  subtitle: 'মাজুলীৰ মুখা',
  emoji: '🎭',
  instruction: 'Trace the traditional mask design by connecting the dots',
  bgColor: '#efebe9',
  // Points form a simple face-like mask shape
  points: [
    { x: 50, y: 10 }, { x: 30, y: 25 }, { x: 20, y: 50 },
    { x: 25, y: 75 }, { x: 50, y: 90 }, { x: 75, y: 75 },
    { x: 80, y: 50 }, { x: 70, y: 25 }, { x: 50, y: 10 },
  ],
  strokeColor: '#8D6E63',
  fillColor: '#FFCC80',
};

export const navigation = {
  id: 'assam-navigation',
  title: 'Brahmaputra Boat Ride',
  subtitle: 'ব্ৰহ্মপুত্ৰ নাও',
  emoji: '🚣',
  instruction: 'Guide the boat safely across the river by remembering the path',
  bgColor: '#e3f2fd',
  gridSize: 5,
  obstacles: ['🏝️', '🪨', '🌊'],
  collectibles: ['🐟', '🪷', '🦆'],
  playerEmoji: '🚣',
  goalEmoji: '🏠',
};
