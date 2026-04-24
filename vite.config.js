import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = 'https://pixie-app-byb5btd4e7cahpca.eastus2-01.azurewebsites.net'
const MESSAGING_TARGET =
  'https://az-func-whatsapp-notification-b6d7epcyduddh8fd.eastus2-01.azurewebsites.net'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/messaging': {
        target: MESSAGING_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/messaging/, ''),
      },
    },
  },
})
