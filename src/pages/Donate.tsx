import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CircleNotch } from '@phosphor-icons/react'
import {
  PRESETS,
  GIFTS,
  EIN,
  TAX_STATEMENT,
  feeCoverAmount,
  isValidAmount,
  isValidGift,
  type Frequency,
  type Fund,
  type TshirtSize,
} from '../lib/donate'
import { getProgram } from '../data/programs'
import FrequencyToggle from '../components/donate/FrequencyToggle'
import AmountSelector from '../components/donate/AmountSelector'
import FeeCoverToggle from '../components/donate/FeeCoverToggle'
import ImpactFraming from '../components/donate/ImpactFraming'
import ProgramContext from '../components/donate/ProgramContext'
import MajorGiftNote from '../components/donate/MajorGiftNote'
import FundLockup from '../components/donate/FundLockup'
import GiftReward from '../components/donate/GiftReward'

function formatUSD(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
}

interface Props {
  /** Set by the route for a designated-fund page (e.g. /donate/kady-youth-sheep-camp). */
  fund?: Fund
}

export default function Donate({ fund }: Props) {
  const [params] = useSearchParams()
  // A fund page ignores ?program= — a gift is designated to one thing, and the
  // API rejects both being set.
  const programSlug = fund ? null : params.get('program')
  const program = programSlug ? getProgram(programSlug) : undefined

  // A fund's own site can deep-link a thank-you tier with ?gift=<id>. It only
  // applies on that fund's page, so guard on both validity and fund match.
  const giftId = params.get('gift')
  const gift =
    fund && giftId && isValidGift(giftId) && GIFTS[giftId].fund === fund.slug
      ? GIFTS[giftId]
      : undefined

  useEffect(() => {
    document.title = fund
      ? `Donate to ${fund.title} · Confluence Colorado`
      : 'Donate · Confluence Colorado'
  }, [fund])

  // A fund can lead with monthly and offer its own (smaller) preset ladder.
  const presetTable = fund?.presets ?? PRESETS
  // A thank-you gift is a fixed, one-time tier; it overrides the fund default.
  const initialFrequency: Frequency = gift ? 'one-time' : (fund?.defaultFrequency ?? 'one-time')

  const [frequency, setFrequency] = useState<Frequency>(initialFrequency)
  const [amount, setAmount] = useState<number | null>(
    gift ? gift.amount : presetTable[initialFrequency][1]
  )
  const [customText, setCustomText] = useState('')
  const [coverFee, setCoverFee] = useState(false)
  const [size, setSize] = useState<TshirtSize | ''>('')
  const [declined, setDeclined] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const presets = presetTable[frequency]
  const validAmount = amount != null && isValidAmount(amount)
  const feeAmount = validAmount ? feeCoverAmount(amount) : null

  const total = useMemo(() => {
    if (!validAmount) return null
    return coverFee && feeAmount != null ? amount + feeAmount : amount
  }, [validAmount, coverFee, feeAmount, amount])

  function handleFrequencyChange(next: Frequency) {
    setFrequency(next)
    setCustomText('')
    setAmount(presetTable[next][1] ?? presetTable[next][0])
  }

  function handleSelectPreset(value: number) {
    setCustomText('')
    setAmount(value)
  }

  function handleCustomChange(text: string) {
    setCustomText(text)
    const parsed = parseFloat(text)
    setAmount(text.trim() !== '' && Number.isFinite(parsed) ? parsed : null)
  }

  const needsSize = gift?.apparel === true && !declined

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (amount == null || !isValidAmount(amount)) {
      setError('Please choose an amount of at least $5.')
      return
    }
    if (needsSize && size === '') {
      setError('Please choose a t-shirt size.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          frequency,
          coverFee,
          program: program?.slug,
          fund: fund?.slug,
          gift: gift?.id,
          size: needsSize ? size : undefined,
          declineReward: gift ? declined : undefined,
        }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = (await res.json()) as { url?: string }
      if (!data.url) throw new Error('No checkout URL returned')
      window.location.assign(data.url)
    } catch {
      setLoading(false)
      setError('Something went wrong starting your donation. Please try again.')
    }
  }

  const buttonLabel =
    total != null
      ? frequency === 'monthly'
        ? `Give ${formatUSD(total)}/month`
        : `Donate ${formatUSD(total)}`
      : 'Donate'

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <img
          src={fund?.heroImage ?? '/projects/mo-betta/greens-seeds.jpg'}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ filter: 'saturate(0.9) contrast(1.04)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0, 44, 70, 0.58)' }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,20,35,0.60) 0%, rgba(0,20,35,0.28) 50%, rgba(0,20,35,0.60) 100%)',
          }}
        />
        <div className="container-site relative z-10 max-w-3xl text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-poster text-cc-sky-bright md:text-sm">
            Support the Work
          </p>
          <h1 className="heading-display text-4xl text-white md:text-5xl">Donate</h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg leading-relaxed text-white/85">
            {fund?.heroLede ??
              'Your gift puts youth to work restoring rivers, growing food, and caring for parks across Denver. Every dollar stays close to home.'}
          </p>
        </div>
      </section>

      {/* Donate form */}
      <section className="section-pad bg-cc-warm">
        <div className="container-site max-w-xl">
          {fund && (
            <div className="mb-10">
              <FundLockup lockup={fund.lockup} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-cc-navy/10 md:p-8"
            aria-label="Make a donation"
          >
            {(fund || program) && (
              <div className="mb-6">
                <ProgramContext
                  title={fund?.title ?? program!.title}
                  note={fund?.sponsorshipNote}
                />
              </div>
            )}

            {/* Frequency — a thank-you gift is a one-time tier, so hide it. */}
            {!gift && (
              <div className="mb-6">
                <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-display text-cc-navy">
                  Frequency
                </h2>
                <FrequencyToggle value={frequency} onChange={handleFrequencyChange} />
              </div>
            )}

            <div className="mb-5">
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-display text-cc-navy">
                Amount
              </h2>
              {gift ? (
                <div className="rounded-lg border-2 border-cc-orange bg-cc-orange/5 px-4 py-3">
                  <span className="font-display text-lg font-bold text-cc-navy">
                    ${gift.amount}
                  </span>
                  <span className="ml-2 font-body text-sm text-cc-stone">· one-time gift</span>
                </div>
              ) : (
                <AmountSelector
                  presets={presets}
                  amount={amount}
                  customText={customText}
                  onSelectPreset={handleSelectPreset}
                  onCustomChange={handleCustomChange}
                />
              )}
            </div>

            {gift && (
              <div className="mb-6">
                <GiftReward
                  gift={gift}
                  size={size}
                  onSizeChange={setSize}
                  declined={declined}
                  onDeclineChange={setDeclined}
                />
              </div>
            )}

            <div className="mb-6 rounded-lg bg-cc-sage/5 px-4 py-3">
              <ImpactFraming
                amount={validAmount ? amount : null}
                frequency={frequency}
                fund={fund}
              />
            </div>

            <div className="mb-6">
              <FeeCoverToggle
                checked={coverFee}
                feeAmount={feeAmount}
                onChange={setCoverFee}
                beneficiary={fund?.beneficiary}
              />
            </div>

            {fund && fund.contacts.length > 0 && (
              <div className="mb-6">
                <MajorGiftNote contacts={fund.contacts} />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-cc-orange/10 px-4 py-3 font-body text-sm text-cc-orange"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !validAmount}
              aria-busy={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cc-orange px-6 py-4 font-display text-base font-bold uppercase tracking-display text-white transition-all duration-200 hover:bg-cc-navy focus-visible:bg-cc-navy disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cc-orange"
            >
              {loading && (
                <CircleNotch size={20} weight="bold" aria-hidden="true" className="animate-spin" />
              )}
              {loading ? 'Redirecting…' : buttonLabel}
            </button>

            <p className="mt-4 text-center font-body text-xs leading-relaxed text-cc-stone">
              You’ll be redirected to our secure Stripe checkout to complete your gift.
            </p>
          </form>

          {/* Tax-deductibility statement. With a thank-you gift attached, the
              generic "no goods provided" line is false — swap in wording that
              matches the reward: quid-pro-quo for a valued item, safe-harbor for
              a low-cost token gift. Declined (or no gift) keeps the standard line. */}
          <div className="mx-auto mt-8 max-w-lg text-center">
            <p className="font-body text-xs leading-relaxed text-cc-stone">
              {gift && !declined
                ? gift.tokenGift
                  ? 'Confluence Colorado is a 501(c)(3) tax-exempt organization, EIN 88-1757678. ' +
                    'Your thank-you is a low-cost item, so your contribution remains fully ' +
                    'tax-deductible. Kady Youth Sheep Camp is a fiscally sponsored project of ' +
                    'Confluence Colorado.'
                  : 'Confluence Colorado is a 501(c)(3) tax-exempt organization, EIN 88-1757678. ' +
                    'Because you receive a thank-you gift, only the portion of your gift above the ' +
                    'gift’s fair market value is tax-deductible. Kady Youth Sheep Camp is a fiscally ' +
                    'sponsored project of Confluence Colorado.'
                : TAX_STATEMENT}
            </p>
            <p className="mt-2 font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
              EIN {EIN}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
