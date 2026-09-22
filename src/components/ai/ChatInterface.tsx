import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Bot, Loader2, MessageCircle, Sparkles, User, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TraceGraph } from '@/components/ai/TraceGraph'
import {
  OptimizeScenarioVisual,
  ProductionScenarioVisual,
  ShelfScenarioVisual,
} from '@/components/ai/ScenarioVisuals'
import { suggestedQuestions } from '@/data/mockData'
import { actionFeedback, createWelcomeMessage, resolveScenario } from '@/data/scenarios'
import type { ChatMessage } from '@/data/types'
import { cn } from '@/lib/utils'

type Variant = 'page' | 'panel'

export function ChatInterface({ variant = 'page' }: { variant?: Variant }) {
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isPanel = variant === 'panel'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const ask = (question: string) => {
    const q = question.trim()
    if (!q || thinking) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      setMessages((prev) => [...prev, resolveScenario(q)])
      setThinking(false)
    }, 900)
  }

  const onAction = (actionId: string) => {
    if (actionId === 'goto-prod') return ask('چرا تولید این هفته افت کرده؟')
    if (actionId === 'goto-shelf') return ask('کدام محصولات در معرض انقضا هستند؟')
    if (actionId === 's1') return ask('چرا تولید این هفته افت کرده؟')
    if (actionId === 's2') return ask('کدام محصولات در معرض انقضا هستند؟')
    if (actionId === 's3') return ask('Feed Batch FB-782 را رهگیری کن')

    setMessages((prev) => [...prev, actionFeedback(actionId)])
  }

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden bg-white',
        isPanel
          ? 'h-full'
          : 'h-[calc(100vh-7.5rem)] rounded-2xl border border-border shadow-[0_8px_30px_rgba(26,29,33,0.06)]',
      )}
    >
      {!isPanel ? (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-telavang text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-ink">فرمانده عملیات تلاونگ</h1>
              <p className="text-xs text-ink-muted">
                Observe → Understand → Predict → Recommend → Approve → Execute
              </p>
            </div>
          </div>
          <Badge tone="orange">ایجنت ارکستراتور</Badge>
        </div>
      ) : null}

      <div className={cn('flex-1 space-y-3 overflow-y-auto', isPanel ? 'px-3 py-3' : 'space-y-4 px-5 py-5')}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-lg',
                  isPanel ? 'h-7 w-7' : 'h-8 w-8',
                  msg.role === 'user'
                    ? 'bg-charcoal text-white'
                    : msg.role === 'system'
                      ? 'bg-success-bg text-success'
                      : 'bg-telavang-light text-telavang',
                )}
              >
                {msg.role === 'user' ? (
                  <User className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                ) : (
                  <Bot className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                )}
              </div>

              <div className={cn('min-w-0 flex-1 space-y-2', msg.role === 'user' ? 'items-end' : '')}>
                <div
                  className={cn(
                    'rounded-2xl text-sm leading-7',
                    isPanel ? 'px-3 py-2.5 text-[13px] leading-6' : 'px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-charcoal text-white'
                      : msg.role === 'system'
                        ? 'border border-success/20 bg-success-bg text-success'
                        : 'border border-border bg-surface-muted/60 text-ink',
                  )}
                >
                  {msg.content}
                </div>

                {msg.agents && msg.agents.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.agents.map((a) => (
                      <Badge key={a.id} tone="orange">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {msg.dataAnalyzed && msg.dataAnalyzed.length > 0 && !isPanel ? (
                  <div className="rounded-xl border border-border bg-white p-3">
                    <p className="mb-2 text-[11px] font-medium text-ink-muted">داده‌های تحلیل‌شده</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.dataAnalyzed.map((d) => (
                        <span
                          key={d}
                          className="rounded-md bg-surface-muted px-2 py-1 text-[11px] text-ink-secondary"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {msg.metrics && msg.metrics.length > 0 ? (
                  <div
                    className={cn(
                      'grid gap-2',
                      isPanel ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4',
                    )}
                  >
                    {msg.metrics.slice(0, isPanel ? 4 : undefined).map((m) => (
                      <div key={m.label} className="rounded-xl border border-border bg-white p-2.5">
                        <p className="text-[10px] text-ink-muted">{m.label}</p>
                        <p
                          className={cn(
                            'mt-0.5 text-sm font-semibold',
                            m.tone === 'danger' && 'text-danger',
                            m.tone === 'warning' && 'text-warning',
                            m.tone === 'success' && 'text-success',
                          )}
                        >
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {!isPanel && msg.scenario === 'production' ? <ProductionScenarioVisual /> : null}
                {!isPanel && msg.scenario === 'shelf' ? <ShelfScenarioVisual /> : null}
                {!isPanel && msg.scenario === 'trace' ? <TraceGraph /> : null}
                {!isPanel && msg.scenario === 'optimize' ? <OptimizeScenarioVisual /> : null}

                {msg.recommendation ? (
                  <div className="rounded-xl border border-telavang/25 bg-telavang-light/40 p-3">
                    <p className="text-[11px] font-medium text-telavang-dark">پیشنهاد</p>
                    <p className="mt-1 text-sm text-ink">{msg.recommendation}</p>
                    {msg.impact ? (
                      <p className="mt-2 text-xs font-medium text-success">اثر تخمینی: {msg.impact}</p>
                    ) : null}
                  </div>
                ) : null}

                {msg.actions && msg.actions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        variant={
                          action.type === 'danger'
                            ? 'danger'
                            : action.type === 'secondary'
                              ? 'secondary'
                              : 'primary'
                        }
                        onClick={() => onAction(action.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {thinking ? (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin text-telavang" />
            در حال تحلیل...
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className={cn('border-t border-border bg-white', isPanel ? 'px-3 py-3' : 'px-5 py-4')}>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestedQuestions.slice(0, isPanel ? 3 : undefined).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="rounded-full border border-border bg-surface-muted/70 px-2.5 py-1 text-[10px] text-ink-secondary transition hover:border-telavang/40 hover:bg-telavang-light hover:text-telavang-dark"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="از دستیار بپرسید..."
            className={cn(
              'flex-1 rounded-xl border border-border bg-surface-muted/40 px-3 text-sm outline-none transition focus:border-telavang/50 focus:bg-white focus:ring-2 focus:ring-telavang/15',
              isPanel ? 'h-10' : 'h-11 px-4',
            )}
          />
          <Button
            type="submit"
            className={cn('shrink-0 rounded-xl p-0', isPanel ? 'h-10 w-10' : 'h-11 w-11')}
            disabled={!input.trim() || thinking}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto flex h-[min(640px,calc(100vh-7rem))] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_48px_rgba(26,29,33,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-border bg-charcoal px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-telavang">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">دستیار هوشمند تلاونگ</p>
                  <p className="text-[10px] text-white/55">فرمانده عملیات · آنلاین</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ChatInterface variant="panel" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto group relative flex items-center gap-2.5 rounded-full bg-telavang px-4 py-3 text-white shadow-[0_10px_30px_rgba(232,106,23,0.45)]"
        aria-label="دستیار هوشمند"
      >
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        </span>
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold">دستیار هوشمند</span>
      </motion.button>
    </div>
  )
}
