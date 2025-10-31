import { create } from 'zustand'

type S = { count: number; inc: () => void; reset: () => void }
export const useAlertBadge = create<S>((set)=>({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))
