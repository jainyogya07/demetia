# Supabase SQL (Smriti Saarthi / Caresahaay)

Run these in the **Supabase Dashboard → SQL Editor** as the project owner, **in this order**.

The browser only has a publishable key, so DDL cannot be applied from the app. Management API / `npx supabase db push` needs a linked project and a service-role key.

Do **not** run `schema.sql` after these numbered files (it is a legacy combined dump and can conflict on policy names). Prefer the numbered files.

| Order | File | What it does |
| --- | --- | --- |
| 1 | `001_profiles_auth.sql` | Profiles, roles, `auth.users` → profile trigger |
| 2 | `002_routines_alarms.sql` | Daily routine items + alarm events |
| 3 | `003_memories.sql` | Memory Book + private `memory-photos` bucket |
| 4 | `004_care_circle.sql` | Care relationships, invites, circle members, family pings |
| 5 | `005_notifications.sql` | Care notifications + read receipts |
| 6 | `006_spatial_safe_journey.sql` | Safe zones, familiar places, trails, Assam/Delhi demo cities |
| 7 | `007_games_scores.sql` | Quiz, Shape Draw, Memory Journey scores |
| 8 | `008_caregiver_doctor.sql` | ADL assessments, doctor notes, Train-AI facts |
| 9 | `009_rls_policies.sql` | RLS on, dementia-care roles |
| 10 | `010_indexes_realtime.sql` | Indexes + optional Realtime publication |

All files use `IF NOT EXISTS` / `DROP POLICY IF EXISTS`. They do **not** drop user tables or data.

Legacy Palak files `002_memory_storage.sql` and `003_care_invitations.sql` are superseded by `003_memories.sql` and `004_care_circle.sql`. Skip them if you ran the numbered set.
