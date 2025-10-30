// middlewares/checkRole.js
module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Chưa đăng nhập!' });
      }

      const rolesHierarchy = { user: 1, moderator: 2, admin: 3 };
      const userRoleLevel = rolesHierarchy[req.user.role];
      const requiredRoleLevel = rolesHierarchy[requiredRole];

      if (userRoleLevel >= requiredRoleLevel) {
        next(); // đủ quyền → cho qua
      } else {
        return res.status(403).json({ message: 'Không có quyền truy cập!' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi kiểm tra quyền!', error: err.message });
    }
  };
};
