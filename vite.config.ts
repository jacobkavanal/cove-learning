import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tutors: resolve(__dirname, 'tutors/index.html'),
        parents: resolve(__dirname, 'parents/index.html'),
        portal: resolve(__dirname, 'portal/index.html'),
      },
    },
  },
})
