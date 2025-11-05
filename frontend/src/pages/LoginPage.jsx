// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 👈 Import
import { loginSuccess } from '../redux/authSlice';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  // const [jwtToken, setJwtToken] = useState(''); // XÓA: Không cần state này nữa
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); // 👈 Khởi tạo dispatch
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      // Gọi API login
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Nhận 2 token từ SV1
      const { accessToken, refreshToken } = response.data;
      
      // 1. Dùng Redux để lưu accessToken (vào state + localStorage)
      dispatch(loginSuccess({ accessToken: accessToken }));

      // 2. Lưu refreshToken (dài hạn) vào localStorage
      localStorage.setItem('refreshToken', refreshToken);

      setMessage({ text: '✔ Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });
      
      setTimeout(() => {
        navigate('/'); // Chuyển về trang chủ
      }, 1000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Lỗi đăng nhập';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    }
  };

  return (
    <div className="auth-split-container">
     <div className="auth-welcome-section">
    
        <h2>Chào mừng bạn trở lại!</h2>
        <p>Đăng nhập để tiếp tục quản lý công việc và dự án của bạn.</p>
      </div>

      <div className="auth-form-section">
        <h2>Đăng nhập</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
          />
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" name="remember" /> Ghi nhớ tôi
              <span className="checkmark"></span>
            </label>
            <div className="forgot-password-link">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      
        {/* Chỉ hiển thị thông báo LỖI */}
        {message.text && message.type === 'error' && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {/* XÓA: Khối hiển thị JWT Token đã bị xóa */}

        <div className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;