import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./Store/Components/LandingPage";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import FrisorLogin from "./Store/Components/FrisorLogIn";
import Register from "./Store/Components/Register";
import AdminPanel from "./Store/Components/AdminPanel"; // Lav/tilføj denne!
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
  };

  return (
    <BrowserRouter>
      <nav>{/* ...Se ovenfor for rollebaseret menu... */}</nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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