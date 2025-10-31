import styled from 'styled-components'
import { ReactNode } from 'react'

const TableEl = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 8px; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; text-align: left }
  th { color: ${({ theme }) => theme.colors.subtext } }
`

// 아주 단순한 테이블. 나중에 가상 스크롤/정렬/선택 기능 확장 가능.
export function Table({ columns, rows }: { columns: string[]; rows: (string | number | ReactNode)[][] }) {
  return (
    <TableEl>
      <thead>
        <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
      </tbody>
    </TableEl>
  )
}
