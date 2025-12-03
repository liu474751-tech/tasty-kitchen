import React from 'react'
import { createRoot } from 'react-dom/client'
// 入口恢复为主实现（已清理）。
import App from './App'
import './styles.css'

// 从 URL 查询参数读取初始 tab（例如: /?tab=ai-kitchen）并传递给 App
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const initialTab = params ? params.get('tab') : null;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App initialTab={initialTab} />
  </React.StrictMode>
)
