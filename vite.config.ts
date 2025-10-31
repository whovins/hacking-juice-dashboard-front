// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGhPages = process.env.GH_PAGES === '1'
export default defineConfig({
  plugins: [react()],
  base: isGhPages ? '/hacking-juice-dashboard-front/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/v1': { target: 'http://localhost:8000', changeOrigin: true },
      '/v1/stream': { target: 'ws://localhost:8000', ws: true, changeOrigin: true },
    },
  },
})
