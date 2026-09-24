-- 005_notifications.sql
-- In-app care alerts (alarms, doctor notes, SOS). Complements localStorage on the PWA.

create table if not exists public.care_notifications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  audience text not null default 'patient'
    check (audience in ('patient', 'caregiver', 'doctor', 'circle')),
  type text not null default 'alarm'
    check (type in ('alarm', 'alarm_upcoming', 'doctor', 'sos', 'check-in', 'quiz', 'system')),
  title text not null check (char_length(title) between 1 and 160),
  message text not null default '',
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.care_notifications is 'Server-side inbox. The PWA always keeps a local fallback list.';
comment on column public.care_notifications.audience is 'Who should see the row in role-specific inboxes.';

create table if not exists public.notification_reads (
  notification_id uuid not null references public.care_notifications(id) on delete cascade,
  reader_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, reader_id)
);
