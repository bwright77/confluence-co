import ParallaxHero from '../components/ParallaxHero'
import ImpactBar from '../components/ImpactBar'
import ProgramCards from '../components/ProgramCards'
import TestimonialCarousel from '../components/TestimonialCarousel'
import CTASection from '../components/CTASection'

/**
 * Home page — Phase 1 MVP
 *
 * Section order:
 *  1. ParallaxHero  — full-viewport Colorado landscape + mission statement
 *  2. ImpactBar     — 4 stats with count-up animation
 *  3. ProgramCards  — 6 program cards in responsive grid
 *  4. Testimonials  — rotating carousel (Beverly, Braylen, Cam)
 *  5. CTASection    — dual CTA (Donate / Get Involved) with dusk landscape
 */
export default function Home() {
  return (
    <>
      <ParallaxHero />
      <ImpactBar />
      <ProgramCards />
      <TestimonialCarousel />
      <CTASection />
    </>
  )
}
