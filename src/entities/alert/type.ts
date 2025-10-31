export type Alert = {
  id: string
  rule_id: string
  ts: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  entity: string
  status: 'open' | 'acked' | 'closed'
  assignee?: string | null
}
