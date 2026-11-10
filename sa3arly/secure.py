"""Database lockdown. The app's public (anon) key is, by design, visible to every visitor, and Supabase serves every table
of the `public` schema over its REST API to that key unless row level security is on. Our data is read and written only by
the server (/api functions and the scraper, which connect as the owner and are not bound by RLS), so every table gets RLS
with no policies and the public roles lose their grants: nobody can read users' data or plant fake ads to bend the prices.
Same as db/migrations/007_lockdown.sql."""

LOCKDOWN = """-- Every table of ours: row level security on, no policies, and nothing granted to the public API roles.
do $$
declare t record; r text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on all tables in schema public from %I', r);
      execute format('revoke all on all sequences in schema public from %I', r);
      execute format('revoke all on all functions in schema public from %I', r);
      execute format('alter default privileges in schema public revoke all on tables from %I', r);
      execute format('alter default privileges in schema public revoke all on sequences from %I', r);
      execute format('alter default privileges in schema public revoke all on functions from %I', r);
    end if;
  end loop;
end $$;
"""


def lockdown(cx) -> int:
    """Apply it; returns how many public tables are still without RLS (0 is the only good answer)."""
    cx.execute(LOCKDOWN)
    return cx.execute("select count(*) from pg_tables where schemaname = 'public' and not rowsecurity").fetchone()[0]
