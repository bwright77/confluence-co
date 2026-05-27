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
    'primaryArea',
    'secondaryAreas',
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
  if (status !== 'active' && status !== 'upcoming' && status !== 'completed') {
    fail(filename, `status must be one of active|upcoming|completed (got "${status}")`)
  }

  if (status === 'completed' && !data.endDate) {
    fail(filename, `completed programs must have endDate set`)
  }

  const primaryArea = data.primaryArea as string
  if (!areaBySlug[primaryArea]) {
    fail(filename, `primaryArea "${primaryArea}" is not in areas.yaml`)
  }

  if (!Array.isArray(data.secondaryAreas)) {
    fail(filename, `secondaryAreas must be a list`)
  }
  const secondaryAreas = data.secondaryAreas as string[]

  for (const slug of secondaryAreas) {
    if (!areaBySlug[slug]) {
      fail(filename, `secondaryAreas contains "${slug}" which is not in areas.yaml`)
    }
    if (slug === primaryArea) {
      fail(filename, `primaryArea "${primaryArea}" must not also appear in secondaryAreas`)
    }
  }

  if (secondaryAreas.length > 4) {
    console.warn(
      `[programs.ts] ${filename}: secondaryAreas has ${secondaryAreas.length} entries — cap is 4 (soft warning)`
    )
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
    primaryArea,
    secondaryAreas,
    funder: data.funder as Program['funder'],
    location: data.location as Program['location'],
    leadStaff: data.leadStaff as string[] | undefined,
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

export function getProgram(slug: string): Program | undefined {
  return programBySlug[slug]
}

export interface ProgramsByAreaOptions {
  includeSecondary?: boolean
}

export function programsByArea(
  areaSlug: string,
  opts: ProgramsByAreaOptions = {}
): Program[] {
  const includeSecondary = opts.includeSecondary ?? false
  return programs.filter((p) => {
    if (p.primaryArea === areaSlug) return true
    if (includeSecondary && p.secondaryAreas.includes(areaSlug)) return true
    return false
  })
}

export const featuredPrograms: Program[] = programs.filter((p) => p.featured)
export const activePrograms: Program[] = programs.filter((p) => p.status === 'active')
