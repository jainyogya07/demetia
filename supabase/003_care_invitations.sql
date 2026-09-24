-- Secure patient-to-caregiver/doctor invitations. Run after schema.sql.

create table if not exists public.care_invites (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  relationship_role text not null check (relationship_role in ('caregiver', 'doctor')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  accepted_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now(),
  unique (patient_id, email, relationship_role, status)
);

create index if not exists care_invites_patient_idx on public.care_invites(patient_id, status);
create index if not exists care_invites_email_idx on public.care_invites(lower(email), status);

create or replace function public.can_view_profile(target_profile uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() = target_profile
    or exists (
      select 1 from public.care_relationships r
      where r.status = 'active'
        and ((r.patient_id = auth.uid() and r.member_id = target_profile)
          or (r.member_id = auth.uid() and r.patient_id = target_profile))
    );
$$;

drop policy if exists "profiles: read own or care team" on public.profiles;
create policy "profiles: read own or care team" on public.profiles for select
using (public.can_view_profile(id));

create or replace function public.accept_care_invite()
returns trigger language plpgsql security definer set search_path = public as $$
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

alter table public.care_invites enable row level security;

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
