import { create } from 'zustand'

type S = { 
    count: number; 
    muted: boolean;
    inc: () => void; 
    reset: () => void;
    setMuted: (v: boolean) => void;
 }
export const useAlertBadge = create<S>((set, get)=>({
  count: 0,
  muted: false,
  inc: () => set(s => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
  setMuted: (v: boolean) => set({muted: v})
}))
