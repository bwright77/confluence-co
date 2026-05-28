import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, X, ArrowRight } from '@phosphor-icons/react'
import { search } from '../data/searchIndex'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const TYPE_STYLES: Record<string, string> = {
  Program: 'bg-cc-sky/10 text-cc-sky',
  'Focus Area': 'bg-cc-sage/15 text-cc-sage',
  News: 'bg-cc-orange/10 text-cc-orange',
  Page: 'bg-cc-navy/10 text-cc-navy',
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => search(query), [query])

  // Focus the input when opened; reset query when closed.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50)
      return () => window.clearTimeout(id)
    }
    setQuery('')
  }, [open])

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  function go(href: string) {
    onClose()
    navigate(href)
  }

  const trimmed = query.trim()

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-24 sm:pt-32"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <div
        className="absolute inset-0 bg-cc-dark/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-cc-navy/10 px-4">
          <MagnifyingGlass size={20} weight="bold" className="text-cc-stone shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs, news, and pages…"
            className="w-full bg-transparent py-4 font-body text-base text-cc-dark placeholder:text-cc-stone focus:outline-none"
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded p-1.5 text-cc-stone hover:bg-cc-warm hover:text-cc-navy transition-colors"
            aria-label="Close search"
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((r) => (
                <li key={`${r.type}-${r.href}-${r.title}`}>
                  <button
                    type="button"
                    onClick={() => go(r.href)}
                    className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cc-warm"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded px-2 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-display ${
                        TYPE_STYLES[r.type] ?? 'bg-cc-navy/10 text-cc-navy'
                      }`}
                    >
                      {r.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-semibold text-cc-navy">
                        {r.title}
                      </span>
                      <span className="block truncate font-body text-sm text-cc-stone">
                        {r.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-cc-stone opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center font-body text-sm text-cc-stone">
              {trimmed.length < 2
                ? 'Type to search programs, news, focus areas, and pages.'
                : `No results for “${trimmed}”.`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
