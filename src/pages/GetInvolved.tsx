import { Link } from 'react-router-dom'
import {
  Handshake,
  HandHeart,
  Briefcase,
  UsersThree,
  ChatCircleText,
  EnvelopeSimple,
  Phone,
  MapPin,
  ArrowRight,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

const EMAIL = 'shane@confluenceco.org'

function mailto(subject: string, body: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

interface Audience {
  icon: Icon
  title: string
  blurb: string
  cta: string
  subject: string
  body: string
}

const AUDIENCES: Audience[] = [
  {
    icon: Handshake,
    title: 'Partner organizations',
    blurb:
      'Schools, agencies, land managers, and community groups — let’s build youth-powered stewardship projects together.',
    cta: 'Start a partnership',
    subject: 'Partnership inquiry — Confluence Colorado',
    body: 'Hi Shane,\n\nI’m reaching out on behalf of [organization]. We’re interested in partnering with Confluence Colorado on [project / idea].\n\nA bit about us:\n\nThanks!',
  },
  {
    icon: HandHeart,
    title: 'Funders & foundations',
    blurb:
      'Invest in paid youth employment, watershed restoration, and community parks across Denver. We’d love to share our impact goals.',
    cta: 'Talk about funding',
    subject: 'Funding & sponsorship — Confluence Colorado',
    body: 'Hi Shane,\n\nI’m interested in learning more about funding or sponsoring Confluence Colorado’s work. Could we set up a time to talk?\n\nAreas of interest:\n\nThank you!',
  },
  {
    icon: Briefcase,
    title: 'Youth looking for work',
    blurb:
      'Ages 14–24: get paid to restore rivers, grow food, and lead in your community. Tell us what you’re into.',
    cta: 'Ask about jobs',
    subject: 'Youth employment — Confluence Colorado',
    body: 'Hi Shane,\n\nMy name is [name] and I’m [age]. I’m interested in paid youth opportunities with Confluence Colorado.\n\nWhat I’m interested in (rivers, farming, parks, etc.):\n\nThanks!',
  },
  {
    icon: UsersThree,
    title: 'Volunteers',
    blurb:
      'Join a planting day, a river cleanup, or a steering committee. Lend your time and your hands.',
    cta: 'Volunteer with us',
    subject: 'Volunteering — Confluence Colorado',
    body: 'Hi Shane,\n\nI’d like to volunteer with Confluence Colorado. Here’s a little about me and the kind of work I’d like to help with:\n\nThanks!',
  },
  {
    icon: ChatCircleText,
    title: 'Something else?',
    blurb:
      'Media, a venue, an idea, a question — whatever brings you here, we’d love to hear from you.',
    cta: 'Get in touch',
    subject: 'Hello from your website — Confluence Colorado',
    body: 'Hi Shane,\n\n',
  },
]

function AudienceCard({ audience }: { audience: Audience }) {
  const Icon = audience.icon
  return (
    <a
      href={mailto(audience.subject, audience.body)}
      className="group flex flex-col rounded-lg border border-cc-navy/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cc-sky/40 hover:shadow-lg"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cc-sky/10 text-cc-sky transition-colors group-hover:bg-cc-sky group-hover:text-white">
        <Icon size={24} weight="bold" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-bold text-cc-navy">{audience.title}</h3>
      <p className="mt-2 flex-grow font-body text-sm leading-relaxed text-cc-stone">
        {audience.blurb}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-display text-cc-orange">
        {audience.cta}
        <ArrowRight
          size={15}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </a>
  )
}

export default function GetInvolved() {
  return (
    <>
      {/* Page hero */}
      <section className="relative flex h-[55vh] min-h-[420px] items-end overflow-hidden">
        <img
          src="/projects/first-creek/group-digging.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ filter: 'saturate(0.72) contrast(1.08)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0, 44, 70, 0.50)' }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,20,35,0.95) 0%, rgba(0,20,35,0.65) 35%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,20,35,0.60) 0%, transparent 35%)',
          }}
        />
        <div className="container-site relative z-10 pb-14">
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-poster text-cc-sky md:text-sm">
            Get Involved
          </p>
          <h1 className="heading-display mb-6 max-w-3xl text-4xl text-white md:text-5xl lg:text-6xl">
            There’s a Place for You at the Confluence
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-white/75 md:text-xl">
            Partners, funders, youth, and volunteers all move this work forward. Tell us how
            you’d like to be part of it — every message reaches Shane directly.
          </p>
        </div>
      </section>

      {/* Audience cards */}
      <section className="section-pad bg-cc-warm" aria-labelledby="ways-heading">
        <div className="container-site">
          <div className="mb-12 text-center">
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-poster text-cc-orange md:text-sm">
              Ways to Connect
            </p>
            <h2 id="ways-heading" className="heading-display text-3xl text-cc-navy md:text-4xl">
              How Would You Like to Get Involved?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <AudienceCard key={audience.title} audience={audience} />
            ))}
          </div>
        </div>
      </section>

      {/* Direct contact */}
      <section className="section-pad bg-white" aria-labelledby="contact-heading">
        <div className="container-site grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-poster text-cc-orange md:text-sm">
              Reach Out Directly
            </p>
            <h2 id="contact-heading" className="heading-display text-3xl text-cc-navy md:text-4xl">
              Prefer to Just Say Hello?
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-cc-stone">
              Email or call Shane Wright, our Executive Director. We read every message and will
              get back to you to set up a conversation about getting involved.
            </p>
          </div>

          <ul className="space-y-4">
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 rounded-lg border border-cc-navy/10 bg-cc-warm p-4 transition-colors hover:border-cc-sky/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cc-sky/10 text-cc-sky">
                  <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
                    Email
                  </span>
                  <span className="font-body text-cc-navy">{EMAIL}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="tel:+13038157613"
                className="flex items-center gap-4 rounded-lg border border-cc-navy/10 bg-cc-warm p-4 transition-colors hover:border-cc-sky/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cc-sky/10 text-cc-sky">
                  <Phone size={20} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
                    Phone
                  </span>
                  <span className="font-body text-cc-navy">(303) 815-7613</span>
                </span>
              </a>
            </li>
            <li>
              <div className="flex items-center gap-4 rounded-lg border border-cc-navy/10 bg-cc-warm p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cc-sky/10 text-cc-sky">
                  <MapPin size={20} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
                    Address
                  </span>
                  <span className="font-body text-cc-navy">3000 Lawrence Street, Denver, CO 80205</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="bg-cc-navy section-pad">
        <div className="container-site max-w-2xl text-center">
          <h2 className="heading-display text-2xl text-white md:text-3xl">
            Or Power the Work Directly
          </h2>
          <p className="mt-3 font-body text-base leading-relaxed text-white/70">
            Not sure where you fit yet? A donation puts youth to work on the land and water right
            now.
          </p>
          <Link to="/donate" className="btn-primary mt-8">
            Donate
          </Link>
        </div>
      </section>
    </>
  )
}
