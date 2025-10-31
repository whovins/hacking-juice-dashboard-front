// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './app/providers'
import { AppRoutes } from './app/routers'
import { getDemoFlag } from './lib/demo-flag' // 아래 3) 참고

async function startMSWIfNeeded() {
  const enable = import.meta.env.DEV ? getDemoFlag() !== false : getDemoFlag()
  if (!enable) return
  const { worker } = await import('./mock/browser')
  const swUrl = `${import.meta.env.BASE_URL || '/'}mockServiceWorker.js`
  await worker.start({ serviceWorker: { url: swUrl }, onUnhandledRequest: 'bypass' })
  console.log('[MSW] started', swUrl, 'mode=', import.meta.env.DEV ? 'dev' : 'prod')
}

startMSWIfNeeded().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </React.StrictMode>
  )
})
