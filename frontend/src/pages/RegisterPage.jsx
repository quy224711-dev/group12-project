// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);

      // --- (THAY ĐỔI) ---
      // XÓA: setMessage({ text: '✔ Đăng ký thành công! Đang chuyển đến trang đăng nhập...', type: 'success' });
      // XÓA: setTimeout(...)

      // THÊM: Chuyển hướng ngay lập tức
      navigate('/login');
      // --------------------

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-welcome-section">
        <h2>Tạo tài khoản mới</h2>
        <p>Chỉ mất vài giây để tham gia cộng đồng của chúng tôi. Bắt đầu ngay!</p>
      </div>

      <div className="auth-form-section">
        <h2>Đăng Ký</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên của bạn"
            onChange={handleChange}
            required
          />
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
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        
        {/* Chỉ hiển thị thông báo LỖI */}
        {message.text && message.type === 'error' && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="register-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;