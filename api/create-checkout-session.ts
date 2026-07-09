import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { FUNDS, chargeCents, isValidAmount, isValidFrequency, isValidFund } from '../src/lib/donate'
import { rejectIfBlocked } from './_guard'

// Project (a.k.a. "program" in code) slugs → display titles. Hard-coded here
// because the canonical source, src/data/programs.ts, relies on Vite's
// import.meta.glob, which isn't available in the Node serverless runtime. Keep
// in sync with src/content/programs/*.md.
const PROGRAM_TITLES: Record<string, string> = {
  'green-workforce-pathways': 'Green Workforce Pathways',
  'colorado-watershed-project': 'Colorado Watershed Project',
  'first-creek-rocky-mountain-arsenal': 'First Creek Restoration at Rocky Mountain Arsenal',
  lgcp: 'Lorraine Granado Community Park',
  'river-sisters-congreso': 'River Sisters Congreso',
  'spray-council': 'SPRAY Council Plan Implementation',
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-05-27.dahlia',
})

const ORIGIN = 'https://confluenceco.org'
const SUCCESS_URL = `${ORIGIN}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (rejectIfBlocked(req, res)) return

  const body = (req.body ?? {}) as {
    amount?: unknown
    frequency?: unknown
    coverFee?: unknown
    program?: unknown
    fund?: unknown
  }

  const { amount, frequency, coverFee, program, fund } = body

  if (typeof amount !== 'number' || !isValidAmount(amount)) {
    return res.status(400).json({ error: 'Invalid amount' })
  }
  if (!isValidFrequency(frequency)) {
    return res.status(400).json({ error: 'Invalid frequency' })
  }

  const hasProgram = typeof program === 'string' && program.length > 0
  const hasFund = typeof fund === 'string' && fund.length > 0
  // A gift is designated to one thing. Both set means a caller bug; failing loudly
  // beats silently dropping one and misattributing the money.
  if (hasProgram && hasFund) {
    return res.status(400).json({ error: 'Specify either program or fund, not both' })
  }

  let programSlug = 'general'
  let designationTitle: string | null = null
  if (hasProgram) {
    // hasOwnProperty, not a truthiness check on the indexed lookup: PROGRAM_TITLES
    // is a plain literal, so `PROGRAM_TITLES['constructor']` resolves up the
    // prototype chain to a truthy native function and would sail through.
    if (!Object.prototype.hasOwnProperty.call(PROGRAM_TITLES, program)) {
      return res.status(400).json({ error: 'Unknown program' })
    }
    programSlug = program
    designationTitle = PROGRAM_TITLES[program]
  }

  let fundSlug: string | null = null
  if (hasFund) {
    if (!isValidFund(fund)) {
      return res.status(400).json({ error: 'Unknown fund' })
    }
    fundSlug = fund
    designationTitle = FUNDS[fund].title
  }

  const cover = coverFee === true
  const cents = chargeCents(amount, cover)
  const monthly = frequency === 'monthly'
  const metadata: Stripe.MetadataParam = { program: programSlug, coverFee: String(cover) }
  if (fundSlug) metadata.fund = fundSlug

  // A cancelled checkout returns to the page the donor started from.
  const cancelUrl = fundSlug ? `${ORIGIN}/donate/${fundSlug}` : `${ORIGIN}/donate`

  try {
    let session: Stripe.Checkout.Session

    if (monthly) {
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        billing_address_collection: 'auto',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: cents,
              recurring: { interval: 'month' },
              product_data: {
                name: designationTitle
                  ? `Monthly gift — ${designationTitle}`
                  : 'Monthly gift to Confluence Colorado',
              },
            },
            quantity: 1,
          },
        ],
        subscription_data: { metadata },
        metadata,
        success_url: SUCCESS_URL,
        cancel_url: cancelUrl,
      })
    } else {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'donate',
        billing_address_collection: 'auto',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: cents,
              product_data: {
                name: designationTitle
                  ? `Donation — ${designationTitle}`
                  : 'Donation to Confluence Colorado',
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: { metadata },
        metadata,
        success_url: SUCCESS_URL,
        cancel_url: cancelUrl,
      })
    }

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout-session]', err)
    return res.status(500).json({ error: 'Unable to start checkout' })
  }
}
