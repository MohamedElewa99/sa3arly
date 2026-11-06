-- One row per signed-in user: what the receipt shows and the city the market is sorted by.
-- Written only by the /api/profile function (server side, checks the Supabase Auth token); RLS on, no policies.
create table if not exists profiles (
  user_id    uuid primary key,
  name       text,
  showroom   text,
  phone      text,
  city       text,
  avatar     text,
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
