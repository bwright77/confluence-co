-- =============================================================================
-- Fold in three WA discovery migrations missed in the Phase 3 port:
--   20260226000003 — discovery_runs cancel statuses (api/discovery/cancel.ts)
--   20260226000004 — discovery_queries.current_page pagination cursor (sync)
--   20260304000000 — RLS on the lookup tables (opportunity_types, pipeline_statuses)
--
-- Without current_page, sync's `select(... current_page)` errors and reports the
-- misleading "No enabled discovery queries found".
-- =============================================================================

-- Pagination cursor used by api/discovery/sync.ts
ALTER TABLE discovery_queries
  ADD COLUMN IF NOT EXISTS current_page INTEGER NOT NULL DEFAULT 1;

-- Allow the cancel statuses (Stop Run)
ALTER TABLE discovery_runs DROP CONSTRAINT IF EXISTS discovery_runs_status_check;
ALTER TABLE discovery_runs
  ADD CONSTRAINT discovery_runs_status_check
  CHECK (status IN ('running', 'cancelling', 'cancelled', 'completed', 'failed'));

-- Lookup-table RLS: read for all authenticated, writes admin-only.
ALTER TABLE opportunity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read opportunity types"
  ON opportunity_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read pipeline statuses"
  ON pipeline_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage opportunity types"
  ON opportunity_types FOR ALL TO authenticated
  USING     ((select role from profiles where id = auth.uid()) = 'admin')
  WITH CHECK ((select role from profiles where id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage pipeline statuses"
  ON pipeline_statuses FOR ALL TO authenticated
  USING     ((select role from profiles where id = auth.uid()) = 'admin')
  WITH CHECK ((select role from profiles where id = auth.uid()) = 'admin');
