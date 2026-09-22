import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Bot, Loader2, Sparkles, User } from 'lucide-react'
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

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
    <div className="flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(26,29,33,0.06)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-telavang text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-ink">فرمانده عملیات تلاونگ</h1>
            <p className="text-xs text-ink-muted">Observe → Understand → Predict → Recommend → Approve → Execute</p>
          </div>
        </div>
        <Badge tone="orange">ایجنت ارکستراتور</Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  msg.role === 'user'
                    ? 'bg-charcoal text-white'
                    : msg.role === 'system'
                      ? 'bg-success-bg text-success'
                      : 'bg-telavang-light text-telavang',
                )}
              >
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={cn('max-w-[860px] flex-1 space-y-3', msg.role === 'user' ? 'items-end' : '')}>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm leading-7',
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

                {msg.dataAnalyzed && msg.dataAnalyzed.length > 0 ? (
                  <div className="rounded-xl border border-border bg-white p-3">
                    <p className="mb-2 text-[11px] font-medium text-ink-muted">داده‌های تحلیل‌شده</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.dataAnalyzed.map((d) => (
                        <span key={d} className="rounded-md bg-surface-muted px-2 py-1 text-[11px] text-ink-secondary">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {msg.metrics && msg.metrics.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {msg.metrics.map((m) => (
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

                {msg.scenario === 'production' ? <ProductionScenarioVisual /> : null}
                {msg.scenario === 'shelf' ? <ShelfScenarioVisual /> : null}
                {msg.scenario === 'trace' ? <TraceGraph /> : null}
                {msg.scenario === 'optimize' ? <OptimizeScenarioVisual /> : null}

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
            در حال هماهنگی ایجنت‌ها و تحلیل داده‌های عملیاتی...
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-white px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="rounded-full border border-border bg-surface-muted/70 px-3 py-1.5 text-[11px] text-ink-secondary transition hover:border-telavang/40 hover:bg-telavang-light hover:text-telavang-dark"
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
            placeholder="از فرمانده عملیات بپرسید..."
            className="h-11 flex-1 rounded-xl border border-border bg-surface-muted/40 px-4 text-sm outline-none transition focus:border-telavang/50 focus:bg-white focus:ring-2 focus:ring-telavang/15"
          />
          <Button type="submit" className="h-11 w-11 shrink-0 rounded-xl p-0" disabled={!input.trim() || thinking}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
