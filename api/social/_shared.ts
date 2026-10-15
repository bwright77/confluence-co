import type { VercelRequest } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Shared helpers for the Facebook → "The current" endpoints. The `_` prefix
// keeps Vercel from routing this file as an endpoint.

export const supabase = createClient(
  process.env.SUPABASE_URL || 'http://placeholder.invalid',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
)

export const IMAGE_BUCKET = 'social-post-images'
export const NEWS_PATH = 'src/content/news.yaml'
export const AREAS_PATH = 'src/content/areas.yaml'

// Returns the names of any required env vars that are unset.
export function missingEnv(names: string[]): string[] {
  return names.filter((n) => !process.env[n])
}

// ── Auth ──────────────────────────────────────────────────────

export async function adminUserId(req: VercelRequest): Promise<string | null> {
  const auth = req.headers.authorization ?? ''
  if (!auth.startsWith('Bearer ')) return null
  const { data: { user } } = await supabase.auth.getUser(auth.slice(7))
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  return profile?.role === 'admin' ? user.id : null
}

export function isCron(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET
  return !!secret && req.headers.authorization === `Bearer ${secret}`
}

// ── GitHub (contents + git data APIs) ─────────────────────────
// GITHUB_REPO is "owner/name"; GITHUB_TOKEN is a fine-grained PAT scoped to
// that one repo with Contents: read & write.

const GH_API = 'https://api.github.com'
export const GH_BRANCH = process.env.GITHUB_BRANCH || 'main'

export async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${GH_API}/repos/${process.env.GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const err = new Error(`GitHub ${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`)
    ;(err as Error & { status: number }).status = res.status
    throw err
  }
  return res.json() as Promise<T>
}

// Reads a text file from the branch head (or a specific commit).
export async function readRepoFile(path: string, ref = GH_BRANCH): Promise<string> {
  const file = await gh<{ content: string; encoding: string }>(
    `/contents/${path}?ref=${encodeURIComponent(ref)}`,
  )
  return Buffer.from(file.content, file.encoding as BufferEncoding).toString('utf8')
}
