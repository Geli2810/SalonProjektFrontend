import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Scissors } from "lucide-react";

export default function FrisorLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post('https://salonproject.onrender.com/api/Auth/frisor-login', {
        Email: form.email,
        Password: form.password
      });
      const frisorData = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      sessionStorage.setItem("frisor", JSON.stringify({ ...frisorData, rolle: "frisor" }));
      if (onLoginSuccess) onLoginSuccess({ ...frisorData, rolle: "frisor" }, "frisor");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message ?? "Login fejlede.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(55,138,221,0.2)", color: "#e8edf5", padding: "12px 12px 12px 28px", fontSize: 14, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "transparent", color: "#e8edf5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.2)", borderRadius: 28, padding: "48px 40px", textAlign: "center", backdropFilter: "blur(10px)", animation: "fadeUp 0.5s ease forwards" }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        <div style={{ marginBottom: 36 }}>
          <Scissors size={28} color="#378add" style={{ margin: "0 auto 16px", display: "block" }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>SuperKlip</h1>
          <p style={{ fontSize: 10, color: "#378add", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600 }}>Frisør login</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)", color: "#f09595", fontSize: 12, borderRadius: 12, fontWeight: 600 }}>
            {typeof error === "object" ? JSON.stringify(error) : error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <Mail size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input name="email" type="email" placeholder="Email" required onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={15} color="rgba(232,237,245,0.25)" style={{ position: "absolute", left: 0, top: 14 }} />
            <input name="password" type="password" placeholder="Kodeord" required onChange={handleChange} style={inputStyle} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", background: loading ? "rgba(24,95,165,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "16px", borderRadius: 14, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}>
            {loading ? "Logger ind..." : "Log ind"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: 36 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.25)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Tilbage til forsiden
          </button>
        </div>
      </div>
    </div>
  );
}