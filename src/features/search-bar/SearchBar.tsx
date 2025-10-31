import { useState } from 'react'
import { Button } from '../../ui/Button'

// 단순 검색 바 예시. 상위에서 onSearch로 쿼리 전달.
export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
      <Button onClick={() => onSearch(q)} variant="primary">Search</Button>
    </div>
  )
}
