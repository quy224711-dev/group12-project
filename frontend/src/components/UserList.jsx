import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
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
      await axios.delete(`http://localhost:5000/users/${id}`);
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
      await axios.put(`http://localhost:5000/users/${editingUser._id}`, updatedData);
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
        <table className="user-table">
          <thead>
            <tr>
              {/* 👇 Thêm cột STT */}
              <th>STT</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* 👇 Thêm 'index' vào hàm map */}
            {users.map((user, index) => (
              <tr key={user._id}>
                {editingUser?._id === user._id ? (
                  <>
                    {/* 👇 Thêm một ô trống cho STT khi đang sửa */}
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="edit-input"
                        value={updatedData.name}
                        onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="edit-input"
                        value={updatedData.email}
                        onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={handleUpdate} className="btn-save">Lưu</button>
                        <button onClick={() => setEditingUser(null)} className="btn-cancel">Hủy</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {/* 👇 Hiển thị số thứ tự */}
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(user)} className="btn-edit">Sửa</button>
                        <button onClick={() => handleDelete(user._id)} className="btn-delete">Xóa</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserList;