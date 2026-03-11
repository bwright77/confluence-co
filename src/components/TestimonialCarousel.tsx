import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Testimonial {
  quote: string
  name: string
  title: string
  /** Initials shown when no photo is available */
  initials: string
  accentColor: string
}

/**
 * TODO: Replace placeholder quotes with verbatim testimonials from the
 * WordPress site (Beverly Grant, Braylen Aldridge, Cam Juarez).
 * Photos to come from Shane — use initials as fallback until then.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Confluence Colorado has created something rare — a space where young people from our community see themselves as stewards of the land and the river. This isn't just programming; it's identity formation.",
    name: 'Beverly Grant',
    title: 'Community Partner',
    initials: 'BG',
    accentColor: '#009dd6',
  },
  {
    quote:
      "I never thought I'd be testing water quality in the South Platte. Now I'm the one teaching other kids how to do it. Confluence showed me that this river is mine to protect.",
    name: 'Braylen Aldridge',
    title: 'SPRAY Council Youth Member',
    initials: 'BA',
    accentColor: '#b44b00',
  },
  {
    quote:
      "The Mo Betta market changed how my neighborhood thinks about food. When youth grow it, harvest it, and sell it — that's real power. That's what Confluence Colorado builds.",
    name: 'Cam Juarez',
    title: 'Program Participant',
    initials: 'CJ',
    accentColor: '#4A6741',
  },
]

const INTERVAL_MS = 6000

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const reduced = useReducedMotion()

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  // Auto-advance — pause when reduced motion is on
  useEffect(() => {
    if (reduced) return
    const id = setInterval(next, INTERVAL_MS)
    return () => clearInterval(id)
  }, [next, reduced])

  const testimonial = TESTIMONIALS[current]

  const variants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir * -40 }),
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section-pad bg-cc-navy relative overflow-hidden"
    >
      {/* Decorative background — subtle waterline SVG */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <path
            fill="white"
            d="M0,400 V250 Q180,210 360,230 Q540,250 720,220 Q900,190 1080,215 Q1260,240 1440,220 V400 Z"
          />
        </svg>
      </div>

      <div className="container-site relative z-10">
        <p
          id="testimonials-heading"
          className="text-center font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-12 md:mb-16"
        >
          Voices from the confluence
        </p>

        <div className="max-w-3xl mx-auto">
          {/* Quote display */}
          <div
            className="relative min-h-[220px] flex items-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={reduced ? undefined : variants}
                initial={reduced ? undefined : 'enter'}
                animate={reduced ? undefined : 'center'}
                exit={reduced ? undefined : 'exit'}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full text-center"
              >
                {/* Opening quote mark */}
                <div
                  className="font-accent text-7xl md:text-8xl leading-none mb-2 -mt-4"
                  style={{ color: testimonial.accentColor }}
                  aria-hidden="true"
                >
                  "
                </div>

                <blockquote>
                  <p className="font-accent italic text-white text-lg md:text-xl lg:text-2xl leading-relaxed mb-8">
                    {testimonial.quote}
                  </p>
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center justify-center gap-4">
                  {/* Avatar — initials placeholder */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm text-white shrink-0"
                    style={{ backgroundColor: testimonial.accentColor }}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div className="text-left">
                    <p className="font-display font-bold uppercase tracking-display text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="font-body text-white/60 text-xs">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="text-white/50 hover:text-white transition-colors p-2"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-cc-sky w-6' : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="text-white/50 hover:text-white transition-colors p-2"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
