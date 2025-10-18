import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // lưu user đang sửa
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });

  // Lấy danh sách user khi load trang
  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🧹 Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("🗑️ Xóa user thành công!");
    } catch (error) {
      alert("❌ Lỗi khi xóa user!");
      console.error(error);
    }
  };

  // ✏️ Chọn user để sửa
  const handleEdit = (user) => {
    setEditUser(user);
    setUpdatedData({ name: user.name, email: user.email });
  };

  // 💾 Gửi PUT request cập nhật user
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/users/${editUser.id}`, updatedData);
      setUsers(
        users.map((u) =>
          u.id === editUser.id ? { ...u, ...updatedData } : u
        )
      );
      setEditUser(null);
      alert("✅ Cập nhật user thành công!");
    } catch (error) {
      alert("❌ Lỗi khi cập nhật user!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editUser?.id === user.id ? (
              <>
                <input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  value={updatedData.email}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, email: e.target.value })
                  }
                />
                <button onClick={handleUpdate}>Lưu</button>
                <button onClick={() => setEditUser(null)}>Hủy</button>
              </>
            ) : (
              <>
                {user.name} - {user.email}
                <button onClick={() => handleEdit(user)}>Sửa</button>
                <button onClick={() => handleDelete(user.id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
