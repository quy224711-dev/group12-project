import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({}); // 👈 State để lưu lỗi validation
  const [isLoading, setIsLoading] = useState(false);

  // 👈 Hàm validation
  const validateForm = () => {
    const newErrors = {};
    if (!newUser.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }
    if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Dừng lại nếu có lỗi
    }
    
    setIsLoading(true);
    setErrors({}); // Xóa lỗi cũ
    try {
      await axios.post("/users", newUser);
      alert("✅ Thêm user thành công!");
      setNewUser({ name: "", email: "" });
      if (onUserAdded) onUserAdded();
    } catch (error) {
      alert("❌ Lỗi khi thêm user!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ flex: 2 }}>
          <input
            type="text"
            placeholder="Tên"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div style={{ flex: 3 }}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang thêm...' : 'Thêm'}
        </button>
      </form>
    </div>
  );
}

export default AddUser;
