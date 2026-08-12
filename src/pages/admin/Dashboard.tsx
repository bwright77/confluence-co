import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Phase 1 placeholder. Proves the protected route, the layout, and auth wiring
// render end-to-end. Real dashboard content (grant pipeline, discovery, board
// minutes) lands in Phases 2–3.
export default function Dashboard() {
  const { user, profile, configured } = useAuth()

  useEffect(() => {
    document.title = 'Dashboard · Confluence Colorado admin'
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-display text-xs font-semibold uppercase tracking-display text-cc-clay">
        Staff workspace
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-cc-sage-ink">Admin dashboard</h1>
      <p className="mt-2 font-body text-sm text-cc-stone">
        The shell is live. Grant seeking, discovery, and board minutes arrive in the next phases.
      </p>

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-cc-navy/10 bg-white p-4">
          <dt className="font-display text-xs uppercase tracking-display text-cc-stone">
            Signed in as
          </dt>
          <dd className="mt-1 font-body text-sm text-cc-dark">
            {profile?.full_name || user?.email || '—'}
          </dd>
        </div>
        <div className="rounded-lg border border-cc-navy/10 bg-white p-4">
          <dt className="font-display text-xs uppercase tracking-display text-cc-stone">Role</dt>
          <dd className="mt-1 font-body text-sm capitalize text-cc-dark">
            {profile?.role || '—'}
          </dd>
        </div>
      </dl>

      {!configured && (
        <p className="mt-6 rounded-lg bg-cc-orange/10 px-4 py-3 font-body text-sm text-cc-orange">
          Supabase isn’t configured in this environment yet — set the env vars to enable auth.
        </p>
      )}
    </div>
  )
}
