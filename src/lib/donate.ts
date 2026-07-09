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

// Designated funds — money Confluence raises, as fiscal sponsor, for a partner's
// project. Distinct from `program` (a Confluence project of our own): the donor
// gives to Confluence, which holds discretion and control over the funds and
// grants them to the sponsored project. That legal structure is what keeps the
// gift deductible, so `sponsorshipNote` must appear wherever a fund is solicited.
//
// Registry lives here, not in api/, because both the React app and the Node
// serverless function validate against it.
export interface FundContact {
  name: string
  org: string
  email: string
}

export interface Fund {
  slug: string
  title: string
  /** Replaces the generic hero lede on the fund's donate page. */
  heroLede: string
  /** Self-hosted hero background under public/. Never hotlink a partner's site. */
  heroImage: string
  /** Partner's own logo, shown between the hero and the donate card. */
  lockup: {
    /** Mark artwork, in the colourway for a light background. */
    mark: string
    wordmark: string
    subline: string
  }
  /** Required disclosure, rendered above the standard TAX_STATEMENT. */
  sponsorshipNote: string
  /** Fills the "so 100% of my gift reaches ___" fee-cover sentence. */
  beneficiary: string
  /** Frequency the page opens on. */
  defaultFrequency: Frequency
  /** Replaces the shared PRESETS for this fund. */
  presets: Record<Frequency, number[]>
  /** Named for major gifts, partnerships, and sponsorships. */
  contacts: FundContact[]
  // Flat (non-tiered) impact copy. The tiered IMPACT_TIERS below describe
  // Confluence's own river/farm work and would be false on a fund page.
  // TODO(Shane): confirm tiered impact framing with Roy Kady, then tier these.
  impactOneTime: string
  impactMonthly: string
}

export const FUNDS: Record<string, Fund> = {
  'kady-youth-sheep-camp': {
    slug: 'kady-youth-sheep-camp',
    title: 'Kady Youth Sheep Camp',
    heroLede:
      'Your gift supports Diné youth in Teec Nos Pos learning the lifeways of sheep and goats, ' +
      'the land, and the loom.',
    heroImage: '/funds/kady-youth-sheep-camp/hero.jpg',
    lockup: {
      mark: '/funds/kady-youth-sheep-camp/ram-night.svg',
      wordmark: 'Kady Youth Sheep Camp',
      subline: 'Apprenticeship',
    },
    sponsorshipNote:
      'Kady Youth Sheep Camp is a fiscally sponsored project of Confluence Colorado. Your gift is ' +
      'made to Confluence Colorado, which retains discretion and control over all funds and grants ' +
      'them in support of the camp.',
    beneficiary: 'the camp',
    // The camp runs on sustaining support, so the page opens on monthly. One-time
    // presets stay small on purpose — larger single gifts, partnerships, and
    // sponsorships are handled by conversation, not checkout (see `contacts`).
    defaultFrequency: 'monthly',
    presets: {
      monthly: [10, 25, 50, 100],
      'one-time': [10, 25, 50],
    },
    contacts: [
      { name: 'Shane Wright', org: 'Confluence Colorado', email: 'shane@confluenceco.org' },
      { name: 'Roy Kady', org: 'Kady Youth Sheep Camp', email: 'roykady@outlook.com' },
    ],
    impactOneTime: 'Your gift keeps Diné youth at camp — herding, tending the land, and weaving.',
    impactMonthly:
      'Your monthly gift sustains the apprenticeship season after season, so the old songs are ' +
      'learned again.',
  },
}

// hasOwnProperty, not `FUNDS[value] !== undefined` — a plain object literal
// inherits Object.prototype, so an indexed lookup of 'constructor', '__proto__',
// or 'toString' returns a truthy inherited member and would pass validation.
export function isValidFund(value: unknown): value is string {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(FUNDS, value)
}

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

export function impactCopy(amount: number | null, frequency: Frequency, fund?: Fund): string {
  // Fund gifts don't buy Confluence's own river/farm work, so the tiers below
  // don't apply — a sponsored project gets its own flat line.
  if (fund) return frequency === 'monthly' ? fund.impactMonthly : fund.impactOneTime
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
