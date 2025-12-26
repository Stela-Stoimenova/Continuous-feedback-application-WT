import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/activities': 'http://localhost:3000',
      '/feedbacks': 'http://localhost:3000'
    }
  }
})





