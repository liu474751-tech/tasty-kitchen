const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// 从环境变量读取 API key（安全）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ 错误：未设置 GEMINI_API_KEY 环境变量');
  process.exit(1);
}

// 中间件
app.use(cors()); // 允许前端跨域请求
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gemini Proxy Server is running' });
});

// Gemini API 代理端点
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '缺少 prompt 参数' });
    }

    // 构建请求体
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    // 如果有系统指令，添加到请求中
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    // 调用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API 错误:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    
    // 提取生成的文本
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    res.json({ 
      success: true, 
      text: generatedText,
      raw: data // 可选：返回完整响应
    });

  } catch (error) {
    console.error('服务器错误:', error);
    res.status(500).json({ 
      error: '服务器内部错误', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini 代理服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API 端点: POST http://localhost:${PORT}/api/gemini/generate`);
});
