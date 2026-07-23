import { useEffect } from 'react'
import Hero from '../components/Hero'
import ImpactBar from '../components/ImpactBar'
import ProgramCards from '../components/ProgramCards'
import TestimonialCarousel from '../components/TestimonialCarousel'
import LatestNews from '../components/news/LatestNews'
import CTASection from '../components/CTASection'

export default function Home() {
  useEffect(() => {
    document.title = 'Confluence Colorado — The Confluence of People and Place'
  }, [])

  return (
    <>
      <Hero />
      <ImpactBar />
      <ProgramCards />
      <TestimonialCarousel />
      <LatestNews />
      <CTASection />
    </>
  )
}
