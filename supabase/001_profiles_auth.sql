-- 001_profiles_auth.sql
-- Patient / caregiver / doctor / admin profiles bound to Supabase Auth.
-- Safe to re-run. Does not drop tables or existing rows.

comment on schema public is 'Smriti Saarthi care data. Authorization is RLS + Auth, never a secret in the browser.';

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  birth_date date,
  role text not null default 'patient'
    check (role in ('patient', 'caregiver', 'doctor', 'admin')),
  preferred_lang text not null default 'en',
  home_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per Auth user. role drives caregiver/doctor UI and RLS helpers.';
comment on column public.profiles.role is 'App role: patient | caregiver | doctor | admin.';
comment on column public.profiles.preferred_lang is 'UI language hint (en, hi, as, …).';

alter table public.profiles add column if not exists preferred_lang text not null default 'en';
alter table public.profiles add column if not exists home_label text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

-- Keep a profile row for every new Auth user (Memory Book / routine FKs).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  incoming_role text;
begin
  incoming_role := lower(coalesce(new.raw_user_meta_data->>'role', 'patient'));
  if incoming_role not in ('patient', 'caregiver', 'doctor', 'admin') then
    incoming_role := 'patient';
  end if;

  insert into public.profiles (id, display_name, phone, birth_date, role, preferred_lang)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, ''), '@', 1),
      ''
    ),
    nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'birth_date', '')), '')::date,
    incoming_role,
    coalesce(new.raw_user_meta_data->>'preferred_lang', 'en')
  )
  on conflict (id) do update set
    display_name = excluded.display_name
    where public.profiles.display_name = '';
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Stub so can_access_patient can compile before 004 expands constraints.
create table if not exists public.care_relationships (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  relationship_role text not null default 'caregiver',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create or replace function public.can_access_patient(target_patient uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = target_patient
    or exists (
      select 1
      from public.care_relationships r
      where r.patient_id = target_patient
        and r.member_id = auth.uid()
        and r.status = 'active'
    );
$$;

comment on function public.can_access_patient(uuid) is
  'True when the caller is the patient or an active caregiver/doctor on that patient.';
