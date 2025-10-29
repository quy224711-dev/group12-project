import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      // Set the success message with a checkmark
      setMessage({ text: '✔ ' + (response.data.message || 'Đăng ký thành công!'), type: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      // Set the error message
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
      <div className="auth-card">
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
        {/* Correctly render the message box */}
        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
  
  );
}

export default RegisterPage;