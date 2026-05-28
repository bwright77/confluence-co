import { useEffect, useMemo, useRef, useState } from 'react'
import type { Area, ProgramStatus } from '../../data/types'
import { areaColors } from './areaColors'

export interface ProgramFilterState {
  areas: string[]
  status: ProgramStatus | 'all'
  query: string
}

interface ProgramFiltersProps {
  areas: Area[]
  value: ProgramFilterState
  onChange: (next: ProgramFilterState) => void
  total: number
  visible: number
}

const STATUS_OPTIONS: { value: ProgramStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

export default function ProgramFilters({
  areas,
  value,
  onChange,
  total,
  visible,
}: ProgramFiltersProps) {
  const [queryDraft, setQueryDraft] = useState(value.query)
  const debounceRef = useRef<number>(0)

  useEffect(() => {
    setQueryDraft(value.query)
  }, [value.query])

  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      if (queryDraft !== value.query) {
        onChange({ ...value, query: queryDraft })
      }
    }, 200)
    return () => window.clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDraft])

  const isActive = (slug: string) => value.areas.includes(slug)

  function toggleArea(slug: string) {
    onChange({
      ...value,
      areas: isActive(slug) ? value.areas.filter((s) => s !== slug) : [...value.areas, slug],
    })
  }

  function setStatus(status: ProgramStatus | 'all') {
    onChange({ ...value, status })
  }

  function clearAll() {
    onChange({ areas: [], status: 'all', query: '' })
    setQueryDraft('')
  }

  const anyActive = useMemo(
    () => value.areas.length > 0 || value.status !== 'all' || value.query.trim() !== '',
    [value]
  )

  return (
    <div className="rounded-lg border border-cc-stone/15 bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Areas (multi-select pills) */}
        <div>
          <div className="font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Program areas
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {areas.map((area) => {
              const colors = areaColors(area.colorToken)
              const active = isActive(area.slug)
              return (
                <button
                  key={area.slug}
                  type="button"
                  onClick={() => toggleArea(area.slug)}
                  aria-pressed={active}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-display transition-colors ${
                    active
                      ? `${colors.bg} ${colors.textOn} border-transparent`
                      : `bg-white ${colors.text} ${colors.border} hover:bg-cc-warm`
                  }`}
                >
                  {area.shortName}
                </button>
              )
            })}
          </div>
        </div>

        {/* Status (single-select pills) */}
        <div>
          <div className="font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Status
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const active = value.status === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  aria-pressed={active}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-display transition-colors ${
                    active
                      ? 'border-cc-navy bg-cc-navy text-white'
                      : 'border-cc-stone/25 bg-white text-cc-dark hover:border-cc-navy hover:text-cc-navy'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search + result count + clear */}
      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-cc-stone/10 pt-4">
        <div className="flex-1 min-w-[16rem]">
          <label htmlFor="program-search" className="sr-only">
            Search programs
          </label>
          <input
            id="program-search"
            type="search"
            placeholder="Search programs…"
            value={queryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
            className="w-full rounded-md border border-cc-stone/25 bg-white px-3 py-2 font-body text-sm text-cc-dark placeholder:text-cc-stone focus:border-cc-sky focus:outline-none"
          />
        </div>

        <div className="font-body text-sm text-cc-stone">
          <span className="font-semibold text-cc-dark">{visible}</span> of {total}{' '}
          {total === 1 ? 'program' : 'programs'}
        </div>

        {anyActive && (
          <button
            type="button"
            onClick={clearAll}
            className="font-display text-xs font-semibold uppercase tracking-display text-cc-sky hover:text-cc-navy"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
