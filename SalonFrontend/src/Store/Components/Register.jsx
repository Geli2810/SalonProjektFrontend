import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Scissors } from "lucide-react";

export default function Register({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ navn: "", email: "", telefon: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://salonproject.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/HairDresserSalon/customers`, {
        Navn: formData.navn,
        Email: formData.email,
        Telefon: formData.telefon,
        PasswordHash: formData.password
      });
      const nyBruger = response.data;
      if (nyBruger) {
        sessionStorage.setItem("user", JSON.stringify(nyBruger));
        sessionStorage.setItem("token", "session_auth_token");
        if (onLoginSuccess) onLoginSuccess(nyBruger);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Kunne ikke oprette din profil.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "transparent", color: "#e8edf5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.2)", borderRadius: 28, padding: "48px 40px", backdropFilter: "blur(10px)", animation: "fadeUp 0.5s ease forwards" }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Scissors size={28} color="#378add" style={{ margin: "0 auto 16px", display: "block" }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Salon Royale</h1>
          <p style={{ fontSize: 10, color: "rgba(232,237,245,0.35)", letterSpacing: "0.3em", textTransform: "uppercase" }}>Bliv medlem i dag</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)", color: "#f09595", fontSize: 12, borderRadius: 12, fontWeight: 600, textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ position: "relative" }}>
            <User size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input required placeholder="Fulde navn" style={inputStyle} onChange={e => setFormData({ ...formData, navn: e.target.value })} />
          </div>
          <div style={{ position: "relative" }}>
            <Mail size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input required type="email" placeholder="Din e-mail" style={inputStyle} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div style={{ position: "relative" }}>
            <Phone size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input required placeholder="Telefonnummer" style={inputStyle} onChange={e => setFormData({ ...formData, telefon: e.target.value })} />
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input required type="password" placeholder="Vælg adgangskode" style={inputStyle} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", background: loading ? "rgba(24,95,165,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "16px", borderRadius: 14, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", marginTop: 8, boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}>
            {loading ? "Opretter..." : "Opret profil & start"}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link to="/login" style={{ color: "rgba(232,237,245,0.35)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>
            Har du allerede en konto? <span style={{ color: "#378add", fontWeight: 700 }}>Log ind her</span>
          </Link>
        </div>
      </div>
    </div>
  );
}