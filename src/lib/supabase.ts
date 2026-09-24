import { createClient } from '@supabase/supabase-js';

const url = (
  import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
)?.trim();
const publishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();

/**
 * The publishable key identifies this public browser client. Authorization is
 * enforced by Supabase Auth and Row Level Security, never by a secret key here.
 */
export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : null;

function profilePayload(user) {
  const meta = user?.user_metadata || {};
  return {
    id: user.id,
    display_name: String(meta.display_name || meta.name || user.email?.split('@')[0] || ''),
    phone: String(meta.phone || '').trim() || null,
    birth_date: String(meta.birth_date || '').trim() || null,
  };
}

/** Ensure the authenticated user has the public profile required by app data. */
export async function ensureSupabaseProfile(user) {
  if (!supabase || !user?.id) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profilePayload(user), { onConflict: 'id' })
    .select('id, display_name, phone, birth_date, role')
    .single();
  if (error) throw error;
  return data;
}
