// src/data/showcase.js
// 精品套餐展示数据

export const showcaseCategories = [
  { id: 'gift', name: '送礼精选', icon: '🎁' },
  { id: 'family', name: '家庭套装', icon: '🏠' },
  { id: 'fitness', name: '健身轻食', icon: '💪' },
];

export const allShowcaseItems = [
  // --- 送礼精选 ---
  {
    id: 's101',
    name: '精选礼盒套装',
    price: 199.00,
    originalPrice: 258.00,
    emoji: '🎁',
    desc: '水果蔬菜精美组合，送礼体面',
    tag: '热卖',
    tagColor: 'bg-red-500',
    cat: 'gift',
    items: ['红富士苹果×2斤', '智利车厘子×1斤', '水晶葡萄×1斤', '有机蔬菜×3种'],
  },
  {
    id: 's102',
    name: '高端水果礼篮',
    price: 388.00,
    originalPrice: 488.00,
    emoji: '🧺',
    desc: '进口水果臻选，彰显品味',
    tag: '尊享',
    tagColor: 'bg-purple-500',
    cat: 'gift',
    items: ['日本晴王葡萄×1串', '智利车厘子×2斤', '新西兰猕猴桃×1盒'],
  },

  // --- 家庭套装 ---
  {
    id: 's201',
    name: '有机蔬菜周套餐',
    price: 128.00,
    originalPrice: 168.00,
    emoji: '📦',
    desc: '一周所需蔬菜，省心又省钱',
    tag: '推荐',
    tagColor: 'bg-green-500',
    cat: 'family',
    items: ['时令叶菜×5种', '根茎类×3种', '菌菇×2种'],
  },
  {
    id: 's202',
    name: '家庭蔬果大礼包',
    price: 168.00,
    originalPrice: 218.00,
    emoji: '🏠',
    desc: '满足全家一周所需，营养均衡',
    tag: '超值',
    tagColor: 'bg-amber-500',
    cat: 'family',
    items: ['蔬菜×10斤', '水果×8斤', '菌菇×2斤'],
  },
  {
    id: 's203',
    name: '宝宝辅食套餐',
    price: 98.00,
    originalPrice: 128.00,
    emoji: '👶',
    desc: '精选有机，为宝宝健康护航',
    tag: '新品',
    tagColor: 'bg-pink-500',
    cat: 'family',
    items: ['有机胡萝卜×1斤', '有机菠菜×1斤', '有机土豆×2斤', '有机苹果×2斤'],
  },

  // --- 健身轻食 ---
  {
    id: 's301',
    name: '健身增肌套餐',
    price: 158.00,
    originalPrice: 198.00,
    emoji: '💪',
    desc: '高蛋白低脂，健身必备',
    tag: '健身',
    tagColor: 'bg-blue-500',
    cat: 'fitness',
    items: ['鸡胸肉×500g', '西兰花×2斤', '鸡蛋×10个', '牛油果×2个'],
  },
  {
    id: 's302',
    name: '轻断食果蔬汁套装',
    price: 88.00,
    originalPrice: 118.00,
    emoji: '🧃',
    desc: '7天轻体验，焕新自己',
    tag: '瘦身',
    tagColor: 'bg-teal-500',
    cat: 'fitness',
    items: ['羽衣甘蓝×3包', '芹菜×2斤', '苹果×3斤', '柠檬×5个'],
  },
];

// 按分类获取套餐
export const getShowcaseByCategory = (catId) => {
  if (!catId || catId === 'all') return allShowcaseItems;
  return allShowcaseItems.filter(s => s.cat === catId);
};

// 计算折扣百分比
export const getDiscountPercent = (item) => {
  if (!item.originalPrice) return 0;
  return Math.round((1 - item.price / item.originalPrice) * 100);
};

// 默认导出前3个作为首页展示
export default allShowcaseItems.slice(0, 3);
