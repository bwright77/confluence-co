import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { CCBug } from '../Logo'

// The site's own logo treatment: the oversized bug mark + a bold HTML wordmark
// (the SVG lockup's text is unreadable at this size). Mirrors Nav.tsx.
function Wordmark() {
  return (
    <div className="flex items-center gap-2.5" translate="no">
      <CCBug variant="dark" className="h-9 w-9 shrink-0" />
      <div className="leading-none">
        <div
          className="font-display text-base font-bold uppercase text-white"
          style={{ letterSpacing: '0.06em' }}
        >
          Confluence
        </div>
        <div
          className="font-display text-[0.65rem] font-semibold uppercase text-cc-sky"
          style={{ letterSpacing: '0.2em' }}
        >
          Colorado
        </div>
      </div>
    </div>
  )
}

// Phase 1 ships the shell with a single Dashboard destination. Opportunities,
// Tasks, Analytics, Board Minutes, Team, and Settings arrive with their features
// in later phases — adding nav entries now would just link to 404s.
const NAV_ITEMS = [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }]

export function AdminLayout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const displayName = profile?.full_name || user?.email || ''
  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  function NavItems({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cc-sage/25 text-white'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-cc-warm lg:flex-row">
      {/* Mobile top bar */}
      <header className="flex shrink-0 items-center justify-between bg-admin-chrome px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1.5 text-white/60 transition-colors hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Wordmark />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cc-clay/50 text-xs font-semibold text-white">
          {initials}
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 transform flex-col bg-admin-chrome transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:w-60 lg:translate-x-0 lg:flex`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Wordmark />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <NavItems onNavigate={() => setSidebarOpen(false)} />
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-clay/50 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{displayName}</p>
              {profile?.role && (
                <p className="text-[0.7rem] capitalize text-white/40">{profile.role}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
