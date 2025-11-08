
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



// Yêu cầu (require) các file routes MỘT LẦN ở đầu
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
// const userRoutes = require('./routes/user'); // (File này có vẻ cũ, không dùng?)

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend ở port khác gọi API

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB kết nối thành công"))
  .catch(err => console.error("❌ MongoDB kết nối bị lỗi", err));

// === SỬ DỤNG ROUTES (ĐÃ SỬA LỖI) ===
// Mục tiêu: Frontend gọi POST /api/auth/login

// 1. Auth Routes (Login, Signup, Refresh)
// Tiền tố /api/auth sẽ được GẮN VÀO MỌI ROUTE trong authRoutes
// Ví dụ: /login (trong authRoutes.js) -> /api/auth/login
// Ví dụ: /refresh -> /api/auth/refresh
app.use('/api/auth', authRoutes);

// 2. Profile Routes
// (Giả sử frontend gọi /api/profile, /api/upload-avatar)
app.use('/api', profileRoutes);

// 3. Password Routes
// (Giả sử frontend gọi /api/forgot-password)
app.use('/api', passwordRoutes);

// 4. Admin Routes
// (Giả sử frontend gọi /api/users)
app.use('/api', adminRoutes);

// === XÓA HẾT CÁC DÒNG app.use() LỘN XỘN VÀ TRÙNG LẶP ===
// (Tôi đã xóa các dòng "app.use('/api', authRoutes);" và "app.use('/auth', authRoutes);" cũ)

// Đổi port sang 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
