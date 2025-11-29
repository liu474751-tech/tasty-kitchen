import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite base path defaults to '/' (suitable for Vercel).
// To build for GitHub Pages under /tasty-kitchen/, set env var VITE_BASE_PATH='/tasty-kitchen/' during build.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
})
