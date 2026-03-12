import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./Store/Components/LandingPage";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import Register from "./Store/Components/Register";

function App() {
  // Vi læser status med det samme fra sessionStorage
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* LOGIN RUTE: Hvis logget ind, send til forsiden. Ellers vis Login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        
        {/* DASHBOARD RUTE: Hvis logget ind, vis Dashboard. Ellers send til login */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        <Route path="/book" element={<BookingPage />} />
        
        {/* REGISTER RUTE: Samme logik som login */}
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register onLoginSuccess={handleLoginSuccess} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;