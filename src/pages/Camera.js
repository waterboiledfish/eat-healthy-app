// src/pages/Camera.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Camera() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ==================== 状态管理 ====================
  const [imageUrl, setImageUrl] = useState('');           // 图片预览URL
  const [imageFile, setImageFile] = useState(null);       // 图片文件
  const [isUploading, setIsUploading] = useState(false);  // 上传中状态
  const [uploadProgress, setUploadProgress] = useState(0); // 上传进度
  const [recognizing, setRecognizing] = useState(false);   // 识别中状态
  const [recognizedFood, setRecognizedFood] = useState(null); // 识别结果
  const [showResult, setShowResult] = useState(false);      // 显示识别结果
  const [recentFoods, setRecentFoods] = useState([         // 最近识别的食物
    { id: 1, name: '苹果', icon: '🍎', calories: 52, time: '10:30' },
    { id: 2, name: '鸡蛋', icon: '🥚', calories: 155, time: '12:15' },
    { id: 3, name: '米饭', icon: '🍚', calories: 130, time: '18:30' },
    { id: 4, name: '香蕉', icon: '🍌', calories: 89, time: '昨天' }
  ]);

  // ==================== 模拟识别结果 ====================
  const mockRecognitionResults = [
    { 
      name: '苹果', 
      icon: '🍎', 
      confidence: 95,
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      description: '新鲜红富士苹果'
    },
    { 
      name: '香蕉', 
      icon: '🍌', 
      confidence: 88,
      calories: 89,
      protein: 1.1,
      carbs: 22,
      fat: 0.3,
      description: '成熟香蕉'
    },
    { 
      name: '橙子', 
      icon: '🍊', 
      confidence: 82,
      calories: 47,
      protein: 0.9,
      carbs: 11,
      fat: 0.1,
      description: '新鲜橙子'
    }
  ];

  // ==================== 事件处理 ====================

  // 打开相机/相册
  const handleTakePhoto = () => {
    const useCamera = window.confirm('点击“确定”拍照，取消则从相册选择');
    if (useCamera) {
      // 拍照
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
      }
    } else {
      // 从相册选择
      if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
      }
    }
  };

  // 处理文件选择
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      console.log('图片已选择');
      return;
    }
    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
      console.log('图片不能超过5MB');
      return;
    }
    setImageFile(file);
    
    // 创建预览URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    // 重置识别结果
    setRecognizedFood(null);
    setShowResult(false);
    
    console.log('图片已选择');
  };

  // 压缩图片
  const compressImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 计算压缩后的尺寸
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // 转换为blob
          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type, 0.8); // 80%质量
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // 开始识别
  const handleRecognize = async () => {
    if (!imageFile) {
      console.log('请先选择图片');
      return;
    }

    setIsUploading(true);
    setRecognizing(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 压缩图片
      const compressedImage = await compressImage(imageFile);

      // 模拟上传到服务器
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 模拟AI识别过程
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 随机选择一个识别结果（模拟AI识别）
      const randomIndex = Math.floor(Math.random() * mockRecognitionResults.length);
      const result = mockRecognitionResults[randomIndex];

      setRecognizedFood(result);
      setShowResult(true);

      // 添加到最近识别
      const newRecent = {
        id: Date.now(),
        name: result.name,
        icon: result.icon,
        calories: result.calories,
        time: new Date().toLocaleTimeString().substring(0, 5)
      };
      setRecentFoods(prev => [newRecent, ...prev.slice(0, 4)]);

      console.log(`识别成功：${result.name}`);
    } catch (error) {
      console.log('识别失败，请重试');
    } finally {
      setIsUploading(false);
      setRecognizing(false);
      setUploadProgress(0);
    }
  };

  // 重新选择图片
  const handleReset = () => {
    setImageUrl('');
    setImageFile(null);
    setRecognizedFood(null);
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 查看详细报告
  const handleViewReport = () => {
    navigate('/report');
  };

  // 使用示例图片
  const handleUseExample = (foodName) => {
    // 模拟选择示例图片
    setImageUrl(`https://images.unsplash.com/photo-${foodName === 'apple' ? '1568702846914-96b305d2aaeb' : '1582722872445-44dc5f7e3c8f'}?w=400`);
    setImageFile(new File([], 'example.jpg'));
    setRecognizedFood(null);
    setShowResult(false);
    
    console.log(`已加载${foodName === 'apple' ? '苹果' : '鸡蛋'}示例图片`);
  };

  // 选择最近识别的食物
  const handleRecentClick = (food) => {
    const confirmView = window.confirm(`是否查看${food.name}的详细报告？`);
    if (confirmView) {
      // 模拟加载历史数据
      setRecognizedFood({
        name: food.name,
        icon: food.icon,
        confidence: 90,
        calories: food.calories,
        protein: food.name === '苹果' ? 0.3 : food.name === '鸡蛋' ? 13 : 2.7,
        carbs: food.name === '苹果' ? 14 : food.name === '鸡蛋' ? 1.1 : 28,
        fat: food.name === '苹果' ? 0.2 : food.name === '鸡蛋' ? 9 : 0.3,
        description: `来自历史记录的${food.name}`
      });
      setShowResult(true);
      navigate('/report');
    }
  };

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      paddingBottom: '30px'
    }}>
      
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* 头部背景 */}
      <div style={{
        height: '160px',
        background: 'linear-gradient(135deg, #fa8c16 0%, #f5222d 100%)',
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
          拍照识别食物
        </h2>

        {/* 相机图标 */}
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
          📸
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ padding: '0 16px' }}>

        {/* 拍照/上传区域 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          
          {/* 图片预览区域 */}
          <div style={{
            width: '100%',
            height: '250px',
            background: imageUrl ? 'transparent' : '#f8f9fa',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            border: '2px dashed #ddd',
            marginBottom: '20px'
          }}>
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt="预览"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* 上传进度遮罩 */}
                {(isUploading || recognizing) && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                      {recognizing ? '🤖 AI识别中...' : '📤 上传中...'}
                    </div>
                    {/* 暂时注释掉 ProgressBar 以排查问题 */}
                    {/*
                    <ProgressBar 
                      percent={uploadProgress} 
                      style={{ 
                        width: '80%',
                        '--fill-color': 'white'
                      }} 
                    />
                    */}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  📷
                </div>
                <p style={{ color: '#999', fontSize: '14px' }}>
                  点击下方按钮拍照或选择图片
                </p>
                <p style={{ color: '#ccc', fontSize: '12px', marginTop: '5px' }}>
                  支持JPG、PNG格式，最大5MB
                </p>
              </>
            )}
          </div>

          {/* 操作按钮（用 div 替代 Space） */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleTakePhoto}
              disabled={isUploading || recognizing}
              style={{
                width: '100%',
                borderRadius: '12px',
                height: '48px',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #fa8c16 0%, #f5222d 100%)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                opacity: isUploading || recognizing ? 0.6 : 1,
                pointerEvents: isUploading || recognizing ? 'none' : 'auto'
              }}
            >
              📸 {imageUrl ? '重新拍照' : '拍照'}
            </button>

            {imageUrl && (
              <>
                <button
                  onClick={handleRecognize}
                  disabled={isUploading || recognizing}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    background: '#1677ff',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    opacity: isUploading || recognizing ? 0.6 : 1,
                    pointerEvents: isUploading || recognizing ? 'none' : 'auto'
                  }}
                >
                  🔍 开始识别
                </button>

                <button
                  onClick={handleReset}
                  disabled={isUploading || recognizing}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    background: '#f5f5f5',
                    border: '1px solid #ddd',
                    color: '#333',
                    cursor: 'pointer',
                    opacity: isUploading || recognizing ? 0.6 : 1,
                    pointerEvents: isUploading || recognizing ? 'none' : 'auto'
                  }}
                >
                  🔄 重新选择
                </button>
              </>
            )}
          </div>
        </div>

        {/* 识别结果卡片 */}
        {showResult && recognizedFood && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            animation: 'slideUp 0.3s ease'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>🎉</span>
              识别结果
            </h4>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                marginRight: '15px'
              }}>
                {recognizedFood.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>{recognizedFood.name}</h3>
                  {/* 用 span 模拟 Tag */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid #52c41a',
                    color: '#52c41a'
                  }}>
                    可信度 {recognizedFood.confidence}%
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
                  {recognizedFood.description}
                </p>
              </div>
            </div>

            {/* 简要营养信息 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#fa8c16' }}>🔥 热量</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {recognizedFood.calories}kcal
                </div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#1890ff' }}>💪 蛋白</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {recognizedFood.protein}g
                </div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#52c41a' }}>🌾 碳水</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {recognizedFood.carbs}g
                </div>
              </div>
            </div>

            <button
              onClick={handleViewReport}
              style={{
                width: '100%',
                borderRadius: '12px',
                height: '44px',
                fontSize: '15px',
                background: '#1677ff',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              📊 查看详细报告
            </button>
          </div>
        )}

        {/* 示例图片（演示用） */}
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
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🖼️</span>
            示例图片（快速演示）
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            <div
              onClick={() => handleUseExample('apple')}
              style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '5px' }}>🍎</div>
              <div style={{ fontSize: '14px', color: '#333' }}>苹果</div>
              <div style={{ fontSize: '12px', color: '#999' }}>52 kcal</div>
            </div>
            <div
              onClick={() => handleUseExample('egg')}
              style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '5px' }}>🥚</div>
              <div style={{ fontSize: '14px', color: '#333' }}>鸡蛋</div>
              <div style={{ fontSize: '12px', color: '#999' }}>155 kcal</div>
            </div>
          </div>
        </div>

        {/* 最近识别的食物 */}
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
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>🕒</span>
              最近识别
            </span>
            <span style={{ fontSize: '12px', color: '#999' }}>点击查看详情</span>
          </h4>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {recentFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => handleRecentClick(food)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '12px'
                }}>
                  {food.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '16px', color: '#333' }}>{food.name}</span>
                    <span style={{ fontSize: '14px', color: '#fa8c16' }}>
                      {food.calories}kcal
                    </span>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '2px'
                  }}>
                    {food.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e6f7ff',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#1890ff' }}>
            📝 使用说明：
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>点击"拍照"按钮使用手机相机拍摄食物</li>
            <li>点击"从相册选择"上传已有图片</li>
            <li>点击"开始识别"进行AI分析</li>
            <li>识别完成后可查看详细营养报告</li>
            <li>可使用示例图片快速体验功能</li>
          </ul>
        </div>

        {/* 拍照技巧（用 span 替代 Tag） */}
        <div style={{
          marginTop: '15px',
          marginBottom: '20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #1890ff',
            color: '#1890ff'
          }}>📸 光线充足</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #1890ff',
            color: '#1890ff'
          }}>🎯 对准食物</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #1890ff',
            color: '#1890ff'
          }}>🔍 清晰可见</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #1890ff',
            color: '#1890ff'
          }}>🥗 单一食物</span>
        </div>
      </div>

      {/* 添加动画样式 */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Camera;