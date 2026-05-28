import { programs } from './programs'
import { areas } from './areas'
import { newsPosts } from './news'

export type SearchResultType = 'Program' | 'Program Area' | 'News' | 'Page'

export interface SearchDoc {
  title: string
  type: SearchResultType
  href: string
  /** Short line shown under the title in results. */
  description: string
  /** Lowercased haystack of all searchable text for this doc. */
  haystack: string
}

const STATIC_PAGES: Omit<SearchDoc, 'haystack'>[] = [
  {
    title: 'Home',
    type: 'Page',
    href: '/',
    description: 'Connecting Denver youth to land, water, and community.',
  },
  {
    title: 'About Us',
    type: 'Page',
    href: '/about',
    description: 'Our mission, vision, and the people behind Confluence Colorado.',
  },
  {
    title: 'Team & Board',
    type: 'Page',
    href: '/about/team',
    description: 'Meet our staff, board, and program leads.',
  },
  {
    title: 'Programs',
    type: 'Page',
    href: '/programs',
    description: 'Browse all of our environmental stewardship programs.',
  },
  {
    title: 'Program Areas',
    type: 'Page',
    href: '/program-areas',
    description: 'The areas of work that organize our projects.',
  },
  {
    title: 'Impact',
    type: 'Page',
    href: '/impact',
    description: 'The change we are building toward, program by program.',
  },
  {
    title: 'News',
    type: 'Page',
    href: '/news',
    description: 'Updates and stories from the field.',
  },
  {
    title: 'Get Involved',
    type: 'Page',
    href: '/get-involved',
    description: 'Partner, fund, work, or volunteer with us.',
  },
  {
    title: 'Donate',
    type: 'Page',
    href: '/donate',
    description: 'Support youth-led environmental stewardship in Denver.',
  },
]

function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = []

  for (const p of programs) {
    docs.push({
      title: p.title,
      type: 'Program',
      href: `/programs/${p.slug}`,
      description: p.tagline,
      haystack: [
        p.title,
        p.shortName,
        p.tagline,
        ...p.areas,
        p.location?.neighborhoods?.join(' ') ?? '',
        p.partners?.join(' ') ?? '',
        p.body,
      ]
        .join(' ')
        .toLowerCase(),
    })
  }

  for (const a of areas) {
    docs.push({
      title: a.name,
      type: 'Program Area',
      href: `/program-areas/${a.slug}`,
      description: a.description,
      haystack: [a.name, a.shortName, a.description].join(' ').toLowerCase(),
    })
  }

  for (const post of newsPosts) {
    docs.push({
      title: post.title ?? 'News update',
      type: 'News',
      href: '/news',
      description: post.body.replace(/[#*_>`]/g, '').slice(0, 120).trim(),
      haystack: [post.title ?? '', post.body, post.tags?.join(' ') ?? '']
        .join(' ')
        .toLowerCase(),
    })
  }

  for (const page of STATIC_PAGES) {
    docs.push({
      ...page,
      haystack: [page.title, page.description].join(' ').toLowerCase(),
    })
  }

  return docs
}

const DOCS = buildDocs()

export function search(query: string, limit = 8): SearchDoc[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  const terms = q.split(/\s+/).filter(Boolean)

  const scored = DOCS.map((doc) => {
    const title = doc.title.toLowerCase()
    let score = 0

    for (const term of terms) {
      if (!doc.haystack.includes(term)) {
        // A term that appears nowhere disqualifies the doc.
        return { doc, score: -1 }
      }
      if (title === term) score += 12
      else if (title.startsWith(term)) score += 8
      else if (title.includes(term)) score += 5
      else score += 1
    }

    // Lightly favor more specific content over index pages.
    if (doc.type === 'Program') score += 1

    return { doc, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc)
}
