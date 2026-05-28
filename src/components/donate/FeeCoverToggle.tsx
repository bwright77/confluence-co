import { useId } from 'react'

interface Props {
  checked: boolean
  feeAmount: number | null
  onChange: (checked: boolean) => void
}

export default function FeeCoverToggle({ checked, feeAmount, onChange }: Props) {
  const id = useId()
  const display = feeAmount != null ? feeAmount.toFixed(2) : '0.00'

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-cc-navy/10 bg-cc-warm p-4"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cc-orange"
      />
      <span className="font-body text-sm leading-relaxed text-cc-navy">
        Add ${display} so 100% of my gift reaches the programs.
      </span>
    </label>
  )
}
