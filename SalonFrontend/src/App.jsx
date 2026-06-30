import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./Store/Components/LandingPage";
import LoginPage from "./Store/Components/LoginPage";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import Register from "./Store/Components/Register";
import AdminPanel from "./Store/Components/AdminPanel";
import { getCurrentUser } from './SYSAdmin';
import SalonBackground from "./Store/Components/SalonBackground";
import CancelPage from "./Store/Components/CancelPage";

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLoginSuccess = (userData, rolle = "kunde") => {
    if (rolle === "frisor") {
      sessionStorage.setItem("frisor", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("currentUser", JSON.stringify(userData));
    }
    
    const updatedUser = getCurrentUser();
    setCurrentUser(updatedUser);
    
    console.log('✅ Login success - rolle:', rolle, 'user:', updatedUser);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      {/* FAST BAGGRUND */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#080c14" }}>
        <SalonBackground />
      </div>

      {/* ALT INDHOLD ovenpå baggrunden */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          {/* FORSIDE */}
          <Route 
            path="/" 
            element={<LandingPage currentUser={currentUser} onLogout={handleLogout} />} 
          />
          
          {/* FÆLLES LOGIN (kunde + frisør) */}
          <Route 
            path="/login" 
            element={
              currentUser ? 
                <Navigate to={currentUser.rolle === "frisor" ? "/admin" : "/"} /> : 
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            } 
          />
          
          {/* REGISTRERING */}
          <Route 
            path="/register" 
            element={
              currentUser ? 
                <Navigate to="/" /> : 
                <Register onLoginSuccess={user => handleLoginSuccess(user, "kunde")} />
            } 
          />
          
          {/* DASHBOARD - KUN for kunder */}
          <Route 
            path="/dashboard" 
            element={
              currentUser?.rolle === "kunde" ? 
                <Dashboard onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
          
          {/* BOOKING - ALTID tilgængelig */}
          <Route 
            path="/book" 
            element={<BookingPage />} 
          />
          
          {/* ADMIN PANEL - KUN for frisører */}
          <Route 
            path="/admin" 
            element={
              currentUser?.rolle === "frisor" ? 
                <AdminPanel onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />

          {/* CANCEL PAGE */}
          <Route path="/cancel" element={<CancelPage />} />
          
          {/* 404 */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                color: "#e8edf5", 
                padding: "120px 40px", 
                textAlign: "center",
                fontFamily: "'Segoe UI', Arial, sans-serif"
              }}>
                <h1 style={{ fontSize: 60, fontWeight: 300, marginBottom: 16, color: "#378add" }}>404</h1>
                <p style={{ fontSize: 16, color: "rgba(232,237,245,0.5)", marginBottom: 32 }}>
                  Siden findes ikke
                </p>
                <a href="/" style={{
                  color: "#378add",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none"
                }}>
                  ← Gå til forsiden
                </a>
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;