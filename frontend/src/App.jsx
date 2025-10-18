import React from "react";
import UserList from "./components/UserList";
// Không cần import AddUser ở đây nữa

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>Quản lý người dùng</h1>
      {/* <AddUser /> Xóa dòng này đi */}
      <hr />
      <UserList />
    </div>
  );
}

export default App;