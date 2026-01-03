// src/data/fruits.js
// 水果分类与商品元数据库

export const fruitCategories = [
  { id: 'domestic', name: '国产时令', icon: '🍎' },
  { id: 'tropical', name: '热带风情', icon: '🥭' },
  { id: 'imported', name: '进口精选', icon: '🍇' },
  { id: 'berries', name: '浆果之恋', icon: '🍓' },
];

export const allFruits = [
  // --- 国产时令 ---
  { id: 'f101', name: '红富士苹果', price: 15.99, unit: '斤', desc: '咬一口爆汁：今晨果园直达', emoji: '🍎', cat: 'domestic', stock: 200 },
  { id: 'f102', name: '阳光橙子', price: 12.50, unit: '斤', desc: '维C小太阳：每日元气补给站', emoji: '🍊', cat: 'domestic', stock: 180 },
  { id: 'f103', name: '砀山梨', price: 8.80, unit: '斤', desc: '润肺生津：秋冬养生首选', emoji: '🍐', cat: 'domestic', stock: 150 },
  { id: 'f104', name: '冰糖心苹果', price: 18.00, unit: '斤', desc: '甜到心坎：新疆阿克苏直邮', emoji: '🍎', cat: 'domestic', stock: 80 },

  // --- 热带风情 ---
  { id: 'f201', name: '海南芒果', price: 22.00, unit: '斤', desc: '热带蜜糖：香甜浓郁不可挡', emoji: '🥭', cat: 'tropical', stock: 60 },
  { id: 'f202', name: '泰国榴莲', price: 68.00, unit: '斤', desc: '水果之王：闻着臭吃着香', emoji: '🥭', cat: 'tropical', stock: 25 },
  { id: 'f203', name: '菠萝蜜', price: 15.00, unit: '斤', desc: '果肉丰盈：清香甘甜回味悠长', emoji: '🍈', cat: 'tropical', stock: 35 },
  { id: 'f204', name: '火龙果', price: 16.00, unit: '斤', desc: '颜值担当：清热降火好帮手', emoji: '🍈', cat: 'tropical', stock: 90 },

  // --- 进口精选 ---
  { id: 'f301', name: '水晶葡萄', price: 25.00, unit: '斤', desc: '无籽甜心：粒粒爆浆的幸福感', emoji: '🍇', cat: 'imported', stock: 70 },
  { id: 'f302', name: '智利车厘子', price: 88.00, unit: '斤', desc: '红宝石级：大果粒甜度爆表', emoji: '🍒', cat: 'imported', stock: 40 },
  { id: 'f303', name: '新西兰猕猴桃', price: 35.00, unit: '盒', desc: '绿心奇异：酸甜平衡维C之王', emoji: '🥝', cat: 'imported', stock: 55 },
  { id: 'f304', name: '日本晴王葡萄', price: 168.00, unit: '串', desc: '顶级臻选：一颗一口的仪式感', emoji: '🍇', cat: 'imported', stock: 15 },

  // --- 浆果之恋 ---
  { id: 'f401', name: '草莓', price: 35.00, unit: '斤', desc: '冬日限定：颜值与美味并存', emoji: '🍓', cat: 'berries', stock: 50 },
  { id: 'f402', name: '蓝莓', price: 45.00, unit: '盒', desc: '护眼小能手：花青素含量TOP', emoji: '🫐', cat: 'berries', stock: 65 },
  { id: 'f403', name: '树莓', price: 58.00, unit: '盒', desc: '轻奢浆果：甜酸适口果香馥郁', emoji: '🍓', cat: 'berries', stock: 30 },
  { id: 'f404', name: '桑葚', price: 28.00, unit: '斤', desc: '乌发秘方：自然紫黑营养满分', emoji: '🫐', cat: 'berries', stock: 40 },
];

// 按分类获取水果
export const getFruitsByCategory = (catId) => {
  if (!catId || catId === 'all') return allFruits;
  return allFruits.filter(f => f.cat === catId);
};

// 获取当季热卖（按库存排序取前N个）
export const getSeasonalFruits = (limit = 4) => {
  return [...allFruits].sort((a, b) => b.stock - a.stock).slice(0, limit);
};

// 默认导出前4个作为首页展示
export default allFruits.slice(0, 4);
