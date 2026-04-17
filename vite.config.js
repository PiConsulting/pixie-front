import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = 'https://pixie-app-dev-epfzdkcpdfcjgmen.brazilsouth-01.azurewebsites.net'

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
    },
  },
})
