import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useCountUp } from '../hooks/useCountUp'
import heroPhoto from '../assets/field_tested_2.jpg'

// TODO: Replace all placeholder values with real impact data from Shane.
// These numbers represent aspirational targets for the organization.

interface StatProps {
  value: number
  suffix: string
  label: string
  description: string
  trigger: boolean
  duration?: number
}

function BigStat({ value, suffix, label, description, trigger, duration }: StatProps) {
  const count = useCountUp(value, trigger, duration)
  return (
    <div className="text-center p-8 border border-cc-sky/20 rounded-lg bg-cc-navy/5">
      <div
        className="font-display font-bold text-cc-navy leading-none mb-2"
        style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)' }}
        aria-label={`${value}${suffix} ${label}`}
      >
        {count}<span className="text-cc-orange">{suffix}</span>
      </div>
      <p className="font-display font-bold uppercase tracking-display text-cc-navy text-sm mb-2">
        {label}
      </p>
      <p className="font-body text-cc-stone text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

const GOALS = [
  {
    area: 'Youth Employment',
    color: '#004667',
    accentColor: '#009dd6',
    headline: '100 youth employed annually',
    body: 'We aim to employ 100 young people per year as paid crew members, field technicians, market workers, and program leaders — not volunteers, but workers earning real wages for real environmental work.',
  },
  {
    area: 'Watershed Restoration',
    color: '#1B3A52',
    accentColor: '#009dd6',
    headline: '50 miles of river corridor restored',
    body: 'Along the South Platte and its tributaries, we envision 50 miles of riparian habitat restored through youth-led planting, invasive species removal, and water quality monitoring.',
  },
  {
    area: 'Urban Agriculture',
    color: '#4A3A0A',
    accentColor: '#b44b00',
    headline: '5 community farms & markets',
    body: 'Expanding Mo\'Betta Greens\' model across Denver\'s underserved neighborhoods — five urban farms operating year-round, supplying fresh produce and nutrition education to communities that need it most.',
  },
  {
    area: 'Natural Resource Conservation',
    color: '#3D5E42',
    accentColor: '#6B8F71',
    headline: '500 acres stewarded',
    body: 'From the Lorraine Granado Community Park to public lands across the Front Range, we\'re working toward 500 acres under active youth stewardship — connected, cared for, and loved.',
  },
  {
    area: 'Civic Engagement',
    color: '#2C3E50',
    accentColor: '#009dd6',
    headline: 'Youth at every table',
    body: 'A SPRAY Council seat at city planning meetings, park board decisions, and environmental policy conversations — ensuring the next generation of Denverites has a voice in the future of their city.',
  },
  {
    area: 'Outdoor Recreation',
    color: '#1B3A4B',
    accentColor: '#009dd6',
    headline: '1,000 youth outdoors per year',
    body: 'Through STREAM learning, bike days, river floats, and wilderness experiences, we want every youth we serve to have at least one transformative outdoor experience that changes how they see the natural world.',
  },
]

export default function Impact() {
  const [statsRef, statsInView] = useInView<HTMLDivElement>({ threshold: 0.1 })
  const [goalsRef, goalsInView] = useInView<HTMLDivElement>({ threshold: 0.05 })
  const reduced = useReducedMotion()

  const STATS = [
    { value: 100,  suffix: '+', label: 'Youth Employed Per Year',      description: 'Paid positions, not volunteer hours.',                           duration: 1600 },
    { value: 50,   suffix: '+', label: 'Miles of River Corridor',      description: 'South Platte and its tributaries.',                              duration: 1400 },
    { value: 5,    suffix: '',  label: 'Community Farms & Markets',    description: 'Urban agriculture across Denver\'s neighborhoods.',               duration: 1000 },
    { value: 500,  suffix: '+', label: 'Acres Stewarded',              description: 'Front Range public lands under active youth care.',               duration: 1800 },
  ]

  return (
    <>
      {/* Page hero */}
      <section className="relative h-[65vh] min-h-[460px] flex items-end overflow-hidden">
        <img
          src={heroPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.72) contrast(1.08)' }}
        />
        {/* Overall wash */}
        <div className="absolute inset-0" style={{ background: 'rgba(0, 44, 70, 0.50)' }} />
        {/* Bottom-up gradient for text */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,20,35,0.95) 0%, rgba(0,20,35,0.65) 35%, transparent 100%)' }}
        />
        {/* Top-down gradient for nav contrast */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,20,35,0.60) 0%, transparent 35%)' }}
        />
        <div className="relative z-10 container-site pb-14">
          <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-4">
            Impact
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl mb-6">
            The Change We're Building Toward
          </h1>
          <p className="font-body text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            These numbers represent our vision — where we're headed and what we believe is possible
            when communities are connected to the land and water they call home.
          </p>
        </div>
      </section>

      {/* Aspirational disclaimer */}
      <section className="bg-cc-orange/10 border-b border-cc-orange/20">
        <div className="container-site py-5">
          <p className="font-body text-cc-navy/70 text-sm leading-relaxed">
            <span className="font-display font-bold uppercase tracking-display text-cc-orange text-xs mr-2">Note</span>
            The goals and numbers on this page reflect our aspirational targets — the impact we are
            working toward. As we grow, we'll update this page with real outcomes data. If you're a
            funder or partner interested in helping us get there,{' '}
            <Link to="/get-involved" className="text-cc-orange underline hover:text-cc-navy transition-colors">
              let's talk
            </Link>.
          </p>
        </div>
      </section>

      {/* Big stats */}
      <section className="section-pad bg-cc-warm" aria-labelledby="stats-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
              By the Numbers
            </p>
            <h2
              id="stats-heading"
              className="heading-display text-3xl md:text-4xl text-cc-navy"
            >
              Our Goals for 2027
            </h2>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STATS.map((stat) => (
              <BigStat key={stat.label} {...stat} trigger={statsInView || reduced} />
            ))}
          </div>
        </div>
      </section>

      {/* Theory of change pullquote */}
      <section className="section-pad bg-cc-navy text-white">
        <div className="container-site max-w-3xl mx-auto text-center">
          <div className="font-accent text-7xl leading-none text-cc-sky/40 mb-2" aria-hidden="true">"</div>
          <p className="font-accent italic text-white text-xl md:text-2xl leading-relaxed mb-6">
            People protect what they love. To love a place, you must have a relationship with it.
          </p>
          <p className="font-body text-white/60 text-base">
            Every metric on this page is downstream of a relationship — between a young person and
            a river, a neighborhood and its soil, a community and the sky above it.
          </p>
        </div>
      </section>

      {/* Program-by-program goals */}
      <section className="section-pad bg-white" aria-labelledby="goals-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
              Program Goals
            </p>
            <h2
              id="goals-heading"
              className="heading-display text-3xl md:text-4xl text-cc-navy max-w-2xl mx-auto"
            >
              What We're Working Toward, Program by Program
            </h2>
          </div>

          <div
            ref={goalsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {GOALS.map((goal, i) => (
              <motion.div
                key={goal.area}
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                animate={goalsInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="rounded-lg overflow-hidden border border-cc-navy/10"
              >
                <div
                  className="px-5 py-3"
                  style={{ backgroundColor: goal.color }}
                >
                  <p className="font-display font-semibold uppercase tracking-poster text-white/60 text-xs">
                    {goal.area}
                  </p>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-display font-bold text-cc-navy text-lg mb-3">
                    {goal.headline}
                  </h3>
                  <p className="font-body text-cc-stone text-sm leading-relaxed">
                    {goal.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-pad bg-cc-dark overflow-hidden">
        {/* Decorative landscape shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 w-full h-full">
            <path fill="#004667" opacity="0.5" d="M0,320 V200 Q200,160 400,180 Q600,200 800,170 Q1000,140 1200,165 Q1340,180 1440,160 V320 Z" />
            <path fill="#009dd6" opacity="0.2" d="M0,320 V250 Q300,225 600,235 Q900,245 1200,230 Q1340,222 1440,225 V320 Z" />
            <path fill="#3D5E42" opacity="0.4" d="M0,320 V275 Q120,265 180,255 L200,238 L220,255 Q320,268 440,260 L460,243 L480,260 Q640,272 800,265 L820,248 L840,265 Q1000,272 1200,265 Q1340,260 1440,262 V320 Z" />
          </svg>
        </div>
        <div className="relative z-10 container-site max-w-2xl mx-auto text-center">
          <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">
            Help Us Get There
          </h2>
          <p className="font-body text-white/60 text-base leading-relaxed mb-8">
            These goals don't happen without investment — in youth, in land, in community. If
            you believe in this work, there are real ways to make it happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate" className="btn-primary">
              Donate
            </Link>
            <Link to="/get-involved" className="bg-transparent text-white font-display font-bold uppercase tracking-display text-sm px-6 py-3 rounded border-2 border-white/50 transition-all duration-200 hover:border-white hover:bg-white/10">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
