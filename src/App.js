import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Report from './pages/Report';
import Camera from './pages/Camera';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>登录</Link>
          <Link to="/camera" style={{ marginRight: '10px' }}>拍照</Link>
          <Link to="/report" style={{ marginRight: '10px' }}>报告</Link>
          <Link to="/profile" style={{ marginRight: '10px' }}>个人资料</Link>
          <Link to="/about">关于</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/report" element={<Report />} />
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;