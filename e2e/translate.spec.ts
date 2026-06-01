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
