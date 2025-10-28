// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Đảm bảo Link được import

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [jwtToken, setJwtToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    setJwtToken('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      setJwtToken(token);
      setMessage({ text: '✔ Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });

      setTimeout(() => {
        navigate('/'); // Tự động chuyển về trang chủ sau 2 giây
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Email hoặc mật khẩu không đúng!';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
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

        {/* --- ĐÃ DI CHUYỂN LINK "QUÊN MẬT KHẨU" LÊN ĐÂY --- */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
        
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      {/* --- ĐÃ XÓA LINK "QUÊN MẬT KHẨU" KHỎI ĐÂY --- */}
      
      {/* Display success or error messages */}
      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {/* Display the JWT Token on success */}
      {jwtToken && (
        <div className="jwt-token-box">
          <strong>JWT Token nhận được:</strong>
          {jwtToken}
        </div>
      )}

      {/* --- THÊM LINK "ĐĂNG KÝ NGAY" --- */}
      <div className="register-link">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </div>
    </div>
  );
}

export default LoginPage;