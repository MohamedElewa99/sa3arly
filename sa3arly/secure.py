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


# Least privilege: each side of the system gets its own database role with only what it needs.
#   sa3_api     - the website's /api functions: read the market data, read and write the users' own tables. No DDL.
#   sa3_scraper - the scraper and the nightly training: read and write the market data. Cannot see any user table.
# The owner (postgres) is then used only by the lockdown job itself. Roles are created without a password or login;
# the owner turns login on when he gives each one its password. Same as db/migrations/008_roles.sql.
USER_TABLES = ("profiles", "saved_quotes", "my_cars", "phone_logins", "vision_uses")

ROLES = """do $$
declare t record; r text; mine boolean;
begin
  foreach r in array array['sa3_api', 'sa3_scraper'] loop
    if not exists (select 1 from pg_roles where rolname = r) then
      execute format('create role %I nologin noinherit', r);
    end if;
    execute format('revoke all on all tables in schema public from %I', r);
    execute format('revoke all on all sequences in schema public from %I', r);
    execute format('revoke all on all functions in schema public from %I', r);
    execute format('revoke create on schema public from %I', r);
    execute format('grant usage on schema public to %I', r);
  end loop;
  for t in select tablename from pg_tables where schemaname = 'public' loop
    mine := t.tablename = any (array['profiles', 'saved_quotes', 'my_cars', 'phone_logins', 'vision_uses']);
    execute format('drop policy if exists sa3_api on public.%I', t.tablename);
    execute format('drop policy if exists sa3_scraper on public.%I', t.tablename);
    if mine then
      execute format('grant select, insert, update, delete on public.%I to sa3_api', t.tablename);
      execute format('create policy sa3_api on public.%I for all to sa3_api using (true) with check (true)', t.tablename);
    else
      execute format('grant select on public.%I to sa3_api', t.tablename);
      execute format('create policy sa3_api on public.%I for select to sa3_api using (true)', t.tablename);
      execute format('grant select, insert, update, delete on public.%I to sa3_scraper', t.tablename);
      execute format('create policy sa3_scraper on public.%I for all to sa3_scraper using (true) with check (true)', t.tablename);
    end if;
  end loop;
  -- serial ids: each role only for the tables it may insert into
  for t in select s.relname as seq, c.relname as tab from pg_class s join pg_depend d on d.objid = s.oid and d.deptype in ('a', 'i')
           join pg_class c on c.oid = d.refobjid join pg_namespace n on n.oid = s.relnamespace
           where s.relkind = 'S' and n.nspname = 'public' loop
    mine := t.tab = any (array['profiles', 'saved_quotes', 'my_cars', 'phone_logins', 'vision_uses']);
    execute format('grant usage, select on sequence public.%I to %I', t.seq, case when mine then 'sa3_api' else 'sa3_scraper' end);
  end loop;
end $$;
"""


def ddl(cx, sql: str) -> None:
    """Create-if-missing statements. Under a least-privilege role they are not allowed and not needed: the owner's
    lockdown job has already made every table."""
    import psycopg
    try:
        cx.execute(sql)
    except psycopg.errors.InsufficientPrivilege:
        pass


def migrate(cx) -> None:
    """Every table the app needs, made by the owner so the working roles never need to create anything."""
    from . import garage, ml, phone_login, profile, saved
    for sql in (profile.MIGRATION, profile.ROLE_MIGRATION, saved.MIGRATION, garage.MIGRATION, phone_login.MIGRATION, ml.MIGRATION,
                "create table if not exists vision_uses (user_id uuid not null, at timestamptz not null default now())"):
        cx.execute(sql)


def roles(cx) -> None:
    cx.execute(ROLES)


def lockdown(cx) -> int:
    """Apply it; returns how many public tables are still without RLS (0 is the only good answer)."""
    cx.execute(LOCKDOWN)
    return cx.execute("select count(*) from pg_tables where schemaname = 'public' and not rowsecurity").fetchone()[0]
