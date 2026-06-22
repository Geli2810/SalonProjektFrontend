// src/Components/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../SYSAdmin";
import { LogOut } from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <nav>
        <Link to="/">Salon Royale</Link>
        {user?.rolle === "kunde" && (
          <>
            <Link to="/dashboard">Min Profil</Link>
            <Link to="/book">Book Tid</Link>
            <button onClick={handleLogout}><LogOut size={14}/> Log ud</button>
          </>
        )}
        {user?.rolle === "frisor" && (
          <>
            <Link to="/admin">Adminpanel</Link>
            <button onClick={handleLogout}><LogOut size={14}/> Log ud</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">Log Ind</Link>
            <Link to="/frisor-login">Frisør Login</Link>
          </>
        )}
      </nav>
      <main>
        <h1>Velkommen til Salon Royale</h1>
        {/* ... resten af din hero/intro */}
      </main>
    </div>
  );
}