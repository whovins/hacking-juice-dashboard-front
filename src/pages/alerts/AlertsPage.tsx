import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAlerts, ackAlert, closeAlert } from '../../shared/clients/alerts'
import type { AlertDto } from '../../shared/types'
import { Table } from '../../ui/Table'
import { Button } from '../../ui/Button'
import { useEffect } from 'react'
import { useAlertBadge } from '../../config/alert-badge-store'
export default function AlertsPage() {
    const { reset } = useAlertBadge()
    useEffect(() => { reset() }, [reset])
    const qc = useQueryClient()
    const { data: alerts = [] } = useQuery({ queryKey: ['alerts'], queryFn: fetchAlerts })

    const ack = useMutation({
        mutationFn: (id: string) => ackAlert(id),
        onMutate: async (id: string) => {
        await qc.cancelQueries({ queryKey: ['alerts'] })
        const prev = qc.getQueryData<AlertDto[]>(['alerts'])
        if (prev) {
            qc.setQueryData<AlertDto[]>(['alerts'], prev.map(a => a.id === id ? { ...a, status: 'acked' } : a))
        }
        return { prev }
        },
        onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['alerts'], ctx.prev) },
        onSettled: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
    })

    const close = useMutation({
        mutationFn: (id: string) => closeAlert(id),
        onMutate: async (id: string) => {
        await qc.cancelQueries({ queryKey: ['alerts'] })
        const prev = qc.getQueryData<AlertDto[]>(['alerts'])
        if (prev) {
            qc.setQueryData<AlertDto[]>(['alerts'], prev.map(a => a.id === id ? { ...a, status: 'closed' } : a))
        }
        return { prev }
        },
        onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['alerts'], ctx.prev) },
        onSettled: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
    })

    const rows = alerts.map(a => [
        new Date(a.ts).toLocaleString(),
        a.severity,
        a.entity,
        a.status,
        <div key={`act-${a.id}`} style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => ack.mutate(a.id)} disabled={a.status !== 'open'}>ACK</Button>
        <Button onClick={() => close.mutate(a.id)} disabled={a.status === 'closed'} variant="danger">Close</Button>
        </div>,
    ])

    return (
        <div style={{ display: 'grid', gap: 12 }}>
        <h3>Alerts</h3>
        <Table columns={['Time', 'Severity', 'Entity', 'Status', 'Actions']} rows={rows} />
        </div>
    )
}
