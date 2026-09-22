import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react'
import { cn, toPersianDigits } from '@/lib/utils'

export function ProductionScenarioVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricBox label="تولید برنامه‌ای" value="۹۱,۴۰۰" />
      <MetricBox label="تولید واقعی" value="۸۴,۹۲۰" tone="warning" />
      <MetricBox label="واریانس" value="۷.۱٪−" tone="danger" icon={<TrendingDown className="h-3.5 w-3.5" />} />
      <div className="sm:col-span-3 rounded-xl border border-border bg-white p-3 text-sm">
        <div className="flex flex-wrap gap-4">
          <span>
            <span className="text-ink-muted">مزرعه: </span>
            <span className="ltr font-semibold">Farm 03</span>
          </span>
          <span>
            <span className="text-ink-muted">گله: </span>
            <span className="ltr font-semibold">Flock L218</span>
          </span>
          <span>
            <span className="text-ink-muted">خوراک: </span>
            <span className="ltr font-semibold">FB-8821</span>
          </span>
          <span>
            <span className="text-ink-muted">وزن تخم: </span>
            <span className="font-semibold text-warning">۴.۲٪−</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-secondary">
          همبستگی زمانی با تعویض Feed Batch شناسایی شد. علت قطعی تأیید نشده — بررسی QC توصیه می‌شود.
        </p>
      </div>
    </div>
  )
}

export function ShelfScenarioVisual() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricBox label="تلاویچ در ریسک" value="۱,۸۴۰ واحد" tone="warning" />
        <MetricBox label="عمر باقی‌مانده" value="۲.۱ روز" tone="danger" />
        <MetricBox label="ارزش ریسک" value="۱۲۶ م تومان" tone="danger" />
      </div>
      <div className="rounded-xl border border-dashed border-telavang/40 bg-telavang-light/50 p-3">
        <p className="text-xs font-medium text-telavang-dark">پیشنهاد انتقال FEFO</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg bg-white px-2.5 py-1 border border-border ltr">720 units</span>
          <span className="text-ink-muted">از</span>
          <span className="rounded-lg bg-white px-2.5 py-1 border border-border">Warehouse A</span>
          <span className="text-ink-muted">به</span>
          <span className="rounded-lg bg-white px-2.5 py-1 border border-border">DC East</span>
        </div>
        <p className="mt-2 text-xs text-success font-medium">ضایعات قابل اجتناب: ۷۸ میلیون تومان</p>
      </div>
    </div>
  )
}

export function OptimizeScenarioVisual() {
  const rows = [
    { name: 'Shell Egg', from: 62, to: 56, reason: 'تقاضای پایدار + حاشیه پایین‌تر' },
    { name: 'Liquid Egg', from: 17, to: 21, reason: 'سفارش‌های B2B باز + حاشیه بهتر' },
    { name: 'Telara / Telaroll', from: 12, to: 14, reason: 'جذب ظرفیت فرآوری و حاشیه بالا' },
  ]

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.name} className="rounded-xl border border-border bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="ltr text-sm font-semibold">{row.name}</span>
            <span className="flex items-center gap-1 text-sm">
              <span className="text-ink-muted">{toPersianDigits(row.from)}٪</span>
              <span>→</span>
              <span className={cn('font-bold', row.to > row.from ? 'text-success' : 'text-warning')}>
                {toPersianDigits(row.to)}٪
              </span>
              {row.to > row.from ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-warning" />
              )}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-ink-muted">{row.reason}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${row.to}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-telavang"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function MetricBox({
  label,
  value,
  tone = 'default',
  icon,
}: {
  label: string
  value: string
  tone?: 'default' | 'warning' | 'danger' | 'success'
  icon?: ReactNode
}) {
  const tones = {
    default: 'text-ink',
    warning: 'text-warning',
    danger: 'text-danger',
    success: 'text-success',
  }
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className={cn('mt-1 flex items-center gap-1 text-lg font-bold', tones[tone])}>
        {icon}
        {value}
      </p>
    </div>
  )
}

export function ActionSuccessBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-success/20 bg-success-bg px-3 py-2.5 text-sm text-success">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
