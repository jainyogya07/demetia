/**
 * Caregiver Assistant Catalog & Command Resolver
 * Handles caregiver dashboard navigation, task & calendar automation,
 * cognitive assessment triggers, and AI memory training.
 */

export const CAREGIVER_SCREENS = [
  {
    id: 'overview',
    path: '/caregiver',
    label: 'Overview & Today',
    say: 'Opening today’s caregiver overview.',
    aliases: ['overview', 'today', 'aaj', 'dashboard', 'home', 'main page', 'shuruwat', 'summary'],
  },
  {
    id: 'routine',
    path: '/caregiver/routine',
    label: 'Daily Routine & Meds',
    say: 'Opening daily routine and medications.',
    aliases: ['routine', 'meds', 'medication', 'dawa', 'medicine', 'pills', 'dincharya', 'schedule', 'tablets'],
  },
  {
    id: 'calendar',
    path: '/caregiver/calendar',
    label: 'Weekly Calendar',
    say: 'Opening the weekly care calendar.',
    aliases: ['calendar', 'week', 'hafta', 'board', 'appointments', 'visits', 'dr sharma', 'asha'],
  },
  {
    id: 'safety',
    path: '/caregiver/safety',
    label: 'Safety & GPS Location',
    say: 'Opening safety zone and location tracking.',
    aliases: ['safety', 'location', 'gps', 'map', 'zone', 'kahan hai', 'suraksha', 'geofence', 'safe zone'],
  },
  {
    id: 'progress',
    path: '/caregiver/progress',
    label: 'Progress & Trends',
    say: 'Opening memory progress and engagement trends.',
    aliases: ['progress', 'score', 'trends', 'report', 'hafta kaisa', 'engagement', 'analytics'],
  },
  {
    id: 'assessment',
    path: '/caregiver/assessment',
    label: 'Cognitive Assessment',
    say: 'Opening clinical cognitive assessment.',
    aliases: ['assessment board', 'faq screen', 'cognitive assessment', 'telemetry screen'],
  },
  {
    id: 'circle',
    path: '/caregiver/circle',
    label: 'Care Circle',
    say: 'Opening care circle and family contacts.',
    aliases: ['circle', 'family', 'care circle', 'parivar', 'contacts', 'doctor', 'rina', 'doom'],
  },
  {
    id: 'train-ai',
    path: '/caregiver/train-ai',
    label: 'Train Care AI',
    say: 'Opening Train AI knowledge base.',
    aliases: ['train ai', 'teach ai', 'sikhao', 'knowledge', 'facts', 'ai training', 'ai memory'],
  },
  {
    id: 'memory-journey',
    path: '/caregiver/memory-journey',
    label: 'Memory Journey Setup',
    say: 'Opening memory journey and navigation landmarks.',
    aliases: ['memory journey', 'route', 'rasta', 'landmarks', 'navigation setup', 'familiar paths'],
  },
  {
    id: 'documents',
    path: '/caregiver/documents',
    label: 'Prescriptions & Documents',
    say: 'Opening prescriptions and documents.',
    aliases: ['document', 'documents', 'prescriptions', 'kagaz', 'reports', 'parcha', 'medical records'],
  },
  {
    id: 'profile',
    path: '/caregiver/profile',
    label: 'Caregiver Profile',
    say: 'Opening caregiver profile.',
    aliases: ['profile', 'rina', 'account', 'mera profile', 'primary caregiver'],
  },
  {
    id: 'settings',
    path: '/caregiver/settings',
    label: 'Caregiver Settings',
    say: 'Opening caregiver settings.',
    aliases: ['setting', 'settings', 'preferences', 'notifications', 'alerts setup'],
  },
  {
    id: 'patient-view',
    path: '/user',
    label: 'Switch to Patient Dashboard',
    say: 'Switching to the patient dashboard view.',
    aliases: ['patient view', 'patient mode', 'patient screen', 'latveria view', 'switch to patient'],
  },
];

export const CAREGIVER_CHIP_GROUPS = [
  { id: 'status', label: '📊 Patient Status', text: 'Patient status summary batao' },
  { id: 'safety', label: '📍 Check Safety & GPS', text: 'Where is Latveria right now? Safety check karo' },
  { id: 'calendar', label: '📅 Add Dr. Visit (Wed)', text: 'Wednesday calendar mein Dr. Sharma visit add karo' },
  { id: 'routine', label: '💊 Add Routine Med', text: 'Routine mein Donepezil 5mg add karo' },
  { id: 'task', label: '✅ Add Today Task', text: 'Add task: Pick up Donepezil from pharmacy at 5 PM' },
  { id: 'assessment', label: '🧠 Run Assessment', text: 'Run cognitive evaluation on Latveria' },
  { id: 'train', label: '💡 Train AI Fact', text: 'Train AI: She gets anxious around sunset, prefers classical music' },
];

function fold(raw) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[?.!,।;:()[\]{}"“”‘’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function caregiverContextBlock({ currentPath = '/caregiver' } = {}) {
  const currentScreen = CAREGIVER_SCREENS.find((s) => s.path === currentPath) || CAREGIVER_SCREENS[0];
  return `CAREGIVER APP STATE:
- Current screen: ${currentScreen.label} (${currentScreen.path})
- Patient Name: Latveria (Aita)
- Primary Caregiver: Rina Devi
- Key Pages: Overview (/caregiver), Routine (/caregiver/routine), Calendar (/caregiver/calendar), Safety (/caregiver/safety), Assessment (/caregiver/assessment), Train AI (/caregiver/train-ai).
- Available operations: Navigate screens, Add calendar visits, Add routine items, Add/complete today's checklist tasks, Run cognitive evaluations, Add AI knowledge facts, Check GPS & safety status.`;
}

/**
 * Extracts action tags emitted by Gemini or assistant text
 */
export function parseCaregiverTags(text = '') {
  const actions = [];
  const raw = String(text);

  // <<NAVIGATE:...>>
  const navMatches = raw.matchAll(/<<NAVIGATE:([^>]+)>>/gi);
  for (const m of navMatches) {
    actions.push({ kind: 'navigate', path: m[1].trim() });
  }

  // <<CALENDAR_ADD:day=...,time=...,label=...,kind=...>>
  const calMatches = raw.matchAll(/<<CALENDAR_ADD:([^>]+)>>/gi);
  for (const m of calMatches) {
    const params = Object.fromEntries(
      m[1].split(',').map((pair) => pair.split('=').map((s) => s.trim()))
    );
    actions.push({
      kind: 'calendar-add',
      day: params.day || 'Wed',
      time: params.time || '10:00 AM',
      label: params.label || 'Doctor Appointment',
      type: params.kind || 'Clinic',
    });
  }

  // <<TASK_ADD:title=...,time=...,detail=...>>
  const taskMatches = raw.matchAll(/<<TASK_ADD:([^>]+)>>/gi);
  for (const m of taskMatches) {
    const params = Object.fromEntries(
      m[1].split(',').map((pair) => pair.split('=').map((s) => s.trim()))
    );
    actions.push({
      kind: 'task-add',
      title: params.title || 'Checklist task',
      time: params.time || 'Today',
      detail: params.detail || 'Added via assistant',
      taskKind: params.kind || 'Care',
    });
  }

  // <<TASK_TOGGLE:title=...>>
  const taskToggles = raw.matchAll(/<<TASK_TOGGLE:([^>]+)>>/gi);
  for (const m of taskToggles) {
    actions.push({ kind: 'task-toggle', title: m[1].trim() });
  }

  // <<ROUTINE_ADD:time=...,title=...,note=...>>
  const routineMatches = raw.matchAll(/<<ROUTINE_ADD:([^>]+)>>/gi);
  for (const m of routineMatches) {
    const params = Object.fromEntries(
      m[1].split(',').map((pair) => pair.split('=').map((s) => s.trim()))
    );
    actions.push({
      kind: 'routine-add',
      time: params.time || '10:00 AM',
      title: params.title || 'Routine task',
      note: params.note || '',
    });
  }

  // <<TRAIN_AI:category=...,text=...>>
  const trainMatches = raw.matchAll(/<<TRAIN_AI:([^>]+)>>/gi);
  for (const m of trainMatches) {
    const params = Object.fromEntries(
      m[1].split(',').map((pair) => pair.split('=').map((s) => s.trim()))
    );
    actions.push({
      kind: 'train-ai',
      category: params.category || 'about',
      text: params.text || params.fact || m[1],
    });
  }

  // <<RUN_ASSESSMENT>>
  if (/<<RUN_ASSESSMENT>>/i.test(raw)) {
    actions.push({ kind: 'run-assessment' });
  }

  // <<STATUS>>
  if (/<<STATUS>>/i.test(raw)) {
    actions.push({ kind: 'patient-summary' });
  }

  // <<SAFETY>>
  if (/<<SAFETY>>/i.test(raw)) {
    actions.push({ kind: 'check-safety' });
  }

  // <<CALL:...>>
  const callMatches = raw.matchAll(/<<CALL:([^>]+)>>/gi);
  for (const m of callMatches) {
    actions.push({ kind: 'call', name: m[1].trim() });
  }

  return actions;
}

export function stripCaregiverTags(text = '') {
  return String(text || '')
    .replace(/<<[A-Z0-9_]+(?::[^>]+)?>>/gi, '')
    .trim();
}

/**
 * Fast offline / local NLP resolver for Caregiver queries
 */
export function resolveCaregiverUtterance(raw) {
  const text = fold(raw);
  if (!text) return [];

  const actions = [];

  // 1. Patient status / summary
  if (
    text.includes('status') ||
    text.includes('summary') ||
    text.includes('kya haal') ||
    text.includes('how is') ||
    text.includes('aaj ka update') ||
    text.includes('kaisa chal raha')
  ) {
    actions.push({ kind: 'patient-summary' });
    return actions;
  }

  // 2. Safety / Location
  if (
    text.includes('kahan hai') ||
    text.includes('where is') ||
    text.includes('location') ||
    text.includes('gps') ||
    (text.includes('safety') && !text.includes('open'))
  ) {
    actions.push({ kind: 'check-safety' });
    return actions;
  }

  // 3. Cognitive Assessment trigger
  if (
    text.includes('run assessment') ||
    text.includes('evaluate') ||
    text.includes('evaluation') ||
    text.includes('assessment') ||
    text.includes('cognitive') ||
    text.includes('cognitive check') ||
    text.includes('telemetry')
  ) {
    actions.push({ kind: 'run-assessment' });
    return actions;
  }

  // 4. Train AI / Knowledge
  if (
    text.includes('train ai') ||
    text.includes('teach ai') ||
    text.includes('ai ko sikhao') ||
    text.includes('ai ko batao') ||
    text.includes('add fact') ||
    text.includes('add knowledge')
  ) {
    let fact = raw.replace(/train ai|teach ai|ai ko sikhao|ai ko batao|add fact|add knowledge|:/gi, '').trim();
    let category = 'about';
    if (/anxious|sunset|confusion|bhool|pills|morning pill/i.test(fact)) category = 'confusion';
    else if (/walk|tea|routine|breakfast|garden|subah/i.test(fact)) category = 'routine';
    else if (/music|songs|born|shillong|likes/i.test(fact)) category = 'about';
    else if (/daughter|son|rahul|rina|friend|sunita/i.test(fact)) category = 'people';
    else if (/avoid|hospital|work|argue/i.test(fact)) category = 'avoid';
    else if (/say|respond|reply|market/i.test(fact)) category = 'responses';

    actions.push({
      kind: 'train-ai',
      category,
      text: fact || 'Patient prefers calm environments with familiar songs.',
    });
    return actions;
  }

  // 5. Add Calendar Appointment
  const isCalendarAdd = (
    text.includes('appointment') ||
    text.includes('dr sharma') ||
    text.includes('asha worker') ||
    (text.includes('schedule') && !text.includes('screen')) ||
    (text.includes('calendar') && (text.includes('add') || text.includes('jod') || text.includes('visit') || text.includes('entry') || text.includes('daalo') || text.includes('appointment')))
  );

  if (isCalendarAdd) {
    let day = 'Wed';
    if (text.includes('mon')) day = 'Mon';
    else if (text.includes('tue')) day = 'Tue';
    else if (text.includes('wed')) day = 'Wed';
    else if (text.includes('thu')) day = 'Thu';
    else if (text.includes('fri')) day = 'Fri';
    else if (text.includes('sat')) day = 'Sat';
    else if (text.includes('sun')) day = 'Sun';

    let label = 'Dr. Sharma Visit';
    if (text.includes('asha')) label = 'ASHA Check-in';
    else if (text.includes('blood') || text.includes('test')) label = 'Blood Test Follow-up';
    else if (text.includes('physio')) label = 'Physiotherapy Session';

    let time = '11:00 AM';
    const timeMatch = raw.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (timeMatch) time = timeMatch[1];

    actions.push({
      kind: 'calendar-add',
      day,
      time,
      label,
      type: text.includes('asha') ? 'ASHA' : 'Clinic',
    });
    return actions;
  }

  // 6. Add/Complete Today's Task
  if (text.includes('add task') || text.includes('checklist mein add') || text.includes('task add')) {
    const title = raw.replace(/add task|checklist mein add karo|checklist mein add|task add|:/gi, '').trim() || 'Caregiver Reminder';
    actions.push({
      kind: 'task-add',
      title,
      time: 'Today',
      detail: 'Added by Caregiver Assistant',
      taskKind: 'Care',
    });
    return actions;
  }

  if (text.includes('complete task') || text.includes('task done') || text.includes('mark done') || text.includes('task 1 done') || text.includes('check done')) {
    actions.push({ kind: 'task-toggle', title: raw });
    return actions;
  }

  // 7. Add Routine Step / Med
  if (text.includes('routine') && (text.includes('add') || text.includes('jod') || text.includes('dawa') || text.includes('med'))) {
    let medName = raw.replace(/routine mein add karo|routine add|add to routine|add routine|:/gi, '').trim() || 'Donepezil 5mg';
    actions.push({
      kind: 'routine-add',
      time: '08:30 AM',
      title: medName,
      note: 'Added by Caregiver Assistant',
    });
    return actions;
  }

  // 8. Emergency / Call
  if (text.includes('call') || text.includes('phone')) {
    if (text.includes('112') || text.includes('emergency')) {
      actions.push({ kind: 'call', name: 'Emergency 112', phone: '112' });
      return actions;
    }
    if (text.includes('rina')) {
      actions.push({ kind: 'call', name: 'Rina (Daughter)', phone: '+919864011223' });
      return actions;
    }
    if (text.includes('doctor') || text.includes('sharma')) {
      actions.push({ kind: 'call', name: 'Dr. Sharma (Neurologist)', phone: '+919864099887' });
      return actions;
    }
    actions.push({ kind: 'call', name: 'Care Circle' });
    return actions;
  }

  // 9. Screen Navigation
  for (const screen of CAREGIVER_SCREENS) {
    for (const alias of screen.aliases) {
      if (text.includes(alias)) {
        actions.push({ kind: 'navigate', path: screen.path, say: screen.say });
        return actions;
      }
    }
  }

  return actions;
}
