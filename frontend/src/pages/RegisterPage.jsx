import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
      <Link to="/">Trang chủ</Link>
      <div className="nav-links">
        {token ? (
          <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Component Trang chủ đơn giản
function HomePage() {
  return <h2>Bạn đã đăng nhập thành công! Chào mừng đến với trang chủ.</h2>;
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
            {/* Các trang khác sẽ được thêm vào đây */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;