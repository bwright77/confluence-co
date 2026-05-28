import type { ProgramStatus } from '../../data/types'

interface StatusBadgeProps {
  status: ProgramStatus
  size?: 'sm' | 'md'
  className?: string
}

const STATUS_CONFIG: Record<
  ProgramStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  active: {
    label: 'Active',
    bg: 'bg-cc-sky',
    text: 'text-white',
    border: 'border-cc-sky',
    dot: 'bg-white',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-cc-stone/15',
    text: 'text-cc-stone',
    border: 'border-cc-stone/30',
    dot: 'bg-cc-stone',
  },
}

export default function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  const sizeClasses =
    size === 'sm'
      ? 'text-[0.7rem] px-2.5 py-1'
      : 'text-xs px-3 py-1.5'

  const role = status === 'active' ? 'status' : undefined

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-display font-semibold uppercase tracking-display ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses} ${className}`}
      role={role}
      aria-label={`Program status: ${cfg.label}`}
    >
      <span className={`block h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}
