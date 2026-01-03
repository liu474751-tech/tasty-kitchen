// src/pages/FreshMarket.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import useCart from '../hooks/useCart';
import ProductCard, { Badge, Button } from '../components/ProductCard';

// 蔬菜数据
const vegetables = [
  { id: 'v1', name: '有机西兰花', price: 12.99, unit: '斤', emoji: '🥦', desc: '富含维生素C，口感脆嫩' },
  { id: 'v2', name: '新鲜菠菜', price: 8.50, unit: '斤', emoji: '🥬', desc: '铁元素丰富，营养健康' },
  { id: 'v3', name: '红萝卜', price: 6.80, unit: '斤', emoji: '🥕', desc: '胡萝卜素含量高，护眼佳品' },
  { id: 'v4', name: '西红柿', price: 7.20, unit: '斤', emoji: '🍅', desc: '自然成熟，酸甜可口' },
];

// 水果数据
const fruits = [
  { id: 'f1', name: '红富士苹果', price: 15.99, unit: '斤', emoji: '🍎', desc: '脆甜多汁，新鲜采摘' },
  { id: 'f2', name: '阳光橙子', price: 12.50, unit: '斤', emoji: '🍊', desc: '维C爆棚，酸甜可口' },
  { id: 'f3', name: '水晶葡萄', price: 25.00, unit: '斤', emoji: '🍇', desc: '粒粒饱满，甜蜜无籽' },
  { id: 'f4', name: '草莓', price: 35.00, unit: '斤', emoji: '🍓', desc: '酸甜诱人，颜值担当' },
];

// 套餐展示
const showcaseItems = [
  { id: 's1', name: '精选礼盒套装', price: 199.00, emoji: '🎁', desc: '水果蔬菜精美组合', tag: '热卖', tagColor: 'bg-red-500' },
  { id: 's2', name: '有机蔬菜周套餐', price: 128.00, emoji: '📦', desc: '一周所需蔬菜', tag: '推荐', tagColor: 'bg-green-500' },
  { id: 's3', name: '家庭蔬果大礼包', price: 168.00, emoji: '🏠', desc: '满足全家一周所需', tag: '超值', tagColor: 'bg-amber-500' },
];

// 外卖菜单
const menuItems = [
  { id: 'm1', name: '健康蔬菜沙拉', price: 28.00, emoji: '🥗', desc: '新鲜时蔬，低卡健康' },
  { id: 'm2', name: '鲜果拼盘', price: 38.00, emoji: '🍇', desc: '多种时令水果' },
  { id: 'm3', name: '鲜榨果汁', price: 18.00, emoji: '🧃', desc: '现榨无添加' },
  { id: 'm4', name: '水果捞', price: 32.00, emoji: '🍨', desc: '酸奶配鲜果' },
];

// Tab 配置
const tabs = [
  { id: 'vegetables', name: '🥬 蔬菜', color: 'green' },
  { id: 'fruits', name: '🍎 水果', color: 'orange' },
  { id: 'showcase', name: '🏪 展示', color: 'purple' },
  { id: 'delivery', name: '🛵 外卖', color: 'red' },
];

export default function FreshMarket() {
  // 使用 URL Query Params 实现路由闭环（可分享链接直达分类）
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('category') || 'vegetables';
  
  // 使用自定义 Hook 管理购物车（带 localStorage 持久化）
  const { cartItems, addToCart, totalPrice, totalItems, clearCart } = useCart();

  // 切换 Tab 时更新 URL
  const handleTabChange = (tabId) => {
    setSearchParams({ category: tabId });
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
              ← 返回首页
            </Link>
            <h1 className="text-xl font-bold text-white">🛒 新鲜市场</h1>
            <div className="flex items-center gap-2 bg-amber-600/20 px-4 py-2 rounded-full border border-amber-500/30">
              <span className="text-xl">🛒</span>
              <span className="text-amber-300 font-bold">{totalItems} 件 | ¥{totalPrice}</span>
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

      {/* 主内容区 */}
      <main className="container mx-auto px-6 py-8">
        
        {/* 蔬菜区 */}
        {activeTab === 'vegetables' && (
          <section role="tabpanel" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-400 mb-2">🥬 新鲜蔬菜专区</h2>
              <p className="text-gray-400">精选有机蔬菜，每日新鲜直达</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vegetables.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  color="green"
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 水果区 */}
        {activeTab === 'fruits' && (
          <section role="tabpanel" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-400 mb-2">🍎 新鲜水果专区</h2>
              <p className="text-gray-400">当季鲜果，产地直供</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fruits.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  color="orange"
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 展示区 */}
        {activeTab === 'showcase' && (
          <section role="tabpanel" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-400 mb-2">🏪 精品展示窗口</h2>
              <p className="text-gray-400">精选套餐，超值优惠</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseItems.map((item) => (
                <article key={item.id} className="bg-gray-900/80 border border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-2 transition-all cursor-pointer">
                  <div className="relative h-32 bg-gradient-to-br from-purple-900/50 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl" role="img" aria-label={item.name}>{item.emoji}</span>
                    <span className={`absolute top-3 right-3 px-3 py-1 ${item.tagColor} text-white text-xs rounded-full font-bold`}>{item.tag}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-purple-300 mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">¥{item.price}</span>
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

        {/* 外卖区 */}
        {activeTab === 'delivery' && (
          <section role="tabpanel" className="animate-fadeIn">
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-red-400 mb-2">🛵 外卖点餐窗口</h2>
              <p className="text-gray-400">快速配送，新鲜到家</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <article key={item.id} className="bg-gray-900/80 border border-red-500/30 rounded-xl p-4 hover:border-red-400 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" role="img" aria-label={item.name}>{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-red-300">{item.name}</h3>
                      <p className="text-gray-400 text-xs mb-2">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">¥{item.price}</span>
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

        {/* 购物车浮窗 */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md border border-amber-500/50 rounded-2xl p-4 shadow-2xl z-40 max-w-md w-full mx-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="购物车">🛒</span>
                <div>
                  <p className="text-white font-bold">{totalItems} 件商品</p>
                  <p className="text-amber-400 text-xl font-bold">¥{totalPrice}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearCart}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors text-sm"
                  aria-label="清空购物车"
                >
                  清空
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl font-bold transition-colors">
                  去结算 →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-10 text-center text-gray-600 bg-black text-sm mt-20">
        <p>© 2026 Fresh Market. 新鲜每一天。</p>
      </footer>
    </div>
  );
}
