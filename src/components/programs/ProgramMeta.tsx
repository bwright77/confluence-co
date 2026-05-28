import type { CtaLink, Program } from '../../data/types'
import { useIsSpanish } from '../../hooks/useIsSpanish'
import TargetStat from './TargetStat'

interface ProgramMetaProps {
  program: Program
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-cc-stone/15 pt-4 first:border-t-0 first:pt-0">
      <div className="font-display text-xs uppercase tracking-display text-cc-stone">{label}</div>
      <div className="mt-1 font-body text-sm text-cc-dark">{children}</div>
    </div>
  )
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function ProgramMeta({ program }: ProgramMetaProps) {
  const isSpanish = useIsSpanish()
  const ctaHref = (link: CtaLink) => (isSpanish && link.hrefEs ? link.hrefEs : link.href)
  const hasFunder = !!program.funder
  const hasLocation = !!program.location && (program.location.city || program.location.watershed)
  const hasLeadStaff = !!program.leadStaff && program.leadStaff.length > 0
  const hasPartners = !!program.partners && program.partners.length > 0
  const hasTargets = !!program.targets && program.targets.length > 0

  return (
    <aside className="space-y-6">
      {/* Targets */}
      {hasTargets && (
        <div>
          <h2 className="font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Targets
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {program.targets!.map((t) => (
              <TargetStat key={t.label} target={t} />
            ))}
          </div>
        </div>
      )}

      {/* Funder card */}
      {hasFunder && program.funder && (
        <div className="rounded-lg border border-cc-stone/15 bg-cc-warm p-5">
          <div className="font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Funded by
          </div>
          <div className="mt-2 font-display text-lg font-bold text-cc-navy">
            {program.funder.shortName}
          </div>
          <div className="mt-0.5 font-body text-sm text-cc-stone">{program.funder.name}</div>
          <div className="mt-3 font-body text-sm text-cc-dark">{program.funder.term}</div>
          <div className="mt-2 font-body text-xs text-cc-stone">{program.funder.program}</div>
        </div>
      )}

      {/* Details list */}
      <div className="space-y-4 rounded-lg border border-cc-stone/15 bg-white p-5">
        <MetaItem label="Term">
          {formatDate(program.startDate)}
          {program.endDate ? <> – {formatDate(program.endDate)}</> : <> – Ongoing</>}
        </MetaItem>

        {hasLocation && program.location && (
          <MetaItem label="Location">
            {program.location.city}
            {program.location.neighborhoods.length > 0 && (
              <div className="text-cc-stone">{program.location.neighborhoods.join(', ')}</div>
            )}
            {program.location.watershed && (
              <div className="text-cc-stone">Watershed: {program.location.watershed}</div>
            )}
          </MetaItem>
        )}

        {hasLeadStaff && (
          <MetaItem label="Lead staff">
            <div className="flex flex-wrap gap-1.5">
              {program.leadStaff!.map((slug) => (
                <span
                  key={slug}
                  className="inline-flex items-center rounded-full border border-cc-stone/20 bg-cc-warm px-2.5 py-1 font-body text-xs text-cc-dark"
                >
                  {slug
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ')}
                </span>
              ))}
            </div>
          </MetaItem>
        )}

        {hasPartners && (
          <MetaItem label="Partners">
            <ul className="space-y-1">
              {program.partners!.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </MetaItem>
        )}
      </div>

      {/* CTAs */}
      {program.cta && (program.cta.primary || program.cta.secondary) && (
        <div className="space-y-3">
          {program.cta.primary && (
            <a
              href={ctaHref(program.cta.primary)}
              className="btn-primary block w-full text-center"
            >
              {program.cta.primary.label}
            </a>
          )}
          {program.cta.secondary && (
            <a
              href={ctaHref(program.cta.secondary)}
              className="btn-secondary block w-full text-center"
            >
              {program.cta.secondary.label}
            </a>
          )}
        </div>
      )}
    </aside>
  )
}
