import { Link } from 'react-router-dom'
import type { Program } from '../../data/types'
import { areaBySlug } from '../../data/areas'
import { areaColors } from './areaColors'
import StatusBadge from './StatusBadge'

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const primaryArea = areaBySlug[program.primaryArea]
  const colors = primaryArea ? areaColors(primaryArea.colorToken) : null

  return (
    <Link
      to={`/programs/${program.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-cc-stone/15 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl"
      aria-label={`${program.title} — ${program.tagline}`}
    >
      {/* Media band — image or area-colored placeholder */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {program.heroImage ? (
          <img
            src={program.heroImage}
            alt={program.heroImageAlt ?? ''}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`h-full w-full ${colors?.gradient ?? 'bg-cc-navy'}`}
            aria-hidden="true"
          >
            <div className="flex h-full items-center justify-center">
              <div className="font-display text-4xl font-bold uppercase tracking-poster text-white/30">
                {program.shortName}
              </div>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <StatusBadge status={program.status} />
        </div>

        {/* Primary area indicator strip */}
        {primaryArea && colors && (
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} aria-hidden="true" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {primaryArea && colors && (
          <div className="mb-2">
            <span
              className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-1 font-display text-[0.7rem] font-semibold uppercase tracking-display ${colors.bg} ${colors.textOn}`}
            >
              {primaryArea.shortName}
            </span>
          </div>
        )}

        <h3 className="font-display text-xl font-bold text-cc-navy group-hover:text-cc-sky">
          {program.title}
        </h3>

        <p className="mt-2 font-body text-sm text-cc-stone">{program.tagline}</p>

        {/* Secondary areas */}
        {program.secondaryAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {program.secondaryAreas.map((slug) => {
              const area = areaBySlug[slug]
              if (!area) return null
              const sc = areaColors(area.colorToken)
              return (
                <span
                  key={slug}
                  className={`inline-flex items-center rounded-full border bg-white px-2 py-0.5 font-body text-[0.65rem] font-medium ${sc.text} ${sc.border}`}
                >
                  {area.shortName}
                </span>
              )
            })}
          </div>
        )}

        {program.funder && (
          <div className="mt-auto pt-4 font-body text-xs text-cc-stone">
            Funded by{' '}
            <span className="font-semibold text-cc-dark">{program.funder.shortName}</span>
            {' · '}
            <span>{program.funder.amountDisplay}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
