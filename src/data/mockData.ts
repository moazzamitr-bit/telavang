import type {
  Agent,
  Farm,
  Flock,
  FeedBatch,
  Product,
  InventoryLot,
  Warehouse,
  Order,
  QualityAlert,
  Kpi,
} from './types'

export const agents: Pick<
  Agent,
  'id' | 'name' | 'role' | 'roleFa' | 'status' | 'currentTask' | 'lastActivityMinutes' | 'confidence' | 'color'
>[] = [
  {
    id: 'orchestrator',
    name: 'فرمانده عملیات تلاونگ',
    role: 'Executive Orchestrator',
    roleFa: 'هماهنگ‌کننده اجرایی',
    status: 'active',
    currentTask: 'پایش یکپارچه عملیات روزانه',
    lastActivityMinutes: 0,
    confidence: 96,
    color: '#E86A17',
  },
  {
    id: 'farm',
    name: 'ایجنت مزارع و گله‌ها',
    role: 'Farm Intelligence',
    roleFa: 'هوش مزرعه',
    status: 'alert',
    currentTask: 'تحلیل افت تولید Farm 03 / Flock L218',
    lastActivityMinutes: 2,
    confidence: 91,
    color: '#1F7A4D',
  },
  {
    id: 'feed',
    name: 'ایجنت خوراک و تأمین',
    role: 'Feed Procurement',
    roleFa: 'تأمین خوراک',
    status: 'thinking',
    currentTask: 'بررسی همبستگی Feed Batch FB-8821',
    lastActivityMinutes: 3,
    confidence: 87,
    color: '#B45309',
  },
  {
    id: 'production',
    name: 'ایجنت تولید',
    role: 'Production Planning',
    roleFa: 'برنامه‌ریزی تولید',
    status: 'active',
    currentTask: 'بهینه‌سازی تخصیص ظرفیت فردا',
    lastActivityMinutes: 5,
    confidence: 93,
    color: '#1D4ED8',
  },
  {
    id: 'quality',
    name: 'ایجنت کیفیت',
    role: 'Quality & Traceability',
    roleFa: 'کیفیت و رهگیری',
    status: 'active',
    currentTask: 'در حال بررسی Batch FB-782',
    lastActivityMinutes: 2,
    confidence: 94,
    color: '#7C3AED',
  },
  {
    id: 'inventory',
    name: 'ایجنت موجودی',
    role: 'Inventory Optimization',
    roleFa: 'بهینه‌سازی موجودی',
    status: 'alert',
    currentTask: 'هشدار FEFO — Telavich در معرض انقضا',
    lastActivityMinutes: 1,
    confidence: 97,
    color: '#0F766E',
  },
  {
    id: 'sales',
    name: 'ایجنت فروش',
    role: 'Demand Forecast',
    roleFa: 'پیش‌بینی تقاضا',
    status: 'idle',
    currentTask: 'به‌روزرسانی پیش‌بینی تقاضا B2B',
    lastActivityMinutes: 18,
    confidence: 89,
    color: '#BE185D',
  },
  {
    id: 'finance',
    name: 'ایجنت مالی',
    role: 'Margin Intelligence',
    roleFa: 'هوش حاشیه سود',
    status: 'active',
    currentTask: 'محاسبه حاشیه سود پیش‌بینی‌شده هفته',
    lastActivityMinutes: 7,
    confidence: 92,
    color: '#0E7490',
  },
]

export const farms: Farm[] = [
  { id: 'F01', name: 'مزرعه ۰۱', region: 'قزوین', capacity: 120000, activeFlocks: 4, productionRate: 92.1, mortality: 0.8, healthScore: 96, status: 'optimal' },
  { id: 'F02', name: 'مزرعه ۰۲', region: 'البرز', capacity: 98000, activeFlocks: 3, productionRate: 90.4, mortality: 1.1, healthScore: 93, status: 'optimal' },
  { id: 'F03', name: 'مزرعه ۰۳', region: 'تهران', capacity: 110000, activeFlocks: 4, productionRate: 83.2, mortality: 1.9, healthScore: 78, status: 'watch' },
  { id: 'F04', name: 'مزرعه ۰۴', region: 'مازندران', capacity: 135000, activeFlocks: 5, productionRate: 91.8, mortality: 0.9, healthScore: 95, status: 'optimal' },
  { id: 'F05', name: 'مزرعه ۰۵', region: 'اصفهان', capacity: 88000, activeFlocks: 3, productionRate: 88.6, mortality: 1.3, healthScore: 88, status: 'watch' },
]

export const flocks: Flock[] = [
  { id: 'L216', farmId: 'F03', age: 42, birds: 28500, productionRate: 89.2, expectedProduction: 25400, actualProduction: 24980, eggWeight: 61.2, mortality: 1.1, feedBatchId: 'FB-8810', status: 'healthy' },
  { id: 'L217', farmId: 'F03', age: 38, birds: 29200, productionRate: 90.1, expectedProduction: 26300, actualProduction: 25810, eggWeight: 60.8, mortality: 1.0, feedBatchId: 'FB-8810', status: 'healthy' },
  { id: 'L218', farmId: 'F03', age: 45, birds: 30100, productionRate: 82.4, expectedProduction: 91400, actualProduction: 84920, eggWeight: 58.1, mortality: 2.4, feedBatchId: 'FB-8821', status: 'alert' },
  { id: 'L219', farmId: 'F04', age: 36, birds: 27800, productionRate: 93.1, expectedProduction: 25900, actualProduction: 26120, eggWeight: 61.5, mortality: 0.7, feedBatchId: 'FB-782', status: 'healthy' },
  { id: 'L220', farmId: 'F04', age: 34, birds: 28400, productionRate: 92.8, expectedProduction: 26350, actualProduction: 26480, eggWeight: 61.3, mortality: 0.8, feedBatchId: 'FB-782', status: 'healthy' },
  { id: 'L221', farmId: 'F01', age: 40, birds: 31000, productionRate: 94.2, expectedProduction: 29200, actualProduction: 29510, eggWeight: 62.0, mortality: 0.6, feedBatchId: 'FB-8815', status: 'healthy' },
]

export const feedBatches: FeedBatch[] = [
  { id: 'FB-782', supplier: 'دانه‌چین البرز', receivedAt: '۱۴۰۴/۱۲/۱۸', quantityTons: 240, proteinPct: 17.8, status: 'investigating', farmIds: ['F04'], notes: 'رهگیری کامل فعال' },
  { id: 'FB-8810', supplier: 'خوراک پارس', receivedAt: '۱۴۰۴/۱۲/۲۲', quantityTons: 180, proteinPct: 18.1, status: 'ok', farmIds: ['F03'] },
  { id: 'FB-8815', supplier: 'دانه‌چین البرز', receivedAt: '۱۴۰۴/۱۲/۲۴', quantityTons: 210, proteinPct: 18.0, status: 'ok', farmIds: ['F01', 'F02'] },
  { id: 'FB-8821', supplier: 'سپاهان فید', receivedAt: '۱۴۰۴/۱۲/۲۶', quantityTons: 195, proteinPct: 17.2, status: 'investigating', farmIds: ['F03'], notes: 'همبستگی با افت تولید — نیاز به بررسی QC' },
]

export const products: Product[] = [
  { id: 'P-EGG', name: 'تخم‌مرغ بسته‌بندی', sku: 'EGG-PKG-30', category: 'Shell Egg', shelfLifeDays: 28, unitMargin: 12.4 },
  { id: 'P-LIQ', name: 'تخم‌مرغ مایع پاستوریزه', sku: 'LIQ-PST-1L', category: 'Liquid Egg', shelfLifeDays: 14, unitMargin: 18.6 },
  { id: 'P-WHT', name: 'سفیده تخم‌مرغ', sku: 'WHT-EGG-500', category: 'Egg White', shelfLifeDays: 12, unitMargin: 22.1 },
  { id: 'P-TELARA', name: 'تلارا', sku: 'TELARA-250', category: 'Processed', shelfLifeDays: 21, unitMargin: 28.4 },
  { id: 'P-TELAROLL', name: 'تلارول', sku: 'TELAROLL-200', category: 'Processed', shelfLifeDays: 18, unitMargin: 26.8 },
  { id: 'P-TELAVICH', name: 'تلاویچ', sku: 'TELAVICH-180', category: 'Protein', shelfLifeDays: 10, unitMargin: 31.2 },
  { id: 'P-PRO', name: 'محصولات پروتئینی', sku: 'PRO-MIX-1K', category: 'Protein', shelfLifeDays: 15, unitMargin: 24.5 },
]

export const warehouses: Warehouse[] = [
  { id: 'WH-A', name: 'انبار مرکزی A', type: 'cold', tempC: 4.2, capacityUtilization: 78 },
  { id: 'WH-B', name: 'انبار فرآوری B', type: 'cold', tempC: 3.8, capacityUtilization: 84 },
  { id: 'DC-E', name: 'مرکز توزیع شرق', type: 'dc', tempC: 5.1, capacityUtilization: 62 },
  { id: 'DC-W', name: 'مرکز توزیع غرب', type: 'dc', tempC: 4.9, capacityUtilization: 71 },
]

export const inventoryLots: InventoryLot[] = [
  { id: 'LOT-8821', productId: 'P-TELAVICH', warehouseId: 'WH-A', quantity: 1840, remainingShelfLifeDays: 2.1, productionBatchId: 'PB-990', riskValueMillion: 126, status: 'at_risk' },
  { id: 'LOT-8822', productId: 'P-TELARA', warehouseId: 'WH-B', quantity: 920, remainingShelfLifeDays: 4.5, productionBatchId: 'PB-991', riskValueMillion: 48, status: 'at_risk' },
  { id: 'LOT-8823', productId: 'P-LIQ', warehouseId: 'WH-A', quantity: 3100, remainingShelfLifeDays: 8.2, productionBatchId: 'PB-992', riskValueMillion: 22, status: 'ok' },
  { id: 'LOT-7710', productId: 'P-EGG', warehouseId: 'DC-E', quantity: 12400, remainingShelfLifeDays: 18, productionBatchId: 'PB-981', riskValueMillion: 0, status: 'ok' },
  { id: 'LOT-7711', productId: 'P-TELAROLL', warehouseId: 'WH-B', quantity: 640, remainingShelfLifeDays: 6.0, productionBatchId: 'PB-982', riskValueMillion: 18, status: 'ok' },
  { id: 'LOT-Q782', productId: 'P-LIQ', warehouseId: 'WH-A', quantity: 480, remainingShelfLifeDays: 11, productionBatchId: 'PB-981', riskValueMillion: 0, status: 'quarantine' },
]

export const orders: Order[] = [
  { id: 'ORD-44382', customerId: 'C-12', customerName: 'هایپرمی', products: [{ productId: 'P-LIQ', quantity: 800 }, { productId: 'P-TELARA', quantity: 400 }], valueMillion: 86, status: 'pending', dueDate: 'فردا' },
  { id: 'ORD-44397', customerId: 'C-08', customerName: 'اسنپ‌مارکت', products: [{ productId: 'P-TELAROLL', quantity: 600 }], valueMillion: 42, status: 'shipped', dueDate: 'امروز' },
  { id: 'ORD-44401', customerId: 'C-21', customerName: 'رفاه', products: [{ productId: 'P-EGG', quantity: 5000 }, { productId: 'P-TELAVICH', quantity: 720 }], valueMillion: 118, status: 'pending', dueDate: 'پس‌فردا' },
  { id: 'ORD-44412', customerId: 'C-03', customerName: 'افق کوروش', products: [{ productId: 'P-EGG', quantity: 8200 }], valueMillion: 74, status: 'delivered', dueDate: 'دیروز' },
]

export const qualityAlerts: QualityAlert[] = [
  { id: 'QA-301', title: 'همبستگی افت تولید با Feed Batch FB-8821', severity: 'high', source: 'ایجنت تولید + خوراک', relatedIds: ['FB-8821', 'L218', 'F03'], createdMinutesAgo: 12, status: 'investigating' },
  { id: 'QA-298', title: 'انقضای نزدیک Telavich — انبار A', severity: 'high', source: 'ایجنت موجودی', relatedIds: ['LOT-8821', 'P-TELAVICH'], createdMinutesAgo: 28, status: 'open' },
  { id: 'QA-294', title: 'رهگیری پیشگیرانه Feed Batch FB-782', severity: 'medium', source: 'ایجنت کیفیت', relatedIds: ['FB-782'], createdMinutesAgo: 95, status: 'investigating' },
]

export const homeKpis: Kpi[] = [
  { id: 'prod', label: 'تولید امروز', value: '۶۸۴,۳۲۰ عدد', delta: '۴.۸٪- نسبت به برنامه', deltaType: 'down', hint: 'واریانس هفتگی فعال' },
  { id: 'feed', label: 'موجودی خوراک', value: '۱۱.۶ روز پوشش', delta: 'در محدوده امن', deltaType: 'neutral', hint: 'حداقل پوشش هدف: ۱۰ روز' },
  { id: 'expiry', label: 'محصول در معرض انقضا', value: '۱,۸۴۰ واحد', delta: 'تلاویچ — ۲.۱ روز', deltaType: 'warning', hint: 'پیشنهاد انتقال FEFO' },
  { id: 'risk', label: 'ارزش موجودی در ریسک', value: '۱۲۶ میلیون تومان', delta: 'قابل اجتناب ۷۸ م', deltaType: 'warning' },
  { id: 'qc', label: 'هشدار کیفیت', value: '۳ مورد', delta: '۲ مورد در حال بررسی', deltaType: 'warning' },
  { id: 'otif', label: 'تحویل به موقع', value: '۹۲.۴٪', delta: '۱.۲٪+ نسبت به ماه قبل', deltaType: 'up' },
  { id: 'margin', label: 'حاشیه سود پیش‌بینی‌شده', value: '۱۸.۷٪', delta: '۰.۴٪+ با بهینه‌سازی', deltaType: 'up' },
]

export const productionTrend = [
  { day: 'شنبه', planned: 710000, actual: 702400 },
  { day: 'یکشنبه', planned: 715000, actual: 708200 },
  { day: 'دوشنبه', planned: 720000, actual: 698100 },
  { day: 'سه‌شنبه', planned: 718000, actual: 685400 },
  { day: 'چهارشنبه', planned: 722000, actual: 679800 },
  { day: 'پنجشنبه', planned: 725000, actual: 672100 },
  { day: 'جمعه', planned: 700000, actual: 684320 },
]

export const marginByProduct = [
  { name: 'تخم‌مرغ', margin: 12.4, volume: 42 },
  { name: 'مایع', margin: 18.6, volume: 18 },
  { name: 'تلارا', margin: 28.4, volume: 12 },
  { name: 'تلارول', margin: 26.8, volume: 10 },
  { name: 'تلاویچ', margin: 31.2, volume: 9 },
  { name: 'پروتئین', margin: 24.5, volume: 9 },
]

export const feedCoverage = [
  { farm: 'مزرعه ۰۱', days: 13.2 },
  { farm: 'مزرعه ۰۲', days: 12.1 },
  { farm: 'مزرعه ۰۳', days: 9.4 },
  { farm: 'مزرعه ۰۴', days: 14.8 },
  { farm: 'مزرعه ۰۵', days: 11.0 },
]

export const suggestedQuestions = [
  'وضعیت امروز عملیات را خلاصه کن',
  'چرا تولید این هفته افت کرده؟',
  'کدام محصولات در معرض انقضا هستند؟',
  'Feed Batch FB-782 را رهگیری کن',
  'برنامه تولید فردا را بهینه کن',
]
