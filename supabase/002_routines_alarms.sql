-- 002_routines_alarms.sql
-- Daily medicine / meal / walk schedule and alarm outcomes.
-- Depends on: 001_profiles_auth.sql (profiles). care_relationships may still be missing;
-- can_access_patient is created in 001 and completed after 004.

create table if not exists public.routine_items (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  client_key text,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  category text not null default 'routine'
    check (category in ('medicine', 'meal', 'activity', 'appointment', 'routine', 'water', 'brain', 'walk')),
  local_time time not null,
  timezone text not null default 'Asia/Kolkata',
  days_of_week smallint[] not null default '{0,1,2,3,4,5,6}',
  active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (patient_id, client_key)
);

comment on table public.routine_items is 'Repeating day plan (local time). Client may keep a local copy if API is offline.';
comment on column public.routine_items.client_key is 'Stable id from the PWA (med-am, walk, …) for upserts.';
comment on column public.routine_items.days_of_week is '0=Sunday … 6=Saturday, Asia/Kolkata local.';

alter table public.routine_items add column if not exists client_key text;
alter table public.routine_items add column if not exists sort_order smallint not null default 0;
alter table public.routine_items add column if not exists updated_at timestamptz not null default now();

create table if not exists public.alarm_events (
  id uuid primary key default gen_random_uuid(),
  routine_item_id uuid references public.routine_items(id) on delete set null,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('fired', 'done', 'snoozed', 'dismissed', 'missed', 'heartbeat')),
  occurred_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb
);

comment on table public.alarm_events is 'What happened when a routine alarm fired. Heartbeat rows are optional check-ins.';

drop trigger if exists routine_items_touch_updated_at on public.routine_items;
create trigger routine_items_touch_updated_at
before update on public.routine_items
for each row execute function public.touch_updated_at();

create table if not exists public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  routine_item_id uuid references public.routine_items(id) on delete cascade,
  client_key text,
  completed_on date not null default (timezone('Asia/Kolkata', now()))::date,
  completed_at timestamptz not null default now(),
  unique (patient_id, completed_on, client_key)
);

comment on table public.routine_completions is 'Per-day checkbox state for Today’s list.';
