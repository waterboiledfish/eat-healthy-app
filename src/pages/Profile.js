// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import {
  List,
  Input,
  PickerView,
  DatePicker,
  Switch,
  Button,
  Toast,
  Modal,
  ProgressBar,
  Image
} from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  
  // ==================== 状态管理 ====================
  // 用户基本信息 - 确保所有数组值非空，避免map报错
  const [userInfo, setUserInfo] = useState({
    avatar: '',                    // 头像
    nickname: '美食探索者',        // 昵称
    realName: '张三',              // 真实姓名
    gender: '男',                  // 改为字符串，适配PickerView
    birthday: new Date('2000-01-01'), // 生日
    age: 24,                       // 年龄
    height: 175,                   // 身高(cm)
    weight: 70,                    // 体重(kg)
    
    // 健身作息习惯 - 改为字符串，适配PickerView
    exerciseFrequency: '每周2-3次',
    exerciseType: '跑步',
    dietHabit: '均衡饮食',
    sleepTime: '23:00',            // 睡觉时间
    wakeTime: '07:00',             // 起床时间
    hasSleepHabit: true,           // 是否有规律作息
    hasAllergy: false,             // 是否有过敏史
    allergyInfo: '',               // 过敏详情
    medicalHistory: '',            // 病史
    healthGoals: '减脂增肌',       // 健康目标
    
    // 健康数据
    bmi: 0,                        // BMI指数
    bmr: 0,                        // 基础代谢率
    dailyCalories: 0,              // 每日推荐热量
  });
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');

  // ==================== 选项数据 - 扁平化格式，适配PickerView ====================
  // 性别选项
  const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
    { label: '保密', value: '保密' }
  ];
  // 运动频率选项
  const exerciseFrequencyOptions = [
    { label: '几乎不运动', value: '几乎不运动' },
    { label: '每周1-2次', value: '每周1-2次' },
    { label: '每周2-3次', value: '每周2-3次' },
    { label: '每周3-5次', value: '每周3-5次' },
    { label: '每天运动', value: '每天运动' }
  ];
  // 运动类型选项
  const exerciseTypeOptions = [
    { label: '跑步', value: '跑步' },
    { label: '游泳', value: '游泳' },
    { label: '瑜伽', value: '瑜伽' },
    { label: '力量训练', value: '力量训练' },
    { label: '球类运动', value: '球类运动' },
    { label: '健身操', value: '健身操' },
    { label: '骑行', value: '骑行' },
    { label: '其他', value: '其他' }
  ];
  // 饮食习惯选项
  const dietHabitOptions = [
    { label: '均衡饮食', value: '均衡饮食' },
    { label: '素食', value: '素食' },
    { label: '低碳水', value: '低碳水' },
    { label: '高蛋白', value: '高蛋白' },
    { label: '地中海饮食', value: '地中海饮食' },
    { label: '无特殊', value: '无特殊' }
  ];
  // 健康目标选项
  const goalOptions = [
    '减脂',
    '增肌',
    '保持体重',
    '改善睡眠',
    '增强体质',
    '提高运动表现',
    '改善饮食习惯'
  ];

  // ==================== 计算函数 ====================
  // 计算BMI
  const calculateBMI = (height, weight) => {
    if (height && weight && height > 0) {
      const heightInM = height / 100;
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return 0;
  };
  // 计算BMR（基础代谢率，使用Mifflin-St Jeor公式）
  const calculateBMR = (gender, weight, height, age) => {
    if (!weight || !height || !age) return 0;
    if (gender === '男') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };
  // 根据运动频率计算每日所需热量
  const calculateDailyCalories = (bmr, exerciseFrequency) => {
    if (!bmr) return 0;
    // 活动系数
    let activityFactor = 1.2; // 久坐
    switch(exerciseFrequency) {
      case '每周1-2次':
        activityFactor = 1.375;
        break;
      case '每周2-3次':
        activityFactor = 1.55;
        break;
      case '每周3-5次':
        activityFactor = 1.725;
        break;
      case '每天运动':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }
    return Math.round(bmr * activityFactor);
  };
  // 更新健康数据
  const updateHealthData = () => {
    const bmi = calculateBMI(userInfo.height, userInfo.weight);
    const bmr = calculateBMR(
      userInfo.gender, 
      userInfo.weight, 
      userInfo.height, 
      userInfo.age
    );
    const dailyCalories = calculateDailyCalories(bmr, userInfo.exerciseFrequency);
    setUserInfo(prev => ({
      ...prev,
      bmi,
      bmr,
      dailyCalories
    }));
  };
  // 当身高、体重、年龄、性别、运动频率变化时重新计算
  useEffect(() => {
    updateHealthData();
  }, [userInfo.height, userInfo.weight, userInfo.age, userInfo.gender, userInfo.exerciseFrequency]);

  // ==================== 事件处理 ====================
  // 更新字段
  const updateField = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // 处理头像上传
  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUserInfo(prev => ({ ...prev, avatar: event.target.result }));
          Toast.show({ icon: 'success', content: '头像上传成功' });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  // 保存个人信息
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      Toast.show({ icon: 'success', content: '个人信息保存成功！' });
      updateHealthData();
    }, 1500);
  };
  // 取消编辑
  const handleCancel = () => {
    Modal.confirm({
      title: '提示',
      content: '确定取消编辑吗？未保存的修改将丢失。',
      onConfirm: () => {
        setIsEditing(false);
        Toast.show({ icon: 'info', content: '已取消编辑' });
      }
    });
  };
  // 设置健康目标
  const handleSetGoal = () => {
    if (tempGoal) {
      updateField('healthGoals', tempGoal);
      setShowGoalModal(false);
      Toast.show({ icon: 'success', content: '健康目标已更新' });
    }
  };

  // ==================== 渲染自定义选择项（适配非编辑状态） ====================
  const renderSelectItem = (label, value) => (
    <List.Item 
      arrow={isEditing ? 'horizontal' : 'empty'}
      style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{label}</span>
        <span style={{ color: '#667eea' }}>{value || '未设置'}</span>
      </div>
    </List.Item>
  );

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      paddingBottom: '30px',
      padding: '0 16px'
    }}>
      {/* 头部背景 */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '0 0 30px 30px',
        position: 'relative',
        marginBottom: '60px',
        marginLeft: '-16px',
        marginRight: '-16px'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 10
        }} onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          paddingTop: '20px',
          margin: 0,
          fontSize: '20px'
        }}>
          个人资料
        </h2>
      </div>

      {/* 头像区域 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '-80px',
        position: 'relative',
        zIndex: 20
      }}>
        <div
          onClick={isEditing ? handleAvatarUpload : undefined}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: userInfo.avatar 
              ? `url(${userInfo.avatar}) center/cover` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: isEditing ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px'
          }}
        >
          {!userInfo.avatar && '👤'}
          {isEditing && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#667eea',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              border: '2px solid white'
            }}>
              📷
            </div>
          )}
        </div>
        <h3 style={{ marginTop: '12px', fontSize: '20px', color: '#333' }}>
          {userInfo.nickname}
        </h3>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
          {userInfo.gender} · {userInfo.age}岁
        </p>
      </div>

      {/* 编辑/保存按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '20px 0'
      }}>
        {!isEditing ? (
          <Button
            color="primary"
            onClick={() => setIsEditing(true)}
            size="small"
            style={{ '--border-radius': '20px', padding: '0 20px' }}
          >
            编辑资料
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={handleCancel}
              size="small"
              style={{ '--border-radius': '20px', padding: '0 20px' }}
            >
              取消
            </Button>
            <Button
              color="primary"
              onClick={handleSave}
              loading={loading}
              size="small"
              style={{ '--border-radius': '20px', padding: '0 20px' }}
            >
              保存
            </Button>
          </div>
        )}
      </div>

      {/* 健康数据卡片 */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#667eea', fontSize: '16px' }}>
          📊 今日健康数据
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{userInfo.bmi}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>BMI</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{userInfo.bmr}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>基础代谢</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{userInfo.dailyCalories}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>每日热量</div>
          </div>
        </div>
        {/* BMI状态条 */}
        <div style={{ marginTop: '15px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#999',
            marginBottom: '5px'
          }}>
            <span>偏瘦</span><span>正常</span><span>偏胖</span><span>肥胖</span>
          </div>
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, #52c41a 0%, #52c41a 30%, #faad14 30%, #faad14 70%, #f5222d 70%, #f5222d 100%)',
            borderRadius: '3px',
            position: 'relative'
          }}>
            <div style={{
              width: '8px',
              height: '14px',
              background: '#333',
              borderRadius: '4px',
              position: 'absolute',
              top: '-4px',
              left: `${Math.min(Math.max((userInfo.bmi - 15) / 25 * 100, 0), 100)}%`,
              transform: 'translateX(-50%)'
            }} />
          </div>
        </div>
      </div>

      {/* 基本信息列表 */}
      <List renderHeader={() => '📋 基本信息'} style={{ marginBottom: '20px' }}>
        {/* 真实姓名 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>真实姓名</span>
            <Input
              placeholder="请输入真实姓名"
              value={userInfo.realName}
              onChange={val => updateField('realName', val)}
              disabled={!isEditing}
              clearable
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
            />
          </div>
        </List.Item>
        {/* 昵称 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>昵称</span>
            <Input
              placeholder="请输入昵称"
              value={userInfo.nickname}
              onChange={val => updateField('nickname', val)}
              disabled={!isEditing}
              clearable
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
            />
          </div>
        </List.Item>
        {/* 性别选择 - 编辑态用PickerView，非编辑态用普通文本 */}
        {isEditing ? (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>性别</span>
              <PickerView
                options={genderOptions}
                value={userInfo.gender}
                onChange={val => updateField('gender', val)}
                style={{ '--border-radius': '8px' }}
              />
            </div>
          </List.Item>
        ) : renderSelectItem('性别', userInfo.gender)}

        {/* 生日选择 */}
        {isEditing ? (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>出生日期</span>
              <DatePicker
                value={userInfo.birthday}
                onChange={val => {
                  updateField('birthday', val);
                  updateField('age', new Date().getFullYear() - val.getFullYear());
                }}
                mode="date"
                style={{ '--border-radius': '8px' }}
              />
            </div>
          </List.Item>
        ) : renderSelectItem('出生日期', userInfo.birthday.toLocaleDateString())}

        {/* 年龄 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>年龄</span>
            <Input
              type="number"
              placeholder="年龄"
              value={String(userInfo.age)}
              onChange={val => updateField('age', Number(val))}
              disabled={!isEditing}
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
            />
          </div>
        </List.Item>
        {/* 身高 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>身高</span>
            <Input
              type="number"
              placeholder="身高(cm)"
              value={String(userInfo.height)}
              onChange={val => updateField('height', Number(val))}
              disabled={!isEditing}
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
              suffix="cm"
            />
          </div>
        </List.Item>
        {/* 体重 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>体重</span>
            <Input
              type="number"
              placeholder="体重(kg)"
              value={String(userInfo.weight)}
              onChange={val => updateField('weight', Number(val))}
              disabled={!isEditing}
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
              suffix="kg"
            />
          </div>
        </List.Item>
      </List>

      {/* 健康习惯 */}
      <List renderHeader={() => '🏃 健康习惯'} style={{ marginBottom: '20px' }}>
        {/* 运动频率 */}
        {isEditing ? (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>运动频率</span>
              <PickerView
                options={exerciseFrequencyOptions}
                value={userInfo.exerciseFrequency}
                onChange={val => updateField('exerciseFrequency', val)}
                style={{ '--border-radius': '8px' }}
              />
            </div>
          </List.Item>
        ) : renderSelectItem('运动频率', userInfo.exerciseFrequency)}

        {/* 主要运动 */}
        {isEditing ? (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>主要运动</span>
              <PickerView
                options={exerciseTypeOptions}
                value={userInfo.exerciseType}
                onChange={val => updateField('exerciseType', val)}
                style={{ '--border-radius': '8px' }}
              />
            </div>
          </List.Item>
        ) : renderSelectItem('主要运动', userInfo.exerciseType)}

        {/* 饮食习惯 */}
        {isEditing ? (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>饮食习惯</span>
              <PickerView
                options={dietHabitOptions}
                value={userInfo.dietHabit}
                onChange={val => updateField('dietHabit', val)}
                style={{ '--border-radius': '8px' }}
              />
            </div>
          </List.Item>
        ) : renderSelectItem('饮食习惯', userInfo.dietHabit)}

        {/* 规律作息开关 */}
        <List.Item
          extra={<Switch
            checked={userInfo.hasSleepHabit}
            onChange={val => updateField('hasSleepHabit', val)}
            disabled={!isEditing}
          />}
        >
          是否有规律作息
        </List.Item>

        {/* 作息时间 */}
        {userInfo.hasSleepHabit && (
          <>
            <List.Item>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>😴 睡觉时间</span>
                <Input
                  placeholder="睡觉时间"
                  value={userInfo.sleepTime}
                  onChange={val => updateField('sleepTime', val)}
                  disabled={!isEditing}
                  style={{ '--border-radius': '8px', '--font-size': '14px' }}
                />
              </div>
            </List.Item>
            <List.Item>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>🌅 起床时间</span>
                <Input
                  placeholder="起床时间"
                  value={userInfo.wakeTime}
                  onChange={val => updateField('wakeTime', val)}
                  disabled={!isEditing}
                  style={{ '--border-radius': '8px', '--font-size': '14px' }}
                />
              </div>
            </List.Item>
          </>
        )}
      </List>

      {/* 健康信息 */}
      <List renderHeader={() => '❤️ 健康信息'} style={{ marginBottom: '20px' }}>
        {/* 过敏史开关 */}
        <List.Item
          extra={<Switch
            checked={userInfo.hasAllergy}
            onChange={val => updateField('hasAllergy', val)}
            disabled={!isEditing}
          />}
        >
          是否有过敏史
        </List.Item>
        {/* 过敏详情 */}
        {userInfo.hasAllergy && (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>⚠️ 过敏详情</span>
              <Input
                placeholder="请描述过敏情况"
                value={userInfo.allergyInfo}
                onChange={val => updateField('allergyInfo', val)}
                disabled={!isEditing}
                clearable
                style={{ '--border-radius': '8px', '--font-size': '14px' }}
              />
            </div>
          </List.Item>
        )}
        {/* 既往病史 */}
        <List.Item>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>📋 既往病史</span>
            <Input
              placeholder="既往病史（选填）"
              value={userInfo.medicalHistory}
              onChange={val => updateField('medicalHistory', val)}
              disabled={!isEditing}
              clearable
              style={{ '--border-radius': '8px', '--font-size': '14px' }}
            />
          </div>
        </List.Item>
        {/* 健康目标 */}
        <List.Item
          arrow={isEditing ? 'horizontal' : 'empty'}
          onClick={() => isEditing && setShowGoalModal(true)}
          style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>🎯 健康目标</span>
            <span style={{ color: '#667eea' }}>{userInfo.healthGoals}</span>
          </div>
        </List.Item>
      </List>

      {/* 历史记录汇总 */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#667eea', fontSize: '16px' }}>
          📈 本周进度
        </h4>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>运动完成</span>
            <span style={{ fontSize: '14px', color: '#333' }}>3/5次</span>
          </div>
          <ProgressBar percent={60} color="#667eea" style={{ '--height': '6px', '--border-radius': '3px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>饮食记录</span>
            <span style={{ fontSize: '14px', color: '#333' }}>5/7天</span>
          </div>
          <ProgressBar percent={71} color="#667eea" style={{ '--height': '6px', '--border-radius': '3px' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>目标进度</span>
            <span style={{ fontSize: '14px', color: '#333' }}>减脂2.5/5kg</span>
          </div>
          <ProgressBar percent={50} color="#667eea" style={{ '--height': '6px', '--border-radius': '3px' }} />
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ marginTop: '30px' }}>
        <Button
          color="primary"
          onClick={() => navigate('/camera')}
          block
          style={{ '--border-radius': '12px', height: '48px', fontSize: '16px', marginBottom: '10px' }}
        >
          📷 去拍照识别食物
        </Button>
        <Button
          onClick={() => navigate('/report')}
          block
          style={{ '--border-radius': '12px', height: '48px', fontSize: '16px' }}
        >
          📊 查看历史报告
        </Button>
      </div>

      {/* 退出登录 */}
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <a
          href="#"
          style={{ color: '#ff4d4f', fontSize: '14px', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            Modal.confirm({
              title: '提示',
              content: '确定要退出登录吗？',
              onConfirm: () => {
                Toast.show({ icon: 'success', content: '已退出登录' });
                navigate('/');
              }
            });
          }}
        >
          退出登录
        </a>
      </div>

      {/* 健康目标弹窗 */}
      <Modal
        visible={showGoalModal}
        title="设置健康目标"
        closeOnAction
        onClose={() => setShowGoalModal(false)}
        actions={[
          { key: 'cancel', text: '取消', onClick: () => setShowGoalModal(false) },
          { key: 'confirm', text: '确定', primary: true, onClick: handleSetGoal }
        ]}
      >
        <div style={{ padding: '10px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '15px'
          }}>
            {goalOptions.map(goal => (
              <div
                key={goal}
                onClick={() => setTempGoal(goal)}
                style={{
                  padding: '12px',
                  background: tempGoal === goal ? '#667eea' : '#f5f5f5',
                  color: tempGoal === goal ? 'white' : '#666',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                {goal}
              </div>
            ))}
          </div>
          <Input
            placeholder="或自定义目标"
            value={tempGoal}
            onChange={setTempGoal}
            clearable
            style={{ '--border-radius': '8px', '--font-size': '14px' }}
          />
        </div>
      </Modal>

      {/* 全局样式 */}
      <style global>{`
        .am-list {
          --border-color: transparent !important;
        }
        .am-list-item {
          padding: 12px 0 !important;
          border-bottom: 1px solid #f5f5f5 !important;
        }
        .am-list-item:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}

export default Profile;
