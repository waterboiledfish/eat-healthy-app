import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
function Login() {
  // ==================== 状态管理 ====================
  const [username, setUsername] = useState('');        // 手机号
  const [password, setPassword] = useState('');        // 密码
  const [remember, setRemember] = useState(false);     // 记住密码
  const [errors, setErrors] = useState({});            // 错误信息
  const [loading, setLoading] = useState(false);       // 加载状态
const navigate = useNavigate();
  // ==================== 表单验证 ====================
  // 验证手机号格式
const validateUsername = (username) => {
  if (!username) return '用户名不能为空';
  // 如果需要长度限制，比如至少3位，可以添加
   if (username.length < 3) return '用户名至少3位';
  return '';
};

  // 验证密码格式
  const validatePwd = (pwd) => {
    if (!pwd) return '密码不能为空';
    if (pwd.length < 6) return '密码至少6位';
    return '';
  };

  // 验证整个表单
  const validateForm = () => {
    const newErrors = {};
    
const usernameError = validateUsername(username);
if (usernameError) newErrors.username = usernameError;
    
    const pwdError = validatePwd(password);
    if (pwdError) newErrors.password = pwdError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== 事件处理 ====================
  // 手机号输入变化
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors({...errors, username: null});
    }
  };

  // 密码输入变化
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({...errors, password: null});
    }
  };

  // 记住密码复选框
  const handleRememberChange = (e) => {
    setRemember(e.target.checked);
  };

  // 提交登录
const handleSubmit = async () => {
  if (!validateForm()) {
    const firstError = Object.values(errors).find(err => err);
    if (firstError) {
      alert(firstError);
    }
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

    const data = await res.json();
    if (res.ok) {
      // 登录成功，保存 token
      localStorage.setItem('token', data.access_token);
      alert('登录成功！');
      // 跳转到拍照页面
      window.location.href = '/camera'; // 或者用 useNavigate
    } else {
      alert(data.detail || '登录失败');
    }
  } catch (error) {
    console.error(error);
    alert('网络错误，请稍后重试');
  } finally {
    setLoading(false);
  }
};
  // 处理回车键登录
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  // 忘记密码
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('请联系管理员重置密码');
  };

  // 立即注册
  const handleRegister = (e) => {
    e.preventDefault();
    alert('跳转到注册页面（开发中）');
  };

  // 其他登录方式（微信/QQ）目前只是演示，用alert提示
  const handleWechat = () => {
    alert('微信登录开发中');
  };

  const handleQQ = () => {
    alert('QQ登录开发中');
  };

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '40px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
      }}>
        
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#667eea', 
            fontSize: '48px', 
            marginBottom: '8px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(102, 126, 234, 0.2)'
          }}>
            🍱 吃了么
          </h1>
          <p style={{ color: '#999', fontSize: '16px', letterSpacing: '1px' }}>
            拍照识别 · 健康饮食
          </p>
        </div>

        {/* 手机号输入框 */}
{/* 用户名输入框 */}
<div style={{ marginBottom: errors.username ? '4px' : '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
    <span style={{ fontSize: '14px', color: '#666', marginRight: '8px' }}>👤</span>
    <span style={{ fontSize: '14px', color: '#666' }}>用户名</span>
  </div>
  
  <input
    type="text"
    placeholder="请输入用户名/手机号"
    value={username}
    onChange={handleUsernameChange}
    onKeyPress={handleKeyPress}
    disabled={loading}
    style={{
      width: '100%',
      padding: '14px 16px',
      fontSize: '16px',
      borderRadius: '12px',
      border: errors.username ? '2px solid #ff4d4f' : '1px solid #e5e5e5',
      backgroundColor: '#f8f9fa',
      outline: 'none',
      boxSizing: 'border-box'
    }}
  />
  
  {errors.username && (
    <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '6px', marginLeft: '12px' }}>
      ⚠️ {errors.username}
    </div>
  )}
</div>

        {/* 密码输入框 */}
        <div style={{ marginTop: '16px', marginBottom: errors.password ? '4px' : '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: '#666', marginRight: '8px' }}>🔒</span>
            <span style={{ fontSize: '14px', color: '#666' }}>密码</span>
          </div>
          
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '16px',
              borderRadius: '12px',
              border: errors.password ? '2px solid #ff4d4f' : '1px solid #e5e5e5',
              backgroundColor: '#f8f9fa',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          
          {errors.password && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '6px', marginLeft: '12px' }}>
              ⚠️ {errors.password}
            </div>
          )}
        </div>

        {/* 记住密码和忘记密码 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
          marginBottom: '24px'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={handleRememberChange}
              disabled={loading}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#666' }}>记住密码</span>
          </label>
          
          <a 
            href="#" 
            onClick={handleForgotPassword}
            style={{ 
              color: '#667eea', 
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            忘记密码？
          </a>
        </div>

        {/* 登录按钮 */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            marginBottom: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '登录中...' : '登 录'}
        </button>

        {/* 注册入口 */}
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#999', fontSize: '14px' }}>
          还没有账号？{' '}
          <a 
            href="#" 
          onClick={(e) => {
  e.preventDefault();
  navigate('/register');
}}
            style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}
          >
            立即注册
          </a>
        </div>

        {/* 其他登录方式 */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e5e5, transparent)' }} />
            <span style={{ padding: '0 16px', color: '#999', fontSize: '13px' }}>
              其他登录方式
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e5e5, transparent)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
            {/* 微信登录 */}
            <div 
              style={{ textAlign: 'center', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
              onClick={handleWechat}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#07C160',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '4px',
                boxShadow: '0 4px 8px rgba(7, 193, 96, 0.3)'
              }}>
                🛜
              </div>
              <span style={{ fontSize: '12px', color: '#999' }}>微信</span>
            </div>
            {/* QQ登录 */}
            <div 
              style={{ textAlign: 'center', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
              onClick={handleQQ}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#12B7F5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '4px',
                boxShadow: '0 4px 8px rgba(18, 183, 245, 0.3)'
              }}>
                💬
              </div>
              <span style={{ fontSize: '12px', color: '#999' }}>QQ</span>
            </div>
          </div>
        </div>

        {/* 演示账号提示 */}
<div style={{ 
  marginTop: '24px',
  padding: '12px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#999',
  textAlign: 'center'
}}>
  <p style={{ margin: '0 0 4px 0' }}>
    <span style={{ color: '#667eea' }}>✨ 提示：</span>
  </p>
  <p style={{ margin: '2px 0' }}>请使用注册的账号登录。</p>
</div>
      </div>
    </div>
  );
}

export default Login;