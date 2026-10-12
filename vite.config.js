import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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