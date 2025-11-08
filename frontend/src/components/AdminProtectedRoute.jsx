<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser); // 👈 Hỏi kho Redux

  // Kiểm tra user có tồn tại VÀ có phải admin không
  if (user && user.role === 'admin') {
    return children; // Nếu đúng, cho phép vào
  }

  // Nếu không phải admin (hoặc chưa login), đá về trang chủ
  return <Navigate to="/" replace />;
=======

import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import thư viện jwt

// Hàm này đọc token và trả về role
const getRoleFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role; // Đọc 'role' từ bên trong token
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};
function AdminProtectedRoute({ children }) {
  const userRole = getRoleFromToken();

  if (userRole !== 'admin') {
    // Nếu không phải admin, đá về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu là admin, cho phép vào
  return children;
>>>>>>> main
}

export default AdminProtectedRoute;