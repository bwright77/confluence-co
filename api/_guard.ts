import type { VercelRequest, VercelResponse } from '@vercel/node'

// Shared request guard for the serverless donate endpoints: an Origin allowlist
// plus a best-effort in-memory rate limit. Files in api/ prefixed with `_` are
// ignored by Vercel's routing, so this is a helper, not an endpoint.
//
// Scope/limits — read before relying on this:
//  - The Origin check blocks browser-driven cross-site calls (another site's
//    page POSTing to our endpoint). It does NOT stop a scripted client (curl),
//    which can forge or omit Origin — that's what the rate limit + Stripe Radar
//    are for.
//  - The rate limit is per warm serverless instance (module-scoped Map), so it
//    throttles a burst from one source but isn't a global ceiling across
//    instances. Stripe Radar is the real card-testing/fraud defense; this just
//    raises the cost of casual abuse.

const ALLOWED_ORIGINS = new Set([
  'https://confluenceco.org',
  'https://www.confluenceco.org',
])

function isAllowedOrigin(origin: string | undefined): boolean {
  // Non-browser clients and most same-origin GETs may omit Origin; allow those
  // through and let the rate limit / Stripe Radar handle abuse.
  if (!origin) return true
  if (ALLOWED_ORIGINS.has(origin)) return true
  try {
    const { hostname, protocol } = new URL(origin)
    // Local dev (vercel dev) and Vercel preview deploys.
    if (protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return true
    }
    if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return true
  } catch {
    return false
  }
  return false
}

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 10
const buckets = new Map<string, { count: number; reset: number }>()

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for']
  const raw = Array.isArray(fwd) ? fwd[0] : fwd
  return raw?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(ip)
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    // Opportunistic cleanup so the Map can't grow without bound on a long-lived
    // instance.
    if (buckets.size > 5000) {
      for (const [key, value] of buckets) {
        if (now > value.reset) buckets.delete(key)
      }
    }
    return false
  }
  bucket.count++
  return bucket.count > RATE_MAX
}

// Returns true and sends the response when the request should be rejected;
// returns false to let the handler proceed. Call after the method check.
export function rejectIfBlocked(req: VercelRequest, res: VercelResponse): boolean {
  if (!isAllowedOrigin(req.headers.origin)) {
    res.status(403).json({ error: 'Forbidden' })
    return true
  }
  if (rateLimited(clientIp(req))) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1000)))
    res.status(429).json({ error: 'Too many requests' })
    return true
  }
  return false
}
