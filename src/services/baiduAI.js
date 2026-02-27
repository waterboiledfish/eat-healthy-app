// src/services/baiduAI.js

/**
 * 将图片文件转换为 base64 字符串（去掉前缀）
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // 去掉 "data:image/jpeg;base64," 部分
    reader.onerror = error => reject(error);
  });
};

/**
 * 调用后端菜品识别代理
 */
export const recognizeDish = async (imageFile) => {
  try {
    const imageBase64 = await fileToBase64(imageFile);
    const response = await fetch('http://localhost:8000/api/recognize/dish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    });
    const result = await response.json();
    console.log('菜品识别结果:', result);
    return result;
  } catch (error) {
    console.error('菜品识别错误:', error);
    return { error_code: 1, error_msg: '网络错误' };
  }
};

/**
 * 调用后端果蔬识别代理
 */
export const recognizeIngredient = async (imageFile) => {
  try {
    const imageBase64 = await fileToBase64(imageFile);
    const response = await fetch('http://localhost:8000/api/recognize/ingredient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    });
    const result = await response.json();
    console.log('果蔬识别结果:', result);
    return result;
  } catch (error) {
    console.error('果蔬识别错误:', error);
    return { error_code: 1, error_msg: '网络错误' };
  }
};

/**
 * 智能识别：优先尝试果蔬识别，如果置信度低则尝试菜品识别
 */
export const recognizeFood = async (imageFile) => {
  // 先尝试果蔬识别
  const ingredientResult = await recognizeIngredient(imageFile);
  // 判断是否成功且有结果
  if (ingredientResult && !ingredientResult.error_code && 
      ingredientResult.result?.ingredient?.result?.length > 0) {
    const top = ingredientResult.result.ingredient.result[0];
    // 如果置信度足够高（例如 > 0.6），直接返回
    if (parseFloat(top.score) > 0.6) {
      return {
        success: true,
        food: {
          name: top.name,
          confidence: Math.round(parseFloat(top.score) * 100),
          type: 'ingredient'
        },
        source: 'ingredient'
      };
    }
  }

  // 果蔬识别失败或置信度低，尝试菜品识别
  const dishResult = await recognizeDish(imageFile);
  if (dishResult && !dishResult.error_code && dishResult.result?.length > 0) {
    const top = dishResult.result[0];
    return {
      success: true,
      food: {
        name: top.name,
        calories: top.calorie ? parseFloat(top.calorie) : 0,
        confidence: Math.round(parseFloat(top.probability) * 100),
        type: 'dish'
      },
      source: 'dish'
    };
  }

  return { success: false, message: '无法识别食物' };
};