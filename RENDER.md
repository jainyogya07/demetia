# Render (optional scale-out)

Vercel already serves the Vite static app **and** the Node BFF via `api/[[...path]].js`. Render is **not required** for the first production deploy.

Do not assume a Render hostname exists until you create a service. This file does not invent a URL.

## What to deploy (if you want a dedicated API)

Create a **Web Service** from the same GitHub repo.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Node version | 20 (or 22) |
| Root directory | repo root (leave empty) |
| Build command | `npm ci` (or skip if you only run the API) |
| Start command | `npm start` → `node server/api.mjs` |
| Health check | `GET /api/v1/health` |

`server/api.mjs` binds `0.0.0.0` when Render sets `PORT`.

You do **not** need Redis, Kafka, Qdrant, Rust, Go, or Python for Memory Quiz, Safe Journey (Assam + Delhi), alarms, or the Memory Book local fallback.

## Environment variables

Set these in the Render dashboard (not in git):

| Name | Required | Notes |
| --- | --- | --- |
| `PORT` | Set by Render | Do not hardcode |
| `DATABASE_URL` | If you want Postgres auth / Memory Book persistence | Same value you use on Vercel / Neon / Supabase Postgres |
| `CORS_ORIGIN` | Recommended | Your Vercel site origin, e.g. `https://<your-vercel-project>.vercel.app` (copy from the Vercel dashboard — do not guess) |
| `GEMINI_API_KEY` | Optional | Home chat; app still works without it |
| `SMTP_EMAIL` / `SMTP_APP_PASSWORD` | Optional | Real OTP email |

Do **not** put the Supabase publishable key on Render unless this Node process will call Supabase itself. The browser client uses `VITE_SUPABASE_*` on **Vercel** (build-time).

## After Render is live

1. Copy the service URL from the Render dashboard.
2. On Vercel, optionally set `VITE_API_ORIGIN` to that URL and redeploy so the PWA talks to Render instead of `api/[[...path]].js`.
3. Leave `VITE_API_ORIGIN` unset to keep using the Vercel serverless BFF.

## What not to deploy on Render for v1

The checked-in `render.yaml` (if present) describes a larger polyglot stack. Ignore it for this cut. The product path is: **Vercel frontend + Vercel `/api`**, with Render Node BFF only if you outgrow serverless.
