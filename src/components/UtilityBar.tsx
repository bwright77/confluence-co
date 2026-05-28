import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import TranslateControl from './TranslateControl'
import SearchModal from './SearchModal'

export default function UtilityBar() {
  const [searchOpen, setSearchOpen] = useState(false)

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
