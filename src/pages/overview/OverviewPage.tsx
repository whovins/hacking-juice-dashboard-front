import { useQuery } from '@tanstack/react-query'
import { Card } from '../../ui/Card'
import { fetchOverview } from '../../shared/clients/events'
import SeverityPie from '../../widgets/serverity-pie/ServerityPie'
import SourceBar from '../../widgets/source-bar/SourceBar'

// 대시보드 개요 화면. 서버 통계 두 가지를 카드로 시각화.
export default function OverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview'],
    queryFn: fetchOverview,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  const sev = Object.entries(data?.countsBySeverity ?? {})
  const src = Object.entries(data?.countsBySource ?? {})

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <h3>Events by severity</h3>
        <SeverityPie
          data={sev.map(([k, v]) => ({ name: k, value: v as number }))}
        />
      </Card>
      <Card>
        <h3>Events by source</h3>
        <SourceBar
          data={src.map(([k, v]) => ({ name: k, value: v as number }))}
        />
      </Card>
    </div>
  )
}
