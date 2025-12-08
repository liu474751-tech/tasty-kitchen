// Build: 2025-12-08 专业食谱工具版
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChefHat, Clock, Flame, Heart, ChevronLeft, Users,
  Home, Bookmark, X, PlayCircle, Skull, Sparkles,
  Video, ThumbsDown, Scroll, Ghost, Biohazard, Loader2, Crown, Zap
} from 'lucide-react';

// Gemini API 调用函数 (仅用于邪修炼丹炉)
async function callGeminiAPI(prompt, systemInstruction = "") {
  // 默认使用 Gemini 3 Pro (Preview)，可通过 VITE_GEMINI_MODEL 覆盖
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.0-pro';
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const USE_PROXY = import.meta.env.PROD || !apiKey;
  const PROXY_URL = import.meta.env.VITE_API_PROXY_URL || 'http://localhost:3001';

  if (USE_PROXY) {
    try {
      const response = await fetch(`${PROXY_URL}/api/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'API 调用失败');
      return data.text;
    } catch (error) {
      console.error('调用 Gemini 代理失败:', error);
      return '抱歉，AI 服务暂时不可用。请稍后再试。';
    }
  }

  try {
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (systemInstruction) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) throw new Error(`API 错误: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini API 调用失败:', error);
    return '抱歉，AI 服务暂时不可用。';
  }
}

// --- localStorage keys for demo persistence
const USERS_KEY = 'tk_users';
const SESSION_KEY = 'tk_session';

const loadUsersFromStorage = () => {
  try { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};

const saveUsersToStorage = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch(e) { console.error('Failed to save users:', e); }
};

const loadSession = () => {
  try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};

const saveSession = (username) => {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ username })); } catch(e) { console.error('Failed to save session:', e); }
};

const clearSession = () => {
  try { localStorage.removeItem(SESSION_KEY); } catch(e) { console.error('Failed to clear session:', e); }
};

// convert plaintext passwords to sha256 on first load for safety.
const isHashed = (pw) => typeof pw === 'string' && /^[0-9a-f]{64}$/.test(pw);
async function hashPassword(pw) {
  if (!pw) return '';
  const enc = new TextEncoder().encode(pw);
  const hash = await window.crypto.subtle.digest('SHA-256', enc);
  const arr = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return arr;
}

const RECIPES = [
  // 老乡鸡系列菜谱
  { id: 301, title: '鸡汤娃娃菜', category: 'chinese', cuisine: 'hui', level: 0, time: '30 分钟', difficulty: '入门', calories: '150 千卡', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800', description: '咸鲜可口，最佳风味期0.5小时。', ingredients: [{ name: '娃娃菜', amount: 220, unit: '克' }, { name: '老鸡汤', amount: 330, unit: '克' }, { name: '盐', amount: 16, unit: '克' }, { name: '鸡油', amount: 60, unit: '克' }], steps: ['老鸡汤炖制：每只鸡用2g盐均匀揉搓鸡表皮，冷藏20分钟', '取500g老母鸡，加入16g盐、60g鸡油、2500g水，烧开后炖制60分钟', '取220g娃娃菜，在沸水余烫2分30秒', '将烫好的娃娃菜放入餐具中，加入330g老鸡汤出品'] },
  { id: 302, title: '鸡汁娃娃菜', category: 'chinese', cuisine: 'hui', level: 0, time: '30 分钟', difficulty: '入门', calories: '120 千卡', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800', description: '咸鲜可口，最佳风味期半小时。', ingredients: [{ name: '娃娃菜', amount: 150, unit: '克' }, { name: '上汤汁料', amount: 110, unit: '克' }, { name: '鸡胸肉丝', amount: 30, unit: '克' }, { name: '胡萝卜', amount: 10, unit: '克' }, { name: '木耳', amount: 5, unit: '克' }], steps: ['上汤汁料加热后保持80°C保温', '取150g娃娃菜，在沸水余烫1分30秒', '将烫好的娃娃菜放入餐具中，加入110g上汤汁料出品'] },
  { id: 303, title: '青椒炒豆芽', category: 'chinese', cuisine: 'hui', level: 0, time: '15 分钟', difficulty: '入门', calories: '80 千卡', image: 'https://images.unsplash.com/photo-1625938145744-e380515399bf?auto=format&fit=crop&q=80&w=800', description: '咸鲜微辣，清脆爽口。', ingredients: [{ name: '绿豆芽', amount: 1000, unit: '克' }, { name: '大豆油', amount: 120, unit: '克' }, { name: '青椒', amount: 100, unit: '克' }, { name: '盐', amount: 12, unit: '克' }, { name: '鸡精', amount: 12, unit: '克' }], steps: ['绿豆芽餐厅现场清洗、切配', '青椒供应商清洗、切配后配送至餐厅', '下入120g大豆油、1000g绿豆芽、100g青椒、12g盐、12g鸡精，大火爆炒出品'] },
  { id: 304, title: '小炒香干', category: 'chinese', cuisine: 'hui', level: 0, time: '15 分钟', difficulty: '入门', calories: '200 千卡', image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&q=80&w=800', description: '咸鲜微辣，香干入味。', ingredients: [{ name: '香干', amount: 1900, unit: '克' }, { name: '大豆油', amount: 100, unit: '克' }, { name: '熟猪油', amount: 100, unit: '克' }, { name: '蒜子', amount: 60, unit: '克' }, { name: '鲜红小米辣', amount: 10, unit: '克' }, { name: '青椒', amount: 400, unit: '克' }, { name: '炒菜基料', amount: 1, unit: '袋' }], steps: ['下入100g大豆油、100g熟猪油、60g拍蒜、10g鲜红小米辣，炒出香味', '下入1900g香干、炒菜基料1袋、400g青椒，大火爆炒出品'] },
  { id: 305, title: '肉饼蒸蛋', category: 'chinese', cuisine: 'hui', level: 0, time: '30 分钟', difficulty: '入门', calories: '350 千卡', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800', description: '咸鲜嫩滑，营养丰富。', ingredients: [{ name: '调理肉丝', amount: 1000, unit: '克' }, { name: '老鸡汤', amount: 180, unit: '克' }, { name: '生抽', amount: 20, unit: '克' }, { name: '鸡精', amount: 10, unit: '克' }, { name: '淀粉', amount: 20, unit: '克' }, { name: '鸡蛋', amount: 1, unit: '颗' }], steps: ['肉饼蒸蛋汁调配(9份)：180g老鸡汤、20g生抽，搅拌均匀', '肉馅调配(9份)：取1000g调理肉丝剁碎，加入10g鸡精和100g水，搅拌上劲后再加100g水，再次搅拌上劲，加入20g淀粉，搅拌均匀', '肉饼蒸蛋操作(1份)：在餐具中放130g肉馅，用汤勺将肉馅中心部按压出四陷小窝，并打入一颗鸡蛋', '蒸柜上汽后，蒸制15分钟，出品时撒1g葱花和1g红椒粒点缀'] }
];

if (typeof window !== 'undefined') window.RECIPES = RECIPES;

const SOCIAL_POSTS = [
  { id: 1, type: "normal", user: "厨神小当家", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Leo", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800", title: "终于做出了完美的披萨！", views: 1200000, likes: 85600, timestamp: "2小时前", tags: ["美味", "教程"] },
  { id: 2, type: "normal", user: "深夜食堂", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Bella", image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&q=80&w=800", title: "这道红烧肉太费饭了", views: 150000, likes: 12000, timestamp: "5小时前", tags: ["家常菜"] },
  { id: 3, type: "homemade", user: "厨房炼金术士", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Salem", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", title: "自制鲱鱼罐头炒榴莲", views: 2000000, likes: 150000, timestamp: "1天前", tags: ["难吃", "生化武器", "黑暗料理"] },
  { id: 4, type: "homemade", user: "炸厨房小组长", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800", title: "荧光蓝可乐鸡翅", views: 50000, likes: 3000, timestamp: "3小时前", tags: ["难吃", "颜色诡异"] },
  { id: 5, type: "homemade", user: "萌新小白", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sola", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800", title: "第一次做蛋糕（好像糊了）", views: 200, likes: 10, timestamp: "刚刚", tags: ["失败", "自制"] },
  { id: 11, type: "homemade", user: "暗黑料理界", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Dark", image: "https://images.unsplash.com/photo-1541795792062-3945a84517bd?auto=format&fit=crop&q=80&w=800", title: "板蓝根泡面", views: 90000, likes: 12000, timestamp: "2天前", tags: ["难吃", "养生"] },
  { id: 12, type: "homemade", user: "乱炖之王", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=King2", image: "https://images.unsplash.com/photo-1574484284008-86d47dc6b90d?auto=format&fit=crop&q=80&w=800", title: "苦瓜炒奥利奥", views: 85000, likes: 11000, timestamp: "3天前", tags: ["难吃", "甜苦"] },
  { id: 13, type: "homemade", user: "爆破鬼才", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Bomb", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?auto=format&fit=crop&q=80&w=800", title: "微波炉炸蛋", views: 80000, likes: 9000, timestamp: "4天前", tags: ["危险", "难吃"] },
  { id: 14, type: "homemade", user: "水果杀手", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Fruit", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", title: "西瓜炒肉", views: 70000, likes: 8000, timestamp: "5天前", tags: ["难吃", "水果"] },
  { id: 15, type: "homemade", user: "辣椒侠", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Spicy", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800", title: "魔鬼辣冰淇淋", views: 60000, likes: 7000, timestamp: "6天前", tags: ["难吃", "辣"] },
  { id: 16, type: "homemade", user: "混搭狂人", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mix", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800", title: "草莓麻婆豆腐", views: 55000, likes: 6500, timestamp: "1周前", tags: ["难吃", "川菜"] },
  { id: 17, type: "homemade", user: "实验员01", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Exp", image: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?auto=format&fit=crop&q=80&w=800", title: "水泥封心馒头", views: 40000, likes: 5000, timestamp: "1周前", tags: ["难吃", "硬"] },
];





// ----- Helper / Components -----
const PostCard = ({ post, isHomemade, isLaoba }) => {
  const showLaobaBadge = isHomemade && isLaoba;
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border ${showLaobaBadge ? 'border-purple-200 bg-purple-50/50' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-3">
        <img src={post.avatar} className="w-10 h-10 rounded-full bg-gray-100" alt="avatar" />
        <div>
          <div className="font-bold text-sm text-gray-900 flex items-center gap-2">{post.user}</div>
          <div className="text-xs text-gray-400">{post.timestamp}</div>
        </div>
        {showLaobaBadge && <div className="ml-auto bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Skull size={12} /> 老八套餐</div>}
      </div>
      <h3 className="text-base font-bold mb-2 text-gray-800">{post.title} {post.tags && post.tags.map(tag => <span key={tag} className="ml-2 text-[10px] font-normal bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>)}</h3>
      <div className="relative h-48 rounded-xl overflow-hidden mb-3 bg-black"><img src={post.image} className="w-full h-full object-cover opacity-90" alt="post" /><div className="absolute inset-0 flex items-center justify-center"><PlayCircle size={48} className="text-white/80 fill-black/20" /></div></div>
      <div className="flex justify-between items-center text-xs text-gray-500 px-1"><div className="flex items-center gap-1"><Video size={14} />{(post.views / 10000 >= 1) ? (post.views / 10000).toFixed(1) + '万' : post.views} 播放</div><div className="flex items-center gap-4"><div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"><Heart size={14} /> {post.likes}</div>{isHomemade && post.tags?.includes('难吃') && <div className="flex items-center gap-1 text-purple-500 font-bold" title="这很难吃"><ThumbsDown size={14} /> 难吃认证</div>}</div></div>
    </div>
  );
}

const RankingCard = ({ user, idx }) => {
  const colors = ["bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 text-yellow-900", "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white", "bg-gradient-to-r from-orange-200 via-orange-400 to-orange-500 text-white"];
  const color = colors[idx] || colors[2];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 relative overflow-hidden">
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${color}`}></div>
      <div className="font-bold text-xl w-6 text-center italic text-gray-300">#{user.rank}</div>
      <div className="w-12 h-12 rounded-full border-2 border-gray-100 p-0.5"><img src={user.avatar} className="w-full h-full rounded-full" alt="avatar" /></div>
      <div className="flex-1"><h4 className="font-bold text-gray-800">{user.name}</h4><p className="text-xs text-gray-400">积分: {user.score}</p></div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${color}`}>{user.title}</div>
    </div>
  );
}


const EvilGuideModal = ({ onClose }) => {
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleGenerateEvilRecipe = async () => {
    if (!ingredientsInput.trim()) return;
    setIsGenerating(true);
    const prompt = `你是一位“黑暗料理界”的邪修大厨。用户提供了食材：${ingredientsInput}。请构思一道黑暗料理，并返回JSON格式包含title和desc字段。`;
    const resultText = await callGeminiAPI(prompt);
    let recipeData = { title: "炼丹失败", desc: resultText };
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) recipeData = JSON.parse(jsonMatch[0]);
    } catch (e) { console.error("JSON parse error", e); }
    setGeneratedRecipe(recipeData); setIsGenerating(false);
  };
  const tips = [{ icon: <Biohazard size={20} className="text-green-500" />, title: "视觉冲击", desc: "善用非自然食材颜色。" }, { icon: <Ghost size={20} className="text-purple-500" />, title: "味觉黑洞", desc: "打破甜咸次元壁！" }];
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 backdrop-blur-sm animate-fade-in"><div className="bg-gray-900 border-2 border-purple-500 rounded-2xl w-full max-w-sm p-6 relative overflow-hidden flex flex-col max-h-[85vh]"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><X size={24} /></button><div className="text-center mb-6 relative z-10 flex-shrink-0"><div className="w-16 h-16 bg-purple-900/50 text-purple-400 border border-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(168,85,247,0.5)]"><Scroll size={32} /></div><h2 className="text-2xl font-bold text-white tracking-widest">邪修炼丹炉</h2></div><div className="flex-1 overflow-y-auto relative z-10 space-y-4">{!generatedRecipe ? (<><div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-400 block mb-2">输入奇怪食材:</label><textarea value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-600 focus:outline-none text-sm h-24 resize-none" placeholder="在此输入..." /></div><button onClick={handleGenerateEvilRecipe} disabled={isGenerating || !ingredientsInput.trim()} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">{isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}{isGenerating ? "炼制中..." : "开始炼丹"}</button></>) : (<div className="bg-gray-800/80 p-5 rounded-xl border border-purple-500/50 text-center"><h3 className="text-xl font-bold text-purple-300 mb-3">{generatedRecipe.title}</h3><p className="text-gray-300 text-sm leading-relaxed mb-6 text-left">{typeof generatedRecipe.desc === 'string' ? generatedRecipe.desc : JSON.stringify(generatedRecipe.desc)}</p><button onClick={() => { setGeneratedRecipe(null); setIngredientsInput(''); }} className="text-xs text-gray-500 hover:text-white underline">再练一炉</button></div>)}<div className="pt-4 border-t border-gray-800"><h4 className="text-gray-500 text-xs font-bold mb-2">修习心法：</h4><div className="space-y-2">{tips.map((t, i) => <p key={i} className="text-[10px] text-gray-400">• {t.title}: {t.desc}</p>)}</div></div></div></div></div>
  );
};

// --- Tab components (HomeTab, SocialTab) ---
const HomeTab = ({ unlockedRecipes, onRecipeClick, userProfile }) => (
  <div className="animate-fade-in">
    <header className="relative bg-orange-50 overflow-hidden mb-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            探索味蕾的 <span className="text-orange-500">无限可能</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            汇集全球精选美食食谱，从家常菜到米其林，让每一次下厨都成为享受。
          </p>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-md mx-auto aspect-square">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="object-cover w-full h-full hover:scale-110 transition duration-500" />
          </div>
        </div>
      </div>
    </header>

    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
      {/* User Profile Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-full bg-white/20 p-1">
            <img src={userProfile.avatar} className="rounded-full w-full h-full object-cover" alt="avatar" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">厨艺新星</span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-sm opacity-80">POINTS</div>
          <div className="text-3xl font-bold">{userProfile.points}</div>
        </div>
      </div>

      {/* Recipe Grid Section */}
      <div className="mb-6">
        <h3 className="font-bold text-2xl text-gray-800 mb-6">已获得食谱 ({unlockedRecipes.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-24">
          {unlockedRecipes.map(recipe => (
            <div key={recipe.id} onClick={() => onRecipeClick(recipe)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100">
              <div className="h-32 bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-between px-4">
                <div>
                  <div className="text-xs text-orange-500 font-bold mb-1">{recipe.time}</div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">{recipe.title}</h3>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-white text-orange-500 font-bold border border-orange-100">{recipe.difficulty}</div>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{recipe.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center">🔥 {recipe.category === 'chinese' ? '中餐' : '西餐'}</span>
                  <span className="flex items-center">⭐ 4.9</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Challenge/leveling模式已移除

const SocialTab = () => {
  const [tab, setTab] = useState('feed');
  const [showEvilGuide, setShowEvilGuide] = useState(false);
  const homemadePosts = useMemo(() => SOCIAL_POSTS.filter(post => post.type === 'homemade' && post.tags?.includes('难吃')).sort((a, b) => b.likes - a.likes), []);
  const laobaSpecial = homemadePosts.length > 0 ? homemadePosts[0] : null;
  const top10List = homemadePosts.slice(1, 10);
  const otherHomemade = SOCIAL_POSTS.filter(p => p.type === 'homemade' && !homemadePosts.slice(0, 10).find(top => top.id === p.id));

  return (
    <div className="bg-gray-50 h-full flex flex-col pb-20">
      <div className="max-w-6xl mx-auto w-full px-6 pt-6">
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-1 flex gap-2">
          <button onClick={() => setTab('feed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'feed' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            美食圈动态
          </button>
          <button onClick={() => setTab('homemade')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${tab === 'homemade' ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab === 'homemade' && <Skull size={16} className="animate-pulse"/>} 自制美食栏
          </button>
        </div>

        <div className="pb-24">
          {tab === 'feed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SOCIAL_POSTS.filter(p => p.type === 'normal').map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}
          {tab === 'homemade' && (
            <div className="space-y-6">
              <div onClick={() => setShowEvilGuide(true)} className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 flex items-center justify-between shadow-xl cursor-pointer border border-purple-500/30 group hover:scale-[1.01] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 group-hover:animate-spin">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      邪修炼丹炉 <span className="bg-purple-600 text-[10px] px-2 py-0.5 rounded text-white">AI Powered</span>
                    </h3>
                    <p className="text-purple-400 text-sm">输入奇怪食材 · AI 生成黑暗配方</p>
                  </div>
                </div>
                <ChevronLeft className="text-white rotate-180" size={24} />
              </div>

              {laobaSpecial && (
                <div className="relative bg-gray-900 rounded-2xl p-8 overflow-hidden shadow-2xl shadow-purple-900/30 text-white border-2 border-purple-500/50">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Skull size={200} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Crown size={12} fill="currentColor" /> No.1 老八套餐
                      </span>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-400 shrink-0">
                        <img src={laobaSpecial.image} className="w-full h-full object-cover" alt={laobaSpecial.title} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2">{laobaSpecial.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                          <img src={laobaSpecial.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
                          {laobaSpecial.user}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-blue-500" /> 其他自制投稿
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherHomemade.map(post => <PostCard key={post.id} post={post} isHomemade={true} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showEvilGuide && <EvilGuideModal onClose={() => setShowEvilGuide(false)} />}
    </div>
  );
};

// 简易收藏页，复用已解锁食谱以避免空白
const FavoritesTab = ({ recipes, onRecipeClick }) => (
  <div className="px-5 pt-6 max-w-5xl mx-auto w-full">
    <h3 className="font-bold text-xl text-gray-800 mb-4">我的收藏</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
      {recipes.map(r => (
        <div key={r.id} onClick={() => onRecipeClick(r)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group border border-gray-100 flex flex-col">
          <div className="h-28 bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-between px-4">
            <div>
              <div className="text-xs text-orange-500 font-bold mb-1">{r.time}</div>
              <h4 className="font-bold text-gray-800 text-base group-hover:text-orange-500 transition-colors line-clamp-1">{r.title}</h4>
            </div>
            <div className="text-[10px] px-2 py-1 rounded-md font-bold bg-white text-orange-500 border border-orange-100">Lv.{r.level}</div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{r.description}</p>
            <div className="mt-auto text-[11px] text-gray-400">{r.category === 'chinese' ? '中餐' : '西餐'}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


// --- RecipeDetail component (added/used by App) ---
const RecipeDetail = ({ recipe, onBack }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center md:py-10">
      <div className="bg-white w-full max-w-3xl md:rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 md:px-12 pt-8 pb-4">
          <button onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-800">
            <ChevronLeft size={24} /> 返回
          </button>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            <span className="text-orange-500 font-bold bg-orange-50 px-4 py-1.5 rounded-full text-sm w-fit">{recipe.calories}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Clock className="mx-auto mb-1 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.time}</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Flame className="mx-auto mb-1 text-red-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.difficulty}</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <ChefHat className="mx-auto mb-1 text-blue-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.level === 0 ? '基础' : `Lv.${recipe.level}`}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>食材清单
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="flex justify-between text-base border-b border-gray-200/50 pb-2 last:border-0">
                    <span className="text-gray-600">{ing.name}</span>
                    <span className="font-bold text-gray-800">{ing.amount}{ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>烹饪步骤
            </h3>
            <ol className="space-y-4">
              {recipe.steps?.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-base leading-relaxed text-gray-800 pt-1">{s}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <button onClick={() => setShowVideo(true)} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-md">
              查看示范视频
            </button>
            <button onClick={onBack} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors border border-gray-200">
              返回
            </button>
          </div>
        </div>
        {showVideo && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-black rounded-xl overflow-hidden w-full max-w-3xl">
              <div className="flex items-center justify-between p-3 border-b border-black/30">
                <div className="text-white font-bold">示范视频</div>
                <button onClick={() => setShowVideo(false)} className="text-gray-300 p-1 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 bg-black">
                <div className="w-full aspect-video bg-gray-900">
                  <video src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4" controls className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
const LoginCard = ({ defaultUsername = 'liu474751-tech', defaultPassword = '200283', onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState('');
  const passwordRef = useRef();
  const [isBusy, setIsBusy] = useState(false);

  const doLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('用户名或密码不能为空');
      return;
    }
    setIsBusy(true);
    const ok = await onLogin(username.trim(), password);
    if (!ok) {
      setError('登录失败，用户名或密码错误');
      setPassword('');
      // focus password for retry
      setTimeout(() => passwordRef.current?.focus(), 50);
    }
    setIsBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2"><img src="/favicon.svg" alt="logo" /></div>
          <h2 className="font-bold text-orange-500">美味厨房</h2>
          <div className="text-xl font-extrabold mt-2">登录</div>
        </div>
        <div className="space-y-3 mb-3">
          <div>
            <label className="text-xs text-gray-500">用户名</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500">密码</label>
            <input ref={passwordRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2 items-center">
            <button onClick={doLogin} disabled={isBusy} className="flex-1 py-3 bg-orange-500 text-white rounded">{isBusy ? '登录中...' : '登录'}</button>
            <button onClick={onRegisterClick} className="py-2 px-3 border rounded text-gray-600">注册</button>
          </div>
          <div className="text-xs text-gray-400 mt-1">默认用户名: <span className="font-medium">liu474751-tech</span> 密码：<span className="font-medium">200283</span></div>
        </div>
      </div>
    </div>
  );
};

const RegisterModal = ({ onClose, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s += 1;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const doRegister = () => {
    setError('');
    if (!username.trim() || !password.trim()) { setError('用户名/密码不能为空'); return; }
    if (password.length < 6) { setError('密码至少6位，请设置更长的密码'); return; }
    const ok = onRegister(username.trim(), password);
    if (!ok) { setError('用户名已存在，请更换'); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-3 text-lg font-bold">注册</div>
          <div className="space-y-3">
          <div><label className="text-xs text-gray-500">用户名</label><input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" /></div>
          <div>
            <label className="text-xs text-gray-500">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
            <div className="mt-1 text-xs text-gray-400">密码强度: <span className="font-medium">{strength <= 1 ? '弱' : strength === 2 ? '中' : '强'}</span></div>
            <div className="w-full h-1 bg-gray-200 rounded mt-1 overflow-hidden"><div style={{ width: `${strength * 25}%` }} className={`h-full ${strength >= 3 ? 'bg-green-500' : strength === 2 ? 'bg-yellow-400' : 'bg-red-400'}`} /></div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2"><button onClick={doRegister} className="flex-1 py-2 bg-indigo-600 text-white rounded">注册</button><button onClick={onClose} className="py-2 px-3 border rounded">取消</button></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // user store (username -> password) persisted to localStorage (demo)
  const [users, setUsers] = useState(() => {
    const fromStorage = loadUsersFromStorage();
    return fromStorage || { 'liu474751-tech': '200283' };
  });

  // Global back handler
  const handleGlobalBack = () => {
    if (selectedRecipe) {
      // 如果在菜谱详情页，返回到主页面
      setSelectedRecipe(null);
    } else if (activeTab !== 'home') {
      // 如果不在首页，返回首页
      setActiveTab('home');
    } else {
      // 如果已经在首页，退出登录
      onLogout();
    }
  };

  // Add keyboard shortcut for back (ESC or Backspace)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' || (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
        handleGlobalBack();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedRecipe, activeTab]);

  // when app mounts, ensure all passwords are hashed
  useEffect(() => {
    const normalize = async () => {
      // Load directly from storage to avoid stale closure during mount
      const stored = loadUsersFromStorage() || users;
      let changed = false;
      const next = { ...stored };
      for (const [u, p] of Object.entries(next)) {
        if (!isHashed(p)) {
          next[u] = await hashPassword(p);
          changed = true;
        }
      }
      if (changed) {
        setUsers(next);
        saveUsersToStorage(next);
      }
    };
    normalize();
  }, []);

  const [userProfile, setUserProfile] = useState({
    name: "liu474751-tech", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix", points: 1250, titles: ["难吃终结者"], monthlyUnlocks: 0,
    completedLevels: { lu: 0, chuan: 0, yue: 0, su: 0, min: 0, zhe: 0, xiang: 0, hui: 0, french: 0, italian: 0, spanish: 0, central: 0, nordic: 0 },
    unlockedExtra: []
  });

  const [unlockedRecipes, setUnlockedRecipes] = useState(() => RECIPES.filter(r => r.level === 0));

  const decoratedUnlocked = unlockedRecipes;

  const handleRecipeClick = (recipe) => setSelectedRecipe(recipe);

  const renderContent = () => {
    if (activeTab === 'home') return <HomeTab unlockedRecipes={decoratedUnlocked} onRecipeClick={handleRecipeClick} userProfile={userProfile} />;
    if (activeTab === 'social') return <SocialTab />;
    if (activeTab === 'favorites') return <FavoritesTab recipes={decoratedUnlocked} onRecipeClick={handleRecipeClick} />;
    return null;
  };
  if (selectedRecipe) return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;

  // login handler
  const onLogin = async (username, password) => {
    const hashed = await hashPassword(password);
    // Accept both hashed or raw stored (in case normalization hasn't finished yet)
    if (users[username] && (users[username] === hashed || users[username] === password)) {
      setIsLoggedIn(true);
      setUserProfile(prev => ({ ...prev, name: username }));
      saveSession(username);
      return true;
    }
    return false;
  };

  const onLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setUserProfile(prev => ({ ...prev, name: 'liu474751-tech' }));
  };

  const onRegister = async (username, password) => {
    if (users[username]) return false; // already exists
    const hashed = await hashPassword(password);
    setUsers(prev => {
      const next = { ...prev, [username]: hashed };
      saveUsersToStorage(next);
      return next;
    });
    // Auto-login and persist session
    setIsLoggedIn(true);
    setUserProfile(prev => ({ ...prev, name: username }));
    saveSession(username);
    return true;
  };

  // persist users changes
  useEffect(() => { saveUsersToStorage(users); }, [users]);

  // attempt auto-login on app mount if session exists
  useEffect(() => {
    const session = loadSession();
    if (session && session.username && users[session.username]) {
      setIsLoggedIn(true);
      setUserProfile(prev => ({ ...prev, name: session.username }));
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginCard defaultUsername="liu474751-tech" defaultPassword="200283" onLogin={onLogin} onRegisterClick={() => setShowRegister(true)} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 p-6">
        <div className="flex items-center gap-2 text-2xl font-extrabold text-orange-600 mb-10 px-2">
          <ChefHat size={32} /> 美味厨房
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'home' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Home size={20} /> 首页大厅
          </button>
          <button onClick={() => setActiveTab('social')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'social' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={20} /> 美食圈
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'favorites' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Bookmark size={20} /> 我的收藏
          </button>
        </nav>
        <div className="border-t pt-4 mt-4">
          <div className="px-4 py-2 text-sm text-gray-600 mb-2">
            <div className="font-bold">{userProfile.name}</div>
            <div className="text-xs text-gray-400">积分: {userProfile.points}</div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 font-medium transition-colors rounded-lg hover:bg-red-50">
            <span>🚪</span> 退出登录
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white px-5 pt-4 pb-2 flex justify-between items-center shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={handleGlobalBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            {selectedRecipe ? '菜谱详情' : activeTab === 'social' ? '美食圈' : activeTab === 'favorites' ? '我的收藏' : '美味厨房'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600">{userProfile.name}</div>
          <button onClick={onLogout} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">退出</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-30 shrink-0">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Home size={24} /><span className="text-[10px]">首页</span>
        </button>
        <button onClick={() => setActiveTab('social')} className={`flex flex-col items-center gap-1 ${activeTab === 'social' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Users size={24} /><span className="text-[10px]">美食圈</span>
        </button>
        <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-1 ${activeTab === 'favorites' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Bookmark size={24} /><span className="text-[10px]">收藏</span>
        </button>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={onRegister} />}
      
      {/* Global Floating Back Button (Desktop - always visible) */}
      <button 
        onClick={handleGlobalBack}
        className="hidden md:flex fixed bottom-8 left-8 w-14 h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 z-50 group"
        title={selectedRecipe ? '返回列表' : activeTab !== 'home' ? '返回首页' : '退出登录'}
      >
        <ChevronLeft size={24} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
      </button>
      
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}