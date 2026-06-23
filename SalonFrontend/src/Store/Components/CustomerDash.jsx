import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from "../../SYSAdmin";
import { User, LogOut, Scissors, Clock, Mail, Phone, RefreshCw } from 'lucide-react';

export default function CustomerDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendLoading, setBackendLoading] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (!savedUser) { navigate("/login"); return; }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    const timer = setInterval(() => setLoadingSeconds(s => s + 1), 1000);
    axios.get(`${API_URL}/api/Booking/user/${parsedUser.kundeId}`)
      .then(res => { setMyBookings(res.data); setLoading(false); setBackendLoading(false); clearInterval(timer); })
      .catch(err => { console.error(err); setLoading(false); setBackendLoading(false); clearInterval(timer); });
    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (!user || user.rolle !== "kunde") navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => { sessionStorage.clear(); navigate("/"); };

  if (!user) return null;

  const kommende = myBookings.filter(b => new Date(b.startTid) >= new Date() && b.status !== "aflyst");
  const tidligere = myBookings.filter(b => new Date(b.startTid) < new Date() || b.status === "aflyst");

  const statusStyle = (status) => {
    if (status === "booket") return { bg: "rgba(15,110,86,0.15)", color: "#5dcaa5", border: "rgba(15,110,86,0.3)" };
    if (status === "aflyst") return { bg: "rgba(162,45,45,0.15)", color: "#f09595", border: "rgba(162,45,45,0.3)" };
    return { bg: "rgba(55,138,221,0.15)", color: "#85b7eb", border: "rgba(55,138,221,0.3)" };
  };

  const BookingCard = ({ b, faded }) => {
    const sc = statusStyle(b.status);
    return (
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, opacity: faded ? 0.5 : 1, transition: "all 0.2s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 48, height: 48, background: faded ? "rgba(255,255,255,0.04)" : "rgba(24,95,165,0.15)", border: `1px solid ${faded ? "rgba(255,255,255,0.08)" : "rgba(55,138,221,0.25)"}`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: faded ? "rgba(232,237,245,0.4)" : "#85b7eb", flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>{new Date(b.startTid).toLocaleString('da-DK', { month: 'short' })}</span>
            <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, marginTop: 2 }}>{new Date(b.startTid).getDate()}</span>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: faded ? "rgba(232,237,245,0.5)" : "#e8edf5" }}>{b.behandlingNavn || "Service"}</p>
            <p style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Clock size={10} /> kl. {new Date(b.startTid).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 50, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{b.status}</span>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "transparent", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* NAVBAR */}
      <nav style={{ background: "rgba(8,12,20,0.85)", borderBottom: "1px solid rgba(55,138,221,0.1)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <Link to="/" style={{ textDecoration: "none", fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", color: "#e8edf5", textTransform: "uppercase" }}>Salon Royale</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/book" style={{ color: "rgba(232,237,245,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Book tid</Link>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.2)", color: "#f09595", padding: "7px 14px", borderRadius: 50, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            <LogOut size={12} /> Log ud
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px" }}>
        <div style={{ marginBottom: 36, animation: "fadeUp 0.5s ease forwards" }}>
          <p style={{ fontSize: 11, color: "#378add", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Velkommen tilbage</p>
          <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Min profil</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28 }}>
          {/* PROFIL KORT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ height: 4, background: "linear-gradient(90deg, #185fa5, #378add)" }} />
              <div style={{ padding: 32, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, background: "rgba(24,95,165,0.15)", border: "1px solid rgba(55,138,221,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <User size={28} color="#85b7eb" />
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{user.navn}</h2>
                <p style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>Medlem</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", borderTop: "1px solid rgba(55,138,221,0.1)", paddingTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "rgba(232,237,245,0.6)" }}>
                    <Mail size={13} color="rgba(232,237,245,0.3)" /> <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "rgba(232,237,245,0.6)" }}>
                    <Phone size={13} color="rgba(232,237,245,0.3)" /> <span>{user.telefon || "Ikke oplyst"}</span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/book" style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "15px", borderRadius: 14, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", textDecoration: "none", boxSizing: "border-box", boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}>
              Book ny tid
            </Link>
          </div>

          {/* BOOKINGER */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {backendLoading && (
              <div style={{ background: "rgba(24,95,165,0.07)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                <RefreshCw size={26} color="#378add" style={{ margin: "0 auto 16px", display: "block", animation: "spin 1s linear infinite" }} />
                <p style={{ fontSize: 15, color: "rgba(232,237,245,0.65)", marginBottom: 6 }}>Forbinder til serveren...</p>
                <p style={{ fontSize: 12, color: "rgba(232,237,245,0.25)", marginBottom: 20 }}>Typisk 20-40 sekunder</p>
                <div style={{ background: "rgba(55,138,221,0.08)", borderRadius: 50, height: 3, overflow: "hidden", maxWidth: 260, margin: "0 auto" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #185fa5, #378add)", borderRadius: 50, width: `${Math.min((loadingSeconds / 45) * 100, 95)}%`, transition: "width 1s ease" }} />
                </div>
              </div>
            )}

            {!backendLoading && (
              <>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,237,245,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Scissors size={15} color="#378add" /> Kommende aftaler
                    {kommende.length > 0 && <span style={{ background: "#185fa5", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{kommende.length}</span>}
                  </h3>
                  {kommende.length === 0 ? (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(55,138,221,0.15)", borderRadius: 20, padding: 48, textAlign: "center" }}>
                      <Scissors size={24} color="rgba(232,237,245,0.15)" style={{ margin: "0 auto 12px", display: "block" }} />
                      <p style={{ fontSize: 14, color: "rgba(232,237,245,0.35)", fontStyle: "italic", marginBottom: 12 }}>Du har ingen kommende aftaler.</p>
                      <Link to="/book" style={{ fontSize: 10, color: "#378add", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Book en tid nu</Link>
                    </div>
                  ) : kommende.map(b => <BookingCard key={b.bookingId} b={b} />)}
                </div>

                {tidligere.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,237,245,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <Clock size={15} /> Tidligere aftaler
                    </h3>
                    {tidligere.map(b => <BookingCard key={b.bookingId} b={b} faded />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}