import { isSupabaseConfigured, supabase } from './supabase';

const LOAD_TIMEOUT_MS = 4000;

function withTimeout(promise, ms = LOAD_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), ms);
      promise.finally?.(() => clearTimeout(timer));
    }),
  ]);
}

function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) years -= 1;
  return years;
}

function todayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Doctor-facing patient list based solely on accepted doctor relationships. Never blocks the clinic UI. */
export async function loadDoctorDashboard() {
  try {
    return await withTimeout(loadDoctorDashboardInner());
  } catch {
    return [];
  }
}

async function loadDoctorDashboardInner() {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) return [];
  const { data: links, error: linkError } = await supabase
    .from('care_relationships')
    .select('patient_id')
    .eq('member_id', auth.user.id)
    .eq('relationship_role', 'doctor')
    .eq('status', 'active');
  if (linkError) throw linkError;
  if (!links?.length) return [];

  const { start, end } = todayBounds();
  return Promise.all(links.map(async ({ patient_id: patientId }) => {
    const [profileResult, assessmentResult, routinesResult, eventsResult] = await Promise.all([
      supabase.from('profiles').select('id, display_name, birth_date').eq('id', patientId).single(),
      supabase.from('adl_assessments')
        .select('total_score, answers, created_at')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('routine_items').select('id').eq('patient_id', patientId).eq('active', true),
      supabase.from('alarm_events')
        .select('routine_item_id, action, occurred_at')
        .eq('patient_id', patientId)
        .gte('occurred_at', start)
        .lt('occurred_at', end)
        .order('occurred_at', { ascending: true }),
    ]);
    if (profileResult.error) throw profileResult.error;
    if (assessmentResult.error) throw assessmentResult.error;
    if (routinesResult.error) throw routinesResult.error;
    if (eventsResult.error) throw eventsResult.error;
    const latestEvent = new Map();
    (eventsResult.data || []).forEach((event) => latestEvent.set(event.routine_item_id, event.action));
    const completed = (routinesResult.data || []).filter((item) => latestEvent.get(item.id) === 'done').length;
    const assessment = assessmentResult.data;
    const riskBand = assessment?.answers?.latestEvaluation?.severity_band || null;
    return {
      id: profileResult.data.id,
      name: profileResult.data.display_name || 'Patient',
      age: ageFromBirthDate(profileResult.data.birth_date),
      routineDone: completed,
      routineTotal: (routinesResult.data || []).length,
      adlScore: assessment?.total_score ?? null,
      assessmentAt: assessment?.created_at || null,
      riskBand,
    };
  }));
}

/** The signed-in clinician profile, used instead of a hard-coded doctor identity. */
export async function loadDoctorProfile() {
  try {
    return await withTimeout(loadDoctorProfileInner());
  } catch {
    return null;
  }
}

async function loadDoctorProfileInner() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) return null;
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, phone, birth_date, created_at')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return {
    name: profile?.display_name || auth.user.user_metadata?.display_name || auth.user.email?.split('@')[0] || 'Doctor',
    email: auth.user.email || 'No email on file',
    phone: profile?.phone || null,
    joinedAt: profile?.created_at || auth.user.created_at || null,
  };
}
