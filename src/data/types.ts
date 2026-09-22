export type AgentStatus = 'active' | 'idle' | 'alert' | 'thinking'

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

export interface TraceNode {
  id: string
  label: string
  sublabel?: string
  type: string
}

export interface TraceEdge {
  from: string
  to: string
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
