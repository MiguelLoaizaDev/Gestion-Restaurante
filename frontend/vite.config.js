import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // para desarrollo local
    }
  },
  build: {
    outDir: 'dist' // carpeta que Firebase va a usar para hosting
  }
});
