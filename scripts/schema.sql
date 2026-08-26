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

CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  person TEXT,
  place TEXT,
  memory_date DATE,
  lang TEXT NOT NULL DEFAULT 'en',
  album TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS memories_album_idx ON memories (album);
CREATE INDEX IF NOT EXISTS memories_date_idx ON memories (memory_date);

CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  birth_date DATE,
  role TEXT NOT NULL DEFAULT 'user',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS app_users_phone_idx ON app_users (phone);

CREATE TABLE IF NOT EXISTS otp_challenges (
  phone TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  purpose TEXT NOT NULL,
  pending_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
