/** Manipur — Loktak Lake, Raas Leela, Polo, Phanek */

export const sorting = {
  id: 'manipur-sorting',
  title: 'Handloom Weaving',
  subtitle: 'ফানেক',
  emoji: '🧶',
  instruction: 'Sort the colorful threads into the correct loom sections',
  bgColor: '#fce4ec',
  categories: [
    { id: 'red', label: 'Red Threads', emoji: '🔴', color: '#C62828' },
    { id: 'black', label: 'Black Threads', emoji: '⚫', color: '#212121' },
    { id: 'gold', label: 'Gold Threads', emoji: '🟡', color: '#F9A825' },
  ],
  items: [
    { id: 1, label: 'Crimson', emoji: '❤️', category: 'red' },
    { id: 2, label: 'Onyx', emoji: '🖤', category: 'black' },
    { id: 3, label: 'Amber', emoji: '💛', category: 'gold' },
    { id: 4, label: 'Scarlet', emoji: '🔴', category: 'red' },
    { id: 5, label: 'Charcoal', emoji: '◼️', category: 'black' },
    { id: 6, label: 'Honey', emoji: '🍯', category: 'gold' },
    { id: 7, label: 'Rose', emoji: '🌹', category: 'red' },
    { id: 8, label: 'Ink', emoji: '🖊️', category: 'black' },
    { id: 9, label: 'Sunlight', emoji: '☀️', category: 'gold' },
  ],
};

export const rhythm = {
  id: 'manipur-rhythm',
  title: 'Raas Leela Dance',
  subtitle: 'রাস লীলা',
  emoji: '💃',
  instruction: 'Move gracefully in time with the gentle Raas Leela rhythm',
  bgColor: '#f3e5f5',
  bpm: 54,
  pattern: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  beatEmoji: '💃',
  missEmoji: '✨',
  accentColor: '#6A1B9A',
};

export const match = {
  id: 'manipur-match',
  title: 'Dance Posture Match',
  subtitle: 'মণিপুরী নৃত্য',
  emoji: '🙏',
  instruction: 'Match the elegant hand gestures of the dancers',
  bgColor: '#ede7f6',
  pairs: [
    { id: 'p1', emoji: '🙏', label: 'Namaste' },
    { id: 'p2', emoji: '🤲', label: 'Offering' },
    { id: 'p3', emoji: '👐', label: 'Open Hands' },
    { id: 'p4', emoji: '✋', label: 'Stop Mudra' },
    { id: 'p5', emoji: '🤙', label: 'Hang Loose' },
    { id: 'p6', emoji: '👆', label: 'Pointing Up' },
  ],
};

export const tracing = {
  id: 'manipur-tracing',
  title: 'Phanek Pattern',
  subtitle: 'ফানেক',
  emoji: '🧵',
  instruction: 'Trace the striped pattern of the traditional Phanek cloth',
  bgColor: '#fce4ec',
  points: [
    { x: 10, y: 10 }, { x: 90, y: 10 }, { x: 90, y: 30 },
    { x: 10, y: 30 }, { x: 10, y: 50 }, { x: 90, y: 50 },
    { x: 90, y: 70 }, { x: 10, y: 70 }, { x: 10, y: 90 },
    { x: 90, y: 90 },
  ],
  strokeColor: '#880E4F',
  fillColor: '#F8BBD0',
};

export const navigation = {
  id: 'manipur-navigation',
  title: 'Loktak Phumdi Hop',
  subtitle: 'লোকটক লেক',
  emoji: '🦌',
  instruction: 'Help the Sangai deer hop safely across the floating islands',
  bgColor: '#e0f7fa',
  gridSize: 5,
  obstacles: ['🌊', '🌿', '💧'],
  collectibles: ['🌸', '🦆', '🐟'],
  playerEmoji: '🦌',
  goalEmoji: '🏝️',
};
