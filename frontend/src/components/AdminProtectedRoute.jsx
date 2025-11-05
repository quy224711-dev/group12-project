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
}

export default AdminProtectedRoute;