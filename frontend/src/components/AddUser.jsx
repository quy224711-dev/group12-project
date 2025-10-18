import React, { useState } from "react";
import axios from "axios";

function AddUser() {
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/users", newUser);
      alert("✅ Thêm user thành công!");
      setNewUser({ name: "", email: "" });
      window.location.reload(); // Tải lại danh sách sau khi thêm
    } catch (error) {
      alert("❌ Lỗi khi thêm user!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
