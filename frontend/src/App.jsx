import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// ... import các trang khác ...
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage'; 

// ... import các component khác ...
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './App.css';
// 👈 ĐÃ XÓA DÒNG IMPORT CSS TRÙNG LẶP TẠI ĐÂY

// ... Component HomePage không đổi ...
function HomePage() { 
  return (
    <div className="auth-card">
      <h2>Chào mừng bạn đã đăng nhập!</h2>
      <p>Đây là trang chủ của ứng dụng.</p>
    </div>
  ); 
}

// Lấy role từ token
const getRoleFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    return jwtDecode(token).role;
  } catch (error) {
    return null;
  }
};

// Cập nhật Navigation
function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const userRole = getRoleFromToken();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav>
      <NavLink to="/" className="logo-link">Trang chủ</NavLink>
      <div className="nav-links">
        {token ? (
          <>
            <NavLink to="/profile">Hồ sơ</NavLink>
            
            {userRole === 'admin' && (
              <NavLink to="/admin">Quản lý</NavLink>
            )}

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

// Cập nhật App (Routes)
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
            
            {/* Các trang cần đăng nhập */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            {/* TRANG ADMIN ĐƯỢC BẢO VỆ 2 LẦN */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute> {/* Lớp 1: Phải đăng nhập */}
                  <AdminProtectedRoute> {/* Lớp 2: Phải là Admin */}
                    <AdminPage />
                  </AdminProtectedRoute>
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