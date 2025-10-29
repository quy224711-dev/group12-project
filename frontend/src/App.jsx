// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // 👈 Import trang mới
import ProtectedRoute from './components/ProtectedRoute'; // 👈 Import cổng bảo vệ
import './App.css'; // File CSS chung

// Component Trang chủ
function HomePage() {
  return (
    <div className="auth-card">
      <h2>Chào mừng bạn đã đăng nhập!</h2>
      <p>Đây là trang chủ của ứng dụng.</p>
    </div>
  );
}

// Component Navigation (thêm link Profile)
function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav>
      <NavLink to="/" className="logo-link">Trang chủ</NavLink>
      <div className="nav-links">
        {token ? (
          <>
            {/* 👈 Thêm link Profile */}
            <NavLink to="/profile">Hồ sơ</NavLink> 
            <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Đăng nhập</NavLink>
            <NavLink to="/register">Đăng ký</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navigation />
        <main>
          <Routes>
            {/* Các trang công khai */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Các trang được bảo vệ */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;