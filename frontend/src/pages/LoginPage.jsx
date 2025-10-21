import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Lấy token từ phản hồi và lưu vào localStorage
      const { token } = response.data;
      localStorage.setItem('authToken', token);

      // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
      navigate('/');
      
    } catch (err) {
      setError(err.response.data.message || 'Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="card">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default LoginPage;