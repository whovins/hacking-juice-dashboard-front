import { http, HttpResponse, delay }  from 'msw'



const overview = {
    countsBySeverity: { low: 12, medium: 7, high: 3, critical: 1 },
    countsBySource: { nvd: 10, rss: 8, kev: 3, vt: 2},
}

const events = Array.from({length: 25}).map( (_, i) => ({
    id: String(i + 1),
    ts: new Date(Date.now() - i  * 3600_000).toISOString(),
    source: ['nvd', 'rss', 'kev', 'vt'][i % 4],
    type: ['cve', 'ioc', 'feed'][i % 3],
    severity: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
    title: `Sample event ${i + 1}`,
    summary: `is sample event ${i + 1}`,
    iocs: {ip: "10.0.0." + ((i%200)+1)},
    tags:['demo']
}))

let alerts = Array.from({ length: 10 }).map((_, i) => ({
    id: String(i + 1),
    ts: new Date(Date.now() - i * 600_000).toISOString(),
    severity: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
    entity: `host-${(i % 3) + 1}`,
    status: (['open', 'closed', 'acked'] as const)[i % 3],
    assignee: null as string | null,
}))

type RuleMock = {
      id: string; name: string; query: string; window: number; threshold: number;
      severity: 'low'|'medium'|'high'|'critical'; enabled: boolean; suppress_for?: number | null;
    }
    let rules: RuleMock[] = [
      { id: 'r1', name: 'High CVE burst', query: 'source:nvd AND severity:high', window: 60, threshold: 10, severity: 'high', enabled: true },
      { id: 'r2', name: 'KEV mention', query: 'tags:kev', window: 30, threshold: 1, severity: 'critical', enabled: true },
]


export const handlers = [
    http.get('/v1/stats/overview', async () => {
        await delay(300)
        return HttpResponse.json(overview)
    }),
    http.get('/v1/events', async ({request}) => {
        await delay(300)
        const url = new URL(request.url)
        const q = url.searchParams.get('q')?.toLowerCase() || ''
        const filtered = q ? events.filter(e => e.title.toLowerCase().includes(q)) : events
        return HttpResponse.json(filtered)
    }),
    http.get('/v1/alerts', async () => {
        await delay(200)
        return HttpResponse.json(alerts)
    }),
    // ACK
    http.post('/v1/alerts/:id/ack', async ({ params }) => {
      await delay(150)
      const id = String(params.id)
      alerts = alerts.map(a => a.id === id ? { ...a, status: 'acked' } : a)
      return HttpResponse.json({ ok: true })
    }),
    // Close
    http.post('/v1/alerts/:id/close', async ({ params }) => {
      await delay(150)
      const id = String(params.id)
      alerts = alerts.map(a => a.id === id ? { ...a, status: 'closed' } : a)
      return HttpResponse.json({ ok: true })
    }),
    http.get('/v1/rules', async () => {
      await delay(120)
      return HttpResponse.json(rules)
    }),
    // Create rule
    http.post('/v1/rules', async ({ request }) => {
      await delay(150)
      const body = (await request.json()) as Omit<RuleMock,'id'>
      const id = `r${rules.length + 1}`
      const created: RuleMock = { id, ...body }
      rules = [created, ...rules]
      return HttpResponse.json(created)
    }),
    // Test rule
    http.post('/v1/rules/:id/test', async ({ params }) => {
      await delay(200)
      const id = String(params.id)
      // 간단한 더미 매칭 수: 문자열 길이 기반
      const base = rules.find(r => r.id === id)?.query.length ?? 3
      const matches = (base % 7) + 3
      return HttpResponse.json({ matches })
    }),
    http.post('/v1/auth/login', async ({request}) => {
        await delay(300)
        const { email, password } = (await request.json()) as {email: string; password: string}
        if(email && password){
            return HttpResponse.json({access_token: 'mock-jwt-demo'})
        }
        return new HttpResponse('Unauthorized', {status: 401})
    })
]

