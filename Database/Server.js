const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// ✅ Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://groupUser:12345@cluster01.t1ahfim.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster01",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 🔗 Đăng ký routes
app.use("/api/auth", authRoutes);

// 🚀 Chạy server
app.listen(3000, () =>
  console.log("🚀 Server đang chạy tại http://localhost:3000")
);
