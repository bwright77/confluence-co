-- =============================================================================
-- Restrict sign-ups to @confluenceco.org, and make those users admins.
-- Only Shane and Vivian are expected. Existing users (e.g. the dev account) are
-- unaffected — the domain check is BEFORE INSERT, so it only gates new signups.
-- =============================================================================

-- @confluenceco.org signups become admins; anything else defaults to member
-- (won't occur while the domain trigger below is active, but explicit is safer).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    case when new.email ilike '%@confluenceco.org' then 'admin' else 'member' end
  );
  return new;
end;
$$;

-- Reject account creation for any non-@confluenceco.org email.
create or replace function public.enforce_email_domain()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.email is null or new.email not ilike '%@confluenceco.org' then
    raise exception 'Only @confluenceco.org accounts may sign in';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_email_domain_trigger on auth.users;
create trigger enforce_email_domain_trigger
  before insert on auth.users
  for each row execute function public.enforce_email_domain();
