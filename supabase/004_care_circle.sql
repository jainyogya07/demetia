-- 004_care_circle.sql
-- Family / ASHA / doctor links, invitations, and family pings.
-- Depends on: 001_profiles_auth.sql

alter table public.care_relationships
  add column if not exists relationship_role text;
alter table public.care_relationships
  add column if not exists status text;
alter table public.care_relationships
  add column if not exists created_at timestamptz not null default now();
alter table public.care_relationships
  add column if not exists notes text not null default '';

-- Tighten checks without dropping rows. Invalid rows stay until cleaned.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'care_relationships_role_check'
      and conrelid = 'public.care_relationships'::regclass
  ) then
    alter table public.care_relationships
      add constraint care_relationships_role_check
      check (relationship_role in ('caregiver', 'doctor', 'family', 'asha'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'care_relationships_status_check'
      and conrelid = 'public.care_relationships'::regclass
  ) then
    alter table public.care_relationships
      add constraint care_relationships_status_check
      check (status in ('pending', 'active', 'revoked'));
  end if;
exception
  when others then
    raise notice 'care_relationships checks skipped: %', sqlerrm;
end $$;

create unique index if not exists care_relationships_unique_triple
  on public.care_relationships (patient_id, member_id, relationship_role);

comment on table public.care_relationships is 'Who may see a patient’s clinical and home data.';

create table if not exists public.care_invites (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  relationship_role text not null check (relationship_role in ('caregiver', 'doctor', 'family', 'asha')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  accepted_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

comment on table public.care_invites is 'Email invite from a patient to a caregiver/doctor. Accepting writes care_relationships.';

create table if not exists public.care_circle_members (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  relation text not null default '',
  role_label text not null default '',
  phone text,
  member_profile_id uuid references public.profiles(id) on delete set null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.care_circle_members is 'On-device care circle cards (name/phone) even before Auth invite is accepted.';

create table if not exists public.family_pings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  from_member_id text,
  to_member_id text,
  kind text not null default 'check-in' check (kind in ('check-in', 'sos', 'nudge', 'ack')),
  place text,
  lat double precision,
  lng double precision,
  acked_at timestamptz,
  acked_by text,
  created_at timestamptz not null default now()
);

comment on table public.family_pings is 'SOS / I’m safe / family nudge. Ack is a second event or acked_at.';

create or replace function public.can_view_profile(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = target_profile
    or exists (
      select 1 from public.care_relationships r
      where r.status = 'active'
        and (
          (r.patient_id = auth.uid() and r.member_id = target_profile)
          or (r.member_id = auth.uid() and r.patient_id = target_profile)
        )
    );
$$;

create or replace function public.accept_care_invite()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted'
    and old.status = 'pending'
    and new.accepted_by is not null
    and new.expires_at > now() then
    insert into public.care_relationships (patient_id, member_id, relationship_role, status)
    values (new.patient_id, new.accepted_by, new.relationship_role, 'active')
    on conflict (patient_id, member_id, relationship_role)
    do update set status = 'active';
  end if;
  return new;
end;
$$;

drop trigger if exists care_invites_accept_trigger on public.care_invites;
create trigger care_invites_accept_trigger
after update on public.care_invites
for each row execute function public.accept_care_invite();
