import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { marginByProduct } from '@/data/mockData'
import { toPersianDigits } from '@/lib/utils'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">مالی و سودآوری</h1>
        <p className="mt-1 text-sm text-ink-muted">حاشیه محصول، ریسک موجودی و اثر تصمیم‌های ایجنتی</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'حاشیه پیش‌بینی‌شده', value: '۱۸.۷٪', hint: 'با بهینه‌سازی → ۱۹.۱٪', tone: 'success' },
          { label: 'موجودی در ریسک', value: '۱۲۶ م', hint: 'قابل اجتناب ۷۸ م', tone: 'warning' },
          { label: 'ضایعات هفته', value: '۲۴ م', hint: 'هدف: زیر ۱۸ م', tone: 'danger' },
          { label: 'اثر پیشنهادات باز', value: '+۰.۸٪', hint: 'حاشیه بالقوه', tone: 'success' },
        ].map((k) => (
          <Card key={k.label}>
            <CardBody>
              <p className="text-xs text-ink-muted">{k.label}</p>
              <p className="mt-1 text-xl font-bold">{k.value}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{k.hint}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="حاشیه به تفکیک محصول" subtitle="درصد حاشیه ناخالص" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn' }} />
                <Bar dataKey="margin" radius={[6, 6, 0, 0]} name="حاشیه ٪">
                  {marginByProduct.map((entry) => (
                    <Cell key={entry.name} fill={entry.margin >= 25 ? '#1F7A4D' : entry.margin >= 18 ? '#E86A17' : '#8A8F96'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="اثر تصمیم‌های پیشنهادی"
            subtitle="تخمین ایجنت مالی"
            action={<Badge tone="orange">Margin Intelligence</Badge>}
          />
          <CardBody className="space-y-3">
            {[
              {
                title: 'تأیید انتقال تلاویچ',
                impact: 'اجتناب از ۷۸ میلیون تومان ضایعات',
                status: 'در انتظار تأیید',
              },
              {
                title: 'اعمال برنامه تولید فردا',
                impact: `افزایش حاشیه حدود ${toPersianDigits('0.4')} واحد درصدی`,
                status: 'آماده اجرا',
              },
              {
                title: 'بررسی QC خوراک FB-8821',
                impact: 'کاهش ریسک افت تولید ادامه‌دار در مزرعه ۰۳',
                status: 'پیشنهاد شده',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <Badge tone="info">{item.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-success">{item.impact}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
