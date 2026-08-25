-- Saheli Sahaay scheme catalogue (English Excel fields + banner URL).
-- No secrets. Apply with: psql "$DATABASE_URL" -f scripts/schema.sql

CREATE TABLE IF NOT EXISTS schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  category TEXT,
  subcategory TEXT,
  state TEXT,
  eligibility TEXT,
  description TEXT,
  documents TEXT[] NOT NULL DEFAULT '{}',
  benefit TEXT,
  official_link TEXT,
  banner_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  processing_time TEXT,
  popular BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC,
  reviews INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schemes_category_idx ON schemes (category);
CREATE INDEX IF NOT EXISTS schemes_state_idx ON schemes (state);
