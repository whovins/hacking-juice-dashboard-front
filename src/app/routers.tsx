import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import { Navigate, Outlet } from 'react-router-dom'

function RequireAuth(){
    const token = useAuthStore(s => s.token)
    if(!token) return <Navigate to='/login' replace />
    return <Outlet />
}
// 라우팅 정의. URL과 페이지 매핑만 담당.
const router = createBrowserRouter([
    {path: '/login', element: <LoginPage />},
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                element: <RequireAuth />,
                children: [
                    { index: true, element: <OverviewPage /> },
                    { path: 'feeds', element: <FeedsPage /> },
                    { path: 'cve', element: <CvePage /> },
                    { path: 'ioc', element: <IocExplorerPage /> },
                    { path: 'alerts', element: <AlertsPage /> },
                    { path: 'rules', element: <RulesPage /> },
                    { path: 'settings', element: <SettingsPage /> },
            ]
            }
        ],
    },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
