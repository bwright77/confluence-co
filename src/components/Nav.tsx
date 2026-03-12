import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CCBug } from './Logo'

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

const NAV_LINKS: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Team & Board', href: '/about/team' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'Pathways', href: '/programs/pathways' },
      { label: 'Watershed Restoration', href: '/programs/watershed' },
      { label: 'Civic & Community Engagement', href: '/programs/civic' },
      { label: 'Natural Resource Conservation', href: '/programs/lgcp' },
      { label: 'Outdoor Recreation', href: '/programs/recreation' },
      { label: "Public Health", href: '/programs/mo-betta' },
    ],
  },
  { label: 'Impact', href: '/impact' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'News', href: '/news' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const location = useLocation()
  const isHome = ['/', '/about', '/impact'].includes(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navBg = scrolled || !isHome
    ? 'bg-cc-navy shadow-lg'
    : 'bg-transparent'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <nav
          className="container-site flex items-center justify-between h-20 lg:h-24"
          aria-label="Main navigation"
        >
          {/* Logo — oversized bug mark + bold wordmark in HTML (readable at all sizes) */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Confluence Colorado — home">
            <CCBug variant="dark" className="h-12 w-12 md:h-14 md:w-14 shrink-0" />
            <div className="leading-none">
              <div className="font-display font-bold uppercase text-white tracking-wide"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', letterSpacing: '0.06em' }}>
                Confluence
              </div>
              <div className="font-display font-semibold uppercase text-cc-sky tracking-widest"
                style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)', letterSpacing: '0.2em' }}>
                Colorado
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(link.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    className="flex items-center gap-1 text-white font-display font-semibold text-sm uppercase tracking-display hover:text-cc-sky transition-colors"
                    aria-expanded={openMenu === link.label}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${openMenu === link.label ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {openMenu === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-cc-navy border border-white/10 rounded shadow-2xl overflow-hidden">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive }) =>
                            `block px-4 py-3 font-body text-sm transition-colors border-l-2 ${
                              isActive
                                ? 'text-cc-sky border-cc-sky bg-white/5'
                                : 'text-white/90 border-transparent hover:text-cc-sky hover:border-cc-sky hover:bg-white/5'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={({ isActive }) =>
                    `font-display font-semibold text-sm uppercase tracking-display transition-colors ${
                      isActive ? 'text-cc-sky' : 'text-white hover:text-cc-sky'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}

            <Link
              to="/donate"
              className="ml-2 bg-cc-orange text-white font-display font-bold text-sm uppercase tracking-display px-5 py-2.5 rounded transition-all duration-200 hover:bg-white hover:text-cc-orange hover:shadow-lg"
            >
              Donate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white p-2 -mr-2"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-cc-dark transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Decorative landscape background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg
            viewBox="0 0 375 812"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full"
          >
            <path fill="#004667" opacity="0.6" d="M0,812 V550 Q80,510 160,490 Q240,470 300,510 Q340,540 375,520 V812 Z" />
            <path fill="#009dd6" opacity="0.3" d="M0,812 V650 Q100,620 200,630 Q300,640 375,625 V812 Z" />
            <path fill="#4A6741" opacity="0.5" d="M0,812 V705 Q100,692 200,700 Q300,708 375,698 V812 Z" />
          </svg>
        </div>

        {/* Menu header */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <Link to="/" aria-label="Confluence Colorado — home">
            <CCBug variant="dark" className="h-10 w-10" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white p-2"
            aria-label="Close navigation menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu links */}
        <nav className="relative z-10 flex flex-col items-center justify-center gap-6 pt-8" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `font-display font-bold text-3xl uppercase tracking-wide transition-colors ${
                  isActive ? 'text-cc-sky' : 'text-white hover:text-cc-sky'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/donate"
            className="mt-4 bg-cc-orange text-white font-display font-bold text-xl uppercase tracking-display px-10 py-4 rounded transition-colors hover:bg-white hover:text-cc-orange"
          >
            Donate
          </Link>
        </nav>

        {/* Tagline at bottom */}
        <p className="absolute bottom-10 left-0 right-0 text-center font-body text-white/50 text-sm italic">
          the confluence of people and place
        </p>
      </div>
    </>
  )
}
