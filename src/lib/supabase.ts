import type { SupabaseClient } from '@supabase/supabase-js'

// Dynamically import @supabase/supabase-js on first use so the ~100 KB client is
// code-split OUT of the marketing bundle (this repo builds the public site and
// the /admin platform together). It downloads only when a visitor actually
// reaches /login or /admin. The type-only import above is erased at build, so
// nothing here pulls supabase-js into the main chunk. Never throws at import.
let clientPromise: Promise<SupabaseClient> | null = null

/** True when the Supabase env is present. Lets callers degrade gracefully. */
export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

/** Resolve the browser Supabase client, importing + creating it on first call.
 *  Rejects (never throws synchronously, never at import) if the env is unset. */
export function getSupabase(): Promise<SupabaseClient> {
  if (clientPromise) return clientPromise
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !anonKey) {
    return Promise.reject(
      new Error('Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    )
  }
  clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, anonKey)
  )
  return clientPromise
}
