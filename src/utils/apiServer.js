// src/utils/apiServer.js
// 统一后端服务：营养查询 + 健康计算 + 百度AI识别
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// ========== 1. 导入工具函数（需确保foodDatabase.js/healthCalculator.js在同目录） ==========
import { getNutrition } from './foodDatabase.js';
import { calculateBMI, calculateBMR, calculateDailyCalories, getBMICategory } from './healthCalculator.js';

// ========== 2. 核心配置（E同学确认/替换以下配置） ==========
// 百度AI密钥（已填充你提供的真实值）
const BAIDU_API_KEY = '2gVFAVI89KSIInO6YMCMGimSt';
const BAIDU_SECRET_KEY = 'xqmPDVOjZlq3MbNjL3bJUuLCQTe2yAvC';
// 服务端口（避免和前端冲突）
const PORT = 3001;
// 跨域配置（允许前端所有域名访问）
const CORS_OPTIONS = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// ========== 3. 创建Express应用 ==========
const app = express();
// 中间件配置：跨域 + 解析JSON/表单 + 支持大图片
app.use(cors(CORS_OPTIONS));
app.use(express.json({ limit: '20mb' })); // 支持20MB以内的Base64图片
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ========== 4. 工具函数：获取百度AI AccessToken（自动刷新） ==========
let accessToken = '';
let tokenExpireTime = 0; // 过期时间戳
async function refreshBaiduAccessToken() {
  // 若token未过期，直接返回
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://aip.baidubce.com/oauth/2.0/token',
      null,
      {
        params: {
          grant_type: 'client_credentials',
          client_id: BAIDU_API_KEY,
          client_secret: BAIDU_SECRET_KEY
        }
      }
    );
    accessToken = response.data.access_token;
    // token有效期2592000秒（30天），提前1小时过期
    tokenExpireTime = Date.now() + (response.data.expires_in - 3600) * 1000;
    console.log('✅ 百度AI AccessToken刷新成功，有效期至：', new Date(tokenExpireTime).toLocaleString());
    return accessToken;
  } catch (error) {
    console.error('❌ 百度AI AccessToken获取失败：', error.message);
    throw new Error('百度AI授权失败，请检查密钥是否正确');
  }
}

// ========== 5. 接口1：食物营养查询（适配拍照识别） ==========
app.post('/api/food/nutrition', (req, res) => {
  try {
    const { name } = req.body;
    // 参数校验
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        code: 400,
        msg: '参数错误：食物名称不能为空且需为字符串',
        data: null
      });
    }

    // 调用营养匹配函数
    const nutrition = getNutrition(name.trim());
    res.status(200).json({
      code: 200,
      msg: nutrition ? '营养数据获取成功' : '未匹配到该食物的营养数据',
      data: nutrition
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '营养查询接口异常',
      data: null,
      error: error.message
    });
  }
});

// ========== 6. 接口2：健康数据计算（BMI/BMR/每日热量） ==========
app.post('/api/health/calculate', (req, res) => {
  try {
    const { age, gender, weight, height, activityLevel = 'sedentary' } = req.body;
    // 参数校验
    const errors = [];
    if (!age || isNaN(age) || age < 10 || age > 100) errors.push('年龄需为10-100的有效数字');
    if (!gender) errors.push('性别不能为空（支持：男/女/male/female）');
    if (!weight || isNaN(weight) || weight <= 0) errors.push('体重需为大于0的数字（单位：kg）');
    if (!height || isNaN(height) || height <= 0) errors.push('身高需为大于0的数字（单位：m）');

    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        msg: `参数错误：${errors.join('；')}`,
        data: null
      });
    }

    // 计算核心健康数据
    const bmi = calculateBMI(Number(weight), Number(height));
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(Number(age), gender, Number(weight), Number(height));
    const dailyCalories = calculateDailyCalories(
      Number(age),
      gender,
      Number(weight),
      Number(height),
      activityLevel
    );

    res.status(200).json({
      code: 200,
      msg: '健康数据计算成功',
      data: {
        bmi,
        bmiCategory,
        bmr,
        dailyCalories,
        activityLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '健康计算接口异常',
      data: null,
      error: error.message
    });
  }
});

// ========== 7. 接口3：百度AI菜品识别（支持水果/蔬菜/菜肴） ==========
app.post('/api/recognize/dish', async (req, res) => {
  try {
    const { image } = req.body;
    // 参数校验
    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        code: 400,
        msg: '参数错误：图片Base64数据不能为空（需去除data:image前缀）',
        data: null
      });
    }

    // 获取有效AccessToken
    const token = await refreshBaiduAccessToken();
    // 调用百度菜品识别API
    const response = await axios.post(
      `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`,
      `image=${encodeURIComponent(image)}&top_num=3&filter_threshold=0.7`, // 置信度≥0.7
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    res.status(200).json({
      code: 200,
      msg: '菜品识别成功',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '菜品识别接口异常',
      data: null,
      error: error.message
    });
  }
});

// ========== 8. 接口4：百度AI食材识别（果蔬/食材精准识别） ==========
app.post('/api/recognize/ingredient', async (req, res) => {
  try {
    const { image } = req.body;
    // 参数校验
    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        code: 400,
        msg: '参数错误：图片Base64数据不能为空（需去除data:image前缀）',
        data: null
      });
    }

    // 获取有效AccessToken
    const token = await refreshBaiduAccessToken();
    // 调用百度食材识别组合API
    const response = await axios.post(
      `https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token=${token}`,
      {
        image: image,
        scenes: ['ingredient'] // 指定食材识别场景
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    res.status(200).json({
      code: 200,
      msg: '食材识别成功',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '食材识别接口异常',
      data: null,
      error: error.message
    });
  }
});

// ========== 9. 启动服务 ==========
app.listen(PORT, () => {
  console.log(`\n🚀 统一后端服务已启动！`);
  console.log(`📡 服务地址：http://localhost:${PORT}`);
  console.log(`🔧 接口列表：`);
  console.log(`  - 营养查询：POST /api/food/nutrition`);
  console.log(`  - 健康计算：POST /api/health/calculate`);
  console.log(`  - 菜品识别：POST /api/recognize/dish`);
  console.log(`  - 食材识别：POST /api/recognize/ingredient`);
  console.log(`\n💡 提示：启动后可直接通过Postman/前端调用上述接口`);
});

// ========== 10. 全局错误捕获 ==========
process.on('uncaughtException', (error) => {
  console.error('❌ 全局未捕获异常：', error.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('❌ 全局未处理Promise拒绝：', reason);
});