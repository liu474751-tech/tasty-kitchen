// src/pages/FreshMarket.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import useCart from '../hooks/useCart';
import ProductCard, { Badge, Button } from '../components/ProductCard';
import SearchBox from '../components/SearchBox';
import { SpatialModal } from '../components/SpatialModal';
import { FEATURES } from '../config/features';

// 从数据层导入完整数据（支持上百种商品）
import {
  allVegetables,
  allFruits,
  allShowcaseItems,
  allMenuItems,
  getDiscountPercent,
} from '../data';

// 导入蔬菜灵魂数据（用于遗言和条款）
import { vegetableSoulList } from '../data/vegetableSoul';

// 创意4：伪弹幕数据
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

// 根据商品名匹配蔬菜灵魂数据
const findVegSoul = (itemName) => {
  return vegetableSoulList.find(v => itemName.includes(v.name) || v.name.includes(itemName));
};

// Tab 配置 - 数据映射驱动渲染
const tabConfig = {
  vegetables: {
    id: 'vegetables',
    name: '🥬 蔬菜',
    color: 'green',
    title: '🥬 今日清晨采摘：新鲜蔬菜',
    subtitle: '凌晨4点产地直发，锁住每一份鲜嫩',
    data: allVegetables,
    gridCols: 'lg:grid-cols-4',
    searchPlaceholder: '搜索西兰花、菠菜、胡萝卜...',
  },
  fruits: {
    id: 'fruits',
    name: '🍎 水果',
    color: 'orange',
    title: '🍎 果园直达：当季鲜果',
    subtitle: '24小时从枝头到餐桌，新鲜看得见',
    data: allFruits,
    gridCols: 'lg:grid-cols-4',
    searchPlaceholder: '搜索苹果、橙子、草莓...',
  },
  showcase: {
    id: 'showcase',
    name: '🏪 展示',
    color: 'purple',
    title: '🏪 爆款精选：限时特惠',
    subtitle: '省心搭配，一键下单享超值',
    data: allShowcaseItems,
    gridCols: 'lg:grid-cols-3',
    searchPlaceholder: '搜索套餐、礼盒...',
  },
  delivery: {
    id: 'delivery',
    name: '🛵 外卖',
    color: 'red',
    title: '🛵 即点即送：新鲜到家',
    subtitle: '30分钟极速送达，迟到必赔',
    data: allMenuItems,
    gridCols: 'lg:grid-cols-4',
    searchPlaceholder: '搜索沙拉、果汁...',
  },
};

const tabs = Object.values(tabConfig);

export default function FreshMarket() {
  // 使用 URL Query Params 实现路由闭环（可分享链接直达分类）
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('category') || 'vegetables';
  
  // 搜索关键词状态
  const [searchQuery, setSearchQuery] = useState('');
  
  // 创意2：赛博/田园模式切换
  const [isCyberMode, setIsCyberMode] = useState(true);
  
  // 创意4：跑马灯索引
  const [tickerIndex, setTickerIndex] = useState(0);
  
  // 空间态模态框状态（替代 window.confirm）
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: '',
    pendingItem: null,
    type: 'lastWords' // 'lastWords' | 'absurdTerm' | 'veggieMatch'
  });
  
  // 使用自定义 Hook 管理购物车（带 localStorage 持久化）
  const { cartItems, addToCart, totalPrice, totalItems, clearCart } = useCart();

  // 创意4：跑马灯定时器
  useEffect(() => {
    if (!FEATURES.LIVE_TICKER) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % FAKE_NEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 创意5+6：带遗言和条款的加入购物车
  const handleAddToCartWithSoul = (item) => {
    // 创意3：触感反馈
    if (FEATURES.HAPTIC_FEEDBACK && navigator.vibrate) {
      navigator.vibrate([50, 50, 200]);
    }
    
    // 尝试匹配蔬菜灵魂数据
    const soul = findVegSoul(item.name);
    
    // 创意5：遗言确认弹窗（使用 SpatialModal）
    if (FEATURES.LAST_WORDS && soul && soul.lastWords) {
      setModalState({
        isOpen: true,
        title: `💀 ${item.name} 的遗言`,
        content: `"${soul.lastWords}"`,
        pendingItem: item,
        pendingSoul: soul,
        type: 'lastWords'
      });
      return; // 等待用户确认
    }
    
    // 如果没有遗言，直接添加
    completeAddToCart(item, soul);
  };

  // 完成添加到购物车（遗言确认后调用）
  const completeAddToCart = (item, soul) => {
    addToCart(item);
    
    // 创意6：奇葩契约条款（使用 SpatialModal）
    if (FEATURES.ABSURD_TERMS && soul && soul.absurdTerm) {
      setTimeout(() => {
        setModalState({
          isOpen: true,
          title: `🎉 领养成功`,
          content: `${item.name} 已加入购物车！\n\n📋 契约条款：\n${soul.absurdTerm}`,
          pendingItem: null,
          type: 'absurdTerm'
        });
      }, 100);
    }
  };

  // 模态框确认回调
  const handleModalConfirm = () => {
    const { type, pendingItem, pendingSoul } = modalState;
    
    if (type === 'lastWords' && pendingItem) {
      // 触感反馈
      if (FEATURES.HAPTIC_FEEDBACK && navigator.vibrate) {
        navigator.vibrate([100]);
      }
      completeAddToCart(pendingItem, pendingSoul);
    }
    
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // 模态框取消回调
  const handleModalCancel = () => {
    setModalState(prev => ({ ...prev, isOpen: false, pendingItem: null }));
  };

  // 创意7：本命蔬菜配对（使用 SpatialModal）
  const handleVeggieMatch = () => {
    const randomVeg = vegetableSoulList[Math.floor(Math.random() * vegetableSoulList.length)];
    const compatibility = Math.floor(Math.random() * 30) + 70;
    
    const reasons = [
      "你们都喜欢躺着。",
      "你们的MBTI高度相似。",
      "你们都在深夜emo过。",
      "你们都有被误解的灵魂。",
      "你们都是表面坚强内心柔软。",
      "你们都是派对上的显眼包。"
    ];
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

    setModalState({
      isOpen: true,
      title: `🔮 灵魂匹配结果`,
      content: `你和【${randomVeg.name}】的契合度为 ${compatibility}%！\n\n📝 理由：${randomReason}\n\n💚 它想对你说：\n"${randomVeg.lastWords}"`,
      pendingItem: null,
      type: 'veggieMatch'
    });
  };

  // 当前 Tab 配置（useMemo 缓存，避免重复计算）
  const currentTab = useMemo(() => tabConfig[activeTab] || tabConfig.vegetables, [activeTab]);
  
  // 当前展示的商品列表（支持搜索过滤）
  const displayItems = useMemo(() => {
    const items = currentTab.data || [];
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.desc && item.desc.toLowerCase().includes(query)) ||
      (item.emoji && item.emoji.includes(query))
    );
  }, [currentTab, searchQuery]);

  // 搜索处理（防抖优化）
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // 切换 Tab 时清空搜索
  const handleTabChange = (tabId) => {
    setSearchParams({ category: tabId });
    setSearchQuery('');
  };

  // JSON-LD 结构化数据（SEO 优化）
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "新鲜市场",
      "description": "蔬菜水果一站购齐，展示精品套餐，外卖快速配送"
    };
    
    let script = document.querySelector('#json-ld-market');
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-market';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
    
    return () => script?.remove();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isCyberMode ? 'bg-gray-950 text-white' : 'bg-[#f0fdf4] text-green-900'}`}>
      
      {/* 创意4：伪弹幕跑马灯 */}
      {FEATURES.LIVE_TICKER && (
        <div className={`${isCyberMode ? 'bg-cyan-500' : 'bg-green-500'} text-black text-[10px] py-1.5 font-bold font-mono overflow-hidden`}>
          <div className="animate-marquee whitespace-nowrap">
            🚨 BREAKING: {FAKE_NEWS[tickerIndex]} 🚨
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${isCyberMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-green-200'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className={`text-2xl font-bold transition-colors ${isCyberMode ? 'text-amber-400 hover:text-amber-300' : 'text-green-600 hover:text-green-500'}`}>
              ← 返回首页
            </Link>
            <h1 className={`text-xl font-bold ${isCyberMode ? 'text-white' : 'text-green-800'}`}>🛒 新鲜市场</h1>
            <div className="flex items-center gap-3">
              {/* 创意2：模式切换按钮 */}
              {FEATURES.THEME_TOGGLE && (
                <button 
                  onClick={() => setIsCyberMode(!isCyberMode)}
                  className={`text-xs font-bold px-3 py-2 rounded-full border transition-all ${
                    isCyberMode 
                      ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10' 
                      : 'border-green-600 text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {isCyberMode ? '🌙 赛博' : '☀️ 田园'}
                </button>
              )}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isCyberMode ? 'bg-amber-600/20 border-amber-500/30' : 'bg-green-100 border-green-300'}`}>
                <span className="text-xl">🛒</span>
                <span className={`font-bold ${isCyberMode ? 'text-amber-300' : 'text-green-700'}`}>{totalItems} 件 | ¥{totalPrice}</span>
              </div>
            </div>
          </div>
          
          {/* Tab 导航 */}
          <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-600/30`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区 - 数据映射驱动渲染 */}
      <main className="container mx-auto px-6 py-8">
        
        {/* 搜索框 - SEO 优化 */}
        <SearchBox 
          onSearch={handleSearch}
          placeholder={currentTab.searchPlaceholder}
          color={currentTab.color}
        />
        
        {/* 搜索结果提示 */}
        {searchQuery && (
          <p className="text-center text-gray-400 mb-4">
            找到 <span className="text-white font-bold">{displayItems.length}</span> 个相关商品
            {displayItems.length === 0 && (
              <span className="block mt-2 text-gray-500">换个关键词试试？</span>
            )}
          </p>
        )}
        
        {/* 通用商品区（蔬菜/水果）*/}
        {(activeTab === 'vegetables' || activeTab === 'fruits') && (
          <section role="tabpanel" aria-labelledby={`${activeTab}-title`} className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 id={`${activeTab}-title`} className={`text-3xl font-bold text-${currentTab.color}-400 mb-2`}>
                {currentTab.title}
              </h2>
              <p className={isCyberMode ? 'text-gray-400' : 'text-green-600'}>{currentTab.subtitle}</p>
              <p className={`text-sm mt-2 ${isCyberMode ? 'text-gray-500' : 'text-green-500'}`}>共 {displayItems.length} 种商品</p>
            </header>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentTab.gridCols} gap-6`} role="list">
              {displayItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  color={currentTab.color}
                  onAddToCart={activeTab === 'vegetables' ? handleAddToCartWithSoul : addToCart}
                  isCyberMode={isCyberMode}
                />
              ))}
            </div>
          </section>
        )}

        {/* 展示区 - 套餐卡片特殊布局 */}
        {activeTab === 'showcase' && (
          <section role="tabpanel" aria-labelledby="showcase-title" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 id="showcase-title" className="text-3xl font-bold text-purple-400 mb-2">{currentTab.title}</h2>
              <p className="text-gray-400">{currentTab.subtitle}</p>
              <p className="text-gray-500 text-sm mt-2">共 {displayItems.length} 款套餐</p>
            </header>
            {/* Banner */}
            <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <Badge color="purple">限时特惠</Badge>
                  <h3 className="text-2xl font-bold text-white mt-2">新年大促销 🎉</h3>
                  <p className="text-gray-300">全场套餐8折起</p>
                </div>
                <div className="text-6xl" role="img" aria-label="礼物">🎁</div>
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentTab.gridCols} gap-6`}>
              {displayItems.map((item) => (
                <article key={item.id} className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-neon-purple hover:-translate-y-2 transition-all cursor-pointer">
                  <div className="relative h-32 bg-gradient-to-br from-purple-900/50 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl" role="img" aria-label={item.name}>{item.emoji}</span>
                    <span className={`absolute top-3 right-3 px-3 py-1 ${item.tagColor} text-white text-xs rounded-full font-bold`}>{item.tag}</span>
                    {item.originalPrice && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                        -{getDiscountPercent(item)}%
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-purple-300 mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                    {item.items && (
                      <p className="text-gray-500 text-xs mb-3">包含: {item.items.slice(0, 3).join('、')}{item.items.length > 3 ? '...' : ''}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">¥{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-500 text-sm line-through ml-2">¥{item.originalPrice}</span>
                        )}
                      </div>
                      <Button onClick={() => addToCart(item)} color="purple">
                        立即抢购
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 外卖区 - 紧凑卡片布局 */}
        {activeTab === 'delivery' && (
          <section role="tabpanel" aria-labelledby="delivery-title" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 id="delivery-title" className="text-3xl font-bold text-red-400 mb-2">{currentTab.title}</h2>
              <p className="text-gray-400">{currentTab.subtitle}</p>
              <p className="text-gray-500 text-sm mt-2">共 {displayItems.length} 道菜品</p>
            </header>
            {/* 配送信息 */}
            <div className="mb-6 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-4 border border-red-500/30">
              <div className="flex flex-wrap items-center justify-around gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="时间">⏱️</span>
                  <span className="text-white">30-45分钟送达</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="配送">🚚</span>
                  <span className="text-white">满30免配送费</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="位置">📍</span>
                  <span className="text-white">3公里内配送</span>
                </div>
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentTab.gridCols} gap-4`}>
              {displayItems.map((item) => (
                <article key={item.id} className="bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 hover:border-red-400 hover:shadow-neon-red transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" role="img" aria-label={item.name}>{item.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-red-300">{item.name}</h3>
                        {item.calories && (
                          <span className="text-xs text-gray-500">{item.calories}kcal</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">¥{item.price}</span>
                          {item.prepTime && (
                            <span className="text-xs text-gray-500">约{item.prepTime}min</span>
                          )}
                        </div>
                        <Button onClick={() => addToCart(item)} color="red" className="!py-1 !px-3 text-xs">
                          + 加入
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 购物车浮窗 - 毛玻璃效果 + 发光边框 */}
        {cartItems.length > 0 && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-xl border rounded-2xl p-5 z-40 max-w-md w-full mx-4 animate-float transition-all duration-300 ${
            isCyberMode 
              ? 'bg-gray-900/70 border-amber-400/60 shadow-neon-amber hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]' 
              : 'bg-white/90 border-green-400 shadow-lg hover:shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse-slow" role="img" aria-label="购物车">🛒</span>
                <div>
                  <p className={`font-bold ${isCyberMode ? 'text-white' : 'text-green-800'}`}>{totalItems} 件商品</p>
                  <p className={`text-xl font-bold ${isCyberMode ? 'text-amber-400' : 'text-green-600'}`}>¥{totalPrice}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearCart}
                  className={`px-4 py-3 rounded-xl font-bold transition-all text-sm hover:shadow-lg ${
                    isCyberMode ? 'bg-gray-700/80 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  aria-label="清空购物车"
                >
                  清空
                </button>
                <button className={`px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                  isCyberMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:shadow-neon-orange' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
                }`}>
                  去结算 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 创意7：悬浮本命蔬菜配对按钮 */}
        {FEATURES.VEGGIE_MATCH && (
          <button 
            onClick={handleVeggieMatch}
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
      </main>

      <footer className={`py-10 text-center text-sm mt-20 ${isCyberMode ? 'text-gray-600 bg-black' : 'text-green-600 bg-green-50'}`}>
        <p>© 2026 Fresh Market. 新鲜每一天。</p>
      </footer>

      {/* 空间态模态框 - 替代 window.confirm/alert */}
      <SpatialModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        content={modalState.content}
        isCyberMode={isCyberMode}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        confirmText={modalState.type === 'lastWords' ? '确认领养' : '好的'}
        cancelText={modalState.type === 'lastWords' ? '再想想' : '关闭'}
      />
    </div>
  );
}
