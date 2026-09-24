import { isSupabaseConfigured, supabase } from './supabase';

function localDayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function formatTime(value) {
  if (!value) return '—';
  const [hour, minute] = String(value).split(':').map(Number);
  const date = new Date();
  date.setHours(hour || 0, minute || 0, 0, 0);
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

/** Loads live routine status for the first patient linked to this caregiver/doctor. */
export async function loadCaregiverDashboard() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const caregiver = auth.user;
  if (!caregiver) return null;

  const { data: links, error: linkError } = await supabase
    .from('care_relationships')
    .select('patient_id, relationship_role')
    .eq('member_id', caregiver.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  if (linkError) throw linkError;
  const link = links?.[0];
  if (!link) return null;

  const [profileResult, routineResult] = await Promise.all([
    supabase.from('profiles').select('id, display_name, birth_date').eq('id', link.patient_id).single(),
    supabase.from('routine_items')
      .select('id, title, description, category, local_time, active')
      .eq('patient_id', link.patient_id)
      .eq('active', true)
      .order('local_time'),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (routineResult.error) throw routineResult.error;

  const { start, end } = localDayBounds();
  const { data: events, error: eventError } = await supabase
    .from('alarm_events')
    .select('routine_item_id, action, occurred_at')
    .eq('patient_id', link.patient_id)
    .gte('occurred_at', start)
    .lt('occurred_at', end)
    .order('occurred_at', { ascending: true });
  if (eventError) throw eventError;

  const latestAction = new Map();
  (events || []).forEach((event) => latestAction.set(event.routine_item_id, event));
  const now = Date.now();
  const routine = (routineResult.data || []).map((item) => {
    const event = latestAction.get(item.id);
    const [hour, minute] = String(item.local_time || '00:00').split(':').map(Number);
    const due = new Date();
    due.setHours(hour || 0, minute || 0, 0, 0);
    const completed = event?.action === 'done';
    return {
      ...item,
      time: formatTime(item.local_time),
      completed,
      status: completed ? 'Done' : now >= due.getTime() ? 'Due' : 'Upcoming',
      eventAction: event?.action || null,
    };
  });

  return {
    relationshipRole: link.relationship_role,
    patient: profileResult.data,
    routine,
    completed: routine.filter((item) => item.completed).length,
    due: routine.filter((item) => item.status === 'Due').length,
    lastUpdated: new Date().toISOString(),
  };
}
