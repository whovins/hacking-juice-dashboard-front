import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GH Pages처럼 서브경로 배포 시 base 필요
const isGhPages = process.env.GH_PAGES === '1'
const base = isGhPages ? '/hacking-juice-dashboard-front/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/v1/stream': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
