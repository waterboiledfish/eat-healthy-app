// src/utils/foodDatabase.js
// 常见食物营养数据库（每100克）
// 单位：热量(kcal)、蛋白质(g)、碳水(g)、脂肪(g)
const foodDatabase = {
  // 主食类
  米饭: { calories: 130, protein: 2.7, carbs: 28.6, fat: 0.3 },
  馒头: { calories: 286, protein: 7.8, carbs: 45.7, fat: 1.1 },
  面条: { calories: 130, protein: 3.5, carbs: 25.5, fat: 1.6 },
  玉米: { calories: 106, protein: 4.0, carbs: 22.8, fat: 1.2 },
  红薯: { calories: 86, protein: 1.1, carbs: 20.1, fat: 0.2 },
  土豆: { calories: 77, protein: 2.0, carbs: 17.2, fat: 0.2 }, // 别称：洋芋、马铃薯
  全麦面包: { calories: 250, protein: 8.8, carbs: 43.9, fat: 3.2 },
  // 肉蛋类
  鸡蛋: { calories: 155, protein: 12.7, carbs: 1.1, fat: 10.6 },
  鸡胸肉: { calories: 118, protein: 20.8, carbs: 1.7, fat: 2.5 },
  瘦牛肉: { calories: 106, protein: 20.2, carbs: 0.2, fat: 2.3 },
  瘦猪肉: { calories: 143, protein: 20.3, carbs: 0, fat: 6.2 },
  三文鱼: { calories: 139, protein: 20.4, carbs: 0, fat: 5.4 },
  虾仁: { calories: 80, protein: 16.8, carbs: 1.5, fat: 0.8 },
  // 蔬菜类
  西兰花: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  菠菜: { calories: 28, protein: 2.6, carbs: 4.5, fat: 0.3 },
  黄瓜: { calories: 16, protein: 0.8, carbs: 2.9, fat: 0.2 },
  番茄: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  胡萝卜: { calories: 41, protein: 1.0, carbs: 9.6, fat: 0.2 },
  生菜: { calories: 16, protein: 1.4, carbs: 2.1, fat: 0.2 },
  金针菇: { calories: 32, protein: 2.4, carbs: 6.0, fat: 0.4 },
  // 水果类
  苹果: { calories: 52, protein: 0.3, carbs: 13.5, fat: 0.2 },
  香蕉: { calories: 91, protein: 1.4, carbs: 22.8, fat: 0.2 },
  草莓: { calories: 32, protein: 1.0, carbs: 7.7, fat: 0.3 },
  橙子: { calories: 47, protein: 0.9, carbs: 11.1, fat: 0.2 },
  蓝莓: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  芒果: { calories: 60, protein: 0.6, carbs: 14.9, fat: 0.3 },
  // 乳制品/豆制品
  牛奶: { calories: 54, protein: 3.2, carbs: 4.8, fat: 1.5 },
  酸奶: { calories: 72, protein: 2.5, carbs: 9.3, fat: 2.7 },
  豆腐: { calories: 85, protein: 8.1, carbs: 4.2, fat: 3.7 },
  豆浆: { calories: 16, protein: 1.8, carbs: 1.1, fat: 0.7 },
  芝士: { calories: 328, protein: 21.5, carbs: 1.3, fat: 26.4 },
  // 饮品类
  白开水: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  无糖可乐: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  奶茶: { calories: 180, protein: 2.5, carbs: 38.0, fat: 2.0 }, // 常规甜度
  咖啡: { calories: 2, protein: 0.1, carbs: 0.1, fat: 0 }, // 黑咖啡
  // 零食类
  薯片: { calories: 536, protein: 7.5, carbs: 49.2, fat: 37.6 },
  巧克力: { calories: 546, protein: 4.2, carbs: 63.1, fat: 29.7 },
  坚果混合装: { calories: 607, protein: 21.3, carbs: 20.0, fat: 54.2 },
  // 调味品
  食用油: { calories: 899, protein: 0, carbs: 0, fat: 99.9 },
  盐: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  酱油: { calories: 26, protein: 5.6, carbs: 1.0, fat: 0.1 }
};

// 食物别称映射（解决模糊匹配：如识别出"洋芋"→匹配"土豆"）
const foodAlias = {
  洋芋: '土豆',
  马铃薯: '土豆',
  西红柿: '番茄',
  凤梨: '菠萝',
  鸡胸: '鸡胸肉',
  瘦牛: '瘦牛肉',
  瘦猪: '瘦猪肉'
};

/**
 * 核心函数：根据食物名称获取营养信息（优化版模糊匹配）
 * @param {string} foodName 拍照识别的食物名称（如"红苹果"、"洋芋"）
 * @returns {object|null} 营养信息 { calories, protein, carbs, fat }，无匹配返回null
 */
export const getNutrition = (foodName) => {
  if (!foodName || typeof foodName !== 'string') return null;
  
  // 第一步：去除空格、转小写，统一格式
  const cleanName = foodName.trim().toLowerCase();
  // 第二步：先匹配别称（如"洋芋"→"土豆"）
  const aliasMatchedName = foodAlias[cleanName] || cleanName;
  // 第三步：模糊匹配数据库（支持"红苹果"→"苹果"、"小番茄"→"番茄"）
  const dbKeys = Object.keys(foodDatabase);
  const matchedKey = dbKeys.find(key => {
    const lowerKey = key.toLowerCase();
    // 匹配规则：数据库名称包含识别名 或 识别名包含数据库名称
    return lowerKey.includes(aliasMatchedName) || aliasMatchedName.includes(lowerKey);
  });

  return matchedKey ? foodDatabase[matchedKey] : null;
};

// 兼容旧版匹配函数（保留，避免其他同学代码报错）
export const matchFood = getNutrition;

// 导出完整数据库，供扩展使用
export default foodDatabase;