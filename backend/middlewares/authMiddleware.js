// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
// (Không cần User model ở đây nữa)

// ✅ SỬA LẠI HÀM PROTECT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // 1. Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 2. Gắn user (với userId) vào request
      // (File controller sẽ dùng req.user.userId để tìm trong DB)
      req.user = decoded; // 👈 req.user BÂY GIỜ LÀ { userId: "...", role: "..." }
      
      next();
    } catch (error) {
      console.error('LỖI XÁC THỰC TOKEN:', error.message);
      // Trả về 401 để api.js (frontend) biết mà refresh
      res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }
};

// ✅ HÀM ADMINONLY (Giữ nguyên)
const adminOnly = (req, res, next) => {
  // req.user đã được hàm protect ở trên gắn vào
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ admin mới được phép thực hiện hành động này" });
  }
};

module.exports = {
  protect,
  adminOnly,
};