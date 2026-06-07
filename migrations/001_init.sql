-- 001_init.sql
-- Initial schema for the Travel Booking API.

CREATE TABLE IF NOT EXISTS venues (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  city            TEXT NOT NULL,
  capacity        INTEGER NOT NULL CHECK (capacity > 0),
  price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  venue_id    INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  check_in    DATE NOT NULL,
  check_out   DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'confirmed',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed a little data so the API returns something on first run.
INSERT INTO venues (name, city, capacity, price_per_night) VALUES
  ('Seaside Resort',    'Da Nang',   120, 85.00),
  ('Mountain Lodge',    'Sapa',       40, 60.00),
  ('City Center Hotel', 'Hanoi',     200, 110.00),
  ('Riverside Villa',   'Hoi An',     12, 150.00)
ON CONFLICT DO NOTHING;

INSERT INTO customers (name, email) VALUES
  ('Alice Tran',  'alice@example.com'),
  ('Bao Nguyen',  'bao@example.com')
ON CONFLICT DO NOTHING;
