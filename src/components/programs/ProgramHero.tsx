import { Link } from 'react-router-dom'
import type { Program } from '../../data/types'
import { areaBySlug } from '../../data/areas'
import { areaColors } from './areaColors'
import StatusBadge from './StatusBadge'
import AreaTag from './AreaTag'

interface ProgramHeroProps {
  program: Program
}

export default function ProgramHero({ program }: ProgramHeroProps) {
  const primaryArea = areaBySlug[program.primaryArea]
  const colors = primaryArea ? areaColors(primaryArea.colorToken) : null

  return (
    <section
      className={`relative pt-32 pb-12 md:pt-40 md:pb-16 ${colors?.gradient ?? 'bg-cc-navy'}`}
    >
      {program.heroImage && (
        <>
          {/* Hero photograph */}
          <img
            src={program.heroImage}
            alt={program.heroImageAlt ?? ''}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          {/* Area-color tint to preserve identity */}
          <div
            className={`pointer-events-none absolute inset-0 opacity-60 ${colors?.bg ?? 'bg-cc-navy'}`}
            aria-hidden="true"
          />
          {/* Dark gradient at the bottom for legibility */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"
            aria-hidden="true"
          />
        </>
      )}

      {/* Subtle texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15), transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-body text-sm text-white/80">
            <li>
              <Link to="/programs" className="hover:text-white">
                Programs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-white" aria-current="page">
              {program.shortName}
            </li>
          </ol>
        </nav>

        {/* Status + Primary Area row */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StatusBadge status={program.status} size="md" />
          {primaryArea && <AreaTag area={primaryArea} size="md" variant="solid" />}
        </div>

        <h1 className="heading-display text-4xl text-white md:text-6xl md:leading-tight">
          {program.title}
        </h1>

        <p className="mt-4 max-w-3xl font-accent text-lg italic text-white/90 md:text-xl">
          {program.tagline}
        </p>

        {/* Secondary areas */}
        {program.secondaryAreas.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-display text-xs uppercase tracking-display text-white/70">
              Also tagged:
            </span>
            {program.secondaryAreas.map((slug) => {
              const area = areaBySlug[slug]
              if (!area) return null
              return (
                <Link
                  key={slug}
                  to={`/focus-areas/${area.slug}`}
                  className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-2.5 py-1 font-body text-xs font-medium text-white transition-colors hover:bg-white/20"
                >
                  {area.shortName}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
