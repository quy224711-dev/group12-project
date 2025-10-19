import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";

function UserList() {
  const [users, setUsers] = useState([]);
  // 👈 THÊM STATE ĐỂ QUẢN LÝ VIỆC SỬA
  const [editingUser, setEditingUser] = useState(null); // Lưu thông tin user đang được sửa
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" }); // Lưu dữ liệu mới khi sửa

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 👈 THÊM CÁC HÀM XỬ LÝ SỬA VÀ XÓA
  // 1. Xử lý sự kiện Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`/users/${id}`); // Dùng đường dẫn tương đối
        fetchUsers(); // Tải lại danh sách người dùng
        alert("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Có lỗi xảy ra khi xóa người dùng.");
      }
    }
  };

  // 2. Xử lý sự kiện khi bấm nút "Sửa"
  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedData({ name: user.name, email: user.email });
  };

  // 3. Xử lý sự kiện khi bấm nút "Lưu" (Cập nhật)
  const handleUpdate = async () => {
    try {
      await axios.put(`/users/${editingUser._id}`, updatedData);
      fetchUsers(); // Tải lại danh sách
      setEditingUser(null); // Thoát khỏi chế độ sửa
      alert("Cập nhật người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Có lỗi xảy ra khi cập nhật người dùng.");
    }
  };

  // 4. Xử lý sự kiện khi bấm nút "Hủy"
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <AddUser onUserAdded={fetchUsers} />
      <h2>Danh sách người dùng</h2>
      <ul>
        {/* 👇 CẬP NHẬT GIAO DIỆN HIỂN THỊ CÓ ĐIỀU KIỆN */}
        {users.map((user) => (
          <li key={user._id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            {editingUser?._id === user._id ? (
              // Chế độ SỬA
              <>
                <input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                />
                <input
                  type="email"
                  value={updatedData.email}
                  onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
                <button onClick={handleUpdate} style={{ marginLeft: '10px' }}>Lưu</button>
                <button onClick={handleCancelEdit}>Hủy</button>
              </>
            ) : (
              // Chế độ HIỂN THỊ
              <>
                <div style={{ flex: 1 }}>
                  <strong>{user.name}</strong> - {user.email}
                </div>
                <button onClick={() => handleEdit(user)}>Sửa</button>
                <button onClick={() => handleDelete(user._id)} style={{ marginLeft: '5px' }}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;