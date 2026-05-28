import { Sparkle } from '@phosphor-icons/react'
import { impactCopy, type Frequency } from '../../lib/donate'

interface Props {
  amount: number | null
  frequency: Frequency
}

export default function ImpactFraming({ amount, frequency }: Props) {
  return (
    <p
      aria-live="polite"
      className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-cc-sage-ink"
    >
      <Sparkle size={18} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-cc-sage" />
      <span>{impactCopy(amount, frequency)}</span>
    </p>
  )
}
