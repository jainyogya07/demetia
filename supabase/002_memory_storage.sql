-- Private Memory Book photo storage. Run after schema.sql in Supabase SQL Editor.
-- Files are kept in the owner's folder and are never made public by default.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memory-photos',
  'memory-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "memory photos: owner reads" on storage.objects;
create policy "memory photos: owner reads" on storage.objects for select
to authenticated
using (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "memory photos: owner uploads" on storage.objects;
create policy "memory photos: owner uploads" on storage.objects for insert
to authenticated
with check (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "memory photos: owner updates" on storage.objects;
create policy "memory photos: owner updates" on storage.objects for update
to authenticated
using (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "memory photos: owner deletes" on storage.objects;
create policy "memory photos: owner deletes" on storage.objects for delete
to authenticated
using (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
