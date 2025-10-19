const express = require("express");
const mongoose = require("mongoose");
const User = require("./User");

const app = express();
app.use(express.json());

// 🔗 Kết nối tới MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://groupUser:12345@cluster01.t1ahfim.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster01",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 📥 Lấy toàn bộ người dùng
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 📤 Thêm người dùng mới
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json({ message: "Thêm người dùng thành công!", user });
});

// 🚀 Chạy server
app.listen(3000, () =>
  console.log("Server đang chạy tại http://localhost:3000")
);
