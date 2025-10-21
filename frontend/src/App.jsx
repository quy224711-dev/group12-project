// src/App.jsx
import React from 'react';
// 👇 THAY Link BẰNG NavLink
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

// Component cho thanh điều hướng
function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav>
      {/* 👇 DÙNG NavLink */}
      <NavLink to="/" className="logo-link">Trang Chủ </NavLink>
      <div className="nav-links">
        {token ? (
          <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
        ) : (
          <>
            {/* 👇 DÙNG NavLink */}
            <NavLink to="/login">Đăng nhập</NavLink>
            <NavLink to="/register">Đăng ký</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

// Component Trang chủ đơn giản
function HomePage() {
  return (
    <div className="card home-card">
      <h2>Chào mừng bạn đã đăng nhập!</h2>
      <p>Đây là trang chủ của ứng dụng.</p>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navigation />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;