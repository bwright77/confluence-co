import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlass, House, HandHeart, ArrowRight } from '@phosphor-icons/react'
import { OPEN_SEARCH_EVENT } from '../components/UtilityBar'

const QUICK_LINKS = [
  { label: 'Our Projects', href: '/projects' },
  { label: 'About Us', href: '/about' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'News', href: '/news' },
]

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · Confluence Colorado'
  }, [])

  return (
    <section className="section-pad bg-cc-warm pt-32 md:pt-40">
      <div className="container-site max-w-2xl text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-poster text-cc-sky-ink">
          404 — Page not found
        </p>
        <h1 className="heading-display mt-3 text-4xl text-cc-navy md:text-5xl">
          This bend in the river isn&rsquo;t on the map.
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-lg leading-relaxed text-cc-stone">
          The page you&rsquo;re looking for may have moved or never existed. Let&rsquo;s get you
          back on course.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex items-center gap-1.5 btn-primary">
            <House size={18} weight="bold" aria-hidden="true" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
            className="inline-flex items-center gap-1.5 rounded border border-cc-navy/20 bg-white px-5 py-2.5 font-display text-sm font-bold uppercase tracking-display text-cc-navy transition-colors hover:border-cc-navy/40 hover:bg-cc-sand"
          >
            <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
            Search the site
          </button>
          <Link
            to="/donate"
            className="inline-flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-display text-cc-orange hover:text-cc-navy"
          >
            <HandHeart size={18} weight="bold" aria-hidden="true" />
            Donate
          </Link>
        </div>

        <div className="mt-12 border-t border-cc-navy/15 pt-8">
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-display text-cc-stone">
            Or head somewhere useful
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="inline-flex items-center gap-1 font-body text-sm text-cc-sky-ink hover:text-cc-navy"
                >
                  {link.label}
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
