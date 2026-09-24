/** Gujarat — Kutch, Garba, Kite Flying, Thali */

export const sorting = {
  id: 'gujarat-sorting',
  title: 'Gujarati Thali',
  subtitle: 'ગુજરાતી થાળી',
  emoji: '🍽️',
  instruction: 'Place each dish in its correct spot on the thali',
  bgColor: '#fff8e1',
  categories: [
    { id: 'sweet', label: 'Mithai', emoji: '🍬', color: '#FF8F00' },
    { id: 'savory', label: 'Farsan', emoji: '🥘', color: '#E65100' },
    { id: 'bread', label: 'Roti', emoji: '🫓', color: '#8D6E63' },
  ],
  items: [
    { id: 1, label: 'Jalebi', emoji: '🥨', category: 'sweet' },
    { id: 2, label: 'Dhokla', emoji: '🧁', category: 'savory' },
    { id: 3, label: 'Thepla', emoji: '🫓', category: 'bread' },
    { id: 4, label: 'Shrikhand', emoji: '🍮', category: 'sweet' },
    { id: 5, label: 'Khandvi', emoji: '🌀', category: 'savory' },
    { id: 6, label: 'Bhakri', emoji: '🍞', category: 'bread' },
    { id: 7, label: 'Basundi', emoji: '🥛', category: 'sweet' },
    { id: 8, label: 'Fafda', emoji: '🥖', category: 'savory' },
    { id: 9, label: 'Puri', emoji: '🫓', category: 'bread' },
  ],
};

export const rhythm = {
  id: 'gujarat-rhythm',
  title: 'Garba Circle',
  subtitle: 'ગરબા',
  emoji: '💃',
  instruction: 'Clap in rhythm with the Garba beats',
  bgColor: '#f3e5f5',
  bpm: 84,
  pattern: [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  beatEmoji: '👏',
  missEmoji: '💨',
  accentColor: '#7B1FA2',
};

export const match = {
  id: 'gujarat-match',
  title: 'Kutch Embroidery',
  subtitle: 'કચ્છી ભરતકામ',
  emoji: '🪡',
  instruction: 'Match the identical mirror-work embroidery patterns',
  bgColor: '#fce4ec',
  pairs: [
    { id: 'p1', emoji: '🔴', label: 'Red Mirror' },
    { id: 'p2', emoji: '🟡', label: 'Gold Thread' },
    { id: 'p3', emoji: '🔵', label: 'Blue Mirror' },
    { id: 'p4', emoji: '💎', label: 'Diamond' },
    { id: 'p5', emoji: '⭐', label: 'Star' },
    { id: 'p6', emoji: '🌙', label: 'Crescent' },
  ],
};

export const tracing = {
  id: 'gujarat-tracing',
  title: 'Kite Maker',
  subtitle: 'પતંગ',
  emoji: '🪁',
  instruction: 'Trace the diamond kite shape and decorate it',
  bgColor: '#e1f5fe',
  points: [
    { x: 50, y: 5 }, { x: 20, y: 40 }, { x: 50, y: 95 },
    { x: 80, y: 40 }, { x: 50, y: 5 },
  ],
  strokeColor: '#0277BD',
  fillColor: '#B3E5FC',
};

export const navigation = {
  id: 'gujarat-navigation',
  title: 'Gir Safari',
  subtitle: 'ગીર સફારી',
  emoji: '🦁',
  instruction: 'Spot the gentle animals resting in Gir forest',
  bgColor: '#f1f8e9',
  gridSize: 5,
  obstacles: ['🌳', '🪨', '🌿'],
  collectibles: ['🦁', '🦚', '🦌'],
  playerEmoji: '🚙',
  goalEmoji: '📸',
};
