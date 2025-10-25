// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Nếu không có token, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Nếu có token, cho phép hiển thị component con (ví dụ: ProfilePage)
  return children;
}

export default ProtectedRoute;