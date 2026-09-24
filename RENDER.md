# Render — Node API

Frontend stays on **Vercel**. Render runs the same Node BFF as `npm start` (`server/api.mjs`).

Blueprint file: `render.yaml` → service name **smriti-saarthi-api**.

## Deploy (one-time)

1. Open [Render Blueprint](https://dashboard.render.com/select-repo?type=blueprint) and pick **`jainyogya07/demetia`**.
2. Apply `render.yaml`. Plan is **free**. Region **Singapore**.
3. In the service → Environment, fill:
   - `DATABASE_URL` — same Postgres as Vercel (Neon / Supabase Postgres)
   - `GEMINI_API_KEY` — optional
   - `SMTP_EMAIL` / `SMTP_APP_PASSWORD` — optional OTP mail
   - `CORS_ORIGIN` is already `https://demetia.vercel.app`
4. Wait until health **`GET /api/v1/health`** is green.
5. Copy the URL, e.g. `https://smriti-saarthi-api.onrender.com`.
6. Optional: Vercel env `VITE_API_ORIGIN` = that URL, then redeploy. Leave unset to keep using Vercel `/api`.

## Local parity

```bash
npm start
# GET http://127.0.0.1:8787/api/v1/health
```

On Render, `PORT` is set for you; `server/api.mjs` binds `0.0.0.0`.

## Do not Blueprint-deploy

Rust / Go / Python docker services in old notes. They are not required for quiz, Safe Journey, alarms, or Memory Book.
