import { ensureSupabaseProfile, isSupabaseConfigured, supabase } from './supabase';

async function currentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user || null;
}

/** Creates a pending invitation. The recipient can accept only from the invited email address. */
export async function createCareInvite({ email, relationshipRole = 'caregiver' }) {
  const user = await currentUser();
  if (!user) throw new Error('Sign in before inviting a care team member.');
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Enter a valid email address.');
  if (!['caregiver', 'doctor'].includes(relationshipRole)) throw new Error('Choose caregiver or doctor.');
  await ensureSupabaseProfile(user);
  const { data, error } = await supabase
    .from('care_invites')
    .insert({ patient_id: user.id, email: normalizedEmail, relationship_role: relationshipRole })
    .select('id, email, relationship_role, status, expires_at, created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function listSentCareInvites() {
  const user = await currentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('care_invites')
    .select('id, email, relationship_role, status, expires_at, created_at')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listReceivedCareInvites() {
  const user = await currentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('care_invites')
    .select('id, patient_id, relationship_role, status, expires_at, created_at')
    .eq('email', user.email?.toLowerCase() || '')
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/** Accepting an invite automatically creates the active care_relationship through a database trigger. */
export async function acceptCareInvite(inviteId) {
  const user = await currentUser();
  if (!user) throw new Error('Sign in before accepting an invitation.');
  await ensureSupabaseProfile(user);
  const { data, error } = await supabase
    .from('care_invites')
    .update({ status: 'accepted', accepted_by: user.id })
    .eq('id', inviteId)
    .select('id, patient_id, relationship_role, status')
    .single();
  if (error) throw error;
  return data;
}

export async function listCareTeam() {
  const user = await currentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('care_relationships')
    .select('patient_id, member_id, relationship_role, status')
    .or(`patient_id.eq.${user.id},member_id.eq.${user.id}`)
    .eq('status', 'active');
  if (error) throw error;
  return data || [];
}
