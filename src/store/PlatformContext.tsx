import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  agents as seedAgentRuntime,
  inventoryLots as seedLots,
  qualityAlerts as seedAlerts,
} from '@/data/mockData'
import { defaultAgentConfigs, defaultSkills, seedActions } from '@/data/agentStudio'
import type {
  ActivityEntry,
  Agent,
  AgentStatus,
  InventoryLot,
  ProductionPlan,
  QualityAlert,
  Skill,
  WorkAction,
  WorkActionStatus,
} from '@/data/types'

const STORAGE_KEY = 'telavang-ai-os-v1'

interface PersistedState {
  agents: Agent[]
  skills: Skill[]
  actions: WorkAction[]
  activity: ActivityEntry[]
  inventoryLots: InventoryLot[]
  qualityAlerts: QualityAlert[]
  productionPlan: ProductionPlan
  shipmentsStopped: boolean
}

interface PlatformContextValue extends PersistedState {
  selectedAgentId: string | null
  setSelectedAgentId: (id: string | null) => void
  updateAgent: (id: string, patch: Partial<Agent>) => void
  toggleAgentEnabled: (id: string) => void
  toggleAgentSkill: (agentId: string, skillId: string) => void
  addSkill: (skill: Omit<Skill, 'id' | 'builtIn' | 'version'> & { version?: string }) => Skill
  addSkillToAgent: (agentId: string, skillId: string) => void
  createAgent: (input: { name: string; role: string; roleFa: string; color: string }) => Agent
  runAgentNow: (agentId: string) => void
  approveAction: (id: string) => void
  rejectAction: (id: string) => void
  enqueueAction: (action: Omit<WorkAction, 'id' | 'createdAt' | 'status'>) => WorkAction
  executeChatAction: (actionId: string) => string
  resetWorkspace: () => void
  pendingCount: number
}

const PlatformContext = createContext<PlatformContextValue | null>(null)

function buildInitialAgents(): Agent[] {
  return defaultAgentConfigs.map((cfg) => {
    const runtime = seedAgentRuntime.find((a) => a.id === cfg.id)
    return {
      ...cfg,
      status: cfg.enabled ? (runtime?.status as Agent['status']) ?? 'idle' : 'disabled',
      currentTask: runtime?.currentTask ?? 'آماده به کار',
      lastActivityMinutes: runtime?.lastActivityMinutes ?? 0,
      confidence: runtime?.confidence ?? 85,
    }
  })
}

function buildInitial(): PersistedState {
  return {
    agents: buildInitialAgents(),
    skills: structuredClone(defaultSkills),
    actions: structuredClone(seedActions),
    activity: [
      {
        id: 'act-boot',
        at: Date.now() - 60000,
        message: 'فضای کاری عملیات بارگذاری شد — ۸ ایجنت و ۱۰ مهارت آماده',
        tone: 'info',
      },
    ],
    inventoryLots: structuredClone(seedLots),
    qualityAlerts: structuredClone(seedAlerts),
    productionPlan: { shellEgg: 62, liquidEgg: 17, processed: 12, applied: false },
    shipmentsStopped: false,
  }
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildInitial()
    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed.agents?.length || !parsed.skills?.length) return buildInitial()
    return parsed
  } catch {
    return buildInitial()
  }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() =>
    typeof window === 'undefined' ? buildInitial() : loadState(),
  )
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('orchestrator')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const pushActivity = useCallback(
    (message: string, tone: ActivityEntry['tone'] = 'info', agentId?: string) => {
      setState((prev) => ({
        ...prev,
        activity: [{ id: uid('act'), at: Date.now(), message, tone, agentId }, ...prev.activity].slice(
          0,
          80,
        ),
      }))
    },
    [],
  )

  const updateAgent = useCallback((id: string, patch: Partial<Agent>) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }))
  }, [])

  const toggleAgentEnabled = useCallback(
    (id: string) => {
      setState((prev) => {
        const agents: Agent[] = prev.agents.map((a) => {
          if (a.id !== id) return a
          const enabled = !a.enabled
          const status: AgentStatus = enabled
            ? a.status === 'disabled'
              ? 'idle'
              : a.status
            : 'disabled'
          return {
            ...a,
            enabled,
            status,
            currentTask: enabled ? a.currentTask : 'غیرفعال توسط کاربر',
          }
        })
        const agent = agents.find((a) => a.id === id)
        const entry: ActivityEntry = {
          id: uid('act'),
          at: Date.now(),
          message: agent?.enabled
            ? `${agent.name} فعال شد`
            : `${agent?.name ?? 'ایجنت'} غیرفعال شد`,
          tone: agent?.enabled ? 'success' : 'warning',
          agentId: id,
        }
        return {
          ...prev,
          agents,
          activity: [entry, ...prev.activity].slice(0, 80),
        }
      })
    },
    [],
  )

  const toggleAgentSkill = useCallback((agentId: string, skillId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => {
        if (a.id !== agentId) return a
        const has = a.skillIds.includes(skillId)
        return {
          ...a,
          skillIds: has ? a.skillIds.filter((s) => s !== skillId) : [...a.skillIds, skillId],
        }
      }),
    }))
  }, [])

  const addSkill = useCallback(
    (input: Omit<Skill, 'id' | 'builtIn' | 'version'> & { version?: string }) => {
      const skill: Skill = {
        ...input,
        id: uid('sk'),
        builtIn: false,
        version: input.version ?? '1.0',
      }
      setState((prev) => {
        const entry: ActivityEntry = {
          id: uid('act'),
          at: Date.now(),
          message: `مهارت جدید اضافه شد: ${skill.name}`,
          tone: 'success',
        }
        return {
          ...prev,
          skills: [skill, ...prev.skills],
          activity: [entry, ...prev.activity].slice(0, 80),
        }
      })
      return skill
    },
    [],
  )

  const addSkillToAgent = useCallback((agentId: string, skillId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === agentId && !a.skillIds.includes(skillId)
          ? { ...a, skillIds: [...a.skillIds, skillId] }
          : a,
      ),
    }))
  }, [])

  const createAgent = useCallback(
    (input: { name: string; role: string; roleFa: string; color: string }) => {
      const agent: Agent = {
        id: uid('agent'),
        name: input.name,
        role: input.role,
        roleFa: input.roleFa,
        color: input.color,
        enabled: true,
        status: 'idle',
        currentTask: 'آماده پیکربندی',
        lastActivityMinutes: 0,
        confidence: 80,
        autonomy: 40,
        sensitivity: 50,
        pollMinutes: 15,
        autoApproveBelowMillion: 0,
        instructions: 'دستورالعمل را تکمیل کنید و مهارت‌های مورد نیاز را متصل کنید.',
        skillIds: ['sk-observe-kpis'],
        domains: ['custom'],
      }
      setState((prev) => {
        const entry: ActivityEntry = {
          id: uid('act'),
          at: Date.now(),
          message: `ایجنت جدید ساخته شد: ${agent.name}`,
          tone: 'success',
          agentId: agent.id,
        }
        return {
          ...prev,
          agents: [...prev.agents, agent],
          activity: [entry, ...prev.activity].slice(0, 80),
        }
      })
      setSelectedAgentId(agent.id)
      return agent
    },
    [],
  )

  const runAgentNow = useCallback(
    (agentId: string) => {
      const agent = state.agents.find((a) => a.id === agentId)
      if (!agent || !agent.enabled) return
      const skillCount = agent.skillIds.length
      updateAgent(agentId, {
        status: 'thinking',
        currentTask: `اجرای ${skillCount} مهارت متصل...`,
        lastActivityMinutes: 0,
        confidence: Math.min(99, agent.confidence + 1),
      })
      window.setTimeout(() => {
        updateAgent(agentId, {
          status: agent.id === 'farm' || agent.id === 'inventory' ? 'alert' : 'active',
          currentTask: `آخرین اجرا موفق — ${skillCount} مهارت`,
          lastActivityMinutes: 0,
        })
        pushActivity(`${agent.name}: اجرای دستی انجام شد`, 'success', agentId)
      }, 1200)
    },
    [pushActivity, state.agents, updateAgent],
  )

  const applyExecutionSideEffects = useCallback((action: WorkAction, nextStatus: WorkActionStatus) => {
    setState((prev) => {
      let inventoryLots = prev.inventoryLots
      let qualityAlerts = prev.qualityAlerts
      let productionPlan = prev.productionPlan
      let shipmentsStopped = prev.shipmentsStopped
      let agents = prev.agents

      if (nextStatus === 'executed') {
        if (action.type === 'transfer' && action.payload?.lotId) {
          const qty = Number(action.payload.qty ?? 0)
          const source = inventoryLots.find((l) => l.id === action.payload?.lotId)
          inventoryLots = inventoryLots.map((lot) => {
            if (lot.id !== action.payload?.lotId) return lot
            const remaining = Math.max(0, lot.quantity - qty)
            const ratio = lot.quantity > 0 ? remaining / lot.quantity : 0
            return {
              ...lot,
              quantity: remaining,
              riskValueMillion: Math.round(lot.riskValueMillion * ratio),
              status: remaining < 500 ? 'ok' : lot.status,
            }
          })
          if (source && qty > 0) {
            inventoryLots = [
              ...inventoryLots,
              {
                ...source,
                id: uid('LOT'),
                quantity: qty,
                warehouseId: String(action.payload?.to ?? 'DC-E'),
                riskValueMillion: 0,
                status: 'ok',
              },
            ]
          }
          agents = agents.map((a) =>
            a.id === 'inventory'
              ? { ...a, status: 'active', currentTask: 'انتقال FEFO اجرا شد', lastActivityMinutes: 0 }
              : a,
          )
        }

        if (action.type === 'qc') {
          qualityAlerts = [
            {
              id: uid('QA'),
              title: `پرونده QC برای ${String(action.payload?.feedBatchId ?? 'بچ خوراک')}`,
              severity: 'high',
              source: 'ایجنت کیفیت',
              relatedIds: [
                String(action.payload?.feedBatchId ?? ''),
                String(action.payload?.flockId ?? ''),
              ].filter(Boolean),
              createdMinutesAgo: 0,
              status: 'investigating',
            },
            ...qualityAlerts,
          ]
          agents = agents.map((a) =>
            a.id === 'quality' || a.id === 'feed'
              ? {
                  ...a,
                  status: 'active',
                  currentTask: `بررسی QC ${String(action.payload?.feedBatchId ?? '')}`,
                  lastActivityMinutes: 0,
                }
              : a,
          )
        }

        if (action.type === 'quarantine') {
          inventoryLots = inventoryLots.map((lot) =>
            lot.productionBatchId.startsWith('PB-98') || lot.id === 'LOT-Q782'
              ? { ...lot, status: 'quarantine' }
              : lot,
          )
        }

        if (action.type === 'stop_ship') {
          shipmentsStopped = true
        }

        if (action.type === 'production_plan') {
          productionPlan = {
            shellEgg: Number(action.payload?.shellEgg ?? 56),
            liquidEgg: Number(action.payload?.liquidEgg ?? 21),
            processed: Number(action.payload?.processed ?? 14),
            applied: true,
            updatedAt: Date.now(),
          }
          agents = agents.map((a) =>
            a.id === 'production'
              ? { ...a, status: 'active', currentTask: 'برنامه فردا اعمال شد', lastActivityMinutes: 0 }
              : a,
          )
        }

        if (action.type === 'capa') {
          qualityAlerts = qualityAlerts.map((q) =>
            q.id === 'QA-294' ? { ...q, status: 'investigating' } : q,
          )
        }
      }

      const exists = prev.actions.some((a) => a.id === action.id)
      const updatedAction: WorkAction = {
        ...action,
        status: nextStatus,
        executedAt: nextStatus === 'executed' ? Date.now() : action.executedAt,
      }
      const actions = exists
        ? prev.actions.map((a) => (a.id === action.id ? updatedAction : a))
        : [updatedAction, ...prev.actions]

      const entry: ActivityEntry = {
        id: uid('act'),
        at: Date.now(),
        message:
          nextStatus === 'executed'
            ? `اجرا شد: ${action.title}`
            : nextStatus === 'rejected'
              ? `رد شد: ${action.title}`
              : `تأیید شد: ${action.title}`,
        tone: nextStatus === 'rejected' ? 'warning' : 'success',
        agentId: action.agentId,
      }

      return {
        ...prev,
        inventoryLots,
        qualityAlerts,
        productionPlan,
        shipmentsStopped,
        agents,
        actions,
        activity: [entry, ...prev.activity].slice(0, 80),
      }
    })
  }, [])

  const approveAction = useCallback(
    (id: string) => {
      const action = state.actions.find((a) => a.id === id)
      if (!action || action.status !== 'pending') return
      applyExecutionSideEffects(action, 'executed')
    },
    [applyExecutionSideEffects, state.actions],
  )

  const rejectAction = useCallback(
    (id: string) => {
      const action = state.actions.find((a) => a.id === id)
      if (!action || action.status !== 'pending') return
      applyExecutionSideEffects(action, 'rejected')
    },
    [applyExecutionSideEffects, state.actions],
  )

  const enqueueAction = useCallback((action: Omit<WorkAction, 'id' | 'createdAt' | 'status'>) => {
    const full: WorkAction = {
      ...action,
      id: uid('wa'),
      createdAt: Date.now(),
      status: 'pending',
    }
    setState((prev) => {
      const entry: ActivityEntry = {
        id: uid('act'),
        at: Date.now(),
        message: `اقدام جدید در صف تأیید: ${full.title}`,
        tone: 'info',
        agentId: full.agentId,
      }
      return {
        ...prev,
        actions: [full, ...prev.actions],
        activity: [entry, ...prev.activity].slice(0, 80),
      }
    })
    return full
  }, [])

  const executeChatAction = useCallback((actionId: string) => {
    const map: Record<
      string,
      Omit<WorkAction, 'id' | 'createdAt' | 'status'> & { doneMessage: string }
    > = {
      'create-qc': {
        title: 'ایجاد بررسی QC برای FB-8821',
        description: 'از فرمانده عملیات',
        agentId: 'quality',
        type: 'qc',
        impactMillion: 0,
        payload: { feedBatchId: 'FB-8821', flockId: 'L218' },
        doneMessage:
          'پرونده QC برای FB-8821 ایجاد شد و وضعیت هشدارها به‌روز گردید.',
      },
      'approve-transfer': {
        title: 'انتقال ۷۲۰ واحد تلاویچ به DC شرق',
        description: 'از فرمانده عملیات',
        agentId: 'inventory',
        type: 'transfer',
        impactMillion: 78,
        payload: { lotId: 'LOT-8821', qty: 720, from: 'WH-A', to: 'DC-E' },
        doneMessage: 'انتقال ۷۲۰ واحد اجرا شد. موجودی انبارها به‌روزرسانی گردید.',
      },
      quarantine: {
        title: 'قرنطینه موجودی مرتبط با FB-782',
        description: 'از فرمانده عملیات',
        agentId: 'quality',
        type: 'quarantine',
        doneMessage: 'موجودی مرتبط قرنطینه شد و وضعیت لات‌ها قفل گردید.',
      },
      'stop-ship': {
        title: 'توقف ارسال‌های مرتبط با FB-782',
        description: 'از فرمانده عملیات',
        agentId: 'quality',
        type: 'stop_ship',
        doneMessage: 'ارسال‌های باز متوقف شد. پرچم توقف ارسال فعال است.',
      },
      'create-capa': {
        title: 'ایجاد پرونده CAPA',
        description: 'از فرمانده عملیات',
        agentId: 'quality',
        type: 'capa',
        doneMessage: 'پرونده CAPA ایجاد و به مدیر کیفیت ارجاع شد.',
      },
      'apply-plan': {
        title: 'اعمال برنامه تولید فردا',
        description: 'از فرمانده عملیات',
        agentId: 'production',
        type: 'production_plan',
        impactMillion: 12,
        payload: { shellEgg: 56, liquidEgg: 21, processed: 14 },
        doneMessage: 'برنامه تولید فردا اعمال شد و در ماژول تولید قابل مشاهده است.',
      },
    }

    const template = map[actionId]
    if (!template) return 'اقدام ثبت شد.'

    const { doneMessage, ...rest } = template
    const action: WorkAction = {
      ...rest,
      id: uid('wa'),
      createdAt: Date.now(),
      status: 'pending',
    }
    applyExecutionSideEffects(action, 'executed')
    return doneMessage
  }, [applyExecutionSideEffects])

  const resetWorkspace = useCallback(() => {
    const fresh = buildInitial()
    setState(fresh)
    setSelectedAgentId('orchestrator')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const pendingCount = useMemo(
    () => state.actions.filter((a) => a.status === 'pending').length,
    [state.actions],
  )

  const value: PlatformContextValue = {
    ...state,
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
    enqueueAction,
    executeChatAction,
    resetWorkspace,
    pendingCount,
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider')
  return ctx
}
