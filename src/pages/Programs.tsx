import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Handshake, Drop, Leaf, Mountains, Scales, Storefront } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { areas } from '../data/areas'
import { programs, programsByArea } from '../data/programs'
import ProgramCard from '../components/programs/ProgramCard'
import ProgramFilters, { type ProgramFilterState } from '../components/programs/ProgramFilters'
import { areaColors } from '../components/programs/areaColors'
import type { ProgramStatus } from '../data/types'

const VALID_STATUSES: (ProgramStatus | 'all')[] = ['all', 'active', 'completed']

// Program-area icons, matching the home "What We Do" set.
const AREA_ICONS: Record<string, Icon> = {
  'youth-pathways': Handshake,
  'watershed-restoration': Drop,
  'natural-resource-conservation': Leaf,
  'outdoor-recreation-stream': Mountains,
  'civic-engagement': Scales,
  'public-health-urban-agriculture': Storefront,
}

function parseFilters(params: URLSearchParams): ProgramFilterState {
  const areaCsv = params.get('areas') ?? ''
  const statusRaw = params.get('status') ?? 'all'
  const status = (VALID_STATUSES.includes(statusRaw as ProgramStatus | 'all')
    ? statusRaw
    : 'all') as ProgramFilterState['status']
  return {
    areas: areaCsv ? areaCsv.split(',').filter(Boolean) : [],
    status,
    query: params.get('q') ?? '',
  }
}

function serializeFilters(state: ProgramFilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.areas.length > 0) params.set('areas', state.areas.join(','))
  if (state.status !== 'all') params.set('status', state.status)
  if (state.query.trim()) params.set('q', state.query.trim())
  return params
}

export default function Programs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  useEffect(() => {
    document.title = 'Projects · Confluence Colorado'
  }, [])

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return programs.filter((p) => {
      if (filters.status !== 'all' && p.status !== filters.status) return false
      if (filters.areas.length > 0) {
        const matches = filters.areas.some((slug) => p.areas.includes(slug))
        if (!matches) return false
      }
      if (q) {
        const haystack = [
          p.title,
          p.tagline,
          p.shortName,
          p.body,
          p.partners?.join(' '),
          p.funder?.shortName,
          p.funder?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [filters])

  function handleChange(next: ProgramFilterState) {
    setSearchParams(serializeFilters(next), { replace: false })
  }

  function clearAll() {
    setSearchParams(new URLSearchParams(), { replace: false })
  }

  return (
    <>
      {/* Page hero */}
      <section className="relative bg-cc-navy pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden">
        <img
          src="/projects/first-creek/bison-skyline.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-cc-navy/70"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"
          aria-hidden="true"
        />
        <div className="container-site relative">
          <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-sky">
            Our Work
          </p>
          <h1 className="heading-display mt-3 text-4xl text-white md:text-6xl md:leading-tight">
            Projects
          </h1>
          <p className="mt-4 max-w-3xl font-body text-lg text-white/90 md:text-xl">
            Specific, named initiatives — each with a community, a place, partners, and a story.
            We accomplish the goals of each program area by doing projects.
          </p>
        </div>
      </section>

      {/* Browse by program area */}
      <section id="program-areas" className="bg-cc-warm section-pad">
        <div className="container-site">
          <h2 className="heading-section text-2xl text-cc-navy md:text-3xl">
            Browse by program area
          </h2>
          <p className="mt-2 max-w-3xl font-body text-cc-stone">
            Program areas are the six categories we organize our work by. A project can fit into one
            or several of them.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const count = programsByArea(area.slug).length
              const colors = areaColors(area.colorToken)
              const AreaIcon = AREA_ICONS[area.slug]
              return (
                <Link
                  key={area.slug}
                  to={`/program-areas/${area.slug}`}
                  className="group flex flex-col rounded-lg border border-cc-stone/15 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {AreaIcon && (
                    <span
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colors.bgSoft} ${colors.text}`}
                      aria-hidden="true"
                    >
                      <AreaIcon size={24} weight="duotone" />
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold text-cc-navy group-hover:text-cc-sky-ink">
                    {area.name}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm text-cc-stone">{area.description}</p>
                  <p className={`mt-3 font-display text-xs font-semibold uppercase tracking-display ${colors.text}`}>
                    {count} {count === 1 ? 'project' : 'projects'}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filters + project grid */}
      <section className="section-pad">
        <div className="container-site">
          <ProgramFilters
            areas={areas}
            value={filters}
            onChange={handleChange}
            total={programs.length}
            visible={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="mt-12 rounded-lg border border-dashed border-cc-stone/30 bg-cc-warm p-10 text-center">
              <p className="font-display text-lg font-semibold text-cc-navy">
                No projects match these filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 font-display text-sm font-semibold uppercase tracking-display text-cc-sky-ink underline hover:text-cc-navy"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
