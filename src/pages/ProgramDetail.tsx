import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { programBySlug } from '../data/programs'
import ProgramHero from '../components/programs/ProgramHero'
import ProgramMeta from '../components/programs/ProgramMeta'
import ProgramBody from '../components/programs/ProgramBody'
import RelatedPrograms from '../components/programs/RelatedPrograms'

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>()
  const program = slug ? programBySlug[slug] : undefined

  useEffect(() => {
    if (!program) {
      document.title = 'Project not found · Confluence Colorado'
      return
    }
    const title = program.seo?.title ?? `${program.title} · Confluence Colorado`
    document.title = title

    const description =
      program.seo?.description ?? `${program.title} — ${program.tagline}`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [program])

  if (!program) {
    return (
      <section className="section-pad container-site pt-32">
        <h1 className="heading-display text-3xl text-cc-navy md:text-4xl">Project not found</h1>
        <p className="mt-4 font-body text-cc-stone">
          We couldn't find a project with that name.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-block font-display text-sm font-semibold uppercase tracking-display text-cc-sky-ink underline hover:text-cc-navy"
        >
          ← Back to all projects
        </Link>
      </section>
    )
  }

  return (
    <>
      <ProgramHero program={program} />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* On mobile, meta first; on desktop, body left + meta right */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <ProgramBody body={program.body} />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-1">
              <ProgramMeta program={program} />
            </div>
          </div>
        </div>
      </section>

      {program.gallery && program.gallery.length > 0 && (
        <section className="bg-cc-warm section-pad">
          <div className="container-site">
            <h2 className="heading-section text-2xl text-cc-navy md:text-3xl">From the field</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {program.gallery.map((img) => (
                <figure
                  key={img.src}
                  className="overflow-hidden rounded-lg border border-cc-stone/10 bg-white shadow-sm"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {img.alt && (
                    <figcaption className="px-4 py-3 font-body text-xs text-cc-stone">
                      {img.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedPrograms current={program} />

      {/* Footer CTA */}
      <section className="bg-cc-navy section-pad">
        <div className="container-site text-center">
          <h2 className="heading-display text-3xl text-white md:text-4xl">
            Support our work
          </h2>
          <p className="mt-3 font-body text-white/85">
            Every project above is fueled by community. Get involved or contribute today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link to="/donate" className="btn-primary">
              Donate
            </Link>
            <Link to="/get-involved" className="btn-white">
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
