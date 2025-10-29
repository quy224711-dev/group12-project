import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware xác thực người dùng qua token
export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Middleware chỉ cho admin truy cập
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới được phép thực hiện hành động này" });
  }
  next();
};

// ✅ Middleware xác thực Access Token (dùng cho Refresh Token feature)
export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};
