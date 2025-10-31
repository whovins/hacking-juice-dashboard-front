import { get, post } from '../transport/rest'

export type RuleDto = {
  id: string
  name: string
  query: string
  window: number          // minutes
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  suppress_for?: number | null  // minutes
  actions?: Record<string, unknown>
}

export function fetchRules() {
  return get<RuleDto[]>('/rules')
}

export function createRule(payload: Omit<RuleDto, 'id'>) {
  return post<RuleDto>('/rules', payload)
}

export function testRule(id: string) {
  return post<{ matches: number }>(`/rules/${id}/test`, {})
}
