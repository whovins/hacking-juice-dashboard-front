import { Outlet, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useUiStore } from '../config/ui-store'
import { useAuthStore } from '../config/auth-store'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { useAlertBadge } from '../config/alert-badge-store'
// 간단한 2열 레이아웃과 사이드 내비게이션.
const Shell = styled.div`
  display: grid;
  grid-template-rows: 56px 1fr;
  height: 100vh;
`
const Top = styled.header`
  display:flex; align-items:center; justify-content:space-between; padding:0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
const Main = styled.main`
  display:grid; grid-template-columns: 220px 1fr; gap: 16px; padding: 16px;
`
const Side = styled.nav`
  border-right: 1px solid ${({ theme }) => theme.colors.border}; padding-right: 12px;
  display:flex; flex-direction:column; gap:8px;
  a { padding:8px 10px; border-radius:8px }
  a.active { background: ${({ theme }) => theme.colors.card}; border:1px solid ${({ theme }) => theme.colors.border} }
`
const Header = styled.header`display:flex; align-items:center; justify-content:space-between; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.08); gap:12px;`

export default function Layout() {
    const logout = useAuthStore(s => s.logout)
    const user = useAuthStore(s => s.user)
    const navigate = useNavigate()
    const { theme, setTheme } = useUiStore()


    const count = useAlertBadge(s => s.count)
    return (
        <Shell>
        <Top>
            <div>Threat Intel Dashboard</div>
            <div style={{ display: 'flex', gap: 8, alignItems:'center' }}>
                  <NavLink to="/settings">Settings</NavLink>
                  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Theme</button>
                  <span style={{opacity:.7}}>{user?.email ?? 'guest'}</span>
                  <Button onClick={() => { logout(); navigate('/login', { replace: true }) }} variant="ghost">
                    Logout
                  </Button>
                </div>
        </Top>
        <Main>
            <Side>
            <NavLink to="/">Overview</NavLink>
            <NavLink to="/feeds">Feeds</NavLink>
            <NavLink to="/cve">CVE</NavLink>
            <NavLink to="/ioc">IOC</NavLink>
            <NavLink to="/alerts">
                Alerts{count ? ` (${count})` : ''}
            </NavLink>
            <NavLink to="/rules">Rules</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            </Side>
            
            <section><Outlet /></section>
        </Main>
        </Shell>
    )
}
