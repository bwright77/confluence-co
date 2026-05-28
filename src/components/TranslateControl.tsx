import { useState, useEffect, useRef } from 'react'
import { GlobeHemisphereWest, CaretDown, Check } from '@phosphor-icons/react'

/*
 * Custom UI on top of the Google Website Translator widget.
 * The real Google widget is rendered hidden (#google_translate_element);
 * our buttons drive its <select.goog-te-combo> so we control the styling.
 *
 * Language resolution on load: an explicit saved choice (localStorage) wins;
 * otherwise we fall back to the active googtrans cookie, then auto-switch to
 * the browser's preferred language. Every language is always listed in the
 * dropdown regardless of browser settings — locale only drives which one is
 * auto-selected.
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
  { code: 'nv', label: 'Diné Bizaad', short: 'NV' },
] as const

type LangCode = (typeof LANGUAGES)[number]['code']

// Non-source languages we offer (used for browser detection + widget config).
const OFFERED: LangCode[] = LANGUAGES.map((l) => l.code).filter((c) => c !== 'en')

const SCRIPT_ID = 'google-translate-script'
const STORAGE_KEY = 'cc-lang'

function isLangCode(value: string): value is LangCode {
  return LANGUAGES.some((l) => l.code === value)
}

function readGoogtransCookie(): LangCode {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  if (match) {
    const target = decodeURIComponent(match[1]).split('/')[2] ?? '' // e.g. "/en/es" → "es"
    if (target !== 'en' && isLangCode(target)) return target
  }
  return 'en'
}

function readSavedChoice(): LangCode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value && isLangCode(value) ? value : null
  } catch {
    return null
  }
}

function saveChoice(lang: LangCode) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* private mode / storage disabled — auto-detection still applies */
  }
}

// First browser-preferred language we can actually offer.
function browserDefault(): LangCode {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const l of langs) {
    const lower = l?.toLowerCase() ?? ''
    const hit = OFFERED.find((code) => lower.startsWith(code))
    if (hit) return hit
  }
  return 'en'
}

function setGoogtransCookie(lang: LangCode) {
  const host = window.location.hostname
  // English = restore original, so clear the cookie variants.
  const expire = lang === 'en' ? 'expires=Thu, 01 Jan 1970 00:00:00 GMT;' : ''
  const value = lang === 'en' ? '' : `/en/${lang}`
  const variants = [
    `googtrans=${value};${expire}path=/;`,
    `googtrans=${value};${expire}path=/;domain=${host};`,
    `googtrans=${value};${expire}path=/;domain=.${host};`,
  ]
  for (const v of variants) document.cookie = v
}

// Drive the hidden Google combo. The widget script loads asynchronously, so on
// first load the <select> may not exist yet — retry for a while (≈9s) before
// giving up, which matters on slow mobile connections.
function applyToWidget(lang: LangCode, attempt = 0) {
  const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
  if (!select) {
    if (attempt < 60) setTimeout(() => applyToWidget(lang, attempt + 1), 150)
    return
  }
  select.value = lang === 'en' ? '' : lang
  select.dispatchEvent(new Event('change'))
}

export default function TranslateControl() {
  const [current, setCurrent] = useState<LangCode>('en')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load the Google Translate script, mount its hidden widget, and resolve the
  // initial language (saved choice → cookie → browser default).
  useEffect(() => {
    const saved = readSavedChoice()
    const cookieLang = readGoogtransCookie()
    const resolved = saved ?? (cookieLang !== 'en' ? cookieLang : browserDefault())
    setCurrent(resolved)

    if (!document.getElementById(SCRIPT_ID)) {
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate) return
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: `en,${OFFERED.join(',')}`, autoDisplay: false },
          'google_translate_element'
        )
      }

      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }

    // Actively drive the widget into the resolved language on load. Google's
    // widget does not reliably translate from the googtrans cookie on its own,
    // so we always set it for non-English (covers reloads where the cookie is
    // already set, and first-visit browser-based auto-switch). No saveChoice
    // here — only an explicit pick should persist as the user's preference.
    if (resolved !== 'en') {
      setGoogtransCookie(resolved)
      applyToWidget(resolved)
    }
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
    saveChoice(lang) // explicit choice persists and wins over auto-detection
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
        className="flex items-center gap-1.5 text-cc-navy/80 hover:text-cc-navy transition-colors text-xs font-display font-semibold uppercase tracking-display"
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
