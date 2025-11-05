// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // 👈 Đã bật import

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy danh sách người dùng (DÙNG DỮ LIỆU THẬT)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Gọi API thật
        const response = await api.get('/users');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        // Báo lỗi nếu không gọi được (ví dụ: không phải admin)
        console.error("Lỗi khi tải danh sách người dùng:", error);
        setIsLoading(false);
        setMessage({ text: 'Không thể tải dữ liệu. Bạn có phải Admin?', type: 'error' });
      }
    };
    fetchUsers();
  }, []); // Mảng rỗng đảm bảo hàm chỉ chạy 1 lần

  // 2. Xử lý xóa người dùng (XÓA DỮ LIỆU THẬT)
  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        // Gọi API thật để xóa user
        await api.delete(`/users/${userId}`);

        // Cập nhật lại giao diện khi API thành công
        setUsers(users.filter(user => user._id !== userId));
        setMessage({ text: '✔ Xóa người dùng thành công!', type: 'success' });

      } catch (error) {
        // Báo lỗi nếu API thất bại
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
        setMessage({ text: '✖ ' + errorMsg, type: 'error' });
      }
    }
  };

  if (isLoading) {
    return <div>Đang tải danh sách người dùng...</div>;
  }

  // Phần JSX (HTML) giữ nguyên
  return (
    <div className="admin-container">
      <h2>Quản lý Người dùng</h2>
      {message.text && (
        <div className={`message-box ${message.type}`}>{message.text}</div>
      )}
      <table className="users-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Quyền (Role)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(user._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;