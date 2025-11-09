# group12-project

## 1. Thông tin chung

* **Nhóm:** 12
* **Repository:** group12-project

### Thành viên

* **Nguyễn Phú Quý**
    * Vai trò: Phụ trách Database (MongoDB) & Cấu hình (Owner)
* **Trần Tuấn Anh**
    * Vai trò: Phụ trách Frontend (React) & Logic (SV2)
* **Ngô Tỷ**
    * Vai trò: Phụ trách Backend (Node.js + Express)

---

## 🌐 Group12 Project - Web Quản lý Người dùng

🧩 **Giới thiệu:**
Dự án này là ứng dụng Web quản lý người dùng (CRUD) được phát triển bằng Node.js, Express, MongoDB, và ReactJS, bao gồm 5 hoạt động chính: Refresh Token, Phân quyền (RBAC), Quản lý Hồ sơ, Quên mật khẩu, và Giới hạn (Rate Limit).

⚙️ **Công nghệ sử dụng:**
* **Frontend:** ReactJS (React Hooks, React Router, Redux Toolkit)
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas

---

## 🚀 Triển khai (Kết quả cuối cùng)

Hệ thống đã được triển khai (deploy) và sẵn sàng để kiểm tra trực tuyến.

* **Frontend (Vercel):** [https://group12-project-psi.vercel.app](https://group12-project-psi.vercel.app)

* **Backend (Render):** [https://group12-project-100e.onrender.com](https://group12-project-100e.onrender.com)

* **Database (MongoDB):** `mongodb+srv://groupUser:12345@cluster01.t1ahfim.mongodb.net/groupDB`

---

## 🔑 Tài khoản Demo (Để kiểm tra)

Vui lòng sử dụng các tài khoản sau để kiểm tra:

* **Tài khoản Admin (Test HĐ 2, HĐ 5):**
    * **Email:** `admin@example.com`
    * **Mật khẩu:** `123456`

* **Tài khoản User (Test HĐ 1):**
    * **Email:** `anh134@gmail.com`
    * **Mật khẩu:** `123456`

---

## 🚀 Hướng dẫn chạy dự án (Local)

1️⃣ **Clone repo:**
```bash
git clone [https://github.com/quy224711-dev/group12-project.git](https://github.com/quy224711-dev/group12-project.git)
cd group12-project
2️⃣ Cài đặt Backend:

Bash

cd backend
npm install
# Tạo file .env và điền các biến môi trường (MONGO_URI, JWT_SECRET...)
npm start
# Server sẽ chạy ở http://localhost:5000
3️⃣ Cài đặt Frontend:

Bash

cd ../frontend
npm install
npm start
# App sẽ chạy ở http://localhost:3000