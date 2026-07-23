// Post-build step: bake per-route <title> + Open Graph / Twitter meta into
// static HTML files so link-preview scrapers (Facebook, iMessage, Slack, etc.),
// which don't run JS, get page-specific cards instead of the site-wide default.
//
// It clones dist/index.html into dist/<route>/index.html with the meta swapped.
// Vercel serves those static files ahead of the SPA rewrite, and React still
// boots and takes over on the client for real visitors.
//
// Runs after `vite build` (see package.json "build").

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'

const DIST = 'dist'
const SITE = 'https://www.confluenceco.org' // canonical host (apex 307s to www)
const DEFAULT_IMAGE = `${SITE}/og-image.png`

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function absoluteImage(url) {
  if (!url) return DEFAULT_IMAGE
  if (/^https?:\/\//.test(url)) return url
  return SITE + (url.startsWith('/') ? '' : '/') + url
}

// Replace the content="" of a <meta name|property="key" ...> tag. Anchored on
// the closing quote after the key so e.g. og:image never matches og:image:width.
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) {
    throw new Error(`prerender-og: no <meta ${attr}="${key}"> tag found in index.html`)
  }
  return html.replace(re, `$1${escapeHtml(value)}$2`)
}

function removeMeta(html, key) {
  return html.replace(new RegExp(`\\s*<meta property="${key}" content="[^"]*"\\s*/>`), '')
}

function render({ path, title, description, image, type = 'website', imageAlt }) {
  const url = SITE + path
  const img = absoluteImage(image)
  const alt = imageAlt ?? title

  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:type', type)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', img)
  html = setMeta(html, 'property', 'og:image:alt', alt)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:description', description)
  html = setMeta(html, 'name', 'twitter:image', img)
  html = setMeta(html, 'name', 'twitter:image:alt', alt)

  // The width/height/type hints describe the default og-image only; drop them
  // for custom images whose dimensions we don't know (scrapers re-fetch anyway).
  if (img !== DEFAULT_IMAGE) {
    html = removeMeta(html, 'og:image:width')
    html = removeMeta(html, 'og:image:height')
    html = removeMeta(html, 'og:image:type')
  }
  return html
}

function writeRoute(path, html) {
  const dir = join(DIST, path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

const routes = []

// Projects — /projects/<slug>, from the program markdown frontmatter.
const programsDir = 'src/content/programs'
for (const file of readdirSync(programsDir)) {
  if (!file.endsWith('.md')) continue
  const raw = readFileSync(join(programsDir, file), 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) continue
  const data = yaml.load(match[1]) ?? {}
  const title = data.seo?.title ?? `${data.title} · Confluence Colorado`
  const description = data.seo?.description ?? `${data.title} — ${data.tagline}`
  routes.push({
    path: `/projects/${data.slug}`,
    title,
    description,
    image: data.heroImage,
    imageAlt: data.heroImageAlt,
    type: 'article',
  })
}

// Program areas — /program-areas/<slug>, from areas.yaml.
const areas = yaml.load(readFileSync('src/content/areas.yaml', 'utf8')) ?? []
for (const area of areas) {
  routes.push({
    path: `/program-areas/${area.slug}`,
    title: `${area.name} · Confluence Colorado`,
    description: area.description,
  })
}

// Main static routes.
routes.push(
  {
    path: '/about',
    title: 'About · Confluence Colorado',
    description:
      'Confluence Colorado is a Denver 501(c)(3) connecting youth to land, water, and community through environmental stewardship, watershed restoration, and outdoor education.',
  },
  {
    path: '/about/team',
    title: 'Our team · Confluence Colorado',
    description:
      'Meet the staff and board behind Confluence Colorado — the people connecting Denver youth to land, water, and community.',
  },
  {
    path: '/projects',
    title: 'Projects · Confluence Colorado',
    description:
      "Explore Confluence Colorado's projects — youth-led watershed restoration, outdoor education, and community stewardship across Denver and the South Platte.",
  },
  {
    path: '/impact',
    title: 'Impact · Confluence Colorado',
    description:
      'How Confluence Colorado connects Denver youth to land, water, and community — the reach and results of our programs.',
  },
  {
    path: '/get-involved',
    title: 'Get involved · Confluence Colorado',
    description:
      'Volunteer, partner, or bring your school to Confluence Colorado — ways to join youth-led environmental stewardship in Denver.',
  },
  {
    path: '/donate',
    title: 'Donate · Confluence Colorado',
    description:
      "Support Confluence Colorado's youth environmental programs. Your gift fuels watershed restoration, outdoor education, and community stewardship in Denver.",
  },
  {
    path: '/news',
    title: 'News · Confluence Colorado',
    description:
      'Short updates from the river, the field, and the work at Confluence Colorado — newest first.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy · Confluence Colorado',
    description: 'How Confluence Colorado handles your information.',
  }
)

for (const route of routes) {
  writeRoute(route.path, render(route))
}

console.log(`prerender-og: wrote ${routes.length} route HTML files`)
