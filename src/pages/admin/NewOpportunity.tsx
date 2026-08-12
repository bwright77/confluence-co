import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { getSupabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { GrantType } from '../../lib/adminTypes'

// ── Grant opportunity schema ──────────────────────────────────
// Grant-only product: no partnership branch, no type selector.
const schema = z.object({
  name:              z.string().min(1, 'Name is required'),
  description:       z.string().optional(),
  primary_deadline:  z.string().optional(),
  source_url:        z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  tags:              z.string().optional(), // comma-separated, split on save
  funder:            z.string().optional(),
  grant_type:        z.enum(['federal', 'state', 'foundation', 'corporate', 'other']).or(z.literal('')).optional(),
  amount_max:        z.string().optional(),
  amount_requested:  z.string().optional(),
  loi_deadline:      z.string().optional(),
  cfda_number:       z.string().optional(),
  eligibility_notes: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

// ── Default status for a newly identified grant ───────────────
const GRANT_STATUS = 'grant_identified'

// ── Field helpers ─────────────────────────────────────────────
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-500 mb-1">{children}</label>
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

function Textarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <>
      <textarea
        {...props}
        rows={3}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors resize-none ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

function Select({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <>
      <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors bg-white ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

// ── Main component ────────────────────────────────────────────
export default function NewOpportunity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
    })

  useEffect(() => {
    document.title = 'New opportunity · Confluence Colorado admin'
  }, [])

  async function onSubmit(values: FormValues) {
    setSubmitError(null)

    const tags = values.tags
      ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    // Build the DB payload — coerce empty strings to null, numbers from strings
    const payload: Record<string, unknown> = {
      type_id:           'grant',
      name:              values.name,
      description:       values.description || null,
      primary_deadline:  values.primary_deadline || null,
      source_url:        values.source_url || null,
      status:            GRANT_STATUS,
      tags,
      created_by:        user?.id ?? null,
      funder:            values.funder || null,
      grant_type:        values.grant_type || null,
      amount_max:        values.amount_max ? Number(values.amount_max) : null,
      amount_requested:  values.amount_requested ? Number(values.amount_requested) : null,
      loi_deadline:      values.loi_deadline || null,
      cfda_number:       values.cfda_number || null,
      eligibility_notes: values.eligibility_notes || null,
    }

    const supabase = await getSupabase()

    const { data, error } = await supabase
      .from('opportunities')
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      setSubmitError(error.message)
      return
    }

    navigate(`/admin/opportunities/${data.id}`)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Back */}
      <Link
        to="/admin/opportunities"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Opportunities
      </Link>

      <h1 className="text-2xl font-bold text-cc-sage-ink mb-8">New Opportunity</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Core fields */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.08em] mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} placeholder="Opportunity name" error={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Brief summary…" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_deadline">Primary deadline</Label>
                <Input id="primary_deadline" {...register('primary_deadline')} type="date" />
              </div>
              <div>
                <Label htmlFor="source_url">Source URL</Label>
                <Input id="source_url" {...register('source_url')} type="url" placeholder="https://…" error={errors.source_url?.message} />
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" {...register('tags')} placeholder="watershed, youth, federal (comma-separated)" />
            </div>
          </div>
        </div>

        {/* Grant fields */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.08em] mb-4">Grant Info</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="funder">Funder</Label>
                <Input id="funder" {...register('funder')} placeholder="Foundation or agency name" />
              </div>
              <div>
                <Label htmlFor="grant_type">Grant type</Label>
                <Select id="grant_type" {...register('grant_type')}>
                  <option value="">Select…</option>
                  {(['federal', 'state', 'foundation', 'corporate', 'other'] as GrantType[]).map(g => (
                    <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount_max">Max amount ($)</Label>
                <Input id="amount_max" {...register('amount_max')} type="number" min="0" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="amount_requested">Amount requesting ($)</Label>
                <Input id="amount_requested" {...register('amount_requested')} type="number" min="0" placeholder="0" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loi_deadline">LOI deadline</Label>
                <Input id="loi_deadline" {...register('loi_deadline')} type="date" />
              </div>
              <div>
                <Label htmlFor="cfda_number">CFDA #</Label>
                <Input id="cfda_number" {...register('cfda_number')} placeholder="XX.XXX" />
              </div>
            </div>
            <div>
              <Label htmlFor="eligibility_notes">Eligibility notes</Label>
              <Textarea id="eligibility_notes" {...register('eligibility_notes')} placeholder="Who is eligible, restrictions…" />
            </div>
          </div>
        </div>

        {/* Submit */}
        {submitError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {submitError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cc-sage-ink hover:bg-cc-sage-ink/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving…' : 'Create opportunity'}
          </button>
          <Link
            to="/admin/opportunities"
            className="text-sm text-gray-400 hover:text-navy transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
