// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OldSoftware from './pages/OldSoftware';
import FreshMarket from './pages/FreshMarket';
import VeggieSoul from './pages/VeggieSoul';

function App() {
  return (
    <Routes>
      {/* 当网址是根目录时，显示新大厅 */}
      <Route path="/" element={<Home />} />

      {/* 当网址是 /app 时，显示老软件 */}
      <Route path="/app/*" element={<OldSoftware />} />

      {/* 新鲜市场 - 蔬菜、水果、展示、外卖整合页面 */}
      <Route path="/market" element={<FreshMarket />} />

      {/* 蔬菜灵魂图鉴 - 创意功能展示 */}
      <Route path="/soul" element={<VeggieSoul />} />
    </Routes>
  );
}

export default App;
