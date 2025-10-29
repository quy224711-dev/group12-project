// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Dùng file api.js đã tạo

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy thông tin cá nhân (GET /profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile'); // Dùng api.get
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setMessage({ text: 'Không thể tải thông tin cá nhân.', type: 'error' });
      }
    };

    fetchProfile();
  }, []); // Chạy 1 lần khi trang được tải

  // 2. Xử lý thay đổi trên form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Cập nhật thông tin cá nhân (PUT /profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/profile', formData); // Dùng api.put
      setProfile(response.data); // Cập nhật lại thông tin mới
      setMessage({ text: '✔ Cập nhật thông tin thành công!', type: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    }
  };

  if (isLoading) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <main>
      <div className="auth-card">
        <h2>Thông tin cá nhân</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Tên của bạn</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Cập nhật thông tin</button>
        </form>
        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;