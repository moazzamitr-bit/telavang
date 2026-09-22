import { useMemo, useState } from 'react'
import { Plus, Play, RotateCcw, Settings2, Wrench } from 'lucide-react'
import { AgentCard } from '@/components/agents/AgentCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { usePlatform } from '@/store/PlatformContext'
import { formatRelativeTime, toPersianDigits } from '@/lib/utils'
import type { Skill } from '@/data/types'

const categoryLabel: Record<Skill['category'], string> = {
  observe: 'مشاهده',
  analyze: 'تحلیل',
  recommend: 'پیشنهاد',
  execute: 'اجرا',
  learn: 'یادگیری',
}

export function AgentsPage() {
  const {
    agents,
    skills,
    actions,
    activity,
    selectedAgentId,
    setSelectedAgentId,
    updateAgent,
    toggleAgentEnabled,
    toggleAgentSkill,
    addSkill,
    addSkillToAgent,
    createAgent,
    runAgentNow,
    approveAction,
    rejectAction,
    resetWorkspace,
    pendingCount,
  } = usePlatform()

  const selected = agents.find((a) => a.id === selectedAgentId) ?? agents[0]
  const [tab, setTab] = useState<'tune' | 'skills' | 'queue' | 'log'>('tune')
  const [skillForm, setSkillForm] = useState({
    name: '',
    description: '',
    category: 'analyze' as Skill['category'],
    domain: 'operations',
  })
  const [agentForm, setAgentForm] = useState({
    name: '',
    role: '',
    roleFa: '',
    color: '#E86A17',
  })

  const activeCount = agents.filter((a) => a.enabled && a.status !== 'disabled').length
  const pending = useMemo(() => actions.filter((a) => a.status === 'pending'), [actions])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">استودیو ایجنت‌ها</h1>
          <p className="mt-1 text-sm text-ink-muted">
            تیون پارامترها، اتصال مهارت، ساخت ایجنت جدید و تأیید اقدامات اجرایی
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
            فعال {toPersianDigits(activeCount)}/{toPersianDigits(agents.length)}
          </div>
          <div className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
            صف تأیید{' '}
            <span className="font-bold text-telavang">{toPersianDigits(pendingCount)}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={resetWorkspace}>
            <RotateCcw className="h-3.5 w-3.5" />
            ریست فضای کاری
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <div className="space-y-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              selected={selected?.id === agent.id}
              onSelect={() => {
                setSelectedAgentId(agent.id)
                setTab('tune')
              }}
            />
          ))}

          <Card>
            <CardHeader title="ایجنت جدید" subtitle="اسکیل عملیاتی اضافه کنید" />
            <CardBody className="space-y-2">
              <input
                className="field"
                placeholder="نام فارسی"
                value={agentForm.name}
                onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
              />
              <input
                className="field"
                placeholder="نقش فارسی"
                value={agentForm.roleFa}
                onChange={(e) => setAgentForm({ ...agentForm, roleFa: e.target.value })}
              />
              <input
                className="field ltr text-left"
                placeholder="Role (EN)"
                value={agentForm.role}
                onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={agentForm.color}
                  onChange={(e) => setAgentForm({ ...agentForm, color: e.target.value })}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-white p-1"
                />
                <Button
                  className="flex-1"
                  size="sm"
                  disabled={!agentForm.name.trim()}
                  onClick={() => {
                    createAgent({
                      name: agentForm.name.trim(),
                      role: agentForm.role.trim() || 'Custom Agent',
                      roleFa: agentForm.roleFa.trim() || 'ایجنت سفارشی',
                      color: agentForm.color,
                    })
                    setAgentForm({ name: '', role: '', roleFa: '', color: '#E86A17' })
                    setTab('tune')
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  ساخت ایجنت
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          {selected ? (
            <>
              <Card>
                <CardBody className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold"
                      style={{ background: selected.color }}
                    >
                      {selected.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{selected.name}</h2>
                      <p className="text-xs text-ink-muted">
                        {selected.roleFa} · <span className="ltr">{selected.role}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={selected.enabled ? 'secondary' : 'primary'}
                      onClick={() => toggleAgentEnabled(selected.id)}
                    >
                      {selected.enabled ? 'غیرفعال کردن' : 'فعال کردن'}
                    </Button>
                    <Button size="sm" onClick={() => runAgentNow(selected.id)} disabled={!selected.enabled}>
                      <Play className="h-3.5 w-3.5" />
                      اجرای الآن
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['tune', 'تیون', Settings2],
                    ['skills', 'مهارت‌ها', Wrench],
                    ['queue', 'صف اقدامات', Play],
                    ['log', 'لاگ', RotateCcw],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      tab === id
                        ? 'border-telavang bg-telavang-light text-telavang-dark'
                        : 'border-border bg-white text-ink-secondary hover:bg-surface-muted'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    {id === 'queue' && pendingCount > 0 ? (
                      <span className="rounded-md bg-telavang px-1.5 py-0.5 text-[10px] text-white">
                        {toPersianDigits(pendingCount)}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {tab === 'tune' ? (
                <Card>
                  <CardHeader title="پارامترهای تصمیم" subtitle="تغییرات بلافاصله ذخیره می‌شوند" />
                  <CardBody className="space-y-5">
                    <SliderRow
                      label="سطح خودمختاری"
                      hint="اجازه اقدام بدون تأیید انسان"
                      value={selected.autonomy}
                      onChange={(v) => updateAgent(selected.id, { autonomy: v })}
                    />
                    <SliderRow
                      label="حساسیت هشدار"
                      hint="آستانه تشخیص ناهنجاری"
                      value={selected.sensitivity}
                      onChange={(v) => updateAgent(selected.id, { sensitivity: v })}
                    />
                    <SliderRow
                      label="بازه پایش (دقیقه)"
                      hint="فرکانس مشاهده داده"
                      value={selected.pollMinutes}
                      min={1}
                      max={120}
                      onChange={(v) => updateAgent(selected.id, { pollMinutes: v })}
                    />
                    <SliderRow
                      label="تأیید خودکار زیر (میلیون تومان)"
                      hint="اقدامات کم‌ریسک مالی"
                      value={selected.autoApproveBelowMillion}
                      min={0}
                      max={100}
                      onChange={(v) => updateAgent(selected.id, { autoApproveBelowMillion: v })}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-muted">دستورالعمل ایجنت</label>
                      <textarea
                        className="field min-h-28"
                        value={selected.instructions}
                        onChange={(e) => updateAgent(selected.id, { instructions: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-muted">وظیفه فعلی</label>
                      <input
                        className="field"
                        value={selected.currentTask}
                        onChange={(e) => updateAgent(selected.id, { currentTask: e.target.value })}
                      />
                    </div>
                  </CardBody>
                </Card>
              ) : null}

              {tab === 'skills' ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader title="مهارت‌های متصل" subtitle="فعال/غیرفعال برای این ایجنت" />
                    <CardBody className="space-y-2">
                      {skills.map((skill) => {
                        const on = selected.skillIds.includes(skill.id)
                        return (
                          <label
                            key={skill.id}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-surface-muted/50"
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggleAgentSkill(selected.id, skill.id)}
                              className="mt-1"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold">{skill.name}</p>
                                <Badge tone={skill.builtIn ? 'default' : 'orange'}>
                                  {skill.builtIn ? 'داخلی' : 'سفارشی'}
                                </Badge>
                                <Badge tone="info">{categoryLabel[skill.category]}</Badge>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-ink-muted">{skill.description}</p>
                            </div>
                          </label>
                        )
                      })}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader title="افزودن مهارت جدید" subtitle="Skill سفارشی به کاتالوگ" />
                    <CardBody className="space-y-2">
                      <input
                        className="field"
                        placeholder="نام مهارت"
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      />
                      <textarea
                        className="field min-h-24"
                        placeholder="توضیح عملکرد"
                        value={skillForm.description}
                        onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                      />
                      <select
                        className="field"
                        value={skillForm.category}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, category: e.target.value as Skill['category'] })
                        }
                      >
                        {Object.entries(categoryLabel).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <input
                        className="field"
                        placeholder="دامنه (مثلاً inventory)"
                        value={skillForm.domain}
                        onChange={(e) => setSkillForm({ ...skillForm, domain: e.target.value })}
                      />
                      <Button
                        disabled={!skillForm.name.trim() || !skillForm.description.trim()}
                        onClick={() => {
                          const skill = addSkill({
                            name: skillForm.name.trim(),
                            description: skillForm.description.trim(),
                            category: skillForm.category,
                            domain: skillForm.domain.trim() || 'custom',
                          })
                          addSkillToAgent(selected.id, skill.id)
                          setSkillForm({
                            name: '',
                            description: '',
                            category: 'analyze',
                            domain: 'operations',
                          })
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        ذخیره و اتصال به ایجنت
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ) : null}

              {tab === 'queue' ? (
                <Card>
                  <CardHeader title="صف تأیید اقدامات" subtitle="پیشنهادهای ایجنت‌ها برای اجرا" />
                  <CardBody className="space-y-3">
                    {pending.length === 0 ? (
                      <p className="text-sm text-ink-muted">اقدام معلقی وجود ندارد.</p>
                    ) : (
                      pending.map((action) => {
                        const agent = agents.find((a) => a.id === action.agentId)
                        return (
                          <div key={action.id} className="rounded-xl border border-border p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">{action.title}</p>
                                <p className="mt-1 text-xs text-ink-muted">{action.description}</p>
                                <p className="mt-2 text-[11px] text-ink-muted">
                                  {agent?.name} · {formatRelativeTime(Math.max(0, Math.round((Date.now() - action.createdAt) / 60000)))}
                                  {action.impactMillion
                                    ? ` · اثر ${toPersianDigits(action.impactMillion)} م تومان`
                                    : ''}
                                </p>
                              </div>
                              <Badge tone="warning">در انتظار</Badge>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" onClick={() => approveAction(action.id)}>
                                تأیید و اجرا
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => rejectAction(action.id)}>
                                رد
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}

                    <div className="border-t border-border pt-3">
                      <p className="mb-2 text-xs font-medium text-ink-muted">تاریخچه اخیر</p>
                      <div className="space-y-2">
                        {actions
                          .filter((a) => a.status !== 'pending')
                          .slice(0, 5)
                          .map((action) => (
                            <div
                              key={action.id}
                              className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-xs"
                            >
                              <span>{action.title}</span>
                              <Badge tone={action.status === 'executed' ? 'success' : 'default'}>
                                {action.status === 'executed' ? 'اجرا شد' : 'رد شد'}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : null}

              {tab === 'log' ? (
                <Card>
                  <CardHeader title="لاگ فعالیت فضای کاری" subtitle="ذخیره‌شده در مرورگر شما" />
                  <CardBody className="space-y-2">
                    {activity.slice(0, 25).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                      >
                        <p className="text-sm text-ink">{entry.message}</p>
                        <span className="shrink-0 text-[11px] text-ink-muted">
                          {formatRelativeTime(Math.max(0, Math.round((Date.now() - entry.at) / 60000)))}
                        </span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function SliderRow({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  label: string
  hint: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          <p className="text-[11px] text-ink-muted">{hint}</p>
        </div>
        <span className="rounded-lg bg-surface-muted px-2 py-1 text-sm font-semibold text-ink">
          {toPersianDigits(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-telavang"
      />
    </div>
  )
}
