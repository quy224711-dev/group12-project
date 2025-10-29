// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; 

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  // === STATE MỚI CHO AVATAR ===
  const [avatarFile, setAvatarFile] = useState(null); 
  const [avatarPreview, setAvatarPreview] = useState(null);

  // 1. Lấy thông tin cá nhân (Cập nhật để lấy avatar)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
        setAvatarPreview(response.data.avatar); // 👈 Lấy URL avatar
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setMessage({ text: 'Không thể tải thông tin cá nhân.', type: 'error' });
      }
    };
    fetchProfile();
  }, []); 

  // 2. Xử lý thay đổi form thông tin (Giữ nguyên)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Cập nhật thông tin (Giữ nguyên)
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/profile', formData);
      setProfile(response.data);
      setMessage({ text: '✔ Cập nhật thông tin thành công!', type: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    }
  };

  // === LOGIC MỚI CHO AVATAR ===

  // 4. Xử lý khi chọn file avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Tạo link xem trước ảnh tạm thời
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  // 5. Xử lý upload avatar (API /upload-avatar)
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      setMessage({ text: '✖ Vui lòng chọn một file ảnh.', type: 'error' });
      return;
    }

    // Phải dùng FormData để gửi file lên server
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile); // 'avatar' phải giống key backend yêu cầu
    setIsUploading(true);
    setMessage({ text: '', type: '' }); // Xóa thông báo cũ
    try {
      // Gọi API upload (dùng api.js vì CẦN token)
      const response = await api.post('/upload-avatar', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Cập nhật lại avatar mới từ server
      console.log("Backend trả về:", response.data); 
      setAvatarPreview(response.data.avatar); // 👈 Đổi thành "avatar" cho khớp backend
      setMessage({ text: '✔ Cập nhật avatar thành công!', type: 'success' });
      setAvatarFile(null); // Xóa file đã chọn

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi upload ảnh.';
      setMessage({ text: '✖ ' + errorMsg, type: 'error' });
    }finally {
      // 👇 THÊM 3 DÒNG NÀY VÀO
      setIsUploading(false); // Tắt trạng thái loading BẤT KỂ LỖI HAY KHÔNG
    }
 }; 


  if (isLoading) {
    return <div>Đang tải thông tin...</div>;
  }

  // === GIAO DIỆN MỚI (JSX) ===
  return (
    // 👇 1. Thêm class "auth-card" vào container cha
    <div className="profile-container auth-card"> 
      
      {/* CỘT 1: UPLOAD AVATAR */}
      {/* 👇 2. Xóa class "auth-card" khỏi cột con */}
      <div className="profile-avatar-card"> 
        <h2>Ảnh đại diện</h2>
        <img 
          src={avatarPreview || 'https://via.placeholder.com/200'}
          
          className="avatar-preview"
        />
        <form onSubmit={handleAvatarUpload}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="input-file"
          />
          <button 
            type="submit" 
            className="auth-button" 
            // Chỉ vô hiệu hóa khi ĐANG UPLOAD
            disabled={isUploading} 
          >
            {/* Thay đổi text khi đang upload */}
            {isUploading ? 'Đang upload...' : 'Upload ảnh mới'}
          </button>
        </form>
      </div>

      {/* CỘT 2: CẬP NHẬT THÔNG TIN */}
      {/* 👇 3. Xóa class "auth-card" khỏi cột con */}
      <div className="profile-info-card">
        <h2>Thông tin cá nhân</h2>
        <form className="auth-form" onSubmit={handleSubmitInfo}>
          <label>Tên của bạn</label>
          <input
            type="text" name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email" name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Lưu thay đổi</button>
        </form>
      </div>

      {/* Thông báo chung ở dưới */}
      {message.text && (
        <div className={`message-box ${message.type} profile-message`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;