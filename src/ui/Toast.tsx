import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Host = styled.div`
  position: fixed; right: 16px; bottom: 16px;
  display: grid; gap: 8px; z-index: 50;
`
//   background: ${({theme})=>theme.colors.card};
const Item = styled.div`
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid ${({theme})=>theme.colors.border};
  background: tomato;
  box-shadow: 0 6px 24px rgba(0,0,0,.25);
  min-width: 240px;
`

export type Toast = { id: string; text: string }

export function useToasts() {
  const [items, set] = useState<Toast[]>([])
  function push(text: string) {
    const id = String(Date.now() + Math.random())
    set(list => [{ id, text }, ...list])
    setTimeout(() => set(list => list.filter(i => i.id !== id)), 4000)
  }
  return { items, push }
}

export function ToastHost({ items }: { items: Toast[] }) {
  const [list, setList] = useState(items)
  useEffect(() => setList(items), [items])
  return <Host>{list.map(i => <Item key={i.id}>{i.text}</Item>)}</Host>
}
