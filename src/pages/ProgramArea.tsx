import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { areaBySlug } from '../data/areas'
import { programsByArea } from '../data/programs'
import { areaColors } from '../components/programs/areaColors'
import ProgramCard from '../components/programs/ProgramCard'

export default function ProgramArea() {
  const { slug } = useParams<{ slug: string }>()
  const area = slug ? areaBySlug[slug] : undefined

  useEffect(() => {
    if (!area) {
      document.title = 'Program area not found · Confluence Colorado'
      return
    }
    document.title = `${area.name} · Confluence Colorado`
  }, [area])

  if (!area) {
    return (
      <section className="section-pad container-site pt-32">
        <h1 className="heading-display text-3xl text-cc-navy md:text-4xl">
          Program area not found
        </h1>
        <Link
          to="/program-areas"
          className="mt-6 inline-block font-display text-sm font-semibold uppercase tracking-display text-cc-sky underline hover:text-cc-navy"
        >
          ← All program areas
        </Link>
      </section>
    )
  }

  const colors = areaColors(area.colorToken)
  const programs = programsByArea(area.slug)

  return (
    <>
      <section className={`relative pt-32 pb-12 md:pt-40 md:pb-20 ${colors.gradient}`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15), transparent 50%)',
          }}
          aria-hidden="true"
        />
        <div className="container-site relative">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-body text-sm text-white/80">
              <li>
                <Link to="/program-areas" className="hover:text-white">
                  Program Areas
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-white" aria-current="page">
                {area.shortName}
              </li>
            </ol>
          </nav>

          <p className="font-display text-xs font-semibold uppercase tracking-poster text-white/85">
            Program Area
          </p>
          <h1 className="heading-display mt-3 text-4xl text-white md:text-6xl md:leading-tight">
            {area.name}
          </h1>
          <p className="mt-4 max-w-3xl font-accent text-lg italic text-white/95 md:text-xl">
            {area.description}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          {programs.length > 0 ? (
            <div>
              <h2 className="heading-section text-2xl text-cc-navy md:text-3xl">
                Projects in {area.shortName}
              </h2>
              <p className="mt-2 max-w-3xl font-body text-cc-stone">
                Projects that fit into this program area.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((p) => (
                  <ProgramCard key={p.slug} program={p} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-cc-stone/30 bg-cc-warm p-10 text-center">
              <p className="font-display text-lg font-semibold text-cc-navy">
                No projects are tagged under {area.shortName} yet.
              </p>
              <Link
                to="/programs"
                className="mt-4 inline-block font-display text-sm font-semibold uppercase tracking-display text-cc-sky underline hover:text-cc-navy"
              >
                See all projects →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
