import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用根路径，适用于自定义域名或通用部署
  base: '/',
  build: {
    // 防止因语法过新导致的构建报错
    target: 'es2019',
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
