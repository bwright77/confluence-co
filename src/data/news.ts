import yaml from 'js-yaml'
import newsYaml from '../content/news.yaml?raw'

export interface NewsPostLink {
  label: string
  href: string
}

export interface NewsPost {
  id: string
  date: string
  title?: string
  body: string
  image?: string
  imageAlt?: string
  /** "cover" (default) crops to a 4:3/16:9 frame; "contain" shows the full image without cropping. */
  imageFit?: 'cover' | 'contain'
  link?: NewsPostLink
  tags?: string[]
}

const parsed = yaml.load(newsYaml)
if (!Array.isArray(parsed)) {
  throw new Error('news.yaml must contain a YAML list at the top level')
}

export const newsPosts: NewsPost[] = (parsed as NewsPost[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
