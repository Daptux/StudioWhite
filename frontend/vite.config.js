import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/': el sitio se sirve desde la raíz del dominio (necesario para las
// rutas /login y /admin con React Router). En Hostinger se sube a public_html.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // En desarrollo redirige las llamadas al backend (Node en :4000)
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
