
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
}

export default AdminProtectedRoute;