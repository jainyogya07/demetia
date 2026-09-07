import {
  PATIENT,
  ROUTINE_ITEMS,
  BRAIN_GAMES,
  WEEK_PROGRESS,
  SAFETY,
  CARE_CIRCLE,
} from './patientDashboard.js';

/*
|--------------------------------------------------------------------------
| Storage keys
|--------------------------------------------------------------------------
*/

export const CG_STORAGE_KEYS = {
  routine: 'smritiSaarthiCaregiverRoutine',
  checkins: 'smritiSaarthiCaregiverCheckins',
  ping: 'smritiSaarthiCaregiverPing',
  patientProfile: 'smritiSaarthiPatientProfile',
};

/*
|--------------------------------------------------------------------------
| Default patient information
|--------------------------------------------------------------------------
|
| The important identity information comes from patient dashboard.js.
| Extra caregiver-side information can later be replaced by backend data.
|
*/

export const DEFAULT_PATIENT_PROFILE = {
  name: PATIENT?.name || 'Latveria',
  roleLabel: PATIENT?.roleLabel || 'Patient',
  photo: PATIENT?.photo || '',
  relation: 'Mother',
  age: 78,
  place: 'Jorhat, Assam',
  language: 'Assamese',
};

/*
|--------------------------------------------------------------------------
| Local storage helpers
|--------------------------------------------------------------------------
*/

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));

    // Lets different caregiver components update immediately.
    window.dispatchEvent(
      new CustomEvent('smriti-saarthi-caregiver-update')
    );
  } catch {
    // Ignore storage errors gracefully.
  }
}

/*
|--------------------------------------------------------------------------
| Patient profile
|--------------------------------------------------------------------------
*/

export function getPatientProfile() {
  const saved = readStorage(
    CG_STORAGE_KEYS.patientProfile,
    {}
  );

  return {
    ...DEFAULT_PATIENT_PROFILE,
    ...saved,

    // Always prefer the actual patient dashboard identity.
    name: PATIENT?.name || saved.name || DEFAULT_PATIENT_PROFILE.name,
    roleLabel:
      PATIENT?.roleLabel ||
      saved.roleLabel ||
      DEFAULT_PATIENT_PROFILE.roleLabel,
    photo: PATIENT?.photo || saved.photo || '',
  };
}

export const CG_PATIENT = getPatientProfile();

/*
|--------------------------------------------------------------------------
| Caregiver profile
|--------------------------------------------------------------------------
*/

export const CG_PROFILE = {
  name: 'Rina Devi',
  role: 'Daughter · primary caregiver',
  place: 'Jorhat, Assam',
  phone: '94350-11820',
  photoUrl: '',
};

/*
|--------------------------------------------------------------------------
| Live information
|--------------------------------------------------------------------------
*/

export function getLiveInfo() {
  const now = new Date();

  const date = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const clock = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return {
    asOf: date,
    clock: `${clock} IST`,
    lastSync: 'Just now',
    ping: getLatestPingText(),
  };
}

export const CG_LIVE = getLiveInfo();

/*
|--------------------------------------------------------------------------
| Routine
|--------------------------------------------------------------------------
|
| ROUTINE_ITEMS is the patient's actual routine source.
| We only add caregiver-specific metadata here.
|
*/

const routineMeta = {
  'med-am': {
    kind: 'Meds',
    detail: 'Morning medicine with breakfast.',
    state: 'Done',
  },

  water: {
    kind: 'Care',
    detail: 'Keep water nearby and encourage a gentle drink.',
    state: 'Due',
  },

  lunch: {
    kind: 'Meal',
    detail: 'Lunch and a calm check-in.',
    state: 'Due',
  },

  brain: {
    kind: 'Check-in',
    detail: 'Memory activity or familiar conversation.',
    state: 'Now',
  },

  'med-pm': {
    kind: 'Meds',
    detail: 'Night medicine with dinner.',
    state: 'Tonight',
  },
};

export const CG_TODAY = ROUTINE_ITEMS.map((item) => ({
  ...item,
  done: item.status === 'completed',
  kind: routineMeta[item.id]?.kind || 'Care',
  detail: routineMeta[item.id]?.detail || '',
  state: routineMeta[item.id]?.state || 'Due',
}));

/*
|--------------------------------------------------------------------------
| Routine state
|--------------------------------------------------------------------------
*/

function initialRoutineState() {
  return Object.fromEntries(
    ROUTINE_ITEMS.map((item) => [
      item.id,
      item.status === 'completed',
    ])
  );
}

export function getRoutineState() {
  return readStorage(
    CG_STORAGE_KEYS.routine,
    initialRoutineState()
  );
}

export function saveRoutineState(state) {
  writeStorage(CG_STORAGE_KEYS.routine, state);
  return state;
}

export function toggleRoutineItem(id) {
  const current = getRoutineState();

  const updated = {
    ...current,
    [id]: !current[id],
  };

  saveRoutineState(updated);

  return updated;
}

export function getTodayTasks() {
  const state = getRoutineState();

  return CG_TODAY.map((task) => ({
    ...task,
    done: !!state[task.id],
  }));
}

/*
|--------------------------------------------------------------------------
| Medicine data
|--------------------------------------------------------------------------
*/

const MEDICINE_MAP = {
  'med-am': {
    id: 'donepezil',
    name: 'Donepezil 5 mg',
    time: '8:00 AM',
    note: 'With breakfast',
  },

  'med-pm': {
    id: 'night',
    name: 'Night tablet',
    time: '8:00 PM',
    note: 'With dinner',
  },
};

export function getCaregiverMedicines() {
  const tasks = getTodayTasks();

  return tasks
    .filter((task) => MEDICINE_MAP[task.id])
    .map((task) => {
      const medicine = MEDICINE_MAP[task.id];

      return {
        ...medicine,
        status: task.done
          ? 'Taken'
          : task.id === 'med-pm'
            ? 'Scheduled'
            : 'Due',
        next: task.done
          ? 'Tomorrow'
          : `Today ${medicine.time}`,
      };
    });
}

export const CG_MEDS = getCaregiverMedicines();

/*
|--------------------------------------------------------------------------
| Refills
|--------------------------------------------------------------------------
*/

export const CG_REFILLS = [
  {
    name: 'Donepezil 5 mg',
    left: '9 days',
    clinic: 'NPHCE OPD · Dr. Sharma',
    due: '3 Sep',
  },
  {
    name: 'Amlodipine 5 mg',
    left: '21 days',
    clinic: 'Jan Aushadhi, Jorhat',
    due: '15 Sep',
  },
  {
    name: 'Calcium + D3',
    left: '12 days',
    clinic: 'Local chemist',
    due: '6 Sep',
  },
];

/*
|--------------------------------------------------------------------------
| Care routine
|--------------------------------------------------------------------------
*/

export const CG_ROUTINE = ROUTINE_ITEMS.map((item) => ({
  time: item.time,
  title: item.title,
  status: item.status === 'completed' ? 'Done' : 'Pending',
  id: item.id,
}));

/*
|--------------------------------------------------------------------------
| Brain engagement
|--------------------------------------------------------------------------
*/

export const CG_BRAIN_GAMES = BRAIN_GAMES;

export function getMemoryQuizResult() {
  if (typeof window === 'undefined') return null;

  try {
    const value = localStorage.getItem(
      'smritiSaarthiMemoryResult'
    );

    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function getDynamicEngagement() {
  const quizResult = getMemoryQuizResult();

  const completedGames = CG_BRAIN_GAMES.length;

  return {
    gamesThisWeek: completedGames,
    voiceMinutes: 42,
    storyBeats: '18 / 24',

    moodNote:
      quizResult
        ? 'Latest memory activity has been recorded. Continue gently and allow pauses when needed.'
        : 'Memory activity is ready. Short, familiar sessions are encouraged.',

    days: [
      { d: 'Mon', v: 70 },
      { d: 'Tue', v: 82 },
      { d: 'Wed', v: 64 },
      { d: 'Thu', v: 90 },
      { d: 'Fri', v: 76 },
      { d: 'Sat', v: 58 },
      { d: 'Sun', v: 40 },
    ],

    quizResult,
    patientProgress: WEEK_PROGRESS,
  };
}

export const CG_ENGAGEMENT = getDynamicEngagement();

/*
|--------------------------------------------------------------------------
| Safety
|--------------------------------------------------------------------------
*/

export function getLatestPing() {
  return readStorage(CG_STORAGE_KEYS.ping, null);
}

export function getLatestPingText() {
  const ping = getLatestPing();

  if (!ping) {
    return 'Home · recent check-in';
  }

  return `${ping.place || 'Home'} · ${ping.minutes || 0} min ago`;
}

export function createCaregiverPing(place = 'Home') {
  const ping = {
    place,
    timestamp: Date.now(),
    minutes: 0,
  };

  writeStorage(CG_STORAGE_KEYS.ping, ping);

  return ping;
}

export function getSafetyData() {
  const ping = getLatestPing();

  if (!ping) {
    return {
      status: SAFETY?.status || 'All Good',
      lastCheckIn: SAFETY?.lastCheckIn || '20 minutes ago',
      zone: SAFETY?.zone || 'Home — Safe Zone',
    };
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - ping.timestamp) / 60000)
  );

  return {
    status: 'All Good',
    lastCheckIn:
      minutes === 0
        ? 'Just now'
        : `${minutes} minute${minutes === 1 ? '' : 's'} ago`,
    zone: `${ping.place} — Safe Zone`,
  };
}

/*
|--------------------------------------------------------------------------
| Check-ins
|--------------------------------------------------------------------------
*/

export const CG_CHECKINS_DEFAULT = [
  {
    time: '4:02 PM',
    rel: '18 min ago',
    place: 'Courtyard',
    note: 'Story game started',
  },
  {
    time: '1:18 PM',
    rel: '3 h ago',
    place: 'Kitchen',
    note: 'Lunch finished',
  },
  {
    time: '8:11 AM',
    rel: '8 h ago',
    place: 'Home',
    note: 'Morning tablets taken',
  },
];

export function getCheckins() {
  return readStorage(
    CG_STORAGE_KEYS.checkins,
    CG_CHECKINS_DEFAULT
  );
}

export function addCheckin(place, note) {
  const now = new Date();

  const item = {
    time: now.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    rel: 'Just now',
    place,
    note,
  };

  const updated = [item, ...getCheckins()].slice(0, 10);

  writeStorage(CG_STORAGE_KEYS.checkins, updated);

  createCaregiverPing(place);

  return updated;
}

export const CG_CHECKINS = getCheckins();

/*
|--------------------------------------------------------------------------
| Calendar
|--------------------------------------------------------------------------
*/

export const CG_CALENDAR = [
  {
    day: 'Mon',
    today: false,
    items: [
      { t: '08:00', kind: 'Meds', label: 'Morning meds' },
      { t: '18:30', kind: 'Walk', label: 'Courtyard walk' },
    ],
  },
  {
    day: 'Tue',
    today: true,
    items: [
      { t: '10:15', kind: 'OPD', label: 'Dr. Sharma' },
      { t: '16:00', kind: 'Game', label: 'Story game' },
    ],
  },
  {
    day: 'Wed',
    today: false,
    items: [
      { t: '11:00', kind: 'ASHA', label: 'Anita Das visit' },
      { t: '13:30', kind: 'Meds', label: 'Calcium' },
    ],
  },
  {
    day: 'Thu',
    today: false,
    items: [
      { t: '08:00', kind: 'Meds', label: 'Morning meds' },
      { t: '16:00', kind: 'Call', label: 'Family call' },
    ],
  },
  {
    day: 'Fri',
    today: false,
    items: [
      { t: '15:00', kind: 'Tele', label: 'Tele consultation' },
      { t: '18:30', kind: 'Walk', label: 'Walk' },
    ],
  },
  {
    day: 'Sat',
    today: false,
    items: [
      { t: '09:30', kind: 'OPD', label: 'OPD review' },
      { t: '19:00', kind: 'Family', label: 'Family call' },
    ],
  },
  {
    day: 'Sun',
    today: false,
    items: [
      { t: '—', kind: 'Home', label: 'Quiet day · refill check' },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Care circle
|--------------------------------------------------------------------------
*/

export const CG_CIRCLE = CARE_CIRCLE.map((person, index) => ({
  id: person.id || `circle-${index}`,
  name: person.name,
  role: person.relation,
  status:
    person.status === 'Available'
      ? 'Here'
      : person.status,
  note: person.status,
  phone:
    person.id === 'rina'
      ? '94350-11820'
      : person.id === 'amit'
        ? '98640-22118'
        : '60012-44890',
}));

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

export const CG_MESSAGES = [
  {
    from: 'Doom',
    time: '2:10 PM',
    rel: '4 h ago',
    text: 'Reached campus. Call if the evening tablet is late.',
  },
  {
    from: 'Anita Das',
    time: 'Yesterday',
    rel: 'Yesterday',
    text: 'BP was 128/78. Continue the same dose.',
  },
  {
    from: 'Dr. Sharma',
    time: 'Mon',
    rel: 'Yesterday',
    text: 'Session note uploaded. Keep the tablet with dinner.',
  },
];

/*
|--------------------------------------------------------------------------
| Doctor notes
|--------------------------------------------------------------------------
*/

export const CG_DOCTOR_NOTES = [
  {
    date: 'Today',
    rel: 'Recent',
    text: 'Evening tablet was on time yesterday. Latveria stayed with the tea-garden story. A little tired after lunch — rest before the walk.',
  },
  {
    date: '24 Aug',
    rel: 'Yesterday',
    text: 'Two delays last week. Reminder now sits on the kitchen shelf rather than the bedroom.',
  },
];

/*
|--------------------------------------------------------------------------
| Documents
|--------------------------------------------------------------------------
*/

export const CG_DOCS = [
  {
    name: 'Prescription — July 2026',
    kind: 'PDF',
    updated: '12 Aug',
    shared: 'Circle',
  },
  {
    name: 'Aadhaar (masked copy)',
    kind: 'Image',
    updated: 'On file',
    shared: 'Clinic',
  },
  {
    name: 'Discharge summary 2024',
    kind: 'PDF',
    updated: 'Shared',
    shared: 'Circle',
  },
  {
    name: 'Lab — CBC, sugar',
    kind: 'PDF',
    updated: '3 Aug',
    shared: 'Dr. Sharma',
  },
];

/*
|--------------------------------------------------------------------------
| Compatibility exports
|--------------------------------------------------------------------------
*/

export const CG_TODAY_INITIAL = CG_TODAY;