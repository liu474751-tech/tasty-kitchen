// src/pages/Fruits.jsx
import { Link } from 'react-router-dom';

const fruits = [
  { id: 1, name: '红富士苹果', price: 15.99, unit: '斤', emoji: '🍎', desc: '脆甜多汁，新鲜采摘' },
  { id: 2, name: '进口香蕉', price: 8.80, unit: '斤', emoji: '🍌', desc: '软糯香甜，能量满满' },
  { id: 3, name: '阳光橙子', price: 12.50, unit: '斤', emoji: '🍊', desc: '维C爆棚，酸甜可口' },
  { id: 4, name: '水晶葡萄', price: 25.00, unit: '斤', emoji: '🍇', desc: '粒粒饱满，甜蜜无籽' },
  { id: 5, name: '蜜桃', price: 18.00, unit: '斤', emoji: '🍑', desc: '肉厚汁多，香气四溢' },
  { id: 6, name: '西瓜', price: 3.50, unit: '斤', emoji: '🍉', desc: '清凉解暑，夏日必备' },
  { id: 7, name: '草莓', price: 35.00, unit: '斤', emoji: '🍓', desc: '酸甜诱人，颜值担当' },
  { id: 8, name: '奇异果', price: 28.00, unit: '斤', emoji: '🥝', desc: '维C之王，营养丰富' },
];

export default function Fruits() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-bold text-white">🍎 新鲜水果</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
              新鲜水果专区
            </span>
          </h1>
          <p className="text-gray-400 text-lg">当季鲜果，产地直供，甜蜜多汁</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fruits.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-900/80 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 transition-all duration-300 hover:border-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl text-center mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold text-orange-300 text-center mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm text-center mb-4">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">¥{item.price}</span>
                <span className="text-gray-500">/{item.unit}</span>
              </div>
              <button className="w-full mt-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold transition-colors">
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
