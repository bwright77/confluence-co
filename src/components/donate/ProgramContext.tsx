import { Leaf } from '@phosphor-icons/react'

interface Props {
  title: string
}

export default function ProgramContext({ title }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-cc-sky/30 bg-cc-sky/5 px-4 py-3">
      <Leaf size={20} weight="fill" aria-hidden="true" className="shrink-0 text-cc-sky-ink" />
      <p className="font-body text-sm text-cc-navy">
        Your gift supports: <span className="font-semibold">{title}</span>
      </p>
    </div>
  )
}
