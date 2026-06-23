import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, Scissors } from "lucide-react";

export default function CustomerLogIn({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://salonproject.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/HairDresserSalon/login`, {
        Email: email,
        PasswordHash: password,
      });
      const userData = response.data.user;
      const token = response.data.token;
      if (userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", token);
        if (onLoginSuccess) onLoginSuccess(userData);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login fejlede", err);
      setError(err.response?.data?.message || "Forkert e-mail eller adgangskode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "transparent", color: "#e8edf5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.2)", borderRadius: 28, padding: "48px 40px", textAlign: "center", backdropFilter: "blur(10px)", animation: "fadeUp 0.5s ease forwards" }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        <div style={{ marginBottom: 36 }}>
          <Scissors size={28} color="#378add" style={{ margin: "0 auto 16px", display: "block" }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Salon Royale</h1>
          <p style={{ fontSize: 10, color: "rgba(232,237,245,0.35)", letterSpacing: "0.3em", textTransform: "uppercase" }}>Log ind på din profil</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)", color: "#f09595", fontSize: 12, borderRadius: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <User size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input type="email" placeholder="Din e-mail" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input type="password" placeholder="Din adgangskode" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", background: loading ? "rgba(24,95,165,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "16px", borderRadius: 14, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}>
            {loading ? "Logger ind..." : "Log ind"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 10, color: "rgba(232,237,245,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Mangler du en konto? <Link to="/register" style={{ color: "#378add", fontWeight: 700, textDecoration: "none" }}>Opret her</Link>
          </p>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.25)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Tilbage til forsiden
          </button>
        </div>
      </div>
    </div>
  );
}