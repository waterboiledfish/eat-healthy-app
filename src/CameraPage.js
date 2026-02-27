import React, { useState } from 'react';
import './CameraPage.css';
import { recognizeFood } from './FoodRecognition'; // 导入识别函数

function CameraPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [error, setError] = useState('');

  // 处理图片选择
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setRecognitionResult(null); // 清空之前的结果
      setError('');
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    document.getElementById('fileInput').click();
  };

  // 识别食物
  const handleRecognize = async () => {
    if (!selectedImage) {
      setError('请先选择图片');
      return;
    }

    setIsRecognizing(true);
    setError('');
    
    try {
      const result = await recognizeFood(selectedImage);
      
      if (result.success) {
        setRecognitionResult(result.food);
      } else {
        setError('识别失败，请重试');
      }
    } catch (err) {
      setError('识别出错: ' + err.message);
    } finally {
      setIsRecognizing(false);
    }
  };

  // 重新拍摄
  const handleRetake = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setRecognitionResult(null);
    setError('');
  };

  return (
    <div className="camera-page">
      <h2>拍照识别食物</h2>
      <p className="subtitle">拍摄食物图片，AI帮你分析营养成分</p>
      
      {/* 隐藏的文件输入框 */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      
      {/* 拍照区域 */}
      <div className="camera-area" onClick={triggerFileSelect}>
        {previewUrl ? (
          <img src={previewUrl} alt="预览" className="preview-image" />
        ) : (
          <div className="camera-placeholder">
            <div className="camera-icon">📷</div>
            <p>点击拍照或选择图片</p>
            <p className="hint">建议拍摄清晰的食物照片</p>
          </div>
        )}
      </div>
      
      {/* 操作按钮 */}
      <div className="action-buttons">
        <button 
          className="btn-secondary" 
          onClick={selectedImage ? handleRetake : triggerFileSelect}
        >
          {selectedImage ? '重新拍摄' : '选择图片'}
        </button>
        
        {selectedImage && (
          <button 
            className="btn-primary" 
            onClick={handleRecognize}
            disabled={isRecognizing}
          >
            {isRecognizing ? '识别中...' : 'AI识别食物'}
          </button>
        )}
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      {/* 识别结果 */}
      {recognitionResult && (
        <div className="result-card">
          <h3>🥗 识别结果</h3>
          <div className="result-details">
            <div className="result-item">
              <span className="label">食物名称：</span>
              <span className="value">{recognitionResult.name}</span>
            </div>
            <div className="result-item">
              <span className="label">热量：</span>
              <span className="value">{recognitionResult.calories} 大卡/100g</span>
            </div>
            <div className="result-item">
              <span className="label">置信度：</span>
              <span className="value">{(recognitionResult.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="health-tip">
            💡 健康建议：适量摄入，均衡饮食
          </div>
        </div>
      )}
      
      {/* 状态显示 */}
      <div className="status">
        {selectedImage ? (
          <p>已选择: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)</p>
        ) : (
          <p>请拍摄或选择食物图片</p>
        )}
      </div>
      
      {/* 使用提示 */}
      <div className="tips">
        <h4>📝 使用提示：</h4>
        <ul>
          <li>在良好光线下拍摄食物</li>
          <li>尽量让食物充满画面</li>
          <li>支持常见中餐、水果、零食</li>
          <li>识别结果仅供参考</li>
        </ul>
      </div>
    </div>
  );
}

export default CameraPage;