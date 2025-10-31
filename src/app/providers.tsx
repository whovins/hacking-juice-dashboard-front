import { ReactNode, useMemo, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalStyle } from '../styles/global-style'
import { themeLight, themeDark } from '../styles/theme'
import { useUiStore } from '../config/ui-store'
import AuthProvider from '../shared/auth/AuthProvider'

import { getDemoFlag } from '../lib/demo-flag'
import { useAlertBadge } from '../config/alert-badge-store'
import { ToastProvider, ToastHost, useToasts } from '../ui/Toast'
import { useAuthStore } from '../config/auth-store'
import { MockWS, openStream } from '../shared/transport/ws'

export function AppProviders({ children }: { children: ReactNode }) {
  const mode = useUiStore((s) => s.theme)

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 2 },
          mutations: { retry: 1 },
        },
      }),
    []
  )

  return (
    <ThemeProvider theme={mode === 'dark' ? themeDark : themeLight}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <GlobalStyle />
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="right" />
            <ConditionalToastHost />
            <WsBridge />
            <LogoutToastCleaner />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

function ConditionalToastHost() {
  const token = useAuthStore((s) => s.token)
  return token ? <ToastHost /> : null
}

function LogoutToastCleaner() {
  const token = useAuthStore((s) => s.token)
  const { clear } = useToasts()
  useEffect(() => {
    if (!token) clear()
  }, [token, clear])
  return null
}

function WsBridge() {
  const token = useAuthStore((s) => s.token)
  const badge = useAlertBadge()
  const { push } = useToasts()

  useEffect(() => {
    if (!token) return

    const onMsg = (msg: any) => {
      if (msg?.type === 'alert.created') {
        // 필요하면 토스트 유지/제거 선택
        push(`New alert: ${msg.alert.severity.toUpperCase()} on ${msg.alert.entity}`)
        badge.inc()
      }
    }

    const demo = getDemoFlag()
    if (demo) {
      const m = new MockWS()
      m.start(7000)
      const off = m.on(onMsg)
      console.log('[WS] MockWS enabled (7s)')
      return () => {
        off()
        m.stop()
      }
    }

    const base = import.meta.env.VITE_WS_BASE_URL as string | undefined
    if (base) {
      const ws = openStream('alerts', onMsg)
      console.log('[WS] real WebSocket connected')
      return () => ws.close()
    }
    return
  }, [token, badge, push])

  return null
}
