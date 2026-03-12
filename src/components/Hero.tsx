import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'
import heroPhoto from '../assets/field_tested.jpg'

/**
 * Full-viewport photo hero.
 *
 * Background: field_tested.jpg — youth in the field, walking toward camera.
 * Treatment: slight desaturation + deep navy color wash gives a WPA poster quality.
 * Text sits in the bottom third over a dark upward gradient for legibility.
 */
export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden"
      aria-labelledby="hero-heading"
    >

      {/* ── PHOTO ── */}
      <img
        src={heroPhoto}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'saturate(0.72) contrast(1.08)' }}
      />

      {/* Brand tint — deep teal wash for WPA poster quality */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0, 44, 70, 0.32)' }}
        aria-hidden="true"
      />

      {/* Upward gradient — strong dark band at bottom for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to top,',
            'rgba(0,20,35,0.96) 0%,',
            'rgba(0,20,35,0.80) 28%,',
            'rgba(0,20,35,0.40) 55%,',
            'rgba(0,20,35,0.10) 80%,',
            'transparent 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />

      {/* Edge vignette — draws eye to center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,14,24,0.45) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── TEXT — anchored to bottom of frame ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-20 md:pb-28 px-6 z-10"
      >
        <motion.div
          className="max-w-4xl mx-auto text-center w-full"
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-poster text-cc-sky mb-4 md:mb-5">
            Denver, Colorado &nbsp;·&nbsp; Est. 2022
          </p>

          <h1
            id="hero-heading"
            className="font-display font-bold uppercase text-white leading-none mb-5 md:mb-6"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)', letterSpacing: '0.07em' }}
          >
            At the{' '}
            <span style={{ color: '#009dd6' }}>Confluence</span>
            <br />
            <span style={{ fontSize: '0.66em', letterSpacing: '0.12em' }}>
              of People &amp; Place
            </span>
          </h1>

          <p
            className="font-body text-white/80 max-w-xl mx-auto leading-relaxed mb-9 md:mb-11"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)' }}
          >
            Connecting Denver's youth to land, water, and community
            through environmental stewardship and outdoor education.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/programs"
              className="font-display font-bold uppercase tracking-display text-cc-navy bg-white px-8 py-4 rounded text-sm md:text-base transition-all duration-200 hover:bg-cc-sand hover:scale-105 shadow-lg"
            >
              Explore Programs
            </Link>
            <Link
              to="/donate"
              className="font-display font-bold uppercase tracking-display text-white px-8 py-4 rounded text-sm md:text-base transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#b44b00' }}
            >
              Support Our Work
            </Link>
          </div>
        </motion.div>
      </div>


    </section>
  )
}
