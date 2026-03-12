import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Dual-CTA section with a dusk parallax landscape background.
 * "Support Our Work" → Donate | "Get Involved" → Volunteer/newsletter
 */
export default function CTASection() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 })
  const reduced = useReducedMotion()

  const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative overflow-hidden py-24 md:py-36"
    >
      {/* Dusk sky gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0D1A2E 0%, #1A2A40 20%, #3A2840 50%, #6A3830 75%, #9A4A35 90%, #B45A40 100%)',
        }}
        aria-hidden="true"
      />

      {/* Dusk landscape layers */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Far mountains — dusk silhouette */}
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full h-full"
        >
          {/* Mountains */}
          <path
            fill="#2A1A30"
            opacity="0.9"
            d="M0,400 V240 Q80,200 150,180 Q240,155 300,130 Q380,100 450,130 Q510,155 560,120 Q630,80 700,105 Q770,130 830,100 Q900,65 970,90 Q1040,115 1110,85 Q1180,55 1250,90 Q1320,125 1380,110 Q1420,100 1440,120 V400 Z"
          />
          {/* Foothills */}
          <path
            fill="#1A1220"
            d="M0,400 V310 Q150,285 300,295 Q450,305 600,285 Q750,265 900,280 Q1050,295 1200,285 Q1320,278 1440,290 V400 Z"
          />
          {/* Treeline */}
          <path
            fill="#0A0C0E"
            d="M0,400 V348 Q200,332 400,342 Q600,352 800,338 Q1000,324 1200,336 Q1340,344 1440,340 V400 Z"
          />
          {/* River — bright amid darkness */}
          <path
            fill="#009dd6"
            opacity="0.5"
            d="M0,400 V385 Q180,375 360,380 Q540,385 720,375 Q900,365 1080,372 Q1260,379 1440,375 V400 Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="container-site relative z-10 text-center">
        <motion.div
          variants={reduced ? undefined : { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-4">
            Join the confluence
          </p>
        </motion.div>

        <motion.h2
          id="cta-heading"
          className="font-display font-bold uppercase text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.06em' }}
          variants={reduced ? undefined : fadeUp}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Be Part of Something
          <br />
          <span className="text-cc-orange">Bigger</span>
        </motion.h2>

        <motion.p
          className="font-body text-white/80 text-base md:text-lg max-w-xl mx-auto mb-10 md:mb-12 leading-relaxed"
          variants={reduced ? undefined : fadeUp}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Whether you give, volunteer, or simply spread the word — every action
          helps us put more youth on the river, in the fields, and in the parks.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
          variants={reduced ? undefined : fadeUp}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/donate"
            className="bg-cc-orange text-white font-display font-bold uppercase tracking-display text-base px-10 py-4 rounded shadow-lg transition-all duration-200 hover:bg-white hover:text-cc-orange hover:shadow-xl hover:scale-105"
          >
            Support Our Work
          </Link>
          <Link
            to="/get-involved"
            className="bg-transparent text-white font-display font-bold uppercase tracking-display text-base px-10 py-4 rounded border-2 border-white/50 transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            Get Involved
          </Link>
        </motion.div>

        {/* Impact framing micro-copy */}
        <motion.p
          className="font-body text-white/70 text-sm mt-8 italic"
          variants={reduced ? undefined : fadeUp}
          initial={reduced ? undefined : 'hidden'}
          animate={inView || reduced ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          $25 puts one youth on the river for a day · $100 funds a week of urban farming ·
          $500 supports a SPRAY Council field season
        </motion.p>
      </div>
    </section>
  )
}
