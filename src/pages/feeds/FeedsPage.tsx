import { useQuery } from '@tanstack/react-query'
import { fetchEvents } from '../../shared/clients/events'
import { Table } from '../../ui/Table'

// 최신 이벤트 피드. 목록 테이블 예시.
export default function FeedsPage() {
  const { data } = useQuery({
    queryKey: ['events', 'recent'],
    queryFn: () => fetchEvents('limit=50&sort=ts:desc'),
  })

  return (
    <div>
      <h3>Recent events</h3>
      <Table
        columns={['ts', 'source', 'type', 'severity', 'title']}
        rows={(data ?? []).map(e => [e.ts, e.source, e.type, e.severity, e.title])}
      />
    </div>
  )
}
