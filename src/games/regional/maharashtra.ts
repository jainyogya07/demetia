/** Maharashtra — Sahyadri, Warli art, Mumbai, Ganesh Chaturthi */

export const sorting = {
  id: 'maharashtra-sorting',
  title: 'Vada Pav Assembly',
  subtitle: 'वडा पाव',
  emoji: '🍔',
  instruction: 'Assemble the perfect Vada Pav in the right order',
  bgColor: '#fff3e0',
  categories: [
    { id: 'bread', label: 'Pav', emoji: '🍞', color: '#8D6E63' },
    { id: 'filling', label: 'Vada', emoji: '🥔', color: '#FF8F00' },
    { id: 'chutney', label: 'Chutney', emoji: '🌶️', color: '#2E7D32' },
  ],
  items: [
    { id: 1, label: 'Top Bun', emoji: '🍞', category: 'bread' },
    { id: 2, label: 'Potato Patty', emoji: '🥔', category: 'filling' },
    { id: 3, label: 'Green Chutney', emoji: '🟢', category: 'chutney' },
    { id: 4, label: 'Bottom Bun', emoji: '🫓', category: 'bread' },
    { id: 5, label: 'Fried Chili', emoji: '🌶️', category: 'filling' },
    { id: 6, label: 'Tamarind Sauce', emoji: '🟤', category: 'chutney' },
    { id: 7, label: 'Pav Slice', emoji: '🍞', category: 'bread' },
    { id: 8, label: 'Batata Bhaji', emoji: '🥘', category: 'filling' },
    { id: 9, label: 'Garlic Chutney', emoji: '🔴', category: 'chutney' },
  ],
};

export const rhythm = {
  id: 'maharashtra-rhythm',
  title: 'Dhol Tasha Beats',
  subtitle: 'ढोल ताशा',
  emoji: '🥁',
  instruction: 'March in rhythm with the Ganpati procession drums',
  bgColor: '#fff8e1',
  bpm: 90,
  pattern: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  beatEmoji: '🥁',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'maharashtra-match',
  title: 'Warli Art Pairs',
  subtitle: 'वारली कला',
  emoji: '🎨',
  instruction: 'Match the identical Warli painting figures',
  bgColor: '#efebe9',
  pairs: [
    { id: 'p1', emoji: '🌳', label: 'Tree' },
    { id: 'p2', emoji: '🏠', label: 'Hut' },
    { id: 'p3', emoji: '💃', label: 'Dancer' },
    { id: 'p4', emoji: '🐂', label: 'Bull' },
    { id: 'p5', emoji: '☀️', label: 'Sun' },
    { id: 'p6', emoji: '🌙', label: 'Moon' },
  ],
};

export const tracing = {
  id: 'maharashtra-tracing',
  title: 'Warli Art Drawing',
  subtitle: 'वारली चित्र',
  emoji: '✏️',
  instruction: 'Trace the Warli figure dancing in a circle',
  bgColor: '#efebe9',
  points: [
    { x: 50, y: 15 }, { x: 35, y: 30 }, { x: 30, y: 50 },
    { x: 40, y: 70 }, { x: 50, y: 85 }, { x: 60, y: 70 },
    { x: 70, y: 50 }, { x: 65, y: 30 }, { x: 50, y: 15 },
  ],
  strokeColor: '#4E342E',
  fillColor: '#D7CCC8',
};

export const navigation = {
  id: 'maharashtra-navigation',
  title: 'Fort Explorer',
  subtitle: 'किल्ला',
  emoji: '🏰',
  instruction: 'Navigate through the Sahyadri mountain fort',
  bgColor: '#e8f5e9',
  gridSize: 5,
  obstacles: ['🪨', '🌳', '⛰️'],
  collectibles: ['🏴', '⚔️', '🪙'],
  playerEmoji: '🚶',
  goalEmoji: '🏰',
};
