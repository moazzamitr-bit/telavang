export type AgentStatus = 'active' | 'idle' | 'alert' | 'thinking' | 'disabled'

export interface AgentSkillRef {
  skillId: string
  enabled: boolean
}

export interface Agent {
  id: string
  name: string
  role: string
  roleFa: string
  status: AgentStatus
  currentTask: string
  lastActivityMinutes: number
  confidence: number
  color: string
  enabled: boolean
  autonomy: number
  sensitivity: number
  pollMinutes: number
  autoApproveBelowMillion: number
  instructions: string
  skillIds: string[]
  domains: string[]
}

export interface Skill {
  id: string
  name: string
  description: string
  category: 'observe' | 'analyze' | 'recommend' | 'execute' | 'learn'
  domain: string
  builtIn: boolean
  version: string
  parameters?: Record<string, number | string | boolean>
}

export type WorkActionStatus = 'pending' | 'approved' | 'rejected' | 'executed'

export interface WorkAction {
  id: string
  title: string
  description: string
  agentId: string
  impactMillion?: number
  type: 'qc' | 'transfer' | 'quarantine' | 'stop_ship' | 'capa' | 'production_plan' | 'custom'
  status: WorkActionStatus
  createdAt: number
  executedAt?: number
  payload?: Record<string, string | number | boolean>
}

export interface ActivityEntry {
  id: string
  at: number
  message: string
  agentId?: string
  tone?: 'info' | 'success' | 'warning' | 'danger'
}

export interface Farm {
  id: string
  name: string
  region: string
  capacity: number
  activeFlocks: number
  productionRate: number
  mortality: number
  healthScore: number
  status: 'optimal' | 'watch' | 'critical'
}

export interface Flock {
  id: string
  farmId: string
  age: number
  birds: number
  productionRate: number
  expectedProduction: number
  actualProduction: number
  eggWeight: number
  mortality: number
  feedBatchId: string
  status: 'healthy' | 'watch' | 'alert'
}

export interface FeedBatch {
  id: string
  supplier: string
  receivedAt: string
  quantityTons: number
  proteinPct: number
  status: 'ok' | 'investigating' | 'quarantine'
  farmIds: string[]
  notes?: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  shelfLifeDays: number
  unitMargin: number
}

export interface InventoryLot {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  remainingShelfLifeDays: number
  productionBatchId: string
  riskValueMillion: number
  status: 'ok' | 'at_risk' | 'quarantine'
}

export interface Warehouse {
  id: string
  name: string
  type: 'cold' | 'dry' | 'dc'
  tempC: number
  capacityUtilization: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  products: { productId: string; quantity: number }[]
  valueMillion: number
  status: 'pending' | 'shipped' | 'delivered'
  dueDate: string
}

export interface QualityAlert {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  source: string
  relatedIds: string[]
  createdMinutesAgo: number
  status: 'open' | 'investigating' | 'resolved'
}

export interface Kpi {
  id: string
  label: string
  value: string
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral' | 'warning'
  hint?: string
}

export interface ChatAction {
  id: string
  label: string
  impact?: string
  type: 'primary' | 'secondary' | 'danger'
}

export interface ChatAgentChip {
  id: string
  name: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agents?: ChatAgentChip[]
  dataAnalyzed?: string[]
  metrics?: { label: string; value: string; tone?: 'default' | 'warning' | 'danger' | 'success' }[]
  recommendation?: string
  impact?: string
  actions?: ChatAction[]
  scenario?: 'production' | 'shelf' | 'trace' | 'optimize'
  timestamp: Date
}

export interface ProductionPlan {
  shellEgg: number
  liquidEgg: number
  processed: number
  applied: boolean
  updatedAt?: number
}
