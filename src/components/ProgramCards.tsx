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
    title: 'Youth Pathways',
    tagline: 'Career & education opportunities for youth 14–24',
    color: '#004667',
    accentColor: '#009dd6',
    icon: (
      <g>
        {/* Winding path / road icon */}
        <path d="M20,80 Q50,60 80,70 Q110,80 140,55 Q170,30 200,45" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="80" r="6" fill="white" opacity="0.7"/>
        <circle cx="200" cy="45" r="6" fill="white"/>
        {/* Person silhouette */}
        <circle cx="110" cy="62" r="8" fill="white" opacity="0.9"/>
        <path d="M106,70 Q110,90 114,70" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
    ),
  },
  {
    slug: 'watershed',
    href: '/programs/watershed',
    title: 'Watershed Restoration',
    tagline: 'SPRAY Council — restoring the South Platte River',
    color: '#1B3A52',
    accentColor: '#009dd6',
    icon: (
      <g>
        {/* River waves */}
        <path d="M20,70 Q50,55 80,70 Q110,85 140,70 Q170,55 200,70" stroke="#009dd6" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M20,85 Q50,70 80,85 Q110,100 140,85 Q170,70 200,85" stroke="#009dd6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
        {/* Fish */}
        <ellipse cx="100" cy="55" rx="14" ry="6" fill="white" opacity="0.8"/>
        <path d="M114,55 L122,49 L122,61 Z" fill="white" opacity="0.8"/>
        {/* eDNA flask */}
        <path d="M150,30 L150,50 Q150,60 162,60 Q174,60 174,50 L174,30 Z" stroke="white" strokeWidth="2.5" fill="none"/>
        <path d="M147,32 L177,32" stroke="white" strokeWidth="2" opacity="0.7"/>
      </g>
    ),
  },
  {
    slug: 'lgcp',
    href: '/programs/lgcp',
    title: 'Lorraine Granado Park',
    tagline: 'Community-led park restoration in West Denver',
    color: '#3D5E42',
    accentColor: '#6FAB6F',
    icon: (
      <g>
        {/* Park tree */}
        <ellipse cx="90" cy="48" rx="28" ry="24" fill="white" opacity="0.85"/>
        <rect x="86" y="66" width="8" height="22" fill="white" opacity="0.7"/>
        {/* Bench */}
        <rect x="130" y="75" width="50" height="5" rx="2" fill="white" opacity="0.8"/>
        <rect x="136" y="80" width="4" height="10" fill="white" opacity="0.6"/>
        <rect x="172" y="80" width="4" height="10" fill="white" opacity="0.6"/>
        {/* People */}
        <circle cx="148" cy="68" r="5" fill="white" opacity="0.7"/>
        <circle cx="162" cy="68" r="5" fill="white" opacity="0.7"/>
      </g>
    ),
  },
  {
    slug: 'mo-betta',
    href: '/programs/mo-betta',
    title: 'Mo Betta Green',
    tagline: 'Urban farming, community markets & dinner tables',
    color: '#4A3A0A',
    accentColor: '#b44b00',
    icon: (
      <g>
        {/* Sun */}
        <circle cx="170" cy="40" r="16" fill="#E8A060" opacity="0.9"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const r = angle * Math.PI / 180
          return <line key={i} x1={170 + Math.cos(r)*20} y1={40 + Math.sin(r)*20} x2={170 + Math.cos(r)*26} y2={40 + Math.sin(r)*26} stroke="#E8A060" strokeWidth="2.5" />
        })}
        {/* Plant / crop row */}
        <path d="M30,80 Q50,55 70,70 Q90,85 110,60 Q130,35 150,55" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Market stall */}
        <path d="M20,90 H160 V88 H20 Z" fill="white" opacity="0.5"/>
        <path d="M20,88 Q90,78 160,88" stroke="white" strokeWidth="2" fill="none"/>
      </g>
    ),
  },
  {
    slug: 'recreation',
    href: '/programs/recreation',
    title: 'Outdoor Recreation',
    tagline: 'STREAM education & Colorado wilderness experiences',
    color: '#1B3A4B',
    accentColor: '#4A90A4',
    icon: (
      <g>
        {/* Mountain */}
        <polygon points="110,30 160,90 60,90" fill="white" opacity="0.85"/>
        <polygon points="110,30 130,55 90,55" fill="white" opacity="0.5"/>
        {/* Kayak paddle */}
        <line x1="160" y1="75" x2="200" y2="45" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse cx="163" cy="78" rx="8" ry="4" fill="white" opacity="0.7" transform="rotate(-35,163,78)"/>
        <ellipse cx="197" cy="42" rx="8" ry="4" fill="white" opacity="0.7" transform="rotate(-35,197,42)"/>
        {/* Sun */}
        <circle cx="190" cy="30" r="10" fill="#E8A060" opacity="0.8"/>
      </g>
    ),
  },
  {
    slug: 'cultural',
    href: '/programs/cultural',
    title: 'Cultural Programs',
    tagline: 'Sheep herding, Diné traditions & Indigenous stewardship',
    color: '#4A2A0A',
    accentColor: '#b44b00',
    icon: (
      <g>
        {/* Navajo/Diné weaving pattern — simplified loom */}
        <rect x="30" y="25" width="5" height="70" rx="2" fill="white" opacity="0.6"/>
        <rect x="185" y="25" width="5" height="70" rx="2" fill="white" opacity="0.6"/>
        {[30,40,50,60,70,80].map((y, i) => (
          <line key={i} x1="35" y1={y} x2="185" y2={y} stroke="white" strokeWidth={i % 2 === 0 ? "3" : "2"} opacity={i % 2 === 0 ? "0.9" : "0.5"}/>
        ))}
        {/* Diamond pattern */}
        <polygon points="110,45 125,60 110,75 95,60" fill="#b44b00" opacity="0.9"/>
        {/* Sheep silhouette */}
        <ellipse cx="160" cy="82" rx="14" ry="8" fill="white" opacity="0.7"/>
        <circle cx="172" cy="78" r="7" fill="white" opacity="0.7"/>
        <line x1="150" y1="88" x2="148" y2="98" stroke="white" strokeWidth="2.5"/>
        <line x1="156" y1="89" x2="154" y2="99" stroke="white" strokeWidth="2.5"/>
        <line x1="162" y1="89" x2="160" y2="99" stroke="white" strokeWidth="2.5"/>
        <line x1="168" y1="88" x2="166" y2="98" stroke="white" strokeWidth="2.5"/>
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
            Six Ways We Serve
          </h2>
          <p className="font-body text-cc-stone text-base md:text-lg max-w-2xl mx-auto">
            Each program connects youth to Colorado's landscapes, waterways, and
            communities — building stewards for the next generation.
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
