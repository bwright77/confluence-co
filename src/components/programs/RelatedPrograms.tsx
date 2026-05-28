import type { Program } from '../../data/types'
import { programs as allPrograms } from '../../data/programs'
import ProgramCard from './ProgramCard'

interface RelatedProgramsProps {
  current: Program
  limit?: number
}

function score(current: Program, candidate: Program): number {
  if (candidate.slug === current.slug) return -1
  return candidate.areas.filter((slug) => current.areas.includes(slug)).length
}

export default function RelatedPrograms({ current, limit = 3 }: RelatedProgramsProps) {
  const related = allPrograms
    .map((p) => ({ p, s: score(current, p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p)

  if (related.length === 0) return null

  return (
    <section className="bg-cc-warm section-pad">
      <div className="container-site">
        <h2 className="heading-section text-2xl text-cc-navy md:text-3xl">Related programs</h2>
        <p className="mt-2 font-body text-cc-stone">
          Programs that share program areas with {current.shortName}.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProgramCard key={p.slug} program={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
