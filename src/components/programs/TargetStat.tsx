import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'
import type { Target } from '../../data/types'

interface TargetStatProps {
  target: Target
  accent?: string
}

export default function TargetStat({ target, accent = 'text-cc-sky' }: TargetStatProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const value = useCountUp(target.value, inView)

  const formatted = value.toLocaleString('en-US')

  return (
    <div
      ref={ref}
      className="rounded-lg border border-cc-stone/15 bg-white p-5 shadow-sm"
    >
      <div className={`font-display text-4xl md:text-5xl font-bold leading-none ${accent}`}>
        {formatted}
      </div>
      <div className="mt-2 font-display text-xs uppercase tracking-display text-cc-stone">
        {target.unit}
      </div>
      <div className="mt-1 font-body text-sm text-cc-dark">{target.label}</div>
    </div>
  )
}
