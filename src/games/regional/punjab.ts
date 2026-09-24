/** Punjab — Golden Temple, Mustard Fields, Bhangra, Phulkari */

export const sorting = {
  id: 'punjab-sorting',
  title: 'Lassi Maker',
  subtitle: 'ਲੱਸੀ',
  emoji: '🥛',
  instruction: 'Sort the ingredients for making perfect lassi',
  bgColor: '#fffde7',
  categories: [
    { id: 'dairy', label: 'Dairy', emoji: '🥛', color: '#F9A825' },
    { id: 'sweet', label: 'Sweetener', emoji: '🍯', color: '#FF8F00' },
    { id: 'spice', label: 'Flavor', emoji: '🌿', color: '#2E7D32' },
  ],
  items: [
    { id: 1, label: 'Yogurt', emoji: '🥛', category: 'dairy' },
    { id: 2, label: 'Sugar', emoji: '🍬', category: 'sweet' },
    { id: 3, label: 'Cardamom', emoji: '💚', category: 'spice' },
    { id: 4, label: 'Cream', emoji: '🍦', category: 'dairy' },
    { id: 5, label: 'Honey', emoji: '🍯', category: 'sweet' },
    { id: 6, label: 'Rose Water', emoji: '🌹', category: 'spice' },
    { id: 7, label: 'Butter', emoji: '🧈', category: 'dairy' },
    { id: 8, label: 'Jaggery', emoji: '🟤', category: 'sweet' },
    { id: 9, label: 'Saffron', emoji: '🟡', category: 'spice' },
  ],
};

export const rhythm = {
  id: 'punjab-rhythm',
  title: 'Bhangra Beat',
  subtitle: 'ਭੰਗੜਾ',
  emoji: '🪘',
  instruction: 'Tap the dhol drum in rhythm with the Bhangra beat',
  bgColor: '#fff3e0',
  bpm: 96,
  pattern: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  beatEmoji: '🪘',
  missEmoji: '💨',
  accentColor: '#E65100',
};

export const match = {
  id: 'punjab-match',
  title: 'Golden Temple',
  subtitle: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
  emoji: '🕌',
  instruction: 'Match the reflections in the sacred Sarovar pool',
  bgColor: '#fff9c4',
  pairs: [
    { id: 'p1', emoji: '💛', label: 'Gold Dome' },
    { id: 'p2', emoji: '💙', label: 'Blue Pool' },
    { id: 'p3', emoji: '🤍', label: 'White Marble' },
    { id: 'p4', emoji: '🪔', label: 'Lamp' },
    { id: 'p5', emoji: '📖', label: 'Holy Book' },
    { id: 'p6', emoji: '🌸', label: 'Flower' },
  ],
};

export const tracing = {
  id: 'punjab-tracing',
  title: 'Phulkari Pattern',
  subtitle: 'ਫੁਲਕਾਰੀ',
  emoji: '🌸',
  instruction: 'Trace the beautiful floral embroidery pattern',
  bgColor: '#fce4ec',
  points: [
    { x: 50, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 50 },
    { x: 30, y: 70 }, { x: 50, y: 90 }, { x: 70, y: 70 },
    { x: 90, y: 50 }, { x: 70, y: 30 }, { x: 50, y: 10 },
  ],
  strokeColor: '#AD1457',
  fillColor: '#F8BBD0',
};

export const navigation = {
  id: 'punjab-navigation',
  title: 'Tractor Field',
  subtitle: 'ਟ੍ਰੈਕਟਰ',
  emoji: '🚜',
  instruction: 'Guide the tractor in a straight line across the wheat field',
  bgColor: '#fffde7',
  gridSize: 5,
  obstacles: ['🌾', '🪨', '🐄'],
  collectibles: ['🌻', '🌽', '🥕'],
  playerEmoji: '🚜',
  goalEmoji: '🏠',
};
