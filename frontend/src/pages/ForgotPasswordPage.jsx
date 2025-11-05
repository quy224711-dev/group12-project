// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios'; // 👈 Dùng axios gốc (không phải 'api.js')
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      // 1. Dùng axios GỐC vì người dùng CHƯA ĐĂNG NHẬP (không có token)
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      
      setMessage({
        text: '✔ Nếu email tồn tại, một liên kết khôi phục đã được gửi.',
        type: 'success'
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '480px' }}>
      <h2>Quên mật khẩu</h2>
      <p style={{ color: '#6B7280', marginBottom: '25px' }}>
        Nhập email của bạn, chúng tôi sẽ gửi một liên kết để khôi phục mật khẩu.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Đang gửi...' : 'Gửi liên kết'}
        </button>
      </form>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/login">Quay lại Đăng nhập</Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;