import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./Store/Components/LandingPage";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import FrisorLogin from "./Store/Components/FrisorLogin";
import Register from "./Store/Components/Register";
import AdminPanel from "./Store/Components/AdminPanel";
import { getCurrentUser } from './SYSAdmin';
import SalonBackground from "./Store/Components/SalonBackground";

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const handleLoginSuccess = (userData, rolle = "kunde") => {
    if (rolle === "frisor") sessionStorage.setItem("frisor", JSON.stringify(userData));
    else sessionStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      {/* FAST BAGGRUND — vises bag ALLE sider */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#080c14" }}>
        <SalonBackground />
      </div>

      {/* ALT INDHOLD ligger ovenpå baggrunden */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLoginSuccess={user => handleLoginSuccess(user, "kunde")} />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register onLoginSuccess={user => handleLoginSuccess(user, "kunde")} />} />
          <Route path="/dashboard" element={currentUser?.rolle === "kunde" ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/frisor-login" element={currentUser?.rolle === "frisor" ? <Navigate to="/admin" /> : <FrisorLogin onLoginSuccess={user => handleLoginSuccess(user, "frisor")} />} />
          <Route path="/admin" element={currentUser?.rolle === "frisor" ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/frisor-login" />} />
          <Route path="*" element={<div style={{ color: "#e8edf5", padding: 40, textAlign: "center" }}>404 – Siden findes ikke!</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;