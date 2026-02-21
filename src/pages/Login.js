// src/pages/Login.js
import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  Space,
  Checkbox, 
  Toast 
} from 'antd-mobile';

function Login() {
  // ==================== 状态管理 ====================
  const [username, setUsername] = useState('');        // 手机号
  const [password, setPassword] = useState('');        // 密码
  const [remember, setRemember] = useState(false);     // 记住密码
  const [errors, setErrors] = useState({});            // 错误信息
  const [loading, setLoading] = useState(false);       // 加载状态

  // ==================== 表单验证 ====================
  // 验证手机号格式
  const validatePhone = (phone) => {
    if (!phone) return '手机号不能为空';
    if (phone.length !== 11) return '手机号必须是11位';
    if (!/^1\d{10}$/.test(phone)) return '手机号格式不正确';
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
    
    const phoneError = validatePhone(username);
    if (phoneError) newErrors.username = phoneError;
    
    const pwdError = validatePwd(password);
    if (pwdError) newErrors.password = pwdError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== 事件处理 ====================
  // 手机号输入变化
  const handleUsernameChange = (val) => {
    setUsername(val);
    // 输入时清除该字段的错误
    if (errors.username) {
      setErrors({...errors, username: null});
    }
  };

  // 密码输入变化
  const handlePasswordChange = (val) => {
    setPassword(val);
    // 输入时清除该字段的错误
    if (errors.password) {
      setErrors({...errors, password: null});
    }
  };

  // 提交登录
  const handleSubmit = async () => {
    // 1. 验证表单
    if (!validateForm()) {
      // 显示第一个错误
      const firstError = Object.values(errors).find(err => err);
      if (firstError) {
        Toast.show({
          icon: 'fail',
          content: firstError,
          duration: 2000
        });
      }
      return;
    }

    // 2. 开始登录
    setLoading(true);
    
    // 模拟登录请求（实际项目中这里会调用API）
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟登录验证（演示用：手机号13800138000，密码123456）
      if (username === '13800138000' && password === '123456') {
        Toast.show({
          icon: 'success',
          content: '登录成功！',
          duration: 2000
        });
        
        // 登录成功后跳转到个人资料页
        // 注意：这里需要导入 useHistory 并使用
        // history.push('/profile');
        
        console.log('登录成功，用户信息：', { username, remember });
      } else {
        Toast.show({
          icon: 'fail',
          content: '手机号或密码错误',
          duration: 2000
        });
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '登录失败，请重试',
        duration: 2000
      });
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

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      // 全局动画样式直接定义在根节点，替代style jsx
      animation: 'fadeIn 0.5s ease'
    }}>
      {/* 移除WingBlank，原有外层padding已实现留白效果 */}
        {/* 登录卡片 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px',
          animation: 'fadeIn 0.5s ease'
        }}>
          
          {/* 标题区域 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px'
          }}>
            <h1 style={{ 
              color: '#667eea', 
              fontSize: '48px', 
              marginBottom: '8px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(102, 126, 234, 0.2)'
            }}>
              🍱 吃了么
            </h1>
            <p style={{ 
              color: '#999', 
              fontSize: '16px',
              letterSpacing: '1px'
            }}>
              拍照识别 · 健康饮食
            </p>
          </div>

          {/* 手机号输入框 */}
          <div style={{ marginBottom: errors.username ? '4px' : '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ 
                fontSize: '14px', 
                color: '#666',
                marginRight: '8px'
              }}>
                📱
              </span>
              <span style={{ 
                fontSize: '14px', 
                color: '#666'
              }}>
                手机号
              </span>
            </div>
            
            <Input
              placeholder="请输入手机号"
              value={username}
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
              clearable
              disabled={loading}
              style={{
                '--border-radius': '12px',
                '--border': errors.username ? '2px solid #ff4d4f' : '1px solid #e5e5e5',
                '--padding': '14px 16px',
                '--background-color': '#f8f9fa',
                '--font-size': '16px',
                width: '100%'
              }}
            />
            
            {/* 错误提示 */}
            {errors.username && (
              <div style={{ 
                color: '#ff4d4f', 
                fontSize: '12px', 
                marginTop: '6px',
                marginLeft: '12px'
              }}>
                ⚠️ {errors.username}
              </div>
            )}
          </div>

          {/* 移除WhiteSpace，用margin-top实现等价间距（md尺寸≈16px） */}
          <div style={{ marginTop: '16px' }}>
            {/* 密码输入框 */}
            <div style={{ marginBottom: errors.password ? '4px' : '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  marginRight: '8px'
                }}>
                  🔒
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#666'
                }}>
                  密码
                </span>
              </div>
              
              <Input
                placeholder="请输入密码"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                clearable
                disabled={loading}
                style={{
                  '--border-radius': '12px',
                  '--border': errors.password ? '2px solid #ff4d4f' : '1px solid #e5e5e5',
                  '--padding': '14px 16px',
                  '--background-color': '#f8f9fa',
                  '--font-size': '16px',
                  width: '100%'
                }}
              />
              
              {/* 错误提示 */}
              {errors.password && (
                <div style={{ 
                  color: '#ff4d4f', 
                  fontSize: '12px', 
                  marginTop: '6px',
                  marginLeft: '12px'
                }}>
                  ⚠️ {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* 记住密码和忘记密码 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            marginBottom: '24px'
          }}>
            <Checkbox 
              checked={remember}
              onChange={val => setRemember(val)}
              disabled={loading}
              style={{
                '--font-size': '14px',
                '--color': '#999'
              }}
            >
              <span style={{ fontSize: '14px', color: '#666' }}>
                记住密码
              </span>
            </Checkbox>
            
            <a 
              href="#" 
              style={{ 
                color: '#667eea', 
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onClick={(e) => {
                e.preventDefault();
                Toast.show({
                  content: '请联系管理员重置密码',
                  position: 'top'
                });
              }}
            >
              忘记密码？
            </a>
          </div>

          {/* 登录按钮 */}
          <Button 
            color="primary"
            onClick={handleSubmit}
            block
            loading={loading}
            disabled={loading}
            style={{
              '--border-radius': '12px',
              height: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              marginBottom: '20px'
            }}
          >
            {loading ? '登录中...' : '登 录'}
          </Button>

          {/* 注册入口 */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px',
            color: '#999',
            fontSize: '14px'
          }}>
            还没有账号？{' '}
            <a 
              href="#" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onClick={(e) => {
                e.preventDefault();
                Toast.show({
                  content: '跳转到注册页面',
                  position: 'top'
                });
              }}
            >
              立即注册
            </a>
          </div>

          {/* 其他登录方式 */}
          <div style={{ 
            marginTop: '40px',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ 
                flex: 1, 
                height: '1px', 
                background: 'linear-gradient(90deg, transparent, #e5e5e5, transparent)'
              }} />
              <span style={{ 
                padding: '0 16px', 
                color: '#999',
                fontSize: '13px'
              }}>
                其他登录方式
              </span>
              <div style={{ 
                flex: 1, 
                height: '1px', 
                background: 'linear-gradient(90deg, transparent, #e5e5e5, transparent)'
              }} />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: '30px'
            }}>
              {/* 微信登录 */}
              <div 
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
                onClick={() => !loading && Toast.show({ content: '微信登录开发中' })}
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
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
                onClick={() => !loading && Toast.show({ content: 'QQ登录开发中' })}
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
              <span style={{ color: '#667eea' }}>✨ 演示账号：</span>
            </p>
            <p style={{ margin: '2px 0' }}>手机号：13800138000</p>
            <p style={{ margin: '2px 0' }}>密码：123456</p>
          </div>
        </div>

      {/* 全局动画样式（React中直接插入style标签，替代style jsx） */}
      <style global>{`
        @keyframes fadeIn {
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

export default Login;
