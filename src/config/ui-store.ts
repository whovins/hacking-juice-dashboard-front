import { create } from 'zustand'

// 전역 로컬 상태. 현재는 테마만 관리.
type UiState = {
    theme: 'light' | 'dark'
    setTheme: (t: 'light' | 'dark') => void
    mswEnabled: boolean
    setMswEnabled: (v: boolean) => void
}

export const useUiStore = create<UiState>(set => ({
  theme:
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  setTheme: t => set({ theme: t }),
  mswEnabled: localStorage.getItem('msw:enabled') !== 'false',
  setMswEnabled: (v) => {
    set({ mswEnabled: v })
    try { localStorage.setItem('msw:enabled', v ? 'true' : 'false') } catch {}
   },
}))
