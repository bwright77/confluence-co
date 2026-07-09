import yaml from 'js-yaml'
import type { Program } from './types'
import { areaBySlug } from './areas'

const rawFiles = import.meta.glob('/src/content/programs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = FRONTMATTER_RE.exec(raw)
  if (!match) {
    return { data: {}, body: raw }
  }
  const data = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  return { data, body: match[2] ?? '' }
}

function fail(filename: string, message: string): never {
  throw new Error(`[programs.ts] ${filename}: ${message}`)
}

function validateProgram(
  data: Record<string, unknown>,
  body: string,
  filename: string,
  expectedSlug: string
): Program {
  const required = [
    'title',
    'slug',
    'shortName',
    'tagline',
    'status',
    'startDate',
    'featured',
    'areas',
  ] as const

  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      fail(filename, `missing required frontmatter field "${key}"`)
    }
  }

  if (data.slug !== expectedSlug) {
    fail(filename, `slug "${data.slug as string}" does not match filename "${expectedSlug}"`)
  }

  const status = data.status as string
  if (status !== 'active' && status !== 'completed') {
    fail(filename, `status must be one of active|completed (got "${status}")`)
  }

  if (status === 'completed' && !data.endDate) {
    fail(filename, `completed programs must have endDate set`)
  }

  if (!Array.isArray(data.areas) || data.areas.length === 0) {
    fail(filename, `areas must be a non-empty list of program-area slugs`)
  }
  const areas = data.areas as string[]

  const seen = new Set<string>()
  for (const slug of areas) {
    if (!areaBySlug[slug]) {
      fail(filename, `areas contains "${slug}" which is not in areas.yaml`)
    }
    if (seen.has(slug)) {
      fail(filename, `areas contains duplicate "${slug}"`)
    }
    seen.add(slug)
  }

  if (data.heroImage && !data.heroImageAlt) {
    fail(filename, `heroImage requires heroImageAlt`)
  }

  if (!('endDate' in data)) {
    fail(filename, `endDate is required (set to null for ongoing programs)`)
  }

  return {
    title: data.title as string,
    slug: data.slug as string,
    shortName: data.shortName as string,
    tagline: data.tagline as string,
    status: status as Program['status'],
    startDate: data.startDate as string,
    endDate: (data.endDate as string | null) ?? null,
    featured: Boolean(data.featured),
    areas,
    funder: data.funder as Program['funder'],
    location: data.location as Program['location'],
    leadStaff: data.leadStaff as string[] | undefined,
    communityLeaders: data.communityLeaders as string[] | undefined,
    partners: data.partners as string[] | undefined,
    targets: data.targets as Program['targets'],
    cta: data.cta as Program['cta'],
    heroImage: data.heroImage as string | undefined,
    heroImageAlt: data.heroImageAlt as string | undefined,
    gallery: data.gallery as Program['gallery'],
    seo: data.seo as Program['seo'],
    body: body.trim(),
  }
}

function filenameFromPath(path: string): string {
  return path.split('/').pop() ?? path
}

function slugFromPath(path: string): string {
  return filenameFromPath(path).replace(/\.md$/, '')
}

const loaded: Program[] = Object.entries(rawFiles).map(([path, raw]) => {
  const expectedSlug = slugFromPath(path)
  const filename = filenameFromPath(path)
  const { data, body } = parseFrontmatter(raw)
  return validateProgram(data, body, filename, expectedSlug)
})

loaded.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0))

export const programs: Program[] = loaded

export const programBySlug: Record<string, Program> = Object.fromEntries(
  programs.map((p) => [p.slug, p])
)

// hasOwnProperty guards against inherited keys — programBySlug['constructor']
// would otherwise return Object's constructor instead of undefined.
export function getProgram(slug: string): Program | undefined {
  return Object.prototype.hasOwnProperty.call(programBySlug, slug) ? programBySlug[slug] : undefined
}

export function programsByArea(areaSlug: string): Program[] {
  return programs.filter((p) => p.areas.includes(areaSlug))
}

export const featuredPrograms: Program[] = programs.filter((p) => p.featured)
export const activePrograms: Program[] = programs.filter((p) => p.status === 'active')
