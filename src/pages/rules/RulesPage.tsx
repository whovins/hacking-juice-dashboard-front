import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { fetchRules, createRule, testRule, RuleDto } from '../../shared/clients/rules'
import { Table } from '../../ui/Table'
import { Button } from '../../ui/Button'

const RuleSchema = z.object({
  name: z.string().min(1, 'name is required'),
  query: z.string().min(1, 'query is required'),
  window: z.coerce.number().int().positive(),
  threshold: z.coerce.number().int().positive(),
  severity: z.enum(['low','medium','high','critical']),
  enabled: z.coerce.boolean(),
  suppress_for: z.coerce.number().int().positive().optional().nullable(),
})

export default function RulesPage() {
  const qc = useQueryClient()
  const { data: rules = [] } = useQuery({ queryKey: ['rules'], queryFn: fetchRules })

  const [form, setForm] = useState({
    name: '',
    query: '',
    window: 15,
    threshold: 5,
    severity: 'medium',
    enabled: true,
    suppress_for: undefined as number | undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: () => {
      const parsed = RuleSchema.safeParse(form)
      if (!parsed.success) {
        const err: Record<string,string> = {}
        parsed.error.issues.forEach(i => { err[i.path.join('.')] = i.message })
        setErrors(err)
        throw new Error('validation')
      }
      setErrors({})
      return createRule(parsed.data as any)
    },
    onSuccess: (created) => {
      qc.setQueryData<RuleDto[]>(['rules'], (prev = []) => [created, ...prev])
      setForm({ name:'', query:'', window:15, threshold:5, severity:'medium', enabled:true, suppress_for: undefined })
    }
  })

  async function onTest(id: string) {
    setTestingId(id); setTestResult(null)
    try {
      const res = await testRule(id)
      setTestResult(`Rule ${id} matches: ${res.matches}`)
    } finally {
      setTestingId(null)
    }
  }

  const rows = rules.map(r => [
    r.name,
    r.severity,
    `${r.window}m / >=${r.threshold}`,
    r.enabled ? 'enabled' : 'disabled',
    <div key={r.id} style={{ display:'flex', gap:8 }}>
      <Button onClick={() => onTest(r.id)} disabled={!!testingId && testingId!==r.id}>
        {testingId===r.id ? 'Testing…' : 'Test'}
      </Button>
    </div>
  ])

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h3>Rules</h3>

      <div style={{ display:'grid', gap:8, padding:12, border:'1px solid rgba(255,255,255,.12)', borderRadius:8 }}>
        <div style={{ fontWeight:600 }}>Create rule</div>
        <label>
          Name
          <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
          {errors.name && <span style={{ color:'tomato', marginLeft:8 }}>{errors.name}</span>}
        </label>
        <label>
          Query
          <textarea value={form.query} onChange={e=>setForm(f=>({...f, query:e.target.value}))} rows={3}/>
          {errors.query && <span style={{ color:'tomato', marginLeft:8 }}>{errors.query}</span>}
        </label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
          <label>
            Window(min)
            <input type="number" value={form.window} onChange={e=>setForm(f=>({...f, window: Number(e.target.value)}))}/>
            {errors.window && <span style={{ color:'tomato', marginLeft:8 }}>{errors.window}</span>}
          </label>
          <label>
            Threshold
            <input type="number" value={form.threshold} onChange={e=>setForm(f=>({...f, threshold: Number(e.target.value)}))}/>
            {errors.threshold && <span style={{ color:'tomato', marginLeft:8 }}>{errors.threshold}</span>}
          </label>
          <label>
            Severity
            <select value={form.severity} onChange={e=>setForm(f=>({...f, severity: e.target.value as any}))}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </label>
          <label style={{ alignSelf:'end' }}>
            <input type="checkbox" checked={form.enabled} onChange={e=>setForm(f=>({...f, enabled: e.target.checked}))}/>
            enabled
          </label>
        </div>
        <label>
          Suppress for(min, optional)
          <input type="number" value={form.suppress_for ?? ''} onChange={e=>setForm(f=>({...f, suppress_for: e.target.value? Number(e.target.value): undefined}))}/>
          {errors.suppress_for && <span style={{ color:'tomato', marginLeft:8 }}>{errors.suppress_for}</span>}
        </label>
        <div>
          <Button onClick={() => create.mutate()} variant="primary" disabled={create.isPending}>
            {create.isPending ? 'Saving…' : 'Save rule'}
          </Button>
          {create.isError && <span style={{ color:'tomato', marginLeft:12 }}>Validation failed</span>}
          {testResult && <span style={{ marginLeft:12, opacity:.8 }}>{testResult}</span>}
        </div>
      </div>

      <Table columns={['Name','Severity','Window/Threshold','Status','Actions']} rows={rows}/>
    </div>
  )
}
