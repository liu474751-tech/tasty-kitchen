// src/pages/Delivery.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const menuItems = [
  { id: 1, name: '健康蔬菜沙拉', price: 28.00, emoji: '🥗', desc: '新鲜时蔬搭配，低卡健康', prepTime: '10分钟' },
  { id: 2, name: '鲜果拼盘', price: 38.00, emoji: '🍇', desc: '多种时令水果，营养丰富', prepTime: '5分钟' },
  { id: 3, name: '蔬菜炒饭', price: 22.00, emoji: '🍚', desc: '时蔬配米饭，家常美味', prepTime: '15分钟' },
  { id: 4, name: '鲜榨果汁', price: 18.00, emoji: '🧃', desc: '现榨无添加，纯天然口感', prepTime: '3分钟' },
  { id: 5, name: '蔬菜汤', price: 25.00, emoji: '🍲', desc: '慢火熬煮，暖心暖胃', prepTime: '20分钟' },
  { id: 6, name: '水果捞', price: 32.00, emoji: '🍨', desc: '酸奶配鲜果，清新甜蜜', prepTime: '5分钟' },
];

export default function Delivery() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-red-400 hover:text-red-300 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-bold text-white">🛵 外卖窗口</h1>
          <div className="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full border border-red-500/30">
            <span className="text-2xl">🛒</span>
            <span className="text-red-300 font-bold">{totalItems} 件</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-500">
              外卖点餐窗口
            </span>
          </h1>
          <p className="text-gray-400 text-lg">快速配送，新鲜到家</p>
        </div>

        {/* 配送信息 */}
        <div className="mb-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/30">
          <div className="flex flex-wrap items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏱️</span>
              <div>
                <p className="text-gray-400 text-sm">预计送达</p>
                <p className="text-white font-bold">30-45分钟</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚚</span>
              <div>
                <p className="text-gray-400 text-sm">配送费</p>
                <p className="text-white font-bold">满30免配送</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📍</span>
              <div>
                <p className="text-gray-400 text-sm">配送范围</p>
                <p className="text-white font-bold">3公里内</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 菜单 */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-white mb-6">📋 今日菜单</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-gray-900/80 backdrop-blur-md border border-red-500/30 rounded-xl p-4 transition-all duration-300 hover:border-red-400"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-300">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                      <p className="text-gray-500 text-xs mb-3">⏱️ {item.prepTime}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">¥{item.price}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-colors text-sm"
                        >
                          + 加入
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 购物车 */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-gray-900/80 backdrop-blur-md border border-red-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🛒 购物车</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-400">购物车是空的</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <p className="text-white text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-red-300 font-bold">¥{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">总计</span>
                      <span className="text-2xl font-bold text-red-400">¥{totalPrice}</span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl font-bold text-lg transition-colors">
                      🛵 立即下单
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-10 text-center text-gray-600 bg-black text-sm">
        <p>© 2026 Fresh Market. 新鲜每一天。</p>
      </footer>
    </div>
  );
}
