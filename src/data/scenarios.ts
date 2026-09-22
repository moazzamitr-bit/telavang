import type { ChatMessage } from './types'

let msgCounter = 0
const nextId = () => `msg-${++msgCounter}-${Date.now()}`

export function createWelcomeMessage(): ChatMessage {
  return {
    id: nextId(),
    role: 'assistant',
    content:
      'من وضعیت کل عملیات تلاونگ را بررسی می‌کنم و برای تحلیل تولید، کیفیت، موجودی، فروش و سودآوری از ایجنت‌های تخصصی استفاده می‌کنم.',
    agents: [{ id: 'orchestrator', name: 'فرمانده عملیات' }],
    timestamp: new Date(),
  }
}

export function resolveScenario(question: string): ChatMessage {
  const q = question.trim()

  if (q.includes('خلاصه') || q.includes('وضعیت امروز')) {
    return {
      id: nextId(),
      role: 'assistant',
      content:
        'تصویر لحظه‌ای عملیات تلاونگ آماده است. سه موضوع نیازمند توجه مدیریتی است: افت تولید در مزرعه ۰۳، ریسک انقضای تلاویچ، و رهگیری پیشگیرانه Feed Batch FB-782.',
      agents: [
        { id: 'orchestrator', name: 'فرمانده عملیات' },
        { id: 'farm', name: 'ایجنت مزارع' },
        { id: 'inventory', name: 'ایجنت موجودی' },
        { id: 'quality', name: 'ایجنت کیفیت' },
      ],
      dataAnalyzed: [
        'تولید روزانه ۷ مزرعه',
        'پوشش خوراک',
        'موجودی FEFO',
        'هشدارهای کیفیت باز',
        'تحویل OTIF',
        'حاشیه سود پیش‌بینی',
      ],
      metrics: [
        { label: 'تولید امروز', value: '۶۸۴,۳۲۰', tone: 'warning' },
        { label: 'واریانس برنامه', value: '۴.۸٪−', tone: 'danger' },
        { label: 'موجودی در ریسک', value: '۱۲۶ م تومان', tone: 'warning' },
        { label: 'هشدار کیفیت', value: '۳ مورد', tone: 'warning' },
        { label: 'تحویل به‌موقع', value: '۹۲.۴٪', tone: 'success' },
        { label: 'حاشیه پیش‌بینی', value: '۱۸.۷٪', tone: 'success' },
      ],
      recommendation:
        'اولویت اجرایی: ۱) بررسی QC خوراک FB-8821  ۲) انتقال FEFO تلاویچ  ۳) آماده‌سازی contingency برای FB-782',
      impact: 'کاهش ریسک ضایعات تا ۷۸ میلیون تومان و بازیابی بخشی از واریانس تولید',
      actions: [
        { id: 'goto-prod', label: 'تحلیل افت تولید', type: 'primary' },
        { id: 'goto-shelf', label: 'مشاهده ریسک انقضا', type: 'secondary' },
      ],
      timestamp: new Date(),
    }
  }

  if (q.includes('تولید') && (q.includes('افت') || q.includes('چرا'))) {
    return {
      id: nextId(),
      role: 'assistant',
      content:
        'در بررسی انجام‌شده توسط ایجنت تولید و ایجنت خوراک، افت معنادار در Farm 03 / Flock L218 شناسایی شد. تغییر Feed Batch همزمان با افت رخ داده است — این یک همبستگی است، نه اثبات علت.',
      agents: [
        { id: 'production', name: 'ایجنت تولید' },
        { id: 'feed', name: 'ایجنت خوراک' },
        { id: 'farm', name: 'ایجنت مزارع' },
      ],
      dataAnalyzed: [
        'نرخ تولید روزانه Flock L218',
        'وزن تخم‌مرغ',
        'مصرف خوراک',
        'تاریخ تعویض Feed Batch',
        'مرگ‌ومیر گله',
      ],
      metrics: [
        { label: 'مزرعه', value: 'Farm 03' },
        { label: 'گله', value: 'Flock L218' },
        { label: 'تولید برنامه‌ای', value: '۹۱,۴۰۰' },
        { label: 'تولید واقعی', value: '۸۴,۹۲۰', tone: 'warning' },
        { label: 'واریانس', value: '۷.۱٪−', tone: 'danger' },
        { label: 'وزن تخم‌مرغ', value: '۴.۲٪−', tone: 'warning' },
        { label: 'خوراک مرتبط', value: 'FB-8821' },
        { label: 'مصرف خوراک', value: 'طبیعی', tone: 'default' },
      ],
      recommendation:
        'Correlation detected, investigation recommended. ایجاد بررسی QC برای Feed Batch FB-8821 پیشنهاد می‌شود.',
      impact: 'جلوگیری از تداوم افت در گله‌های مجاور و کاهش ریسک کیفیت پایین‌دستی',
      actions: [{ id: 'create-qc', label: 'ایجاد بررسی QC', type: 'primary', impact: 'باز کردن پرونده QA برای FB-8821' }],
      scenario: 'production',
      timestamp: new Date(),
    }
  }

  if (q.includes('انقضا') || q.includes('در معرض')) {
    return {
      id: nextId(),
      role: 'assistant',
      content:
        'ایجنت موجودی با منطق FEFO، موجودی در معرض انقضای نزدیک را شناسایی کرده است. بیشترین ریسک روی محصول تلاویچ در انبار مرکزی A است.',
      agents: [
        { id: 'inventory', name: 'ایجنت موجودی' },
        { id: 'sales', name: 'ایجنت فروش' },
        { id: 'finance', name: 'ایجنت مالی' },
      ],
      dataAnalyzed: [
        'عمر باقی‌مانده قفسه',
        'تقاضای DC شرق',
        'ظرفیت زنجیره سرد',
        'ارزش موجودی در ریسک',
        'سفارش‌های B2B باز',
      ],
      metrics: [
        { label: 'محصول', value: 'تلاویچ' },
        { label: 'موجودی در ریسک', value: '۱,۸۴۰ واحد', tone: 'warning' },
        { label: 'عمر باقی‌مانده', value: '۲.۱ روز', tone: 'danger' },
        { label: 'ارزش ریسک', value: '۱۲۶ م تومان', tone: 'danger' },
        { label: 'پیشنهاد انتقال', value: '۷۲۰ واحد' },
        { label: 'مسیر', value: 'WH-A ← DC East' },
      ],
      recommendation: 'انتقال ۷۲۰ واحد از Warehouse A به DC East برای جذب تقاضا قبل از انقضا.',
      impact: 'کاهش ضایعات مورد انتظار: ۷۸ میلیون تومان',
      actions: [{ id: 'approve-transfer', label: 'تأیید انتقال', type: 'primary', impact: 'اجتناب از ۷۸ م تومان ضایعات' }],
      scenario: 'shelf',
      timestamp: new Date(),
    }
  }

  if (q.includes('FB-782') || q.includes('رهگیری')) {
    return {
      id: nextId(),
      role: 'assistant',
      content:
        'رهگیری کامل Feed Batch FB-782 انجام شد. این بچ به مزرعه ۰۴ و دو گله متصل است و از طریق لات‌های تخم، فرآوری و محصولات به سه سفارش مشتری رسیده است.',
      agents: [
        { id: 'quality', name: 'ایجنت کیفیت' },
        { id: 'production', name: 'ایجنت تولید' },
        { id: 'inventory', name: 'ایجنت موجودی' },
      ],
      dataAnalyzed: [
        'زنجیره خوراک → مزرعه → گله',
        'لات‌های تخم',
        'بچ‌های فرآوری',
        'موجودی انبار',
        'محموله‌ها و مشتریان',
      ],
      metrics: [
        { label: 'بچ‌های تولید متأثر', value: '۳' },
        { label: 'لات انبار', value: '۴' },
        { label: 'محموله', value: '۲' },
        { label: 'مشتری', value: '۳' },
      ],
      recommendation:
        'اقدام پیشگیرانه توصیه می‌شود: قرنطینه موجودی مرتبط، توقف ارسال‌های باز، و ایجاد CAPA در صورت تأیید ریسک.',
      impact: 'محدودسازی دامنه ریسک کیفیت قبل از گسترش در شبکه توزیع',
      actions: [
        { id: 'quarantine', label: 'قرنطینه موجودی', type: 'danger' },
        { id: 'stop-ship', label: 'توقف ارسال', type: 'secondary' },
        { id: 'create-capa', label: 'ایجاد CAPA', type: 'primary' },
      ],
      scenario: 'trace',
      timestamp: new Date(),
    }
  }

  if (q.includes('بهینه') || q.includes('برنامه تولید')) {
    return {
      id: nextId(),
      role: 'assistant',
      content:
        'ایجنت تولید با درنظرگرفتن تقاضا، موجودی، سفارش‌های B2B، حاشیه سود، عمر قفسه و ظرفیت فرآوری، تخصیص بهینه برای فردا را پیشنهاد می‌کند.',
      agents: [
        { id: 'production', name: 'ایجنت تولید' },
        { id: 'sales', name: 'ایجنت فروش' },
        { id: 'finance', name: 'ایجنت مالی' },
        { id: 'inventory', name: 'ایجنت موجودی' },
      ],
      dataAnalyzed: [
        'پیش‌بینی تقاضا ۷ روزه',
        'سفارش‌های B2B باز',
        'ظرفیت فرآوری',
        'حاشیه محصول',
        'ریسک انقضا FEFO',
      ],
      metrics: [
        { label: 'Shell Egg', value: '۶۲٪ → ۵۶٪', tone: 'warning' },
        { label: 'Liquid Egg', value: '۱۷٪ → ۲۱٪', tone: 'success' },
        { label: 'Telara / Telaroll', value: '۱۲٪ → ۱۴٪', tone: 'success' },
        { label: 'حاشیه مورد انتظار', value: '۱۸.۷٪ → ۱۹.۱٪', tone: 'success' },
      ],
      recommendation:
        'کاهش سهم تخم‌مرغ پوسته‌ای به نفع محصولات فرآوری‌شده با حاشیه بالاتر و جذب بهتر تقاضای B2B، ضمن کاهش فشار روی موجودی در معرض انقضا.',
      impact: 'افزایش حاشیه حدود ۰.۴ واحد درصدی و کاهش ریسک ضایعات',
      actions: [{ id: 'apply-plan', label: 'اعمال برنامه تولید', type: 'primary', impact: 'به‌روزرسانی برنامه فردا' }],
      scenario: 'optimize',
      timestamp: new Date(),
    }
  }

  return {
    id: nextId(),
    role: 'assistant',
    content:
      'درخواست شما دریافت شد. برای بهترین نتیجه، یکی از سناریوهای کلیدی را انتخاب کنید یا درباره تولید، کیفیت، موجودی، فروش یا سودآوری بپرسید.',
    agents: [{ id: 'orchestrator', name: 'فرمانده عملیات' }],
    dataAnalyzed: ['وضعیت ایجنت‌ها', 'هشدارهای باز'],
    recommendation: 'از پرسش‌های پیشنهادی زیر برای مشاهده جریان کامل Observe → Recommend → Approve استفاده کنید.',
    actions: [
      { id: 's1', label: 'افت تولید', type: 'secondary' },
      { id: 's2', label: 'ریسک انقضا', type: 'secondary' },
      { id: 's3', label: 'رهگیری FB-782', type: 'secondary' },
    ],
    timestamp: new Date(),
  }
}

export function actionFeedback(actionId: string): ChatMessage {
  const map: Record<string, string> = {
    'create-qc':
      'پرونده بررسی QC برای Feed Batch FB-8821 ایجاد شد و برای ایجنت کیفیت و تیم آزمایشگاه ارسال گردید. وضعیت: در انتظار نمونه‌برداری.',
    'approve-transfer':
      'انتقال ۷۲۰ واحد تلاویچ از انبار A به DC شرق تأیید و در صف اجرای لجستیک سرد قرار گرفت. ضایعات مورد انتظار ۷۸ میلیون تومان کاهش می‌یابد.',
    quarantine:
      'موجودی مرتبط با Feed Batch FB-782 قرنطینه شد. ۴ لات انبار قفل شدند و دسترسی صدور حواله مسدود گردید.',
    'stop-ship':
      'ارسال‌های باز مرتبط با زنجیره FB-782 متوقف شد. ۲ محموله در انتظار تصمیم کیفیت باقی ماند.',
    'create-capa':
      'پرونده CAPA ایجاد شد و به مدیر کیفیت و فرمانده عملیات ارجاع گردید. مهلت پاسخ اولیه: ۲۴ ساعت.',
    'apply-plan':
      'برنامه تولید فردا اعمال شد: Shell Egg ۵۶٪، Liquid Egg ۲۱٪، Telara/Telaroll ۱۴٪. ایجنت تولید در حال همگام‌سازی با خطوط فرآوری است.',
    'goto-prod': 'سناریوی افت تولید را از پرسش‌های پیشنهادی باز کنید.',
    'goto-shelf': 'سناریوی ریسک انقضا را از پرسش‌های پیشنهادی باز کنید.',
    s1: 'لطفاً بپرسید: چرا تولید این هفته افت کرده؟',
    s2: 'لطفاً بپرسید: کدام محصولات در معرض انقضا هستند؟',
    s3: 'لطفاً بپرسید: Feed Batch FB-782 را رهگیری کن',
  }

  return {
    id: nextId(),
    role: 'system',
    content: map[actionId] ?? 'اقدام ثبت شد و در صف تأیید اجرایی قرار گرفت.',
    timestamp: new Date(),
  }
}
