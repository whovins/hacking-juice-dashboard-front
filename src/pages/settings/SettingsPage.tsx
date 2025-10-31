import { useUiStore } from '../../config/ui-store'
import { Button } from '../../ui/Button'
import { getDemoFlag, setDemoFlag } from '../../lib/demo-flag'
import { useState } from 'react'

export default function SettingsPage() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  const [demo, setDemo] = useState(getDemoFlag())

  return (
    <div style={{display:'grid', gap:16, maxWidth:600}}>
      <h3>Settings</h3>

      <section>
        <h4>Developer / Demo</h4>
        <div style={{display:'grid', gap:8}}>
          <div>
            <div style={{fontWeight:600}}>API base</div>
            <code>{apiBase || '(relative /v1, MSW intercept)'}</code>
          </div>

          <label style={{display:'flex', gap:8, alignItems:'center'}}>
            <input
              type="checkbox"
              checked={demo}
              onChange={e => setDemo(e.target.checked)}
            />
            Enable demo mock (MSW) on this browser
          </label>

          <div style={{display:'flex', gap:8}}>
            <Button variant="primary" onClick={async () => {
              setDemoFlag(demo)
              // 프로덕션에서도 동작하도록 main.tsx에서 MSW를 조건적으로 시작함
              location.reload()
            }}>
              Apply & reload
            </Button>
            <Button onClick={() => {
              try {
                localStorage.removeItem('mock:alerts')
                localStorage.removeItem('mock:rules')
              } catch {}
              location.reload()
            }}>
              Reset mock data
            </Button>
          </div>

          <div style={{opacity:.7}}>
            배포 환경에서도 ?demo=1 쿼리로 임시 활성화 가능. 예: https://your-demo.app/?demo=1
          </div>
        </div>
      </section>
    </div>
  )
}
