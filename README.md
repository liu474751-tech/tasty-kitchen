# Tasty Kitchen (Local Preview)

这是一个轻量的 Vite + React 演示工程，包含 UI 组件示例与本地假数据。项目使用 `lucide-react` 提供图标，部分样式使用 Tailwind（通过 CDN 引入）。

## 快速启动

在仓库根目录执行:

```powershell
npm install
npm run dev
```

在浏览器打开 `http://localhost:5173`（Vite 默认端口）即可查看。

## 登录/注册验证
- 默认账号: `liu474751-tech` / `200283`（用于本地演示）
- 登录失败后，密码会被清空并聚焦到输入框，方便二次输入
- 注册会自动登录并持久化数据到 `localStorage`（刷新后仍然生效）
- 注销将清空本地会话（session），需重新登录

## 说明
- `src/App.jsx`：主应用代码（已修复关键问题，新增 `RecipeDetail` 组件）。
- `src/main.jsx`：入口文件。
- `index.html`：已引入 Tailwind CDN（用于快速预览）。
- `package.json`：基础依赖（react, react-dom, lucide-react, vite）。

## 集成 Gemini API
- 若需要启用 Gemini API，请在 `.env` 中配置 `VITE_GEMINI_API_KEY` 并把 `src/App.jsx` 顶部未注释的 `apiKey` 行改为 `const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";`。

## 其他
- 若缺少图标或报错，请检查 `lucide-react` 版本，或替换图标为 SVG/其他图标。

如果你希望我继续做：
- 添加 Tailwind 本地安装和配置（postcss / tailwind.config.js）
- 把 `apiKey` 处理为环境变量并提供 `.env.example`
- 根据需要进一步拆分组件或增加测试脚本

告诉我下一步你想如何继续，我会继续帮你完善。
