-- =============================================================================
-- Foundation schema — Confluence Colorado admin platform (OMP grant/governance)
-- Ported from wright-adventures initial_schema, reduced to what the board-minutes
-- pilot (Phase 2) needs: the profiles bridge, the auth-signup trigger, the shared
-- updated_at helper, and profiles RLS.
--
-- Hardening (ADR-009 review): update_updated_at() lives HERE in the foundation,
-- not buried in a grant migration — spine/governance tables' updated_at triggers
-- depend on it. No partnership triggers/functions are carried over; this project
-- is grants + governance only.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users with a display name + role.
-- ---------------------------------------------------------------------------
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null default '',
  role        text not null default 'member'
                check (role in ('admin', 'manager', 'member', 'viewer')),
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

comment on table profiles is 'Staff/board user profiles for Confluence Colorado, keyed to auth.users.';

-- Auto-create a profile row on signup. security definer + empty search_path per
-- Supabase managed-Postgres requirements.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Shared updated_at trigger helper (used by board_meetings and future spine tables).
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles RLS — read all (needed for PostgREST joins), self-update, admin-update.
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "Authenticated users can read profiles"
  on profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on profiles for update to authenticated using (auth.uid() = id);

create policy "Admins can update any profile"
  on profiles for update to authenticated
  using ((select role from profiles where id = auth.uid()) = 'admin')
  with check ((select role from profiles where id = auth.uid()) = 'admin');

-- ---------------------------------------------------------------------------
-- Bootstrap: users created BEFORE this migration (e.g. the first test user) never
-- fired the signup trigger, so backfill their profile. The founding user(s) get
-- 'admin' so they can immediately use admin/manager-gated features. Adjust roles
-- later from the admin UI.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, full_name, role)
  select id, coalesce(raw_user_meta_data->>'full_name', ''), 'admin'
  from auth.users
  on conflict (id) do nothing;
