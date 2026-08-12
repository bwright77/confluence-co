-- =============================================================================
-- State & local grant discovery sources — Phase 3 (ADR-005). Ported from
-- wright-adventures. Monitored state/local grant pages as configurable data,
-- with the four Colorado sources seeded (GOCO URL already the corrected /grants/apply).
-- Reuses update_updated_at() from the foundation migration.
-- =============================================================================

CREATE TABLE IF NOT EXISTS discovery_sources (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  label                  TEXT        NOT NULL,
  source_type            TEXT        NOT NULL DEFAULT 'state',  -- 'state' | 'local' | 'foundation' | 'federal_api'
  funder_name            TEXT        NOT NULL,

  url                    TEXT        NOT NULL UNIQUE,
  enabled                BOOLEAN     NOT NULL DEFAULT true,
  check_frequency        TEXT        NOT NULL DEFAULT 'weekly',  -- 'daily' | 'weekly' | 'monthly'

  eligibility_notes      TEXT,
  relevance_notes        TEXT,

  source_proximity_bonus NUMERIC(3,1) NOT NULL DEFAULT 1.0,

  last_content_hash      TEXT,
  last_content_text      TEXT,
  last_fetched_at        TIMESTAMPTZ,
  last_changed_at        TIMESTAMPTZ,
  last_error             TEXT,
  consecutive_errors     INTEGER     NOT NULL DEFAULT 0,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_sources_enabled
  ON discovery_sources(enabled) WHERE enabled = true;

CREATE TRIGGER discovery_sources_updated_at
  BEFORE UPDATE ON discovery_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Link opportunities back to their monitoring source.
ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS discovery_source_id UUID REFERENCES discovery_sources(id);

-- Distinguish federal API sync runs from state/local page monitoring runs.
ALTER TABLE discovery_runs
  ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'federal';

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
ALTER TABLE discovery_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY discovery_sources_admin_all ON discovery_sources
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY discovery_sources_manager_read ON discovery_sources
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager'));

-- ---------------------------------------------------------------------------
-- Seed: the initial four Colorado sources
-- ---------------------------------------------------------------------------
INSERT INTO discovery_sources (label, source_type, funder_name, url, eligibility_notes, relevance_notes, check_frequency, source_proximity_bonus)
VALUES
  ('GOCO — Grant Programs',
   'state',
   'Great Outdoors Colorado',
   'https://goco.org/grants/apply',
   'Nonprofits cannot apply directly for most programs — must partner with local government or land trust. Exceptions: Generation Wild funds diverse coalitions directly. Conservation Service Corps administered via CYCA.',
   'Conservation Service Corps (youth crews), Generation Wild (youth + families outdoor), Pathways (career pathways for underrepresented individuals). ~$16M/year invested.',
   'weekly', 1.0),

  ('CWCB — Water Plan Grants',
   'state',
   'Colorado Water Conservation Board',
   'https://cwcb.colorado.gov/funding/colorado-water-plan-grants',
   'Water Plan Grants primarily target governmental entities. WSRF grants accept nonprofit corporations directly. Nonprofits can partner with local entities for Water Plan Grants.',
   'South Platte watershed conservation, Watershed Health & Recreation category. Confluence applied previously (Colorado Water Plan Grant). Deadlines: July 1 and Dec 1.',
   'weekly', 1.0),

  ('CDPHE — Funding Opportunities',
   'state',
   'Colorado Department of Public Health and Environment',
   'https://cdphe.colorado.gov/funding-opportunities',
   'Nonprofits are directly eligible for EJ grants. NPS Mini Grants are rolling year-round ($1K-$5K).',
   'Environmental Justice Grant Program is primary target — Confluence applied in 2024 ($300K). EJ program reopens Summer 2026. Also: NPS Mini Grants, Health Disparities grants.',
   'weekly', 1.0),

  ('DOLA — Funding Opportunities',
   'state',
   'Colorado Department of Local Affairs',
   'https://cdola.colorado.gov/dola-funding-opportunities',
   'Most programs target local governments. Nonprofits can be sponsored applicants for CDBG. NPI Grant (direct nonprofit funding) is closed but monitor for reauthorization.',
   'CDBG (via local gov partner), NPI-like reauthorizations. Confluence applied DOLA 2023. Less directly relevant unless partnering with Denver/Adams County.',
   'weekly', 0.5)

ON CONFLICT (url) DO NOTHING;
