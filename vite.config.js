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
    build: {
      minify: 'esbuild',
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    esbuild: {
      drop: env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    // Dev-only proxy: forward /api calls to a published backend to avoid 404 in Vite dev
    server: {
      proxy: env.VITE_API_PROXY_TARGET
        ? {
            '/api': {
              target: env.VITE_API_PROXY_TARGET,
              changeOrigin: true,
              // keep the same path (/api/send-contact)
              rewrite: (p) => p,
            },
          }
        : undefined,
    },
  }
})
