import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // Allow different deployment bases per hosting (e.g., subpath for GitHub Pages or CDN)
    base: env.VITE_BASE || '/',
    define: {
      __SITE_NAME__: JSON.stringify(env.VITE_SITE_NAME || 'Greenline'),
    },
  }
})
