import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { areas } from '../data/areas'
import { programsByArea } from '../data/programs'
import { areaColors } from '../components/programs/areaColors'

export default function FocusAreas() {
  useEffect(() => {
    document.title = 'Focus Areas · Confluence Colorado'
  }, [])

  return (
    <>
      <section className="bg-cc-navy pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-site">
          <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-sky">
            How we organize the work
          </p>
          <h1 className="heading-display mt-3 text-4xl text-white md:text-6xl md:leading-tight">
            Focus Areas
          </h1>
          <p className="mt-4 max-w-3xl font-body text-lg text-white/85 md:text-xl">
            Focus areas are the categories we use to tag and group our programs. Every program has
            one primary area and may touch on several others.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const count = programsByArea(area.slug, { includeSecondary: true }).length
              const leadCount = programsByArea(area.slug).length
              const colors = areaColors(area.colorToken)
              return (
                <Link
                  key={area.slug}
                  to={`/focus-areas/${area.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-cc-stone/15 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`h-2 w-full ${colors.bg}`} aria-hidden="true" />
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold text-cc-navy group-hover:text-cc-sky">
                      {area.name}
                    </h2>
                    <p className="mt-2 flex-1 font-body text-sm text-cc-stone">
                      {area.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 font-display text-xs font-semibold uppercase tracking-display">
                      <span className={colors.text}>
                        {leadCount} lead
                      </span>
                      <span className="text-cc-stone">
                        {count} total
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
