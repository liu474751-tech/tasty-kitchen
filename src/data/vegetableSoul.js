// src/data/vegetableSoul.js
// 基于维基百科植物形态学 (Plant Morphology) 的蔬菜灵魂数据库
// 图片 URL 均使用 Wikimedia Commons 的高清原图

export const vegetableSoulList = [
  { 
    id: "v_01", name: "上海青", latin: "Brassica rapa subsp. chinensis", 
    img: "https://upload.wikimedia.org/wikipedia/commons/4/40/Bok_choy_single.jpg", 
    type: "foliate", mbti: "ISFJ", zodiac: "巨蟹座", 
    personality: "温和的守护者，默默支撑着每一碗热腾腾的面。", 
    fate: "在滚水中保持最后的翠绿，是对餐桌最后的温柔。",
    lastWords: "无论你去哪里，我都愿意做你碗底的那一抹绿。",
    absurdTerm: "承诺书：本人承诺不将此上海青用于「看起来很健康」的摆拍道具。"
  },
  { 
    id: "v_02", name: "西红柿", latin: "Solanum lycopersicum", 
    img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg", 
    type: "globose", mbti: "ENFP", zodiac: "狮子座", 
    personality: "热情奔放的显眼包，在哪里都要当红人。", 
    fate: "与鸡蛋共舞，在酸甜中寻找自我的终极平衡。",
    lastWords: "如果你要做番茄炒蛋，请先放蛋，这是对我最后的尊重。",
    absurdTerm: "免责声明：若因食用本西红柿导致心情过分愉悦，本店概不负责。"
  },
  { 
    id: "v_03", name: "胡萝卜", latin: "Daucus carota subsp. sativus", 
    img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Carrots_at_Ljubljana_Central_Market.jpg", 
    type: "cylindrical", mbti: "ESTP", zodiac: "白羊座", 
    personality: "护眼界的小太阳，浑身散发着维C的冲劲。", 
    fate: "在榨汁机中飞旋，或者在炖汤里默默释放甘甜。",
    lastWords: "我用一生的橙，换你一眼的亮。",
    absurdTerm: "用户协议：食用后若视力未改善，请勿投诉，先检查屏幕亮度。"
  },
  { 
    id: "v_04", name: "生姜", latin: "Zingiber officinale", 
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ginger_rhizome.jpg", 
    type: "tuberous", mbti: "ISTJ", zodiac: "摩羯座", 
    personality: "岁月的老辣隐士，低调却掌握着整锅菜的灵魂。", 
    fate: "被你从菜盘里挑出来的一刻，它的使命便已达成。",
    lastWords: "我知道你会把我挑出来，但没关系，我的味道会留下。",
    absurdTerm: "特别条款：若在可乐中发现本姜，属于养生行为，不退不换。"
  },
  { 
    id: "v_05", name: "大白菜", latin: "Brassica rapa pekinensis", 
    img: "https://upload.wikimedia.org/wikipedia/commons/2/22/Hakusai.jpg", 
    type: "foliate", mbti: "ESFJ", zodiac: "金牛座", 
    personality: "包容万象的大家长，冬天里最可靠的依靠。", 
    fate: "在窖藏中沉淀，或者在酸菜缸里完成华丽蜕变。",
    lastWords: "我可以是火锅的配角，但我永远是你冬天的主角。",
    absurdTerm: "储存须知：本白菜有权在地窖中沉睡三个月，请勿打扰其冬眠。"
  },
  { 
    id: "v_06", name: "生菜", latin: "Lactuca sativa", 
    img: "https://upload.wikimedia.org/wikipedia/commons/2/20/Red_Oak_Leaf_Lettuce.jpg", 
    type: "foliate", mbti: "INFP", zodiac: "双鱼座", 
    personality: "脆嫩多汁的治愈系，最怕在蚝油里失去尊严。", 
    fate: "在沙拉盆里寻找诗和远方。",
    lastWords: "请不要用蚝油烫我，让我保留最后的清脆和尊严。",
    absurdTerm: "使用条款：本生菜仅支持凉拌，热处理后人格解体概不负责。"
  },
  { 
    id: "v_07", name: "菠菜", latin: "Spinacia oleracea", 
    img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Spinach_leaves.jpg", 
    type: "foliate", mbti: "INFJ", zodiac: "天蝎座", 
    personality: "孤独的补铁者，外表易碎，内心蕴含强大力量。", 
    fate: "为了你的血红蛋白，它愿意奉献所有的翠绿。",
    lastWords: "吃了我，你就是大力水手。不吃，你就贫血。选吧。",
    absurdTerm: "健康声明：本菠菜不保证食用后能打败布鲁托。"
  },
  { 
    id: "v_08", name: "茄子", latin: "Solanum melongena", 
    img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Solanum_melongena_24_08_2012_%281%29.jpg", 
    type: "cylindrical", mbti: "ENTP", zodiac: "射手座", 
    personality: "油烟界的吸金石，不仅吸油还吸走所有风头。", 
    fate: "在红烧的烈火中，成就最软糯的传奇。",
    lastWords: "我吸的不是油，是这个厨房的灵魂。",
    absurdTerm: "油量警告：烹饪本茄子所需油量可能超出您的想象和预算。"
  },
  { 
    id: "v_09", name: "土豆", latin: "Solanum tuberosum", 
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg", 
    type: "tuberous", mbti: "ISTP", zodiac: "摩羯座", 
    personality: "深地壳哲学家，踏实、内敛、浑身是眼。", 
    fate: "削骨去皮，在薯条油锅里获得永生。",
    lastWords: "我可以是土豆泥，可以是薯条，但请别叫我碳水炸弹。",
    absurdTerm: "身份声明：本土豆拒绝被称为'淀粉'，请尊重其完整人格。"
  },
  { 
    id: "v_10", name: "洋葱", latin: "Allium cepa", 
    img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Onion_bulbs_in_India.jpg", 
    type: "globose", mbti: "INTJ", zodiac: "处女座", 
    personality: "孤独的泪弹，除非你剥开它的心，否则永远不懂它。", 
    fate: "为了让你心碎流泪，它愿意在热油中献祭自己。",
    lastWords: "你流的泪，是我对这段关系最后的测试。",
    absurdTerm: "情感提示：切本洋葱时流泪属正常反应，并非本店催泪瓦斯。"
  },
  { 
    id: "v_11", name: "西蓝花", latin: "Brassica oleracea var. italica", 
    img: "https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg", 
    type: "foliate", mbti: "ENFJ", zodiac: "天秤座", 
    personality: "精致的社交达人，总想在盘子里开出一朵花。", 
    fate: "在轻食轻餐中，扮演健康生活的救世主。",
    lastWords: "我是一朵花，请像对待花一样温柔地焯水。",
    absurdTerm: "审美条款：本西蓝花有权拒绝被切成不对称的形状。"
  },
  { 
    id: "v_12", name: "大蒜", latin: "Allium sativum", 
    img: "https://upload.wikimedia.org/wikipedia/commons/2/25/Knoblauch_Schnitt_01.jpg", 
    type: "globose", mbti: "ENTJ", zodiac: "天蝎座", 
    personality: "社交隔离器，只要我够辣，你就得离我远点。", 
    fate: "粉身碎骨浑不怕，要留蒜香在人间。",
    lastWords: "吃了我，今晚就别想和人近距离说话了。",
    absurdTerm: "社交警告：食用后8小时内请保持1.5米社交距离。"
  },
  { 
    id: "v_13", name: "苦瓜", latin: "Momordica charantia", 
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Bitter_melon_vertical.jpg", 
    type: "cylindrical", mbti: "INTJ", zodiac: "水瓶座", 
    personality: "物理现实主义者，既然生活苦，我也没必要装甜。", 
    fate: "吃过我的苦，你会明白生活的甜。",
    lastWords: "我苦，但我清热解毒。你甜，但你只会长胖。",
    absurdTerm: "口味协议：购买即表示接受苦味，退货理由'太苦了'无效。"
  },
  { 
    id: "v_14", name: "黄瓜", latin: "Cucumis sativus", 
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cucumber_at_market.jpg", 
    type: "cylindrical", mbti: "ISFP", zodiac: "天秤座", 
    personality: "清新脱俗的乐天派，美容界的平替王者。", 
    fate: "在拍黄瓜的敲打中，释放最凉爽的灵魂。",
    lastWords: "拍我可以，但请用刀背，保留最后的体面。",
    absurdTerm: "多功能声明：本黄瓜同时适用于食用和敷脸，但请勿混用同一根。"
  },
  { 
    id: "v_15", name: "南瓜", latin: "Cucurbita maxima", 
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Common_pumpkin_Cucurbita_pepo.jpg", 
    type: "globose", mbti: "INFJ", zodiac: "双子座", 
    personality: "厚积薄发的变色龙，可甜可咸。", 
    fate: "在万圣节发光，或者在粥里化为乌有。",
    lastWords: "我可以是南瓜粥，也可以是杰克灯笼，全看你的审美。",
    absurdTerm: "节日条款：万圣节期间本南瓜身价翻倍，概不议价。"
  },
  { 
    id: "v_16", name: "大葱", latin: "Allium fistulosum", 
    img: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Scallion_bulbs.jpg", 
    type: "cylindrical", mbti: "ESTJ", zodiac: "射手座", 
    personality: "直爽豪迈的北方汉子，不求名分只求入味。", 
    fate: "大葱蘸酱，是它最体面的江湖仪式感。",
    lastWords: "给我一碟黄豆酱，我能卷起整个北方的豪情。",
    absurdTerm: "地域认证：本大葱来自山东，自带煎饼卷一切的属性。"
  },
  { 
    id: "v_17", name: "莲藕", latin: "Nelumbo nucifera", 
    img: "https://upload.wikimedia.org/wikipedia/commons/d/df/Lotus_root.JPG", 
    type: "cylindrical", mbti: "INTP", zodiac: "处女座", 
    personality: "心眼最多的逻辑学家，出淤泥而不染。", 
    fate: "断开时那若有若无的丝，是它对红尘最后的留恋。",
    lastWords: "藕断丝连，是我对这段关系最后的执念。",
    absurdTerm: "哲学提示：切藕时请思考'藕断丝连'的人生哲理。"
  },
  { 
    id: "v_18", name: "彩椒", latin: "Capsicum annuum", 
    img: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Bell_peppers_at_market.jpg", 
    type: "globose", mbti: "ESFP", zodiac: "双子座", 
    personality: "多姿多彩的派对常客，只负责美貌不负责辛辣。", 
    fate: "在配菜的世界里，它是永远的色彩冠军。",
    lastWords: "我不辣，我只是长得像辣椒而已，别怕。",
    absurdTerm: "颜值声明：本彩椒以颜值定价，辣度为0，请勿期待刺激。"
  },
  { 
    id: "v_19", name: "香菇", latin: "Lentinula edodes", 
    img: "https://upload.wikimedia.org/wikipedia/commons/3/30/Shiitake_mushroom_on_white_background.jpg", 
    type: "globose", mbti: "INFJ", zodiac: "双鱼座", 
    personality: "山珍里的哲人，带着泥土和森林的神秘气息。", 
    fate: "在鲜香中升华，成为汤底里不可言说的秘密。",
    lastWords: "我来自深山老林，带着大自然的问候。",
    absurdTerm: "身份证明：本香菇为真菌界贵族，拒绝与平菇相提并论。"
  },
  { 
    id: "v_20", name: "芦笋", latin: "Asparagus officinalis", 
    img: "https://upload.wikimedia.org/wikipedia/commons/0/03/Asparagus_variety.jpg", 
    type: "cylindrical", mbti: "ENTJ", zodiac: "天秤座", 
    personality: "高挑优雅的贵族，自带高级感。", 
    fate: "在黄油中轻煎，完成最体面的社交辞令。",
    lastWords: "请用黄油煎我，这是对贵族最后的尊重。",
    absurdTerm: "烹饪指南：本芦笋只接受黄油、橄榄油，拒绝地沟油。"
  }
];

// 植物形态学分类
export const vegetableTypes = {
  foliate: { name: '叶菜类', desc: '以叶片为主要食用部位', icon: '🥬' },
  globose: { name: '球茎类', desc: '球形或近球形的蔬菜', icon: '🧅' },
  cylindrical: { name: '长形类', desc: '圆柱形或长条形蔬菜', icon: '🥒' },
  tuberous: { name: '块茎类', desc: '地下块茎类蔬菜', icon: '🥔' }
};

// 按形态学类型获取蔬菜
export const getVegetablesByType = (type) => {
  if (!type || type === 'all') return vegetableSoulList;
  return vegetableSoulList.filter(v => v.type === type);
};

// 按 MBTI 获取蔬菜
export const getVegetablesByMbti = (mbti) => {
  return vegetableSoulList.filter(v => v.mbti === mbti);
};

// 按星座获取蔬菜
export const getVegetablesByZodiac = (zodiac) => {
  return vegetableSoulList.filter(v => v.zodiac === zodiac);
};

// 随机获取蔬菜灵魂
export const getRandomVegetableSoul = () => {
  const index = Math.floor(Math.random() * vegetableSoulList.length);
  return vegetableSoulList[index];
};

export default vegetableSoulList;
