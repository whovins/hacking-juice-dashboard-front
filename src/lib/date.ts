import { format } from 'date-fns'

// ISO 문자열을 간단 포맷으로.
export const fmtTs = (ts: string) => format(new Date(ts), 'yyyy-MM-dd HH:mm:ss')
