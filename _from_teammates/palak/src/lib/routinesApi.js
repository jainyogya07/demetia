import { ensureSupabaseProfile, isSupabaseConfigured, supabase } from './supabase';

const remoteIds = new Map();

function localDayBounds(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function categoryFor(item) {
  if (item.type === 'medicine') return 'medicine';
  if (item.type === 'meal') return 'meal';
  return 'activity';
}

function timeFor(item) {
  return `${String(item.hour).padStart(2, '0')}:${String(item.minute).padStart(2, '0')}:00`;
}

async function currentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user || null;
}

/** Seeds the familiar daily routine once, then returns today's completion state from Supabase. */
export async function hydrateSupabaseRoutine(template, now = new Date()) {
  const user = await currentUser();
  if (!user) return null;
  await ensureSupabaseProfile(user);

  let { data: rows, error } = await supabase
    .from('routine_items')
    .select('id, title')
    .eq('patient_id', user.id)
    .eq('active', true)
    .order('local_time');
  if (error) throw error;

  if (!rows?.length) {
    const seed = template.map((item) => ({
      patient_id: user.id,
      created_by: user.id,
      title: item.title,
      description: item.subtitle || '',
      category: categoryFor(item),
      local_time: timeFor(item),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    }));
    const inserted = await supabase.from('routine_items').insert(seed).select('id, title');
    if (inserted.error) throw inserted.error;
    rows = inserted.data || [];
  }

  const byTitle = new Map(rows.map((row) => [row.title, row.id]));
  template.forEach((item) => {
    const remoteId = byTitle.get(item.title);
    if (remoteId) remoteIds.set(item.id, remoteId);
  });

  const { start, end } = localDayBounds(now);
  const { data: events, error: eventError } = await supabase
    .from('alarm_events')
    .select('routine_item_id, action, occurred_at')
    .eq('patient_id', user.id)
    .gte('occurred_at', start)
    .lt('occurred_at', end)
    .order('occurred_at', { ascending: true });
  if (eventError) throw eventError;

  const latest = new Map();
  (events || []).forEach((event) => latest.set(event.routine_item_id, event.action));
  const completed = {};
  template.forEach((item) => {
    const remoteId = remoteIds.get(item.id);
    if (remoteId && latest.get(remoteId) === 'done') completed[item.id] = new Date().toISOString();
  });
  return completed;
}

/** Persist a reminder state transition. Local UI keeps working if the device is offline. */
export async function recordSupabaseRoutineEvent(localRoutineId, action, details = {}) {
  const user = await currentUser();
  const routineItemId = remoteIds.get(localRoutineId);
  if (!user || !routineItemId) return false;
  const { error } = await supabase.from('alarm_events').insert({
    routine_item_id: routineItemId,
    patient_id: user.id,
    action,
    details,
  });
  if (error) throw error;
  return true;
}
