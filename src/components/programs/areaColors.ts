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
    // bg/text use accessible ink shades so small chips (white-on-color and
    // color-on-white) meet AA; bgSoft/border/ring/gradient keep the bright brand sky.
    bg: 'bg-cc-sky-ink',
    bgSoft: 'bg-cc-sky/10',
    text: 'text-cc-sky-ink',
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
  sage: {
    bg: 'bg-cc-sage-ink',
    bgSoft: 'bg-cc-sage/10',
    text: 'text-cc-sage-ink',
    textOn: 'text-white',
    border: 'border-cc-sage',
    ring: 'ring-cc-sage',
    gradient: 'bg-gradient-to-br from-cc-sage to-cc-navy',
  },
  slate: {
    bg: 'bg-cc-slate',
    bgSoft: 'bg-cc-slate/10',
    text: 'text-cc-slate',
    textOn: 'text-white',
    border: 'border-cc-slate',
    ring: 'ring-cc-slate',
    gradient: 'bg-gradient-to-br from-cc-slate to-cc-dark',
  },
  stone: {
    bg: 'bg-cc-stone',
    bgSoft: 'bg-cc-stone/10',
    text: 'text-cc-stone',
    textOn: 'text-white',
    border: 'border-cc-stone',
    ring: 'ring-cc-stone',
    gradient: 'bg-gradient-to-br from-cc-stone to-cc-slate',
  },
}

export function areaColors(token: AreaColorToken): AreaColorClasses {
  return AREA_COLOR_CLASSES[token]
}
