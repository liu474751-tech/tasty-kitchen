// src/pages/Showcase.jsx
import { Link } from 'react-router-dom';

const showcaseItems = [
  { id: 1, name: '精选礼盒套装', price: 199.00, emoji: '🎁', desc: '水果蔬菜精美组合，送礼佳选', tag: '热卖', tagColor: 'bg-red-500' },
  { id: 2, name: '有机蔬菜周套餐', price: 128.00, emoji: '📦', desc: '一周所需蔬菜，营养均衡', tag: '推荐', tagColor: 'bg-green-500' },
  { id: 3, name: '鲜果沙拉组合', price: 89.00, emoji: '🥗', desc: '多种水果完美搭配，健康轻食', tag: '新品', tagColor: 'bg-blue-500' },
  { id: 4, name: '季节限定果篮', price: 299.00, emoji: '🧺', desc: '当季最鲜水果，限量供应', tag: '限量', tagColor: 'bg-purple-500' },
  { id: 5, name: '家庭蔬果大礼包', price: 168.00, emoji: '🏠', desc: '满足全家一周所需', tag: '超值', tagColor: 'bg-amber-500' },
  { id: 6, name: '减脂轻食套餐', price: 98.00, emoji: '💪', desc: '低卡高纤，健身必备', tag: '健康', tagColor: 'bg-teal-500' },
];

export default function Showcase() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-bold text-white">🏪 展示窗口</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">
              精品展示窗口
            </span>
          </h1>
          <p className="text-gray-400 text-lg">精美商品展示，发现更多优质好物</p>
        </div>

        {/* Banner */}
        <div className="mb-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-8 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full mb-4 inline-block">限时特惠</span>
              <h2 className="text-3xl font-bold text-white mb-2">新年大促销</h2>
              <p className="text-gray-300 mb-4">全场套餐8折起，下单即送精美礼品</p>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors">
                立即抢购
              </button>
            </div>
            <div className="text-8xl">🎉</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-40 bg-gradient-to-br from-purple-900/50 to-gray-900 flex items-center justify-center">
                <span className="text-7xl">{item.emoji}</span>
                <span className={`absolute top-4 right-4 px-3 py-1 ${item.tagColor} text-white text-sm rounded-full font-bold`}>
                  {item.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">¥{item.price}</span>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors">
                    立即购买
                  </button>
                </div>
              </div>
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
