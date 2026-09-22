import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Egg,
  Package,
  Percent,
  ShieldAlert,
  Thermometer,
  Truck,
  Wheat,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { KpiCard } from '@/components/ui/KpiCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { homeKpis, productionTrend } from '@/data/mockData'
import { formatRelativeTime, toPersianDigits } from '@/lib/utils'
import { usePlatform } from '@/store/PlatformContext'

const kpiIcons = [
  <Egg className="h-4 w-4" key="1" />,
  <Wheat className="h-4 w-4" key="2" />,
  <Package className="h-4 w-4" key="3" />,
  <AlertTriangle className="h-4 w-4" key="4" />,
  <ShieldAlert className="h-4 w-4" key="5" />,
  <Truck className="h-4 w-4" key="6" />,
  <Percent className="h-4 w-4" key="7" />,
]

export function OperationsOverviewPage() {
  const { agents, qualityAlerts, actions, approveAction, rejectAction, pendingCount } = usePlatform()
  const pending = actions.filter((a) => a.status === 'pending').slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">مرکز عملیات هوشمند تلاونگ</h1>
          <p className="mt-1 text-sm text-ink-muted">
            تصویر لحظه‌ای از تولید، کیفیت، موجودی، فروش و سودآوری
          </p>
        </div>
        {pendingCount > 0 ? (
          <Link to="/agents">
            <Badge tone="orange">{toPersianDigits(pendingCount)} اقدام در صف تأیید</Badge>
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {homeKpis.map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} icon={kpiIcons[i]} />
        ))}
      </div>

      {pending.length > 0 ? (
        <Card>
          <CardHeader
            title="نیازمند تصمیم شما"
            subtitle="پیشنهادهای ایجنت‌ها — تأیید یا رد کنید"
            action={
              <Link to="/agents">
                <Button size="sm" variant="secondary">استودیو ایجنت</Button>
              </Link>
            }
          />
          <CardBody className="grid gap-3 md:grid-cols-3">
            {pending.map((action) => (
              <div key={action.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold text-ink">{action.title}</p>
                <p className="mt-1 text-xs text-ink-muted">{action.description}</p>
                {action.impactMillion ? (
                  <p className="mt-2 text-xs font-medium text-success">
                    اثر: {toPersianDigits(action.impactMillion)} م تومان
                  </p>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => approveAction(action.id)}>
                    تأیید
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => rejectAction(action.id)}>
                    رد
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="روند تولید هفته"
            subtitle="برنامه در برابر واقعی — هفت مزرعه یکپارچه"
            action={<Badge tone="warning">واریانس فعال</Badge>}
          />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrend}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E86A17" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#E86A17" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8A8F96' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8A8F96' }}
                  tickFormatter={(v) => toPersianDigits(Math.round(v / 1000)) + 'ک'}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E8E6E3', fontFamily: 'Vazirmatn' }}
                  formatter={(value) => toPersianDigits(Number(value).toLocaleString('en-US'))}
                />
                <Area type="monotone" dataKey="planned" stroke="#D4D1CC" strokeWidth={2} fill="transparent" name="برنامه" />
                <Area type="monotone" dataKey="actual" stroke="#E86A17" strokeWidth={2.5} fill="url(#actualFill)" name="واقعی" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="هشدارهای اولویت‌دار" subtitle="وضعیت زنده فضای کاری" />
          <CardBody className="space-y-3">
            {qualityAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{alert.title}</p>
                  <Badge tone={alert.severity === 'high' ? 'danger' : 'warning'}>
                    {alert.severity === 'high' ? 'بالا' : 'متوسط'}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">
                  {alert.source} · {formatRelativeTime(alert.createdMinutesAgo)}
                </p>
              </div>
            ))}
            <Link to="/command">
              <Button variant="soft" className="mt-1 w-full" size="sm">
                باز کردن فرمانده عملیات
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="وضعیت نیروی ایجنت" subtitle="قابل تیون در استودیو" />
          <CardBody className="space-y-2">
            {agents.slice(0, 5).map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: agent.color }} />
                  <div>
                    <p className="text-sm font-medium text-ink">{agent.name}</p>
                    <p className="text-[11px] text-ink-muted">{agent.currentTask}</p>
                  </div>
                </div>
                <span className="text-xs text-ink-muted">{toPersianDigits(agent.confidence)}٪</span>
              </div>
            ))}
            <Link to="/agents" className="block pt-1 text-center text-xs font-medium text-telavang hover:underline">
              باز کردن استودیو ایجنت‌ها
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="زنجیره ارزش تلاونگ"
            subtitle="از تأمین خوراک تا سودآوری"
            action={<Thermometer className="h-4 w-4 text-telavang" />}
          />
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {[
                'خوراک',
                'مزرعه',
                'گله',
                'تولید',
                'کیفیت',
                'درجه‌بندی',
                'فرآوری',
                'بسته‌بندی',
                'انبار',
                'زنجیره سرد',
                'توزیع',
                'فروش',
                'مالی',
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-surface-muted px-2.5 py-1.5 text-xs font-medium text-ink">
                    {step}
                  </span>
                  {i < 12 ? <span className="text-ink-muted/40">←</span> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-ink-secondary">
              تغییرات شما در استودیو، صف تأیید و اقدامات اجرایی در مرورگر ذخیره می‌شوند و بین صفحات همگام‌اند.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
