// src/data/menu.js
// 外卖菜单数据

export const menuCategories = [
  { id: 'salad', name: '健康沙拉', icon: '🥗' },
  { id: 'juice', name: '鲜榨果汁', icon: '🧃' },
  { id: 'dessert', name: '果蔬甜品', icon: '🍨' },
  { id: 'combo', name: '超值套餐', icon: '🍱' },
];

export const allMenuItems = [
  // --- 健康沙拉 ---
  {
    id: 'm101',
    name: '健康蔬菜沙拉',
    price: 28.00,
    emoji: '🥗',
    desc: '新鲜时蔬，低卡健康',
    cat: 'salad',
    calories: 180,
    prepTime: 10,
  },
  {
    id: 'm102',
    name: '凯撒大虾沙拉',
    price: 42.00,
    emoji: '🥗',
    desc: '经典凯撒酱配鲜虾仁',
    cat: 'salad',
    calories: 320,
    prepTime: 12,
  },
  {
    id: 'm103',
    name: '牛油果鸡肉沙拉',
    price: 38.00,
    emoji: '🥑',
    desc: '优质蛋白，健身必备',
    cat: 'salad',
    calories: 280,
    prepTime: 15,
  },

  // --- 鲜榨果汁 ---
  {
    id: 'm201',
    name: '鲜榨橙汁',
    price: 18.00,
    emoji: '🍊',
    desc: '现榨无添加，维C满满',
    cat: 'juice',
    calories: 90,
    prepTime: 5,
  },
  {
    id: 'm202',
    name: '蜂蜜柠檬水',
    price: 15.00,
    emoji: '🍋',
    desc: '清爽解腻，美白养颜',
    cat: 'juice',
    calories: 65,
    prepTime: 3,
  },
  {
    id: 'm203',
    name: '综合果蔬汁',
    price: 22.00,
    emoji: '🧃',
    desc: '苹果+胡萝卜+芹菜黄金配比',
    cat: 'juice',
    calories: 110,
    prepTime: 8,
  },
  {
    id: 'm204',
    name: '西瓜汁',
    price: 16.00,
    emoji: '🍉',
    desc: '夏日解暑神器，冰爽甘甜',
    cat: 'juice',
    calories: 80,
    prepTime: 5,
  },

  // --- 果蔬甜品 ---
  {
    id: 'm301',
    name: '鲜果拼盘',
    price: 38.00,
    emoji: '🍇',
    desc: '多种时令水果精美摆盘',
    cat: 'dessert',
    calories: 150,
    prepTime: 10,
  },
  {
    id: 'm302',
    name: '水果捞',
    price: 32.00,
    emoji: '🍨',
    desc: '酸奶配鲜果，清甜不腻',
    cat: 'dessert',
    calories: 220,
    prepTime: 8,
  },
  {
    id: 'm303',
    name: '芒果西米露',
    price: 28.00,
    emoji: '🥭',
    desc: '椰奶香浓，芒果清甜',
    cat: 'dessert',
    calories: 260,
    prepTime: 12,
  },

  // --- 超值套餐 ---
  {
    id: 'm401',
    name: '轻食午餐套餐',
    price: 45.00,
    emoji: '🍱',
    desc: '沙拉+果汁+水果，工作日轻松吃',
    cat: 'combo',
    calories: 380,
    prepTime: 15,
    includes: ['健康蔬菜沙拉', '鲜榨橙汁', '当季水果'],
  },
  {
    id: 'm402',
    name: '双人甜蜜套餐',
    price: 78.00,
    emoji: '💕',
    desc: '果汁×2+水果捞，约会必点',
    cat: 'combo',
    calories: 450,
    prepTime: 18,
    includes: ['综合果蔬汁×2', '水果捞', '鲜果拼盘'],
  },
];

// 按分类获取菜品
export const getMenuByCategory = (catId) => {
  if (!catId || catId === 'all') return allMenuItems;
  return allMenuItems.filter(m => m.cat === catId);
};

// 获取低卡路里菜品
export const getLowCalorieItems = (maxCalories = 200) => {
  return allMenuItems.filter(m => m.calories <= maxCalories);
};

// 获取快速出餐菜品（10分钟内）
export const getQuickItems = (maxTime = 10) => {
  return allMenuItems.filter(m => m.prepTime <= maxTime);
};

// 默认导出前4个作为首页展示
export default allMenuItems.slice(0, 4);
