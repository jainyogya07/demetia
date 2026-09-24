-- 008_caregiver_doctor.sql
-- ADL / FAQ check-ins, clinic notes, Train-AI facts for the companion.

create table if not exists public.adl_assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  recorded_by uuid references public.profiles(id) on delete set null,
  total_score integer not null check (total_score >= 0),
  answers jsonb not null default '{}'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now()
);

comment on table public.adl_assessments is 'Caregiver functional check-in. answers holds FAQ-I style keys.';

create table if not exists public.severity_snapshots (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  calibrated_score numeric not null,
  severity_band text not null,
  source text not null default 'node-bff',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.severity_snapshots is 'Output of /api/v1/telemetry/evaluate for the doctor timeline.';

create table if not exists public.doctor_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  rel text not null default 'Doctor',
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

comment on table public.doctor_notes is 'Clinic note; BFF also fans out a care_notifications row.';

create table if not exists public.train_ai_facts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  category text not null default 'about',
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

comment on table public.train_ai_facts is 'Caregiver-taught facts (people, places, likes) for the companion.';

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

comment on table public.documents is 'Metadata only. Binary objects stay in Storage or on-device.';
