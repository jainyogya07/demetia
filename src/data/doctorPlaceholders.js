import doctorPhoto from '../assets/doctor-profile.png';

export const DR_LIVE = {
  asOf: 'Tue 25 Aug 2026',
  clock: '10:12 IST',
  lastSync: '2 min ago',
  feed: 'Courtyard ping · Latveria Devi',
};

export const DR_CLINIC = {
  name: 'Dr. Meera Sharma',
  short: 'Dr. Sharma',
  initials: 'MS',
  title: 'Consultant Geriatrician',
  degrees: 'MBBS, MD (Geriatrics)',
  reg: 'ASM Medical Council · 21458',
  site: 'NPHCE Geriatric OPD',
  hospital: 'Jorhat Medical College & Hospital',
  city: 'Jorhat, Assam',
  hours: 'Mon–Sat 09:00–13:30',
  tele: 'Tele-MANAS Fri 15:00',
  phone: '0376-2371040',
  email: 'geriatrics.jmch@nphce.gov.in',
  photoUrl: doctorPhoto,
  opdToday: 'Tue 25 Aug · 10:15 Latveria · 15:00 Moni Tele-MANAS',
};

export const DR_PATIENTS = [
  {
    id: 'aita',
    name: 'Latveria Devi',
    age: 78,
    sex: 'F',
    village: 'Jorhat, Assam',
    photoUrl: '',
    stage: 'Mild–moderate memory change',
    status: 'watch',
    lastVisit: '18 Aug 2026',
    lastSeenRel: '18 min ago',
    lastSeenPlace: 'Courtyard',
    alerts: 1,
    mmse: 22,
    bp: '138/82',
    hr: 74,
    sugar: '142 mg/dL',
    caregiver: 'Rina Devi',
    caregiverRole: 'Daughter',
    appPath: '/user',
    comorbidities: ['Hypertension', 'Osteoarthritis', 'Vitamin D low'],
  },
  {
    id: 'binod',
    name: 'Binod Kalita',
    age: 81,
    sex: 'M',
    village: 'Golaghat',
    photoUrl: '',
    stage: 'Mild memory change',
    status: 'stable',
    lastVisit: '4 Aug 2026',
    lastSeenRel: 'Yesterday 19:10',
    lastSeenPlace: 'Home',
    alerts: 0,
    mmse: 25,
    bp: '128/76',
    hr: 68,
    sugar: '118 mg/dL',
    caregiver: 'Doom Kalita',
    caregiverRole: 'Son',
    appPath: '',
    comorbidities: ['Type 2 diabetes', 'Hearing loss'],
  },
  {
    id: 'moni',
    name: 'Moni Sangma',
    age: 74,
    sex: 'F',
    village: 'Tura (review)',
    photoUrl: '',
    stage: 'Watchful waiting',
    status: 'urgent',
    lastVisit: '22 Jul 2026',
    lastSeenRel: '3 h ago',
    lastSeenPlace: 'Home lane · missed ping',
    alerts: 2,
    mmse: 26,
    bp: '150/90',
    hr: 82,
    sugar: '108 mg/dL',
    caregiver: 'Nengminza Sangma',
    caregiverRole: 'Daughter',
    appPath: '',
    comorbidities: ['Hypothyroid'],
  },
];

export const DR_TASKS = [
  { id: 't1', title: 'Review MMSE trend vs Aug visit', due: 'Today 11:00', dueRel: 'Due in 8h', priority: 'high', patientId: 'aita', done: false, kind: 'Review' },
  { id: 't2', title: 'Call caregiver — evening tablet delayed twice', due: 'Today 12:30', dueRel: 'Due in 10h', priority: 'high', patientId: 'aita', done: false, kind: 'Call' },
  { id: 't3', title: 'Sign Donepezil 5 mg refill', due: 'Today 13:00', dueRel: 'Due in 11h', priority: 'high', patientId: 'aita', done: false, kind: 'Sign' },
  { id: 't4', title: 'Med reconciliation after Golaghat labs', due: 'Today 16:00', dueRel: 'Due in 14h', priority: 'mid', patientId: 'binod', done: false, kind: 'Meds' },
  { id: 't5', title: 'Tele-MANAS follow-up note', due: 'Tomorrow 15:00', dueRel: 'Tomorrow', priority: 'mid', patientId: 'moni', done: false, kind: 'Note' },
  { id: 't6', title: 'NPHCE monthly engagement export', due: 'Fri 17:00', dueRel: 'Fri', priority: 'low', patientId: null, done: false, kind: 'Export' },
];

export const DR_CALENDAR = [
  { day: 'Mon 24', today: false, items: [{ t: '09:30', kind: 'OPD', label: 'Binod Kalita', who: 'binod' }, { t: '11:00', kind: 'Home', label: 'Visit slot (held)', who: null }] },
  { day: 'Tue 25', today: true, items: [{ t: '09:00', kind: 'Board', label: 'OPD board', who: null }, { t: '10:15', kind: 'OPD', label: 'Latveria Devi · review', who: 'aita' }, { t: '15:00', kind: 'Tele', label: 'Tele-MANAS · Moni', who: 'moni' }] },
  { day: 'Wed 26', today: false, items: [{ t: '09:30', kind: 'OPD', label: 'New memory clinic', who: null }, { t: '12:00', kind: 'ASHA', label: 'ASHA huddle', who: null }] },
  { day: 'Thu 27', today: false, items: [{ t: '10:00', kind: 'OPD', label: 'Binod · diabetes + hearing', who: 'binod' }] },
  { day: 'Fri 28', today: false, items: [{ t: '09:00', kind: 'OPD', label: 'Open slots', who: null }, { t: '15:00', kind: 'Tele', label: 'Tele-MANAS block', who: null }] },
  { day: 'Sat 29', today: false, items: [{ t: '09:30', kind: 'OPD', label: 'Latveria · Rina in room', who: 'aita' }, { t: '11:30', kind: 'Home', label: 'Jorhat ward visit', who: null }] },
  { day: 'Sun 30', today: false, items: [{ t: '—', kind: 'On-call', label: 'Geriatric roster', who: null }] },
];

export const DR_COGNITIVE = {
  aita: [
    { week: 'W1', memory: 72, attention: 68, engagement: 80 },
    { week: 'W2', memory: 70, attention: 71, engagement: 78 },
    { week: 'W3', memory: 66, attention: 69, engagement: 74 },
    { week: 'W4', memory: 67, attention: 70, engagement: 82 },
  ],
  binod: [
    { week: 'W1', memory: 78, attention: 74, engagement: 70 },
    { week: 'W2', memory: 77, attention: 75, engagement: 72 },
    { week: 'W3', memory: 76, attention: 73, engagement: 69 },
    { week: 'W4', memory: 79, attention: 76, engagement: 74 },
  ],
  moni: [
    { week: 'W1', memory: 81, attention: 80, engagement: 64 },
    { week: 'W2', memory: 80, attention: 79, engagement: 60 },
    { week: 'W3', memory: 82, attention: 78, engagement: 58 },
    { week: 'W4', memory: 80, attention: 77, engagement: 55 },
  ],
};

export const DR_MEDS = {
  aita: [
    { name: 'Donepezil 5 mg', dose: '1–0–0', reason: 'Cognition (trial)', from: 'Jun 2026', sign: true },
    { name: 'Amlodipine 5 mg', dose: '1–0–0', reason: 'Hypertension', from: '2021', sign: false },
    { name: 'Calcium + D3', dose: '0–1–0', reason: 'Bone health', from: 'Mar 2026', sign: false },
  ],
  binod: [
    { name: 'Metformin 500 mg', dose: '1–0–1', reason: 'T2DM', from: '2018', sign: false },
    { name: 'Atorvastatin 10 mg', dose: '0–0–1', reason: 'Lipids', from: '2022', sign: true },
  ],
  moni: [
    { name: 'Thyroxine 50 mcg', dose: '1–0–0', reason: 'Hypothyroid', from: '2019', sign: false },
  ],
};

export const DR_NOTES = {
  aita: [
    { date: '18 Aug 2026', by: 'Dr. Sharma', text: 'Family: slower word-finding after lunch. Orientation to home preserved. No new falls. Continue 5 mg. Review 4 weeks. Monitoring visit, not a diagnosis visit.' },
    { date: '21 Jul 2026', by: 'Dr. Sharma', text: 'Story-game engagement good in Hindi/Assamese. Two missed evening tablets last week — daughter now sets 20:30 reminder.' },
  ],
  binod: [
    { date: '4 Aug 2026', by: 'Dr. Sharma', text: 'Hearing aid trial discussed. Fasting sugar acceptable. Son will sit in next OPD.' },
  ],
  moni: [
    { date: '22 Jul 2026', by: 'Dr. Sharma', text: 'Watchful waiting. Two safety flags from Tura family: evening wandering risk near the lane, missed Tele-MANAS ping. No med change today.' },
  ],
};

export const DR_ALERTS = [
  { id: 'a1', patientId: 'aita', level: 'Watch', title: 'Evening tablet delayed twice', when: 'This week', detail: 'Caregiver marked 20:30 dose late Tue and Sat. Morning dose taken.', open: true },
  { id: 'a2', patientId: 'moni', level: 'Urgent', title: 'Missed evening check-in', when: 'Today 18:40', detail: 'No courtyard ping after 18:00. Daughter notified. Last GPS home lane.', open: true },
  { id: 'a3', patientId: 'moni', level: 'Watch', title: 'Engagement falling', when: '3 weeks', detail: 'Voice minutes down; games skipped Sun–Tue. Not a diagnosis — flag for Tele-MANAS.', open: true },
  { id: 'a4', patientId: 'aita', level: 'Clear', title: 'Safe zone', when: '18 min ago', detail: 'Last location home courtyard. Check-in 18 min ago.', open: false },
];

export const DR_REPORTS = [
  { name: '4-week engagement · Latveria Devi', date: '18 Aug 2026', kind: 'Clinic PDF', patientId: 'aita', status: 'Ready' },
  { name: 'Medication list (current) · Latveria', date: '18 Aug 2026', kind: 'Share with family', patientId: 'aita', status: 'Ready' },
  { name: 'Safety check-in log', date: '24 Aug 2026', kind: 'Export', patientId: null, status: 'Ready' },
  { name: 'NPHCE monthly OPD summary', date: 'Due 29 Aug', kind: 'State report', patientId: null, status: 'Draft' },
];

export const DR_CAREPLAN = {
  aita: [
    { item: 'Keep Donepezil 5 mg AM with tea', owner: 'Rina', by: 'Ongoing' },
    { item: 'Walk courtyard 15 min before dusk', owner: 'Rina', by: 'Daily' },
    { item: 'Story game 4×/week in Assamese or Hindi', owner: 'Latveria / Rina', by: 'This week' },
    { item: 'Confirm 20:30 tablet with dinner', owner: 'Rina', by: 'Tonight' },
    { item: 'OPD review', owner: 'Dr. Sharma', by: '15 Sep 2026' },
  ],
  binod: [
    { item: 'Hearing aid trial at next visit', owner: 'Doom', by: 'Thu 27' },
    { item: 'Metformin unchanged', owner: 'Clinic', by: 'Ongoing' },
    { item: 'Son to attend OPD', owner: 'Doom', by: 'Thu 27' },
  ],
  moni: [
    { item: 'No new cognition drug', owner: 'Dr. Sharma', by: 'Hold' },
    { item: 'Evening check-in alarm 18:00', owner: 'Nengminza', by: 'Tonight' },
    { item: 'Tele-MANAS Friday', owner: 'Clinic', by: 'Fri 15:00' },
  ],
};

export const DR_TIMELINE = {
  aita: [
    { when: 'Today 16:02', rel: '18 min ago', text: 'Story game started', place: 'Courtyard' },
    { when: 'Today 13:18', rel: '3 h ago', text: 'Lunch finished', place: 'Kitchen' },
    { when: '18 Aug', rel: '7 days ago', text: 'OPD · MMSE 22 · notes signed', place: 'NPHCE OPD' },
    { when: '12 Aug', rel: '13 days ago', text: 'Evening tablet late 42 min', place: 'Home' },
  ],
  binod: [
    { when: 'Yesterday 19:10', rel: 'Yesterday', text: 'Home ping · no alerts', place: 'Golaghat' },
    { when: '4 Aug', rel: '21 days ago', text: 'OPD · labs reviewed', place: 'Clinic' },
  ],
  moni: [
    { when: 'Today 18:40', rel: '3 h ago', text: 'Missed check-in flag', place: 'Home lane' },
    { when: '22 Jul', rel: '34 days ago', text: 'Review visit · Tura referral', place: 'OPD' },
  ],
};

export const DR_MESSAGES = [
  { to: 'Rina Devi', re: 'Latveria', sent: 'Today 11:05', text: 'Please keep 20:30 tablet with dinner, not with sleep. Call if two delays this week.' },
  { to: 'Nengminza Sangma', re: 'Moni', sent: 'Today 18:42', text: 'Evening ping missing. Confirm she is home. Tele-MANAS Friday held.' },
];
