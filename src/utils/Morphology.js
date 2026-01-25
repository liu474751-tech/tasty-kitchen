// src/utils/Morphology.js
// 形态学 CSS 算法
// 基于植物形态学中 Globose（球形）、Cylindrical（柱形/长条）、Foliate（叶形）和 Tuberous（块茎形）的定义
// 利用 borderRadius 制造有机感，并结合 clip-path 塑造特定植物结构

/**
 * 根据形态学分类生成优化 CSS 样式
 * @param {string} type - 形态分类 (globose, cylindrical, foliate, tuberous)
 * @param {string} seed - 随机种子 (通常使用拉丁学名)
 * @returns {Object} CSS 样式对象
 */
export const getVegetableMorphology = (type, seed) => {
  // 利用种子产生唯一的随机偏移量，让每一棵菜都有细微差别
  const s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const drift = (s % 10); 

  const baseStyles = {
    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    position: 'relative'
  };

  switch (type) {
    case 'globose': // 球形：不规则的有机圆
      return {
        ...baseStyles,
        borderRadius: `${48+drift}% ${52-drift}% ${50+drift}% ${50-drift}% / ${50+drift}% ${50-drift}% ${48+drift}% ${52-drift}%`,
        aspectRatio: '1/1'
      };
    case 'cylindrical': // 长条形：模拟萝卜、茄子的拉伸效果
      return {
        ...baseStyles,
        borderRadius: `${40+drift}% ${40-drift}% ${50+drift}% ${50-drift}% / 18% 18% 82% 82%`,
        width: '85%',
        margin: '0 auto',
        aspectRatio: '0.65 / 1'
      };
    case 'foliate': // 叶片形：底部收缩，顶部发散
      return {
        ...baseStyles,
        borderRadius: `${50+drift}% ${50-drift}% 15% 15%`,
        clipPath: 'polygon(15% 100%, 85% 100%, 100% 25%, 85% 0%, 15% 0%, 0% 25%)'
      };
    case 'tuberous': // 块茎形：极端不对称感
      return {
        ...baseStyles,
        borderRadius: `${30+drift}% ${70-drift}% ${45+drift}% ${55-drift}% / ${60+drift}% ${30-drift}% ${70+drift}% ${40-drift}%`,
        transform: `rotate(${drift - 5}deg)`
      };
    default:
      return { ...baseStyles, borderRadius: '40%' };
  }
};

/**
 * 获取形态学分类的悬停效果样式
 * @param {string} type - 形态分类
 * @returns {Object} 悬停时的 CSS 样式对象
 */
export const getMorphologyHoverStyle = (type) => {
  const baseHover = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
  };

  switch (type) {
    case 'globose':
      return { ...baseHover, transform: 'scale(1.08)' };
    case 'cylindrical':
      return { ...baseHover, transform: 'scale(1.05) translateY(-4px)' };
    case 'foliate':
      return { ...baseHover, transform: 'scale(1.06) rotate(-2deg)' };
    case 'tuberous':
      return { ...baseHover, transform: 'scale(1.04) rotate(3deg)' };
    default:
      return baseHover;
  }
};

/**
 * 形态学类型映射表
 */
export const morphologyTypes = {
  globose: {
    name: '球形',
    nameEn: 'Globose',
    desc: '圆润饱满，如洋葱、西红柿',
    icon: '🔴'
  },
  cylindrical: {
    name: '柱形',
    nameEn: 'Cylindrical',
    desc: '细长修长，如胡萝卜、茄子',
    icon: '🥒'
  },
  foliate: {
    name: '叶形',
    nameEn: 'Foliate',
    desc: '层叠展开，如白菜、生菜',
    icon: '🥬'
  },
  tuberous: {
    name: '块茎形',
    nameEn: 'Tuberous',
    desc: '不规则块状，如土豆、生姜',
    icon: '🥔'
  }
};

export default getVegetableMorphology;
