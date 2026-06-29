-- 001_seed.sql
-- Initial seed data. Managed by src/seed.ts — runs once, tracked in _seeds.

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
