import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { feedBatches, feedCoverage } from '@/data/mockData'
import { toPersianDigits } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import { Link } from 'react-router-dom'

const statusMap = {
  ok: { label: 'تأیید شده', tone: 'success' as const },
  investigating: { label: 'در حال بررسی', tone: 'warning' as const },
  quarantine: { label: 'قرنطینه', tone: 'danger' as const },
}

export function FeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">خوراک و تأمین</h1>
        <p className="mt-1 text-sm text-ink-muted">پوشش موجودی، کیفیت بچ خوراک و همبستگی با عملکرد گله</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="پوشش خوراک به تفکیک مزرعه" subtitle="حداقل هدف: ۱۰ روز" />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedCoverage} layout="vertical" margin={{ right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="farm" width={70} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn' }} />
                <ReferenceLine x={10} stroke="#B45309" strokeDasharray="4 4" />
                <Bar dataKey="days" fill="#E86A17" radius={[0, 6, 6, 0]} name="روز پوشش" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="بینش ایجنت خوراک" subtitle="همبستگی‌های اخیر" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-warning/30 bg-warning-bg/50 p-4">
              <p className="text-sm font-semibold text-warning">Feed Batch FB-8821</p>
              <p className="mt-1 text-xs leading-6 text-ink-secondary">
                همزمان با افت تولید Flock L218. مصرف خوراک طبیعی است، اما وزن تخم‌مرغ ۴.۲٪ کاهش یافته.
                همبستگی شناسایی شده — علت قطعی نیست. بررسی QC توصیه می‌شود.
              </p>
              <Link to="/command">
                <Button size="sm" className="mt-3">ایجاد بررسی QC</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold">پوشش کل شبکه</p>
              <p className="mt-1 text-2xl font-bold text-ink">{toPersianDigits('11.6')} روز</p>
              <p className="text-xs text-ink-muted">مزرعه ۰۳ نزدیک آستانه هشدار است</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="بچ‌های خوراک" subtitle="وضعیت کیفی و تخصیص مزرعه" />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-right text-xs text-ink-muted">
                  <th className="pb-3 font-medium">شناسه</th>
                  <th className="pb-3 font-medium">تأمین‌کننده</th>
                  <th className="pb-3 font-medium">تاریخ دریافت</th>
                  <th className="pb-3 font-medium">مقدار</th>
                  <th className="pb-3 font-medium">پروتئین</th>
                  <th className="pb-3 font-medium">مزارع</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {feedBatches.map((batch) => (
                  <tr key={batch.id} className="border-b border-border/70">
                    <td className="py-3 ltr text-left font-semibold">{batch.id}</td>
                    <td className="py-3">{batch.supplier}</td>
                    <td className="py-3">{batch.receivedAt}</td>
                    <td className="py-3">{toPersianDigits(batch.quantityTons)} تن</td>
                    <td className="py-3">{toPersianDigits(batch.proteinPct)}٪</td>
                    <td className="py-3 ltr text-left text-xs">{batch.farmIds.join(', ')}</td>
                    <td className="py-3">
                      <Badge tone={statusMap[batch.status].tone}>{statusMap[batch.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
