import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

   await axios.post("/users", newUser);
      alert("✅ Thêm user thành công!");
      setNewUser({ name: "", email: "" });
      if (onUserAdded) onUserAdded(); // gọi reload danh sách
    } catch (error) {
      alert("❌ Lỗi khi thêm user!");
      console.error(error);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Tên"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
