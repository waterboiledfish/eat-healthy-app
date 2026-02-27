// src/utils/healthCalculator.js
/**
 * 计算BMI身体质量指数
 * @param {number} weight 体重（kg）
 * @param {number} height 身高（m）
 * @returns {number|null} BMI值（保留1位小数），参数错误返回null
 */
export const calculateBMI = (weight, height) => {
  if (typeof weight !== 'number' || typeof height !== 'number' || weight <= 0 || height <= 0) {
    console.error('BMI计算参数错误：体重/身高必须为正数');
    return null;
  }
  const bmi = weight / (height * height);
  return parseFloat(bmi.toFixed(1));
};

/**
 * 计算基础代谢率（BMR）- Mifflin-St Jeor 公式
 * 修复点：修正了性别判断逻辑，确保中文 '男'/'女' 被正确转换
 * @param {number} age 年龄（岁）
 * @param {string} gender 性别（male/男 / female/女）
 * @param {number} weight 体重（kg）
 * @param {number} height 身高（m）
 * @returns {number|null} BMR值（取整），参数错误返回null
 */
export const calculateBMR = (age, gender, weight, height) => {
  // 参数校验
  if (
    typeof age !== 'number' || age < 10 || age > 100 ||
    typeof weight !== 'number' || weight <= 0 ||
    typeof height !== 'number' || height <= 0
  ) {
    console.error('BMR计算参数错误：年龄10-100岁，体重/身高为正数');
    return null;
  }

  // 修复核心逻辑：统一性别格式
  let genderType = 'unknown';
  const lowerGender = String(gender).toLowerCase().trim();
  if (lowerGender === '男' || lowerGender === 'male') {
    genderType = 'male';
  } else if (lowerGender === '女' || lowerGender === 'female') {
    genderType = 'female';
  }

  if (genderType === 'unknown') {
    console.error('BMR计算性别错误：仅支持male/男 或 female/女');
    return null;
  }

  let bmr;
  if (genderType === 'male') {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
  }

  return Math.round(bmr);
};

/**
 * 计算每日推荐摄入热量（TDEE = BMR × 活动系数）
 * @param {number} age 年龄（岁）
 * @param {string} gender 性别（male/男 / female/女）
 * @param {number} weight 体重（kg）
 * @param {number} height 身高（m）
 * @param {string} activityLevel 活动量等级
 * - sedentary: 久坐（办公室/学生）
 * - light: 轻度活动（每天散步30分钟）
 * - moderate: 中度活动（每天运动1小时）
 * - active: 高强度活动（每天健身/体力劳动）
 * @returns {number|null} 每日推荐热量（取整），参数错误返回null
 */
export const calculateDailyCalories = (age, gender, weight, height, activityLevel = 'sedentary') => {
  // 先计算BMR
  const bmr = calculateBMR(age, gender, weight, height);
  if (!bmr) return null; // BMR计算失败则直接返回null

  // 活动量系数
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  const factor = activityFactors[activityLevel] || 1.2;

  // 计算每日总热量消耗（TDEE）
  const tdee = bmr * factor;
  return Math.round(tdee);
};

/**
 * 根据BMI值返回健康状况描述
 * @param {number} bmi BMI值
 * @returns {string} 健康状况（偏瘦/正常/超重/肥胖），参数错误返回''
 */
export const getBMICategory = (bmi) => {
  if (typeof bmi !== 'number' || bmi < 0) return '';
  if (bmi < 18.5) return '偏瘦';
  if (bmi >= 18.5 && bmi < 24) return '正常';
  if (bmi >= 24 && bmi < 28) return '超重';
  return '肥胖';
};