import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // в разработке PHP нет: запросы к /api уходят на боевой сайт
    // (сами заявки отправляются, только если в .env.local VITE_SEND_REQUESTS=true)
    proxy: {
      '/api': { target: 'https://ohotnik-oz.ru', changeOrigin: true, secure: true },
    },
  },
})
