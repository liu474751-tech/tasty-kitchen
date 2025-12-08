// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OldSoftware from './pages/OldSoftware';

function App() {
  return (
    <Routes>
      {/* 当网址是根目录时，显示新大厅 */}
      <Route path="/" element={<Home />} />

      {/* 当网址是 /app 时，显示老软件 */}
      <Route path="/app/*" element={<OldSoftware />} />
    </Routes>
  );
}

export default App;
