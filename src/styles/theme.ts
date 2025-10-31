export type Theme = {
  name: 'light' | 'dark'
  colors: {
    bg: string
    card: string
    text: string
    subtext: string
    primary: string
    success: string
    warning: string
    danger: string
    border: string
  }
  radius: { md: string; lg: string }
  spacing: (n: number) => string
}

const base = {
  radius: { md: '10px', lg: '16px' },
  spacing: (n: number) => `${n * 8}px`,
}

export const themeLight: Theme = {
  name: 'light',
  colors: {
    bg: '#f7f8fa',
    card: '#ffffff',
    text: '#101418',
    subtext: '#5c6670',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#e5e7eb',
  },
  ...base,
}

export const themeDark: Theme = {
  name: 'dark',
  colors: {
    bg: '#0b0f14',
    card: '#12171d',
    text: '#e6e8ea',
    subtext: '#98a2ad',
    primary: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    border: '#1f2937',
  },
  ...base,
}
