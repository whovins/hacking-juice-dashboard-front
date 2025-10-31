import { get, post } from '../transport/rest'
import type { AlertDto } from '../types'

export function fetchAlerts() {
  return get<AlertDto[]>('/alerts')
}

export function ackAlert(id: string) {
  return post<{ ok: true }>(`/alerts/${id}/ack`, {})
}

export function closeAlert(id: string) {
  return post<{ ok: true }>(`/alerts/${id}/close`, {})
}
