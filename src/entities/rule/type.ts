export type Rule = {
  id: string
  name: string
  query: string
  window: string
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
}
