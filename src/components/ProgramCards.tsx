import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Program {
  slug: string
  href: string
  title: string
  tagline: string
  /** WPA poster color — used as illustration background */
  color: string
  accentColor: string
  /** Simple SVG icon path(s) that evoke the program */
  icon: React.ReactNode
}

const PROGRAMS: Program[] = [
  {
    slug: 'pathways',
    href: '/programs/pathways',
    title: 'Pathways',
    tagline: 'Youth/Leadership Development and Workforce Advancement',
    color: '#004667',
    accentColor: '#009dd6',
    icon: (
      <g>
        <path d="M20,80 Q50,60 80,70 Q110,80 140,55 Q170,30 200,45" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="80" r="6" fill="white" opacity="0.7"/>
        <circle cx="200" cy="45" r="6" fill="white"/>
        <circle cx="110" cy="62" r="8" fill="white" opacity="0.9"/>
        <path d="M106,70 Q110,90 114,70" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
    ),
  },
  {
    slug: 'watershed',
    href: '/programs/watershed',
    title: 'Watershed Restoration',
    tagline: 'South Platte River Environmental Restoration',
    color: '#1B3A52',
    accentColor: '#009dd6',
    icon: (
      <g>
        <path d="M20,70 Q50,55 80,70 Q110,85 140,70 Q170,55 200,70" stroke="#009dd6" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M20,85 Q50,70 80,85 Q110,100 140,85 Q170,70 200,85" stroke="#009dd6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
        <ellipse cx="100" cy="55" rx="14" ry="6" fill="white" opacity="0.8"/>
        <path d="M114,55 L122,49 L122,61 Z" fill="white" opacity="0.8"/>
        <path d="M150,30 L150,50 Q150,60 162,60 Q174,60 174,50 L174,30 Z" stroke="white" strokeWidth="2.5" fill="none"/>
        <path d="M147,32 L177,32" stroke="white" strokeWidth="2" opacity="0.7"/>
      </g>
    ),
  },
  {
    slug: 'civic',
    href: '/programs/civic',
    title: 'Civic & Community Engagement',
    tagline: 'No job too small. No job too big.',
    color: '#2C3E50',
    accentColor: '#009dd6',
    icon: (
      <g>
        <circle cx="110" cy="45" r="20" stroke="white" strokeWidth="3" fill="none"/>
        <path d="M90,45 L105,60 L130,35" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30,85 Q60,72 90,80 Q110,85 130,78 Q160,70 190,80" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
        <circle cx="55" cy="78" r="5" fill="white" opacity="0.7"/>
        <circle cx="165" cy="75" r="5" fill="white" opacity="0.7"/>
      </g>
    ),
  },
  {
    slug: 'lgcp',
    href: '/programs/lgcp',
    title: 'Natural Resource Conservation',
    tagline: 'Environmental & Social Resilience',
    color: '#3D5E42',
    accentColor: '#6B8F71',
    icon: (
      <g>
        <ellipse cx="90" cy="48" rx="28" ry="24" fill="white" opacity="0.85"/>
        <rect x="86" y="66" width="8" height="22" fill="white" opacity="0.7"/>
        <path d="M130,88 Q155,65 180,78" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
        <circle cx="155" cy="68" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
        <line x1="155" y1="61" x2="155" y2="50" stroke="white" strokeWidth="2.5"/>
      </g>
    ),
  },
  {
    slug: 'recreation',
    href: '/programs/recreation',
    title: 'Outdoor Recreation',
    tagline: 'Building Relationships Through Nature & STREAM Learning',
    color: '#1B3A4B',
    accentColor: '#009dd6',
    icon: (
      <g>
        <polygon points="110,30 160,90 60,90" fill="white" opacity="0.85"/>
        <polygon points="110,30 130,55 90,55" fill="white" opacity="0.5"/>
        <line x1="160" y1="75" x2="200" y2="45" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse cx="163" cy="78" rx="8" ry="4" fill="white" opacity="0.7" transform="rotate(-35,163,78)"/>
        <ellipse cx="197" cy="42" rx="8" ry="4" fill="white" opacity="0.7" transform="rotate(-35,197,42)"/>
        <circle cx="190" cy="30" r="10" fill="#E8A060" opacity="0.8"/>
      </g>
    ),
  },
  {
    slug: 'mo-betta',
    href: '/programs/mo-betta',
    title: 'Public Health',
    tagline: 'Urban Farming, Agriculture & Community Markets',
    color: '#4A3A0A',
    accentColor: '#b44b00',
    icon: (
      <g>
        <circle cx="170" cy="40" r="16" fill="#E8A060" opacity="0.9"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = angle * Math.PI / 180
          return <line key={i} x1={170 + Math.cos(rad)*20} y1={40 + Math.sin(rad)*20} x2={170 + Math.cos(rad)*26} y2={40 + Math.sin(rad)*26} stroke="#E8A060" strokeWidth="2.5" />
        })}
        <path d="M30,80 Q50,55 70,70 Q90,85 110,60 Q130,35 150,55" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M20,90 H160 V88 H20 Z" fill="white" opacity="0.5"/>
        <path d="M20,88 Q90,78 160,88" stroke="white" strokeWidth="2" fill="none"/>
      </g>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/**
 * Six program cards in a responsive grid.
 * Each card uses a unique WPA-poster color field with an SVG illustration.
 * Hover reveals a slight scale + subtle shadow lift.
 */
export default function ProgramCards() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 })
  const reduced = useReducedMotion()

  return (
    <section
      ref={ref}
      aria-labelledby="programs-heading"
      className="section-pad bg-cc-sand"
    >
      <div className="container-site">
        <div className="text-center mb-12 md:mb-16">
          <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
            What we do
          </p>
          <h2
            id="programs-heading"
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-cc-navy mb-4"
          >
            What We Do
          </h2>
          <p className="font-body text-cc-stone text-base md:text-lg max-w-2xl mx-auto">
            Six programs connecting Denver's youth to land, water, and community —
            building the next generation of environmental and civic leaders.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={reduced ? undefined : containerVariants}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
        >
          {PROGRAMS.map((program) => (
            <motion.div
              key={program.slug}
              variants={reduced ? undefined : cardVariants}
            >
              <Link
                to={program.href}
                className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-sky focus-visible:ring-offset-2"
                aria-label={`${program.title} — ${program.tagline}`}
              >
                {/* Poster illustration area */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: program.color }}
                >
                  {/* Background texture — subtle horizontal lines (WPA style) */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, white, white 1px, transparent 1px, transparent 8px)',
                    }}
                    aria-hidden="true"
                  />

                  {/* SVG icon illustration */}
                  <svg
                    viewBox="0 0 220 120"
                    className="w-44 h-24 transition-transform duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {program.icon}
                  </svg>

                  {/* Accent stripe at bottom of illustration */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: program.accentColor }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card text */}
                <div className="bg-white p-5">
                  <h3 className="font-display font-bold uppercase tracking-display text-cc-navy text-lg mb-1 group-hover:text-cc-sky transition-colors duration-200">
                    {program.title}
                  </h3>
                  <p className="font-body text-cc-stone text-sm leading-relaxed mb-4">
                    {program.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-display font-semibold text-xs uppercase tracking-display text-cc-orange group-hover:gap-3 transition-all duration-200">
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link to="/programs" className="btn-secondary">
            All Programs
          </Link>
        </div>
      </div>
    </section>
  )
}
