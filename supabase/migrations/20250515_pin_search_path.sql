
-- migrate:up
do $$
declare
  r record;
begin
  for r in
    select n.nspname           as schema,
           p.proname           as func,
           pg_get_function_identity_arguments(p.oid) as args
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.prokind = 'f'
  loop
    execute format(
      'alter function %I.%I(%s) set search_path = public, pg_temp;',
      r.schema, r.func, r.args
    );
  end loop;
end $$;

-- migrate:down (optional rollback)
do $$
declare
  r record;
begin
  for r in
    select n.nspname, p.proname,
           pg_get_function_identity_arguments(p.oid) as args
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.prokind = 'f'
  loop
    execute format(
      'alter function %I.%I(%s) reset search_path;',
      r.nspname, r.proname, r.args
    );
  end loop;
end $$;

-- migrate:end
