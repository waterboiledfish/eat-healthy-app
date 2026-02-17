
// src/FoodRecognition.js
// 百度AI菜品识别集成

// 你的凭证（出于安全考虑，生产环境应放在后端或环境变量）
const API_KEY = 'PlUxR12IPkSB7SWnjisxa3W8';
const SECRET_KEY = 'Hd1owJDCX4kDxXyxp7RWJH5vszK4Ui4F';
// 当前有效的 access_token，也可作为备选
const STATIC_TOKEN = '24.3f7931c6f0fb1897aac6f8c4d2ecf3b5.2592000.1773714229.282335-122092421';

/**
 * 从百度AI获取新的 access_token
 */
const fetchAccessToken = async () => {
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.access_token) {
      console.log('成功获取新 access_token');
      return data.access_token;
    } else {
      throw new Error('获取 token 失败：' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('获取 token 出错，使用静态 token 备用', error);
    return STATIC_TOKEN; // 失败时返回静态 token
  }
};

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
 * 真实的百度AI食物识别函数
 * @param {File} imageFile 用户上传的图片文件
 * @returns {Promise<Object>} 识别结果对象
 */
export const recognizeFood = async (imageFile) => {
  console.log('开始调用百度AI识别食物:', imageFile.name);

  // 1. 获取可用的 access_token（这里每次调用都获取，实际可缓存复用）
  const accessToken = await fetchAccessToken();

  // 2. 将图片转为 base64
  const imageBase64 = await fileToBase64(imageFile);

  // 3. 构建请求参数
  const url = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${accessToken}`;
  // 对 base64 进行 URL 编码
  const encodedImage = encodeURIComponent(imageBase64);
  const body = `image=${encodedImage}&top_num=5`; // 只取置信度最高的一个结果

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const result = await response.json();
    console.log('所有候选:', result.result);

    // 4. 处理返回结果
    if (result.error_code) {
      return {
        success: false,
        message: `识别失败 (${result.error_code}): ${result.error_msg}`,
      };
    }

    if (result.result && result.result.length > 0) {
      const topFood = result.result[0];
      return {
        success: true,
        food: {
          name: topFood.name,
          calories: topFood.calorie ? parseFloat(topFood.calorie) : null, // API 可能返回字符串
          confidence: parseFloat(topFood.probability),
          has_calorie: topFood.has_calorie || false,
          // 可以添加百科信息等
          baike_url: topFood.baike_info?.baike_url,
        },
        rawResult: result,
      };
    } else {
      return {
        success: false,
        message: '未能识别出食物',
      };
    }
  } catch (error) {
    console.error('网络或解析错误:', error);
    return {
      success: false,
      message: '识别过程中发生网络错误',
    };
  }
};

// 你可以暂时保留原来的模拟识别函数，方便在 token 失效时快速切换
export const recognizeFoodMock = async (imageFile) => {
  // ... 你之前的模拟逻辑 ...
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockFoods = [
    { name: '苹果', calories: 52, confidence: 0.95 },
    { name: '香蕉', calories: 89, confidence: 0.88 },
    { name: '米饭', calories: 130, confidence: 0.82 },

  ];
  const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
  return { success: true, food: randomFood };

};