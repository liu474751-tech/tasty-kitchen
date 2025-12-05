import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite base path defaults to '/' (suitable for custom domain).
// For GitHub Pages under /tasty-kitchen/, set env var VITE_BASE_PATH='/tasty-kitchen/' during build.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react']
  },
  esbuild: {
    target: 'es2019'
  },
  build: {
    target: 'es2019',
    outDir: 'docs',  // 输出到 docs 目录用于 GitHub Pages
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/, /lucide-react/]
    }
  },
})
