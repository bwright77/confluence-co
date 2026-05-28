import { useId } from 'react'

interface Props {
  presets: number[]
  amount: number | null
  customText: string
  onSelectPreset: (amount: number) => void
  onCustomChange: (text: string) => void
}

export default function AmountSelector({
  presets,
  amount,
  customText,
  onSelectPreset,
  onCustomChange,
}: Props) {
  const customId = useId()
  const customActive = customText.trim() !== ''

  return (
    <div>
      <div
        role="group"
        aria-label="Suggested amounts"
        className="grid grid-cols-3 gap-2 sm:grid-cols-3"
      >
        {presets.map((preset) => {
          const selected = !customActive && amount === preset
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectPreset(preset)}
              className={`rounded-lg border-2 px-4 py-3 font-display text-lg font-bold transition-colors ${
                selected
                  ? 'border-cc-orange bg-cc-orange text-white'
                  : 'border-cc-navy/15 bg-white text-cc-navy hover:border-cc-orange/60'
              }`}
            >
              ${preset}
            </button>
          )
        })}
      </div>

      <div className="mt-3">
        <label
          htmlFor={customId}
          className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-display text-cc-stone"
        >
          Or enter a custom amount
        </label>
        <div
          className={`flex items-center rounded-lg border-2 bg-white transition-colors focus-within:border-cc-orange ${
            customActive ? 'border-cc-orange' : 'border-cc-navy/15'
          }`}
        >
          <span aria-hidden="true" className="pl-4 font-display text-lg font-bold text-cc-stone">
            $
          </span>
          <input
            id={customId}
            type="number"
            inputMode="decimal"
            min={5}
            step="1"
            placeholder="Custom"
            value={customText}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-full bg-transparent px-2 py-3 font-display text-lg font-bold text-cc-navy outline-none placeholder:font-body placeholder:text-base placeholder:font-normal placeholder:text-cc-stone/60"
          />
        </div>
      </div>
    </div>
  )
}
