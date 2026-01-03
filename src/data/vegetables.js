// src/data/vegetables.js
// 蔬菜分类与商品元数据库

export const vegetableCategories = [
  { id: 'leafy', name: '时令叶菜', icon: '🥬' },
  { id: 'roots', name: '根茎大地', icon: '🥕' },
  { id: 'fungi', name: '菌菇力量', icon: '🍄' },
  { id: 'fresh', name: '鲜果蔬菜', icon: '🍅' },
];

export const allVegetables = [
  // --- 叶菜类 ---
  { id: 'v101', name: '有机西兰花', price: 12.99, unit: '斤', desc: '脆嫩如初：富含维C的健康选择', emoji: '🥦', cat: 'leafy', stock: 100 },
  { id: 'v102', name: '新鲜菠菜', price: 8.50, unit: '斤', desc: '补铁首选：清晨采摘的营养担当', emoji: '🥬', cat: 'leafy', stock: 80 },
  { id: 'v103', name: '奶油生菜', price: 5.80, unit: '颗', desc: '口感丝滑：轻食沙拉的灵魂伴侣', emoji: '🥗', cat: 'leafy', stock: 50 },
  { id: 'v104', name: '羽衣甘蓝', price: 15.00, unit: '包', desc: '超级食物：健身达人的绿色能量', emoji: '🥬', cat: 'leafy', stock: 30 },
  { id: 'v105', name: '小白菜', price: 4.50, unit: '斤', desc: '清甜可口：家常菜的百搭担当', emoji: '🥬', cat: 'leafy', stock: 120 },
  { id: 'v106', name: '空心菜', price: 6.00, unit: '斤', desc: '爽脆解腻：夏日必备时蔬', emoji: '🥬', cat: 'leafy', stock: 90 },

  // --- 根茎类 ---
  { id: 'v201', name: '红萝卜', price: 6.80, unit: '斤', desc: '护眼明星：胡萝卜素满满', emoji: '🥕', cat: 'roots', stock: 150 },
  { id: 'v202', name: '高山土豆', price: 3.50, unit: '斤', desc: '软糯香甜：炖煮煎烤样样精通', emoji: '🥔', cat: 'roots', stock: 200 },
  { id: 'v203', name: '紫薯', price: 7.20, unit: '斤', desc: '花青素大户：代餐粗粮优选', emoji: '🍠', cat: 'roots', stock: 60 },
  { id: 'v204', name: '白萝卜', price: 2.80, unit: '斤', desc: '冬日暖心：炖汤煮菜两相宜', emoji: '🥕', cat: 'roots', stock: 180 },
  { id: 'v205', name: '莲藕', price: 9.90, unit: '斤', desc: '藕断丝连：清炒凉拌皆美味', emoji: '🥕', cat: 'roots', stock: 40 },

  // --- 菌菇类 ---
  { id: 'v301', name: '香菇', price: 18.00, unit: '斤', desc: '山珍之王：鲜香浓郁提鲜神器', emoji: '🍄', cat: 'fungi', stock: 45 },
  { id: 'v302', name: '金针菇', price: 8.00, unit: '包', desc: '火锅必备：爽滑Q弹', emoji: '🍄', cat: 'fungi', stock: 100 },
  { id: 'v303', name: '杏鲍菇', price: 12.00, unit: '斤', desc: '素中鲍鱼：肉质紧实口感绝佳', emoji: '🍄', cat: 'fungi', stock: 55 },
  { id: 'v304', name: '平菇', price: 6.50, unit: '斤', desc: '物美价廉：日常烹饪好帮手', emoji: '🍄', cat: 'fungi', stock: 80 },

  // --- 鲜果蔬菜 ---
  { id: 'v401', name: '西红柿', price: 7.20, unit: '斤', desc: '阳光甜蜜：自然熟透的酸甜滋味', emoji: '🍅', cat: 'fresh', stock: 130 },
  { id: 'v402', name: '水果黄瓜', price: 9.90, unit: '根', desc: '清脆解渴：可生吃的脆爽口感', emoji: '🥒', cat: 'fresh', stock: 70 },
  { id: 'v403', name: '甜玉米', price: 4.50, unit: '穗', desc: '颗粒饱满：每一口都爆浆', emoji: '🌽', cat: 'fresh', stock: 160 },
  { id: 'v404', name: '彩椒', price: 12.00, unit: '斤', desc: '色彩缤纷：维C含量超柠檬', emoji: '🫑', cat: 'fresh', stock: 50 },
  { id: 'v405', name: '茄子', price: 5.50, unit: '斤', desc: '吸油大王：红烧鱼香随你选', emoji: '🍆', cat: 'fresh', stock: 90 },
];

// 按分类获取蔬菜
export const getVegetablesByCategory = (catId) => {
  if (!catId || catId === 'all') return allVegetables;
  return allVegetables.filter(v => v.cat === catId);
};

// 获取热门蔬菜（按库存排序取前N个）
export const getPopularVegetables = (limit = 4) => {
  return [...allVegetables].sort((a, b) => b.stock - a.stock).slice(0, limit);
};

// 默认导出前4个作为首页展示
export default allVegetables.slice(0, 4);
