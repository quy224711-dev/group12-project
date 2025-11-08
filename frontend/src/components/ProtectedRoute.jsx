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
  return children;
}

export default ProtectedRoute;