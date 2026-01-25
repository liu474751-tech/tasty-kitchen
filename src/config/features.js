// src/config/features.js
// 功能控制台 - 方便你随时开启或关闭这些疯狂的创意功能
// 设置为 true 开启，false 关闭

export const FEATURES = {
  BREATHING_EFFECT: true,   // 创意1: 呼吸感动画 - 让蔬菜卡片像在呼吸一样微微浮动
  THEME_TOGGLE: true,       // 创意2: 赛博/田园双模式 - 霓虹赛博朋克 vs 清新田园风
  HAPTIC_FEEDBACK: true,    // 创意3: 物理触感反馈 - 模拟手机震动的视觉反馈
  LIVE_TICKER: true,        // 创意4: 伪弹幕跑马灯 - 滚动展示蔬菜的命运宣言
  LAST_WORDS: true,         // 创意5: 遗言确认弹窗 - 加入购物车时蔬菜的临终遗言
  ABSURD_TERMS: true,       // 创意6: 奇葩契约条款 - 结账时的荒诞用户协议
  VEGGIE_MATCH: true        // 创意7: 本命蔬菜配对 - 根据MBTI/星座匹配你的蔬菜灵魂伴侣
};

/**
 * 检查某个功能是否开启
 * @param {string} featureName - 功能名称
 * @returns {boolean}
 */
export const isFeatureEnabled = (featureName) => {
  return FEATURES[featureName] ?? false;
};

/**
 * 批量检查多个功能
 * @param {string[]} featureNames - 功能名称数组
 * @returns {Object} 功能状态映射
 */
export const checkFeatures = (featureNames) => {
  return featureNames.reduce((acc, name) => {
    acc[name] = isFeatureEnabled(name);
    return acc;
  }, {});
};

/**
 * 功能描述映射（用于调试面板或设置页面）
 */
export const FEATURE_DESCRIPTIONS = {
  BREATHING_EFFECT: {
    name: '呼吸感动画',
    desc: '让蔬菜卡片像在呼吸一样微微浮动',
    icon: '💨'
  },
  THEME_TOGGLE: {
    name: '赛博/田园双模式',
    desc: '霓虹赛博朋克 vs 清新田园风切换',
    icon: '🌗'
  },
  HAPTIC_FEEDBACK: {
    name: '物理触感反馈',
    desc: '模拟手机震动的视觉反馈效果',
    icon: '📳'
  },
  LIVE_TICKER: {
    name: '伪弹幕跑马灯',
    desc: '滚动展示蔬菜的命运宣言',
    icon: '📜'
  },
  LAST_WORDS: {
    name: '遗言确认弹窗',
    desc: '加入购物车时蔬菜的临终遗言',
    icon: '💀'
  },
  ABSURD_TERMS: {
    name: '奇葩契约条款',
    desc: '结账时的荒诞用户协议',
    icon: '📋'
  },
  VEGGIE_MATCH: {
    name: '本命蔬菜配对',
    desc: '根据MBTI/星座匹配你的蔬菜灵魂伴侣',
    icon: '💚'
  }
};

export default FEATURES;
