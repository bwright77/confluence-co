import { useEffect, useRef, useState } from 'react'
import { GlobeHemisphereWest, CaretDown, Check } from '@phosphor-icons/react'

/*
 * Custom UI on top of the Google Website Translator widget.
 * The real Google widget is rendered hidden (#google_translate_element);
 * our buttons drive its <select.goog-te-combo> so we control the styling.
 */

declare global {
  interface Window {
    google?: { translate?: { TranslateElement: new (opts: object, el: string) => void } }
    googleTranslateElementInit?: () => void
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
] as const

type LangCode = (typeof LANGUAGES)[number]['code']

const SCRIPT_ID = 'google-translate-script'

function readGoogtransCookie(): LangCode {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  if (match) {
    const value = decodeURIComponent(match[1]) // e.g. "/en/es"
    const target = value.split('/')[2]
    if (target === 'es') return 'es'
  }
  return 'en'
}

function setGoogtransCookie(lang: LangCode) {
  const host = window.location.hostname
  // English = restore original, so clear the cookie variants.
  const expire = lang === 'en' ? 'expires=Thu, 01 Jan 1970 00:00:00 GMT;' : ''
  const value = lang === 'en' ? '' : '/en/es'
  const variants = [
    `googtrans=${value};${expire}path=/;`,
    `googtrans=${value};${expire}path=/;domain=${host};`,
    `googtrans=${value};${expire}path=/;domain=.${host};`,
  ]
  for (const v of variants) document.cookie = v
}

function applyToWidget(lang: LangCode, attempt = 0) {
  const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
  if (!select) {
    if (attempt < 20) setTimeout(() => applyToWidget(lang, attempt + 1), 150)
    return
  }
  select.value = lang === 'en' ? '' : lang
  select.dispatchEvent(new Event('change'))
}

export default function TranslateControl() {
  const [current, setCurrent] = useState<LangCode>('en')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load the Google Translate script once and mount its (hidden) widget.
  useEffect(() => {
    setCurrent(readGoogtransCookie())

    if (document.getElementById(SCRIPT_ID)) return

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,es', autoDisplay: false },
        'google_translate_element'
      )
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  // Close the popover on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(lang: LangCode) {
    setOpen(false)
    if (lang === current) return
    setGoogtransCookie(lang)
    setCurrent(lang)
    if (lang === 'en') {
      // Restoring the source language reliably requires a reload.
      window.location.reload()
    } else {
      applyToWidget(lang)
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0]

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden Google widget — driven programmatically by the buttons below. */}
      <div id="google_translate_element" className="sr-only" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-cc-navy/70 hover:text-cc-navy transition-colors text-xs font-display font-semibold uppercase tracking-display"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Translate this page"
        translate="no"
      >
        <GlobeHemisphereWest size={16} weight="bold" aria-hidden="true" />
        <span>{currentLang.short}</span>
        <CaretDown
          size={12}
          weight="bold"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-52 rounded-md border border-cc-navy/10 bg-white shadow-2xl overflow-hidden z-[70]"
          translate="no"
        >
          <p className="px-3 pt-2.5 pb-1.5 font-display text-[0.65rem] font-semibold uppercase tracking-poster text-cc-stone">
            Translate this page
          </p>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => choose(lang.code)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left font-body text-sm transition-colors hover:bg-cc-warm ${
                lang.code === current ? 'text-cc-navy font-semibold' : 'text-cc-dark'
              }`}
            >
              <span>
                {lang.label} <span className="text-cc-stone">{lang.short}</span>
              </span>
              {lang.code === current && (
                <Check size={15} weight="bold" className="text-cc-sky" aria-hidden="true" />
              )}
            </button>
          ))}
          <p className="border-t border-cc-navy/10 px-3 py-2 font-body text-[0.65rem] text-cc-stone">
            Powered by Google Translate
          </p>
        </div>
      )}
    </div>
  )
}
