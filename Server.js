const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./User");

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

// 🧩 API: Đăng ký tài khoản
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    // Tạo user (mật khẩu tự được hash trong pre-save)
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🧩 API: Đăng nhập
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user, cần +password vì mặc định schema ẩn password
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret_key_example", // ⚠️ Nên lưu trong .env
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🧩 API: Đăng xuất (client tự xóa token)
app.post("/logout", (req, res) => {
  res.json({ message: "Đăng xuất thành công! (Client tự xóa token)" });
});

// 🚀 Chạy server
app.listen(3000, () =>
  console.log("🚀 Server đang chạy tại http://localhost:3000")
);
