// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nickname: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/api/user/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            nickname: data.nickname || '',
            age: data.age || '',
            gender: data.gender || '',
            height: data.height || '',
            weight: data.weight || ''
          });
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (err) {
        console.error('获取用户信息失败', err);
      }
    };
    fetchUser();
  }, [navigate]);

  // 处理输入变化
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 保存资料
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname: user.nickname,
          age: Number(user.age),
          gender: user.gender,
          height: Number(user.height),
          weight: Number(user.weight)
        })
      });
      if (res.ok) {
        alert('保存成功');
        setIsEditing(false);
      } else {
        alert('保存失败');
      }
    } catch (err) {
      alert('网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setIsEditing(false);
    // 重新获取原始数据（可选，简单起见可重新加载）
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#667eea' }}>个人资料</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px' }}>昵称</label>
        <input
          name="nickname"
          value={user.nickname}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px' }}>年龄</label>
        <input
          name="age"
          type="number"
          value={user.age}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px' }}>性别</label>
        <select
          name="gender"
          value={user.gender}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">请选择</option>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px' }}>身高 (cm)</label>
        <input
          name="height"
          type="number"
          value={user.height}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', margin: '10px 0 5px' }}>体重 (kg)</label>
        <input
          name="weight"
          type="number"
          value={user.weight}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            编辑资料
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              style={{ padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;