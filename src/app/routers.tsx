import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom'
import Layout from '../ui/Layout'
import OverviewPage from '../pages/overview/OverviewPage'
import FeedsPage from '../pages/feeds/FeedsPage'
import CvePage from '../pages/cve/CvePage'
import IocExplorerPage from '../pages/ioc/IocPage'
import AlertsPage from '../pages/alerts/AlertsPage'
import RulesPage from '../pages/rules/RulesPage'
import SettingsPage from '../pages/settings/SettingsPage'
import LoginPage from '../pages/auth/LoginPage'
import { useAuthStore } from '../config/auth-store'
function RequireAuth() {
  const token = useAuthStore(s => s.token)
  const loc = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />
  return <Outlet />
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,          
    children: [
      {
        path: '/',
        element: <Layout />,            
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'feeds', element: <FeedsPage /> },
          { path: 'cve', element: <CvePage /> },
          { path: 'ioc', element: <IocExplorerPage /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'rules', element: <RulesPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
], { basename: import.meta.env.BASE_URL })

export function AppRoutes() {
  const token = useAuthStore(s => s.token)
  return (
    <RouterProvider
      router={router}
      key={token ? 'auth' : 'guest'}   // 토큰 전환 시 트리 강제 재생성
    />
  )
}