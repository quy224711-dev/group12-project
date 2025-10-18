import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";

function UserList() {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <AddUser onUserAdded={fetchUsers} />
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))
        ) : (
          <p>Chưa có người dùng nào</p>
        )}
      </ul>
    </div>
  );
}

export default UserList;
