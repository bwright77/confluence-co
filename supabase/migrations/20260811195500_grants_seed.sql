-- =============================================================================
-- Confluence Colorado historic grant data seed — Phase 3 (ADR-009).
-- Ported from wright-adventures. Historic grant applications (2023–2026) sourced
-- from the Confluence Google Drive folder structure (Year > Status Bucket > Funder).
--
-- Hardening: owner_id is re-pointed from Shane's Wright Adventures auth user to
-- the Confluence admin profile — (SELECT id FROM profiles WHERE role='admin'
-- ORDER BY created_at ASC LIMIT 1) — so no cross-project auth-UID remap is needed.
-- All other values are verbatim.
-- =============================================================================

BEGIN;

-- Warn if no admin profile exists yet (owner_id would be NULL).
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE NOTICE 'WARNING: no admin profile found. Seed owner_id will be NULL on all records. '
                 'Ensure the foundation migration ran (it backfills the founding admin) before this seed.';
  END IF;
END $$;

INSERT INTO opportunities (
  name, type_id, status, funder, grant_type, amount_requested, amount_awarded,
  owner_id, source_url, tags, description, created_at, updated_at
)
VALUES

-- 2025 — ACTIVE (grant_awarded)
('GES Investment Fund', 'grant', 'grant_awarded', 'GES Investment Fund', 'foundation', 15000.00, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1n2J5EOHwNM7_jgAWp4nq2RepVbdFVDSw',
  ARRAY['equity', 'community', 'Swansea', 'Globeville', 'GES'],
  'CIF grant. Application deadline noted as 4/30/2025 in doc header. Vivian is primary author.',
  '2025-04-14T17:19:16Z', '2026-02-25T23:54:27Z'),

('Denver Foundation NEST', 'grant', 'grant_awarded', 'Denver Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1K9pQ_s2aXRMya4amO1VC7XfjC8ps2fFm',
  ARRAY['Denver Foundation', 'NEST', 'capacity'],
  'Folder last modified 2026-02-25 — likely still active/reporting.',
  '2025-09-01T23:08:41Z', '2026-02-25T23:46:06Z'),

-- 2025 — PENDING (grant_submitted)
('Youth Athletics Grant', 'grant', 'grant_submitted', 'Unknown — verify', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1lz2jujVZn6Sxot_ddrODubvIO2AlHgOl',
  ARRAY['youth', 'athletics'],
  'Pending as of late 2025. Verify funder name.',
  '2025-12-09T17:51:28Z', '2025-12-09T17:51:28Z'),

('Beth Conover Letter', 'grant', 'grant_submitted', 'Unknown — verify (likely letter of support context)', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1xmMBvlNjdbWpjvuYQx6Cj3ptgIBfFZzP',
  ARRAY['letter of support'],
  'Folder name suggests LOI or letter of support from Beth Conover. May be a supporting doc vs. standalone grant — verify.',
  '2025-12-02T17:42:23Z', '2025-12-02T17:42:23Z'),

('RM Arsenal NFWF', 'grant', 'grant_submitted', 'National Fish and Wildlife Foundation', 'federal', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1yqTudKxEwPS2TuIkEPfB3Tu3B-',
  ARRAY['NFWF', 'Rocky Mountain Arsenal', 'wildlife', 'watershed'],
  'Rocky Mountain Arsenal site. National Fish and Wildlife Foundation.',
  '2025-01-27T20:40:10Z', '2025-01-27T20:40:10Z'),

-- 2025 — DENIED (grant_declined)
('Outdoor Equity Fund (2025)', 'grant', 'grant_declined', 'Colorado Outdoor Equity Fund', 'state', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1Mjjrvb7m3dLAniA9XSmLv9KCbdHG4R8l',
  ARRAY['outdoor equity', 'youth', 'nature access'],
  'Denied 2025. Also applied 2023 — see 2023 record.',
  '2025-09-16T16:02:47Z', '2025-09-16T16:02:47Z'),

('Chinook Fund (2025)', 'grant', 'grant_declined', 'Chinook Fund', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/14Ehky8ORj2V3zhnK0_pu95GqbxN0PHFu',
  ARRAY['Chinook Fund', 'grassroots', 'equity'],
  'Denied 2025. Also applied 2023.',
  '2025-09-15T18:41:42Z', '2025-09-15T18:41:42Z'),

('The Conservation Alliance (2025)', 'grant', 'grant_declined', 'The Conservation Alliance', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1dlediNntTRiBnma21FFoO3sEXNa-Te06',
  ARRAY['Conservation Alliance', 'outdoor recreation', 'conservation'],
  'Denied 2025. Also applied 2023.',
  '2025-09-15T18:09:24Z', '2025-09-15T18:09:24Z'),

('Denver Foundation Capacity Building (2025)', 'grant', 'grant_declined', 'Denver Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/13rTgItvFWZjZMrIlG36zbtQkGUJ7T4rW',
  ARRAY['Denver Foundation', 'capacity building'],
  'Denied 2025. Separate application from the NEST grant.',
  '2025-09-01T23:09:34Z', '2025-09-01T23:09:34Z'),

('Colorado Plateau Foundation', 'grant', 'grant_declined', 'Colorado Plateau Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1ODSq8Gzjt8ygGsYvPPECoUcfQ4snZRhk',
  ARRAY['Colorado Plateau', 'watershed', 'conservation'],
  NULL,
  '2025-08-25T17:53:50Z', '2025-08-25T17:53:50Z'),

('Gates Family Foundation', 'grant', 'grant_declined', 'Gates Family Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1JxMxcYWpriWjNnalAlzTjXtO8tPmk8tS',
  ARRAY['Gates Family Foundation', 'Colorado'],
  NULL,
  '2025-08-25T15:23:42Z', '2025-08-25T15:23:42Z'),

('CASR (2025)', 'grant', 'grant_declined', 'CASR — Colorado Association of Ski Towns (verify)', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/14-gdewrJuxkqQiMQdioSTjotghSTQJet',
  ARRAY['CASR'],
  'Verify funder full name. CASR Mini Workforce Grant also appears in 2026 pending.',
  '2025-07-31T14:08:02Z', '2025-07-31T14:08:02Z'),

('Anschutz Foundation', 'grant', 'grant_declined', 'Anschutz Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1ntGqLboaaAmZiz42_eTPMwXitRbS5ShV',
  ARRAY['Anschutz', 'Denver', 'foundation'],
  NULL,
  '2025-07-01T23:32:03Z', '2025-07-01T23:32:03Z'),

('National Forest Foundation (2025)', 'grant', 'grant_declined', 'National Forest Foundation', 'federal', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1okLYMHU2rx7HcJhidE-GrhvBAtRZrMb4',
  ARRAY['National Forest Foundation', 'USFS', 'watershed', 'forest'],
  'Also appears in 2026 Pending as January 2026 MAP.',
  '2025-06-26T22:41:40Z', '2025-06-26T22:41:40Z'),

('Colorado Water Plan Grant', 'grant', 'grant_declined', 'Colorado Water Conservation Board', 'state', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1epTYKdH75ODSjDC8dosmdJuV17Rg1qfv',
  ARRAY['CWCB', 'water plan', 'watershed', 'state'],
  NULL,
  '2025-06-26T20:05:08Z', '2025-06-26T20:05:08Z'),

('250/150 Grant', 'grant', 'grant_declined', 'Unknown — verify (250th/150th anniversary program?)', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1bT3s9cd29t1L7OyFZd0nuA3wWhReRKHz',
  ARRAY['250/150', 'anniversary'],
  'Unclear funder — may relate to US 250th / CO 150th anniversary programming. Verify.',
  '2025-06-26T17:06:07Z', '2025-06-26T17:06:07Z'),

('Colorado Health Foundation LGCP (2025)', 'grant', 'grant_declined', 'Colorado Health Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1vtikJ68vBMwmXD-Qt0h-s_i8nKSpPonK',
  ARRAY['Colorado Health Foundation', 'LGCP', 'health equity'],
  'LGCP = Local & Geographic Community Priority track. Also in 2026 Pending.',
  '2025-06-26T17:05:51Z', '2025-06-26T17:05:51Z'),

('Colorado Health Foundation Youth (2025)', 'grant', 'grant_declined', 'Colorado Health Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1fbJL9TIFI4VyLpdkwFaV9tlCOYIH21LB',
  ARRAY['Colorado Health Foundation', 'youth', 'health'],
  'Separate CHF application focused on youth programming.',
  '2025-06-26T17:05:38Z', '2025-06-26T17:05:38Z'),

('Denver Broncos Foundation', 'grant', 'grant_declined', 'Denver Broncos Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1lPCK9UAQA_MaugukHnWrdUZhhRtVryRZ',
  ARRAY['Denver Broncos Foundation', 'youth', 'sports'],
  NULL,
  '2025-05-14T18:48:26Z', '2025-05-14T18:48:26Z'),

('Next Generation Agriculture', 'grant', 'grant_declined', 'Unknown — verify (USDA? CO Dept Ag?)', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1eIjG6YJBCHccHsTGDjS29nwqXMOQek_Q',
  ARRAY['agriculture', 'next generation', 'youth'],
  'Verify funder. Last modified April 2025 — may have been submitted.',
  '2025-04-23T15:26:50Z', '2025-04-29T23:29:17Z'),

-- 2024 (grant_declined — verify outcomes individually)
('Caring for Colorado (2024)', 'grant', 'grant_declined', 'Caring for Colorado Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/104W-1Y5jfSxSf-iOZqoWLMeszKPso3Dn',
  ARRAY['Caring for Colorado', 'youth', 'community health'],
  'Status unconfirmed — folder in 2024 root. Verify outcome.',
  '2024-12-16T15:38:41Z', '2024-12-16T15:38:41Z'),

('EPA EJ Region 8 Thriving Communities', 'grant', 'grant_declined', 'U.S. Environmental Protection Agency', 'federal', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/11qAZj0VUCDV6IPxmMzHlG7gAojBJV0AB',
  ARRAY['EPA', 'environmental justice', 'EJ', 'Region 8', 'Thriving Communities'],
  'Federal EJ grant. Significant opportunity — verify outcome and document lessons learned.',
  '2024-12-12T17:46:13Z', '2024-12-12T17:46:13Z'),

('CDPHE Environmental Justice (2024)', 'grant', 'grant_declined', 'Colorado Department of Public Health and Environment', 'state', 300000.00, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1_j2NgInXK8wxLbgMmmTnqM7Wggb-0de4',
  ARRAY['CDPHE', 'environmental justice', 'EJ', 'state', 'health equity'],
  'Requested $300,000 per folder name. CDPHE EJ program. Verify outcome.',
  '2024-11-25T16:53:45Z', '2024-11-26T00:39:00Z'),

-- 2023 (grant_declined — verify outcomes)
('The Conservation Alliance (2023)', 'grant', 'grant_declined', 'The Conservation Alliance', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1dDYQbweNUWbS1oG8E1ajSN_r-zNy-Kzn',
  ARRAY['Conservation Alliance', 'outdoor recreation', 'conservation'],
  'Recurring funder — also applied 2025. Track relationship.',
  '2023-09-28T17:39:01Z', '2023-09-28T17:39:01Z'),

('DOLA (2023)', 'grant', 'grant_declined', 'Colorado Department of Local Affairs', 'state', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1YOPB_OzjpSjizKrQTw41R5N7WplYB-yR',
  ARRAY['DOLA', 'state', 'local affairs', 'community development'],
  'Colorado DOLA grant program. Verify specific program name and outcome.',
  '2023-09-28T15:55:35Z', '2023-09-28T15:55:35Z'),

('Outdoor Equity Fund (2023)', 'grant', 'grant_declined', 'Colorado Outdoor Equity Fund', 'state', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1JF3vF8LNwZJay-zY3l_018Um3__XTTbb',
  ARRAY['outdoor equity', 'youth', 'nature access'],
  'Also applied 2025. Recurring — track feedback from both cycles.',
  '2023-09-28T15:55:19Z', '2023-09-28T15:55:19Z'),

('Chinook Fund (2023)', 'grant', 'grant_declined', 'Chinook Fund', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1JCIhKQeb3HsgbgEcbzZEXiqGL3hJeAh6',
  ARRAY['Chinook Fund', 'grassroots', 'equity'],
  'Also applied 2025. Chinook prioritizes grassroots orgs — track relationship.',
  '2023-09-14T20:38:46Z', '2023-09-14T20:38:46Z'),

-- 2026 — PENDING (grant_submitted)
('CASR Mini Workforce Grant (2026)', 'grant', 'grant_submitted', 'CASR', 'other', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1JQTfpCs_QN6CFEFOq8WExeH5Tk5woFpX',
  ARRAY['CASR', 'workforce', 'youth employment'],
  NULL,
  '2026-02-17T16:51:00Z', '2026-02-17T16:51:00Z'),

('Youth Colorado Health Foundation (2026)', 'grant', 'grant_submitted', 'Colorado Health Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1HCK_aGEQGsLAtxJY2RBDgJuD3qp0aRb6',
  ARRAY['Colorado Health Foundation', 'youth', 'health'],
  NULL,
  '2026-02-15T15:50:08Z', '2026-02-15T15:50:23Z'),

('Colorado Health Foundation LGCP (2026)', 'grant', 'grant_submitted', 'Colorado Health Foundation', 'foundation', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1oh7_kxT5Elo0T064LVDHZVMXOBjzEu0l',
  ARRAY['Colorado Health Foundation', 'LGCP', 'health equity'],
  NULL,
  '2026-02-11T23:23:24Z', '2026-02-11T23:23:24Z'),

('January 2026 MAP — National Forest Foundation', 'grant', 'grant_submitted', 'National Forest Foundation', 'federal', NULL, NULL,
  (SELECT id FROM profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1),
  'https://drive.google.com/drive/folders/1Jcj7eexC5AwbYSmFkrMllngGwhdj7VCI',
  ARRAY['National Forest Foundation', 'MAP', 'USFS', 'watershed', 'forest'],
  'MAP = Matching Awards Program. January 2026 cycle.',
  '2026-01-22T19:31:12Z', '2026-01-22T19:31:12Z');

COMMIT;
