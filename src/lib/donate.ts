// Shared donate constants + fee math.
//
// Imported by BOTH the React app (src/pages/Donate.tsx) and the Vercel
// serverless function (api/create-checkout-session.ts). Keep this file free of
// any Vite-only APIs (import.meta.glob, ?raw imports, etc.) so it bundles
// cleanly in the Node serverless runtime.

export type Frequency = 'one-time' | 'monthly'

export const FREQUENCIES: Frequency[] = ['one-time', 'monthly']

export const MIN_DONATION = 5
export const MAX_DONATION = 50000

export const EIN = '88-1757678'

export const TAX_STATEMENT =
  'Confluence Colorado is a 501(c)(3) tax-exempt organization, EIN 88-1757678. ' +
  'Donations are tax-deductible to the extent allowed by law. No goods or services ' +
  'are provided in exchange for contributions.'

// Stripe nonprofit pricing (2.2% + $0.30). If the negotiated rate moves, this is
// the one place to change it. Amex runs higher (3.5%) but the gross-up can't know
// the card brand pre-payment, so the 2.2% base is used — never under-recovers for
// the common case.
export const FEE_PERCENT = 0.022
export const FEE_FIXED = 0.3

// Suggested amounts differ by frequency.
export const PRESETS: Record<Frequency, number[]> = {
  'one-time': [25, 50, 100, 250, 500],
  monthly: [10, 25, 50, 100],
}

// The amount to gross up to so the org nets `net` dollars after Stripe fees.
export function grossUp(net: number): number {
  return (net + FEE_FIXED) / (1 - FEE_PERCENT)
}

// The dollar add-on shown when the donor opts to cover fees (display value).
export function feeCoverAmount(net: number): number {
  return Math.round((grossUp(net) - net) * 100) / 100
}

// The amount actually charged, in integer cents. When coverFee is true the donor
// pays the grossed-up total; otherwise their chosen amount exactly.
export function chargeCents(net: number, coverFee: boolean): number {
  const gross = coverFee ? grossUp(net) : net
  return Math.round(gross * 100)
}

export function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= MIN_DONATION && amount <= MAX_DONATION
}

export function isValidFrequency(value: unknown): value is Frequency {
  return typeof value === 'string' && (FREQUENCIES as string[]).includes(value)
}

// Impact framing — provisional copy, TODO(Shane): confirm tiers + wording.
// Tiers are matched by "highest threshold ≤ amount"; amounts below the lowest
// threshold (and custom amounts) fall back to the generic line.
interface ImpactTier {
  min: number
  oneTime: string
  monthly: string
}

const IMPACT_TIERS: ImpactTier[] = [
  {
    min: 25,
    oneTime: 'A day on the river for one youth.',
    monthly: 'Sustains a youth’s place on the river all season.',
  },
  {
    min: 50,
    oneTime: 'Native plantings to stabilize a stretch of streambank.',
    monthly: 'Keeps native plantings taking root along the river all year.',
  },
  {
    min: 100,
    oneTime: 'A week of urban farming for a youth crew member.',
    monthly: 'Funds a youth crew member’s urban-farming work month after month.',
  },
  {
    min: 250,
    oneTime: 'Tools and supplies for a restoration crew.',
    monthly: 'Keeps a restoration crew equipped through the season.',
  },
  {
    min: 500,
    oneTime: 'A SPRAY Council field season.',
    monthly: 'Powers SPRAY Council fieldwork every month.',
  },
]

export function impactCopy(amount: number | null, frequency: Frequency): string {
  if (amount == null || !Number.isFinite(amount) || amount < IMPACT_TIERS[0].min) {
    return frequency === 'monthly'
      ? 'Your monthly gift puts youth to work on the land and water all year long.'
      : 'Your gift puts youth to work on the land and water across Denver.'
  }
  let tier = IMPACT_TIERS[0]
  for (const t of IMPACT_TIERS) {
    if (amount >= t.min) tier = t
  }
  return frequency === 'monthly' ? tier.monthly : tier.oneTime
}
