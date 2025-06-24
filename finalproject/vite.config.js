import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  define: {
    global: {},
  },
  server: {
    '/ws': {
      target: 'http://localhost:3001',
      ws: true,
      changeOrigin: true,
      rewriteWsOrigin: true,
      rewrite: (path) => path.replace(/^\/ws/, '/ws'),
    },
    '^/ws/.*': {
      target: 'http://localhost:3001',
      ws: true,
      rewriteWsOrigin: true,
      changeOrigin: true,
    },
  }
})
