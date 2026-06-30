import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Scissors, AlertCircle } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
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
      // PRØV FØRST SOM KUNDE
      try {
        const kundeRes = await axios.post(`${API_URL}/api/HairDresserSalon/login`, {
          Email: email.trim(),
          PasswordHash: password,
        });

        const userData = kundeRes.data.user || kundeRes.data;
        if (userData && (userData.kundeId || userData.rolle === "kunde")) {
          sessionStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem("currentUser", JSON.stringify({ ...userData, rolle: "kunde" }));
          if (onLoginSuccess) onLoginSuccess({ ...userData, rolle: "kunde" }, "kunde");
          window.location.href = "/";
          return;
        }
      } catch (kundeErr) {
        // Ikke kunde - prøv frisør
      }

      // PRØV SOM FRISØR
      try {
        const frisorRes = await axios.post(`${API_URL}/api/Auth/frisor-login`, {
          Email: email.trim(),
          Password: password,
        });

        const frisorData = typeof frisorRes.data === "string" ? JSON.parse(frisorRes.data) : frisorRes.data;
        if (frisorData && (frisorData.frisorId || frisorData.rolle === "frisor")) {
          sessionStorage.setItem("frisor", JSON.stringify({ ...frisorData, rolle: "frisor" }));
          if (onLoginSuccess) onLoginSuccess({ ...frisorData, rolle: "frisor" }, "frisor");
          window.location.href = "/admin";
          return;
        }
      } catch (frisorErr) {
        // Heller ikke frisør
      }

      // Ingen af delene virkede
      setError("Forkert email eller adgangskode.");

    } catch (err) {
      setError("Der opstod en fejl. Prøv igen.");
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
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>SuperKlip</h1>
          <p style={{ fontSize: 10, color: "rgba(232,237,245,0.35)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Log ind som kunde eller frisør
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)", color: "#f09595", fontSize: 12, borderRadius: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <Mail size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input
              type="password"
              placeholder="Kodeord"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: loading ? "rgba(24,95,165,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "16px", borderRadius: 14, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}
          >
            {loading ? "Logger ind..." : "Log ind"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 10, color: "rgba(232,237,245,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Mangler du en konto?{" "}
            <Link to="/register" style={{ color: "#378add", fontWeight: 700, textDecoration: "none" }}>Opret her</Link>
          </p>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.25)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Tilbage til forsiden
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(55,138,221,0.08)", fontSize: 9, color: "rgba(232,237,245,0.2)", textAlign: "center" }}>
          Både kunder og frisører kan logge ind her
        </div>
      </div>
    </div>
  );
}