import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../SYSAdmin";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { LogOut, Calendar, Users, Scissors, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const API_URL = "https://salonproject.onrender.com";

export default function AdminPanel({ onLogout }) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [bookinger, setBookinger] = useState([]);
  const [kunder, setKunder] = useState([]);
  const [behandlinger, setBehandlinger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookinger");

  useEffect(() => {
    if (!user || user.rolle !== "frisor") {
      navigate("/frisor-login");
      return;
    }
    const fetchData = async () => {
      try {
        const [bRes, kRes, tRes] = await Promise.all([
          axios.get(`${API_URL}/api/Booking/user/${user.frisorId || 0}`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/HairDresserSalon/customers`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/HairDresserSalon/behandlinger`).catch(() => ({ data: [] }))
        ]);
        setBookinger(bRes.data || []);
        setKunder(kRes.data || []);
        setBehandlinger(tRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    if (onLogout) onLogout();
    navigate("/");
  };

  const statusColor = (status) => {
    if (status === "booket") return { bg: "rgba(15,110,86,0.15)", color: "#5dcaa5", border: "rgba(15,110,86,0.3)" };
    if (status === "aflyst") return { bg: "rgba(162,45,45,0.15)", color: "#f09595", border: "rgba(162,45,45,0.3)" };
    return { bg: "rgba(55,138,221,0.15)", color: "#85b7eb", border: "rgba(55,138,221,0.3)" };
  };

  const statusIcon = (status) => {
    if (status === "booket") return <CheckCircle size={12} />;
    if (status === "aflyst") return <XCircle size={12} />;
    return <AlertCircle size={12} />;
  };

  const dagensBookinger = bookinger.filter(b => {
    const d = new Date(b.startTid);
    const i = new Date();
    return d.toDateString() === i.toDateString();
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-tab {
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1px solid rgba(55,138,221,0.2);
          background: transparent;
          color: rgba(232,237,245,0.4);
          transition: all 0.3s;
        }
        .admin-tab:hover {
          color: #e8edf5;
          border-color: rgba(55,138,221,0.4);
        }
        .admin-tab.active {
          background: rgba(24,95,165,0.3);
          border-color: rgba(55,138,221,0.5);
          color: #85b7eb;
        }
        .table-row {
          display: grid;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(55,138,221,0.07);
          transition: background 0.2s;
          align-items: center;
        }
        .table-row:hover {
          background: rgba(55,138,221,0.05);
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(55,138,221,0.12);
          border-radius: 16px;
          padding: 24px;
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{
        background: "rgba(8,12,20,0.95)",
        borderBottom: "1px solid rgba(55,138,221,0.1)",
        padding: "16px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Scissors size={18} color="#378add" />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: "#e8edf5", textTransform: "uppercase" }}>Salon Royale</span>
          </Link>
          <span style={{ color: "rgba(55,138,221,0.4)", fontSize: 14 }}>|</span>
          <span style={{ fontSize: 11, color: "#378add", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Frisørpanel</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8edf5" }}>{user?.navn}</div>
            <div style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{user?.rolle}</div>
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.25)",
            color: "#f09595", padding: "8px 16px", borderRadius: 50,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.3s"
          }}>
            <LogOut size={12} /> Log ud
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px" }}>

        {/* WELCOME */}
        <div style={{ marginBottom: 40, animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
          <p style={{ fontSize: 11, color: "#378add", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Velkommen tilbage</p>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#e8edf5", letterSpacing: "-0.01em" }}>{user?.navn}</h1>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: <Calendar size={20} color="#378add" />, label: "I dag", value: dagensBookinger.length, delay: "0.1s" },
            { icon: <CheckCircle size={20} color="#5dcaa5" />, label: "Bookinger i alt", value: bookinger.length, delay: "0.2s" },
            { icon: <Users size={20} color="#85b7eb" />, label: "Kunder", value: kunder.length, delay: "0.3s" },
            { icon: <Scissors size={20} color="#ef9f27" />, label: "Behandlinger", value: behandlinger.length, delay: "0.4s" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: s.delay }}>
              <div style={{ marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#e8edf5", marginBottom: 4 }}>{loading ? "—" : s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {[
            { key: "bookinger", label: "Bookinger" },
            { key: "kunder", label: "Kunder" },
            { key: "behandlinger", label: "Behandlinger" }
          ].map(tab => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(55,138,221,0.1)",
          borderRadius: 20, overflow: "hidden",
          animation: "fadeUp 0.7s ease 0.3s forwards", opacity: 0
        }}>

          {/* BOOKINGER */}
          {activeTab === "bookinger" && (
            <>
              <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Alle bookinger</h2>
              </div>
              <div className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr", borderBottom: "1px solid rgba(55,138,221,0.15)" }}>
                {["Dato & tid", "Behandling", "Kunde ID", "Status"].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
              ) : bookinger.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen bookinger endnu</div>
              ) : bookinger.map((b, i) => {
                const sc = statusColor(b.status);
                return (
                  <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 500 }}>
                        {new Date(b.startTid).toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Clock size={10} /> kl. {new Date(b.startTid).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(232,237,245,0.7)" }}>{b.behandlingNavn || "—"}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,237,245,0.4)", fontFamily: "monospace" }}>#{b.kundeId || "—"}</div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: sc.bg, border: `1px solid ${sc.border}`,
                      color: sc.color, padding: "4px 10px", borderRadius: 50,
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      width: "fit-content"
                    }}>
                      {statusIcon(b.status)} {b.status}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* KUNDER */}
          {activeTab === "kunder" && (
            <>
              <div style={{ padding: "20px 20px 0" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Alle kunder</h2>
              </div>
              <div className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr", borderBottom: "1px solid rgba(55,138,221,0.15)" }}>
                {["Navn", "Email", "Telefon"].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
              ) : kunder.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen kunder endnu</div>
              ) : kunder.map((k, i) => (
                <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(55,138,221,0.15)", border: "1px solid rgba(55,138,221,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#378add"
                    }}>
                      {k.navn?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, color: "#e8edf5" }}>{k.navn}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)" }}>{k.email}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)", fontFamily: "monospace" }}>{k.telefon}</div>
                </div>
              ))}
            </>
          )}

          {/* BEHANDLINGER */}
          {activeTab === "behandlinger" && (
            <>
              <div style={{ padding: "20px 20px 0" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Behandlinger</h2>
              </div>
              <div className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr", borderBottom: "1px solid rgba(55,138,221,0.15)" }}>
                {["Navn", "Varighed", "Pris"].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
              ) : behandlinger.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen behandlinger endnu</div>
              ) : behandlinger.map((b, i) => (
                <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Scissors size={14} color="rgba(55,138,221,0.5)" />
                    <span style={{ fontSize: 13, color: "#e8edf5" }}>{b.navn}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} color="rgba(232,237,245,0.3)" /> {b.varighedMinutter} min
                  </div>
                  <div style={{ fontSize: 13, color: "#5dcaa5", fontWeight: 600 }}>{b.pris} kr.</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}