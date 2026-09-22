import { AgentCard } from '@/components/agents/AgentCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { agents } from '@/data/mockData'
import { toPersianDigits } from '@/lib/utils'

export function AgentsPage() {
  const active = agents.filter((a) => a.status === 'active' || a.status === 'thinking' || a.status === 'alert').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">ایجنت‌های هوشمند</h1>
          <p className="mt-1 text-sm text-ink-muted">نیروی کار AI که کل عملیات تلاونگ را پایش و بهینه‌سازی می‌کند</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-4 py-2 text-sm">
          <span className="text-ink-muted">فعال: </span>
          <span className="font-bold text-telavang">{toPersianDigits(active)} از {toPersianDigits(agents.length)}</span>
        </div>
      </div>

      <Card>
        <CardHeader title="چرخه تصمیم‌گیری ایجنتی" subtitle="از مشاهده تا یادگیری" />
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            {['مشاهده', 'درک', 'پیش‌بینی', 'پیشنهاد', 'درخواست تأیید', 'اجرا', 'یادگیری'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-ink">
                  <span className="ml-1 text-telavang">{toPersianDigits(i + 1)}</span>
                  {step}
                </div>
                {i < 6 ? <span className="text-ink-muted/40">←</span> : null}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
