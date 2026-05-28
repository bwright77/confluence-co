import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { chargeCents, isValidAmount, isValidFrequency } from '../src/lib/donate'

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

const SUCCESS_URL =
  'https://confluenceco.org/donate/thank-you?session_id={CHECKOUT_SESSION_ID}'
const CANCEL_URL = 'https://confluenceco.org/donate'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body ?? {}) as {
    amount?: unknown
    frequency?: unknown
    coverFee?: unknown
    program?: unknown
  }

  const { amount, frequency, coverFee, program } = body

  if (typeof amount !== 'number' || !isValidAmount(amount)) {
    return res.status(400).json({ error: 'Invalid amount' })
  }
  if (!isValidFrequency(frequency)) {
    return res.status(400).json({ error: 'Invalid frequency' })
  }

  let programSlug = 'general'
  let programTitle: string | null = null
  if (typeof program === 'string' && program.length > 0) {
    if (!PROGRAM_TITLES[program]) {
      return res.status(400).json({ error: 'Unknown program' })
    }
    programSlug = program
    programTitle = PROGRAM_TITLES[program]
  }

  const cover = coverFee === true
  const cents = chargeCents(amount, cover)
  const monthly = frequency === 'monthly'
  const metadata: Stripe.MetadataParam = { program: programSlug, coverFee: String(cover) }

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
                name: programTitle
                  ? `Monthly gift — ${programTitle}`
                  : 'Monthly gift to Confluence Colorado',
              },
            },
            quantity: 1,
          },
        ],
        subscription_data: { metadata },
        metadata,
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
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
                name: programTitle
                  ? `Donation — ${programTitle}`
                  : 'Donation to Confluence Colorado',
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: { metadata },
        metadata,
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
      })
    }

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout-session]', err)
    return res.status(500).json({ error: 'Unable to start checkout' })
  }
}
