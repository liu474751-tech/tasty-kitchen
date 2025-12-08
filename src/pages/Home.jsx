// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden font-sans">
      
      {/* ==================== 第一部分：首屏 Hero 区域 (城市+猫) ==================== */}
      {/* 使用相对定位，因为背景图要撑满这一屏 */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* 1.1 背景层：洪崖洞夜景 */}
        {/* absolute inset-0 让它占满父容器，z-0 放在最底层 */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ 
            backgroundImage: "url('/bg-city.jpg')",
            // 加一个滤镜，让它变暗、有一点模糊，这样文字才看得清
            filter: 'brightness(0.6) blur(2px)'
          }}
        ></div>
        
        {/* 1.2 装饰层：金色光晕叠加 */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-transparent to-amber-900/30 opacity-80"></div>

        {/* 1.3 内容层：文字和猫咪 */}
        <div className="container mx-auto px-6 z-10 relative flex flex-col-reverse md:flex-row items-center h-full py-20">
          
          {/* 左侧文字 */}
          <div className="md:w-1/2 text-center md:text-left space-y-8 mt-10 md:mt-0">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
              <span className="block text-amber-400">构建数字世界的</span>
              <span className="block text-white">匠心与幻想</span>
            </h1>
            <p className="text-xl text-gray-200 md:w-3/4 leading-relaxed drop-shadow-lg">
              欢迎来到我的赛博工坊。在这里，代码是砖石，创意是霓虹，我们一起搭建未来的模样。
            </p>
            <div>
              {/* 一个发光的按钮 */}
               <a href="#works" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.8)] transition-all transform hover:scale-105">
                 探索作品 ↓
               </a>
            </div>
          </div>

          {/* 右侧猫咪看板娘 */}
          <div className="md:w-1/2 flex justify-center items-end md:h-full">
            {/* 让猫咪图片有一种从底部浮现的感觉
               mask-image 是一个高级技巧，让图片底部渐变透明融入背景
            */}
            <img 
              src="/mascot-cat.png" 
              alt="猫咪向导"
              className="max-w-[80%] md:max-w-[60%] object-cover rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-4 border-amber-400/30 relative z-20 animate-float"
              style={{
                 maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            />
             {/* 猫咪背后的光晕装饰 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-amber-500/20 blur-[100px] rounded-full z-10 animate-blob"></div>
          </div>
        </div>

        {/* 底部波浪衔接 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent z-20"></div>
      </div>


      {/* ==================== 第二部分：理念区域 (盆景与禅) ==================== */}
      <div className="py-24 bg-gray-950 relative z-30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 rounded-3xl bg-gray-900/50 p-10 border border-gray-800 backdrop-blur-sm">
            
            {/* 左侧图片：盆景 */}
            <div className="md:w-1/2 relative group">
               {/* 图片框架和光效 */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-700 to-green-800 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src="/zen-work.jpg" 
                alt="禅意工坊" 
                className="relative rounded-2xl shadow-2xl object-cover w-full h-[400px] grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* 右侧文字：理念阐述 */}
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-400">
                代码如盆景，<br/>需慢养，需细修。
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                在喧嚣的数字洪流中，我更愿意守着一方安静的书桌。软件开发不仅仅是功能的堆砌，更是一种像培育盆景一样的艺术。
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                耐心打磨每一个细节，在复杂中寻求简洁与平衡，创造出既实用又具有生命力的作品。这就是我的开发哲学。
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* ==================== 第三部分：作品展示区域 (原来的入口) ==================== */}
      <div id="works" className="py-24 bg-black relative z-30">
         {/* 背景装饰光 */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full"></div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              精选作品
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            
            {/* 卡片 1：Tasty Kitchen */}
            <Link to="/app" className="group relative block h-full">
              <div className="h-full bg-gray-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-amber-300 group-hover:text-white transition-colors">Tasty Kitchen</h3>
                  <span className="text-4xl">🍳</span>
                </div>
                <p className="text-gray-400 mb-8">我一直在维护的经典软件，功能强大，烹饪必备！在这里体验稳定的力量。</p>
                <div className="inline-flex items-center text-amber-400 font-bold group-hover:text-amber-200 transition-colors">
                   启动软件 <span className="ml-2 text-xl transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
            </Link>

            {/* 卡片 2：Coming Soon */}
            <div className="relative block h-full opacity-60 hover:opacity-100 transition-opacity">
              <div className="h-full bg-gray-900/40 border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-300">神秘新企划</h3>
                  <span className="text-4xl grayscale">🚀</span>
                </div>
                <p className="text-gray-500 mb-8">在这个赛博世界的某个角落，新的想法正在孕育中...</p>
                <div className="inline-block px-4 py-2 bg-gray-800 rounded text-gray-500 text-sm">
                   开发中 / Loading...
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="py-10 text-center text-gray-600 bg-black text-sm">
        <p>© 2023 My Software Studio. Built with React & Passion.</p>
      </footer>

    </div>
  );
}
