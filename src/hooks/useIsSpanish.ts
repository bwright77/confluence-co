import { useState, useEffect } from 'react'

/**
 * Returns true when the visitor is reading the site in Spanish — either the
 * Google Website Translator is set to Spanish (the `googtrans` cookie targets
 * `es`) or Spanish is among the browser's preferred languages. Used to point
 * language-specific links (e.g. the LGCP community survey) at their Spanish
 * equivalent.
 */
function detectSpanish(): boolean {
  if (typeof document === 'undefined') return false

  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  const widgetEs = match ? decodeURIComponent(match[1]).split('/')[2] === 'es' : false

  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  const browserEs = langs.some((l) => l?.toLowerCase().startsWith('es'))

  return widgetEs || browserEs
}

export function useIsSpanish(): boolean {
  const [isSpanish, setIsSpanish] = useState(detectSpanish)

  useEffect(() => {
    const update = () => setIsSpanish(detectSpanish())
    update()
    // Google Translate toggles in place by setting the googtrans cookie and
    // flipping a class on <html>; re-check when that class changes.
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return isSpanish
}
