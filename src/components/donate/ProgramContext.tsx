import { Leaf } from '@phosphor-icons/react'

interface Props {
  title: string
  /** Fiscal-sponsorship disclosure, when the gift is designated to a fund. */
  note?: string
}

export default function ProgramContext({ title, note }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-cc-sky/30 bg-cc-sky/5 px-4 py-3">
      <Leaf
        size={20}
        weight="fill"
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-cc-sky-ink"
      />
      <div>
        <p className="font-body text-sm text-cc-navy">
          Your gift supports: <span className="font-semibold">{title}</span>
        </p>
        {note && (
          <p className="mt-1.5 font-body text-xs leading-relaxed text-cc-stone">{note}</p>
        )}
      </div>
    </div>
  )
}
