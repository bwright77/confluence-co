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
| Hosting | Vercel (auto-deploy from `main`) |
| Analytics | Plausible (cookieless, privacy-first) |
| CI/CD | GitHub Actions — type-check + build on every push/PR |
| Payments | Stripe (Phase 4) |
| Email | Mailchimp (Phase 4) |

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
| `cc-sage` | `#4A6741` | Supporting — foothills green |
| `cc-sand` | `#F5E6D3` | Backgrounds — cards, sections |
| `cc-dark` | `#0D2137` | Deep — hero sky, dark backgrounds |

**Fonts** (Google Fonts):
- **Jost** — display/headings (brand font from logo)
- **Source Sans 3** — body text
- **Bitter** — pull quotes and testimonials

**Logo** — all three treatments (bug, stacked, horizontal) are inline React SVG components in [`src/components/Logo.tsx`](src/components/Logo.tsx). They accept a `variant` prop (`"dark"` swaps navy → white for use on dark backgrounds without losing the blue + orange).

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── Logo.tsx      # CCBug, CCStacked, CCHorizontal (inline SVG)
│   ├── Nav.tsx       # Sticky nav with dropdown + mobile overlay
│   ├── Footer.tsx    # Full footer with links, contact, newsletter
│   ├── Hero.tsx              # Full-viewport photo hero
│   ├── ImpactBar.tsx         # Count-up stat band
│   ├── ProgramCards.tsx      # 6 program cards with SVG illustrations
│   ├── TestimonialCarousel.tsx
│   └── CTASection.tsx        # Dusk landscape dual CTA
├── pages/            # Route-level page components
│   ├── Home.tsx
│   ├── About.tsx / AboutTeam.tsx
│   ├── Programs.tsx
│   ├── programs/     # Pathways, Watershed, Lgcp, MoBetta, Recreation, Cultural
│   ├── Impact.tsx
│   ├── GetInvolved.tsx
│   ├── Donate.tsx
│   ├── News.tsx
│   └── NotFound.tsx
├── layouts/
│   └── Layout.tsx    # Nav + Footer wrapper, scroll-to-top on route change
├── hooks/
│   ├── useCountUp.ts       # Animated number count-up
│   ├── useInView.ts        # IntersectionObserver hook
│   └── useReducedMotion.ts # prefers-reduced-motion hook
└── index.css         # Tailwind base + component layer (btn-*, heading-*, etc.)
```

## Build Phases

| Phase | Scope | Status |
|---|---|---|
| 0 — Foundation | Routes, layout, nav, footer, CI, Plausible | Complete |
| 1 — Home Page | Hero, impact bar, program cards, testimonials, CTA | Complete |
| 2 — About & Team | Mission/values, timeline, team grid, partner logos | Pending |
| 3 — Program Pages | 6 program templates with poster illustrations + photo galleries | Pending |
| 4 — Donate & Get Involved | Stripe integration, volunteer form, Mailchimp signup | Pending |
| 5 — Impact & News | Metrics visualization, story spotlights, static blog | Pending |
| 6 — Polish & Launch | A11y audit, SEO, Lighthouse, DNS cutover | Pending |
| 7 — Post-Launch | Bilingual (EN/ES), headless CMS, events calendar | Future |

## Content Pending from Shane Wright

The following content is placeholder and needs to be replaced before launch:

- [ ] Verbatim mission statement (currently placeholder in hero + footer)
- [ ] Vision & values statements
- [ ] Org history / key milestones (2022–present)
- [ ] Real impact metrics / outcomes data (ImpactBar numbers)
- [ ] Verbatim testimonial quotes (Beverly Grant, Braylen Aldridge, Cam Juarez)
- [ ] Team bios + photos (staff, board, program leads)
- [ ] EIN (for footer tax-deductibility statement)
- [ ] Partner logos
- [ ] Program page copy for all 6 programs
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
