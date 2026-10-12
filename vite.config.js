import { defineConfig } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true'
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor'
          if (id.includes('/framer-motion/')) return 'motion-vendor'
          if (id.includes('/react-router')) return 'router-vendor'
          if (id.includes('/@tanstack/react-query/')) return 'query-vendor'
          if (id.includes('/sweetalert2/')) return 'alert-vendor'
          if (id.includes('/react-hook-form/')) return 'form-vendor'
          return undefined
        },
      },
    },
  },
})