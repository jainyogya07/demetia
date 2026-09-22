export const PATIENT = {
  name: 'Latveria',
  roleLabel: 'Patient',
  photo: '',
};

export const ROUTINE_ITEMS = [
  { id: 'med-am', time: '8:00 AM', title: 'Morning Medicine', status: 'completed' },
  { id: 'water', time: '10:30 AM', title: 'Drink Water', status: 'pending' },
  { id: 'lunch', time: '1:00 PM', title: 'Lunch', status: 'pending' },
  { id: 'brain', time: '4:00 PM', title: 'Brain Activity', status: 'pending' },
  { id: 'med-pm', time: '8:00 PM', title: 'Night Medicine', status: 'pending' },
];

export const BRAIN_GAMES = [
  {
    id: 'story',
    title: 'Past stories',
    meta: 'Listen, pause, continue · 8 min',
    moduleId: 'games',
    gameId: 'story-solver',
  },
  {
    id: 'sequence',
    title: 'Sequence recall',
    meta: 'Easy · 4 min',
    moduleId: 'games',
    gameId: 'sequence',
  },
  {
    id: 'faces',
    title: 'Familiar faces',
    meta: 'Easy · 4 min',
    moduleId: 'games',
    gameId: 'faces',
  },
];

export const WEEK_PROGRESS = {
  activities: '5/7',
  engagement: '↑ 12%',
  memory: 'Stable',
  attention: 'Good',
  insight:
    'Memory-game response time has been slightly slower this week. Consider checking sleep, medication timing, and whether the session felt tiring — this is a trend to watch, not a diagnosis.',
};

export const SAFETY = {
  status: 'All Good',
  lastCheckIn: '20 minutes ago',
  zone: 'Home — Safe Zone',
};

export const CARE_CIRCLE = [
  { id: 'rina', name: 'Rina', relation: 'Daughter', status: 'Available' },
  { id: 'amit', name: 'Doom', relation: 'Son', status: 'Last check-in 2h ago' },
  { id: 'asha', name: 'ASHA Worker', relation: 'Health worker', status: 'Next visit: Tomorrow' },
];

export const MEMORY_BOOK = [
  { id: 'family', title: 'My Family', tone: 'peach' },
  { id: 'places', title: 'Important Places', tone: 'mint' },
  { id: 'memories', title: 'My Memories', tone: 'sun' },
  { id: 'sounds', title: 'Familiar Sounds', tone: 'sky' },
  { id: 'story', title: 'My Story', tone: 'lilac' },
];

export function greetingForHour(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
