import React, { useState, useMemo, useEffect, useRef } from 'react';
// Lightweight emoji-based inline icon fallbacks (avoid ESM build issues)
const Icon = ({ emoji, size = 16, className = '', style = {} }) => (
  <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block', ...style }}>{emoji}</span>
);
const Search = (p) => <Icon emoji="🔍" {...p} />;
const ChefHat = (p) => <Icon emoji="👨‍🍳" {...p} />;
const Clock = (p) => <Icon emoji="⏱️" {...p} />;
const Flame = (p) => <Icon emoji="🔥" {...p} />;
const Heart = (p) => <Icon emoji="❤️" {...p} />;
const ChevronLeft = (p) => <Icon emoji="◀" {...p} />;
const Users = (p) => <Icon emoji="👥" {...p} />;
const CheckCircle = (p) => <Icon emoji="✔️" {...p} />;
const Home = (p) => <Icon emoji="🏠" {...p} />;
const Bookmark = (p) => <Icon emoji="🔖" {...p} />;
const ArrowRight = (p) => <Icon emoji="➡️" {...p} />;
const Trophy = (p) => <Icon emoji="🏆" {...p} />;
const Gamepad2 = (p) => <Icon emoji="🎮" {...p} />;
const Video = (p) => <Icon emoji="🎥" {...p} />;
const Upload = (p) => <Icon emoji="📤" {...p} />;
const Lock = (p) => <Icon emoji="🔒" {...p} />;
const Unlock = (p) => <Icon emoji="🔓" {...p} />;
const Zap = (p) => <Icon emoji="⚡" {...p} />;
const Loader2 = (p) => <Icon emoji="⏳" {...p} />;
const PlayCircle = (p) => <Icon emoji="▶️" {...p} />;
const Crown = (p) => <Icon emoji="👑" {...p} />;
const Map = (p) => <Icon emoji="🗺️" {...p} />;
const Coins = (p) => <Icon emoji="🪙" {...p} />;
const LayoutGrid = (p) => <Icon emoji="🔳" {...p} />;
const X = (p) => <Icon emoji="✖" {...p} />;
const RefreshCw = (p) => <Icon emoji="🔄" {...p} />;
const Skull = (p) => <Icon emoji="💀" {...p} />;
const AlertTriangle = (p) => <Icon emoji="⚠️" {...p} />;
const ThumbsDown = (p) => <Icon emoji="👎" {...p} />;
const Scroll = (p) => <Icon emoji="📜" {...p} />;
const Sparkles = (p) => <Icon emoji="✨" {...p} />;
const Ghost = (p) => <Icon emoji="👻" {...p} />;
const Biohazard = (p) => <Icon emoji="☣️" {...p} />;
const Robot = (p) => <Icon emoji="🤖" {...p} />;
const Film = (p) => <Icon emoji="🎞️" {...p} />;
const MessageSquare = (p) => <Icon emoji="💬" {...p} />;
const Send = (p) => <Icon emoji="📩" {...p} />;
const ShieldCheck = (p) => <Icon emoji="🛡️" {...p} />;
const Eye = (p) => <Icon emoji="👁️" {...p} />;
const EyeOff = (p) => <Icon emoji="🙈" {...p} />;
const User = (p) => <Icon emoji="👤" {...p} />;

// API key disabled by default (preview environment)
const apiKey = ""; // import.meta.env.VITE_GEMINI_API_KEY || "";

// --- localStorage keys for demo persistence
const USERS_KEY = 'tk_users';
const SESSION_KEY = 'tk_session';

const loadUsersFromStorage = () => {
  try { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
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
const saveUsersToStorage = (obj) => { try { localStorage.setItem(USERS_KEY, JSON.stringify(obj)); } catch (e) {} };
const loadSession = () => loadSessionSafe();
const saveSession = (username) => { try { saveSessionWithExpiry(username, 7); } catch (e) {} };
const clearSession = () => { try { localStorage.removeItem(SESSION_KEY); } catch(e) {} };
const saveSessionWithExpiry = (username, days = 7) => { try { const expires = Date.now() + days * 24 * 3600 * 1000; localStorage.setItem(SESSION_KEY, JSON.stringify({ username, expires })); } catch(e) {} };
const loadSessionSafe = () => { try { const raw = localStorage.getItem(SESSION_KEY); if (!raw) return null; const parsed = JSON.parse(raw); if (parsed.expires && Date.now() > parsed.expires) { localStorage.removeItem(SESSION_KEY); return null; } return parsed; } catch(e) { return null; } };

const callGeminiAPI = async (prompt, systemInstruction = "") => {
  if (!apiKey) return "请先配置 API Key 才能召唤 AI 大神！(请查看代码中的注释开启配置)";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );

    if (!response.ok) throw new Error(`API call failed: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === 'string' ? text : "AI 似乎正在闭关修炼，暂时无法回应...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接灵网失败，请稍后重试。";
  }
};

// --- Static data (copied from user content) ---
const CUISINE_CONFIG = {
  chinese: [
    { id: 'lu', name: '齐鲁鼎食', desc: '北方菜系之首', range: [1, 125], color: 'from-blue-500 to-cyan-600', icon: '🥘' },
    { id: 'chuan', name: '川蜀薪火', desc: '麻辣鲜香', range: [126, 250], color: 'from-red-500 to-orange-600', icon: '🌶️' },
    { id: 'yue', name: '粤港珍馐', desc: '清淡鲜嫩', range: [251, 375], color: 'from-emerald-400 to-green-600', icon: '🥟' },
    { id: 'su', name: '淮扬雅馔', desc: '风格雅丽', range: [376, 500], color: 'from-teal-400 to-teal-600', icon: '🍲' },
    { id: 'min', name: '闽海佳筵', desc: '山珍海味', range: [501, 625], color: 'from-indigo-400 to-blue-600', icon: '🦞' },
    { id: 'zhe', name: '浙杭玉食', desc: '清鲜爽脆', range: [626, 750], color: 'from-cyan-400 to-blue-500', icon: '🍤' },
    { id: 'xiang', name: '潇湘珍味', desc: '酸辣浓郁', range: [751, 875], color: 'from-red-600 to-red-800', icon: '🥓' },
    { id: 'hui', name: '徽州琼筵', desc: '重油重色', range: [876, 1000], color: 'from-stone-500 to-stone-700', icon: '🍯' },
  ],
  western: [
    { id: 'french', name: '法式优雅', desc: '宫廷技艺', range: [1, 60], color: 'from-blue-600 to-red-500', icon: '🍷' },
    { id: 'italian', name: '意国风情', desc: '地中海味', range: [61, 120], color: 'from-green-500 to-red-500', icon: '🍝' },
    { id: 'spanish', name: '伊比利亚', desc: '热情海鲜', range: [121, 180], color: 'from-yellow-500 to-red-600', icon: '🥘' },
    { id: 'central', name: '中欧/英伦', desc: '肉食狂欢', range: [181, 240], color: 'from-gray-600 to-blue-700', icon: '🥩' },
    { id: 'nordic', name: '北欧/东欧', desc: '腌渍艺术', range: [241, 300], color: 'from-blue-300 to-blue-500', icon: '🐟' },
  ]
};

const RECIPES = [
  {
    id: 1, title: '番茄炒蛋', category: 'chinese', cuisine: 'lu', level: 0,
    time: '10 分钟', difficulty: '入门', calories: '180 千卡',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
    description: '国民家常菜，酸甜可口，下饭神器。',
    ingredients: [{ name: '鸡蛋', amount: 3, unit: '个' }, { name: '番茄', amount: 2, unit: '个' }, { name: '葱', amount: 1, unit: '根' }, { name: '盐', amount: 1, unit: '勺' }],
    steps: ['准备工作：西红柿洗净切块，鸡蛋打散。', '炒鸡蛋：热锅凉油，炒熟鸡蛋盛出。', '炒番茄：爆香葱花，炒西红柿出汁。', '混合：倒入鸡蛋，加糖盐翻炒均匀。', '出锅：撒葱花装盘。']
  },
  {
    id: 2, title: '酸辣土豆丝', category: 'chinese', cuisine: 'chuan', level: 0,
    time: '15 分钟', difficulty: '入门', calories: '120 千卡',
    image: 'https://images.unsplash.com/photo-1652545288254-23128040494b?auto=format&fit=crop&q=80&w=800',
    description: '清脆爽口，酸辣开胃，刀工入门必练。',
    ingredients: [{ name: '土豆', amount: 2, unit: '个' }, { name: '干辣椒', amount: 8, unit: '个' }, { name: '白醋', amount: 2, unit: '勺' }],
    steps: ['切配：土豆切丝泡水洗去淀粉。', '爆香：炸香花椒捞出，爆香辣椒蒜末。', '快炒：大火炒土豆丝，淋白醋。', '调味：加盐鸡精翻炒出锅。']
  },
  {
    id: 3, title: '拍黄瓜', category: 'chinese', cuisine: 'xiang', level: 0,
    time: '5 分钟', difficulty: '入门', calories: '40 千卡',
    image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&q=80&w=800',
    description: '经典凉菜，蒜香浓郁，夏天必备。',
    ingredients: [{ name: '黄瓜', amount: 2, unit: '根' }, { name: '大蒜', amount: 5, unit: '瓣' }, { name: '辣椒油', amount: 1, unit: '勺' }],
    steps: ['暴力拍打：黄瓜拍碎切块。', '调汁：蒜末、生抽、醋、糖、辣椒油。', '拌匀：料汁淋在黄瓜上拌匀。']
  },
  {
    id: 4, title: '田园蔬菜沙拉', category: 'western', cuisine: 'french', level: 0,
    time: '8 分钟', difficulty: '入门', calories: '110 千卡',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    description: '轻食首选，营养丰富。',
    ingredients: [{ name: '生菜', amount: 100, unit: '克' }, { name: '小番茄', amount: 6, unit: '个' }],
    steps: ['蔬菜洗净撕小块。', '调制油醋汁：橄榄油、黑醋、蜂蜜。', '拌匀食用。']
  },
  {
    id: 5, title: '经典土豆泥', category: 'western', cuisine: 'central', level: 0,
    time: '20 分钟', difficulty: '入门', calories: '220 千卡',
    image: 'https://images.unsplash.com/photo-1618449845529-25553156166b?auto=format&fit=crop&q=80&w=800',
    description: '绵软细腻，奶香浓郁。',
    ingredients: [{ name: '土豆', amount: 2, unit: '个' }, { name: '牛奶', amount: 100, unit: 'ml' }, { name: '黄油', amount: 20, unit: '克' }],
    steps: ['蒸熟土豆压成泥。', '小火加热牛奶黄油。', '分次加入土豆泥搅拌顺滑，加盐调味。']
  },
  {
    id: 6, title: '黄油煎吐司', category: 'western', cuisine: 'italian', level: 0,
    time: '5 分钟', difficulty: '入门', calories: '250 千卡',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=800',
    description: '外酥里嫩，快手早餐。',
    ingredients: [{ name: '吐司', amount: 2, unit: '片' }, { name: '黄油', amount: 15, unit: '克' }],
    steps: ['锅中融化黄油。', '小火慢煎吐司两面至金黄。', '淋上蜂蜜食用。']
  },
  {
    id: 105, title: '九转大肠', category: 'chinese', cuisine: 'lu', level: 5,
    time: '60 分钟', difficulty: '困难', calories: '500 千卡',
    image: 'https://images.unsplash.com/photo-1626202378942-e1c944eb9726?auto=format&fit=crop&q=80&w=800',
    description: '鲁菜代表作，酸甜苦辣咸五味俱全。', ingredients: [{ name: '大肠', amount: 500, unit: '克' }], steps: ['煮大肠', '炸至金黄', '红烧收汁']
  },
  {
    id: 201, title: '麻婆豆腐', category: 'chinese', cuisine: 'chuan', level: 1,
    time: '20 分钟', difficulty: '中等', calories: '300 千卡',
    image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&q=80&w=800',
    description: '川菜之魂，麻辣鲜香。', ingredients: [{ name: '豆腐', amount: 1, unit: '盒' }], steps: ['炒红油', '烧豆腐']
  },
  {
    id: 210, title: '水煮牛肉', category: 'chinese', cuisine: 'chuan', level: 10,
    time: '40 分钟', difficulty: '中等', calories: '450 千卡',
    image: 'https://images.unsplash.com/photo-1546272989-40c92939c6c2?auto=format&fit=crop&q=80&w=800',
    description: '麻辣味厚，滑嫩适口。', ingredients: [{ name: '牛肉', amount: 300, unit: '克' }], steps: ['腌肉', '炒底料', '淋热油']
  },
  {
    id: 301, title: '白切鸡', category: 'chinese', cuisine: 'yue', level: 1,
    time: '50 分钟', difficulty: '中等', calories: '250 千卡',
    image: 'https://images.unsplash.com/photo-1605494236893-68f7b703e1c6?auto=format&fit=crop&q=80&w=800',
    description: '皮黄肉白，肥嫩鲜美。', ingredients: [{ name: '三黄鸡', amount: 1, unit: '只' }], steps: ['三提三放', '冰水浸泡']
  },
  {
    id: 9001, title: '法式洋葱汤', category: 'western', cuisine: 'french', level: 1,
    time: '50 分钟', difficulty: '中等', calories: '300 千卡',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800',
    description: '法餐经典前菜。', ingredients: [{ name: '洋葱', amount: 3, unit: '个' }], steps: ['炒洋葱', '焗烤']
  },
  {
    id: 999, title: '开水白菜', category: 'hidden', cuisine: 'chuan', level: 999,
    time: '180 分钟', difficulty: '极难', calories: '100 千卡',
    image: 'https://images.unsplash.com/photo-1626805828156-3243f7e69c5e?auto=format&fit=crop&q=80&w=800',
    description: '传说级菜谱。', ingredients: [{ name: '娃娃菜', amount: 1, unit: '颗' }], steps: ['吊高汤', '淋汤']
  }
];

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

const RANKING = [
  { rank: 1, name: "味蕾魔术师", title: "厨圣", score: 9999, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=King" },
  { rank: 2, name: "炒勺狂魔", title: "厨神", score: 8888, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Queen" },
  { rank: 3, name: "刀工第一人", title: "厨王", score: 7777, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jack" },
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

const AIVideoPlayer = ({ recipeName }) => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const startGeneration = () => {
    setStatus('generating'); let p = 0;
    const interval = setInterval(() => { p += Math.random() * 10; if (p >= 100) { p = 100; clearInterval(interval); setStatus('playing'); } setProgress(p); }, 200);
  };
  return (
    <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video shadow-lg mb-6 group">
      {status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
          <Robot size={48} className="text-blue-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold mb-2">AI 智能演示</h3>
          <p className="text-gray-400 text-sm mb-6">点击生成 "{recipeName}" 的烹饪全流程视频</p>
          <button onClick={startGeneration} className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"><Sparkles size={18} /> 生成视频</button>
        </div>
      )}
        {status === 'generating' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200" style={{ width: `${progress}%` }}></div></div>
          <div className="flex items-center gap-2 text-sm text-blue-300 animate-pulse"><Robot size={16} /><span>正在分析食材... 渲染烹饪步骤... {Math.floor(progress)}%</span></div>
        </div>
      )}
      {status === 'playing' && (
        <div className="absolute inset-0 bg-black">
          <video src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4" className="w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1"><Robot size={10} /> AI Generated</div>
              <div className="text-white text-sm font-bold drop-shadow-md">正在播放: {recipeName} 教学</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AIChatModal = ({ recipe, onClose }) => {
  const [messages, setMessages] = useState([{ role: 'model', text: `你好！我是你的 AI 膳食顾问。关于“${recipe.title}”这道菜，你有什么想问的吗？` }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input; setInput(''); setMessages(prev => [...prev, { role: 'user', text: userMsg }]); setIsLoading(true);
    const prompt = `用户正在制作：${recipe.title}。用户问题：${userMsg}。请简短、专业地回答。`;
    const responseText = await callGeminiAPI(prompt, "你是一位专业的烹饪顾问。");
    setMessages(prev => [...prev, { role: 'model', text: responseText }]); setIsLoading(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end animate-fade-in">
      <div className="bg-white rounded-t-2xl h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold"><Sparkles size={20} /> AI 膳食顾问</div>
          <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'}`}>{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-2 text-gray-400 text-sm"><Loader2 size={14} className="animate-spin" /> 思考中...</div></div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t bg-white pb-safe">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="问点什么..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const UnlockModal = ({ isOpen, onClose, onConfirm, cost, monthlyLeft, title, userPoints }) => {
  if (!isOpen) return null;
  const canAfford = userPoints >= cost;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5 backdrop-blur-sm animate-fade-in"><div className="bg-white rounded-2xl w-full max-w-sm p-6 relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X size={20} /></button><div className="text-center mb-4"><div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3"><Lock size={24} /></div><h2 className="text-xl font-bold text-gray-800">解锁菜谱</h2><p className="text-indigo-600 font-medium mt-1">{title}</p></div><div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3"><div className="flex justify-between items-center text-sm"><span className="text-gray-500">所需积分</span><span className="font-bold text-gray-800 flex items-center gap-1"><Coins size={14} className="text-yellow-500" /> -{cost}</span></div></div>{!canAfford ? (<button disabled className="w-full py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed">积分不足</button>) : (<button onClick={onConfirm} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2"><Unlock size={18} /> 确认兑换</button>)}</div></div>
  );
};

// --- Tab components (HomeTab, ChallengeTab, SocialTab) ---
const HomeTab = ({ unlockedRecipes, onRecipeClick, userProfile }) => (
  <div className="px-5 pt-2 animate-fade-in">
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
        🍳 Tasty Kitchen
      </div>
      <div className="space-x-6 text-gray-600 font-medium">
        <a href="#" className="hover:text-orange-500 transition">首页</a>
        <a href="#" className="hover:text-orange-500 transition">热门食谱</a>
        <a href="#" className="hover:text-orange-500 transition">关于我们要</a>
      </div>
    </nav>

    <header className="relative bg-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center">
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            探索味蕾的 <span className="text-orange-500">无限可能</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            汇集全球精选美食食谱，从家常菜到米其林，让每一次下厨都成为享受。
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105">
            开始探索食谱
          </button>
        </div>
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 relative">
          <div className="relative rounded-full overflow-hidden border-4 border-white shadow-2xl w-64 h-64 lg:w-96 lg:h-96 mx-auto">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="object-cover w-full h-full hover:scale-110 transition duration-500" />
          </div>
          <div className="absolute -top-4 -right-4 bg-yellow-400 w-20 h-20 rounded-full opacity-50 blur-xl animate-pulse"></div>
        </div>
      </div>
    </header>

    {/* Top personal banner: 更宽的横向条带，替代原来的红色圆角卡片 */}
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 p-1">
          <img src={userProfile.avatar} className="rounded-full w-full h-full object-cover" alt="avatar" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{userProfile.name}</h2>
          <span className="bg-white/20 px-2 py-1 rounded text-sm">厨艺新星</span>
        </div>
      </div>

      <div className="mt-4 md:mt-0 text-center md:text-right">
        <div className="text-sm opacity-80">POINTS</div>
        <div className="text-3xl font-bold">{userProfile.points}</div>
      </div>
    </div>

    <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg text-gray-800">已获得食谱 ({unlockedRecipes.length})</h3></div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6 px-8 py-12 bg-gray-50">
      {unlockedRecipes.map(recipe => (
        <div key={recipe.id} onClick={() => onRecipeClick(recipe)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div className="h-48 overflow-hidden relative">
            <img src={recipe.image}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 alt={recipe.title} />
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
              {recipe.time}
            </span>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center">🔥 {recipe.difficulty}</span>
              <span className="flex items-center">⭐ 4.9</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChallengeTab = ({ userProfile, onStartLevel, onUnlockLevel }) => {
  const [mode, setMode] = useState('chinese');
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const config = CUISINE_CONFIG[mode];
  const currentChapter = selectedChapterId ? config.find(c => c.id === selectedChapterId) : null;
  const currentChapterProgress = currentChapter ? (userProfile.completedLevels[currentChapter.id] || 0) : 0;

  if (!selectedChapterId) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="px-5 pt-4 bg-white pb-4 shadow-sm z-10"><div className="flex bg-gray-100 p-1 rounded-xl mb-4"><button onClick={() => setMode('chinese')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'chinese' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500'}`}><LayoutGrid size={16} /> 神州八膳雅集</button><button onClick={() => setMode('western')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'western' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'}`}><Map size={16} /> 欧罗巴盛宴</button></div></div>
        <div className="p-5 grid grid-cols-2 gap-4 pb-24 overflow-y-auto">{config.map(chapter => { const progress = userProfile.completedLevels[chapter.id] || 0; const total = chapter.range[1] - chapter.range[0] + 1; return (<div key={chapter.id} onClick={() => setSelectedChapterId(chapter.id)} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform relative overflow-hidden group cursor-pointer`}><div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${chapter.color}`}></div><div className="text-2xl mb-2">{chapter.icon}</div><h3 className="font-bold text-gray-800 mb-1">{chapter.name}</h3><div className="flex items-center gap-1 text-xs text-orange-500 font-bold bg-orange-50 w-fit px-2 py-1 rounded-full"><Trophy size={12} /><span>Lv.{progress} / {total}</span></div></div>); })}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-slate-50">
       <div className={`px-5 pt-12 pb-6 shadow-sm z-10 sticky top-0 bg-gradient-to-r ${currentChapter.color} text-white`}><button onClick={() => setSelectedChapterId(null)} className="absolute top-12 left-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"><ChevronLeft size={24} /></button><div className="mt-8"><div className="flex items-center gap-2 mb-1"><span className="text-3xl">{currentChapter.icon}</span><h2 className="text-2xl font-bold">{currentChapter.name}</h2></div></div></div>
       <div className="flex-1 overflow-y-auto p-5 pb-24"><div className="space-y-4 relative"><div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>{Array.from({ length: 10 }).map((_, idx) => { const levelNum = idx + 1; const relativeLevel = levelNum; const isCompleted = relativeLevel <= currentChapterProgress; const isCurrent = relativeLevel === currentChapterProgress + 1; const isLocked = relativeLevel > currentChapterProgress + 1; const realRecipe = RECIPES.find(r => r.cuisine === currentChapter.id && r.level === relativeLevel); const canUnlock = isLocked && realRecipe; return (<div key={levelNum} className="relative z-10 flex gap-4"><div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' : isCurrent ? 'bg-orange-500 border-orange-200 text-white ring-4 ring-orange-100' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>{isCompleted ? <CheckCircle size={16} /> : <span>{levelNum}</span>}</div><div className={`flex-1 rounded-xl p-4 border transition-all ${isLocked ? 'bg-white border-gray-100' : 'bg-white border-gray-200 shadow-sm'}`}><div className="flex justify-between items-start mb-1"><h4 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{realRecipe ? realRecipe.title : `基本功练习 ${levelNum}`}</h4>{isLocked && <Lock size={14} className="text-gray-300" />}</div>{isCurrent && (<button onClick={() => realRecipe && onStartLevel(realRecipe)} className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-md shadow-orange-200 active:scale-95 transition-transform">开始挑战</button>)}{canUnlock && (<div className="mt-3 bg-gray-50 rounded-lg p-2 flex items-center justify-between"><div className="text-xs text-gray-500">此关包含食谱<br/>可消耗积分提前解锁</div><button onClick={() => onUnlockLevel(currentChapter.id, relativeLevel, realRecipe.title)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md border border-indigo-100 flex items-center gap-1 active:scale-95"><Zap size={12} fill="currentColor" />兑换</button></div>)}</div></div>); })}</div></div>
    </div>
  );
};

const SocialTab = () => {
  const [tab, setTab] = useState('feed');
  const [showEvilGuide, setShowEvilGuide] = useState(false);
  const homemadePosts = useMemo(() => SOCIAL_POSTS.filter(post => post.type === 'homemade' && post.tags?.includes('难吃')).sort((a, b) => b.likes - a.likes), []);
  const laobaSpecial = homemadePosts.length > 0 ? homemadePosts[0] : null;
  const top10List = homemadePosts.slice(1, 10);
  const otherHomemade = SOCIAL_POSTS.filter(p => p.type === 'homemade' && !homemadePosts.slice(0, 10).find(top => top.id === p.id));

  return (
    <div className="bg-gray-50 h-full flex flex-col pb-20">
      <div className="bg-white px-5 pt-4 pb-0 sticky top-0 z-20 shadow-sm"><div className="flex gap-6 text-sm font-bold text-gray-400 overflow-x-auto hide-scrollbar"><button onClick={() => setTab('feed')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${tab === 'feed' ? 'text-gray-900 border-orange-500' : 'border-transparent'}`}>美食圈动态</button><button onClick={() => setTab('homemade')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${tab === 'homemade' ? 'text-purple-700 border-purple-500' : 'border-transparent'}`}>{tab === 'homemade' ? <Skull size={14} className="animate-pulse"/> : null} 自制美食栏</button><button onClick={() => setTab('ranking')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${tab === 'ranking' ? 'text-gray-900 border-orange-500' : 'border-transparent'}`}>本周榜单</button></div></div>
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'feed' && (<div className="space-y-4">{SOCIAL_POSTS.filter(p => p.type === 'normal').map(post => <PostCard key={post.id} post={post} />)}</div>)}
        {tab === 'homemade' && (<div className="space-y-6"><div onClick={() => setShowEvilGuide(true)} className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-xl p-4 flex items-center justify-between shadow-lg cursor-pointer border border-purple-500/30 group active:scale-95 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 group-hover:animate-spin"><Sparkles size={20} /></div><div><h3 className="text-white font-bold text-sm flex items-center gap-2">邪修炼丹炉 <span className="bg-purple-600 text-[8px] px-1 rounded text-white">AI Powered</span></h3><p className="text-purple-400 text-[10px]">输入食材 · AI 生成黑暗配方</p></div></div><ChevronLeft className="text-gray-500 rotate-180" size={20} /></div><div className="flex items-center gap-2 mb-2"><Trophy size={18} className="text-yellow-500" /><h3 className="font-bold text-gray-800">本月暗黑料理 Top 10</h3></div>{laobaSpecial && (<div className="relative bg-gray-900 rounded-2xl p-5 overflow-hidden shadow-2xl shadow-purple-900/50 text-white border-2 border-purple-500/50 mb-4"><div className="absolute top-0 right-0 p-3 opacity-20"><Skull size={100} /></div><div className="relative z-10"><div className="flex items-center gap-2 mb-3"><span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg"><Crown size={10} fill="currentColor" /> No.1 老八套餐</span></div><div className="flex gap-4 items-start"><div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-400 shrink-0 relative"><img src={laobaSpecial.image} className="w-full h-full object-cover" alt={laobaSpecial.title} /></div><div><h3 className="font-bold text-lg leading-tight mb-1">{laobaSpecial.title}</h3><div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><img src={laobaSpecial.avatar} className="w-4 h-4 rounded-full" alt="avatar" />{laobaSpecial.user}</div></div></div></div></div>)}<div className="space-y-4"><h3 className="font-bold text-gray-800 flex items-center gap-2 mt-4"><Zap size={16} className="text-blue-500" /> 其他自制投稿</h3>{otherHomemade.map(post => <PostCard key={post.id} post={post} isHomemade={true} />)}</div></div>)}
        {tab === 'ranking' && (<div className="space-y-3"><div className="bg-orange-100 text-orange-800 text-xs p-3 rounded-lg mb-4 text-center border border-orange-200">每7天刷新榜单</div>{RANKING.map((user, idx) => <RankingCard key={idx} user={user} idx={idx} />)}</div>)}
      </div>
      {showEvilGuide && <EvilGuideModal onClose={() => setShowEvilGuide(false)} />}
    </div>
  );
};

// --- RecipeDetail component (added/used by App) ---
const RecipeDetail = ({ recipe, onBack, onComplete }) => {
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-5 pt-6 pb-3 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <button onClick={onBack} className="p-1 bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
        <div className="flex-1">
          <div className="text-sm text-gray-500">菜谱详情</div>
          <div className="font-bold text-lg">{recipe.title}</div>
        </div>
        <div className="text-xs text-gray-400">{recipe.time}</div>
      </div>

      <div className="p-5 space-y-4">
        <div className="rounded-xl overflow-hidden shadow-lg"><img src={recipe.image} alt={recipe.title} className="w-full object-cover h-56" /></div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-bold">{recipe.title}</div>
            <div className="text-xs text-gray-400">{recipe.difficulty}</div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>

          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">配料</div>
            <ul className="text-sm text-gray-700">{recipe.ingredients?.map((it, idx) => <li key={idx}>{it.name} — {it.amount}{it.unit}</li>)}</ul>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">步骤</div>
            <ol className="text-sm text-gray-700 space-y-2">{recipe.steps?.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}</ol>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowVideo(true)} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold">查看示范视频</button>
            <button onClick={() => setShowChat(true)} className="py-2 px-3 bg-indigo-50 text-indigo-600 rounded-md font-bold border border-indigo-100">向 AI 咨询</button>
          </div>
        </div>

        <div className="fixed left-4 right-4 bottom-6 flex gap-3 z-40"> <button onClick={() => onComplete(recipe)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg">完成并返回</button></div>
      </div>

      {showChat && <AIChatModal recipe={recipe} onClose={() => setShowChat(false)} />}
      {showVideo && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"><div className="bg-black rounded-xl overflow-hidden w-full max-w-3xl"><div className="flex items-center justify-between p-3 border-b border-black/30"><div className="text-white font-bold">示范视频</div><button onClick={() => setShowVideo(false)} className="text-gray-300 p-1"><X size={18} /></button></div><div className="p-6 bg-black"><div className="w-full aspect-video bg-gray-900"><video src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4" controls className="w-full h-full object-cover" /></div></div></div></div>}
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[360px] bg-white rounded-xl shadow-lg p-6">
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-[360px] bg-white rounded-xl p-6 shadow-lg">
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
  const [unlockModal, setUnlockModal] = useState({ isOpen: false, cuisine: null, level: null, cost: 0, title: '' });

  const handleStartLevel = (recipe) => setSelectedRecipe(recipe);
  const handleComplete = (recipe) => {
    setSelectedRecipe(null);
    setActiveTab('home');
    const currentProgress = userProfile.completedLevels?.[recipe.cuisine] || 0;
    if (recipe.level === currentProgress + 1) {
      setUserProfile(prev => ({ ...prev, points: prev.points + 100, completedLevels: { ...prev.completedLevels, [recipe.cuisine]: (prev.completedLevels?.[recipe.cuisine] || 0) + 1 } }));
    }
    if (!unlockedRecipes.find(r => r.id === recipe.id)) setUnlockedRecipes([...unlockedRecipes, recipe]);
  };

  const onUnlockLevelClick = (cuisineId, level, title) => setUnlockModal({ isOpen: true, cuisine: cuisineId, level: level, cost: 300 * (userProfile.monthlyUnlocks + 1), title: title });

  const confirmUnlock = () => {
    const { cuisine, level, cost } = unlockModal;
    setUserProfile(prev => ({ ...prev, points: prev.points - cost, monthlyUnlocks: prev.monthlyUnlocks + 1, completedLevels: { ...prev.completedLevels, [cuisine]: Math.max(prev.completedLevels?.[cuisine] ?? 0, level) } }));
    const recipe = RECIPES.find(r => r.cuisine === cuisine && r.level === level);
    if (recipe && !unlockedRecipes.find(r => r.id === recipe.id)) setUnlockedRecipes(prev => [...prev, recipe]);
    setUnlockModal({ isOpen: false, cuisine: null, level: null, cost: 0, title: '' });
  };

  const renderContent = () => {
    if (activeTab === 'home') return <HomeTab unlockedRecipes={unlockedRecipes} onRecipeClick={setSelectedRecipe} userProfile={userProfile} />;
    if (activeTab === 'challenge') return <ChallengeTab userProfile={userProfile} onStartLevel={handleStartLevel} onUnlockLevel={onUnlockLevelClick} />;
    if (activeTab === 'social') return <SocialTab />;
    return null;
  };
  if (selectedRecipe) return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} onComplete={handleComplete} />;

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
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white min-h-screen font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative flex flex-col">
          {/* User info & logout */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
            <div className="text-sm text-gray-700 mr-2">{userProfile.name}</div>
            <button onClick={onLogout} className="text-xs bg-gray-100 px-2 py-1 rounded">退出</button>
          </div>
          {activeTab !== 'home' && activeTab !== 'social' && (<div className="bg-white px-5 pt-12 pb-2 flex justify-between items-center shadow-sm z-10"><h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">{activeTab === 'challenge' ? '厨艺征途' : '美味厨房'}</h1></div>)}
          <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
          <div className="bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-30 shrink-0">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}><Home size={24} /><span className="text-[10px]">首页</span></button>
            <button onClick={() => setActiveTab('challenge')} className={`flex flex-col items-center gap-1 ${activeTab === 'challenge' ? 'text-orange-500' : 'text-gray-400'}`}><Map size={24} /><span className="text-[10px]">征途</span></button>
            <button onClick={() => setActiveTab('social')} className={`flex flex-col items-center gap-1 ${activeTab === 'social' ? 'text-orange-500' : 'text-gray-400'}`}><Users size={24} /><span className="text-[10px]">美食圈</span></button>
            <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-1 ${activeTab === 'favorites' ? 'text-orange-500' : 'text-gray-400'}`}><Bookmark size={24} /><span className="text-[10px]">收藏</span></button>
          </div>
          <UnlockModal isOpen={unlockModal.isOpen} onClose={() => setUnlockModal({ ...unlockModal, isOpen: false })} onConfirm={confirmUnlock} cost={unlockModal.cost} title={unlockModal.title} monthlyLeft={3 - userProfile.monthlyUnlocks} userPoints={userProfile.points} />
          {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={onRegister} />}
        </div>
      </div>
    </div>
  );
}
