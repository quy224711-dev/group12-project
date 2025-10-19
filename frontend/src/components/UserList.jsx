import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });

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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
      alert("🗑️ Xóa user thành công!");
    } catch (error) {
      alert("❌ Lỗi khi xóa user!");
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedData({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`/users/${editingUser._id}`, updatedData);
      fetchUsers();
      setEditingUser(null);
      alert("✅ Cập nhật user thành công!");
    } catch (error) {
      alert("❌ Lỗi khi cập nhật user!");
      console.error(error);
    }
  };

  return (
    <>
      <AddUser onUserAdded={fetchUsers} />
      <div className="card">
        <h2>Danh sách người dùng</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {editingUser?._id === user._id ? (
                <>
                  <input
                    type="text"
                    value={updatedData.name}
                    onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    style={{ marginLeft: '10px', flexGrow: 2 }}
                    value={updatedData.email}
                    onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                  />
                  <button onClick={handleUpdate} className="btn-save">Lưu</button>
                  <button onClick={() => setEditingUser(null)} className="btn-cancel">Hủy</button>
                </>
              ) : (
                <>
                  <div className="user-info">
                    <strong>{user.name}</strong> - <span>{user.email}</span>
                  </div>
                  <button onClick={() => handleEdit(user)} className="btn-edit">Sửa</button>
                  <button onClick={() => handleDelete(user._id)} className="btn-delete">Xóa</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default UserList;