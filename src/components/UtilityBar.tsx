import { useState, useEffect } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import TranslateControl from './TranslateControl'
import SearchModal from './SearchModal'

export const OPEN_SEARCH_EVENT = 'cc:open-search'

export default function UtilityBar() {
  const [searchOpen, setSearchOpen] = useState(false)

  // Let any page open the search overlay (e.g. the 404 page) by dispatching
  // a window event, since the modal's open state lives here.
  useEffect(() => {
    const open = () => setSearchOpen(true)
    window.addEventListener(OPEN_SEARCH_EVENT, open)
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, open)
  }, [])

  return (
    <>
      <div className="bg-cc-sand">
        <div className="container-site flex h-9 items-center justify-between">
          <TranslateControl />

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 text-cc-navy/80 hover:text-cc-navy transition-colors text-xs font-display font-semibold uppercase tracking-display"
            aria-label="Search the site"
          >
            <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
