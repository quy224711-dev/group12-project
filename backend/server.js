const express = require('express');
const app = express();

// Import routes
const userRoutes = require('./routes/user');  // ✅ Đúng đường dẫn

// Middleware để đọc JSON từ request body
app.use(express.json());

// Gắn router
app.use('/', userRoutes);  // ✅ Cho phép truy cập /users

// Cổng chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
