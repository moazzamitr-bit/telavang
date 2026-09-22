import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { orders, products } from '@/data/mockData'
import { toPersianDigits } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const demandForecast = [
  { day: 'امروز', demand: 118 },
  { day: 'فردا', demand: 132 },
  { day: 'پس‌فردا', demand: 126 },
  { day: 'چهارشنبه', demand: 141 },
  { day: 'پنجشنبه', demand: 138 },
  { day: 'جمعه', demand: 110 },
  { day: 'شنبه', demand: 124 },
]

const statusLabel = {
  pending: 'در انتظار',
  shipped: 'ارسال‌شده',
  delivered: 'تحویل‌شده',
}

export function SalesPage() {
  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? id

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">فروش و تقاضا</h1>
        <p className="mt-1 text-sm text-ink-muted">سفارش‌های B2B، پیش‌بینی تقاضا و هم‌راستایی با تولید</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'سفارش‌های باز', value: '۳', hint: 'ارزش ۲۴۶ میلیون تومان' },
          { label: 'تحویل به‌موقع', value: '۹۲.۴٪', hint: '+۱.۲٪ نسبت به ماه قبل' },
          { label: 'تقاضای ۷ روزه', value: '۸۸۹ م', hint: 'پیش‌بینی ایجنت فروش' },
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
          <CardHeader title="پیش‌بینی تقاضا" subtitle="میلیون تومان — ۷ روز آینده" />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn' }} />
                <Bar dataKey="demand" fill="#E86A17" radius={[6, 6, 0, 0]} name="تقاضا" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="سفارش‌های B2B" />
          <CardBody className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ltr text-left text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-ink-muted">{order.customerName}</p>
                  </div>
                  <Badge
                    tone={
                      order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'
                    }
                  >
                    {statusLabel[order.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-ink-secondary">
                  {order.products.map((p) => `${productName(p.productId)} (${toPersianDigits(p.quantity)})`).join(' · ')}
                </p>
                <div className="mt-2 flex justify-between text-xs">
                  <span>{toPersianDigits(order.valueMillion)} میلیون تومان</span>
                  <span className="text-ink-muted">موعد: {order.dueDate}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
