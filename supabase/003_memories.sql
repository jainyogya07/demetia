-- 003_memories.sql
-- Memory Book rows + private photo bucket (Palak overlay, no public objects).
-- Depends on: 001_profiles_auth.sql

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '',
  photo_url text,
  person text,
  place text,
  memory_date date,
  language text not null default 'en',
  album text not null default 'Special Moments',
  search_tsv tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.memories is 'Patient Memory Book. Photos live in storage bucket memory-photos, not a public URL.';
comment on column public.memories.photo_url is 'https URL or storage://memory-photos/<user_id>/<file>';
comment on column public.memories.language is 'Story language code (en, hi, as, …).';

alter table public.memories add column if not exists search_tsv tsvector;
alter table public.memories add column if not exists updated_at timestamptz not null default now();

create or replace function public.memories_search_tsv()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.person, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.place, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.body, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.album, '')), 'D');
  return new;
end;
$$;

drop trigger if exists memories_search_tsv on public.memories;
create trigger memories_search_tsv
before insert or update of title, body, person, place, album on public.memories
for each row execute function public.memories_search_tsv();

drop trigger if exists memories_touch_updated_at on public.memories;
create trigger memories_touch_updated_at
before update on public.memories
for each row execute function public.touch_updated_at();

-- Private bucket: owner folder = auth.uid(). Never public-by-default.
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
