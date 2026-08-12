-- =============================================================================
-- Board meeting minutes — Phase 2 pilot (ADR-004 / ADR-009).
-- Transcript → AI extraction → human review → approval. No coupling to
-- opportunities, which is why it's the safe first feature to port.
--
-- Hardening (ADR-009 review, D1): created_by / approved_by reference profiles(id)
-- directly (WA reached this via a later fix migration), so PostgREST can resolve
-- profiles!created_by / profiles!approved_by joins without a follow-up patch.
-- =============================================================================

create table board_meetings (
  id                    uuid primary key default gen_random_uuid(),

  -- Meeting metadata
  meeting_date          date not null,
  meeting_start         time,
  meeting_end           time,
  location              text not null default 'Virtual (Google Meet)',

  -- Transcript input
  transcript_file_path  text,   -- Storage path (optional; the extractor also accepts pasted text)
  transcript_raw        text,

  -- AI extraction pipeline
  extracted_data        jsonb,
  extraction_status     text not null default 'pending'
                        check (extraction_status in ('pending', 'processing', 'complete', 'failed')),
  extraction_error      text,

  -- Human editing + approval
  edited_data           jsonb,
  status                text not null default 'draft'
                        check (status in ('draft', 'under_review', 'approved')),
  approved_by           uuid references profiles(id),
  approved_at           timestamptz,

  -- Audit
  created_by            uuid not null references profiles(id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table board_meetings is 'Board meeting minutes for Confluence Colorado: transcript → AI extraction → human review → approval.';

create trigger board_meetings_updated_at
  before update on board_meetings
  for each row execute function update_updated_at();

create index board_meetings_date_idx   on board_meetings (meeting_date desc);
create index board_meetings_status_idx on board_meetings (status);

-- ---------------------------------------------------------------------------
-- RLS: admin/manager full; member read all; viewer read approved only;
-- service_role full (extraction endpoint).
-- ---------------------------------------------------------------------------
alter table board_meetings enable row level security;

create policy "Admins and managers full access to board_meetings"
  on board_meetings for all
  using (exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role in ('admin', 'manager')
  ))
  with check (exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role in ('admin', 'manager')
  ));

create policy "Members read all board_meetings"
  on board_meetings for select
  using (exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'member'
  ));

create policy "Viewers read approved board_meetings"
  on board_meetings for select
  using (status = 'approved' and exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'viewer'
  ));

create policy "Service role full access to board_meetings"
  on board_meetings for all to service_role
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Transcript storage bucket (private; server/service-role only).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'board-meeting-transcripts', 'board-meeting-transcripts', false, 524288,
  array['text/plain', 'text/vtt', 'text/x-vtt']
)
on conflict (id) do nothing;

create policy "Service role access to board-meeting-transcripts"
  on storage.objects for all to service_role
  using (bucket_id = 'board-meeting-transcripts')
  with check (bucket_id = 'board-meeting-transcripts');

create policy "Authenticated users upload transcripts"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'board-meeting-transcripts'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('admin', 'manager')
    )
  );
