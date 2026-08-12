-- =============================================================================
-- Grant spine — Phase 3 (ADR-009). Ported from wright-adventures initial_schema.
--
-- Hardening applied:
--  * profiles / handle_new_user / on_auth_user_created / profiles RLS are NOT
--    recreated — they live in the foundation migration.
--  * The 10 partnership columns are dropped from `opportunities`
--    (partner_org, primary_contact, contact_email, contact_phone, partnership_type,
--     mutual_commitments, agreement_date, renewal_date, estimated_value, alignment_notes).
--  * Partnership seed rows are dropped (the 'partnership' opportunity_type, its
--    pipeline_statuses, and the partnership task template). No partnership_* tables,
--    functions, or triggers are referenced anywhere.
--  * type_id + opportunity_types are kept (single value 'grant' for now) per the ADR.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Opportunity types + pipeline statuses
-- ---------------------------------------------------------------------------
create table opportunity_types (
  id          text primary key,
  label       text not null,
  description text,
  sort_order  int  default 0 not null
);

create table pipeline_statuses (
  id          text primary key,
  type_id     text references opportunity_types(id) on delete cascade not null,
  label       text not null,
  sort_order  int  not null,
  is_active   boolean default true not null
);

-- ---------------------------------------------------------------------------
-- Opportunities (grants only — partnership columns dropped)
-- ---------------------------------------------------------------------------
create table opportunities (
  id                  uuid primary key default uuid_generate_v4(),
  type_id             text references opportunity_types(id) not null,
  name                text not null,
  description         text,
  status              text references pipeline_statuses(id) not null,
  owner_id            uuid references profiles(id) on delete set null,
  primary_deadline    timestamptz,
  source_url          text,
  tags                text[] default '{}' not null,

  -- Grant-specific
  funder              text,
  grant_type          text check (grant_type in ('federal','state','foundation','corporate','other')),
  amount_max          numeric(12,2),
  amount_requested    numeric(12,2),
  amount_awarded      numeric(12,2),
  loi_deadline        timestamptz,
  cfda_number         text,
  eligibility_notes   text,

  -- Metadata
  created_by          uuid references profiles(id) on delete set null,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

-- ---------------------------------------------------------------------------
-- Contributors, tasks, templates, documents, deadlines, activity log
-- ---------------------------------------------------------------------------
create table opportunity_contributors (
  opportunity_id  uuid references opportunities(id) on delete cascade,
  profile_id      uuid references profiles(id)      on delete cascade,
  primary key (opportunity_id, profile_id)
);

create table tasks (
  id              uuid primary key default uuid_generate_v4(),
  opportunity_id  uuid references opportunities(id) on delete cascade not null,
  title           text not null,
  status          text not null default 'not_started'
                    check (status in ('not_started','in_progress','complete','blocked')),
  assignee_id     uuid references profiles(id) on delete set null,
  due_date        timestamptz,
  days_offset     int,
  sort_order      int default 0 not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

create table task_templates (
  id          uuid primary key default uuid_generate_v4(),
  type_id     text references opportunity_types(id) not null,
  name        text not null,
  is_default  boolean default false not null,
  created_at  timestamptz default now() not null
);

create table task_template_items (
  id            uuid primary key default uuid_generate_v4(),
  template_id   uuid references task_templates(id) on delete cascade not null,
  title         text not null,
  days_offset   int  not null,
  assignee_role text default 'owner'
                  check (assignee_role in ('owner','contributor','leadership')),
  sort_order    int  default 0 not null
);

create table documents (
  id              uuid primary key default uuid_generate_v4(),
  opportunity_id  uuid references opportunities(id) on delete cascade not null,
  name            text not null,
  doc_type        text not null
                    check (doc_type in ('proposal','budget','loi','agreement','supporting','award_letter','report','correspondence','other')),
  storage_path    text not null,
  file_size       int,
  mime_type       text,
  version         int  default 1 not null,
  uploaded_by     uuid references profiles(id) on delete set null,
  created_at      timestamptz default now() not null
);

create table custom_deadlines (
  id              uuid primary key default uuid_generate_v4(),
  opportunity_id  uuid references opportunities(id) on delete cascade not null,
  label           text        not null,
  due_date        timestamptz not null,
  created_at      timestamptz default now() not null
);

create table activity_log (
  id              uuid primary key default uuid_generate_v4(),
  opportunity_id  uuid references opportunities(id) on delete cascade not null,
  actor_id        uuid references profiles(id) on delete set null,
  action          text    not null,
  details         jsonb,
  created_at      timestamptz default now() not null
);

-- ---------------------------------------------------------------------------
-- Row level security (profiles RLS is in the foundation migration)
-- ---------------------------------------------------------------------------
alter table opportunities            enable row level security;
alter table opportunity_contributors enable row level security;
alter table tasks                    enable row level security;
alter table task_templates           enable row level security;
alter table task_template_items      enable row level security;
alter table documents                enable row level security;
alter table custom_deadlines         enable row level security;
alter table activity_log             enable row level security;

create policy "Authenticated users can read opportunities"
  on opportunities for select to authenticated using (true);
create policy "Managers and admins can create opportunities"
  on opportunities for insert to authenticated
  with check ((select role from profiles where id = auth.uid()) in ('admin','manager'));
create policy "Owners and managers can update opportunities"
  on opportunities for update to authenticated
  using (
    owner_id = auth.uid()
    or (select role from profiles where id = auth.uid()) in ('admin','manager')
  );

create policy "Authenticated users can read tasks"
  on tasks for select to authenticated using (true);
create policy "Authenticated users can create tasks"
  on tasks for insert to authenticated with check (true);
create policy "Assignees and managers can update tasks"
  on tasks for update to authenticated
  using (
    assignee_id = auth.uid()
    or (select role from profiles where id = auth.uid()) in ('admin','manager')
  );

create policy "Authenticated access on contributors"
  on opportunity_contributors for all to authenticated using (true) with check (true);
create policy "Authenticated access on task_templates"
  on task_templates for all to authenticated using (true) with check (true);
create policy "Authenticated access on task_template_items"
  on task_template_items for all to authenticated using (true) with check (true);
create policy "Authenticated access on documents"
  on documents for all to authenticated using (true) with check (true);
create policy "Authenticated access on custom_deadlines"
  on custom_deadlines for all to authenticated using (true) with check (true);
create policy "Authenticated access on activity_log"
  on activity_log for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Seed data (grant only — partnership type/statuses/template removed)
-- ---------------------------------------------------------------------------
insert into opportunity_types (id, label, description, sort_order) values
  ('grant', 'Grant', 'Funding from government, foundation, or corporate sources', 1);

insert into pipeline_statuses (id, type_id, label, sort_order, is_active) values
  ('grant_identified',   'grant', 'Identified',   1, true),
  ('grant_evaluating',   'grant', 'Evaluating',   2, true),
  ('grant_preparing',    'grant', 'Preparing',    3, true),
  ('grant_submitted',    'grant', 'Submitted',    4, true),
  ('grant_under_review', 'grant', 'Under Review', 5, true),
  ('grant_awarded',      'grant', 'Awarded',      6, true),
  ('grant_declined',     'grant', 'Declined',     7, false),
  ('grant_withdrawn',    'grant', 'Withdrawn',    8, false),
  ('grant_archived',     'grant', 'Archived',     9, false);

insert into task_templates (id, type_id, name, is_default) values
  ('00000000-0000-0000-0000-000000000001', 'grant', 'Default Grant Template', true);

insert into task_template_items (template_id, title, days_offset, assignee_role, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Initial eligibility review',            -42, 'owner',       1),
  ('00000000-0000-0000-0000-000000000001', 'Gather required documentation',         -35, 'owner',       2),
  ('00000000-0000-0000-0000-000000000001', 'Draft narrative / proposal',            -28, 'owner',       3),
  ('00000000-0000-0000-0000-000000000001', 'Draft budget and budget justification', -21, 'owner',       4),
  ('00000000-0000-0000-0000-000000000001', 'Internal review (peer)',                -14, 'contributor', 5),
  ('00000000-0000-0000-0000-000000000001', 'Revisions based on review',             -10, 'owner',       6),
  ('00000000-0000-0000-0000-000000000001', 'Final review (leadership)',              -7, 'leadership',  7),
  ('00000000-0000-0000-0000-000000000001', 'Final edits and formatting',             -3, 'owner',       8),
  ('00000000-0000-0000-0000-000000000001', 'Submit application',                    -1, 'owner',       9),
  ('00000000-0000-0000-0000-000000000001', 'Confirm submission receipt',             1, 'owner',      10);
