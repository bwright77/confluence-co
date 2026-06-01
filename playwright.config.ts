import { defineConfig, devices } from '@playwright/test'

/**
 * E2E smoke tests. Focused on the recurring Google Translate / Spanish bugs
 * (banner overlapping the nav; count-up stats freezing at 0). Tests run against
 * the production build via `vite preview`, so they exercise the real bundled CSS.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Build + serve the real production output so bundled CSS (the banner
    // suppression rules) is what's under test, not the dev server.
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
