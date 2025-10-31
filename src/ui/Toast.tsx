import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'

const Host = styled.div`
  position: fixed; right: 16px; bottom: 16px;
  display: grid; gap: 8px; z-index: 50;
`
const Item = styled.div`
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid ${({theme})=>theme.colors.border};
  background: tomato;
  box-shadow: 0 6px 24px rgba(0,0,0,.25);
  min-width: 240px;
`

export type Toast = { id: string; text: string }

type Ctx = {
  items: Toast[]
  push: (text: string) => void
  remove: (id: string) => void
  clear: () => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const api = useMemo<Ctx>(() => ({
    items,
    push: (text: string) => {
      const id = `${Date.now()}-${Math.random()}`
      setItems(list => [{ id, text }, ...list])
      // 4초 뒤 자동 제거
      setTimeout(() => setItems(list => list.filter(i => i.id !== id)), 4000)
    },
    remove: (id: string) => setItems(list => list.filter(i => i.id !== id)),
    clear: () => setItems([]),
  }), [items])

  return <ToastCtx.Provider value={api}>{children}</ToastCtx.Provider>
}

export function useToasts() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToasts must be used within <ToastProvider>')
  return ctx
}

export function ToastHost() {
  const { items } = useToasts()
  const [list, setList] = useState(items)
  useEffect(() => setList(items), [items])
  return <Host>{list.map(i => <Item key={i.id}>{i.text}</Item>)}</Host>
}
