import React, { useState } from 'react';
import axios from 'axios';


function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [jwtToken, setJwtToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
      setJwtToken(token); // Save the token to state to display it
      setMessage({ text: '✔ Đăng nhập thành công!', type: 'success' });

     
      
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
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

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
      </div>
   
  );
}

export default LoginPage;