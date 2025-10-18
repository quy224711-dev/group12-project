import React from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser />
      <hr />
      <UserList />
    </div>
  );
}

export default App;