import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from './_mailer.js'

// Supabase (service role — server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL || 'http://placeholder.invalid',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
)

// NOTE: the tasks column is `assignee_id` (the WA source read a non-existent
// `assigned_to`, so its webhook never fired). Corrected here.
interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: string
    opportunity_id: string | null
    title: string
    assignee_id: string | null
    due_date: string | null
    status: string
  }
  old_record: {
    id: string
    assignee_id: string | null
  } | null
}

// POST — Supabase Database Webhook on tasks INSERT/UPDATE.
// Configure in Supabase Dashboard → Database → Webhooks:
//   Table: tasks | Events: INSERT, UPDATE
//   URL: https://www.confluenceco.org/api/notifications/task-assigned
//   HTTP header: x-supabase-webhook-secret: <SUPABASE_WEBHOOK_SECRET>
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set' })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET
  if (webhookSecret && req.headers['x-supabase-webhook-secret'] !== webhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const payload = req.body as WebhookPayload
  const { record, old_record } = payload

  // Notify only when the assignee is newly set (INSERT with assignee, or a
  // reassignment on UPDATE).
  if (!record.assignee_id) {
    return res.status(200).json({ ok: true, skipped: 'no_assignee' })
  }
  if (old_record && old_record.assignee_id === record.assignee_id) {
    return res.status(200).json({ ok: true, skipped: 'assignee_unchanged' })
  }

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('task_assigned')
    .eq('user_id', record.assignee_id)
    .maybeSingle()

  const isEnabled = prefs ? prefs.task_assigned !== false : true
  if (!isEnabled) {
    return res.status(200).json({ ok: true, skipped: 'opted_out' })
  }

  const { data: { user: assignee }, error: userError } = await supabase.auth.admin.getUserById(record.assignee_id)
  if (userError || !assignee?.email) {
    return res.status(200).json({ ok: true, skipped: 'user_not_found' })
  }

  let opportunityName = 'an opportunity'
  if (record.opportunity_id) {
    const { data: opp } = await supabase
      .from('opportunities')
      .select('name')
      .eq('id', record.opportunity_id)
      .single()
    if (opp?.name) opportunityName = opp.name
  }

  const subject = `[Confluence Colorado] New task assigned: ${record.title}`
  const text = [
    `You've been assigned a task on ${opportunityName}:`,
    '',
    `Task: ${record.title}`,
    `Due: ${record.due_date ?? 'No due date set'}`,
    `Opportunity: ${opportunityName}`,
    '',
    record.opportunity_id
      ? `View task: ${process.env.APP_URL}/admin/opportunities/${record.opportunity_id}`
      : null,
    '',
    `Update your notification preferences: ${process.env.APP_URL}/admin/settings`,
  ].filter(Boolean).join('\n')

  let success = false
  let errorMessage: string | undefined

  try {
    await sendEmail(assignee.email, subject, text)
    success = true
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  await supabase.from('notification_log').insert({
    user_id: record.assignee_id,
    notification_type: 'task_assigned',
    opportunity_id: record.opportunity_id ?? null,
    task_id: record.id,
    success,
    error_message: errorMessage ?? null,
    email_to: assignee.email,
  })

  return res.status(200).json({ ok: true, sent: success, error: errorMessage })
}
