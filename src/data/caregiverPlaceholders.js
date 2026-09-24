import aitaPhoto from '../assets/person-aita.jpg';
import daughterPhoto from '../assets/person-daughter.jpg';
import doctorPhoto from '../assets/doctor-profile.png';

export const CG_LIVE = {
  asOf: 'Tue 25 Aug 2026',
  clock: '10:12 IST',
  lastSync: '2 min ago',
  ping: 'Courtyard · 18 min ago',
};

export const CG_PROFILE = {
  name: 'Rina Devi',
  role: 'Daughter · primary caregiver',
  place: 'Jorhat, Assam',
  phone: '94350-11820',
  photoUrl: daughterPhoto,
  note: 'Lives with Latveria. Keeps the evening tablet with dinner, not lights-out.',
};

export const CG_PATIENT = {
  id: 'aita',
  name: 'Latveria Devi',
  shortName: 'Latveria',
  relation: 'Mother',
  age: 78,
  place: 'Jorhat, Assam',
  photoUrl: aitaPhoto,
  mood: 'Calm this afternoon — stayed with the tea-garden story',
  lastCheckIn: '18 min ago',
  zone: 'Home — safe zone',
  appPath: '/user',
  status: 'safe',
  dayTitle: "Latveria's day",
};

export const CG_TODAY = [
  { id: 'tea', time: '7:30 AM', title: 'Morning tea and wash', detail: 'Warm water, gamosa, courtyard light.', done: true, kind: 'Care', state: 'Done' },
  { id: 'am-med', time: '8:00 AM', title: 'Morning medicines', detail: 'Donepezil 5 mg + Amlodipine 5 mg with tea.', done: true, kind: 'Meds', state: 'Done' },
  { id: 'lunch', time: '1:00 PM', title: 'Lunch with Latveria', detail: 'Rice, dal, a little fish. Stay until the plate is quiet.', done: true, kind: 'Meal', state: 'Done' },
  { id: 'ca', time: '1:30 PM', title: 'Calcium + D3', detail: 'After lunch. Water beside the tablet.', done: false, kind: 'Meds', state: 'Due' },
  { id: 'story', time: '4:00 PM', title: 'Story game / talk', detail: 'Past stories in Assamese or Hindi. Stay for the whole breath.', done: false, kind: 'Check-in', state: 'Now' },
  { id: 'walk', time: '6:30 PM', title: 'Courtyard walk', detail: 'Fifteen minutes before dusk. Watch the verandah step.', done: false, kind: 'Care', state: 'Next' },
  { id: 'pm-med', time: '8:30 PM', title: 'Night tablet', detail: 'With dinner, not with sleep. Confirm swallow.', done: false, kind: 'Meds', state: 'Tonight' },
];

export const CG_MEDS = [
  { id: 'donepezil', name: 'Donepezil 5 mg', time: '8:00 AM', status: 'Taken', note: 'With breakfast tea', next: 'Tomorrow 8:00 AM' },
  { id: 'bp', name: 'Amlodipine 5 mg', time: '8:00 AM', status: 'Taken', note: 'Blood pressure', next: 'Tomorrow 8:00 AM' },
  { id: 'calcium', name: 'Calcium + D3', time: '1:30 PM', status: 'Due', note: 'After lunch', next: 'Today 1:30 PM' },
  { id: 'night', name: 'Night tablet', time: '8:30 PM', status: 'Scheduled', note: 'After dinner — not at lights-out', next: 'Today 8:30 PM' },
];

export const CG_REFILLS = [
  { name: 'Donepezil 5 mg', left: '9 days', clinic: 'NPHCE OPD · Dr. Meera Sharma', due: '3 Sep' },
  { name: 'Amlodipine 5 mg', left: '21 days', clinic: 'Jan Aushadhi, Jorhat', due: '15 Sep' },
  { name: 'Calcium + D3', left: '12 days', clinic: 'Local chemist', due: '6 Sep' },
];

export const CG_ROUTINE = [
  { time: '7:30 AM', title: 'Wake, wash, tea', status: 'Done' },
  { time: '8:00 AM', title: 'Morning medicines', status: 'Done' },
  { time: '10:30 AM', title: 'Water and rest', status: 'Done' },
  { time: '1:00 PM', title: 'Lunch', status: 'Done' },
  { time: '4:00 PM', title: 'Story game / talk', status: 'Now' },
  { time: '6:30 PM', title: 'Evening walk in courtyard', status: 'Next' },
  { time: '8:30 PM', title: 'Night medicine', status: 'Next' },
];

export const CG_CALENDAR = [
  { day: 'Mon 24', today: false, items: [{ t: '08:00', kind: 'Meds', label: 'Morning meds' }, { t: '18:30', kind: 'Walk', label: 'Courtyard walk with Latveria' }] },
  { day: 'Tue 25', today: true, items: [{ t: '10:15', kind: 'OPD', label: 'Dr. Meera Sharma' }, { t: '16:00', kind: 'Game', label: 'Story game' }] },
  { day: 'Wed 26', today: false, items: [{ t: '11:00', kind: 'ASHA', label: 'Anita Das visit' }, { t: '13:30', kind: 'Meds', label: 'Calcium' }] },
  { day: 'Thu 27', today: false, items: [{ t: '08:00', kind: 'Meds', label: 'Morning meds' }, { t: '16:00', kind: 'Call', label: 'Call Doom (Guwahati)' }] },
  { day: 'Fri 28', today: false, items: [{ t: '15:00', kind: 'Tele', label: 'Tele-MANAS (clinic)' }, { t: '18:30', kind: 'Walk', label: 'Walk' }] },
  { day: 'Sat 29', today: false, items: [{ t: '09:30', kind: 'OPD', label: 'OPD with Latveria' }, { t: '19:00', kind: 'Family', label: 'Family call — Rina + Doom' }] },
  { day: 'Sun 30', today: false, items: [{ t: '—', kind: 'Home', label: 'Quiet day · refill check' }] },
];

export const CG_ENGAGEMENT = {
  gamesThisWeek: 5,
  voiceMinutes: 42,
  storyBeats: '18 / 24',
  moodNote: 'Stayed with the Bihu courtyard story. Two pauses needed; finished kindly. Latveria named the dhol before Doom’s birthday joke.',
  days: [
    { d: 'Mon', v: 70 },
    { d: 'Tue', v: 82 },
    { d: 'Wed', v: 64 },
    { d: 'Thu', v: 90 },
    { d: 'Fri', v: 76 },
    { d: 'Sat', v: 58 },
    { d: 'Sun', v: 40 },
  ],
};

export function getMemoryQuizResult() {
  try {
    const raw = localStorage.getItem('smritiSaarthiMemoryResult');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const CG_CIRCLE = [
  {
    id: 'rina',
    name: 'Rina Devi',
    role: 'Daughter · primary',
    status: 'Here',
    note: 'This device · with Latveria',
    phone: '94350-11820',
    photoUrl: daughterPhoto,
  },
  {
    id: 'amit',
    name: 'Doom',
    role: 'Son · Guwahati',
    status: 'Away',
    note: 'Check-in 2h ago · calls Thu evening',
    phone: '98640-22118',
    photoUrl: '',
  },
  {
    id: 'asha',
    name: 'Anita Das',
    role: 'ASHA worker',
    status: 'Tomorrow',
    note: 'BP and tablets · Wed 11:00',
    phone: '60012-44890',
    photoUrl: '',
  },
  {
    id: 'clinic',
    name: 'Dr. Meera Sharma',
    role: 'Geriatric clinic',
    status: 'Fri review',
    note: 'NPHCE OPD · Jorhat',
    phone: '0376-2371040',
    photoUrl: doctorPhoto,
  },
];

export const CG_MESSAGES = [
  { from: 'Doom', time: '2:10 PM', rel: '4 h ago', text: 'Reached campus. Call if Latveria’s evening tablet is late — I can stay on the line.' },
  { from: 'Anita Das', time: 'Yesterday', rel: 'Yesterday', text: 'BP was 128/78 for Latveria. Continue the same dose. See you Wednesday.' },
  { from: 'Dr. Meera Sharma', time: 'Mon', rel: 'Yesterday', text: 'Session note uploaded. Keep 20:30 tablet with dinner. Rina — bring her Saturday if the walk feels unsteady.' },
];

export const CG_DOCTOR_NOTES = [
  { date: 'Today 11:20', rel: '5 h ago', text: 'Evening tablet was on time yesterday. Latveria stayed with the tea-garden story for eight beats. A little tired after lunch — rest before the walk.' },
  { date: '24 Aug', rel: 'Yesterday', text: 'Two delays last week at 20:30. Reminder now sits on the kitchen shelf, not the bedroom. Doom called once to confirm.' },
];

export const CG_DOCS = [
  { name: 'Prescription — Latveria · July 2026', kind: 'PDF', updated: '12 Aug', shared: 'Circle' },
  { name: 'Aadhaar (masked copy) · Latveria Devi', kind: 'Image', updated: 'On file', shared: 'Clinic' },
  { name: 'Discharge summary 2024', kind: 'PDF', updated: 'Shared', shared: 'Circle' },
  { name: 'Lab — CBC, sugar · Aug 2026', kind: 'PDF', updated: '3 Aug', shared: 'Dr. Meera Sharma' },
];

export const CG_CHECKINS = [
  { time: '4:02 PM', rel: '18 min ago', place: 'Courtyard', note: 'Latveria started the story game — Rina sitting with her' },
  { time: '1:18 PM', rel: '3 h ago', place: 'Kitchen', note: 'Lunch finished · plate quiet' },
  { time: '10:40 AM', rel: '5 h ago', place: 'Verandah', note: 'Rest after tea · calm, oriented to home' },
  { time: '8:11 AM', rel: '8 h ago', place: 'Home', note: 'Morning tablets taken with tea' },
];
