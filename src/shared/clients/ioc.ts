import { get } from '../transport/rest'

export type IocDto = {
  ioc: string
  ioc_type: string
  first_seen?: string
  last_seen?: string
  sources?: Record<string, unknown>
  score?: number
}

export const fetchIoc = (value: string) =>
  get<IocDto>(`/ioc/${encodeURIComponent(value)}`)
