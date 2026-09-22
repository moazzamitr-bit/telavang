import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Activity,
  Bird,
  Wheat,
  Factory,
  ShieldCheck,
  Warehouse,
  ShoppingCart,
  LineChart,
  Bot,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'مرکز فرمان هوشمند', icon: Sparkles },
  { to: '/operations', label: 'نمای کلی عملیات', icon: LayoutDashboard },
  { to: '/farms', label: 'مزارع و گله‌ها', icon: Bird },
  { to: '/feed', label: 'خوراک و تأمین', icon: Wheat },
  { to: '/production', label: 'تولید و برنامه‌ریزی', icon: Factory },
  { to: '/quality', label: 'کیفیت و رهگیری', icon: ShieldCheck },
  { to: '/inventory', label: 'موجودی و زنجیره سرد', icon: Warehouse },
  { to: '/sales', label: 'فروش و تقاضا', icon: ShoppingCart },
  { to: '/finance', label: 'مالی و سودآوری', icon: LineChart },
  { to: '/agents', label: 'ایجنت‌های هوشمند', icon: Bot },
]

export function AppShell() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-warm-white">
      <aside className="sticky top-0 flex h-screen w-[272px] shrink-0 flex-col border-l border-border bg-charcoal text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-telavang shadow-lg shadow-telavang/30">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">تلاونگ AI OS</div>
              <div className="text-[10px] text-white/50 ltr text-left">Intelligent Operations</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-white/35">
            لایه عملیات
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] transition-colors',
                        isActive
                          ? 'bg-telavang text-white shadow-sm'
                          : 'text-white/70 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 px-3 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs text-white/80">۸ ایجنت فعال</span>
            </div>
            <p className="mt-1 text-[10px] text-white/40">همگام‌سازی زنده عملیات</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-warm-white/90 px-6 backdrop-blur">
          <div className="text-xs text-ink-muted">
            Telavang Intelligent Operations Platform
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink-secondary">
              امروز — سه‌شنبه ۲ فروردین ۱۴۰۵
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-telavang text-xs font-bold text-white">
              مدیر
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-[1400px] p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
