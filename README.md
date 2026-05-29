# Confluence Colorado — confluenceco.org

Website redesign for [Confluence Colorado](https://confluenceco.org), a Denver-based 501(c)(3) nonprofit connecting youth to land, water, and community through environmental stewardship and outdoor education programs.

> *the confluence of people and place*

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Styling | Tailwind CSS 3 with custom brand tokens |
| Animation | Framer Motion (scroll-driven) |
| Routing | React Router v6 |
| Icons | Phosphor (`@phosphor-icons/react`) |
| Content | Markdown + YAML (projects, program areas, news) parsed at build with `js-yaml` + `react-markdown` |
| Search | Client-side index over projects, program areas, news, and key pages |
| Translation | Google Website Translator widget (EN/ES) behind a custom control |
| Hosting | Vercel (auto-deploy from `main`) |
| Analytics | Plausible (cookieless, privacy-first) + Vercel Analytics (`@vercel/analytics/react`, mounted at the app root; enabled in the Vercel dashboard) |
| SEO / Social | Open Graph + Twitter Card meta in `index.html`; branded share image at `public/og-image.png` |
| Linting | ESLint (flat config) with `eslint-plugin-jsx-a11y` — accessibility rules over `src` |
| CI/CD | GitHub Actions — lint + type-check + build on every push/PR |
| Payments | Stripe Checkout (hosted redirect via Vercel serverless `/api/*`) — donate flow built (Phase 4): one-time + monthly, optional fee-cover, per-project attribution |
| Email | Mailchimp (Phase 4 — not yet integrated) |

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build & Deploy

```bash
npm run build   # type-check + production build → dist/
npm run preview # preview the production build locally
```

Vercel deploys automatically on every push to `main`. Pull requests get a preview deploy URL via the Vercel GitHub integration.

CI runs on every push and PR (`npm run lint` then `npm run build`):
- `eslint .` — accessibility lint (`eslint-plugin-jsx-a11y`); also `npm run lint:a11y`
- `tsc --noEmit` — type-check
- `vite build` — production build validation

## Brand

**Colors** (derived from the official logo):

| Token | Hex | Usage |
|---|---|---|
| `cc-navy` | `#004667` | Primary — nav, footer, headings |
| `cc-sky` | `#009dd6` | River Blue — large display + decorative/brand accents |
| `cc-sky-ink` | `#006d94` | Sky **text on light** backgrounds (AA ≥ 4.5:1) |
| `cc-sky-bright` | `#5cc3ea` | Sky **text on navy/dark** backgrounds (AA ≥ 4.5:1) |
| `cc-orange` | `#b44b00` | Accent — donate button, highlights |
| `cc-sage` | `#6B8F71` | Nature/growth accents (large/decorative) |
| `cc-sage-ink` | `#4a6b51` | Sage **text on light** backgrounds (AA ≥ 4.5:1) |
| `cc-clay` | `#7a4a28` | Earthy brown — Public Health/urban-ag area (AA both ways on light) |
| `cc-sand` | `#F5E6D3` | Backgrounds — cards, warm sections |
| `cc-warm` | `#F8F4F0` | Alternate section backgrounds |
| `cc-slate` | `#2C3E50` | Dark sections |
| `cc-dark` | `#1A1A2E` | Deep — utility bar, high-contrast |
| `cc-stone` | `#5b626e` | Secondary text, captions (AA on white/warm/sand) |

(Tokens are defined in [`tailwind.config.js`](tailwind.config.js).)

> **Contrast note:** `cc-sky` and `cc-sage` are mid-tones that fail WCAG AA for
> small text against both light and dark backgrounds, so they're reserved for
> large display text, fills, and decoration. For body/label text use the `-ink`
> shades on light backgrounds and `cc-sky-bright` on navy/dark.

**Program-area colors** — each of the 6 program areas maps to one brand token (via `colorToken` in [`areas.yaml`](src/content/areas.yaml) → class sets in [`src/components/programs/areaColors.ts`](src/components/programs/areaColors.ts)). The home "What We Do" cards use the same colors.

| Program area | Token |
|---|---|
| Youth Pathways | `cc-orange` |
| Watershed Restoration | `cc-sky` |
| Natural Resource Conservation | `cc-sage` |
| Outdoor Recreation & STREAM | `cc-navy` |
| Community Engagement | `cc-slate` |
| Public Health & Urban Agriculture | `cc-clay` |

**Fonts** (Google Fonts):
- **Jost** — display/headings **and** body (single brand typeface from the logo)
- **Merriweather** — pull quotes and accent text (`font-accent`)

**Logo** — all three treatments (bug, stacked, horizontal) are inline React SVG components in [`src/components/Logo.tsx`](src/components/Logo.tsx). They accept a `variant` prop (`"dark"` swaps navy → white for use on dark backgrounds without losing the blue + orange).

## Information architecture

Two nouns drive the site, and the distinction matters:

- **Program Areas** — the **6 fixed categories** the org organizes its work by: Youth Pathways, Watershed Restoration, Natural Resource Conservation, Outdoor Recreation & STREAM, Community Engagement, Public Health & Urban Agriculture. Defined in [`src/content/areas.yaml`](src/content/areas.yaml). Each has its own color token (see Brand). Live at `/program-areas/:slug` (per-area project list — there is **no** standalone index page; the grid lives atop `/projects`).
- **Projects** — the specific, named initiatives (First Creek, SPRAY Council, LGCP, Green Workforce Pathways, etc.). A growing set. Live at `/projects` (list) and `/projects/:slug` (detail). Each project lists a flat `areas: string[]` — **one or more** program areas it fits into, with **no primary/lead** designation. Project `status` is `active` or `completed`.

> **Naming note:** the product-facing surface says *Projects* and *Program Areas*, but internal code identifiers were deliberately left as `Program` / `programs.ts` / `src/content/programs/*.md` to limit churn. That split is intentional — the rename is *not* incomplete.

Legacy `/programs`, `/programs/:slug`, `/focus-areas*`, and `/program-areas` (index) all redirect (client-side in [`src/routes/redirects.ts`](src/routes/redirects.ts) + server-side in [`vercel.json`](vercel.json)).

## Project Structure

Projects, program areas, and news are **content-driven**: projects are Markdown + YAML
files in `src/content/programs/`, tagged with program areas from `src/content/areas.yaml`.
`src/data/` loads and schema-validates that content at build time. Pages render it through
shared templates — there are no per-project page components.

```
src/
├── content/          # Authoring source (no code)
│   ├── programs/*.md # One file per project (frontmatter + Markdown body)
│   ├── areas.yaml    # Program-area taxonomy (6 areas, each with a color token)
│   └── news.yaml     # News timeline entries
├── data/             # Loads + validates content, builds derived data
│   ├── programs.ts   # Parse/validate project frontmatter → Program[]; programsByArea()
│   ├── areas.ts      # Program areas
│   ├── news.ts       # News posts
│   ├── searchIndex.ts# Client-side search index (projects, program areas, news, pages)
│   └── types.ts
├── components/
│   ├── Logo.tsx      # CCBug, CCStacked, CCHorizontal (inline SVG)
│   ├── Nav.tsx       # Fixed header: utility strip + nav row, dropdown + mobile overlay
│   ├── UtilityBar.tsx       # Slim top strip — translate + search triggers
│   ├── TranslateControl.tsx # EN/ES via Google Website Translator widget
│   ├── SearchModal.tsx      # Site search overlay
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ImpactBar.tsx
│   ├── ProgramCards.tsx     # Home "What We Do" — the 6 program areas (colors aligned to area tokens)
│   ├── TestimonialCarousel.tsx
│   ├── CTASection.tsx
│   ├── programs/     # ProgramHero, ProgramBody, ProgramCard, AreaTag, areaColors, filters, meta, etc.
│   ├── donate/       # Donate flow: FrequencyToggle, AmountSelector, FeeCoverToggle, ImpactFraming, ProgramContext
│   └── news/         # LatestNews, NewsPost
├── pages/            # Route-level pages (templates, not per-project)
│   ├── Home.tsx
│   ├── About.tsx / AboutTeam.tsx
│   ├── Programs.tsx / ProgramDetail.tsx      # /projects + /projects/:slug (Programs.tsx also hosts the program-area grid)
│   ├── ProgramArea.tsx                        # /program-areas/:slug (per-area project list; no index page)
│   ├── Impact.tsx
│   ├── GetInvolved.tsx                        # audience cards → mailto Shane
│   ├── Donate.tsx / DonateThankYou.tsx        # /donate + /donate/thank-you (Stripe Checkout)
│   ├── News.tsx
│   ├── Privacy.tsx                            # /privacy (privacy policy — CCPA/CPA)
│   └── NotFound.tsx                           # friendly 404 — home / search / donate
├── lib/donate.ts         # Shared donate constants + fee math (also imported by the serverless API — keep Vite-free)
├── routes/redirects.ts   # Legacy /programs/* + /focus-areas/* → /projects /program-areas
├── layouts/Layout.tsx    # Nav + Footer wrapper, scroll-to-top on route change
├── hooks/                # useCountUp, useInView, useReducedMotion
└── index.css             # Tailwind base + component layer (btn-*, heading-*, etc.)
```

Serverless functions live at repo-root `api/` (outside `src/`, so they're excluded
from the Vite build and the `tsc`/ESLint pass — Vercel compiles them independently):

- `api/create-checkout-session.ts` — `POST` → creates a Stripe Checkout Session (one-time
  `payment` or monthly `subscription`), returns `{ url }` for a client-side redirect.
- `api/checkout-session.ts` — `GET` → returns a non-sensitive session summary (amount, mode,
  program) to personalize the thank-you page. No PII is exposed.

Both read `STRIPE_SECRET_KEY` (server-only) and pin the Stripe API version. To run the flow
locally, copy `.env.example` → `.env.local` with Stripe **test** keys and use `vercel dev`
(`npm run dev` serves the SPA but not the `api/` functions).

## Build Phases

| Phase | Scope | Status |
|---|---|---|
| 0 — Foundation | Routes, layout, nav, footer, CI, Plausible | Complete |
| 1 — Home Page | Hero, impact bar, program cards, testimonials, CTA | Complete |
| 2 — About & Team | Mission/values, timeline, team grid, partner logos | In progress (placeholder copy) |
| 3 — Projects IA | Content-driven projects + program areas (Markdown/YAML); flat area tagging, per-area colors, detail + per-area templates | Complete |
| 4 — Donate & Get Involved | Get Involved reach-out hub (audience cards → mailto) + Stripe donate flow; Mailchimp pending | Get Involved + Stripe donate flow done; email (Mailchimp) pending |
| 5 — Impact & News | Impact goals page + News timeline | Complete (awaiting real metrics) |
| — Site utilities | Search overlay + EN/ES Google Translate in a top utility bar | Complete |
| 6 — Polish & Launch | A11y audit, SEO, Lighthouse, DNS cutover | In progress — A11y AA pass + privacy policy + social/OG share tags done; Lighthouse/DNS pending |
| 7 — Post-Launch | Headless CMS, events calendar | Future |

## Content Pending from Shane Wright

The following content is placeholder and needs to be replaced before launch:

- [x] Verbatim mission statement (approved by Shane 2026-05-29 — current copy stands)
- [ ] Vision & values statements
- [ ] Org history / key milestones (2022–present)
- [ ] Real impact metrics / outcomes data (ImpactBar numbers)
- [x] Verbatim testimonial quotes (Beverly Grant, Braylen Aldridge, Cam Juarez) — approved by Shane 2026-05-29
- [x] Team bios + photos (staff, board, program leads) — approved by Shane 2026-05-29
- [x] EIN (footer shows 88-1757678)
- [ ] Partner logos
- [ ] Project copy review for all projects (drafted in `src/content/programs/`)
- [x] Donation impact framing copy — provisional copy in [`src/lib/donate.ts`](src/lib/donate.ts) is **good to go for launch** (Shane 2026-05-29). Revisiting preset tiers + refund-policy wording down the road (post-launch refinement, not a blocker).

## Donate Launch Checklist (Stripe dashboard — Ben)

The donate flow is built; these are dashboard-only config tasks (no code) that
Ben owns and that gate the donate **launch**, not the build. Test in Stripe
test mode first, then repeat the per-mode items (receipts) in live mode.
**All complete as of 2026-05-29 — the donate flow is live-ready.**

- [x] `STRIPE_SECRET_KEY` set to a **live** key in Vercel (Production)
- [x] Nonprofit rate approved (2.2% + 30¢) — keeps the fee-cover figure accurate
- [x] Automatic email receipts on (per-mode), with the tax-deductibility statement
- [x] Statement descriptor set (`CONFLUENCE COLO`)
- [x] Checkout/receipt branding — logo, brand color `#004667`, support email
- [x] Bank account connected + payout schedule set
- [x] (Recommended) swap `STRIPE_SECRET_KEY` for a restricted key
- [x] Radar fraud rules — enabled the free built-in defaults (CVC-fail →
  Block, AVS/postal-fail → Block, Request 3DS if supported). Custom rules +
  the review queue need Radar for Fraud Teams ($0.07/txn) — skipped, not worth
  it at our volume. Built-in card-testing rate limiting is automatic on all
  tiers.

## Privacy & Compliance

The site collects personal information in two places — donations (via Stripe)
and, once wired, email sign-ups (via Mailchimp) — which brings it under
California's CCPA/CPRA and Colorado's CPA. A privacy policy is published at
`/privacy` ([`src/pages/Privacy.tsx`](src/pages/Privacy.tsx)) and linked from the
footer.

- **Coverage** — standard nonprofit boilerplate: what we collect, how it's used,
  Stripe as processor (we never see or store full card data), "we do not sell
  your data," CCPA/CPA rights (know / access / correct / delete / opt out of
  sale), data retention, children's privacy, and contact info. Bump the
  `LAST_UPDATED` constant in the page whenever the policy changes.
- **No cookie banner needed** — both analytics tools are privacy-respecting:
  Plausible is cookieless and Vercel Analytics sets no cross-site tracking
  cookies. The site sets no advertising/tracking cookies.
- **Before launch** — the policy is boilerplate; have counsel skim it, and
  confirm the Stripe receipt carries the tax-deductibility statement (see the
  Donate checklist above).

## SEO & Social sharing

- **Meta** — title, description, Open Graph, and Twitter Card tags live in
  [`index.html`](index.html). Because the site is a client-rendered SPA, every
  route shares the homepage's card; per-page cards would require
  prerendering/SSR.
- **Share image** — `public/og-image.png` (1200×630 @2×) is a branded logo +
  tagline card that unfurls when a link is pasted into Slack, iMessage,
  Facebook, LinkedIn, X, etc.

## Accessibility

All components are built to WCAG 2.1 AA targets:
- Skip-to-content link on every page
- Visible focus indicators (`focus-visible` with `cc-sky` outline)
- ARIA labels on all interactive elements and landmark regions
- `prefers-reduced-motion` — all animations and auto-advance disabled
- Semantic HTML throughout
- **Color contrast** — text meets AA (≥ 4.5:1); see the contrast note under
  [Brand](#brand) for the `-ink` / `-bright` text shades
- **Keyboard** — desktop nav dropdowns open via click/Enter and close on
  Esc/blur; the mobile menu and search overlay trap focus, close on Esc, and
  restore focus to their trigger on close (`useFocusTrap`)
- **Carousel** — the testimonials auto-advance has a visible pause/play control
  (WCAG 2.2.2) in addition to the reduced-motion halt
- **Enforced in CI** — `eslint-plugin-jsx-a11y` runs on every push/PR via
  `npm run lint` (see [Build & Deploy](#build--deploy))

## Contact

Shane Wright, Executive Director — shane@confluenceco.org — (303) 815-7613
