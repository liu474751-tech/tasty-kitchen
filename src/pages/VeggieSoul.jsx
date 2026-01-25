// src/pages/VeggieSoul.jsx
// 蔬菜灵魂主页面
// 组装所有零件，控制双模式切换、跑马灯和核心逻辑

import React, { useState, useEffect } from 'react';
import { vegetableSoulList } from '../data/vegetableSoul';
import { VegetableCard } from '../components/VegetableCard';
import { FEATURES } from '../config/features';

// 伪弹幕数据 - 用于跑马灯
const FAKE_NEWS = [
  "用户 [Cyber_Punk] 刚刚领养了 [孤独的补铁者]",
  "系统公告：[西红柿] 情感溢价指数上涨 5%",
  "用户 [王二狗] 签署了《不把洋葱剥哭条款》",
  "有人刚刚因为买到了 [MBTI为INTJ的苦瓜] 而感动落泪",
  "用户 [素食主义者] 与 [大白菜] 达成灵魂契约",
  "紧急通知：[土豆] 因过于佛系被取消今日上架资格",
  "用户 [健身达人] 正在与 [西蓝花] 进行深度交流",
  "系统检测到 [大蒜] 附近1.5米内用户数量为0"
];

export default function VeggieSoul() {
  const [isCyberMode, setIsCyberMode] = useState(true);
  const [selectedVeg, setSelectedVeg] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // 创意4：跑马灯逻辑 - 每4秒切换一条
  useEffect(() => {
    if (!FEATURES.LIVE_TICKER) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % FAKE_NEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 创意7：本命蔬菜匹配
  const handleMatch = () => {
    const randomVeg = vegetableSoulList[Math.floor(Math.random() * vegetableSoulList.length)];
    const compatibility = Math.floor(Math.random() * 30) + 70; // 70-99%
    
    const reasons = [
      "你们都喜欢躺着。",
      "你们的MBTI高度相似。",
      "你们都在深夜emo过。",
      "你们都有被误解的灵魂。",
      "你们都是表面坚强内心柔软。",
      "你们都是派对上的显眼包。"
    ];
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

    alert(`正在扫描你的灵魂...\n\n🔮 匹配结果：\n你和【${randomVeg.name}】的契合度为 ${compatibility}%！\n\n📝 理由：${randomReason}\n\n💚 它想对你说：\n"${randomVeg.lastWords}"`);
  };

  // 处理领养（加入购物车）
  const handleAdopt = (veg) => {
    // 创意3：触感反馈
    if (FEATURES.HAPTIC_FEEDBACK && navigator.vibrate) {
      navigator.vibrate([50, 50, 200]);
    }
    
    // 创意5：遗言确认
    if (FEATURES.LAST_WORDS) {
      const confirmed = window.confirm(
        `💀 来自 ${veg.name} 的灵魂拷问：\n\n"${veg.lastWords}"\n\n确定要带走它吗？`
      );
      if (!confirmed) return;
    }
    
    // 创意6：奇葩契约条款
    if (FEATURES.ABSURD_TERMS) {
      alert(`🎉 恭喜！你已成功领养 ${veg.name}。\n\n📋 契约条款：\n${veg.absurdTerm}`);
    } else {
      alert(`🎉 恭喜！你已成功领养 ${veg.name}。`);
    }
    
    setShowModal(false);
    setSelectedVeg(null);
  };

  // 打开详情弹窗
  const openVegDetail = (veg) => {
    setSelectedVeg(veg);
    setShowModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isCyberMode ? 'bg-[#0a0f18] text-white' : 'bg-[#f0fdf4] text-green-900'}`}>
      
      {/* 创意4：伪弹幕跑马灯 */}
      {FEATURES.LIVE_TICKER && (
        <div className={`${isCyberMode ? 'bg-cyan-500' : 'bg-green-500'} text-black text-[10px] py-1.5 font-bold font-mono overflow-hidden`}>
          <div className="animate-marquee whitespace-nowrap">
            🚨 BREAKING: {FAKE_NEWS[tickerIndex]} 🚨
          </div>
        </div>
      )}

      {/* 顶部导航 & 创意2：模式切换 */}
      <header className={`sticky top-0 z-30 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b ${isCyberMode ? 'border-white/5' : 'border-green-200'}`}>
        <h1 className="text-2xl font-black italic tracking-tighter">
          Fresh<span className={isCyberMode ? 'text-cyan-400' : 'text-green-500'}>Soul</span>.
        </h1>
        
        <div className="flex items-center gap-3">
          {/* 返回按钮 */}
          <a 
            href="/"
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${isCyberMode ? 'border-white/20 text-gray-400 hover:text-white' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
          >
            ← 返回大厅
          </a>
          
          {/* 创意2：主题切换按钮 */}
          {FEATURES.THEME_TOGGLE && (
            <button 
              onClick={() => setIsCyberMode(!isCyberMode)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                isCyberMode 
                  ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10' 
                  : 'border-green-700 text-green-800 bg-green-100 hover:bg-green-200'
              }`}
            >
              {isCyberMode ? '🌙 赛博模式' : '☀️ 田园模式'}
            </button>
          )}
        </div>
      </header>

      {/* 页面标题区域 */}
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <h2 className={`text-3xl font-black mb-2 ${isCyberMode ? 'animate-neon-flicker' : ''}`}>
          🥬 蔬菜灵魂图鉴
        </h2>
        <p className={`text-sm ${isCyberMode ? 'text-gray-400' : 'text-green-600'}`}>
          每一棵菜都有自己的故事，选择你的命定蔬菜
        </p>
      </div>

      {/* 主体网格 */}
      <main className="max-w-5xl mx-auto p-4 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vegetableSoulList.map((veg) => (
            <VegetableCard 
              key={veg.id} 
              veg={veg} 
              isCyberMode={isCyberMode}
              onClick={() => openVegDetail(veg)} 
            />
          ))}
        </div>
      </main>

      {/* 创意7：悬浮匹配按钮 */}
      {FEATURES.VEGGIE_MATCH && (
        <button 
          onClick={handleMatch}
          className={`fixed bottom-8 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce z-40 border-2 border-white transition-all ${
            isCyberMode 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500' 
              : 'bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-400 hover:to-green-400'
          }`}
          title="测试你的本命蔬菜"
        >
          🔮
        </button>
      )}

      {/* 详情弹窗 */}
      {showModal && selectedVeg && (
        <VegDetailModal 
          veg={selectedVeg} 
          isCyberMode={isCyberMode}
          onClose={() => { setShowModal(false); setSelectedVeg(null); }}
          onAdopt={handleAdopt}
        />
      )}
    </div>
  );
}

// 蔬菜详情弹窗组件
function VegDetailModal({ veg, isCyberMode, onClose, onAdopt }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* 弹窗内容 */}
      <div 
        className={`relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 animate-dramatic-enter ${
          isCyberMode ? 'bg-[#111827] text-white' : 'bg-white text-green-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
            isCyberMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          ✕
        </button>

        {/* 蔬菜图片 */}
        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-500/30">
          <img src={veg.img} alt={veg.name} className="w-full h-full object-cover" />
        </div>

        {/* 基本信息 */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black mb-1">{veg.name}</h3>
          <p className={`text-xs font-mono ${isCyberMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {veg.latin}
          </p>
        </div>

        {/* 标签栏 */}
        <div className="flex justify-center gap-2 mb-6">
          <span className={`text-xs px-3 py-1 rounded-full ${isCyberMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-600'}`}>
            {veg.mbti}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${isCyberMode ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-600'}`}>
            {veg.zodiac}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full capitalize ${isCyberMode ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-600'}`}>
            {veg.type}
          </span>
        </div>

        {/* 性格描述 */}
        <div className={`p-4 rounded-xl mb-4 ${isCyberMode ? 'bg-white/5' : 'bg-green-50'}`}>
          <h4 className="text-xs font-bold mb-2 opacity-60">🧠 性格</h4>
          <p className="text-sm">{veg.personality}</p>
        </div>

        {/* 命运宣言 */}
        <div className={`p-4 rounded-xl mb-4 ${isCyberMode ? 'bg-white/5' : 'bg-green-50'}`}>
          <h4 className="text-xs font-bold mb-2 opacity-60">🔮 命运</h4>
          <p className="text-sm">{veg.fate}</p>
        </div>

        {/* 遗言预览 */}
        {veg.lastWords && (
          <div className={`p-4 rounded-xl mb-6 ${isCyberMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
            <h4 className="text-xs font-bold mb-2 opacity-60">💀 遗言</h4>
            <p className="text-sm italic">"{veg.lastWords}"</p>
          </div>
        )}

        {/* 领养按钮 */}
        <button
          onClick={() => onAdopt(veg)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
            isCyberMode 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500'
          }`}
        >
          🛒 领养这棵菜
        </button>
      </div>
    </div>
  );
}
