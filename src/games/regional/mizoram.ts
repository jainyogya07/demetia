/** Mizoram — Green hills, Cheraw dance, Bamboo, Puan shawl */

export const sorting = {
  id: 'mizoram-sorting',
  title: 'Puan Shawl Colors',
  subtitle: 'Mizo Puan',
  emoji: '🧣',
  instruction: 'Sort the threads by color for the traditional Puan shawl',
  bgColor: '#fce4ec',
  categories: [
    { id: 'red', label: 'Red Threads', emoji: '🔴', color: '#C62828' },
    { id: 'black', label: 'Black Threads', emoji: '⚫', color: '#212121' },
    { id: 'white', label: 'White Threads', emoji: '⚪', color: '#9E9E9E' },
  ],
  items: [
    { id: 1, label: 'Crimson', emoji: '❤️', category: 'red' },
    { id: 2, label: 'Ebony', emoji: '🖤', category: 'black' },
    { id: 3, label: 'Pearl', emoji: '🤍', category: 'white' },
    { id: 4, label: 'Scarlet', emoji: '🔴', category: 'red' },
    { id: 5, label: 'Jet', emoji: '◼️', category: 'black' },
    { id: 6, label: 'Ivory', emoji: '🦴', category: 'white' },
    { id: 7, label: 'Ruby', emoji: '💎', category: 'red' },
    { id: 8, label: 'Carbon', emoji: '⬛', category: 'black' },
    { id: 9, label: 'Snow', emoji: '❄️', category: 'white' },
  ],
};

export const rhythm = {
  id: 'mizoram-rhythm',
  title: 'Cheraw Bamboo Dance',
  subtitle: 'Cheraw',
  emoji: '🎋',
  instruction: 'Step in time before the bamboo poles clap together',
  bgColor: '#e8f5e9',
  bpm: 80,
  pattern: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  beatEmoji: '🎋',
  missEmoji: '💥',
  accentColor: '#2E7D32',
};

export const match = {
  id: 'mizoram-match',
  title: 'Chapchar Kut Festival',
  subtitle: 'Festival Match',
  emoji: '🎉',
  instruction: 'Match the traditional Mizo festival items',
  bgColor: '#fff3e0',
  pairs: [
    { id: 'p1', emoji: '🎋', label: 'Bamboo' },
    { id: 'p2', emoji: '🧣', label: 'Puan' },
    { id: 'p3', emoji: '🪘', label: 'Drum' },
    { id: 'p4', emoji: '🎶', label: 'Song' },
    { id: 'p5', emoji: '🌺', label: 'Flower' },
    { id: 'p6', emoji: '🍖', label: 'Feast' },
  ],
};

export const tracing = {
  id: 'mizoram-tracing',
  title: 'Puan Pattern',
  subtitle: 'Puan Design',
  emoji: '🧶',
  instruction: 'Trace the zigzag pattern of the traditional Mizo shawl',
  bgColor: '#fce4ec',
  points: [
    { x: 5, y: 50 }, { x: 20, y: 20 }, { x: 35, y: 50 },
    { x: 50, y: 20 }, { x: 65, y: 50 }, { x: 80, y: 20 },
    { x: 95, y: 50 },
  ],
  strokeColor: '#B71C1C',
  fillColor: '#FFCDD2',
};

export const navigation = {
  id: 'mizoram-navigation',
  title: 'Hornbill Spotting',
  subtitle: 'Forest Walk',
  emoji: '🐦',
  instruction: 'Walk through the dense forest and spot the hornbills',
  bgColor: '#e8f5e9',
  gridSize: 5,
  obstacles: ['🌳', '🌿', '🌫️'],
  collectibles: ['🐦', '🦋', '🌺'],
  playerEmoji: '🚶',
  goalEmoji: '🏡',
};
