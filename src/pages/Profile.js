import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  // ==================== 状态管理 ====================
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    nickname: '美食探索者',
    realName: '张三',
    gender: '男',
    birthday: new Date('2000-01-01'),
    age: 24,
    height: 175,
    weight: 70,

    exerciseFrequency: '每周2-3次',
    exerciseType: '跑步',
    dietHabit: '均衡饮食',
    sleepTime: '23:00',
    wakeTime: '07:00',
    hasSleepHabit: true,
    hasAllergy: false,
    allergyInfo: '',
    medicalHistory: '',
    healthGoals: '减脂增肌',

    bmi: 0,
    bmr: 0,
    dailyCalories: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');

  // ==================== 选项数据 ====================
  const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
    { label: '保密', value: '保密' }
  ];
  const exerciseFrequencyOptions = [
    { label: '几乎不运动', value: '几乎不运动' },
    { label: '每周1-2次', value: '每周1-2次' },
    { label: '每周2-3次', value: '每周2-3次' },
    { label: '每周3-5次', value: '每周3-5次' },
    { label: '每天运动', value: '每天运动' }
  ];
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
  const dietHabitOptions = [
    { label: '均衡饮食', value: '均衡饮食' },
    { label: '素食', value: '素食' },
    { label: '低碳水', value: '低碳水' },
    { label: '高蛋白', value: '高蛋白' },
    { label: '地中海饮食', value: '地中海饮食' },
    { label: '无特殊', value: '无特殊' }
  ];
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
  const calculateBMI = (height, weight) => {
    if (height && weight && height > 0) {
      const heightInM = height / 100;
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return 0;
  };
  const calculateBMR = (gender, weight, height, age) => {
    if (!weight || !height || !age) return 0;
    if (gender === '男') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };
  const calculateDailyCalories = (bmr, exerciseFrequency) => {
    if (!bmr) return 0;
    let activityFactor = 1.2;
    switch (exerciseFrequency) {
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
  useEffect(() => {
    updateHealthData();
  }, [userInfo.height, userInfo.weight, userInfo.age, userInfo.gender, userInfo.exerciseFrequency]);

  // ==================== 事件处理 ====================
  const updateField = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };
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
          alert('头像上传成功');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      alert('个人信息保存成功！');
      updateHealthData();
    }, 1500);
  };
  const handleCancel = () => {
    if (window.confirm('确定取消编辑吗？未保存的修改将丢失。')) {
      setIsEditing(false);
      alert('已取消编辑');
    }
  };
  const handleSetGoal = () => {
    if (tempGoal) {
      updateField('healthGoals', tempGoal);
      setShowGoalModal(false);
      alert('健康目标已更新');
    }
  };

  // 辅助渲染列表项（非编辑态）
  const renderInfoItem = (label, value) => (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value || '未设置'}</span>
    </div>
  );

  // 自定义选择下拉框（编辑态）
  const renderSelect = (label, value, options, onChange) => (
    <div style={styles.fieldContainer}>
      <span style={styles.fieldLabel}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
        disabled={!isEditing}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  // 自定义日期输入（编辑态）
  const renderDateInput = (label, value, onChange) => (
    <div style={styles.fieldContainer}>
      <span style={styles.fieldLabel}>{label}</span>
      <input
        type="date"
        value={value.toISOString().split('T')[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        style={styles.input}
        disabled={!isEditing}
      />
    </div>
  );

  // 自定义文本输入（编辑态）
  const renderTextInput = (label, value, onChange, type = 'text', suffix = '') => (
    <div style={styles.fieldContainer}>
      <span style={styles.fieldLabel}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
          disabled={!isEditing}
        />
        {suffix && <span style={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );

  // 开关
  const renderSwitch = (label, checked, onChange) => (
    <div style={styles.fieldContainer}>
      <span style={styles.fieldLabel}>{label}</span>
      <label style={styles.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!isEditing}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          ...styles.slider,
          backgroundColor: checked ? '#667eea' : '#ccc',
        }} />
      </label>
    </div>
  );

  // ==================== 渲染界面 ====================
  return (
    <div style={styles.container}>
      {/* 头部背景 */}
      <div style={styles.header}>
        <div style={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </div>
        <h2 style={styles.headerTitle}>个人资料</h2>
      </div>

      {/* 头像区域 */}
      <div style={styles.avatarSection}>
        <div
          onClick={isEditing ? handleAvatarUpload : undefined}
          style={styles.avatarContainer}
        >
          {userInfo.avatar ? (
            <img src={userInfo.avatar} alt="avatar" style={styles.avatarImg} />
          ) : (
            <span style={styles.avatarPlaceholder}>👤</span>
          )}
          {isEditing && (
            <div style={styles.avatarEditIcon}>
              📷
            </div>
          )}
        </div>
        <h3 style={styles.nickname}>{userInfo.nickname}</h3>
        <p style={styles.genderAge}>{userInfo.gender} · {userInfo.age}岁</p>
      </div>

      {/* 编辑/保存按钮 */}
      <div style={styles.editButtonBar}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            编辑资料
          </button>
        ) : (
          <div style={styles.editActions}>
            <button onClick={handleCancel} style={styles.cancelButton}>
              取消
            </button>
            <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        )}
      </div>

      {/* 健康数据卡片 */}
      <div style={styles.healthCard}>
        <h4 style={styles.cardTitle}>📊 今日健康数据</h4>
        <div style={styles.healthStats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userInfo.bmi}</div>
            <div style={styles.statLabel}>BMI</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userInfo.bmr}</div>
            <div style={styles.statLabel}>基础代谢</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{userInfo.dailyCalories}</div>
            <div style={styles.statLabel}>每日热量</div>
          </div>
        </div>
        {/* BMI状态条 */}
        <div style={styles.bmiSlider}>
          <div style={styles.bmiLabels}>
            <span>偏瘦</span><span>正常</span><span>偏胖</span><span>肥胖</span>
          </div>
          <div style={styles.bmiTrack}>
            <div style={{
              ...styles.bmiIndicator,
              left: `${Math.min(Math.max((userInfo.bmi - 15) / 25 * 100, 0), 100)}%`,
            }} />
          </div>
        </div>
      </div>

      {/* 基本信息 */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>📋 基本信息</h4>
        <div style={styles.infoList}>
          {renderTextInput('真实姓名', userInfo.realName, (val) => updateField('realName', val), 'text')}
          {renderTextInput('昵称', userInfo.nickname, (val) => updateField('nickname', val), 'text')}
          {renderSelect('性别', userInfo.gender, genderOptions, (val) => updateField('gender', val))}
          {renderDateInput('出生日期', userInfo.birthday, (val) => {
            updateField('birthday', val);
            updateField('age', new Date().getFullYear() - val.getFullYear());
          })}
          {renderTextInput('年龄', userInfo.age, (val) => updateField('age', Number(val)), 'number')}
          {renderTextInput('身高', userInfo.height, (val) => updateField('height', Number(val)), 'number', 'cm')}
          {renderTextInput('体重', userInfo.weight, (val) => updateField('weight', Number(val)), 'number', 'kg')}
        </div>
      </div>

      {/* 健康习惯 */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>🏃 健康习惯</h4>
        <div style={styles.infoList}>
          {renderSelect('运动频率', userInfo.exerciseFrequency, exerciseFrequencyOptions, (val) => updateField('exerciseFrequency', val))}
          {renderSelect('主要运动', userInfo.exerciseType, exerciseTypeOptions, (val) => updateField('exerciseType', val))}
          {renderSelect('饮食习惯', userInfo.dietHabit, dietHabitOptions, (val) => updateField('dietHabit', val))}
          {renderSwitch('是否有规律作息', userInfo.hasSleepHabit, (val) => updateField('hasSleepHabit', val))}
          {userInfo.hasSleepHabit && (
            <>
              {renderTextInput('😴 睡觉时间', userInfo.sleepTime, (val) => updateField('sleepTime', val), 'text')}
              {renderTextInput('🌅 起床时间', userInfo.wakeTime, (val) => updateField('wakeTime', val), 'text')}
            </>
          )}
        </div>
      </div>

      {/* 健康信息 */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>❤️ 健康信息</h4>
        <div style={styles.infoList}>
          {renderSwitch('是否有过敏史', userInfo.hasAllergy, (val) => updateField('hasAllergy', val))}
          {userInfo.hasAllergy && (
            renderTextInput('⚠️ 过敏详情', userInfo.allergyInfo, (val) => updateField('allergyInfo', val), 'text')
          )}
          {renderTextInput('📋 既往病史', userInfo.medicalHistory, (val) => updateField('medicalHistory', val), 'text')}
          <div
            style={{ ...styles.infoItem, cursor: isEditing ? 'pointer' : 'default' }}
            onClick={() => isEditing && setShowGoalModal(true)}
          >
            <span style={styles.infoLabel}>🎯 健康目标</span>
            <span style={styles.infoValue}>{userInfo.healthGoals}</span>
          </div>
        </div>
      </div>

      {/* 本周进度 */}
      <div style={styles.healthCard}>
        <h4 style={styles.cardTitle}>📈 本周进度</h4>
        <div style={styles.progressItem}>
          <div style={styles.progressLabel}>
            <span>运动完成</span>
            <span>3/5次</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '60%' }} />
          </div>
        </div>
        <div style={styles.progressItem}>
          <div style={styles.progressLabel}>
            <span>饮食记录</span>
            <span>5/7天</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '71%' }} />
          </div>
        </div>
        <div style={styles.progressItem}>
          <div style={styles.progressLabel}>
            <span>目标进度</span>
            <span>减脂2.5/5kg</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '50%' }} />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={styles.actionButtons}>
        <button onClick={() => navigate('/camera')} style={styles.primaryButton}>
          📷 去拍照识别食物
        </button>
        <button onClick={() => navigate('/report')} style={styles.secondaryButton}>
          📊 查看历史报告
        </button>
      </div>

      {/* 退出登录 */}
      <div style={styles.logoutContainer}>
        <a
          href="#"
          style={styles.logoutLink}
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm('确定要退出登录吗？')) {
              alert('已退出登录');
              navigate('/');
            }
          }}
        >
          退出登录
        </a>
      </div>

      {/* 健康目标弹窗（模拟模态框） */}
      {showGoalModal && (
        <div style={styles.modalOverlay} onClick={() => setShowGoalModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h4 style={styles.modalTitle}>设置健康目标</h4>
            <div style={styles.goalGrid}>
              {goalOptions.map(goal => (
                <div
                  key={goal}
                  onClick={() => setTempGoal(goal)}
                  style={{
                    ...styles.goalItem,
                    backgroundColor: tempGoal === goal ? '#667eea' : '#f5f5f5',
                    color: tempGoal === goal ? 'white' : '#666',
                  }}
                >
                  {goal}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="或自定义目标"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              style={styles.modalInput}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setShowGoalModal(false)} style={styles.modalCancel}>
                取消
              </button>
              <button onClick={handleSetGoal} style={styles.modalConfirm}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 样式对象 ====================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    paddingBottom: '30px',
    padding: '0 16px',
    fontFamily: 'sans-serif',
  },
  header: {
    height: '120px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 0 30px 30px',
    position: 'relative',
    marginBottom: '60px',
    marginLeft: '-16px',
    marginRight: '-16px',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    paddingTop: '20px',
    margin: 0,
    fontSize: '20px',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '-80px',
    position: 'relative',
    zIndex: 20,
  },
  avatarContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '4px solid white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '36px',
    position: 'relative',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '36px',
  },
  avatarEditIcon: {
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
    border: '2px solid white',
  },
  nickname: {
    marginTop: '12px',
    fontSize: '20px',
    color: '#333',
  },
  genderAge: {
    fontSize: '14px',
    color: '#999',
    marginTop: '4px',
  },
  editButtonBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '20px 0',
  },
  editButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  editActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelButton: {
    background: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    opacity: 1,
    ':disabled': {
      opacity: 0.6,
    },
  },
  healthCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    margin: '0 0 15px 0',
    color: '#667eea',
    fontSize: '16px',
  },
  healthStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '15px',
    textAlign: 'center',
    marginBottom: '15px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '12px',
    color: '#999',
  },
  bmiSlider: {
    marginTop: '10px',
  },
  bmiLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#999',
    marginBottom: '5px',
  },
  bmiTrack: {
    height: '6px',
    background: 'linear-gradient(90deg, #52c41a 0%, #52c41a 30%, #faad14 30%, #faad14 70%, #f5222d 70%, #f5222d 100%)',
    borderRadius: '3px',
    position: 'relative',
  },
  bmiIndicator: {
    width: '8px',
    height: '14px',
    background: '#333',
    borderRadius: '4px',
    position: 'absolute',
    top: '-4px',
    transform: 'translateX(-50%)',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    color: '#667eea',
    fontSize: '16px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
  },
  infoValue: {
    fontSize: '14px',
    color: '#333',
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px',
  },
  fieldLabel: {
    fontSize: '14px',
    color: '#666',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  suffix: {
    marginLeft: '8px',
    fontSize: '14px',
    color: '#999',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px',
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '24px',
    '&:before': {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
    },
  },
  progressItem: {
    marginBottom: '15px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#666',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  actionButtons: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  primaryButton: {
    width: '100%',
    borderRadius: '12px',
    height: '48px',
    fontSize: '16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: '12px',
    height: '48px',
    fontSize: '16px',
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    cursor: 'pointer',
  },
  logoutContainer: {
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '20px',
  },
  logoutLink: {
    color: '#ff4d4f',
    fontSize: '14px',
    textDecoration: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    width: '300px',
    maxWidth: '90%',
  },
  modalTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333',
  },
  goalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
  },
  goalItem: {
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  modalInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '15px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  modalCancel: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
  },
  modalConfirm: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#667eea',
    color: 'white',
    cursor: 'pointer',
  },
};

export default Profile;