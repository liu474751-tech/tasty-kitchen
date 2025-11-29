import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you plan to host at https://<user>.github.io/tasty-kitchen/
// set the base to '/tasty-kitchen/' so built assets reference correct path.
export default defineConfig({
  base: '/tasty-kitchen/',
  plugins: [react()],
})
