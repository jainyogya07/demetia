/** Kerala — Backwaters, Spices, Kathakali, Onam */

export const sorting = {
  id: 'kerala-sorting',
  title: 'Spice Garden',
  subtitle: 'സുഗന്ധവ്യഞ്ജനം',
  emoji: '🌶️',
  instruction: 'Sort the fragrant spices into the correct jars',
  bgColor: '#e8f5e9',
  categories: [
    { id: 'whole', label: 'Whole Spices', emoji: '🫙', color: '#2E7D32' },
    { id: 'ground', label: 'Ground Spices', emoji: '🥣', color: '#F57F17' },
    { id: 'leaf', label: 'Leaf & Herb', emoji: '🌿', color: '#558B2F' },
  ],
  items: [
    { id: 1, label: 'Cardamom', emoji: '💚', category: 'whole' },
    { id: 2, label: 'Turmeric Powder', emoji: '🟡', category: 'ground' },
    { id: 3, label: 'Curry Leaf', emoji: '🌿', category: 'leaf' },
    { id: 4, label: 'Black Pepper', emoji: '⚫', category: 'whole' },
    { id: 5, label: 'Cinnamon Powder', emoji: '🟤', category: 'ground' },
    { id: 6, label: 'Bay Leaf', emoji: '🍃', category: 'leaf' },
    { id: 7, label: 'Clove', emoji: '🟫', category: 'whole' },
    { id: 8, label: 'Chili Powder', emoji: '🔴', category: 'ground' },
    { id: 9, label: 'Mint', emoji: '🌱', category: 'leaf' },
  ],
};

export const rhythm = {
  id: 'kerala-rhythm',
  title: 'Snake Boat Rhythm',
  subtitle: 'വഞ്ചിപ്പാട്ട്',
  emoji: '🚣',
  instruction: 'Row in time with the Vanchipattu boat song',
  bgColor: '#e0f2f1',
  bpm: 66,
  pattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  beatEmoji: '🚣',
  missEmoji: '🌊',
  accentColor: '#00695C',
};

export const match = {
  id: 'kerala-match',
  title: 'Kathakali Face Match',
  subtitle: 'കഥകളി',
  emoji: '🎭',
  instruction: 'Match the identical Kathakali face paint patterns',
  bgColor: '#e8f5e9',
  pairs: [
    { id: 'p1', emoji: '🟢', label: 'Pachcha (Green)' },
    { id: 'p2', emoji: '🔴', label: 'Chuvanna (Red)' },
    { id: 'p3', emoji: '⚫', label: 'Kari (Black)' },
    { id: 'p4', emoji: '🟡', label: 'Minukku (Gold)' },
    { id: 'p5', emoji: '⚪', label: 'Vella (White)' },
    { id: 'p6', emoji: '🟠', label: 'Thaadi (Orange)' },
  ],
};

export const tracing = {
  id: 'kerala-tracing',
  title: 'Onam Pookalam',
  subtitle: 'ഓണം പൂക്കളം',
  emoji: '🌸',
  instruction: 'Trace the circular flower rangoli pattern',
  bgColor: '#fce4ec',
  points: [
    { x: 50, y: 5 }, { x: 20, y: 20 }, { x: 5, y: 50 },
    { x: 20, y: 80 }, { x: 50, y: 95 }, { x: 80, y: 80 },
    { x: 95, y: 50 }, { x: 80, y: 20 }, { x: 50, y: 5 },
  ],
  strokeColor: '#C62828',
  fillColor: '#FFCDD2',
};

export const navigation = {
  id: 'kerala-navigation',
  title: 'Backwater Cruise',
  subtitle: 'ബാക്ക്വാട്ടർ',
  emoji: '🛶',
  instruction: 'Steer the houseboat through the calm backwaters',
  bgColor: '#e0f7fa',
  gridSize: 5,
  obstacles: ['🌴', '🌿', '🪨'],
  collectibles: ['🐟', '🦋', '🌺'],
  playerEmoji: '🛶',
  goalEmoji: '🏠',
};
