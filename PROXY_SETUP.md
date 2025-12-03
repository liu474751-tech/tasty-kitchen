# 🚀 后端代理快速开始指南

## 第一步：安装后端依赖并配置

```powershell
# 进入 server 目录
cd server

# 安装依赖
npm install

# 创建 .env 文件
Copy-Item .env.example .env

# 用记事本编辑 .env，填入你的 Gemini API Key
notepad .env
```

在 `.env` 文件中填入：
```
GEMINI_API_KEY=AIzaSyDXKwB1cX_p3htptwOwBenl_AbwHhVQJr4
PORT=3001
```

## 第二步：启动后端服务器

```powershell
# 开发模式（自动重启）
npm run dev
```

你应该看到：
```
✅ Gemini 代理服务器运行在 http://localhost:3001
📡 API 端点: POST http://localhost:3001/api/gemini/generate
```

## 第三步：测试后端（可选）

打开新终端，测试 API：

```powershell
# 测试健康检查
Invoke-RestMethod -Uri "http://localhost:3001/health"

# 测试 AI 生成
$body = @{
    prompt = "你好，请用一句话介绍你自己"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/gemini/generate" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

## 第四步：启动前端（新终端）

```powershell
# 回到项目根目录
cd ..

# 启动前端开发服务器
npm run dev
```

## 第五步：测试完整功能

1. 打开浏览器访问：http://localhost:5173
2. 登录账号（默认：liu474751-tech / 200283）
3. 打开菜谱详情页
4. 点击"向 AI 咨询"按钮
5. 输入问题，测试 AI 功能

## 🌐 部署到生产环境

### 推荐方案：Vercel（免费）

1. **创建 Vercel 配置文件**：

在 `server/` 目录创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

2. **部署到 Vercel**：

```powershell
# 安装 Vercel CLI
npm install -g vercel

# 在 server/ 目录下部署
cd server
vercel

# 设置环境变量
vercel env add GEMINI_API_KEY production
# 输入你的 API Key: AIzaSyDXKwB1cX_p3htptwOwBenl_AbwHhVQJr4

# 再次部署以应用环境变量
vercel --prod
```

3. **更新前端配置**：

复制 Vercel 给你的 URL（例如 `https://your-app.vercel.app`）

在项目根创建 `.env.production`：
```
VITE_API_PROXY_URL=https://your-app.vercel.app
```

4. **重新构建前端**：

```powershell
cd ..
npm run build

# 复制 dist/ 到 docs/
Copy-Item -Recurse -Force dist/* docs/

git add .
git commit -m "chore: update with backend proxy integration"
git push
```

## 📊 架构图

```
用户浏览器
    ↓
GitHub Pages (前端静态网站)
    ↓
Vercel (后端代理服务器)
    ↓
Google Gemini API
```

## ✅ 优势

- ✅ API Key 安全（不暴露给前端）
- ✅ 免费部署（Vercel 免费套餐）
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动缩放

## 🔧 故障排除

### 问题：前端无法连接后端
- 检查后端服务器是否运行
- 检查 CORS 配置（`server.js` 中）
- 确认前端 `VITE_API_PROXY_URL` 正确

### 问题：AI 返回错误
- 检查 Gemini API Key 是否正确
- 查看后端控制台日志
- 确认 API Key 有足够配额

## 📚 相关文档

- [完整 README](./server/README.md)
- [Vercel 部署文档](https://vercel.com/docs)
- [Gemini API 文档](https://ai.google.dev/docs)
