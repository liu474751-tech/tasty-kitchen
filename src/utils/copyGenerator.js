// src/utils/copyGenerator.js
// Copy Expert 文案模板引擎 - 根据属性自动拼装描述

// 特性词库
const featureWords = {
  // 按分类
  leafy: ['时令', '鲜嫩', '翠绿', '清脆'],
  roots: ['软糯', '香甜', '粉糯', '扎实'],
  fungi: ['鲜香', '爽滑', '肉厚', 'Q弹'],
  fresh: ['多汁', '饱满', '清甜', '脆爽'],
  domestic: ['当季', '本地', '新鲜采摘', '产地直供'],
  tropical: ['热带', '香浓', '甜蜜', '异域风情'],
  imported: ['进口', '精选', '顶级', '臻选'],
  berries: ['爆浆', '酸甜', '小巧', '颗颗饱满'],
};

// 品类词库
const categoryWords = {
  leafy: '叶菜',
  roots: '根茎',
  fungi: '菌菇',
  fresh: '时蔬',
  domestic: '国产水果',
  tropical: '热带水果',
  imported: '进口水果',
  berries: '浆果',
};

// 营养价值词库
const nutritionWords = {
  '西兰花': '维C之王',
  '菠菜': '补铁首选',
  '胡萝卜': '护眼明星',
  '萝卜': '护眼佳品',
  '土豆': '能量担当',
  '紫薯': '花青素大户',
  '香菇': '提鲜神器',
  '金针菇': '火锅必备',
  '西红柿': '番茄红素',
  '黄瓜': '补水神器',
  '玉米': '粗粮优选',
  '苹果': '每日一果',
  '橙子': '维C补给站',
  '葡萄': '抗氧化',
  '草莓': '颜值担当',
  '蓝莓': '护眼小能手',
  '芒果': '热带蜜糖',
  '榴莲': '水果之王',
  '车厘子': '红宝石',
  '猕猴桃': '维C之王',
};

/**
 * 根据商品属性生成文案描述
 * @param {Object} item - 商品对象
 * @returns {string} 生成的文案
 */
export function generateCopy(item) {
  const { name, cat, price } = item;
  
  // 1. 获取特性词
  const features = featureWords[cat] || featureWords.fresh;
  const feature = features[Math.floor(Math.random() * features.length)];
  
  // 2. 获取品类词
  const category = categoryWords[cat] || '新鲜';
  
  // 3. 获取营养价值词（根据名称匹配）
  let nutrition = '';
  for (const [key, value] of Object.entries(nutritionWords)) {
    if (name.includes(key)) {
      nutrition = value;
      break;
    }
  }
  
  // 4. 价格档次判断
  const priceLevel = price > 50 ? '臻选' : price > 20 ? '精选' : '实惠';
  
  // 5. 拼装文案模板
  const templates = [
    `${feature}${category}：${nutrition || '营养满分'}`,
    `${nutrition || feature}：${priceLevel}好物推荐`,
    `${feature}口感：${nutrition || '健康之选'}`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 批量生成文案
 * @param {Array} items - 商品数组
 * @returns {Array} 带有生成文案的商品数组
 */
export function batchGenerateCopy(items) {
  return items.map(item => ({
    ...item,
    generatedDesc: item.desc || generateCopy(item),
  }));
}

/**
 * 格式化价格显示
 * @param {number} price 
 * @returns {string}
 */
export function formatPrice(price) {
  if (price >= 100) return price.toFixed(0);
  return price.toFixed(2);
}

export default { generateCopy, batchGenerateCopy, formatPrice };
