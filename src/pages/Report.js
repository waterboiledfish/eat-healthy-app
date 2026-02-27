import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
  const navigate = useNavigate();

  // ==================== 状态管理 ====================
  const [reportData, setReportData] = useState({
    // 识别结果
    foodName: '苹果',
    foodImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    confidence: 92,

    // 营养成分（每100克）
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,

    // 时间信息
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),

    // 用户信息
    userDailyCalories: 2000,
    userBmi: 21.2
  });

  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // ==================== 历史记录示例数据 ====================
  const mockHistory = [
    { id: 1, food: '苹果', calories: 52, time: '09:30', date: '2024-02-14' },
    { id: 2, food: '鸡蛋', calories: 155, time: '12:15', date: '2024-02-14' },
    { id: 3, food: '米饭', calories: 130, time: '18:30', date: '2024-02-14' },
    { id: 4, food: '香蕉', calories: 89, time: '10:20', date: '2024-02-13' },
    { id: 5, food: '牛奶', calories: 42, time: '22:00', date: '2024-02-13' }
  ];

  // ==================== 计算函数 ====================
  const calculateHealthScore = () => {
    let score = 70;
    if (reportData.fat < 5) score += 10;
    if (reportData.protein > 5) score += 10;
    if (reportData.fiber > 3) score += 10;
    if (reportData.sugar > 15) score -= 15;
    if (reportData.calories > 300) score -= 10;
    if (reportData.confidence > 90) score += 5;
    return Math.min(Math.max(score, 0), 100);
  };

  const getHealthLevel = (score) => {
    if (score >= 90) return { text: '非常健康', color: '#52c41a', icon: '🌟' };
    if (score >= 75) return { text: '比较健康', color: '#95de64', icon: '👍' };
    if (score >= 60) return { text: '基本健康', color: '#faad14', icon: '⚖️' };
    if (score >= 40) return { text: '需要注意', color: '#fa8c16', icon: '⚠️' };
    return { text: '不太健康', color: '#f5222d', icon: '❌' };
  };

  const getHealthAdvice = () => {
    const score = healthScore;
    const level = getHealthLevel(score);
    let advice = `本次识别的食物是${reportData.foodName}，${level.text}。`;
    if (reportData.fat > 10) {
      advice += '脂肪含量较高，建议适量食用。';
    } else if (reportData.protein > 10) {
      advice += '蛋白质丰富，有助于肌肉生长。';
    } else if (reportData.carbs > 20) {
      advice += '碳水化合物含量高，适合运动后补充能量。';
    } else if (reportData.fiber > 3) {
      advice += '膳食纤维丰富，有助于消化。';
    } else {
      advice += '营养成分均衡，可以作为日常饮食的一部分。';
    }
    return advice;
  };

  const getDailyPercentage = () => {
    return ((reportData.calories / reportData.userDailyCalories) * 100).toFixed(1);
  };

  const getFoodIcon = () => {
    const icons = {
      '苹果': '🍎',
      '鸡蛋': '🥚',
      '米饭': '🍚',
      '香蕉': '🍌',
      '牛奶': '🥛',
      '面包': '🍞',
      '鸡肉': '🍗',
      '牛肉': '🥩',
      '鱼': '🐟',
      '蔬菜': '🥦'
    };
    return icons[reportData.foodName] || '🍽️';
  };

  // ==================== 计算值 ====================
  const healthScore = calculateHealthScore();
  const healthLevel = getHealthLevel(healthScore);
  const healthAdvice = getHealthAdvice();
  const dailyPercentage = getDailyPercentage();

  // ==================== 事件处理 ====================
  const handleReshoot = () => {
    navigate('/camera');
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('已保存到历史记录');
    }, 1000);
  };

  const handleShare = () => {
    alert(`🍱 ${reportData.foodName}\n📊 健康评分: ${healthScore}分\n🔥 热量: ${reportData.calories}kcal`);
  };

  const handleViewHistory = () => {
    setHistoryData(mockHistory);
    setShowHistory(true);
  };

  const handleHistoryItemClick = (item) => {
    if (window.confirm(`是否加载${item.food}的营养报告？`)) {
      setReportData(prev => ({
        ...prev,
        foodName: item.food,
        calories: item.calories,
        time: item.time
      }));
      setShowHistory(false);
      alert('已加载历史记录');
    }
  };

  useEffect(() => {
    console.log('加载报告数据...');
  }, []);

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      paddingBottom: '30px'
    }}>
      {/* 头部渐变背景 */}
      <div style={{
        height: '160px',
        background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
        borderRadius: '0 0 30px 30px',
        position: 'relative',
        marginBottom: '20px'
      }}>
        {/* 返回按钮 */}
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

        {/* 页面标题 */}
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          paddingTop: '20px',
          margin: 0,
          fontSize: '20px'
        }}>
          健康报告
        </h2>

        {/* 时间显示 */}
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          fontSize: '12px',
          marginTop: '5px'
        }}>
          {reportData.date} {reportData.time}
        </p>

        {/* 食物图标大图 */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '80px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          {getFoodIcon()}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ padding: '0 16px' }}>
        {/* 食物名称和可信度 */}
        <div style={{
          marginTop: '50px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            margin: 0,
            color: '#333'
          }}>
            {reportData.foodName}
          </h1>
          <div style={{
            display: 'inline-block',
            background: '#e6f7ff',
            padding: '4px 12px',
            borderRadius: '20px',
            marginTop: '8px'
          }}>
            <span style={{ color: '#1890ff', fontSize: '14px' }}>
              🔍 识别可信度 {reportData.confidence}%
            </span>
          </div>
        </div>

        {/* 健康评分卡片 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
            本次饮食健康评分
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: healthLevel.color,
            lineHeight: 1
          }}>
            {healthScore}
            <span style={{ fontSize: '20px', color: '#999' }}>分</span>
          </div>
          <div style={{
            display: 'inline-block',
            background: healthLevel.color + '20',
            padding: '6px 16px',
            borderRadius: '20px',
            marginTop: '10px'
          }}>
            <span style={{ color: healthLevel.color, fontSize: '16px' }}>
              {healthLevel.icon} {healthLevel.text}
            </span>
          </div>

          {/* 评分进度条（自定义） */}
          <div style={{ marginTop: '20px' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${healthScore}%`,
                height: '100%',
                backgroundColor: healthLevel.color,
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </div>

        {/* 营养成分卡片 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#333',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🥗</span>
            营养成分（每100克）
          </h4>

          {/* 热量 */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>🔥 热量</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                {reportData.calories} kcal
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(reportData.calories / 5, 100)}%`,
                height: '100%',
                backgroundColor: '#fa8c16',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          {/* 三大营养素网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            marginTop: '15px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', color: '#1890ff' }}>💪</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {reportData.protein}g
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>蛋白质</div>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', color: '#52c41a' }}>🌾</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {reportData.carbs}g
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>碳水</div>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', color: '#f5222d' }}>💧</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {reportData.fat}g
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>脂肪</div>
            </div>
          </div>

          {/* 其他营养素 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '15px',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>膳食纤维</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                {reportData.fiber}g
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>糖分</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                {reportData.sugar}g
              </div>
            </div>
          </div>
        </div>

        {/* 每日摄入对比 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#333',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>⚖️</span>
            每日摄入对比
          </h4>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>本次摄入</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              {reportData.calories} kcal
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>每日推荐</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
              {reportData.userDailyCalories} kcal
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(dailyPercentage, 100)}%`,
              height: '100%',
              backgroundColor: dailyPercentage > 50 ? '#f5222d' : '#52c41a',
              borderRadius: '5px'
            }} />
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            marginTop: '10px'
          }}>
            占每日推荐热量的 {dailyPercentage}%
          </p>
        </div>

        {/* 健康建议卡片 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0',
            color: '#333',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>💡</span>
            健康建议
          </h4>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#666',
            margin: 0
          }}>
            {healthAdvice}
          </p>

          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: '#e6f7ff',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#1890ff' }}>
              💡 小贴士：{reportData.foodName}可以搭配蔬菜一起食用，营养更均衡。
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleReshoot}
            style={{
              width: '100%',
              borderRadius: '12px',
              height: '48px',
              fontSize: '16px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📷 重新拍照识别
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: '100%',
              borderRadius: '12px',
              height: '48px',
              fontSize: '16px',
              background: '#52c41a',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '保存中...' : '💾 保存到历史记录'}
          </button>

          <button
            onClick={handleShare}
            style={{
              width: '100%',
              borderRadius: '12px',
              height: '48px',
              fontSize: '16px',
              background: '#fa8c16',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📤 分享报告
          </button>

          <button
            onClick={handleViewHistory}
            style={{
              width: '100%',
              borderRadius: '12px',
              height: '48px',
              fontSize: '16px',
              background: '#722ed1',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📚 查看历史记录
          </button>
        </div>

        {/* 免责声明 */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fff2e8',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            ⚠️ 本报告基于AI识别结果和通用营养数据库生成，仅供参考，不能替代专业医疗建议。
          </p>
        </div>
      </div>

      {/* 历史记录弹窗（自定义模态框） */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowHistory(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            width: '300px',
            maxWidth: '90%',
            maxHeight: '60vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>历史记录</h4>
            <div style={{ padding: '0' }}>
              {historyData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleHistoryItemClick(item)}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>
                      {item.food === '苹果' ? '🍎' :
                       item.food === '鸡蛋' ? '🥚' :
                       item.food === '米饭' ? '🍚' :
                       item.food === '香蕉' ? '🍌' : '🥛'}
                    </span>
                    <div>
                      <div style={{ fontSize: '16px', color: '#333' }}>{item.food}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{item.date} {item.time}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#fa8c16' }}>
                    {item.calories}kcal
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;