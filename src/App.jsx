import React, { useState, useMemo, useEffect, useRef } from 'react';
// Lightweight emoji-based inline icon fallbacks (avoid ESM build issues)
const Icon = ({ emoji, size = 16, className = '', style = {} }) => (
  <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block', ...style }}>{emoji}</span>
);
const Search = (p) => <Icon emoji="🔍" {...p} />;
const ChefHat = (p) => <Icon emoji="👨‍🍳" {...p} />;
const Clock = (p) => <Icon emoji="⏱️" {...p} />;
const Flame = (p) => <Icon emoji="🔥" {...p} />;
const Heart = (p) => <Icon emoji="❤️" {...p} />;
const ChevronLeft = (p) => <Icon emoji="◀" {...p} />;
const Users = (p) => <Icon emoji="👥" {...p} />;
const CheckCircle = (p) => <Icon emoji="✔️" {...p} />;
const Home = (p) => <Icon emoji="🏠" {...p} />;
const Bookmark = (p) => <Icon emoji="🔖" {...p} />;
const ArrowRight = (p) => <Icon emoji="➡️" {...p} />;
const Trophy = (p) => <Icon emoji="🏆" {...p} />;
const Gamepad2 = (p) => <Icon emoji="🎮" {...p} />;
const Video = (p) => <Icon emoji="🎥" {...p} />;
const Upload = (p) => <Icon emoji="📤" {...p} />;
const Lock = (p) => <Icon emoji="🔒" {...p} />;
const Unlock = (p) => <Icon emoji="🔓" {...p} />;
const Zap = (p) => <Icon emoji="⚡" {...p} />;
const Loader2 = (p) => <Icon emoji="⏳" {...p} />;
const PlayCircle = (p) => <Icon emoji="▶️" {...p} />;
const Crown = (p) => <Icon emoji="👑" {...p} />;
const Map = (p) => <Icon emoji="🗺️" {...p} />;
const Coins = (p) => <Icon emoji="🪙" {...p} />;
const LayoutGrid = (p) => <Icon emoji="🔳" {...p} />;
const X = (p) => <Icon emoji="✖" {...p} />;
const RefreshCw = (p) => <Icon emoji="🔄" {...p} />;
const Skull = (p) => <Icon emoji="💀" {...p} />;
const AlertTriangle = (p) => <Icon emoji="⚠️" {...p} />;
const ThumbsDown = (p) => <Icon emoji="👎" {...p} />;
const Scroll = (p) => <Icon emoji="📜" {...p} />;
const Sparkles = (p) => <Icon emoji="✨" {...p} />;
const Ghost = (p) => <Icon emoji="👻" {...p} />;
const Biohazard = (p) => <Icon emoji="☣️" {...p} />;
const Robot = (p) => <Icon emoji="🤖" {...p} />;
const Film = (p) => <Icon emoji="🎞️" {...p} />;
const MessageSquare = (p) => <Icon emoji="💬" {...p} />;
const Send = (p) => <Icon emoji="📩" {...p} />;
const ShieldCheck = (p) => <Icon emoji="🛡️" {...p} />;
const Eye = (p) => <Icon emoji="👁️" {...p} />;
const EyeOff = (p) => <Icon emoji="🙈" {...p} />;
const User = (p) => <Icon emoji="👤" {...p} />;
const Utensils = (p) => <Icon emoji="🍴" {...p} />;
const Download = (p) => <Icon emoji="⬇️" {...p} />;
const Brush = (p) => <Icon emoji="🖌️" {...p} />;
const Sliders = (p) => <Icon emoji="🎚️" {...p} />;
const Plus = (p) => <Icon emoji="➕" {...p} />;
const Check = (p) => <Icon emoji="✅" {...p} />;
const Coffee = (p) => <Icon emoji="☕" {...p} />;
const Palette = (p) => <Icon emoji="🎨" {...p} />;
const Type = (p) => <Icon emoji="🔤" {...p} />;

// API key disabled by default (preview environment)
const apiKey = ""; // import.meta.env.VITE_GEMINI_API_KEY || "";

// --- localStorage keys for demo persistence
const USERS_KEY = 'tk_users';
const SESSION_KEY = 'tk_session';

const loadUsersFromStorage = () => {
  try { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};

// convert plaintext passwords to sha256 on first load for safety.
const isHashed = (pw) => typeof pw === 'string' && /^[0-9a-f]{64}$/.test(pw);
async function hashPassword(pw) {
  if (!pw) return '';
  const enc = new TextEncoder().encode(pw);
  const hash = await window.crypto.subtle.digest('SHA-256', enc);
  const arr = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return arr;
}

const ChallengeTab = ({ userProfile, onStartLevel, onUnlockLevel }) => {
  const [mode, setMode] = useState('chinese');
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const config = CUISINE_CONFIG[mode];
  const currentChapter = selectedChapterId ? config.find(c => c.id === selectedChapterId) : null;
  const currentChapterProgress = currentChapter ? (userProfile.completedLevels[currentChapter.id] || 0) : 0;

  if (!selectedChapterId) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="max-w-6xl mx-auto w-full px-6 pt-6">
          <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 flex gap-2">
            <button onClick={() => setMode('chinese')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'chinese' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              <LayoutGrid size={18} /> 神州八膳雅集
            </button>
            <button onClick={() => setMode('western')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'western' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Map size={18} /> 欧罗巴盛宴
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {config.map(chapter => {
              const progress = userProfile.completedLevels[chapter.id] || 0;
              const total = chapter.range[1] - chapter.range[0] + 1;
              return (
                <div key={chapter.id} onClick={() => setSelectedChapterId(chapter.id)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md active:scale-95 transition-all cursor-pointer group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${chapter.color}`}></div>
                  <div className="text-3xl mb-3">{chapter.icon}</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{chapter.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{chapter.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-orange-500 font-bold bg-orange-50 w-fit px-3 py-1.5 rounded-full">
                    <Trophy size={14} /><span>Lv.{progress} / {total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-slate-50">
       <div className={`px-5 pt-12 pb-6 shadow-sm z-10 sticky top-0 bg-gradient-to-r ${currentChapter.color} text-white`}><button onClick={() => setSelectedChapterId(null)} className="absolute top-12 left-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"><ChevronLeft size={24} /></button><div className="mt-8"><div className="flex items-center gap-2 mb-1"><span className="text-3xl">{currentChapter.icon}</span><h2 className="text-2xl font-bold">{currentChapter.name}</h2></div></div></div>
       <div className="flex-1 overflow-y-auto p-5 pb-24"><div className="space-y-4 relative"><div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>{Array.from({ length: 10 }).map((_, idx) => { const levelNum = idx + 1; const relativeLevel = levelNum; const isCompleted = relativeLevel <= currentChapterProgress; const isCurrent = relativeLevel === currentChapterProgress + 1; const isLocked = relativeLevel > currentChapterProgress + 1; const realRecipe = RECIPES.find(r => r.cuisine === currentChapter.id && r.level === relativeLevel); const canUnlock = isLocked && realRecipe; return (<div key={levelNum} className="relative z-10 flex gap-4"><div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' : isCurrent ? 'bg-orange-500 border-orange-200 text-white ring-4 ring-orange-100' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>{isCompleted ? <CheckCircle size={16} /> : <span>{levelNum}</span>}</div><div className={`flex-1 rounded-xl p-4 border transition-all ${isLocked ? 'bg-white border-gray-100' : 'bg-white border-gray-200 shadow-sm'}`}><div className="flex justify-between items-start mb-1"><h4 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{realRecipe ? realRecipe.title : `基本功练习 ${levelNum}`}</h4>{isLocked && <Lock size={14} className="text-gray-300" />}</div>{isCurrent && (<button onClick={() => realRecipe && onStartLevel(realRecipe)} className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-md shadow-orange-200 active:scale-95 transition-transform">开始挑战</button>)}{canUnlock && (<div className="mt-3 bg-gray-50 rounded-lg p-2 flex items-center justify-between"><div className="text-xs text-gray-500">此关包含食谱<br/>可消耗积分提前解锁</div><button onClick={() => onUnlockLevel(currentChapter.id, relativeLevel, realRecipe.title)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md border border-indigo-100 flex items-center gap-1 active:scale-95"><Zap size={12} fill="currentColor" />兑换</button></div>)}</div></div>); })}</div></div>
    </div>
  );
};

const SocialTab = () => {
  const [tab, setTab] = useState('feed');
  const [showEvilGuide, setShowEvilGuide] = useState(false);
  const homemadePosts = useMemo(() => SOCIAL_POSTS.filter(post => post.type === 'homemade' && post.tags?.includes('难吃')).sort((a, b) => b.likes - a.likes), []);
  const laobaSpecial = homemadePosts.length > 0 ? homemadePosts[0] : null;
  const top10List = homemadePosts.slice(1, 10);
  const otherHomemade = SOCIAL_POSTS.filter(p => p.type === 'homemade' && !homemadePosts.slice(0, 10).find(top => top.id === p.id));

  return (
    <div className="bg-gray-50 h-full flex flex-col pb-20">
      <div className="max-w-6xl mx-auto w-full px-6 pt-6">
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-1 flex gap-2">
          <button onClick={() => setTab('feed')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'feed' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            美食圈动态
          </button>
          <button onClick={() => setTab('homemade')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${tab === 'homemade' ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab === 'homemade' && <Skull size={16} className="animate-pulse"/>} 自制美食栏
          </button>
          <button onClick={() => setTab('ranking')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'ranking' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            本周榜单
          </button>
        </div>

        <div className="pb-24">
          {tab === 'feed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SOCIAL_POSTS.filter(p => p.type === 'normal').map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}
          {tab === 'homemade' && (
            <div className="space-y-6">
              <div onClick={() => setShowEvilGuide(true)} className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 flex items-center justify-between shadow-xl cursor-pointer border border-purple-500/30 group hover:scale-[1.01] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300 group-hover:animate-spin">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      邪修炼丹炉 <span className="bg-purple-600 text-[10px] px-2 py-0.5 rounded text-white">AI Powered</span>
                    </h3>
                    <p className="text-purple-400 text-sm">输入奇怪食材 · AI 生成黑暗配方</p>
                  </div>
                </div>
                <ChevronLeft className="text-white rotate-180" size={24} />
              </div>

              {laobaSpecial && (
                <div className="relative bg-gray-900 rounded-2xl p-8 overflow-hidden shadow-2xl shadow-purple-900/30 text-white border-2 border-purple-500/50">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Skull size={200} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Crown size={12} fill="currentColor" /> No.1 老八套餐
                      </span>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-400 shrink-0">
                        <img src={laobaSpecial.image} className="w-full h-full object-cover" alt={laobaSpecial.title} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2">{laobaSpecial.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                          <img src={laobaSpecial.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
                          {laobaSpecial.user}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-blue-500" /> 其他自制投稿
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherHomemade.map(post => <PostCard key={post.id} post={post} isHomemade={true} />)}
                </div>
              </div>
            </div>
          )}
          {tab === 'ranking' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-orange-100 text-orange-800 text-sm p-4 rounded-xl mb-6 text-center border border-orange-200 font-medium">
                🔥 每7天刷新榜单，距离下一次刷新还有 2 天
              </div>
              {RANKING.map((user, idx) => <RankingCard key={idx} user={user} idx={idx} />)}
            </div>
          )}
        </div>
      </div>
      {showEvilGuide && <EvilGuideModal onClose={() => setShowEvilGuide(false)} />}
    </div>
  );
};

// --- Deploy Modal Component ---
const DeployModal = ({ isOpen, onClose, recipes, onDeploy, currentPrompt }) => {
  if (!isOpen) return null;

  const sortedRecipes = useMemo(() => {
      const matches = [];
      const others = [];
      recipes.forEach(r => {
          if (currentPrompt && currentPrompt.includes(r.title)) {
              matches.push(r);
          } else {
              others.push(r);
          }
      });
      return [...matches, ...others];
  }, [recipes, currentPrompt]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg flex items-center gap-2"><Zap size={18} className="text-orange-500"/> 部署到食材</h3>
                <button onClick={onClose}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 text-xs px-4">
                选择一道菜，将刚刚生成的图片设为它的封面。
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {sortedRecipes.map(recipe => (
                    <div 
                        key={recipe.id}
                        onClick={() => onDeploy(recipe.id)}
                        className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors border-b border-gray-50 last:border-0 group"
                    >
                        <img src={recipe.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt={recipe.title} />
                        <div className="flex-1">
                            <div className="font-bold text-gray-800 group-hover:text-orange-600">{recipe.title}</div>
                            <div className="text-xs text-gray-400">{recipe.category === 'chinese' ? '中餐' : '西餐'} · Lv.{recipe.level}</div>
                        </div>
                        <div className="text-gray-300 group-hover:text-orange-500"><ArrowRight size={18}/></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- Canvas Editor Component ---
const CanvasEditor = ({ initialImage, onClose }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); 
  const [color, setColor] = useState('#ffffff'); 
  const [brushSize, setBrushSize] = useState(5);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
    const img = new Image();
    img.src = initialImage;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxW = 800;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [initialImage]);

  const startDrawing = (e) => { if (tool !== 'brush') return; const { offsetX, offsetY } = e.nativeEvent; ctx.beginPath(); ctx.moveTo(offsetX, offsetY); setIsDrawing(true); };
  const draw = (e) => { if (!isDrawing || tool !== 'brush') return; const { offsetX, offsetY } = e.nativeEvent; ctx.lineTo(offsetX, offsetY); ctx.strokeStyle = color; ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.stroke(); };
  const stopDrawing = () => { if (isDrawing) { ctx.closePath(); setIsDrawing(false); } };
  const addText = () => { if (!textInput) return; ctx.font = `bold ${brushSize * 5}px "Microsoft YaHei", Arial`; ctx.fillStyle = color; ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4; ctx.fillText(textInput, textPos.x, textPos.y); ctx.shadowBlur = 0; setShowTextInput(false); setTextInput(''); };
  const downloadImage = () => { const link = document.createElement('a'); link.download = `food-${Date.now()}.png`; link.href = canvasRef.current.toDataURL(); link.click(); };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col animate-fade-in" style={{ backgroundColor: '#111827', color: 'white' }}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700" style={{ backgroundColor: '#1f2937' }}>
        <div className="flex items-center gap-4"><button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><X size={24} /></button><h2 className="font-bold text-lg">图片精修</h2></div>
        <button onClick={downloadImage} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"><Download size={18} /> 保存</button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-20 flex flex-col items-center py-6 gap-6 border-r border-gray-700" style={{ backgroundColor: '#1f2937' }}>
            <button onClick={() => setTool('brush')} className={`p-3 rounded-xl transition-all ${tool === 'brush' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}><Brush size={24} /><span className="text-[10px] block mt-1">画笔</span></button>
            <button onClick={() => setShowTextInput(true)} className={`p-3 rounded-xl transition-all ${tool === 'text' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}><Type size={24} /><span className="text-[10px] block mt-1">加字</span></button>
            <div className="flex flex-col gap-3 mt-4">{['#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#84cc16'].map(c => (<button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}</div>
        </div>
        <div className="flex-1 flex items-center justify-center relative overflow-auto p-8" style={{ backgroundColor: '#0f172a' }}>
            <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} className="shadow-2xl cursor-crosshair" />
            {showTextInput && (<div className="absolute top-10 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-xl border border-gray-700 flex gap-2 animate-fade-in" style={{ backgroundColor: '#1f2937' }}><input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="输入中文菜名..." className="text-white px-3 py-2 rounded-lg outline-none border border-gray-600 focus:border-orange-500" style={{ backgroundColor: '#374151' }} autoFocus /><button onClick={addText} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg"><Check size={20}/></button></div>)}
        </div>
        <div className="w-64 border-l border-gray-700 p-6" style={{ backgroundColor: '#1f2937' }}>
            <label className="text-gray-400 text-sm font-bold mb-3 block flex items-center gap-2"><Sliders size={16}/> 大小调整</label>
            <input type="range" min="1" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
            <div className="text-right text-gray-500 text-xs mt-2">{brushSize}px</div>
        </div>
      </div>
    </div>
  );
};

// --- AI Kitchen Tab Component ---
const AIKitchenTab = ({ recipes, onUpdateRecipe }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const styleConfig = STYLES.find(s => s.id === selectedStyle);
      const stylePrompt = styleConfig ? styleConfig.prompt : "";
      const resultUrl = await generateFreeImage(prompt, stylePrompt);
      setGeneratedImage(resultUrl);
    } catch (error) {
      alert(`出锅失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = (recipeId) => {
      if (generatedImage) {
          onUpdateRecipe(recipeId, generatedImage);
          setShowDeployModal(false);
          alert("部署成功！该菜品的封面已更新。");
      }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setEditingImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-5 pt-6 h-full flex flex-col">
      {editingImage && <CanvasEditor initialImage={editingImage} onClose={() => setEditingImage(null)} />}
      {showDeployModal && <DeployModal isOpen={true} onClose={() => setShowDeployModal(false)} recipes={recipes} onDeploy={handleDeploy} currentPrompt={prompt} />}

      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ChefHat size={28} /> AI 智能厨房</h2>
          <p className="text-white/90 text-sm mt-2">输入菜名生成图片，满意后点击"应用"，直接更新到您的食谱封面！</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 pb-24">
          <div className="flex flex-col gap-6">
             <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">想吃点什么？</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="例如：番茄炒蛋，色泽红润，汤汁浓郁..." className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-orange-500 h-32 resize-none text-base" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Flame size={16} className="text-orange-500"/> 选择风格</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {STYLES.map(style => (
                            <button key={style.id} onClick={() => setSelectedStyle(style.id)} className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left truncate ${selectedStyle === style.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{style.name}</button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleGenerate} disabled={isLoading || !prompt} className="flex-1 py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Utensils />} {isLoading ? 'AI 正在烹饪...' : '立即出餐'}
                    </button>
                    <label className="px-4 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors text-gray-600 flex items-center justify-center"><Upload size={20} /><input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} /></label>
                </div>
             </div>
          </div>

          <div className="flex flex-col h-full min-h-[400px]">
              <div className={`flex-1 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden relative flex items-center justify-center shadow-inner group ${isLoading ? 'animate-pulse' : ''}`}>
                  {generatedImage ? (
                      <>
                          <img src={generatedImage} className="w-full h-full object-contain" alt="Generated" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                              <button onClick={() => setEditingImage(generatedImage)} className="bg-white text-black px-5 py-2 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm"><Brush size={16} /> 修图</button>
                              <button onClick={() => setShowDeployModal(true)} className="bg-orange-500 text-white px-5 py-2 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm shadow-lg"><Zap size={16} fill="currentColor" /> 应用</button>
                              <a href={generatedImage} download="food.png" className="bg-black/50 text-white px-4 py-2 rounded-full font-bold hover:bg-black/70 transition-colors flex items-center justify-center"><Download size={18} /></a>
                          </div>
                      </>
                  ) : (
                      <div className="text-center text-gray-400"><Coffee size={64} className="mx-auto mb-4 opacity-50" /><p>等待上菜...</p></div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

// --- RecipeDetail component (added/used by App) ---
const RecipeDetail = ({ recipe, onBack, onComplete }) => {
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center md:py-10">
      <div className="bg-white w-full max-w-3xl md:rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-72">
          <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
          <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-md transition-colors">
            <ChevronLeft size={28} />
          </button>
        </div>

        <div className="px-6 md:px-12 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            <span className="text-orange-500 font-bold bg-orange-50 px-4 py-1.5 rounded-full text-sm w-fit">{recipe.calories}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Clock className="mx-auto mb-1 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.time}</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Flame className="mx-auto mb-1 text-red-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.difficulty}</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <ChefHat className="mx-auto mb-1 text-blue-400" size={24} />
              <span className="text-sm font-medium text-gray-600">{recipe.level === 0 ? '基础' : `Lv.${recipe.level}`}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>食材清单
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="flex justify-between text-base border-b border-gray-200/50 pb-2 last:border-0">
                    <span className="text-gray-600">{ing.name}</span>
                    <span className="font-bold text-gray-800">{ing.amount}{ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>烹饪步骤
            </h3>
            <ol className="space-y-4">
              {recipe.steps?.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-base leading-relaxed text-gray-800 pt-1">{s}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <button onClick={() => setShowVideo(true)} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-md">
              查看示范视频
            </button>
            <button onClick={() => setShowChat(true)} className="md:w-auto py-3 px-6 bg-indigo-50 text-indigo-600 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">
              向 AI 咨询
            </button>
          </div>

          <button onClick={() => onComplete(recipe)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
            ✅ 完成烹饪并返回
          </button>
        </div>

        {showChat && <AIChatModal recipe={recipe} onClose={() => setShowChat(false)} />}
        {showVideo && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-black rounded-xl overflow-hidden w-full max-w-3xl">
              <div className="flex items-center justify-between p-3 border-b border-black/30">
                <div className="text-white font-bold">示范视频</div>
                <button onClick={() => setShowVideo(false)} className="text-gray-300 p-1 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 bg-black">
                <div className="w-full aspect-video bg-gray-900">
                  <video src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4" controls className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
const LoginCard = ({ defaultUsername = 'liu474751-tech', defaultPassword = '200283', onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState('');
  const passwordRef = useRef();
  const [isBusy, setIsBusy] = useState(false);

  const doLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('用户名或密码不能为空');
      return;
    }
    setIsBusy(true);
    const ok = await onLogin(username.trim(), password);
    if (!ok) {
      setError('登录失败，用户名或密码错误');
      setPassword('');
      // focus password for retry
      setTimeout(() => passwordRef.current?.focus(), 50);
    }
    setIsBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2"><img src="/favicon.svg" alt="logo" /></div>
          <h2 className="font-bold text-orange-500">美味厨房</h2>
          <div className="text-xl font-extrabold mt-2">登录</div>
        </div>
        <div className="space-y-3 mb-3">
          <div>
            <label className="text-xs text-gray-500">用户名</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500">密码</label>
            <input ref={passwordRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2 items-center">
            <button onClick={doLogin} disabled={isBusy} className="flex-1 py-3 bg-orange-500 text-white rounded">{isBusy ? '登录中...' : '登录'}</button>
            <button onClick={onRegisterClick} className="py-2 px-3 border rounded text-gray-600">注册</button>
          </div>
          <div className="text-xs text-gray-400 mt-1">默认用户名: <span className="font-medium">liu474751-tech</span> 密码：<span className="font-medium">200283</span></div>
        </div>
      </div>
    </div>
  );
};

const RegisterModal = ({ onClose, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s += 1;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const doRegister = () => {
    setError('');
    if (!username.trim() || !password.trim()) { setError('用户名/密码不能为空'); return; }
    if (password.length < 6) { setError('密码至少6位，请设置更长的密码'); return; }
    const ok = onRegister(username.trim(), password);
    if (!ok) { setError('用户名已存在，请更换'); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-3 text-lg font-bold">注册</div>
          <div className="space-y-3">
          <div><label className="text-xs text-gray-500">用户名</label><input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" /></div>
          <div>
            <label className="text-xs text-gray-500">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 bg-gray-100 rounded" />
            <div className="mt-1 text-xs text-gray-400">密码强度: <span className="font-medium">{strength <= 1 ? '弱' : strength === 2 ? '中' : '强'}</span></div>
            <div className="w-full h-1 bg-gray-200 rounded mt-1 overflow-hidden"><div style={{ width: `${strength * 25}%` }} className={`h-full ${strength >= 3 ? 'bg-green-500' : strength === 2 ? 'bg-yellow-400' : 'bg-red-400'}`} /></div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2"><button onClick={doRegister} className="flex-1 py-2 bg-indigo-600 text-white rounded">注册</button><button onClick={onClose} className="py-2 px-3 border rounded">取消</button></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // user store (username -> password) persisted to localStorage (demo)
  const [users, setUsers] = useState(() => {
    const fromStorage = loadUsersFromStorage();
    return fromStorage || { 'liu474751-tech': '200283' };
  });

  // Global back handler
  const handleGlobalBack = () => {
    if (selectedRecipe) {
      // 如果在菜谱详情页，返回到主页面
      setSelectedRecipe(null);
    } else if (activeTab !== 'home') {
      // 如果不在首页，返回首页
      setActiveTab('home');
    } else {
      // 如果已经在首页，退出登录
      onLogout();
    }
  };

  // Add keyboard shortcut for back (ESC or Backspace)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' || (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
        handleGlobalBack();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedRecipe, activeTab]);

  // when app mounts, ensure all passwords are hashed
  useEffect(() => {
    const normalize = async () => {
      // Load directly from storage to avoid stale closure during mount
      const stored = loadUsersFromStorage() || users;
      let changed = false;
      const next = { ...stored };
      for (const [u, p] of Object.entries(next)) {
        if (!isHashed(p)) {
          next[u] = await hashPassword(p);
          changed = true;
        }
      }
      if (changed) {
        setUsers(next);
        saveUsersToStorage(next);
      }
    };
    normalize();
  }, []);

  const [userProfile, setUserProfile] = useState({
    name: "liu474751-tech", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix", points: 1250, titles: ["难吃终结者"], monthlyUnlocks: 0,
    completedLevels: { lu: 0, chuan: 0, yue: 0, su: 0, min: 0, zhe: 0, xiang: 0, hui: 0, french: 0, italian: 0, spanish: 0, central: 0, nordic: 0 },
    unlockedExtra: []
  });

  const [unlockedRecipes, setUnlockedRecipes] = useState(() => RECIPES.filter(r => r.level === 0));
  const [unlockModal, setUnlockModal] = useState({ isOpen: false, cuisine: null, level: null, cost: 0, title: '' });

  const handleStartLevel = (recipe) => setSelectedRecipe(recipe);
  const handleComplete = (recipe) => {
    setSelectedRecipe(null);
    setActiveTab('home');
    const currentProgress = userProfile.completedLevels?.[recipe.cuisine] || 0;
    if (recipe.level === currentProgress + 1) {
      setUserProfile(prev => ({ ...prev, points: prev.points + 100, completedLevels: { ...prev.completedLevels, [recipe.cuisine]: (prev.completedLevels?.[recipe.cuisine] || 0) + 1 } }));
    }
    if (!unlockedRecipes.find(r => r.id === recipe.id)) setUnlockedRecipes([...unlockedRecipes, recipe]);
  };

  const onUnlockLevelClick = (cuisineId, level, title) => setUnlockModal({ isOpen: true, cuisine: cuisineId, level: level, cost: 300 * (userProfile.monthlyUnlocks + 1), title: title });

  const confirmUnlock = () => {
    const { cuisine, level, cost } = unlockModal;
    setUserProfile(prev => ({ ...prev, points: prev.points - cost, monthlyUnlocks: prev.monthlyUnlocks + 1, completedLevels: { ...prev.completedLevels, [cuisine]: Math.max(prev.completedLevels?.[cuisine] ?? 0, level) } }));
    const recipe = RECIPES.find(r => r.cuisine === cuisine && r.level === level);
    if (recipe && !unlockedRecipes.find(r => r.id === recipe.id)) setUnlockedRecipes(prev => [...prev, recipe]);
    setUnlockModal({ isOpen: false, cuisine: null, level: null, cost: 0, title: '' });
  };

  const handleUpdateRecipeImage = (recipeId, newImageUrl) => {
    setUnlockedRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, image: newImageUrl } : r));
  };

  const renderContent = () => {
    if (activeTab === 'home') return <HomeTab unlockedRecipes={unlockedRecipes} onRecipeClick={setSelectedRecipe} userProfile={userProfile} />;
    if (activeTab === 'challenge') return <ChallengeTab userProfile={userProfile} onStartLevel={handleStartLevel} onUnlockLevel={onUnlockLevelClick} />;
    if (activeTab === 'social') return <SocialTab />;
    if (activeTab === 'ai-kitchen') return <AIKitchenTab recipes={unlockedRecipes} onUpdateRecipe={handleUpdateRecipeImage} />;
    return null;
  };
  if (selectedRecipe) return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} onComplete={handleComplete} />;

  // login handler
  const onLogin = async (username, password) => {
    const hashed = await hashPassword(password);
    // Accept both hashed or raw stored (in case normalization hasn't finished yet)
    if (users[username] && (users[username] === hashed || users[username] === password)) {
      setIsLoggedIn(true);
      setUserProfile(prev => ({ ...prev, name: username }));
      saveSession(username);
      return true;
    }
    return false;
  };

  const onLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setUserProfile(prev => ({ ...prev, name: 'liu474751-tech' }));
  };

  const onRegister = async (username, password) => {
    if (users[username]) return false; // already exists
    const hashed = await hashPassword(password);
    setUsers(prev => {
      const next = { ...prev, [username]: hashed };
      saveUsersToStorage(next);
      return next;
    });
    // Auto-login and persist session
    setIsLoggedIn(true);
    setUserProfile(prev => ({ ...prev, name: username }));
    saveSession(username);
    return true;
  };

  // persist users changes
  useEffect(() => { saveUsersToStorage(users); }, [users]);

  // attempt auto-login on app mount if session exists
  useEffect(() => {
    const session = loadSession();
    if (session && session.username && users[session.username]) {
      setIsLoggedIn(true);
      setUserProfile(prev => ({ ...prev, name: session.username }));
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginCard defaultUsername="liu474751-tech" defaultPassword="200283" onLogin={onLogin} onRegisterClick={() => setShowRegister(true)} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 p-6">
        <div className="flex items-center gap-2 text-2xl font-extrabold text-orange-600 mb-10 px-2">
          <ChefHat size={32} /> 美味厨房
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'home' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Home size={20} /> 首页大厅
          </button>
          <button onClick={() => setActiveTab('challenge')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'challenge' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Map size={20} /> 厨艺征途
          </button>
          <button onClick={() => setActiveTab('social')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'social' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={20} /> 美食圈
          </button>
          <button onClick={() => setActiveTab('ai-kitchen')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'ai-kitchen' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Robot size={20} /> AI 厨房
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'favorites' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Bookmark size={20} /> 我的收藏
          </button>
        </nav>
        <div className="border-t pt-4 mt-4">
          <div className="px-4 py-2 text-sm text-gray-600 mb-2">
            <div className="font-bold">{userProfile.name}</div>
            <div className="text-xs text-gray-400">积分: {userProfile.points}</div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 font-medium transition-colors rounded-lg hover:bg-red-50">
            <span>🚪</span> 退出登录
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white px-5 pt-4 pb-2 flex justify-between items-center shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={handleGlobalBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            {selectedRecipe ? '菜谱详情' : activeTab === 'challenge' ? '厨艺征途' : activeTab === 'social' ? '美食圈' : activeTab === 'ai-kitchen' ? 'AI 智能厨房' : activeTab === 'favorites' ? '我的收藏' : '美味厨房'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600">{userProfile.name}</div>
          <button onClick={onLogout} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">退出</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-30 shrink-0">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Home size={24} /><span className="text-[10px]">首页</span>
        </button>
        <button onClick={() => setActiveTab('challenge')} className={`flex flex-col items-center gap-1 ${activeTab === 'challenge' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Map size={24} /><span className="text-[10px]">征途</span>
        </button>
        <button onClick={() => setActiveTab('ai-kitchen')} className={`flex flex-col items-center gap-1 ${activeTab === 'ai-kitchen' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Robot size={24} /><span className="text-[10px]">AI厨房</span>
        </button>
        <button onClick={() => setActiveTab('social')} className={`flex flex-col items-center gap-1 ${activeTab === 'social' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Users size={24} /><span className="text-[10px]">美食圈</span>
        </button>
        <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-1 ${activeTab === 'favorites' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Bookmark size={24} /><span className="text-[10px]">收藏</span>
        </button>
      </div>

      <UnlockModal isOpen={unlockModal.isOpen} onClose={() => setUnlockModal({ ...unlockModal, isOpen: false })} onConfirm={confirmUnlock} cost={unlockModal.cost} title={unlockModal.title} monthlyLeft={3 - userProfile.monthlyUnlocks} userPoints={userProfile.points} />
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={onRegister} />}
      
      {/* Global Floating Back Button (Desktop - always visible) */}
      <button 
        onClick={handleGlobalBack}
        className="hidden md:flex fixed bottom-8 left-8 w-14 h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 z-50 group"
        title={selectedRecipe ? '返回列表' : activeTab !== 'home' ? '返回首页' : '退出登录'}
      >
        <ChevronLeft size={24} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
      </button>
      
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
