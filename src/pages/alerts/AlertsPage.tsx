import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAlerts, ackAlert, closeAlert } from '../../shared/clients/alerts'
import type { AlertDto } from '../../shared/types'
import { useAlertBadge } from '../../config/alert-badge-store'
import { AlertDetailDrawer } from './AlertDetailDrawer'
import { ConfirmModal } from '../../ui/Modal'
import { useToasts } from '../../ui/Toast'

// 상단 컨트롤 바
const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`
// 페이지 전용 테이블(정렬 버튼/행 클릭을 위해 커스텀)
const TableBox = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    padding: 8px;
    text-align: left;
    color: ${({theme}) => theme.colors.text};
  }
  tbody tr { cursor: pointer; }
  tbody tr:hover { background: ${({theme}) => theme.colors.card}; }
  th button {
    background: none; border: none; cursor: pointer; font: inherit;
    display: inline-flex; align-items: center; gap: 4px;
    color: ${({theme}) => theme.colors.text};
  }
`


type SortKey = 'ts' | 'severity' | 'entity' | 'status'
type SortDir = 'asc' | 'desc'

function sevOrder(s: AlertDto['severity']) {
  return ({ low: 0, medium: 1, high: 2, critical: 3 } as const)[s]
}

export default function AlertsPage() {
  // 알림 배지(페이지 진입 시 리셋)
  const { reset, setMuted } = useAlertBadge()
  useEffect(() => { 
    reset()
    setMuted(true) 
    return () => setMuted(false)
}, [reset])

  const qc = useQueryClient()
  const { push } = useToasts()

  // 데이터 로드
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 10_000,
  })

  const [sev, setSev] = useState<'all' | AlertDto['severity']>('all')
  const [status, setStatus] = useState<'all' | 'open' | 'acked' | 'closed'>('all')
  const [q, setQ] = useState('')
  

    const [sort, setSort] = useState<{key: SortKey; dir: SortDir}>({key: 'ts', dir: 'desc'})

  const [cur, setCur] = useState<AlertDto | null>(null)
  const [confirm, setConfirm] = useState<{ mode: 'ack' | 'close', id: string } | null>(null)

  const rows = useMemo(() => {
    const filtered = (alerts ?? [])
      .filter(a => sev === 'all' ? true : a.severity === sev)
      .filter(a => status === 'all' ? true : a.status === status)
      .filter(a => q ? (a.entity.toLowerCase().includes(q.toLowerCase()) || a.id.includes(q)) : true)

    const sorted = [...filtered].sort((a, b) => {
        let cmp = 0
        switch (sort.key){
            case 'ts':
                cmp = new Date(a.ts).getTime() - new Date(b.ts).getTime()
                break
            case 'severity':
                cmp = ({ low: 0, medium: 1, high: 2, critical: 3 } as const)[a.severity] - ({ low: 0, medium: 1, high: 2, critical: 3 } as const)[b.severity]
                break
            case 'entity':
                cmp = a.entity.localeCompare(b.entity)
                break
            case 'status':
                cmp = a.status.localeCompare(b.status)
                break
        }
        return sort.dir === 'asc' ? cmp : -cmp
    }) 
    return sorted
  }, [alerts, sev, status, q, sort.key, sort.dir])

  function toggleSort(k: SortKey) {
    setSort(s => (s.key === k ? {key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : {key: k, dir: 'asc'}))
  }

  function sortIcon(k: SortKey) {
        if (k !== sort.key) return '';
        return sort.dir === 'asc' ? '▲' : '▼';
    }

  const ack = useMutation({
    mutationFn: (id: string) => ackAlert(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['alerts'] })
      const prev = qc.getQueryData<AlertDto[]>(['alerts'])
      qc.setQueryData<AlertDto[]>(['alerts'], (old) =>
        (old ?? []).map(a => a.id === id ? { ...a, status: 'acked' } : a)
      )
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['alerts'], ctx.prev)
      push('Ack failed')
    },
    onSuccess: (_d, id) => { push(`Alert ${id} acked`) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['alerts'] }) },
  })

  const close = useMutation({
    mutationFn: (id: string) => closeAlert(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['alerts'] })
      const prev = qc.getQueryData<AlertDto[]>(['alerts'])
      qc.setQueryData<AlertDto[]>(['alerts'], (old) =>
        (old ?? []).map(a => a.id === id ? { ...a, status: 'closed' } : a)
      )
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['alerts'], ctx.prev)
      push('Close failed')
    },
    onSuccess: (_d, id) => { push(`Alert ${id} closed`) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['alerts'] }) },
  })

  function requestAck(id: string)   { setConfirm({ mode:'ack', id }) }
  function requestClose(id: string) { setConfirm({ mode:'close', id }) }
  function doConfirm() {
    if (!confirm) return
    if (confirm.mode === 'ack') ack.mutate(confirm.id)
    if (confirm.mode === 'close') close.mutate(confirm.id)
    setCur(c => c && c.id === confirm.id
      ? { ...c, status: confirm.mode === 'ack' ? 'acked' : 'closed' }
      : c)
    setConfirm(null)
  }

  if (isLoading) return <div>Loading…</div>
  if (error)     return <div>Failed to load</div>

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h3>Alerts</h3>

      <Bar>
        <select value={sev} onChange={e=>setSev(e.target.value as any)}>
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="acked">Acked</option>
          <option value="closed">Closed</option>
        </select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search entity/id…" />
      </Bar>

      <TableBox>
        <colgroup>
            <col width="20%"/>
            <col width="10%"/>
            <col width="40%"/>
            <col width="15%"/>
            <col width="15%"/>
        </colgroup>
        <thead>
          <tr>
            <th><button style={{paddingLeft: 0}} onClick={()=>toggleSort('ts')}>
            Time {sortIcon('ts')}
            </button></th>
            <th><button style={{paddingLeft: 0}} onClick={()=>toggleSort('severity')}>
            Severity {sortIcon('severity')}
            </button></th>
            <th><button style={{paddingLeft: 0}} onClick={()=>toggleSort('entity')}>
            Entity {sortIcon('entity')}
            </button></th>
            <th><button style={{paddingLeft: 0}} onClick={()=>toggleSort('status')}>
            Status {sortIcon('status')}
            </button></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(a => (
            <tr key={a.id} onClick={()=>setCur(a)}>
              <td>{new Date(a.ts).toLocaleString()}</td>
              <td>{a.severity}</td>
              <td>{a.entity}</td>
              <td>{a.status}</td>
              <td onClick={(e)=>e.stopPropagation()}>
                <button onClick={()=>requestAck(a.id)} disabled={a.status!=='open'}>Ack</button>
                <button onClick={()=>requestClose(a.id)} disabled={a.status==='closed'} style={{marginLeft:8}}>Close</button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableBox>

      {cur && (
        <AlertDetailDrawer
          alert={cur}
          onClose={()=>setCur(null)}
          onAck={()=>requestAck(cur.id)}
          onCloseAlert={()=>requestClose(cur.id)}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.mode === 'ack' ? 'Acknowledge alert?' : 'Close alert?'}
          message={confirm.mode === 'ack'
            ? `Mark alert #${confirm.id} as acked.`
            : `Mark alert #${confirm.id} as closed.`}
          confirmText={confirm.mode === 'ack' ? 'Ack' : 'Close'}
          danger={confirm.mode === 'close'}
          onCancel={()=>setConfirm(null)}
          onConfirm={doConfirm}
        />
      )}
    </div>
  )
}
