-- Sign in with WhatsApp: the app shows a code, the user sends it from his WhatsApp to our number (incoming messages
-- cost nothing), the webhook records which number sent it, and the app that holds the secret nonce gets a session.
-- Written only by /api/phone and /api/whatsapp (server side); RLS on, no policies.
create table if not exists phone_logins (
  id          bigserial primary key,
  nonce_hash  text not null unique,
  code        text not null,
  created_at  timestamptz not null default now(),
  phone       text,
  verified_at timestamptz,
  used_at     timestamptz
);
create index if not exists phone_logins_code on phone_logins (code) where verified_at is null;
alter table phone_logins enable row level security;
