import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./Store/Components/LandingPage";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import FrisorLogin from "./Store/Components/FrisorLogin";
import Register from "./Store/Components/Register";
import AdminPanel from "./Store/Components/AdminPanel";
import { getCurrentUser } from './SYSAdmin';

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
      <Routes>
        <Route path="/" element={<LandingPage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLoginSuccess={user => handleLoginSuccess(user, "kunde")} />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register onLoginSuccess={user => handleLoginSuccess(user, "kunde")} />} />
        <Route path="/dashboard" element={currentUser?.rolle === "kunde" ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/frisor-login" element={currentUser?.rolle === "frisor" ? <Navigate to="/admin" /> : <FrisorLogin onLoginSuccess={user => handleLoginSuccess(user, "frisor")} />} />
        <Route path="/admin" element={currentUser?.rolle === "frisor" ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/frisor-login" />} />
        <Route path="*" element={<div>404 – Siden findes ikke!</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;