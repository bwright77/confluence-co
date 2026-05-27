import type { AreaColorToken } from '../../data/types'

export interface AreaColorClasses {
  bg: string
  bgSoft: string
  text: string
  textOn: string
  border: string
  ring: string
  gradient: string
}

export const AREA_COLOR_CLASSES: Record<AreaColorToken, AreaColorClasses> = {
  'burnt-copper': {
    bg: 'bg-cc-orange',
    bgSoft: 'bg-cc-orange/10',
    text: 'text-cc-orange',
    textOn: 'text-white',
    border: 'border-cc-orange',
    ring: 'ring-cc-orange',
    gradient: 'bg-gradient-to-br from-cc-orange to-cc-orange/70',
  },
  'river-blue': {
    bg: 'bg-cc-sky',
    bgSoft: 'bg-cc-sky/10',
    text: 'text-cc-sky',
    textOn: 'text-white',
    border: 'border-cc-sky',
    ring: 'ring-cc-sky',
    gradient: 'bg-gradient-to-br from-cc-sky to-cc-navy',
  },
  'deep-teal': {
    bg: 'bg-cc-navy',
    bgSoft: 'bg-cc-navy/10',
    text: 'text-cc-navy',
    textOn: 'text-white',
    border: 'border-cc-navy',
    ring: 'ring-cc-navy',
    gradient: 'bg-gradient-to-br from-cc-navy to-cc-sky',
  },
}

export function areaColors(token: AreaColorToken): AreaColorClasses {
  return AREA_COLOR_CLASSES[token]
}
