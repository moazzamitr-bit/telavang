import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { farms, flocks } from '@/data/mockData'
import { formatNumber, formatPercent, toPersianDigits } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const statusTone = {
  optimal: 'success' as const,
  watch: 'warning' as const,
  critical: 'danger' as const,
  healthy: 'success' as const,
  alert: 'danger' as const,
}

const statusLabel = {
  optimal: 'بهینه',
  watch: 'نیازمند مراقبت',
  critical: 'بحرانی',
  healthy: 'سالم',
  alert: 'هشدار',
}

export function FarmsPage() {
  const chartData = flocks
    .filter((f) => f.farmId === 'F03' || f.id === 'L218')
    .map((f) => ({
      name: f.id,
      expected: f.expectedProduction,
      actual: f.actualProduction,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">مزارع و گله‌ها</h1>
        <p className="mt-1 text-sm text-ink-muted">پایش عملکرد مزرعه، سلامت گله و نرخ تولید</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farms.map((farm) => (
          <Card key={farm.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="ltr text-left text-xs text-ink-muted">{farm.id}</p>
                  <h3 className="text-base font-semibold">{farm.name}</h3>
                  <p className="text-xs text-ink-muted">{farm.region}</p>
                </div>
                <Badge tone={statusTone[farm.status]}>{statusLabel[farm.status]}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Stat label="نرخ تولید" value={`${toPersianDigits(farm.productionRate)}٪`} />
                <Stat label="مرگ‌ومیر" value={`${toPersianDigits(farm.mortality)}٪`} />
                <Stat label="امتیاز سلامت" value={toPersianDigits(farm.healthScore)} />
                <Stat label="گله فعال" value={toPersianDigits(farm.activeFlocks)} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="گله‌های تحت پایش" subtitle="تمرکز روی مزرعه ۰۳ و گله‌های مرتبط" />
          <CardBody className="space-y-2">
            {flocks.map((flock) => (
              <div key={flock.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="ltr font-semibold text-sm">{flock.id}</span>
                    <span className="mx-2 text-ink-muted">·</span>
                    <span className="ltr text-xs text-ink-muted">{flock.farmId}</span>
                  </div>
                  <Badge tone={statusTone[flock.status]}>{statusLabel[flock.status]}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <span>تولید: {toPersianDigits(flock.productionRate)}٪</span>
                  <span>وزن تخم: {toPersianDigits(flock.eggWeight)}g</span>
                  <span className="ltr">Feed: {flock.feedBatchId}</span>
                </div>
                {flock.id === 'L218' ? (
                  <p className="mt-2 text-xs text-danger">
                    واریانس {formatPercent(-7.1)} — واقعی {formatNumber(flock.actualProduction)} در برابر برنامه {formatNumber(flock.expectedProduction)}
                  </p>
                ) : null}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="مقایسه برنامه و واقعی — مزرعه ۰۳" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn' }} />
                <Bar dataKey="expected" fill="#D4D1CC" name="برنامه" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" fill="#E86A17" name="واقعی" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted px-2.5 py-2">
      <p className="text-[10px] text-ink-muted">{label}</p>
      <p className="font-semibold text-ink">{value}</p>
    </div>
  )
}
