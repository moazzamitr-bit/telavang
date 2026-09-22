import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Agent } from '@/data/types'
import { formatRelativeTime, toPersianDigits } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusMap = {
  active: { label: 'فعال', tone: 'success' as const },
  idle: { label: 'آماده', tone: 'default' as const },
  alert: { label: 'هشدار', tone: 'warning' as const },
  thinking: { label: 'در حال تحلیل', tone: 'info' as const },
}

export function AgentCard({ agent }: { agent: Agent }) {
  const status = statusMap[agent.status]

  return (
    <Card className="overflow-hidden">
      <div className="h-1" style={{ background: agent.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: agent.color }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">{agent.name}</h3>
              <p className="text-[11px] text-ink-muted ltr text-left">{agent.role}</p>
            </div>
          </div>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>

        <div className="mt-4 space-y-2.5">
          <div>
            <p className="text-[11px] text-ink-muted">وظیفه فعلی</p>
            <p className="mt-0.5 text-sm text-ink">{agent.currentTask}</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">آخرین فعالیت: {formatRelativeTime(agent.lastActivityMinutes)}</span>
            <span className={cn('font-medium', agent.confidence >= 90 ? 'text-success' : 'text-warning')}>
              اطمینان {toPersianDigits(agent.confidence)}٪
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${agent.confidence}%`, background: agent.color }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
