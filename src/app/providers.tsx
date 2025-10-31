import { ReactNode, useMemo, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalStyle } from '../styles/global-style'
import { themeLight, themeDark } from '../styles/theme'
import { useUiStore } from '../config/ui-store'
import AuthProvider from '../shared/auth/AuthProvider'
import { getDemoFlag } from '../lib/demo-flag'
// 토스트 & 배지
import { ToastHost, useToasts } from '../ui/Toast'           // Toast.tsx가 src/ui에 있을 때 경로
import { useAlertBadge } from '../config/alert-badge-store'

// WS (모의/실제)
import { MockWS, openStream } from '../shared/transport/ws'  // openStream은 실제 WS용(WebSocket 반환)

export function AppProviders({ children }: { children: ReactNode }) {
  const mode = useUiStore(s => s.theme)
  const mswEnabled = useUiStore(s => s.mswEnabled)

  // React Query
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

  // Toast & Alerts 배지
  const { items, push } = useToasts()
  const badge = useAlertBadge()

  // 실시간 알림: DEV+MSW면 MockWS, 아니면 실제 WS (열려있을 때만)
  useEffect(() => {
    const demo = getDemoFlag()            // DEV/PROD 공통 플래그( ?demo=1, localStorage, env )
    const onMsg = (msg: any) => {
      if (msg?.type === 'alert.created') {
        push(`New alert: ${msg.alert.severity.toUpperCase()} on ${msg.alert.entity}`)
        badge.inc()
      }
    }

    let off: (() => void) | undefined
    let mock: MockWS | undefined
    let ws: WebSocket | undefined

    if (demo) {
      mock = new MockWS()
      mock.start(7000)                    // 7초마다 alert.created 송출
      off = mock.on(onMsg)
      console.log('[WS] MockWS enabled (7s)')
      return () => { off?.(); mock?.stop() }
    }

    const base = import.meta.env.VITE_WS_BASE_URL as string | undefined
    if (base) {
      ws = openStream('alerts', onMsg)    // 실제 WS (wss://…)
      console.log('[WS] real WebSocket connected')
      return () => ws?.close()
    }

    return () => {}
  }, [push, badge])

  return (
    <ThemeProvider theme={mode === 'dark' ? themeLight : themeDark}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} position="right" />
        <ToastHost items={items} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
