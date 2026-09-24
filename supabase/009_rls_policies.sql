-- 009_rls_policies.sql
-- Row Level Security for dementia-care roles. Re-runnable. Does not drop data.
-- Depends on: 001–008 (tables exist).

alter table public.profiles enable row level security;
alter table public.care_relationships enable row level security;
alter table public.memories enable row level security;
alter table public.routine_items enable row level security;
alter table public.alarm_events enable row level security;
alter table public.routine_completions enable row level security;
alter table public.care_invites enable row level security;
alter table public.care_circle_members enable row level security;
alter table public.family_pings enable row level security;
alter table public.care_notifications enable row level security;
alter table public.notification_reads enable row level security;
alter table public.safe_zones enable row level security;
alter table public.familiar_places enable row level security;
alter table public.spatial_trails enable row level security;
alter table public.location_heartbeats enable row level security;
alter table public.spatial_demo_cities enable row level security;
alter table public.game_sessions enable row level security;
alter table public.quiz_latest enable row level security;
alter table public.adl_assessments enable row level security;
alter table public.severity_snapshots enable row level security;
alter table public.doctor_notes enable row level security;
alter table public.train_ai_facts enable row level security;
alter table public.care_messages enable row level security;
alter table public.documents enable row level security;

create or replace function public.can_access_patient(target_patient uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = target_patient
    or exists (
      select 1 from public.care_relationships r
      where r.patient_id = target_patient
        and r.member_id = auth.uid()
        and r.status = 'active'
    );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- profiles
drop policy if exists "profiles: read own or care team" on public.profiles;
create policy "profiles: read own or care team" on public.profiles for select
using (public.can_view_profile(id) or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles for update
using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles for insert
with check (auth.uid() = id);

-- relationships
drop policy if exists "relationships: read participants" on public.care_relationships;
create policy "relationships: read participants" on public.care_relationships for select
using (auth.uid() = patient_id or auth.uid() = member_id or public.is_admin());

drop policy if exists "relationships: patient manages" on public.care_relationships;
create policy "relationships: patient manages" on public.care_relationships for all
using (auth.uid() = patient_id or public.is_admin())
with check (auth.uid() = patient_id or public.is_admin());

-- memories
drop policy if exists "memories: care team read" on public.memories;
create policy "memories: care team read" on public.memories for select
using (public.can_access_patient(user_id));

drop policy if exists "memories: patient creates" on public.memories;
create policy "memories: patient creates" on public.memories for insert
with check (auth.uid() = user_id);

drop policy if exists "memories: patient updates" on public.memories;
create policy "memories: patient updates" on public.memories for update
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "memories: patient deletes" on public.memories;
create policy "memories: patient deletes" on public.memories for delete
using (auth.uid() = user_id);

-- routine / alarms
drop policy if exists "routine: care team read" on public.routine_items;
drop policy if exists "routine: care team write" on public.routine_items;
create policy "routine: care team read" on public.routine_items for select
using (public.can_access_patient(patient_id));
create policy "routine: care team write" on public.routine_items for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

drop policy if exists "alarms: care team read" on public.alarm_events;
drop policy if exists "alarms: care team write" on public.alarm_events;
create policy "alarms: care team read" on public.alarm_events for select
using (public.can_access_patient(patient_id));
create policy "alarms: care team write" on public.alarm_events for insert
with check (public.can_access_patient(patient_id));

drop policy if exists "completions: care team" on public.routine_completions;
create policy "completions: care team" on public.routine_completions for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

-- invites
drop policy if exists "care invites: patient manages" on public.care_invites;
create policy "care invites: patient manages" on public.care_invites for all
to authenticated
using (auth.uid() = patient_id)
with check (auth.uid() = patient_id);

drop policy if exists "care invites: recipient reads" on public.care_invites;
create policy "care invites: recipient reads" on public.care_invites for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "care invites: recipient accepts" on public.care_invites;
create policy "care invites: recipient accepts" on public.care_invites for update
to authenticated
using (
  status = 'pending'
  and expires_at > now()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  status = 'accepted'
  and accepted_by = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- circle + pings
drop policy if exists "circle members: care team" on public.care_circle_members;
create policy "circle members: care team" on public.care_circle_members for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

drop policy if exists "family pings: care team" on public.family_pings;
create policy "family pings: care team" on public.family_pings for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

-- notifications
drop policy if exists "notifications: care team" on public.care_notifications;
create policy "notifications: care team" on public.care_notifications for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "notification reads: own" on public.notification_reads;
create policy "notification reads: own" on public.notification_reads for all
using (auth.uid() = reader_id)
with check (auth.uid() = reader_id);

-- spatial (demo rows with null patient_id are readable by anyone authenticated; anon demo uses BFF)
drop policy if exists "safe zones: care or demo" on public.safe_zones;
create policy "safe zones: care or demo" on public.safe_zones for select
using (patient_id is null or public.can_access_patient(patient_id));
drop policy if exists "safe zones: care write" on public.safe_zones;
create policy "safe zones: care write" on public.safe_zones for insert
with check (patient_id is null or public.can_access_patient(patient_id));
drop policy if exists "safe zones: care update" on public.safe_zones;
create policy "safe zones: care update" on public.safe_zones for update
using (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "familiar: care or demo" on public.familiar_places;
create policy "familiar: care or demo" on public.familiar_places for select
using (patient_id is null or public.can_access_patient(patient_id));
drop policy if exists "familiar: care write" on public.familiar_places;
create policy "familiar: care write" on public.familiar_places for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "trails: care team" on public.spatial_trails;
create policy "trails: care team" on public.spatial_trails for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "heartbeats: care team" on public.location_heartbeats;
create policy "heartbeats: care team" on public.location_heartbeats for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "demo cities: read" on public.spatial_demo_cities;
create policy "demo cities: read" on public.spatial_demo_cities for select
using (true);

-- games
drop policy if exists "games: care team" on public.game_sessions;
create policy "games: care team" on public.game_sessions for all
using (patient_id is null or public.can_access_patient(patient_id))
with check (patient_id is null or public.can_access_patient(patient_id));

drop policy if exists "quiz latest: care team" on public.quiz_latest;
create policy "quiz latest: care team" on public.quiz_latest for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

-- clinical
drop policy if exists "adl: care team read" on public.adl_assessments;
drop policy if exists "adl: care team write" on public.adl_assessments;
create policy "adl: care team read" on public.adl_assessments for select
using (public.can_access_patient(patient_id));
create policy "adl: care team write" on public.adl_assessments for insert
with check (public.can_access_patient(patient_id));

drop policy if exists "severity: care team" on public.severity_snapshots;
create policy "severity: care team" on public.severity_snapshots for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

drop policy if exists "doctor notes: care team" on public.doctor_notes;
create policy "doctor notes: care team" on public.doctor_notes for select
using (public.can_access_patient(patient_id));
drop policy if exists "doctor notes: write" on public.doctor_notes;
create policy "doctor notes: write" on public.doctor_notes for insert
with check (public.can_access_patient(patient_id));

drop policy if exists "train ai: care team" on public.train_ai_facts;
create policy "train ai: care team" on public.train_ai_facts for all
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

drop policy if exists "messages: care team read" on public.care_messages;
drop policy if exists "messages: care team write" on public.care_messages;
create policy "messages: care team read" on public.care_messages for select
using (public.can_access_patient(patient_id));
create policy "messages: care team write" on public.care_messages for insert
with check (auth.uid() = sender_id and public.can_access_patient(patient_id));

drop policy if exists "documents: care team read" on public.documents;
drop policy if exists "documents: care team write" on public.documents;
create policy "documents: care team read" on public.documents for select
using (public.can_access_patient(patient_id));
create policy "documents: care team write" on public.documents for insert
with check (auth.uid() = uploaded_by and public.can_access_patient(patient_id));
