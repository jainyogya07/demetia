-- 010_indexes_realtime.sql
-- Query helpers + optional Supabase Realtime. Safe to re-run. No DROP TABLE.

create index if not exists memories_user_date_idx
  on public.memories (user_id, memory_date desc nulls last);
create index if not exists memories_search_tsv_idx
  on public.memories using gin (search_tsv);
create index if not exists memories_title_trgm_idx
  on public.memories using gin (title gin_trgm_ops);

create index if not exists routine_items_patient_idx
  on public.routine_items (patient_id, active);
create index if not exists alarm_events_patient_time_idx
  on public.alarm_events (patient_id, occurred_at desc);
create index if not exists routine_completions_day_idx
  on public.routine_completions (patient_id, completed_on desc);

create index if not exists assessments_patient_time_idx
  on public.adl_assessments (patient_id, created_at desc);
create index if not exists severity_patient_time_idx
  on public.severity_snapshots (patient_id, created_at desc);
create index if not exists doctor_notes_patient_time_idx
  on public.doctor_notes (patient_id, created_at desc);
create index if not exists train_ai_patient_idx
  on public.train_ai_facts (patient_id, created_at desc);
create index if not exists care_messages_patient_time_idx
  on public.care_messages (patient_id, created_at desc);

create index if not exists care_invites_patient_idx
  on public.care_invites (patient_id, status);
create index if not exists care_invites_email_idx
  on public.care_invites (lower(email), status);
create index if not exists family_pings_patient_time_idx
  on public.family_pings (patient_id, created_at desc);
create index if not exists care_notifications_patient_time_idx
  on public.care_notifications (patient_id, created_at desc)
  where read_at is null;

create index if not exists safe_zones_city_idx
  on public.safe_zones (city);
create index if not exists familiar_places_city_idx
  on public.familiar_places (city);
create index if not exists spatial_trails_patient_time_idx
  on public.spatial_trails (patient_id, created_at desc);
create index if not exists heartbeats_patient_time_idx
  on public.location_heartbeats (patient_id, created_at desc);

create index if not exists game_sessions_patient_game_idx
  on public.game_sessions (patient_id, game_id, completed_at desc);

-- Realtime: only if the project already has supabase_realtime.
do $$
declare
  tbl text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;
  foreach tbl in array array[
    'care_notifications',
    'family_pings',
    'location_heartbeats',
    'alarm_events'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    exception
      when duplicate_object then null;
      when undefined_table then null;
    end;
  end loop;
end $$;
