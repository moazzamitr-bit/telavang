import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const layers = [
  {
    title: 'خوراک',
    nodes: [{ id: 'FB-782', label: 'Feed Batch', sub: 'FB-782', highlight: true }],
  },
  {
    title: 'مزرعه',
    nodes: [{ id: 'F04', label: 'Farm 04', sub: 'مازندران' }],
  },
  {
    title: 'گله',
    nodes: [
      { id: 'L219', label: 'Flock', sub: 'L219' },
      { id: 'L220', label: 'Flock', sub: 'L220' },
    ],
  },
  {
    title: 'لات تخم',
    nodes: [
      { id: 'EL-3381', label: 'Egg Lot', sub: 'EL-3381' },
      { id: 'EL-3382', label: 'Egg Lot', sub: 'EL-3382' },
      { id: 'EL-3387', label: 'Egg Lot', sub: 'EL-3387' },
    ],
  },
  {
    title: 'فرآوری',
    nodes: [
      { id: 'PB-981', label: 'Processing', sub: 'PB-981' },
      { id: 'PB-982', label: 'Processing', sub: 'PB-982' },
    ],
  },
  {
    title: 'محصول',
    nodes: [
      { id: 'liq', label: 'Liquid Egg', sub: 'مایع' },
      { id: 'telara', label: 'Telara', sub: 'تلارا' },
      { id: 'telaroll', label: 'Telaroll', sub: 'تلارول' },
    ],
  },
  {
    title: 'سفارش',
    nodes: [
      { id: 'ORD-44382', label: 'Order', sub: 'ORD-44382' },
      { id: 'ORD-44397', label: 'Order', sub: 'ORD-44397' },
      { id: 'ORD-44401', label: 'Order', sub: 'ORD-44401' },
    ],
  },
]

export function TraceGraph() {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
      <p className="mb-4 text-xs font-medium text-ink-muted">گراف رهگیری کامل — از خوراک تا مشتری</p>
      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={layer.title}>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="w-16 shrink-0 text-[11px] text-ink-muted">{layer.title}</span>
              {layer.nodes.map((node) => (
                <div
                  key={node.id}
                  className={cn(
                    'rounded-lg border bg-white px-3 py-2 shadow-sm',
                    'highlight' in node && node.highlight
                      ? 'border-telavang ring-2 ring-telavang/20'
                      : 'border-border',
                  )}
                >
                  <div className="text-[11px] text-ink-muted">{node.label}</div>
                  <div className="ltr text-left text-xs font-semibold text-ink">{node.sub}</div>
                </div>
              ))}
            </motion.div>
            {i < layers.length - 1 ? (
              <div className="my-1 flex justify-center text-ink-muted/50">
                <ArrowDown className="h-3.5 w-3.5" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
