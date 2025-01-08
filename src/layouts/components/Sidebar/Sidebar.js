import React from "react";

const Sidebar = () => {
  return (
    <aside
      style={{
        width: "200px",
        background: "#f4f4f4",
        padding: "20px",
        height: "100vh",
      }}
    >
      <ul>
        <li>Dashboard</li>
        <li>Account</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
