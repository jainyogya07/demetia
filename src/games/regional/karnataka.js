/** Karnataka — Hampi, Coffee, Mysore, Yakshagana */

export const sorting = {
  id: 'karnataka-sorting',
  title: 'Coffee Bean Sorting',
  subtitle: 'ಕಾಫಿ ಬೀಜ',
  emoji: '☕',
  instruction: 'Sort the coffee cherries into the correct roasting trays',
  bgColor: '#efebe9',
  categories: [
    { id: 'light', label: 'Light Roast', emoji: '🟡', color: '#A1887F' },
    { id: 'medium', label: 'Medium Roast', emoji: '🟠', color: '#795548' },
    { id: 'dark', label: 'Dark Roast', emoji: '🟤', color: '#3E2723' },
  ],
  items: [
    { id: 1, label: 'Yellow Cherry', emoji: '🟡', category: 'light' },
    { id: 2, label: 'Orange Cherry', emoji: '🟠', category: 'medium' },
    { id: 3, label: 'Red Cherry', emoji: '🔴', category: 'dark' },
    { id: 4, label: 'Pale Bean', emoji: '🫘', category: 'light' },
    { id: 5, label: 'Brown Bean', emoji: '🫘', category: 'medium' },
    { id: 6, label: 'Dark Bean', emoji: '⚫', category: 'dark' },
    { id: 7, label: 'Golden Bean', emoji: '✨', category: 'light' },
    { id: 8, label: 'Amber Bean', emoji: '🟠', category: 'medium' },
    { id: 9, label: 'Espresso Bean', emoji: '☕', category: 'dark' },
  ],
};

export const rhythm = {
  id: 'karnataka-rhythm',
  title: 'Yakshagana Beats',
  subtitle: 'ಯಕ್ಷಗಾನ',
  emoji: '🥁',
  instruction: 'Tap in time with the dramatic Yakshagana chende beats',
  bgColor: '#fff3e0',
  bpm: 78,
  pattern: [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
  beatEmoji: '🥁',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'karnataka-match',
  title: 'Mysore Palace Lights',
  subtitle: 'ಮೈಸೂರು ಅರಮನೆ',
  emoji: '🏰',
  instruction: 'Match the glowing palace dome light patterns',
  bgColor: '#fff9c4',
  pairs: [
    { id: 'p1', emoji: '💛', label: 'Gold Dome' },
    { id: 'p2', emoji: '🤍', label: 'White Tower' },
    { id: 'p3', emoji: '❤️', label: 'Red Arch' },
    { id: 'p4', emoji: '💚', label: 'Green Window' },
    { id: 'p5', emoji: '💜', label: 'Purple Gate' },
    { id: 'p6', emoji: '🧡', label: 'Orange Spire' },
  ],
};

export const tracing = {
  id: 'karnataka-tracing',
  title: 'Hampi Stone Carving',
  subtitle: 'ಹಂಪಿ ಕಲ್ಲು',
  emoji: '🏛️',
  instruction: 'Trace the temple pillar design by connecting the dots',
  bgColor: '#efebe9',
  points: [
    { x: 35, y: 5 }, { x: 65, y: 5 }, { x: 70, y: 20 },
    { x: 70, y: 80 }, { x: 75, y: 95 }, { x: 25, y: 95 },
    { x: 30, y: 80 }, { x: 30, y: 20 }, { x: 35, y: 5 },
  ],
  strokeColor: '#795548',
  fillColor: '#D7CCC8',
};

export const navigation = {
  id: 'karnataka-navigation',
  title: 'Coorg Trail Walk',
  subtitle: 'ಕೊಡಗು',
  emoji: '🌿',
  instruction: 'Walk through the coffee estate and collect ripe berries',
  bgColor: '#e8f5e9',
  gridSize: 5,
  obstacles: ['🌳', '🪨', '☕'],
  collectibles: ['🔴', '🦋', '🌺'],
  playerEmoji: '🚶',
  goalEmoji: '🏡',
};
