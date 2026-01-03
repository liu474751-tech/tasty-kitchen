// src/data/index.js
// 数据层统一出口

// 蔬菜数据
export {
  default as vegetables,
  allVegetables,
  vegetableCategories,
  getVegetablesByCategory,
  getPopularVegetables,
} from './vegetables';

// 水果数据
export {
  default as fruits,
  allFruits,
  fruitCategories,
  getFruitsByCategory,
  getSeasonalFruits,
} from './fruits';

// 套餐展示数据
export {
  default as showcaseItems,
  allShowcaseItems,
  showcaseCategories,
  getShowcaseByCategory,
  getDiscountPercent,
} from './showcase';

// 外卖菜单数据
export {
  default as menuItems,
  allMenuItems,
  menuCategories,
  getMenuByCategory,
  getLowCalorieItems,
  getQuickItems,
} from './menu';
