// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      {/* 标题区 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">我的软件工作室</h1>
        <p className="text-gray-600">探索我开发的实用工具与创意项目</p>
      </div>

      {/* 卡片展示区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* 卡片 1：指向老软件 */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Tasty Kitchen</h2>
          <p className="text-gray-500 mb-4">这是我一直在维护的经典软件，功能强大且好用。</p>
          <Link 
            to="/app" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            打开软件
          </Link>
        </div>

        {/* 卡片 2：画饼区 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 opacity-75">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">神秘新软件</h2>
          <p className="text-gray-500 mb-4">正在紧锣密鼓地开发中，敬请期待...</p>
          <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
            即将上线
          </button>
        </div>

      </div>
    </div>
  );
}
