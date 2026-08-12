import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { getSupabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Opportunity, GrantType } from '../../lib/adminTypes'

// ── Schema (grant-only; same grant shape as NewOpportunity) ────
const grantSchema = z.object({
  name:              z.string().min(1, 'Name is required'),
  description:       z.string().optional(),
  primary_deadline:  z.string().optional(),
  source_url:        z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  tags:              z.string().optional(),
  funder:            z.string().optional(),
  grant_type:        z.enum(['federal', 'state', 'foundation', 'corporate', 'other']).or(z.literal('')).optional(),
  amount_max:        z.string().optional(),
  amount_requested:  z.string().optional(),
  loi_deadline:      z.string().optional(),
  cfda_number:       z.string().optional(),
  eligibility_notes: z.string().optional(),
})

type GrantForm = z.infer<typeof grantSchema>

// ── Field helpers ─────────────────────────────────────────────
function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-500 mb-1">{children}</label>
}
function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input {...props} className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors ${error ? 'border-red-300' : 'border-gray-200'}`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}
function Textarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <>
      <textarea {...props} rows={3} className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors resize-none ${error ? 'border-red-300' : 'border-gray-200'}`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}
function Select({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <>
      <select {...props} className={`w-full border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-river/20 focus:border-river/40 transition-colors bg-white ${error ? 'border-red-300' : 'border-gray-200'}`}>{children}</select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────
function toDateInput(iso: string | null | undefined): string {
  if (!iso) return ''
  return iso.slice(0, 10) // take YYYY-MM-DD directly — avoids UTC→local shift
}

// ── Main component ────────────────────────────────────────────
export function EditOpportunity() {
  const { id }    = useParams<{ id: string }>()
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Edit opportunity · Confluence Colorado admin'
  }, [])

  const { data: opp, isLoading } = useQuery<Opportunity>({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<GrantForm>({
      resolver: zodResolver(grantSchema),
      values: opp ? buildDefaults(opp) : undefined,
    })

  function buildDefaults(o: Opportunity): GrantForm {
    return {
      name:              o.name,
      description:       o.description ?? '',
      primary_deadline:  toDateInput(o.primary_deadline),
      source_url:        o.source_url ?? '',
      tags:              o.tags.join(', '),
      funder:            o.funder ?? '',
      grant_type:        o.grant_type ?? undefined,
      amount_max:        o.amount_max != null ? String(o.amount_max) : '',
      amount_requested:  o.amount_requested != null ? String(o.amount_requested) : '',
      loi_deadline:      toDateInput(o.loi_deadline),
      cfda_number:       o.cfda_number ?? '',
      eligibility_notes: o.eligibility_notes ?? '',
    }
  }

  async function onSubmit(values: GrantForm) {
    setSubmitError(null)
    const tags = values.tags
      ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []

    const payload: Record<string, unknown> = {
      name:              values.name,
      description:       values.description || null,
      primary_deadline:  values.primary_deadline || null,
      source_url:        values.source_url || null,
      tags,
      funder:            values.funder || null,
      grant_type:        values.grant_type || null,
      amount_max:        values.amount_max ? Number(values.amount_max) : null,
      amount_requested:  values.amount_requested ? Number(values.amount_requested) : null,
      loi_deadline:      values.loi_deadline || null,
      cfda_number:       values.cfda_number || null,
      eligibility_notes: values.eligibility_notes || null,
      updated_at:        new Date().toISOString(),
    }

    const supabase = await getSupabase()
    const { error } = await supabase
      .from('opportunities')
      .update(payload)
      .eq('id', id!)

    if (error) { setSubmitError(error.message); return }

    await supabase.from('activity_log').insert({
      opportunity_id: id,
      actor_id:       user?.id ?? null,
      action:         'opportunity_edited',
      details:        null,
    })

    navigate(`/admin/opportunities/${id}`)
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex justify-center py-20">
        <div className="w-5 h-5 border-2 border-river border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!opp) {
    return <div className="p-4 sm:p-6 lg:p-8 text-sm text-gray-400">Opportunity not found.</div>
  }

  const e = errors as Record<string, { message?: string }>

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <Link
        to={`/admin/opportunities/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        {opp.name}
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-cc-sage-ink">Edit Opportunity</h1>
        <span className="text-xs font-medium px-2 py-0.5 rounded capitalize bg-river-50 text-river">
          {opp.type_id}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core fields */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.08em] mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} placeholder="Opportunity name" error={e.name?.message} />
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
                <Input id="source_url" {...register('source_url')} type="url" placeholder="https://…" error={e.source_url?.message} />
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
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
          <Link to={`/admin/opportunities/${id}`} className="text-sm text-gray-400 hover:text-navy transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default EditOpportunity
