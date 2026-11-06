-- Pricings a signed-in user chose to keep. Written only by the /api/saved function (server side, checks the
-- Supabase Auth token), so the table stays closed to the public API: RLS on, no policies.
create table if not exists saved_quotes (
  id         bigserial primary key,
  user_id    uuid not null,
  created_at timestamptz not null default now(),
  make       text not null,
  model      text not null,
  year       int  not null,
  trim       text,
  km         int  not null,
  low        int  not null,
  high       int  not null,
  details    jsonb not null default '{}'::jsonb
);
create index if not exists saved_quotes_user on saved_quotes (user_id, created_at desc);
alter table saved_quotes enable row level security;
