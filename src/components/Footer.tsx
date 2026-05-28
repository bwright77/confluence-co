import { Link } from 'react-router-dom'
import { CCBug } from './Logo'

import { programs as activePrograms } from '../data/programs'

const projectLinks = [
  { label: 'All Projects', href: '/programs' },
  ...activePrograms
    .filter((p) => p.status === 'active')
    .map((p) => ({ label: p.shortName, href: `/programs/${p.slug}` })),
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
    <footer className="bg-cc-sand text-cc-navy" aria-label="Site footer">
      {/* Main footer content */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-3 mb-5"
              aria-label="Confluence Colorado — home"
            >
              <CCBug variant="light" className="h-14 w-14 shrink-0" />
              <div className="leading-none">
                <div
                  className="font-display font-bold uppercase text-cc-navy tracking-wide"
                  style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', letterSpacing: '0.06em' }}
                >
                  Confluence
                </div>
                <div
                  className="font-display font-semibold uppercase text-cc-sky tracking-widest"
                  style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)', letterSpacing: '0.2em' }}
                >
                  Colorado
                </div>
              </div>
            </Link>
            <p className="font-body text-cc-navy/65 text-sm leading-relaxed">
              {/* TODO: Replace with verbatim mission statement from Shane */}
              Building the next generation of environmental stewards by connecting Denver's
              youth to the land, water, and community they call home.
            </p>
          </div>

          {/* Projects links */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-navy mb-4">
              Projects
            </h3>
            <ul className="space-y-2">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-cc-navy/60 hover:text-cc-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Org links */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-navy mb-4">
              Organization
            </h3>
            <ul className="space-y-2">
              {orgLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-cc-navy/60 hover:text-cc-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-poster text-cc-navy mb-4">
              Connect
            </h3>
            <address className="not-italic font-body text-sm text-cc-navy/60 space-y-1 mb-4">
              <p>3000 Lawrence Street</p>
              <p>Denver, CO 80205</p>
              <p>
                <a href="tel:+13038157613" className="hover:text-cc-navy transition-colors">
                  (303) 815-7613
                </a>
              </p>
              <p>
                <a href="mailto:shane@confluenceco.org" className="hover:text-cc-navy transition-colors">
                  shane@confluenceco.org
                </a>
              </p>
            </address>

            {/* Social links */}
            <div className="flex gap-3 mb-6">
              {[
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/coloradoconfluence/',
                  icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/profile.php?id=61573593181872',
                  icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Confluence Colorado on ${social.label}`}
                  className="w-9 h-9 flex items-center justify-center text-cc-navy/50 hover:text-cc-sky transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cc-navy/15">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cc-navy/45">
            © 2026 Confluence Colorado. All rights reserved.{' '}
            EIN 88-1757678 · 501(c)(3) nonprofit · Your donation may be tax-deductible.
          </p>
          <p className="font-body text-xs text-cc-navy/35 italic">
            the confluence of people and place
          </p>
        </div>
      </div>
    </footer>
  )
}
