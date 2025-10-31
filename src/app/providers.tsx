import { ReactNode, useMemo, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalStyle } from '../styles/global-style'
import { themeLight, themeDark } from '../styles/theme'
import { useUiStore } from '../config/ui-store'
import AuthProvider from '../shared/auth/AuthProvider'

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
    const onMsg = (msg: any) => {
      if (msg?.type === 'alert.created') {
        push(`New alert: ${msg.alert.severity.toUpperCase()} on ${msg.alert.entity}`)
        badge.inc()
      }
    }

    let off: (() => void) | undefined
    let mock: MockWS | undefined
    let ws: WebSocket | undefined

    if (import.meta.env.DEV && mswEnabled) {
      mock = new MockWS()
      mock.start(7000)
      off = mock.on(onMsg)
      console.log('[WS] MockWS enabled (7s)')
      return () => {
        off?.()
        mock?.stop()
      }
    }

    // 실제 백엔드 WS가 준비되면 VITE_WS_BASE_URL을 설정하고 아래 라인을 그대로 사용하세요.
    // 예) VITE_WS_BASE_URL=ws://localhost:8000/v1/stream  → openStream('alerts', ...)
    const wsBase = import.meta.env.VITE_WS_BASE_URL as string | undefined
    if (wsBase) {
      ws = openStream('alerts', onMsg)
      console.log('[WS] real WebSocket connected:', wsBase)
      return () => ws?.close()
    }

    // 둘 다 아니면 아무 것도 연결하지 않음
    return () => {}
  }, [mswEnabled, push, badge])

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
