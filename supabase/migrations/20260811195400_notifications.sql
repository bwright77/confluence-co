-- =============================================================================
-- Email notifications — Phase 3 (ADR-003). Ported verbatim from wright-adventures.
-- Per-user preferences + append-only dispatch log. Reuses update_updated_at().
-- The dispatch endpoints are triggered by Supabase DB webhooks (dashboard-config,
-- recreated out-of-band per the ADR-009 infra checklist).
-- =============================================================================

CREATE TABLE notification_preferences (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  deadline_7d             BOOLEAN NOT NULL DEFAULT true,
  deadline_3d             BOOLEAN NOT NULL DEFAULT true,
  deadline_1d             BOOLEAN NOT NULL DEFAULT true,
  task_assigned           BOOLEAN NOT NULL DEFAULT true,
  opportunity_discovered  BOOLEAN NOT NULL DEFAULT true,  -- admin only; ignored for non-admins
  updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notification preferences"
  ON notification_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to notification_preferences"
  ON notification_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Append-only notification dispatch log.
CREATE TABLE notification_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'deadline_7d', 'deadline_3d', 'deadline_1d',
    'task_assigned',
    'opportunity_discovered'
  )),
  opportunity_id    UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  task_id           UUID REFERENCES tasks(id) ON DELETE SET NULL,
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  success           BOOLEAN NOT NULL,
  error_message     TEXT,
  email_to          TEXT NOT NULL
);

-- One successful deadline notification per (opportunity, type) per UTC day.
CREATE UNIQUE INDEX notification_dedup_idx
  ON notification_log (opportunity_id, notification_type, sent_date)
  WHERE notification_type IN ('deadline_7d', 'deadline_3d', 'deadline_1d')
    AND success = true;

CREATE INDEX notification_log_user_sent_idx ON notification_log (user_id, sent_at DESC);
CREATE INDEX notification_log_type_sent_idx ON notification_log (notification_type, sent_at DESC);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read notification log"
  ON notification_log
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Service role full access to notification_log"
  ON notification_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
