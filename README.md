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
| Content | Markdown + YAML (programs, focus areas, news) parsed at build with `js-yaml` + `react-markdown` |
| Search | Client-side index over programs, focus areas, news, and key pages |
| Translation | Google Website Translator widget (EN/ES) behind a custom control |
| Hosting | Vercel (auto-deploy from `main`) |
| Analytics | Plausible (cookieless, privacy-first) |
| CI/CD | GitHub Actions — type-check + build on every push/PR |
| Payments | Stripe (Phase 4 — not yet integrated) |
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

CI runs on every push and PR:
- `tsc --noEmit` — type-check
- `vite build` — production build validation

## Brand

**Colors** (derived from the official logo):

| Token | Hex | Usage |
|---|---|---|
| `cc-navy` | `#004667` | Primary — nav, footer, headings |
| `cc-sky` | `#009dd6` | Secondary — CTAs, links, accents |
| `cc-orange` | `#b44b00` | Accent — donate button, highlights |
| `cc-sage` | `#6B8F71` | Nature/growth accents |
| `cc-sand` | `#F5E6D3` | Backgrounds — cards, warm sections |
| `cc-warm` | `#F8F4F0` | Alternate section backgrounds |
| `cc-slate` | `#2C3E50` | Dark sections |
| `cc-dark` | `#1A1A2E` | Deep — utility bar, high-contrast |
| `cc-stone` | `#6B7280` | Secondary text, captions |

(Tokens are defined in [`tailwind.config.js`](tailwind.config.js).)

**Fonts** (Google Fonts):
- **Jost** — display/headings **and** body (single brand typeface from the logo)
- **Merriweather** — pull quotes and accent text (`font-accent`)

**Logo** — all three treatments (bug, stacked, horizontal) are inline React SVG components in [`src/components/Logo.tsx`](src/components/Logo.tsx). They accept a `variant` prop (`"dark"` swaps navy → white for use on dark backgrounds without losing the blue + orange).

## Project Structure

Programs, focus areas, and news are **content-driven**: programs are Markdown + YAML
files in `src/content/programs/`, tagged with focus areas from `src/content/areas.yaml`.
`src/data/` loads and schema-validates that content at build time. Pages render it through
shared templates — there are no per-program page components.

```
src/
├── content/          # Authoring source (no code)
│   ├── programs/*.md # One file per program (frontmatter + Markdown body)
│   ├── areas.yaml    # Focus-area taxonomy
│   └── news.yaml     # News timeline entries
├── data/             # Loads + validates content, builds derived data
│   ├── programs.ts   # Parse/validate program frontmatter → Program[]
│   ├── areas.ts      # Focus areas
│   ├── news.ts       # News posts
│   ├── searchIndex.ts# Client-side search index (programs, areas, news, pages)
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
│   ├── ProgramCards.tsx
│   ├── TestimonialCarousel.tsx
│   ├── CTASection.tsx
│   ├── programs/     # ProgramHero, ProgramBody, ProgramCard, filters, meta, etc.
│   └── news/         # LatestNews, NewsPost
├── pages/            # Route-level pages (templates, not per-program)
│   ├── Home.tsx
│   ├── About.tsx / AboutTeam.tsx
│   ├── Programs.tsx / ProgramDetail.tsx      # index + /programs/:slug
│   ├── FocusAreas.tsx / FocusArea.tsx        # index + /focus-areas/:slug
│   ├── Impact.tsx
│   ├── GetInvolved.tsx                        # audience cards → mailto Shane
│   ├── Donate.tsx
│   ├── News.tsx
│   └── NotFound.tsx
├── routes/redirects.ts   # Legacy per-area routes → /focus-areas/:slug
├── layouts/Layout.tsx    # Nav + Footer wrapper, scroll-to-top on route change
├── hooks/                # useCountUp, useInView, useReducedMotion
└── index.css             # Tailwind base + component layer (btn-*, heading-*, etc.)
```

## Build Phases

| Phase | Scope | Status |
|---|---|---|
| 0 — Foundation | Routes, layout, nav, footer, CI, Plausible | Complete |
| 1 — Home Page | Hero, impact bar, program cards, testimonials, CTA | Complete |
| 2 — About & Team | Mission/values, timeline, team grid, partner logos | In progress (placeholder copy) |
| 3 — Programs IA | Content-driven programs + focus areas (Markdown/YAML), detail + index templates | Complete |
| 4 — Donate & Get Involved | Get Involved reach-out hub (audience cards → mailto) done; Stripe + Mailchimp pending | Get Involved done; payments/email pending |
| 5 — Impact & News | Impact goals page + News timeline | Complete (awaiting real metrics) |
| — Site utilities | Search overlay + EN/ES Google Translate in a top utility bar | Complete |
| 6 — Polish & Launch | A11y audit, SEO, Lighthouse, DNS cutover | Pending |
| 7 — Post-Launch | Headless CMS, events calendar | Future |

## Content Pending from Shane Wright

The following content is placeholder and needs to be replaced before launch:

- [ ] Verbatim mission statement (currently placeholder in hero + footer)
- [ ] Vision & values statements
- [ ] Org history / key milestones (2022–present)
- [ ] Real impact metrics / outcomes data (ImpactBar numbers)
- [ ] Verbatim testimonial quotes (Beverly Grant, Braylen Aldridge, Cam Juarez)
- [ ] Team bios + photos (staff, board, program leads)
- [x] EIN (footer shows 88-1757678)
- [ ] Partner logos
- [ ] Program copy review for all programs (drafted in `src/content/programs/`)
- [ ] Donation impact framing copy

## Accessibility

All components are built to WCAG 2.1 AA targets:
- Skip-to-content link on every page
- Visible focus indicators (`focus-visible` with `cc-sky` outline)
- ARIA labels on all interactive elements and landmark regions
- `prefers-reduced-motion` — all animations and auto-advance disabled
- Semantic HTML throughout

## Contact

Shane Wright, Executive Director — shane@confluenceco.org — (303) 815-7613
