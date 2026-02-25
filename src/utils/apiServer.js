// src/utils/apiServer.js
import express from 'express';
import cors from 'cors';
import { getNutrition } from './foodDatabase.js';
import { calculateBMI, calculateBMR, calculateDailyCalories, getBMICategory } from './healthCalculator.js';

// 创建Express应用
const app = express();
const PORT = 3001; // 接口端口，可自定义（避免和前端项目端口冲突）

// 中间件配置：允许跨域、解析JSON请求体
app.use(cors());
app.use(express.json()); // 解析前端传入的JSON数据

// 接口1：根据食物名称获取营养数据（适配拍照识别）
// 请求方式：POST
// 请求地址：http://localhost:3001/api/food/nutrition
app.post('/api/food/nutrition', (req, res) => {
  try {
    // 获取前端传入的食物名称（适配拍照识别的{name, confidence, type}格式）
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        code: 400,
        msg: '参数错误：食物名称不能为空',
        data: null
      });
    }

    // 调用营养匹配函数
    const nutrition = getNutrition(name);
    res.status(200).json({
      code: 200,
      msg: nutrition ? '获取营养数据成功' : '未匹配到该食物的营养数据',
      data: nutrition // 成功返回{calories, protein, carbs, fat}，失败返回null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误',
      data: null,
      error: error.message
    });
  }
});

// 接口2：计算用户BMR、BMI、每日推荐热量（适配个人资料/报告页）
// 请求方式：POST
// 请求地址：http://localhost:3001/api/health/calculate
app.post('/api/health/calculate', (req, res) => {
  try {
    // 获取前端传入的用户信息
    const { age, gender, weight, height, activityLevel = 'sedentary' } = req.body;

    // 参数校验
    const errors = [];
    if (!age || isNaN(age) || age < 10 || age > 100) errors.push('年龄需为10-100的数字');
    if (!gender) errors.push('性别不能为空（男/女/male/female）');
    if (!weight || isNaN(weight) || weight <= 0) errors.push('体重需为正数');
    if (!height || isNaN(height) || height <= 0) errors.push('身高需为正数（单位：米）');

    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        msg: '参数错误：' + errors.join('；'),
        data: null
      });
    }

    // 调用健康计算函数
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

    // 返回计算结果
    res.status(200).json({
      code: 200,
      msg: '健康数据计算成功',
      data: {
        bmi, // BMI值（保留1位小数）
        bmiCategory, // BMI健康状况（偏瘦/正常/超重/肥胖）
        bmr, // 基础代谢率（取整）
        dailyCalories, // 每日推荐热量（取整）
        activityLevel // 传入的活动量等级（便于前端展示）
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误',
      data: null,
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`健康数据接口服务已启动，地址：http://localhost:${PORT}`);
});