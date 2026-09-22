import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { TraceGraph } from '@/components/ai/TraceGraph'
import { qualityAlerts } from '@/data/mockData'
import { formatRelativeTime } from '@/lib/utils'

export function QualityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">کیفیت و رهگیری</h1>
        <p className="mt-1 text-sm text-ink-muted">رهگیری بچ، هشدارهای کیفیت و اقدامات پیشگیرانه</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {qualityAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <Badge tone={alert.severity === 'high' ? 'danger' : 'warning'}>
                  {alert.severity === 'high' ? 'بالا' : 'متوسط'}
                </Badge>
                <span className="text-[11px] text-ink-muted">{formatRelativeTime(alert.createdMinutesAgo)}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{alert.title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{alert.source}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {alert.relatedIds.map((id) => (
                  <span key={id} className="ltr rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium">
                    {id}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="رهگیری Feed Batch FB-782"
          subtitle="از خوراک تا مشتری — ۳ بچ تولید · ۴ لات انبار · ۲ محموله · ۳ مشتری"
          action={
            <Link to="/">
              <Button size="sm" variant="secondary">باز کردن در فرمانده</Button>
            </Link>
          }
        />
        <CardBody className="space-y-4">
          <TraceGraph />
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" size="sm">قرنطینه موجودی</Button>
            <Button variant="secondary" size="sm">توقف ارسال</Button>
            <Button size="sm">ایجاد CAPA</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
