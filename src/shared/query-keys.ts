// React Query 키 모음. 파라미터를 키에 포함해 캐시를 분리.
export const qk = {
  overview: ['overview'] as const,
  events: (params: string) => ['events', params] as const,
  alerts: (params: string) => ['alerts', params] as const,
  rules: ['rules'] as const,
  ioc: (value: string) => ['ioc', value] as const,
}
