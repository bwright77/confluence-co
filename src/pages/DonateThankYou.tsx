import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, FacebookLogo, XLogo, ArrowRight } from '@phosphor-icons/react'
import { programBySlug } from '../data/programs'

interface SessionSummary {
  amount_total: number | null
  currency: string | null
  mode: string | null
  program: string | null
}

const SHARE_URL = 'https://confluenceco.org'
const SHARE_TEXT = 'I just supported Confluence Colorado — youth restoring rivers, growing food, and caring for parks across Denver.'

function programTitle(slug: string | null): string | null {
  if (!slug || slug === 'general') return null
  return programBySlug[slug]?.title ?? null
}

export default function DonateThankYou() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [summary, setSummary] = useState<SessionSummary | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    fetch(`/api/checkout-session?id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SessionSummary | null) => {
        if (!cancelled) setSummary(data)
      })
      .catch(() => {
        /* Personalization is best-effort; the static message stands on its own. */
      })
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const amount =
    summary?.amount_total != null ? (summary.amount_total / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: (summary.currency ?? 'usd').toUpperCase(),
    }) : null
  const title = programTitle(summary?.program ?? null)
  const monthly = summary?.mode === 'subscription'

  let personalized: string | null = null
  if (amount) {
    const gift = monthly ? `${amount}/month gift` : `${amount} gift`
    personalized = title
      ? `Thank you for your ${gift} to ${title}.`
      : `Thank you for your ${gift}.`
  }

  return (
    <section className="section-pad bg-cc-warm pt-32 md:pt-40">
      <div className="container-site max-w-xl text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cc-orange/10 text-cc-orange">
          <Heart size={32} weight="fill" aria-hidden="true" />
        </span>

        <h1 className="heading-display text-3xl text-cc-navy md:text-4xl">Thank You</h1>

        <p className="mx-auto mt-4 max-w-md font-body text-lg leading-relaxed text-cc-navy" aria-live="polite">
          {personalized ??
            'Your generosity puts youth to work on the land and water across Denver.'}
        </p>

        <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-cc-stone">
          A receipt is on its way to your email. Confluence Colorado is a 501(c)(3); your gift is
          tax-deductible to the extent allowed by law.
        </p>

        <div className="mt-8">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Spread the word
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cc-navy ring-1 ring-cc-navy/15 transition-colors hover:bg-cc-navy hover:text-white"
            >
              <FacebookLogo size={22} weight="fill" aria-hidden="true" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cc-navy ring-1 ring-cc-navy/15 transition-colors hover:bg-cc-navy hover:text-white"
            >
              <XLogo size={22} weight="fill" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/" className="inline-flex items-center gap-1.5 btn-primary">
            Back to home
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
