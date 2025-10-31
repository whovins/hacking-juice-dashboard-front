// 컴포넌트에서 사용할 도메인 타입. 필요시 DTO -> Domain 어댑터를 둔다.
export type Event = {
  id: string
  ts: string
  source: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  summary?: string
  tags?: string[]
}
