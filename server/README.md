# Tasty Kitchen - Gemini API 代理服务器

## 📖 简介

这是一个安全的后端代理服务器，用于在生产环境中保护 Gemini API 密钥。前端通过此服务器调用 Gemini API，而不是直接暴露密钥。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（复制 `.env.example`）：

```bash
cp .env.example .env
```

编辑 `.env` 并填入你的 Gemini API Key：

```
GEMINI_API_KEY=AIzaSyDXKwB1cX_p3htptwOwBenl_AbwHhVQJr4
PORT=3001
```

### 3. 启动服务器

**开发模式**（自动重启）：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

服务器将运行在 `http://localhost:3001`

## 📡 API 端点

### POST /api/gemini/generate

调用 Gemini 生成内容。

**请求体**：
```json
{
  "prompt": "你的问题或提示",
  "systemInstruction": "系统指令（可选）"
}
```

**响应**：
```json
{
  "success": true,
  "text": "生成的文本内容"
}
```

### GET /health

健康检查端点。

**响应**：
```json
{
  "status": "ok",
  "message": "Gemini Proxy Server is running"
}
```

## 🔧 前端集成

修改前端代码中的 `callGeminiAPI` 函数，改为调用代理服务器：

```javascript
async function callGeminiAPI(prompt, systemInstruction = "") {
  try {
    const response = await fetch('http://localhost:3001/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, systemInstruction })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API 调用失败');
    }

    return data.text;
  } catch (error) {
    console.error('调用 Gemini 代理失败:', error);
    return '抱歉，AI 服务暂时不可用。';
  }
}
```

## 🌐 部署到生产环境

### 选项 1: Vercel（推荐）

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 在 `server/` 目录创建 `vercel.json`：
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
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

3. 部署：
```bash
vercel
```

4. 设置环境变量：
```bash
vercel env add GEMINI_API_KEY
```

### 选项 2: Railway

1. 访问 https://railway.app/
2. 连接 GitHub 仓库
3. 选择 `server/` 目录
4. 添加环境变量 `GEMINI_API_KEY`
5. 部署

### 选项 3: Render

1. 访问 https://render.com/
2. 创建新的 Web Service
3. 连接 GitHub 仓库
4. 设置 Root Directory 为 `server`
5. 添加环境变量 `GEMINI_API_KEY`
6. 部署

## 🔒 安全注意事项

- ✅ **永远不要**把 `.env` 文件提交到 Git
- ✅ `.env` 已添加到 `.gitignore`
- ✅ API Key 只保存在服务器端
- ✅ 使用 CORS 限制允许的前端域名（生产环境）
- ✅ 考虑添加速率限制（rate limiting）

## 📝 生产环境 CORS 配置

修改 `server.js` 中的 CORS 配置以限制允许的域名：

```javascript
app.use(cors({
  origin: [
    'https://liu474751-tech.github.io',
    'http://meishichufang.meishitiandi.dpdns.org'
  ],
  credentials: true
}));
```

## 🐛 故障排除

### 问题：服务器无法启动
- 检查是否设置了 `GEMINI_API_KEY` 环境变量
- 检查端口 3001 是否被占用

### 问题：前端无法连接
- 确认服务器正在运行
- 检查 CORS 配置
- 检查前端请求的 URL 是否正确

### 问题：API 调用失败
- 验证 Gemini API Key 是否有效
- 检查网络连接
- 查看服务器日志获取详细错误信息

## 📚 相关资源

- [Gemini API 文档](https://ai.google.dev/docs)
- [Express.js 文档](https://expressjs.com/)
- [Vercel 部署指南](https://vercel.com/docs)
