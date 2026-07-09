import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { rejectIfBlocked } from './_guard'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-05-27.dahlia',
})

// Returns only non-sensitive summary fields for the thank-you page. Never expose
// customer PII or payment details to the client.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (rejectIfBlocked(req, res)) return

  const id = req.query.id
  if (typeof id !== 'string' || !id.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid session id' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id)
    return res.status(200).json({
      amount_total: session.amount_total,
      currency: session.currency,
      mode: session.mode,
      program: session.metadata?.program ?? 'general',
      fund: session.metadata?.fund ?? null,
    })
  } catch (err) {
    console.error('[checkout-session]', err)
    return res.status(404).json({ error: 'Session not found' })
  }
}
