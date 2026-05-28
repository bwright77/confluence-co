import { Link } from 'react-router-dom'
import type { Program } from '../../data/types'
import { areaBySlug } from '../../data/areas'
import { areaColors } from './areaColors'
import StatusBadge from './StatusBadge'

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const cardAreas = program.areas.map((slug) => areaBySlug[slug]).filter(Boolean)
  const lead = cardAreas[0]
  const colors = lead ? areaColors(lead.colorToken) : null

  return (
    <Link
      to={`/projects/${program.slug}`}
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

        {/* Area indicator strip */}
        {colors && (
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} aria-hidden="true" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {cardAreas.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {cardAreas.map((area) => {
              const ac = areaColors(area.colorToken)
              return (
                <span
                  key={area.slug}
                  className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-1 font-display text-[0.7rem] font-semibold uppercase tracking-display ${ac.bg} ${ac.textOn}`}
                >
                  {area.shortName}
                </span>
              )
            })}
          </div>
        )}

        <h3 className="font-display text-xl font-bold text-cc-navy group-hover:text-cc-sky-ink">
          {program.title}
        </h3>

        <p className="mt-2 font-body text-sm text-cc-stone">{program.tagline}</p>

        {program.funder && (
          <div className="mt-auto pt-4 font-body text-xs text-cc-stone">
            Funded by{' '}
            <span className="font-semibold text-cc-dark">{program.funder.shortName}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
