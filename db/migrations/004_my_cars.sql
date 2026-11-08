-- عربياتي: the cars a trader has in stock. Private to each user (no one else ever sees them), written only by the
-- /api/garage function (server side, checks the Supabase Auth token): RLS on, no policies.
create table if not exists my_cars (
  id         bigserial primary key,
  user_id    uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  make       text not null,
  model      text not null,
  year       int  not null,
  trim       text,
  km         int  not null,
  price      bigint,
  status     text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  notes      text,
  details    jsonb not null default '{}'::jsonb,
  cover      text,
  photos     jsonb not null default '[]'::jsonb
);
create index if not exists my_cars_user on my_cars (user_id, updated_at desc);
alter table my_cars enable row level security;
