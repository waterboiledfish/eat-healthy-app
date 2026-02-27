// 常见食物营养数据库（每100克）
// 单位：热量(kcal)、蛋白质(g)、碳水(g)、脂肪(g)
const foodDatabase = {
  // 主食类
  米饭: { calories: 130, protein: 2.7, carbs: 28.6, fat: 0.3 },
  馒头: { calories: 286, protein: 7.8, carbs: 45.7, fat: 1.1 },
  面条: { calories: 130, protein: 3.5, carbs: 25.5, fat: 1.6 },
  玉米: { calories: 106, protein: 4.0, carbs: 22.8, fat: 1.2 },
  红薯: { calories: 86, protein: 1.1, carbs: 20.1, fat: 0.2 },
  // 肉蛋类
  鸡蛋: { calories: 155, protein: 12.7, carbs: 1.1, fat: 10.6 },
  鸡胸肉: { calories: 118, protein: 20.8, carbs: 1.7, fat: 2.5 },
  瘦牛肉: { calories: 106, protein: 20.2, carbs: 0.2, fat: 2.3 },
  瘦猪肉: { calories: 143, protein: 20.3, carbs: 0, fat: 6.2 },
  三文鱼: { calories: 139, protein: 20.4, carbs: 0, fat: 5.4 },
  // 蔬菜类
  西兰花: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  菠菜: { calories: 28, protein: 2.6, carbs: 4.5, fat: 0.3 },
  黄瓜: { calories: 16, protein: 0.8, carbs: 2.9, fat: 0.2 },
  番茄: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  胡萝卜: { calories: 41, protein: 1.0, carbs: 9.6, fat: 0.2 },
  // 水果类
  苹果: { calories: 52, protein: 0.3, carbs: 13.5, fat: 0.2 },
  香蕉: { calories: 91, protein: 1.4, carbs: 22.8, fat: 0.2 },
  草莓: { calories: 32, protein: 1.0, carbs: 7.7, fat: 0.3 },
  橙子: { calories: 47, protein: 0.9, carbs: 11.1, fat: 0.2 },
  蓝莓: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  // 乳制品/豆制品
  牛奶: { calories: 54, protein: 3.2, carbs: 4.8, fat: 1.5 },
  酸奶: { calories: 72, protein: 2.5, carbs: 9.3, fat: 2.7 },
  豆腐: { calories: 85, protein: 8.1, carbs: 4.2, fat: 3.7 },
  豆浆: { calories: 16, protein: 1.8, carbs: 1.1, fat: 0.7 },
  // 坚果类（少量）
  杏仁: { calories: 575, protein: 21.2, carbs: 21.7, fat: 49.4 }
};

// 根据AI识别的模糊名称匹配数据库（如"红苹果"匹配"苹果"）
export const matchFood = (foodName) => {
  const dbKeys = Object.keys(foodDatabase);
  // 模糊匹配：数据库名称包含识别名称 或 识别名称包含数据库名称
  const matchKey = dbKeys.find(key => 
    key.includes(foodName) || foodName.includes(key)
  );
  return matchKey ? foodDatabase[matchKey] : null;
};

// 导出完整数据库，供其他模块调用
export default foodDatabase;