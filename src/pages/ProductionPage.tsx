import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { OptimizeScenarioVisual } from '@/components/ai/ScenarioVisuals'
import { Link } from 'react-router-dom'
import { toPersianDigits } from '@/lib/utils'

export function ProductionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">تولید و برنامه‌ریزی</h1>
        <p className="mt-1 text-sm text-ink-muted">تخصیص ظرفیت، برنامه‌ریزی فردا و بهینه‌سازی ترکیب محصول</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: 'ظرفیت فرآوری امروز', value: '۸۷٪', hint: 'نزدیک سقف شیفت دوم' },
          { label: 'برنامه فردا', value: 'آماده بهینه‌سازی', hint: 'پیشنهاد ایجنت تولید موجود است' },
          { label: 'واریانس هفتگی', value: '۴.۸٪−', hint: 'عمدتاً از مزرعه ۰۳' },
        ].map((item) => (
          <Card key={item.label}>
            <CardBody>
              <p className="text-xs text-ink-muted">{item.label}</p>
              <p className="mt-1 text-xl font-bold">{item.value}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{item.hint}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="پیشنهاد بهینه‌سازی فردا"
            subtitle="بر اساس تقاضا، حاشیه، موجودی و ظرفیت"
            action={<Badge tone="orange">ایجنت تولید</Badge>}
          />
          <CardBody className="space-y-4">
            <OptimizeScenarioVisual />
            <Link to="/">
              <Button>اعمال برنامه تولید</Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="منطق تصمیم" subtitle="چرا این تخصیص؟" />
          <CardBody className="space-y-3 text-sm leading-7 text-ink-secondary">
            <p>
              <strong className="text-ink">Shell Egg ۶۲٪ → ۵۶٪:</strong> تقاضای پوسته‌ای پایدار است اما حاشیه پایین‌تری دارد؛ کاهش جزئی بدون ریسک OTIF.
            </p>
            <p>
              <strong className="text-ink">Liquid Egg ۱۷٪ → ۲۱٪:</strong> سفارش‌های B2B باز (هایپرمی و رفاه) ظرفیت بیشتری می‌طلبند.
            </p>
            <p>
              <strong className="text-ink">Telara/Telaroll ۱۲٪ → ۱۴٪:</strong> حاشیه بالاتر و جذب ظرفیت فرآوری آزادشده.
            </p>
            <div className="rounded-xl bg-success-bg p-3 text-success">
              اثر تخمینی: حاشیه {toPersianDigits('18.7')}٪ → {toPersianDigits('19.1')}٪ و کاهش فشار روی موجودی در معرض انقضا.
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
