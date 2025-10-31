import { get } from '../transport/rest'
import { EventDto, OverviewStatsDto } from '../types'

// 이벤트 목록 조회
export function fetchEvents(query: string) {
  const qs = query ? `?${query}` : ''
  return get<EventDto[]>(`/events${qs}`)
}

// 대시보드 개요 통계
export function fetchOverview() {
  return get<OverviewStatsDto>('/stats/overview')
}
