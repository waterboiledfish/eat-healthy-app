/**
 * 计算BMI身体质量指数
 * @param {number} weight 体重（单位：kg）
 * @param {number} height 身高（单位：m）
 * @returns {number} BMI值（保留1位小数），参数错误返回null
 */
export const calculateBMI = (weight, height) => {
  // 参数校验：体重/身高为正数
  if (typeof weight !== 'number' || typeof height !== 'number' || weight <= 0 || height <= 0) {
    console.error('BMI计算参数错误：体重和身高必须为正数');
    return null;
  }
  const bmi = weight / (height * height);
  return parseFloat(bmi.toFixed(1));
};

/**
 * 计算每日推荐摄入热量（Mifflin-St Jeor公式，简化版）
 * @param {number} age 年龄（岁）
 * @param {string} gender 性别（male/女: female）
 * @param {number} weight 体重（kg）
 * @param {number} height 身高（m）
 * @param {string} activityLevel 活动量等级（sedentary/light/moderate/active）
 * - sedentary: 久坐（办公室/学生）
 * - light: 轻度活动（每天散步30分钟）
 * - moderate: 中度活动（每天运动1小时）
 * - active: 高强度活动（每天健身/体力劳动）
 * @returns {number} 每日推荐热量（取整），参数错误返回null
 */
export const calculateDailyCalories = (age, gender, weight, height, activityLevel = 'sedentary') => {
  // 参数校验
  if (
    typeof age !== 'number' || age < 10 || age > 100 ||
    !['male', 'female'].includes(gender) ||
    typeof weight !== 'number' || weight <= 0 ||
    typeof height !== 'number' || height <= 0
  ) {
    console.error('每日热量计算参数错误，请检查输入');
    return null;
  }

  // 基础代谢率（BMR）
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
  }

  // 活动量系数
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  const factor = activityFactors[activityLevel] || 1.2;

  // 每日推荐热量 = BMR * 活动量系数
  const dailyCal = bmr * factor;
  return Math.round(dailyCal);
};

/**
 * 根据BMI值返回健康状况描述（适配报告展示）
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