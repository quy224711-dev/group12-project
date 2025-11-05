// backend/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken"); // 👈 Sửa 1: Dùng require
// const User = require("../models/User.js"); // (Không cần User trong file này)

// ✅ Middleware xác thực người dùng qua token
const protect = async (req, res, next) => { // 👈 Sửa 2: Dùng const
  let token;

  // Lấy token từ header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Gắn user vào request (chúng ta không cần tìm trong DB, token đã có info)
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('LỖI XÁC THỰC TOKEN:', error.message);
      res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn (lỗi 403)" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }
};

// ✅ Middleware chỉ cho admin truy cập
const adminOnly = (req, res, next) => { // 👈 Sửa 2: Dùng const
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ admin mới được phép thực hiện hành động này" });
  }
};

// ❌ Không cần hàm verifyAccessToken này nữa, vì nó giống hệt `protect`

// 👈 Sửa 3: Dùng module.exports
module.exports = {
  protect,
  adminOnly,
};