// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; 
// KHÔNG cần import './AdminPage.css'; vì bạn dùng App.css

function AdminPage() {
 const [users, setUsers] = useState([]);
 const [logs, setLogs] = useState([]); // 👈 STATE MỚI CHO HĐ 5
 const [message, setMessage] = useState({ text: '', type: '' });
 const [isLoading, setIsLoading] = useState(true);

 // 1. Nâng cấp: Lấy cả User (HĐ 2) và Logs (HĐ 5)
 useEffect(() => {
 const fetchData = async () => {
 setIsLoading(true);
 try {
        // Gọi 2 API song song để tải nhanh hơn
 const [usersResponse, logsResponse] = await Promise.all([
 api.get('/users'),      // API của HĐ 2
 api.get('/admin/logs') // API của HĐ 5
 ]);
        
 setUsers(usersResponse.data);
 setLogs(logsResponse.data); // 👈 LƯU LOGS VÀO STATE
 } catch (error) {
 console.error("Lỗi khi tải dữ liệu admin:", error);
 setMessage({ text: 'Không thể tải dữ liệu. Bạn có phải Admin?', type: 'error' });
 } finally {
 setIsLoading(false);
 }
 };
 fetchData();
 }, []); 

 // 2. Xử lý xóa (Giữ nguyên, không đổi)
  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setMessage({ text: '✔ Xóa người dùng thành công!', type: 'success' });
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
        setMessage({ text: '✖ ' + errorMsg, type: 'error' });
      }
    }
  };

  if (isLoading) {
    // Cập nhật text
    return <div className="auth-card">Đang tải dữ liệu Admin...</div>;
  }

  // 3. Nâng cấp JSX (thêm bảng Logs)
  return (
    // Đổi tên class cho thống nhất (tùy chọn)
    <div className="admin-container auth-card"> 
      
      {/* BẢNG 1: QUẢN LÝ USER (HĐ 2) */}
      <h2>Quản lý Người dùng</h2>
      {message.text && (
        <div className={`message-box ${message.type}`}>{message.text}</div>
      )}
      <table className="admin-table"> {/* Đổi tên class */}
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
      
      {/* ===== BẢNG 2: NHẬT KÝ HOẠT ĐỘNG (HĐ 5) ===== */}
      <h2 style={{ marginTop: '40px' }}>Nhật ký hoạt động</h2>
      <table className="admin-table"> {/* Dùng chung 1 class CSS */}
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người dùng (Email)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}> {/* Giả sử SV3 dùng _id */}
              <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
              <td>{log.userEmail}</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ========================================== */}
      
    </div>
  );
}

export default AdminPage;