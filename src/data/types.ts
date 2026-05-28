export type ProgramStatus = 'active' | 'completed'

export type AreaColorToken =
  | 'burnt-copper'
  | 'river-blue'
  | 'deep-teal'
  | 'sage'
  | 'slate'
  | 'stone'

export interface Area {
  slug: string
  name: string
  shortName: string
  description: string
  colorToken: AreaColorToken
  icon: string
}

export interface Funder {
  name: string
  shortName: string
  program: string
  amount: number
  amountDisplay: string
  term: string
  type: string
}

export interface Location {
  city: string
  neighborhoods: string[]
  watershed: string
}

export interface Target {
  label: string
  value: number
  unit: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface Cta {
  primary?: CtaLink
  secondary?: CtaLink
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface ProgramSeo {
  title?: string
  description?: string
}

export interface Program {
  title: string
  slug: string
  shortName: string
  tagline: string

  status: ProgramStatus
  startDate: string
  endDate: string | null
  featured: boolean

  /** Program areas this project fits into — any number, no primary/lead. */
  areas: string[]

  funder?: Funder
  location?: Location
  leadStaff?: string[]
  partners?: string[]
  targets?: Target[]
  cta?: Cta

  heroImage?: string
  heroImageAlt?: string
  gallery?: GalleryImage[]

  seo?: ProgramSeo

  body: string
}
