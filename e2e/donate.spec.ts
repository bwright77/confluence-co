import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const KADY = `${BASE}/donate/kady-youth-sheep-camp`

// Stub the serverless function (not running under `vite preview`) and capture
// the exact body the page posts.
async function stubCheckout(page: import('@playwright/test').Page, sink: any[]) {
  await page.route('**/api/create-checkout-session', async (route) => {
    sink.push(JSON.parse(route.request().postData() ?? '{}'))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: `${BASE}/donate/thank-you?session_id=cs_test_stub` }),
    })
  })
}

test('kady page: monthly default, small one-time ladder, contacts, payload', async ({ page }) => {
  const posted: any[] = []
  await stubCheckout(page, posted)
  await page.goto(KADY)

  // Title
  await expect(page).toHaveTitle(/Kady Youth Sheep Camp/)

  // Fiscal-sponsorship banner + disclosure
  await expect(page.getByText('Kady Youth Sheep Camp', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/retains discretion and control/i)).toBeVisible()

  // Defaults to MONTHLY, preselected $25
  const monthly = page.getByRole('button', { name: /monthly/i })
  await expect(monthly).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: '$25', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await expect(page.getByRole('button', { name: /Give \$25\/month/i })).toBeVisible()

  // Monthly ladder = 10/25/50/100
  const group = page.getByRole('group', { name: /suggested amounts/i })
  await expect(group.getByRole('button')).toHaveText(['$10', '$25', '$50', '$100'])

  // Contacts for major gifts / partnerships / sponsorships
  await expect(page.getByText(/larger one-time gift, or interested in a partnership/i)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Shane Wright' })).toHaveAttribute(
    'href',
    'mailto:shane@confluenceco.org'
  )
  await expect(page.getByRole('link', { name: 'Roy Kady' })).toHaveAttribute(
    'href',
    'mailto:roykady@outlook.com'
  )

  // Switch to one-time → SMALL ladder only (10/25/50), no $100/$250/$500
  await page.getByRole('button', { name: /one-time/i }).click()
  await expect(group.getByRole('button')).toHaveText(['$10', '$25', '$50'])

  // Fee toggle names the camp
  await expect(page.getByText(/100% of my gift reaches the camp/i)).toBeVisible()

  // Submit → payload carries fund, not program
  await page.getByRole('button', { name: /^Donate \$25$/ }).click()
  await page.waitForURL(/thank-you/)
  expect(posted).toHaveLength(1)
  expect(posted[0]).toMatchObject({
    amount: 25,
    frequency: 'one-time',
    coverFee: false,
    fund: 'kady-youth-sheep-camp',
  })
  expect(posted[0].program).toBeUndefined()
})

test('generic /donate is unchanged: one-time default, full ladder, no fund', async ({ page }) => {
  const posted: any[] = []
  await stubCheckout(page, posted)
  await page.goto(`${BASE}/donate`)

  await expect(page.getByRole('button', { name: /one-time/i })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  const group = page.getByRole('group', { name: /suggested amounts/i })
  await expect(group.getByRole('button')).toHaveText(['$25', '$50', '$100', '$250', '$500'])
  await expect(page.getByText(/100% of my gift reaches the programs/i)).toBeVisible()
  await expect(page.getByText(/retains discretion and control/i)).toHaveCount(0)

  await page.getByRole('button', { name: /^Donate \$50$/ }).click()
  await page.waitForURL(/thank-you/)
  expect(posted[0].fund).toBeUndefined()
})

// Regression: object-literal maps inherit Object.prototype, so a lookup of
// 'constructor' used to resolve to a truthy native function and render a banner
// (and, server-side, pass slug validation).
test('inherited prototype keys are not treated as valid designations', async ({ page }) => {
  for (const key of ['constructor', '__proto__', 'toString']) {
    await page.goto(`${BASE}/donate?program=${key}`)
    await expect(page.getByText(/Your gift supports/i)).toHaveCount(0)
  }
})

test('program query param still works on /donate', async ({ page }) => {
  const posted: any[] = []
  await stubCheckout(page, posted)
  await page.goto(`${BASE}/donate?program=spray-council`)
  await expect(page.getByText(/SPRAY Council/i).first()).toBeVisible()
  await page.getByRole('button', { name: /^Donate \$50$/ }).click()
  await page.waitForURL(/thank-you/)
  expect(posted[0].program).toBe('spray-council')
  expect(posted[0].fund).toBeUndefined()
})
