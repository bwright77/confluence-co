import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Handshake,
  Drop,
  Scales,
  Leaf,
  Bicycle,
  Storefront,
} from '@phosphor-icons/react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Program {
  slug: string
  href: string
  title: string
  tagline: string
  color: string
  accentColor: string
  Icon: React.ElementType
  image?: string
  imageAlt?: string
}

const PROGRAMS: Program[] = [
  {
    slug: 'pathways',
    href: '/program-areas/youth-pathways',
    title: 'Pathways',
    tagline: 'Youth/Leadership Development and Workforce Advancement',
    color: '#004667',
    accentColor: '#009dd6',
    Icon: Handshake,
    image: '/projects/first-creek/group-portrait.jpg',
    imageAlt: 'Confluence Colorado youth crew on a log at Rocky Mountain Arsenal',
  },
  {
    slug: 'watershed',
    href: '/program-areas/watershed-restoration',
    title: 'Watershed Restoration',
    tagline: 'South Platte River Environmental Restoration',
    color: '#1B3A52',
    accentColor: '#009dd6',
    Icon: Drop,
    image: '/projects/spray-council/spray-council.jpg',
    imageAlt: 'SPRAY Council members gathered on the South Platte riverbank for a field session',
  },
  {
    slug: 'civic',
    href: '/program-areas/civic-engagement',
    title: 'Community Engagement',
    tagline: 'Community-led decision-making, organizing, and place-based stewardship.',
    color: '#2C3E50',
    accentColor: '#009dd6',
    Icon: Scales,
    image: '/projects/lgcp/community-meeting-circle.jpg',
    imageAlt: 'Swansea residents seated in a wide circle at Lorraine Granado Community Park for a Steering Committee meeting',
  },
  {
    slug: 'lgcp',
    href: '/program-areas/natural-resource-conservation',
    title: 'Natural Resource Conservation',
    tagline: 'Environmental & Social Resilience',
    color: '#3D5E42',
    accentColor: '#6B8F71',
    Icon: Leaf,
    image: '/projects/first-creek/bison-skyline.jpg',
    imageAlt: 'Bison herd grazing at Rocky Mountain Arsenal with the Denver skyline behind',
  },
  {
    slug: 'recreation',
    href: '/program-areas/outdoor-recreation-stream',
    title: 'Outdoor Recreation',
    tagline: 'Building Relationships Through Nature & STREAM Learning',
    color: '#1B3A4B',
    accentColor: '#009dd6',
    Icon: Bicycle,
    image: '/projects/colorado-watershed-project/hero.jpg',
    imageAlt: 'Students in life jackets on a green raft during the Colorado Watershed Project',
  },
  {
    slug: 'mo-betta',
    href: '/program-areas/public-health-urban-agriculture',
    title: 'Public Health',
    tagline: 'Urban Farming, Agriculture & Community Markets',
    color: '#4A3A0A',
    accentColor: '#b44b00',
    Icon: Storefront,
    image: '/projects/mo-betta/greens-seeds.jpg',
    imageAlt: 'Fresh greens and seed packets from Mo Betta Green Marketplace',
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
            Program Areas
          </p>
          <h2
            id="programs-heading"
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-cc-navy mb-4"
          >
            What We Do
          </h2>
          <p className="font-body text-cc-stone text-base md:text-lg max-w-2xl mx-auto">
            Six program areas connecting Denver's youth to land, water, and community —
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
              className="h-full"
            >
              <Link
                to={program.href}
                className="group flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-sky focus-visible:ring-offset-2"
                aria-label={`${program.title} — ${program.tagline}`}
              >
                {/* Poster illustration area */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: program.color }}
                >
                  {program.image ? (
                    <>
                      {/* Background photo */}
                      <img
                        src={program.image}
                        alt={program.imageAlt ?? ''}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Area-color tint to preserve identity + grade the photo */}
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: program.color, opacity: 0.55 }}
                        aria-hidden="true"
                      />
                      {/* Vignette for icon legibility */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    /* Background texture — subtle horizontal lines (WPA style) */
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, white, white 1px, transparent 1px, transparent 8px)',
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Phosphor duotone icon */}
                  <program.Icon
                    weight="duotone"
                    className="relative w-20 h-20 text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  />

                  {/* Accent stripe at bottom of illustration */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: program.accentColor }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card text */}
                <div className="bg-white p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold uppercase tracking-display text-cc-navy text-lg mb-1 group-hover:text-cc-sky transition-colors duration-200">
                    {program.title}
                  </h3>
                  <p className="font-body text-cc-stone text-sm leading-relaxed mb-4 flex-1">
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
          <Link to="/projects" className="btn-secondary">
            Explore Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
