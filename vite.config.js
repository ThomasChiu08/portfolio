import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/gsap/')) {
            return 'gsap'
          }

          if (id.includes('/node_modules/ogl/')) {
            return 'ogl'
          }

          return undefined
        },
      },
    },
  },
})
