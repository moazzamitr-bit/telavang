import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ShelfScenarioVisual } from '@/components/ai/ScenarioVisuals'
import { inventoryLots, products, warehouses } from '@/data/mockData'
import { toPersianDigits } from '@/lib/utils'

export function InventoryPage() {
  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? id
  const warehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name ?? id

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">موجودی و زنجیره سرد</h1>
        <p className="mt-1 text-sm text-ink-muted">FEFO، عمر قفسه، دمای سردخانه و ریسک ضایعات</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {warehouses.map((wh) => (
          <Card key={wh.id}>
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{wh.name}</p>
                <span className="ltr text-[10px] text-ink-muted">{wh.id}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-ink">
                {toPersianDigits(wh.tempC)}°C
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                اشغال ظرفیت {toPersianDigits(wh.capacityUtilization)}٪
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-telavang" style={{ width: `${wh.capacityUtilization}%` }} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="بهینه‌سازی عمر قفسه"
            subtitle="پیشنهاد ایجنت موجودی"
            action={<Badge tone="danger">ریسک بالا</Badge>}
          />
          <CardBody className="space-y-4">
            <ShelfScenarioVisual />
            <Link to="/command">
              <Button>تأیید انتقال</Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="لات‌های موجودی" subtitle="مرتب‌سازی بر اساس ریسک FEFO" />
          <CardBody className="space-y-2">
            {inventoryLots.map((lot) => (
              <div key={lot.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{productName(lot.productId)}</p>
                    <p className="ltr text-left text-[11px] text-ink-muted">{lot.id} · {lot.productionBatchId}</p>
                  </div>
                  <Badge
                    tone={
                      lot.status === 'at_risk' ? 'danger' : lot.status === 'quarantine' ? 'warning' : 'success'
                    }
                  >
                    {lot.status === 'at_risk' ? 'در ریسک' : lot.status === 'quarantine' ? 'قرنطینه' : 'عادی'}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-secondary">
                  <span>{toPersianDigits(lot.quantity)} واحد</span>
                  <span>{toPersianDigits(lot.remainingShelfLifeDays)} روز</span>
                  <span>{warehouseName(lot.warehouseId)}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
