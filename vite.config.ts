import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../engine/web',
    emptyOutDir: true,
  },
  server: {
    allowedHosts: [
      'daytime-supper-upheaval.ngrok-free.dev'
    ]
  }
})
