// src/components/VegetableCard.jsx
// 蔬菜灵魂卡片组件
// 集成形态学算法 (Morphology.js) 和呼吸动画

import React, { useState } from 'react';
import { getVegetableMorphology, getMorphologyHoverStyle } from '../utils/Morphology';
import { FEATURES } from '../config/features';

/**
 * 蔬菜灵魂卡片
 * @param {Object} veg - 蔬菜数据对象（来自 vegetableSoulList）
 * @param {Function} onClick - 点击回调
 * @param {boolean} isCyberMode - 是否为赛博模式（霓虹风格）
 * @param {boolean} showLastWords - 是否显示遗言预览
 */
export const VegetableCard = ({ veg, onClick, isCyberMode = false, showLastWords = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 根据模式调整样式
  const borderColor = isCyberMode ? 'border-white/10' : 'border-green-800/10';
  const bgColor = isCyberMode ? 'bg-[#111827]' : 'bg-white';
  const textColor = isCyberMode ? 'text-gray-300' : 'text-gray-600';
  const nameColor = isCyberMode ? 'text-white' : 'text-green-900';
  const mbtiColor = isCyberMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-600';

  // 获取形态学样式
  const morphologyStyle = getVegetableMorphology(veg.type, veg.latin);
  const hoverStyle = isHovered ? getMorphologyHoverStyle(veg.type) : {};

  // 合并样式
  const imageContainerStyle = {
    ...morphologyStyle,
    ...hoverStyle
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${bgColor} rounded-3xl p-4 border ${borderColor} 
        shadow-xl cursor-pointer 
        transition-all duration-300 
        hover:shadow-2xl hover:-translate-y-1
        active:scale-95
        ${isCyberMode ? 'hover:border-cyan-500/30' : 'hover:border-green-500/30'}
      `}
    >
      {/* 核心：形态学样式 + 呼吸动画 */}
      <div 
        className={`
          w-full aspect-square mb-4 
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

      {/* 蔬菜信息 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-black text-lg ${nameColor}`}>
            {veg.name}
          </h3>
          <span className="text-xs text-gray-400">{veg.zodiac}</span>
        </div>
        
        {/* 性格描述 */}
        <p className={`text-xs ${textColor} line-clamp-1 mb-2`}>
          {veg.personality}
        </p>
        
        {/* 遗言预览（可选显示） */}
        {showLastWords && veg.lastWords && (
          <p className={`text-[10px] ${textColor} opacity-60 line-clamp-2 mb-2 italic`}>
            "{veg.lastWords}"
          </p>
        )}

        {/* 底部标签栏 */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-1">
            {/* MBTI 标签 */}
            <span className={`text-[10px] font-mono ${mbtiColor} px-2 py-1 rounded`}>
              {veg.mbti}
            </span>
            {/* 形态标签 */}
            <span className={`text-[10px] font-mono ${isCyberMode ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-600'} px-2 py-1 rounded capitalize`}>
              {veg.type}
            </span>
          </div>
          
          {/* 价格（示意） */}
          <span className={`font-bold text-sm ${isCyberMode ? 'text-cyan-400' : 'text-green-600'}`}>
            ￥5.00
          </span>
        </div>
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
