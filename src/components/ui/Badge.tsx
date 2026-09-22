import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const tones = {
  default: 'bg-surface-muted text-ink-secondary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  info: 'bg-info-bg text-info',
  orange: 'bg-telavang-light text-telavang-dark',
}

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
