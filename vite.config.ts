import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: true, // listen on 0.0.0.0 so you can open from your phone on the same WiFi
  },
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
