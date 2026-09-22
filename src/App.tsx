import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AiCommandPage } from '@/pages/AiCommandPage'
import { OperationsOverviewPage } from '@/pages/OperationsOverviewPage'
import { FarmsPage } from '@/pages/FarmsPage'
import { FeedPage } from '@/pages/FeedPage'
import { ProductionPage } from '@/pages/ProductionPage'
import { QualityPage } from '@/pages/QualityPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { SalesPage } from '@/pages/SalesPage'
import { FinancePage } from '@/pages/FinancePage'
import { AgentsPage } from '@/pages/AgentsPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<AiCommandPage />} />
          <Route path="operations" element={<OperationsOverviewPage />} />
          <Route path="farms" element={<FarmsPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
