// src/pages/Vegetables.jsx
import { Link } from 'react-router-dom';

const vegetables = [
  { id: 1, name: '有机西兰花', price: 12.99, unit: '斤', emoji: '🥦', desc: '富含维生素C，口感脆嫩' },
  { id: 2, name: '新鲜菠菜', price: 8.50, unit: '斤', emoji: '🥬', desc: '铁元素丰富，营养健康' },
  { id: 3, name: '红萝卜', price: 6.80, unit: '斤', emoji: '🥕', desc: '胡萝卜素含量高，护眼佳品' },
  { id: 4, name: '青椒', price: 5.50, unit: '斤', emoji: '🫑', desc: '维生素C之王，清脆爽口' },
  { id: 5, name: '西红柿', price: 7.20, unit: '斤', emoji: '🍅', desc: '自然成熟，酸甜可口' },
  { id: 6, name: '黄瓜', price: 4.50, unit: '斤', emoji: '🥒', desc: '清凉解暑，美容养颜' },
  { id: 7, name: '土豆', price: 3.80, unit: '斤', emoji: '🥔', desc: '淀粉丰富，百搭食材' },
  { id: 8, name: '大白菜', price: 2.50, unit: '斤', emoji: '🥬', desc: '家常必备，炒炖皆宜' },
];

export default function Vegetables() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-bold text-white">🥬 新鲜蔬菜</h1>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
              新鲜蔬菜专区
            </span>
          </h1>
          <p className="text-gray-400 text-lg">精选有机蔬菜，每日新鲜直达</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vegetables.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-900/80 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl text-center mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold text-green-300 text-center mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm text-center mb-4">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">¥{item.price}</span>
                <span className="text-gray-500">/{item.unit}</span>
              </div>
              <button className="w-full mt-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-colors">
                加入购物车
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-10 text-center text-gray-600 bg-black text-sm">
        <p>© 2026 Fresh Market. 新鲜每一天。</p>
      </footer>
    </div>
  );
}
