-- Smriti Saarthi / Caresahaay core Supabase schema.
-- Run this in Supabase Dashboard → SQL Editor as the project owner.
-- This file intentionally uses no service_role key in the app.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  birth_date date,
  role text not null default 'patient' check (role in ('patient', 'caregiver', 'doctor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.care_relationships (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  relationship_role text not null check (relationship_role in ('caregiver', 'doctor')),
  status text not null default 'active' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (patient_id, member_id, relationship_role)
);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routine_items (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null default '',
  category text not null default 'routine' check (category in ('medicine', 'meal', 'activity', 'appointment', 'routine')),
  local_time time not null,
  timezone text not null default 'Asia/Kolkata',
  days_of_week smallint[] not null default '{0,1,2,3,4,5,6}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alarm_events (
  id uuid primary key default gen_random_uuid(),
  routine_item_id uuid not null references public.routine_items(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('fired', 'done', 'snoozed', 'dismissed', 'missed')),
  occurred_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb
);

create table if not exists public.adl_assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  recorded_by uuid references public.profiles(id) on delete set null,
  total_score integer not null check (total_score >= 0),
  answers jsonb not null default '{}'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.care_messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  storage_path text not null,
  document_type text not null default 'other',
  created_at timestamptz not null default now()
);

create index if not exists memories_user_date_idx on public.memories(user_id, memory_date desc);
create index if not exists routine_items_patient_idx on public.routine_items(patient_id, active);
create index if not exists alarm_events_patient_time_idx on public.alarm_events(patient_id, occurred_at desc);
create index if not exists assessments_patient_time_idx on public.adl_assessments(patient_id, created_at desc);
create index if not exists care_messages_patient_time_idx on public.care_messages(patient_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();
drop trigger if exists memories_touch_updated_at on public.memories;
create trigger memories_touch_updated_at before update on public.memories
for each row execute function public.touch_updated_at();
drop trigger if exists routine_items_touch_updated_at on public.routine_items;
create trigger routine_items_touch_updated_at before update on public.routine_items
for each row execute function public.touch_updated_at();

create or replace function public.can_access_patient(target_patient uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() = target_patient
    or exists (
      select 1 from public.care_relationships r
      where r.patient_id = target_patient
        and r.member_id = auth.uid()
        and r.status = 'active'
    );
$$;

alter table public.profiles enable row level security;
alter table public.care_relationships enable row level security;
alter table public.memories enable row level security;
alter table public.routine_items enable row level security;
alter table public.alarm_events enable row level security;
alter table public.adl_assessments enable row level security;
alter table public.care_messages enable row level security;
alter table public.documents enable row level security;

create policy "profiles: read own or care team" on public.profiles for select
using (auth.uid() = id or public.can_access_patient(id));
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);

create policy "relationships: read participants" on public.care_relationships for select
using (auth.uid() = patient_id or auth.uid() = member_id);
create policy "relationships: patient manages" on public.care_relationships for all
using (auth.uid() = patient_id) with check (auth.uid() = patient_id);

create policy "memories: care team read" on public.memories for select using (public.can_access_patient(user_id));
create policy "memories: patient creates" on public.memories for insert with check (auth.uid() = user_id);
create policy "memories: patient updates" on public.memories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "memories: patient deletes" on public.memories for delete using (auth.uid() = user_id);

create policy "routine: care team read" on public.routine_items for select using (public.can_access_patient(patient_id));
create policy "routine: care team write" on public.routine_items for all
using (public.can_access_patient(patient_id)) with check (public.can_access_patient(patient_id));
create policy "alarms: care team read" on public.alarm_events for select using (public.can_access_patient(patient_id));
create policy "alarms: care team write" on public.alarm_events for insert with check (public.can_access_patient(patient_id));
create policy "adl: care team read" on public.adl_assessments for select using (public.can_access_patient(patient_id));
create policy "adl: care team write" on public.adl_assessments for insert with check (public.can_access_patient(patient_id));
create policy "messages: care team read" on public.care_messages for select using (public.can_access_patient(patient_id));
create policy "messages: care team write" on public.care_messages for insert with check (auth.uid() = sender_id and public.can_access_patient(patient_id));
create policy "documents: care team read" on public.documents for select using (public.can_access_patient(patient_id));
create policy "documents: care team write" on public.documents for insert with check (auth.uid() = uploaded_by and public.can_access_patient(patient_id));
