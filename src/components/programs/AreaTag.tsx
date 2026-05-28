import { Link } from 'react-router-dom'
import type { Area } from '../../data/types'
import { areaColors } from './areaColors'

interface AreaTagProps {
  area: Area
  size?: 'sm' | 'md'
  variant?: 'solid' | 'outline'
  className?: string
}

export default function AreaTag({ area, size = 'sm', variant = 'solid', className = '' }: AreaTagProps) {
  const colors = areaColors(area.colorToken)
  const sizeClasses =
    size === 'sm'
      ? 'text-[0.7rem] px-2.5 py-1'
      : 'text-xs px-3 py-1.5'

  const variantClasses =
    variant === 'solid'
      ? `${colors.bg} ${colors.textOn} border-transparent`
      : `bg-white ${colors.text} ${colors.border}`

  return (
    <Link
      to={`/program-areas/${area.slug}`}
      className={`inline-flex items-center rounded-full border font-display font-semibold uppercase tracking-display transition-opacity hover:opacity-80 ${variantClasses} ${sizeClasses} ${className}`}
    >
      {size === 'sm' ? area.shortName : area.name}
    </Link>
  )
}
