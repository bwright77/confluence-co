import { test, expect } from '@playwright/test'

/*
 * Regression guards for the two recurring Spanish / Google Translate bugs:
 *   1. Google's injected top banner overlapping the fixed nav.
 *   2. Count-up stats freezing at 0 because Google rewraps the animated text node.
 *
 * These are deterministic: we DON'T drive Google's live translation service
 * (it needs network + is flaky in CI). Instead we (a) verify the animation
 * works and the numbers carry translate="no" so Google can't touch them, and
 * (b) simulate the DOM Google injects and assert our bundled CSS neutralizes it.
 */

test.describe('Impact count-up stats', () => {
  test('animate up to their target values', async ({ page }) => {
    await page.goto('/')
    const band = page.getByRole('region', { name: 'Impact statistics' })
    await band.scrollIntoViewIfNeeded()

    // aria-label is `${value}${suffix} ${label}`; the visible text is the count.
    await expect(band.getByLabel('80+ Youth Served Annually')).toHaveText(/80\+/, {
      timeout: 5000,
    })
    await expect(band.getByLabel('6 Community Programs')).toHaveText(/\b6\b/)
    await expect(band.getByLabel('3 Urban Farms')).toHaveText(/\b3\b/)
    await expect(band.getByLabel('1 River to Restore')).toHaveText(/\b1\b/)
  })

  test('wrap the animated number in translate="no" so Google cannot freeze it', async ({
    page,
  }) => {
    await page.goto('/')
    const band = page.getByRole('region', { name: 'Impact statistics' })
    await band.scrollIntoViewIfNeeded()

    // The number lives inside a translate="no" span within the labelled element.
    const guarded = band.getByLabel('80+ Youth Served Annually').locator('[translate="no"]')
    await expect(guarded).toHaveCount(1)
    await expect(guarded).toHaveText(/80\+/)
  })
})

test.describe('Language toggle / English restore', () => {
  const TRANSLATE_TOGGLE = 'button[aria-label="Translate this page"]'

  async function toggleText(page: import('@playwright/test').Page) {
    return page.locator(`${TRANSLATE_TOGGLE} span`).first().textContent()
  }
  async function googtrans(context: import('@playwright/test').BrowserContext) {
    return (await context.cookies()).find((c) => c.name === 'googtrans')?.value ?? null
  }

  test('clears a stale googtrans=es cookie on load when English is the saved choice', async ({
    page,
    context,
  }) => {
    // The reported stuck state: an explicit English preference, but a leftover
    // Spanish cookie that would otherwise make Google translate the page while
    // the control still reads EN.
    await context.addCookies([
      { name: 'googtrans', value: '/en/es', domain: 'localhost', path: '/' },
    ])
    await page.addInitScript(() => localStorage.setItem('cc-lang', 'en'))

    await page.goto('/')
    await page.waitForTimeout(600)

    expect(await googtrans(context)).toBeNull()
    expect((await toggleText(page))?.trim()).toBe('EN')
  })

  test('switching from Spanish back to English clears the cookie and updates the toggle', async ({
    page,
    context,
  }) => {
    // Drive language purely via the cookie (no init script) so the reload that
    // the English restore performs is not re-seeded with a Spanish preference.
    await context.addCookies([
      { name: 'googtrans', value: '/en/es', domain: 'localhost', path: '/' },
    ])

    await page.goto('/')
    await page.waitForTimeout(400)
    expect((await toggleText(page))?.trim()).toBe('ES')

    await page.locator(TRANSLATE_TOGGLE).click()
    await page.getByRole('button', { name: /English/ }).click()
    await page.waitForTimeout(800)

    expect(await googtrans(context)).toBeNull()
    expect((await toggleText(page))?.trim()).toBe('EN')
  })
})

test.describe('Nav dropdown labels are translatable', () => {
  // The submenu items must exist in the DOM on load (not mounted only on open)
  // so Google Translate translates them on its initial pass — otherwise they
  // stay in English while the rest of the page is translated.
  test('About submenu links are in the DOM at load, then revealed on open', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const teamLink = page.locator('header a[href="/about/team"]')
    // Present in the DOM even while the dropdown is closed (hidden).
    await expect(teamLink).toHaveCount(1)
    await expect(teamLink).toBeHidden()

    // Opening the About menu reveals it.
    await page.getByRole('button', { name: /About/ }).click()
    await expect(teamLink).toBeVisible()
  })
})

test.describe('Search overlay text is translatable', () => {
  // The search overlay must stay in the DOM (hidden) rather than unmount when
  // closed, so Google Translate picks up its static UI text on the initial pass.
  test('search input + hint are in the DOM at load, hidden until opened', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const input = page.locator('input[aria-label="Search query"]')
    const hint = page.getByText('Type to search projects, news, program areas, and pages.')

    // Present in the DOM even while the overlay is closed (hidden).
    await expect(input).toHaveCount(1)
    await expect(input).toBeHidden()
    await expect(hint).toHaveCount(1)

    // Opening the search reveals it.
    await page.getByRole('button', { name: /search/i }).first().click()
    await expect(input).toBeVisible()
  })
})

test.describe('Hero heading clears the fixed nav', () => {
  // The hero text is anchored low in the frame; on short viewports it must not
  // slide up under the fixed nav. Spanish makes this worse because the
  // translated heading wraps to an extra line — so we check both.
  const SHORT = { width: 1280, height: 700 }

  async function topmostContentTop(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
      const nav = document.querySelector('header')!.getBoundingClientRect()
      // The tagline ("Denver, Colorado · Est. 2022") is the topmost text block.
      const tagline = document
        .getElementById('hero-heading')!
        .previousElementSibling!.getBoundingClientRect()
      return { navBottom: nav.bottom, contentTop: tagline.top }
    })
  }

  test('does not overlap the nav on a short viewport (English)', async ({ page }) => {
    await page.setViewportSize(SHORT)
    await page.goto('/')
    const { navBottom, contentTop } = await topmostContentTop(page)
    expect(contentTop).toBeGreaterThanOrEqual(navBottom)
  })

  test('does not overlap the nav with a longer (Spanish) heading', async ({ page }) => {
    await page.setViewportSize(SHORT)
    await page.goto('/')
    // Mimic Google's Spanish output: a heading that wraps to one extra line.
    await page.evaluate(() => {
      document.getElementById('hero-heading')!.innerHTML =
        'En la <span style="color:#009dd6">Confluencia</span><br><span style="font-size:0.62em;letter-spacing:0.1em">de Personas y Lugar</span>'
    })
    await page.waitForTimeout(150)
    const { navBottom, contentTop } = await topmostContentTop(page)
    expect(contentTop).toBeGreaterThanOrEqual(navBottom)
  })
})

test.describe('Google Translate banner suppression', () => {
  test('the injected banner is hidden and the body offset is reset', async ({ page }) => {
    await page.goto('/')

    // Mimic exactly what the Google Website Translator widget injects when a
    // page is translated: a `.skiptranslate` banner as a direct child of <body>,
    // the inline `top: 40px` it forces on the body, and the translated-ltr class
    // it adds to <html>.
    await page.evaluate(() => {
      const banner = document.createElement('div')
      banner.id = 'test-goog-banner'
      banner.className = 'skiptranslate goog-te-banner-frame'
      banner.textContent = 'Translated to Spanish · Show original'
      document.body.prepend(banner)
      document.body.style.top = '40px'
      document.documentElement.classList.add('translated-ltr')
    })

    // Our bundled CSS must hide the banner and pin body back to top: 0.
    await expect(page.locator('#test-goog-banner')).toBeHidden()
    const bodyTop = await page.$eval('body', (el) => getComputedStyle(el).top)
    expect(bodyTop).toBe('0px')
  })
})
