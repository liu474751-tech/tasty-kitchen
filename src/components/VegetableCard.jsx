// src/components/VegetableCard.jsx
// 蔬菜灵魂卡片组件 - 液态玻璃质感 (Liquid Glass Cards)
// 集成形态学算法 (Morphology.js) 和呼吸动画

import React, { useState } from 'react';
import { getVegetableMorphology, getMorphologyHoverStyle } from '../utils/Morphology';
import { FEATURES } from '../config/features';

/**
 * 蔬菜灵魂卡片 - 2026 液态玻璃设计
 * @param {Object} veg - 蔬菜数据对象（来自 vegetableSoulList）
 * @param {Function} onClick - 点击回调
 * @param {boolean} isCyberMode - 是否为赛博模式（霓虹风格）
 * @param {boolean} showLastWords - 是否显示遗言预览
 */
export const VegetableCard = ({ veg, onClick, isCyberMode = false, showLastWords = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 苹果风格的"微光边框"和"深度阴影" - 液态玻璃质感
  const cardBase = isCyberMode
    ? "bg-gray-800/40 border-white/5 hover:bg-gray-800/60 hover:border-green-500/30 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    : "bg-white/60 border-white/60 hover:bg-white/80 hover:border-green-500/30 text-gray-800 shadow-[0_8px_32px_rgba(100,100,111,0.1)]";

  // 获取形态学样式
  const morphologyStyle = getVegetableMorphology(veg.type, veg.latin);
  const hoverStyle = isHovered ? getMorphologyHoverStyle(veg.type) : {};

  // 合并样式 + 悬浮投影
  const imageContainerStyle = {
    ...morphologyStyle,
    ...hoverStyle,
    filter: isCyberMode 
      ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' 
      : 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group rounded-[2rem] p-5 border backdrop-blur-xl 
        transition-all duration-500 ease-out 
        hover:-translate-y-2 hover:shadow-2xl 
        cursor-pointer overflow-hidden 
        ${cardBase}
      `}
    >
      {/* 内部高光流光特效 (Shimmer Effect) */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-full group-hover:translate-x-full"
        style={{ transitionDuration: '1.5s' }}
      />

      {/* 蔬菜形态容器 */}
      <div 
        className={`
          w-full aspect-square mb-5 relative z-10 
          ${FEATURES.BREATHING_EFFECT ? 'animate-breathe' : ''}
        `}
        style={imageContainerStyle}
      >
        <img 
          src={veg.img} 
          className="w-full h-full object-cover" 
          alt={veg.name}
          loading="lazy"
        />
        
        {/* 赛博模式下的霓虹光晕 */}
        {isCyberMode && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* 蔬菜信息 - 居中布局 */}
      <div className="relative z-10 text-center">
        <h3 className="font-bold text-lg tracking-tight mb-1">
          {veg.name}
        </h3>
        <p className="text-[10px] font-medium uppercase tracking-widest opacity-60 mb-3">
          {veg.mbti} · {veg.zodiac}
        </p>
        
        {/* 性格描述 */}
        {showLastWords && veg.personality && (
          <p className="text-xs opacity-70 line-clamp-1 mb-3">
            {veg.personality}
          </p>
        )}

        {/* 仿 Samsung One UI 的药丸按钮 */}
        <button 
          className={`
            w-full py-3 rounded-xl text-xs font-bold 
            transition-all active:scale-95 
            flex items-center justify-center gap-2
            ${isCyberMode 
              ? 'bg-white/5 hover:bg-green-500 hover:text-black border border-white/10' 
              : 'bg-black/5 hover:bg-green-500 hover:text-white border border-black/5'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <span>¥5.00</span>
          <span className="opacity-50">|</span>
          <span>领养</span>
        </button>
      </div>

      {/* 赛博模式下的底部霓虹线 */}
      {isCyberMode && (
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

/**
 * 蔬菜卡片网格布局
 * @param {Array} vegetables - 蔬菜数组
 * @param {Function} onCardClick - 卡片点击回调
 * @param {boolean} isCyberMode - 赛博模式
 */
export const VegetableCardGrid = ({ vegetables, onCardClick, isCyberMode = false }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {vegetables.map((veg) => (
        <VegetableCard
          key={veg.id}
          veg={veg}
          onClick={() => onCardClick?.(veg)}
          isCyberMode={isCyberMode}
        />
      ))}
    </div>
  );
};

export default VegetableCard;
