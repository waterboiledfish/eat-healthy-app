import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Report from './pages/Report';
import Camera from './pages/Camera';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/report" element={<Report />} />
        <Route path="/camera" element={<Camera />} />
      </Routes>
    </Router>
  );
}

export default App;
