import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { areas } from '../data/areas'
import { programs, programsByArea } from '../data/programs'
import ProgramCard from '../components/programs/ProgramCard'
import ProgramFilters, { type ProgramFilterState } from '../components/programs/ProgramFilters'
import { areaColors } from '../components/programs/areaColors'
import type { ProgramStatus } from '../data/types'

const VALID_STATUSES: (ProgramStatus | 'all')[] = ['all', 'active', 'upcoming', 'completed']

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
    document.title = 'Programs · Confluence Colorado'
  }, [])

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return programs.filter((p) => {
      if (filters.status !== 'all' && p.status !== filters.status) return false
      if (filters.areas.length > 0) {
        const matches = filters.areas.some(
          (slug) => p.primaryArea === slug || p.secondaryAreas.includes(slug)
        )
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
      <section className="bg-cc-navy pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-site">
          <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-sky">
            Our Work
          </p>
          <h1 className="heading-display mt-3 text-4xl text-white md:text-6xl md:leading-tight">
            Programs
          </h1>
          <p className="mt-4 max-w-3xl font-body text-lg text-white/85 md:text-xl">
            Specific, named initiatives — each with a community, a place, partners, and a story.
            Filter by focus area or status, or browse the full list below.
          </p>
          <div className="mt-6">
            <a
              href="#focus-areas"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-display text-cc-sky hover:text-white"
            >
              Browse by focus area
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
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
                No programs match these filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 font-display text-sm font-semibold uppercase tracking-display text-cc-sky underline hover:text-cc-navy"
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

      {/* Browse by focus area */}
      <section id="focus-areas" className="bg-cc-warm section-pad">
        <div className="container-site">
          <h2 className="heading-section text-2xl text-cc-navy md:text-3xl">
            Browse by focus area
          </h2>
          <p className="mt-2 max-w-3xl font-body text-cc-stone">
            Focus areas are the categories programs are tagged under. Each program has one primary
            area and may touch on others.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map((area) => {
              const count = programsByArea(area.slug, { includeSecondary: true }).length
              const colors = areaColors(area.colorToken)
              return (
                <Link
                  key={area.slug}
                  to={`/focus-areas/${area.slug}`}
                  className="group flex flex-col rounded-lg border border-cc-stone/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`h-1 w-12 rounded-full ${colors.bg}`} aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-bold text-cc-navy group-hover:text-cc-sky">
                    {area.name}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm text-cc-stone">{area.description}</p>
                  <p className="mt-3 font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
                    {count} {count === 1 ? 'program' : 'programs'}
                  </p>
                </Link>
              )
            })}
          </div>

          <div className="mt-8">
            <Link
              to="/focus-areas"
              className="font-display text-sm font-semibold uppercase tracking-display text-cc-sky hover:text-cc-navy"
            >
              See all focus areas →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
