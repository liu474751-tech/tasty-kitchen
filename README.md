# Tasty Kitchen (Local Preview)

这是一个轻量的 Vite + React 演示工程，包含 UI 组件示例与本地假数据。项目使用 `lucide-react` 提供图标，部分样式使用 Tailwind（通过 CDN 引入）。

## 快速启动

在仓库根目录执行:

```powershell
npm install
npm run dev
```

在浏览器打开 `http://localhost:5173`（Vite 默认端口）即可查看。

### 常见问题排查
- 如果你看不到改动或界面和预期不一致，请尝试：
	1. 确保依赖已安装并启动本地服务器：

```powershell
npm install
npm run dev
```

	2. 清除浏览器缓存或执行硬刷新（Ctrl+F5），并打开 DevTools 看控制台错误。
	3. 清除本地测试数据：在浏览器控制台执行 `localStorage.removeItem('tk_session'); localStorage.removeItem('tk_users');` 然后刷新。
	4. 如果仍然打不开，请在项目根目录执行 `git pull origin main` 确保你在最新分支和代码。
	5. 如果你启用了 Gemini API，请务必在 `.env.local` 中配置 `VITE_GEMINI_API_KEY`，并重启 dev server。

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

## 部署到 GitHub Pages（示例）

如果你想把项目托管到 GitHub Pages（示例地址： https://<username>.github.io/tasty-kitchen/ ）：

- 我已添加自动部署的 GitHub Actions workflow（位于 `.github/workflows/deploy.yml`）。该工作流会在每次 push 到 `main` 时触发，运行 `npm run build` 并把 `dist` 目录发布到 `gh-pages` 分支。
- 我已在项目根加入 `vite.config.js`，默认 `base` 设置为 `/tasty-kitchen/`（如果你使用自定义域或希望部署到根域，请修改该设置）。

调试 404 页面或 GitHub Pages 问题：
1. 前往仓库 Settings -> Pages，检查 Source（发布源）是否为 `gh-pages` 分支，或 `main` 分支的 `/docs`（取决于你选择的部署方式）。
2. 如果选 `main` + `/docs`，请确保构建产物已放入 `docs` 文件夹后再推到 `main`；如果使用 Actions，则确保 Source 指向 `gh-pages`，并查看 Actions 的执行日志（Actions -> 点击部署 Workflow）是否成功。
3. 若启用了自定义域，请确认 DNS 配置和 CNAME 文件是否正确。如果 DNS 指向错误，或 CNAME 未设置，会导致 404。
4. 如果你只是看到 404 而仓库 Page 还未生效，Actions 第一次运行或构建可能需要几分钟，请稍等并查看 Actions logs。

手动构建并临时发布到 `gh-pages`：
```powershell
npm install
npm run build
# 使用 gh-pages 工具（可选）或手动推送 /docs 或 gh-pages 分支
```

绑定自定义域 `meishitiandi.dpdns.org`（快速指引）:
1. 我已在 GitHub Actions workflow 中添加 `dist/CNAME`（将自动把自定义域写入部署）;
2. 请在 Cloudflare DNS 控制台添加一条 CNAME 记录：
	- Type: CNAME
	- Name: meishitiandi
	- Target / Value: liu474751-tech.github.io
	- Proxy/Cloudflare CDN: 灰色云（DNS only，不开启代理），以便 GitHub 验证并分配证书。
3. 等待 DNS 生效（通常 1 分钟到 1 小时），然后访问 `https://meishitiandi.dpdns.org` 即可。

如果你愿意，我可以代为添加 DNS 记录（需 Cloudflare API Token），或者你也可以把上述的记录手动添加到 Cloudflare Dashboard。

如果你希望我自动添加 GitHub Pages 自动部署（我已经添加 workflow），或者希望我修改 `vite.config.js` 的 `base` 值，请告诉我想托管的 URL（例如： `https://liu474751-tech.github.io/tasty-kitchen/`）以及是否已启用 Pages 的自定义域。

如果你希望我继续做：
- 添加 Tailwind 本地安装和配置（postcss / tailwind.config.js）
- 把 `apiKey` 处理为环境变量并提供 `.env.example`
- 根据需要进一步拆分组件或增加测试脚本

告诉我下一步你想如何继续，我会继续帮你完善。
