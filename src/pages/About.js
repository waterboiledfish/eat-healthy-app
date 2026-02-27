import React from 'react';

function About() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '24px', color: '#333' }}>关于我们</h1>
      <p style={{ fontSize: '16px', color: '#666', marginTop: '20px' }}>
        这是一个健康饮食管理应用，帮助您记录每日饮食并分析营养。
      </p>
      <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
        版本 1.0.0
      </p>
    </div>
  );
}

export default About;