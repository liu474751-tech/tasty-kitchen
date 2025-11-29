import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 关键修复 1：必须填对仓库名，否则发布后是白屏
  base: '/tasty-kitchen/', 
  build: {
    // ⚠️ 关键修复 2：防止因语法过新导致的构建报错
    target: 'es2019', 
    outDir: 'dist',
  }
})
