import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./Store/Components/LandingPage";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";
import Register from "./Store/Components/Register";


function App() {
  const [user, setUser] = useState(null);

  // Vi tjekker localStorage når appen starter
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // En funktion til at opdatere login-status fra Login-komponenten
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Hvis logget ind, kan man ikke gå til /login (sendes hjem) */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        
        {/* Hvis IKKE logget ind, kan man ikke gå til /dashboard (sendes til login) */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        <Route path="/book" element={<BookingPage />} />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register onLoginSuccess={handleLoginSuccess} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;