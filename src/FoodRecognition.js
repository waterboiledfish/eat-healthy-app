// 简单模拟AI识别（先用假数据测试）
export const recognizeFood = async (imageFile) => {
  // 这里先用假数据，后面换成真实API
  const mockFoods = [
    { name: '苹果', calories: 52, confidence: 0.95 },
    { name: '香蕉', calories: 89, confidence: 0.88 },
    { name: '米饭', calories: 130, confidence: 0.82 },
    { name: '鸡蛋', calories: 155, confidence: 0.90 },
    { name: '面包', calories: 265, confidence: 0.85 },
  ];
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 随机返回一个食物（模拟识别结果）
  const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
  
  return {
    success: true,
    food: randomFood,
    message: '识别成功！'
  };
};

// 真实的API函数（备用）
export const recognizeFoodReal = async (imageFile) => {
  // 这里可以接入真实API，比如百度AI、腾讯AI
  // 今天先用模拟数据
  return recognizeFood(imageFile);
};