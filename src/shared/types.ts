import { z } from 'zod'

// DTO 검증 스키마. 서버 경계에서 형태를 보증.
export const EventDto = z.object({
  id: z.string(),
  ts: z.string(),
  source: z.string(),
  type: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  score: z.number().optional(),
  title: z.string(),
  summary: z.string().optional(),
  iocs: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
})
export type EventDto = z.infer<typeof EventDto>

export const AlertDto = z.object({
  id: z.string(),
  rule_id: z.string(),
  ts: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  entity: z.string(),
  status: z.enum(['open', 'acked', 'closed']),
  assignee: z.string().nullable().optional(),
})
export type AlertDto = z.infer<typeof AlertDto>

export const OverviewStatsDto = z.object({
    countsBySeverity: z.record(z.string(), z.number()),
    countsBySource: z.record(z.string(), z.number()),
    latestAlerts: z.array(AlertDto).optional(),
})
export type OverviewStatsDto = z.infer<typeof OverviewStatsDto>
