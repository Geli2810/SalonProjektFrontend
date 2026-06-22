// src/Components/AdminPanel.jsx
import React from "react";
import { getCurrentUser } from "../../SYSAdmin";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <div>
      <h1>Frisørpanel</h1>
      <p>Velkommen, {user?.navn}</p>
      {/* Her laver du rolletjek for frisørfunktioner */}
      <button onClick={handleLogout}>Log ud</button>
    </div>
  );
}