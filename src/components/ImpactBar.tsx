import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

interface StatProps {
  value: number
  suffix: string
  label: string
  trigger: boolean
  duration?: number
}

function Stat({ value, suffix, label, trigger, duration }: StatProps) {
  const count = useCountUp(value, trigger, duration)
  return (
    <div className="flex flex-col items-center text-center px-4">
      <span
        className="font-display font-bold text-cc-sky leading-none"
        style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}
        aria-label={`${value}${suffix} ${label}`}
      >
        {count}
        <span className="text-cc-orange">{suffix}</span>
      </span>
      <span className="font-display font-semibold uppercase tracking-display text-white/80 text-sm md:text-base mt-2">
        {label}
      </span>
    </div>
  )
}

/**
 * Dark-background band with 4 animated count-up statistics.
 * Triggers count-up animation when scrolled into view.
 * TODO: Replace placeholder values with real impact data from Shane.
 */
export default function ImpactBar() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.3 })

  const stats = [
    { value: 80, suffix: '+', label: 'Youth Served Annually', duration: 1600 },
    { value: 6,  suffix: '',  label: 'Community Programs',    duration: 1000 },
    { value: 3,  suffix: '',  label: 'Urban Farms',           duration: 1000 },
    { value: 1,  suffix: '',  label: 'River to Restore',      duration: 800  },
  ]

  return (
    <section
      ref={ref}
      aria-label="Impact statistics"
      className="bg-cc-dark py-16 md:py-20"
    >
      <div className="container-site">
        <p className="text-center font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-10 md:mb-12">
          Our impact in 2024–25
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 divide-y-0 divide-white/10 lg:divide-y-0 lg:divide-x">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} trigger={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
