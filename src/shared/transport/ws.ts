// 실제 WS 클라이언트 (필요 시 유지)
const realBase = import.meta.env.VITE_WS_BASE_URL as string
export function openStream(path: 'events'|'alerts', onMsg: (data: unknown)=>void) {
  const ws = new WebSocket(`${realBase}/${path}`)
  ws.onmessage = ev => { try { onMsg(JSON.parse(ev.data)) } catch {} }
  return ws
}

// DEV용 모의 스트림
type Listener = (msg:any)=>void
export class MockWS {
  private t: any = null
  private ls = new Set<Listener>()
  start(interval=7000) {
    this.t = setInterval(() => {
      const msg = {
        type: 'alert.created',
        at: new Date().toISOString(),
        alert: {
          id: String(Math.floor(Math.random()*90000)+10000),
          ts: new Date().toISOString(),
          severity: (['low','medium','high','critical'] as const)[Math.floor(Math.random()*4)],
          entity: `host-${(Math.floor(Math.random()*3)+1)}`,
          status: 'open',
        }
      }
      this.ls.forEach(fn => fn(msg))
    }, interval)
  }
  stop(){ if(this.t) clearInterval(this.t) }
  on(fn:Listener){ this.ls.add(fn); return ()=>this.ls.delete(fn) }
}
