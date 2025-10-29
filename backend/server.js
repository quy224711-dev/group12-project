const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend ở port khác gọi API

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB kết nối thành công"))
  .catch(err => console.error("❌ MongoDB kết nối bị lỗi", err));

// Sử dụng routes
app.use('/users', userRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);
app.use('/api', require('./routes/profileRoutes'));


// Đổi port sang 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);
const passwordRoutes = require('./routes/passwordRoutes');
const profileRoutes = require('./routes/profileRoutes');
app.use('/api', passwordRoutes);
app.use('/api', profileRoutes);
