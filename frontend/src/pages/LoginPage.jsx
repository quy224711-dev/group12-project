import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // ✅ Lấy đủ 3 thông tin
      const { accessToken, refreshToken, user } = response.data;
      
      // ✅ Dispatch đầy đủ
      dispatch(loginSuccess({ accessToken, refreshToken, user }));
      
     navigate('/');
      
    } catch (err) {
      let errorMsg = 'Lỗi đăng nhập';
      
      if (err.response) {
        if (err.response.status === 429) {
          errorMsg = err.response.data.message || 'Bạn đã đăng nhập sai quá nhiều lần.';
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      }
      
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
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
      
        {message.text && message.type === 'error' && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;