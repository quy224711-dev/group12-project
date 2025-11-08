<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser); // 👈 Hỏi kho Redux

  if (!user) {
    // Nếu trong kho không có user, đá về login
    return <Navigate to="/login" replace />;
  }

  // Nếu có user, cho phép vào
=======
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
>>>>>>> main
  return children;
}

export default ProtectedRoute;