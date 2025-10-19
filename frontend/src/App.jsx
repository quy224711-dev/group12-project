import React from "react";
import UserList from "./components/UserList";
import './App.css'; // 👈 Import file CSS

function App() {
  return (
    <div className="container">
      <h1>Quản lý người dùng</h1>
      <UserList />
    </div>
  );
}

export default App;
