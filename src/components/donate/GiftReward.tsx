import { useId } from 'react'
import { Gift } from '@phosphor-icons/react'
import { TSHIRT_SIZES, deductibleAmount, type GiftTier, type TshirtSize } from '../../lib/donate'

interface Props {
  gift: GiftTier
  size: TshirtSize | ''
  onSizeChange: (size: TshirtSize | '') => void
  declined: boolean
  onDeclineChange: (declined: boolean) => void
}

// The reward attached to a deep-linked gift tier: what you get, the (draft)
// deductible line, an apparel size when needed, and the opt-out.
export default function GiftReward({
  gift,
  size,
  onSizeChange,
  declined,
  onDeclineChange,
}: Props) {
  const sizeId = useId()
  const declineId = useId()
  const deductible = deductibleAmount(gift)

  return (
    <div className="rounded-lg border border-cc-sky/30 bg-cc-sky/5 p-4">
      <div className="flex items-start gap-3">
        <Gift size={20} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-cc-sky-ink" />
        <div className="min-w-0">
          <p className="font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            {declined ? 'Thank-you gift declined' : 'Your thank-you'}
          </p>
          <p className="mt-0.5 font-body text-sm font-semibold text-cc-navy">
            <span className={declined ? 'line-through opacity-60' : ''}>{gift.label}</span>
          </p>
          {!declined && (
            <p className="mt-1 font-body text-xs leading-relaxed text-cc-stone">{gift.blurb}</p>
          )}

          {/* Deductible line — DRAFT figures, pending accountant sign-off. */}
          <p className="mt-2 font-body text-xs leading-relaxed text-cc-navy">
            {declined || gift.tokenGift ? (
              <>100% tax-deductible.</>
            ) : (
              <>
                ≈ ${deductible} tax-deductible · {gift.label.toLowerCase()} FMV ${gift.fmv}
              </>
            )}{' '}
            <span className="text-cc-stone">(draft — pending confirmation)</span>
          </p>
        </div>
      </div>

      {/* Apparel size — required unless the reward is declined. */}
      {gift.apparel && !declined && (
        <div className="mt-4">
          <label
            htmlFor={sizeId}
            className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-display text-cc-stone"
          >
            T-shirt size
          </label>
          <select
            id={sizeId}
            value={size}
            required
            onChange={(e) => onSizeChange(e.target.value as TshirtSize | '')}
            className="w-full rounded-lg border-2 border-cc-navy/15 bg-white px-3 py-2.5 font-body text-sm text-cc-navy outline-none focus:border-cc-orange"
          >
            <option value="" disabled>
              Choose a size…
            </option>
            {TSHIRT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Opt-out — 100% deductible, nothing to ship. */}
      <label
        htmlFor={declineId}
        className="mt-4 flex cursor-pointer items-start gap-3 border-t border-cc-sky/20 pt-3"
      >
        <input
          id={declineId}
          type="checkbox"
          checked={declined}
          onChange={(e) => onDeclineChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cc-orange"
        />
        <span className="font-body text-sm leading-relaxed text-cc-navy">
          I’d rather not receive the thank-you gift — make my gift 100% tax-deductible and
          send nothing to ship.
        </span>
      </label>
    </div>
  )
}
