// src/pages/About.js
import React from 'react';
import {
  List,
  Button,
  Space,
  Toast,
  Modal
} from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  // ==================== 团队信息 ====================
  const teamMembers = [
    { 
      name: '同学A', 
      role: '前端开发 & UI设计', 
      avatar: '🎨',
      description: '负责React框架搭建、页面布局、样式设计'
    },
    { 
      name: '同学B', 
      role: '拍照功能开发', 
      avatar: '📷',
      description: '负责摄像头调用、图片上传、图片处理'
    },
    { 
      name: '同学C', 
      role: 'AI识别对接', 
      avatar: '🤖',
      description: '负责调用AI识别API、结果解析'
    },
    { 
      name: '同学D', 
      role: '后端开发', 
      avatar: '⚙️',
      description: '负责服务器搭建、API接口、数据管理'
    },
    { 
      name: '同学E', 
      role: '健康分析算法', 
      avatar: '📊',
      description: '负责营养计算、报告生成、健康建议'
    }
  ];

  // ==================== 技术栈 ====================
  const techStack = [
    { category: '前端框架', items: ['React 18', 'React Router v6'] },
    { category: 'UI组件库', items: ['Ant Design Mobile v5'] },
    { category: '后端技术', items: ['Node.js', 'Express'] },
    { category: 'AI识别', items: ['百度AI/腾讯AI 食物识别API'] },
    { category: '开发工具', items: ['VS Code', 'Git', 'npm/yarn'] },
    { category: '部署平台', items: ['Vercel/Netlify', 'GitHub Pages'] }
  ];

  // ==================== 版本历史 ====================
  const versionHistory = [
    { version: 'v1.0.0', date: '2024-01-15', desc: '初始版本发布，完成基础拍照识别功能' },
    { version: 'v1.1.0', date: '2024-01-20', desc: '优化UI界面，添加健康报告功能' },
    { version: 'v1.2.0', date: '2024-01-25', desc: '增加个人资料页，完善用户信息' },
    { version: 'v1.3.0', date: '2024-02-01', desc: '修复bug，优化移动端体验' }
  ];

  // ==================== 常见问题 ====================
  const faqs = [
    { 
      q: '如何拍照识别食物？', 
      a: '点击底部导航栏的"拍照"按钮，允许相机权限后拍摄食物照片，系统会自动识别并分析营养成分。'
    },
    { 
      q: '识别准确率怎么样？', 
      a: '我们使用百度AI/腾讯AI的成熟识别API，对常见食物的识别准确率可达90%以上。'
    },
    { 
      q: '需要注册才能使用吗？', 
      a: '是的，为了保存您的健康数据，需要注册账号。但为了演示方便，我们提供了测试账号。'
    },
    { 
      q: '数据会保存多久？', 
      a: '您的健康数据会永久保存，可以随时查看历史记录。'
    },
    { 
      q: '这个项目是课程设计吗？', 
      a: '是的，这是大学Web前端开发课程的课程设计项目，由5人小组完成。'
    }
  ];

  // ==================== 联系方式 ====================
  const contacts = [
    { type: '邮箱', value: 'chilema@example.com', icon: '📧' },
    { type: '微信公众号', value: '吃了么健康', icon: '🔔' },
    { type: '项目地址', value: 'github.com/chilema-app', icon: '🐙' },
    { type: '学校', value: 'XX大学计算机学院', icon: '🏫' }
  ];

  // ==================== 事件处理 ====================
  const handleContactClick = (contact) => {
    Modal.confirm({
      title: contact.type,
      content: contact.value,
      confirmText: '复制',
      cancelText: '取消',
      onConfirm: () => {
        navigator.clipboard.writeText(contact.value);
        Toast.show({
          icon: 'success',
          content: '复制成功'
        });
      }
    });
  };

  const handleVersionClick = (version) => {
    Toast.show({
      content: `当前版本：${version}`,
      position: 'top'
    });
  };

  const handleFaqClick = (faq) => {
    Modal.alert({
      title: faq.q,
      content: faq.a,
      confirmText: '知道了'
    });
  };

  // ==================== 渲染界面 ====================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      paddingBottom: '30px'
    }}>
      
      {/* 头部背景 */}
      <div style={{
        height: '180px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

        {/* 应用Logo */}
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
          🍱
        </div>
      </div>

      {/* 应用名称 */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          吃了么
        </h1>
        <p style={{ color: '#999', fontSize: '14px' }}>
          拍照识食 · 健康管理
        </p>
        <p style={{ 
          color: '#667eea', 
          fontSize: '12px',
          marginTop: '8px'
        }}>
          大学课程设计项目 · v1.3.0
        </p>
      </div>

      {/* 主要内容区域 - 用内边距替代 WingBlank */}
      <div style={{ padding: '0 16px' }}>
        {/* 项目简介卡片 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📋</span>
            项目简介
          </h4>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            《吃了么》是一个基于AI技术的健康饮食管理网页应用。
            用户可以通过拍照识别食物，获取营养成分分析和健康建议。
            本项目旨在帮助用户更好地了解自己的饮食结构，促进健康饮食习惯。
          </p>
        </div>

        {/* 核心功能 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🎯</span>
            核心功能
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {[
              { icon: '📷', text: '拍照识别食物' },
              { icon: '🤖', text: 'AI智能分析' },
              { icon: '📊', text: '营养报告生成' },
              { icon: '📱', text: '移动端优先' },
              { icon: '💾', text: '数据记录' },
              { icon: '❤️', text: '健康建议' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 开发团队 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>👥</span>
            开发团队
          </h4>
          
          {teamMembers.map((member, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              background: index % 2 === 0 ? '#f8f9fa' : 'white',
              borderRadius: '12px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                marginRight: '12px'
              }}>
                {member.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ 
                  margin: 0, 
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {member.name}
                </h5>
                <p style={{ 
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: '#667eea'
                }}>
                  {member.role}
                </p>
                <p style={{ 
                  margin: '4px 0 0 0',
                  fontSize: '11px',
                  color: '#999'
                }}>
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 技术栈 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🔧</span>
            技术栈
          </h4>
          
          {techStack.map((tech, index) => (
            <div key={index} style={{
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '4px'
              }}>
                {tech.category}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {tech.items.map((item, i) => (
                  <span key={i} style={{
                    padding: '4px 12px',
                    background: '#f0f0f0',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 版本历史 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📅</span>
            版本历史
          </h4>
          
          {versionHistory.map((version, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '12px',
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '8px',
              cursor: 'pointer'
            }} onClick={() => handleVersionClick(version.version)}>
              <div style={{
                minWidth: '70px',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#667eea'
              }}>
                {version.version}
              </div>
              <div style={{
                minWidth: '80px',
                fontSize: '11px',
                color: '#999'
              }}>
                {version.date}
              </div>
              <div style={{
                flex: 1,
                fontSize: '12px',
                color: '#666'
              }}>
                {version.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>❓</span>
            常见问题
          </h4>
          
          {faqs.map((faq, index) => (
            <div key={index} style={{
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '8px',
              cursor: 'pointer'
            }} onClick={() => handleFaqClick(faq)}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: '#667eea', marginRight: '8px' }}>Q:</span>
                {faq.q}
              </p>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                color: '#999',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ color: '#52c41a', marginRight: '8px' }}>A:</span>
                {faq.a.length > 50 ? faq.a.substring(0, 50) + '...' : faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* 联系方式 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: '#667eea',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📞</span>
            联系方式
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            {contacts.map((contact, index) => (
              <div key={index} style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer'
              }} onClick={() => handleContactClick(contact)}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                  {contact.icon}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {contact.type}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#667eea',
                  wordBreak: 'break-all'
                }}>
                  {contact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ marginTop: '30px' }}>
          <Button
            color='primary'
            onClick={() => navigate('/camera')}
            block
            style={{
              '--border-radius': '12px',
              height: '48px',
              fontSize: '16px',
              marginBottom: '10px'
            }}
          >
            📷 开始体验
          </Button>
          
          <Button
            onClick={() => window.open('https://github.com', '_blank')}
            block
            style={{
              '--border-radius': '12px',
              height: '48px',
              fontSize: '16px',
              marginBottom: '10px'
            }}
          >
            ⭐ GitHub 仓库
          </Button>
          
          <Button
            onClick={() => {
              Toast.show({
                content: '感谢您的反馈！',
                icon: 'success'
              });
            }}
            block
            style={{
              '--border-radius': '12px',
              height: '48px',
              fontSize: '16px'
            }}
          >
            💬 意见反馈
          </Button>
        </div>

        {/* 版权信息 */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          marginBottom: '20px',
          color: '#999',
          fontSize: '12px'
        }}>
          <p>© 2024 吃了么项目组 · 课程设计作品</p>
          <p>遵循 MIT 开源协议</p>
          <p style={{ marginTop: '8px' }}>
            本应用仅供学习交流使用，不构成医疗建议
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;