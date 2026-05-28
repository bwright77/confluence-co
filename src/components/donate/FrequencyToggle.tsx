import type { Frequency } from '../../lib/donate'

const OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'one-time', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
]

interface Props {
  value: Frequency
  onChange: (value: Frequency) => void
}

export default function FrequencyToggle({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Donation frequency"
      className="grid grid-cols-2 gap-2 rounded-lg bg-cc-warm p-1.5"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-4 py-2.5 font-display text-sm font-bold uppercase tracking-display transition-colors ${
              selected
                ? 'bg-cc-navy text-white'
                : 'bg-transparent text-cc-navy hover:bg-cc-navy/10'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
