import { ensureSupabaseProfile, isSupabaseConfigured, supabase } from './supabase';

const MEMORY_BUCKET = 'memory-photos';
const STORAGE_PREFIX = `storage://${MEMORY_BUCKET}/`;

async function resolvePhotoUrl(photoUrl) {
  if (!photoUrl || !photoUrl.startsWith(STORAGE_PREFIX) || !supabase) return photoUrl;
  const path = photoUrl.slice(STORAGE_PREFIX.length);
  const { data, error } = await supabase.storage.from(MEMORY_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

async function publicMemory(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    photo_url: await resolvePhotoUrl(row.photo_url),
    person: row.person,
    place: row.place,
    memory_date: row.memory_date,
    lang: row.language,
    album: row.album,
  };
}

function extensionFor(file) {
  const fromName = String(file?.name || '').split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,6}$/.test(fromName)) return fromName;
  const byType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic' };
  return byType[file?.type] || 'jpg';
}

async function uploadPhoto(user, file) {
  if (!file) return null;
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose a photo smaller than 5 MB.');
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${user.id}/${id}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(MEMORY_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return `${STORAGE_PREFIX}${path}`;
}

async function currentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user || null;
}

/** Returns null when no Supabase session exists, so legacy/offline fallback can take over. */
export async function loadSupabaseMemories() {
  const user = await currentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('memories')
    .select('id, title, body, photo_url, person, place, memory_date, language, album')
    .order('memory_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data || []).map(publicMemory));
}

/** Saves a Memory Book item under the authenticated patient's Supabase profile. */
export async function createSupabaseMemory(memory, imageFile = null) {
  const user = await currentUser();
  if (!user) return null;
  await ensureSupabaseProfile(user);
  const photoUrl = (await uploadPhoto(user, imageFile)) || memory.photo_url || null;
  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: user.id,
      title: memory.title,
      body: memory.body,
      photo_url: photoUrl,
      person: memory.person || null,
      place: memory.place || null,
      memory_date: memory.memory_date || null,
      language: memory.lang || 'en',
      album: memory.album || 'Special Moments',
    })
    .select('id, title, body, photo_url, person, place, memory_date, language, album')
    .single();
  if (error) throw error;
  return publicMemory(data);
}
