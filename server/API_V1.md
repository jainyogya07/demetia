# Smriti Saarthi BFF (`/api/v1`)

Same process as Postgres auth: Vite `inlineApi` in dev, `server/api.mjs` locally (`npm start`), Vercel `api/[[...path]].js` in production. Optional later: Render Web Service (`RENDER.md`) with `VITE_API_ORIGIN`.

**Not required to boot the PWA:** Redis, Kafka, Qdrant, Kong, Rust, Go, Python, WearOS. Demo walk (Assam · Delhi) runs fully in the browser.

**Optional overlay:** browser `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY` for Memory Book / routine when signed into Supabase. Auth stays Node + Postgres (`server/auth.mjs`).

If a call fails, the app keeps using `localStorage` / demo data. The browser client (`src/lib/apiClient.ts`) uses a **4s AbortController** and never throws into React.

Home dashboard uses **one** `GET /api/v1/patient/dashboard/summary` (routine snippet, safety, quiz, heartbeat, severity). Notifications uses **one** `GET /api/v1/inbox/summary`.

| Method | Path | Used by |
| --- | --- | --- |
| GET | `/api/v1/health` | health |
| GET | `/api/v1/health/detailed` | ops snapshot (heartbeat, quiz, counts) |
| GET | `/api/v1/patient/dashboard/summary` | Home dashboard (one shot) |
| GET | `/api/v1/inbox/summary` | Notifications + upcoming alarms |
| POST | `/api/v1/safety/sos` | Safety SOS ping |
| POST | `/api/v1/safety/check-in` | I’m-safe heartbeat |
| GET | `/api/v1/safety/heartbeat` | Last check-in |
| GET | `/api/v1/routine/today` | Daily routine |
| PATCH | `/api/v1/routine/today` | Routine bulk complete |
| PATCH | `/api/v1/routine/tasks/:taskId/toggle` | Task checkbox |
| GET | `/api/v1/notifications` | Notification list |
| POST | `/api/v1/notifications` | Push a care note |
| PATCH | `/api/v1/notifications/:id/read` | Mark read |
| GET | `/api/v1/notifications/alarms` | Upcoming routine alarms |
| GET/POST | `/api/v1/memories` | Memory Book (Postgres; client tries Supabase first) |
| GET | `/api/v1/memories/search?q=` | Memory search |
| GET/POST | `/api/v1/caregiver/overview` | Caregiver Today |
| GET/POST | `/api/v1/caregiver/train-ai` | Train AI facts |
| GET | `/api/v1/caregiver/assessments` | Recent ADL rows |
| POST | `/api/v1/caregiver/assessment` | Check-in submit |
| GET | `/api/v1/doctor/roster` | Clinic patient list |
| GET | `/api/v1/doctor/patients/:id/profile` | Clinical stub |
| POST | `/api/v1/doctor/notes` | Note → care circle |
| GET | `/api/v1/games/catalogue` | Games list |
| POST | `/api/v1/games/session/complete` | Memory Quiz + Shape Draw scores |
| GET | `/api/v1/games/scores` | Recent scores |
| GET | `/api/v1/games/quiz/latest` | Latest Memory Quiz |
| POST | `/api/v1/spatial/compute-trajectory` | Douglas–Peucker in Node |
| GET | `/api/v1/spatial/wandering-analysis` | Safe Journey metrics |
| GET/POST | `/api/v1/spatial/safe-zones` | Garden / geofence |
| GET/POST | `/api/v1/spatial/trails` | Simplified paths |
| GET/POST | `/api/v1/places/familiar` | Familiar places |
| POST | `/api/v1/places/familiar/bulk` | Replace/merge landmarks |
| GET/POST | `/api/v1/places/demo-city` | `assam` \| `delhi` |
| GET/POST | `/api/v1/care-circle` | Care circle |
| PATCH/DELETE | `/api/v1/care-circle/:id` | Care circle member |
| POST | `/api/v1/care-circle/ping` | Family nudge |
| POST | `/api/v1/care-circle/ping/:id/ack` | Ack a ping |
| GET | `/api/v1/documents` | Document metadata |
| POST | `/api/v1/telemetry/evaluate` | Severity stub |
| GET | `/api/v1/telemetry/severity` | Last severity snapshot |

Existing (unchanged): `GET/POST /api/memories`, `/api/health`, `/api/home-chat`, `/api/auth/*`.

Tests: `npm test` (`node --test server/v1.test.mjs`).
