import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Camera from './pages/Camera';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 暂时移除导航栏，直接显示拍照页面 */}
        <Routes>
          <Route path="/" element={<Camera />} />
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;