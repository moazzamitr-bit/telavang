import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import type { Kpi } from '@/data/types'

const deltaColor = {
  up: 'text-success',
  down: 'text-danger',
  warning: 'text-warning',
  neutral: 'text-ink-muted',
}

export function KpiCard({
  kpi,
  index = 0,
  icon,
}: {
  kpi: Kpi
  index?: number
  icon?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(26,29,33,0.04)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-ink-muted">{kpi.label}</p>
        {icon ? <div className="text-telavang">{icon}</div> : null}
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight text-ink">{kpi.value}</p>
      {kpi.delta ? (
        <p className={cn('mt-1.5 text-xs font-medium', deltaColor[kpi.deltaType ?? 'neutral'])}>
          {kpi.delta}
        </p>
      ) : null}
      {kpi.hint ? <p className="mt-2 text-[11px] text-ink-muted">{kpi.hint}</p> : null}
    </motion.div>
  )
}
