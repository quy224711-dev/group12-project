
import api from './api';
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';



import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess, selectCurrentUser } from './redux/authSlice';
import './App.css';


function HomePage() {
  return (
    // Thêm class mới .home-container
    <div className="auth-card home-container">
      
      {/* CỘT 1: CHỮ */}
      <div className="home-text">
        <h2>Chào mừng trở lại!</h2>
        <p>
          Đây là trang quản lý dự án của bạn. Hãy bắt đầu bằng cách
          kiểm tra hồ sơ hoặc xem trang quản lý nếu bạn là Admin.
        </p>
        <Link to="/profile" className="home-cta-button">
          Xem hồ sơ của bạn
        </Link>
      </div>

      {/* CỘT 2: HÌNH ẢNH */}
      <div className="home-image">
        <img 
          src="welcome-illustration.png"
          alt="Chào mừng" 
        />
      </div>

    </div>
  );
}


// Cập nhật Navigation
function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  
  const handleLogout = async () => {
    try {
      // Sửa 2: Thêm 2 dòng này ĐỂ GỌI API LOGOUT
      // Dòng này báo cho backend xóa RefreshToken khỏi DB
      await api.post('/auth/logout', { 
        refreshToken: localStorage.getItem('refreshToken') 
      });
    } catch (err) {
      console.error("Lỗi khi gọi API logout:", err);
    }
    
    // Dùng Redux để dọn kho (luôn luôn chạy)
    dispatch(logoutSuccess()); 
    navigate('/login');
  };

  return (
    <nav>
      <NavLink to="/" className="logo-link">Trang chủ</NavLink>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/profile">Hồ sơ</NavLink>
            
            {user && user.role === 'admin' && (
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
            {/* --- ROUTE MỚI CHO HOẠT ĐỘNG 4 --- */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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