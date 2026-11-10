do $$
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
