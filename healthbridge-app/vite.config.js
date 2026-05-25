// vite.config.js
// ─────────────────────────────────────────────────────────────
// Vite build configuration for HealthBridge.
// @vitejs/plugin-react enables Fast Refresh in development.
// ─────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// FIX: derive __dirname in ES modules so lint and Vite agree on the alias path.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],

  // Path aliases — use @/ instead of ../../ in imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Dev server config
  server: {
    port: 5173,
    open: true,    // Auto-open browser on npm run dev
  },
})
