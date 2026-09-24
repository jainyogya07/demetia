-- 006_spatial_safe_journey.sql
-- Safe Journey: geofences, familiar places, GPS trails, Assam + Delhi demo homes.
-- Demo rows are shared (patient_id null) so the PWA walk works before Auth.

create table if not exists public.spatial_demo_cities (
  id text primary key check (id in ('assam', 'delhi')),
  label text not null,
  home_lat double precision not null,
  home_lng double precision not null,
  home_radius_m integer not null default 280,
  updated_at timestamptz not null default now()
);

comment on table public.spatial_demo_cities is 'Guwahati garden home and Delhi home used by Safe Journey demo walk.';

insert into public.spatial_demo_cities (id, label, home_lat, home_lng, home_radius_m)
values
  ('assam', 'Guwahati · Assam', 26.16952, 91.76785, 280),
  ('delhi', 'Delhi', 28.6139, 77.209, 300)
on conflict (id) do update set
  label = excluded.label,
  home_lat = excluded.home_lat,
  home_lng = excluded.home_lng,
  home_radius_m = excluded.home_radius_m,
  updated_at = now();

create table if not exists public.safe_zones (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  client_key text,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  radius_m integer not null default 200 check (radius_m between 20 and 5000),
  city text not null default 'assam' check (city in ('assam', 'delhi')),
  kind text not null default 'home' check (kind in ('home', 'garden', 'clinic', 'relative', 'custom')),
  created_at timestamptz not null default now()
);

comment on table public.safe_zones is 'Circular geofence. Wandering analysis uses home radius_m.';

create unique index if not exists safe_zones_patient_client
  on public.safe_zones (patient_id, client_key)
  where client_key is not null;

create table if not exists public.familiar_places (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  client_key text,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  radius_m integer not null default 80 check (radius_m between 10 and 2000),
  city text not null default 'assam' check (city in ('assam', 'delhi')),
  created_at timestamptz not null default now()
);

comment on table public.familiar_places is 'Landmarks for Memory Journey / Safe Journey route hints.';

create unique index if not exists familiar_places_patient_client
  on public.familiar_places (patient_id, client_key)
  where client_key is not null;

create table if not exists public.spatial_trails (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  city text not null default 'assam',
  original_points integer not null default 0,
  simplified jsonb not null default '[]'::jsonb,
  analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.spatial_trails is 'Douglas–Peucker simplified paths from the Node BFF.';

create table if not exists public.location_heartbeats (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  lat double precision,
  lng double precision,
  accuracy_m double precision,
  city text,
  inside_safe_zone boolean,
  created_at timestamptz not null default now()
);

comment on table public.location_heartbeats is 'Lightweight I’m-here ping. Not a continuous GPS log.';

-- Seed demo home zones (no patient) for first-run Safe Journey.
insert into public.safe_zones (id, patient_id, client_key, name, lat, lng, radius_m, city, kind)
values
  ('00000000-0000-4000-a000-000000000001', null, 'zone-home-assam', 'Home garden', 26.16952, 91.76785, 280, 'assam', 'garden'),
  ('00000000-0000-4000-a000-000000000002', null, 'zone-home-delhi', 'Home', 28.6139, 77.209, 300, 'delhi', 'home')
on conflict (id) do nothing;

insert into public.familiar_places (id, patient_id, client_key, name, lat, lng, radius_m, city)
values
  ('00000000-0000-4000-a000-000000000011', null, 'place_home', 'Home garden', 26.16952, 91.76785, 280, 'assam')
on conflict (id) do nothing;
