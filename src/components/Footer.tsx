import { Link } from 'react-router-dom'
import { CCStacked } from './Logo'

const programLinks = [
  { label: 'Youth Pathways', href: '/programs/pathways' },
  { label: 'Watershed Restoration', href: '/programs/watershed' },
  { label: 'Lorraine Granado Park', href: '/programs/lgcp' },
  { label: 'Mo Betta Green', href: '/programs/mo-betta' },
  { label: 'Outdoor Recreation', href: '/programs/recreation' },
  { label: 'Cultural Programs', href: '/programs/cultural' },
]

const orgLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Team & Board', href: '/about/team' },
  { label: 'Impact', href: '/impact' },
  { label: 'News', href: '/news' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Donate', href: '/donate' },
]

export default function Footer() {
  return (
    <footer className="bg-cc-navy text-white" aria-label="Site footer">
      {/* Main footer content */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="Confluence Colorado — home">
              <CCStacked variant="dark" className="h-28 w-auto mb-4" />
            </Link>
            <p className="font-body text-white/70 text-sm leading-relaxed mt-4">
              {/* TODO: Replace with verbatim mission statement from Shane */}
              Building the next generation of environmental stewards by connecting Denver's
              underserved youth to the land, water, and community they call home.
            </p>
          </div>

          {/* Programs links */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-sky mb-4">
              Programs
            </h3>
            <ul className="space-y-2">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Org links */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-sky mb-4">
              Organization
            </h3>
            <ul className="space-y-2">
              {orgLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-sky mb-4">
              Connect
            </h3>
            <address className="not-italic font-body text-sm text-white/70 space-y-1 mb-4">
              <p>3000 Lawrence Street</p>
              <p>Denver, CO 80205</p>
              <p>
                <a href="tel:+13038157613" className="hover:text-white transition-colors">
                  (303) 815-7613
                </a>
              </p>
              <p>
                <a href="mailto:shane@confluenceco.org" className="hover:text-white transition-colors">
                  shane@confluenceco.org
                </a>
              </p>
            </address>

            {/* Social links — placeholders */}
            <div className="flex gap-3 mb-6">
              {[
                { label: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { label: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-cc-sky transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Newsletter signup — Phase 4 will wire to Mailchimp */}
            <form
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="block font-display font-semibold text-xs uppercase tracking-display text-white/70 mb-2">
                Stay in the loop
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cc-sky"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="bg-cc-sky text-white font-display font-bold text-xs uppercase tracking-display px-4 py-2 rounded hover:bg-cc-orange transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © 2026 Confluence Colorado. All rights reserved.{' '}
            {/* TODO: Add EIN once confirmed with Shane */}
            501(c)(3) nonprofit. Your donation may be tax-deductible.
          </p>
          <p className="font-body text-xs text-white/30 italic">
            the confluence of people and place
          </p>
        </div>
      </div>
    </footer>
  )
}
