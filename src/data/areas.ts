import yaml from 'js-yaml'
import areasYaml from '../content/areas.yaml?raw'
import type { Area } from './types'

const parsed = yaml.load(areasYaml)
if (!Array.isArray(parsed)) {
  throw new Error('areas.yaml must contain a YAML list at the top level')
}

export const areas: Area[] = parsed as Area[]

export const areaBySlug: Record<string, Area> = Object.fromEntries(
  areas.map((a) => [a.slug, a])
)

export function getArea(slug: string): Area | undefined {
  return areaBySlug[slug]
}
