// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert('请输入用户名和密码');
      return;
    }
    if (password.length < 6) {
      alert('密码至少6位');
      return;
    }
    try {
const res = await fetch(`${API_BASE}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
      const data = await res.json();
      if (res.ok) {
        alert('注册成功，请登录');
        navigate('/');
      } else {
        alert(data.detail || '注册失败');
      }
    } catch (err) {
      alert('网络错误');
    }
  };

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
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '30px' }}>注册</h2>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            marginBottom: '20px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="密码（至少6位）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            marginBottom: '20px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          注册
        </button>
        <p style={{ textAlign: 'center' }}>
          已有账号？ <a href="#" onClick={() => navigate('/')}>去登录</a>
        </p>
      </div>
    </div>
  );
}

export default Register;