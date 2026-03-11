import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import heroPhoto from '../assets/shane_pathways.png'

const VALUES = [
  {
    label: 'Move at the Speed of Relationship',
    body: 'Every program, partnership, and project begins with showing up, listening, and building trust over time. Our long-term relationship-building with youth and leaders is one of our greatest strengths. We don\u2019t do drive-by programming.',
  },
  {
    label: 'Place-Based, River-Connected',
    body: 'We are rooted in Denver, the South Platte corridor, and the Front Range, and our work follows the river corridors of the desert Southwest. Our programs are shaped by the specific land, water, communities, and histories of these places \u2014 not by generic models imported from elsewhere.',
  },
  {
    label: 'Youth as Leaders',
    body: 'We don\u2019t just serve youth \u2014 we educate, empower, and employ them. Our SPRAY Council, urban farm crews, and Pathways programs treat young people as decision-makers and stewards. The next generation of conservation and community leaders is already here.',
  },
  {
    label: 'No Job Too Small, No Job Too Big',
    body: 'We pick up trash and clean up alleys. We also work with legislators, raise millions of dollars, and restore rivers. Impact happens at every scale, and we show up for all of it.',
  },
  {
    label: 'At the Confluence',
    body: 'We exist at the meeting point \u2014 of public health and environmental health, of social justice and environmental justice, of city and river, of people and place. Our name is our method: separate forces flowing together into something greater.',
  },
]

export default function About() {
  const [valuesRef, valuesInView] = useInView<HTMLDivElement>({ threshold: 0.05 })
  const [tocRef, tocInView] = useInView<HTMLDivElement>({ threshold: 0.05 })
  const reduced = useReducedMotion()

  return (
    <>
      {/* Page hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img
          src={heroPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.72) contrast(1.08)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0, 44, 70, 0.32)' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,20,35,0.92) 0%, rgba(0,20,35,0.60) 40%, transparent 100%)' }}
        />
        <div className="relative z-10 container-site pb-14 pt-32">
          <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-4">
            About Us
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl mb-6">
            The Confluence of People and Place
          </h1>
          <p className="font-accent italic text-white/70 text-xl md:text-2xl max-w-2xl leading-relaxed">
            "We move at the speed of relationship."
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="section-pad bg-cc-warm">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-4">
                Our Mission
              </p>
              <p className="font-body text-cc-navy text-lg md:text-xl leading-relaxed">
                Confluence Colorado connects people to place through community-based conservation,
                youth development, and environmental restoration in Denver and across the river
                corridors of the Southwestern United States.
              </p>
            </div>
            <div>
              <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-4">
                Our Vision
              </p>
              <p className="font-body text-cc-navy text-lg md:text-xl leading-relaxed">
                A Colorado where every young person has a relationship with the land and water that
                sustains their community — and the skills, agency, and opportunity to steward it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Theory of Change */}
      <section className="section-pad bg-cc-navy text-white" ref={tocRef}>
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-4">
              Theory of Change
            </p>
            <motion.blockquote
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              animate={tocInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="font-accent text-7xl leading-none text-cc-sky/50 mb-2" aria-hidden="true">
                "
              </div>
              <p className="font-accent italic text-white text-xl md:text-2xl leading-relaxed mb-6">
                People protect what they love. To love a place, you must have a relationship with it.
              </p>
              <p className="font-body text-white/70 text-base md:text-lg leading-relaxed">
                Confluence Colorado builds those relationships — through youth employment, watershed
                restoration, urban agriculture, outdoor experiences, and civic engagement — so that
                the communities most affected by environmental injustice become the leaders of
                environmental stewardship.
              </p>
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section-pad bg-cc-warm" aria-labelledby="story-heading">
        <div className="container-site">
          <div className="text-center mb-14">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
              Our Story
            </p>
            <h2
              id="story-heading"
              className="heading-display text-3xl md:text-4xl text-cc-navy max-w-2xl mx-auto"
            >
              15 Years in the Making
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-cc-sky/30" aria-hidden="true" />

            {[
              {
                period: '2009–2018',
                org: 'Groundwork Denver — Green Team',
                body: 'Shane built the Green Team program: paid crews of young environmentalists who take on projects improving Denver\'s urban environment. The Green Team model established the core approach — youth as paid staff, not volunteers; environmental justice as the lens; relationship with land and community as the outcome. During this period, Shane raised over $3 million to build Groundwork Denver\'s Youth, Food, Water, and Natural Resource programs.',
              },
              {
                period: '2018–2022',
                org: 'Lincoln Hills Cares — Career Pathways',
                body: 'Through Wright Adventures, Shane secured over $700,000/yr to build the Career Pathways program for Lincoln Hills Cares, expanding the model to include the SPRAY Council (South Platte River Advisory Youth), urban agriculture through Mo\'Betta Green Marketplace, and connections to Lincoln Hills\' legacy of Black outdoor recreation in Colorado. The Pathways program grew to employ over 50 youth per year.',
              },
              {
                period: '2022–Present',
                org: 'Confluence Colorado',
                body: 'Founded as an independent 501(c)(3), Confluence Colorado brings the full model under one roof: six program areas spanning youth pathways, watershed restoration, natural resource conservation, outdoor recreation, civic engagement, and public health/urban agriculture — rooted in Denver, connected by river corridors, and driven by the belief that people protect what they love.',
              },
            ].map((chapter) => (
              <div key={chapter.period} className="relative pl-12 md:pl-16 pb-12 last:pb-0">
                {/* Timeline dot */}
                <div className="absolute left-2 md:left-4 top-1.5 w-4 h-4 rounded-full bg-cc-sky border-2 border-white shadow-sm" aria-hidden="true" />
                <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs mb-1">
                  {chapter.period}
                </p>
                <h3 className="font-display font-bold text-cc-navy text-lg md:text-xl mb-3">
                  {chapter.org}
                </h3>
                <p className="font-body text-cc-stone text-base leading-relaxed">
                  {chapter.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-white" aria-labelledby="values-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
              What Guides Us
            </p>
            <h2
              id="values-heading"
              className="heading-display text-3xl md:text-4xl text-cc-navy"
            >
              Our Values
            </h2>
          </div>

          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {VALUES.map((value, i) => (
              <motion.div
                key={value.label}
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                animate={valuesInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                className={`border-t-4 border-cc-sky pt-6${i === 4 ? ' md:col-span-2 lg:col-span-1' : ''}`}
              >
                <h3 className="font-display font-bold uppercase tracking-display text-cc-navy text-base mb-3">
                  {value.label}
                </h3>
                <p className="font-body text-cc-stone text-base leading-relaxed">
                  {value.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal + CTA */}
      <section className="section-pad bg-cc-sand">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-4">
              A 501(c)(3) Nonprofit
            </p>
            <h2 className="heading-display text-2xl md:text-3xl text-cc-navy mb-4">
              Transparency &amp; Trust
            </h2>
            <p className="font-body text-cc-stone text-base leading-relaxed mb-4">
              Confluence Colorado is a registered 501(c)(3) nonprofit organization. EIN 88-1757678.
              Your donation may be tax-deductible to the full extent permitted by law.
            </p>
            <p className="font-body text-cc-stone text-sm leading-relaxed mb-8">
              Our programs are built in partnership with Wright Adventures, a consulting practice
              with over 15 years of experience building conservation, youth development, and
              environmental programs across Colorado and the Southwest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about/team" className="btn-primary">
                Meet the Team
              </Link>
              <Link to="/impact" className="btn-secondary">
                See Our Impact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
