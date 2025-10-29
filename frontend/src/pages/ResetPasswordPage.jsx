// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 1. Lấy "token" từ thanh URL
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: '✖ Mật khẩu không trùng khớp!', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      // 2. Gửi mật khẩu mới và token lên API (cũng dùng axios gốc)
      await axios.post(
        `http://localhost:5000/api/reset-password/${token}`,
        { password: formData.password }
      );

      setMessage({ text: '✔ Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...', type: 'success' });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '480px' }}>
      <h2>Đặt lại mật khẩu mới</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu mới"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}
        </button>
      </form>
      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;