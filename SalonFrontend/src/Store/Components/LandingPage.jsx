import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../SYSAdmin";
import { LogOut } from "lucide-react";
import axios from "axios";
import SimpleStarClick from './SimpleStarClick';

export default function LandingPage({ currentUser, onLogout }) {
  const [user, setUser] = useState(currentUser || null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0, distribution: null });

  useEffect(() => {
    setUser(currentUser || getCurrentUser());
  }, [currentUser]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get('https://salonproject.onrender.com/api/Rating/average')
      .then(res => setRatingData(res.data))
      .catch(() => console.log('Kunne ikke hente ratings'));
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    if (onLogout) onLogout();
    window.location.href = "/";
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Animated background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(24,95,165,0.18) 0%, transparent 70%)",
          top: "-100px", left: "-100px",
          animation: "blob1 8s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,110,86,0.12) 0%, transparent 70%)",
          bottom: "100px", right: "-80px",
          animation: "blob2 10s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(55,138,221,0.1) 0%, transparent 70%)",
          top: "40%", left: "40%",
          animation: "blob1 12s ease-in-out infinite reverse"
        }} />
      </div>

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(1.08); }
          66% { transform: translate(20px, -20px) scale(0.92); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scissors {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes growBar {
          from { width: 0 !important; }
        }
        .nav-link {
          color: rgba(232,237,245,0.6);
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          transition: color 0.3s;
        }
        .nav-link:hover { color: #378add; }
        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(55,138,221,0.15);
          border-radius: 20px;
          padding: 32px 24px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .service-card:hover {
          background: rgba(55,138,221,0.08);
          border-color: rgba(55,138,221,0.4);
          transform: translateY(-4px);
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #185fa5;
          color: #e6f1fb;
          padding: 16px 36px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .cta-btn:hover {
          background: #378add;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(55,138,221,0.3);
        }
        .cta-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #b5d4f4;
          padding: 15px 36px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border: 1px solid rgba(55,138,221,0.4);
          cursor: pointer;
        }
        .cta-btn-outline:hover {
          border-color: #378add;
          color: #e6f1fb;
          background: rgba(55,138,221,0.1);
        }
        .scissors-icon {
          display: inline-block;
          animation: scissors 3s ease-in-out infinite;
          transform-origin: center;
        }
        .floating-card {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled ? "rgba(8,12,20,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(55,138,221,0.1)" : "none",
        transition: "all 0.4s ease"
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, display: "inline-block" }} className="scissors-icon">✂</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.15em", color: "#e8edf5", textTransform: "uppercase" }}>SuperKlip</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/book" className="nav-link">Book tid</Link>

          {user?.rolle === "kunde" && (
            <>
              <Link to="/dashboard" className="nav-link">Min profil</Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)",
                color: "#f09595", padding: "8px 16px", borderRadius: 50,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.3s"
              }}>
                <LogOut size={12} /> Log ud
              </button>
            </>
          )}

          {user?.rolle === "frisor" && (
            <>
              <Link to="/admin" className="nav-link">Adminpanel</Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(162,45,45,0.15)", border: "1px solid rgba(162,45,45,0.3)",
                color: "#f09595", padding: "8px 16px", borderRadius: 50,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.3s"
              }}>
                <LogOut size={12} /> Log ud
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="nav-link">Log ind</Link>
              <Link to="/frisor-login" className="nav-link">Frisør login</Link>
              <Link to="/register" style={{
                background: "#185fa5", color: "#e6f1fb",
                padding: "9px 22px", borderRadius: 50,
                textDecoration: "none", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
                transition: "all 0.3s"
              }}>Opret konto</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: 800,
          opacity: visible ? 1 : 0,
          animation: visible ? "fadeUp 1s ease forwards" : "none"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(55,138,221,0.1)", border: "1px solid rgba(55,138,221,0.25)",
            borderRadius: 50, padding: "8px 20px", marginBottom: 32
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#378add", display: "inline-block", animation: "blob1 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, color: "#85b7eb", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Professionel frisørkunst</span>
          </div>

          <h1 style={{
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            color: "#e8edf5"
          }}>
            Dit hår.<br />
            <span style={{ color: "#378add", fontWeight: 700 }}>Din stil.</span>
          </h1>

          <p style={{
            fontSize: 17, color: "rgba(232,237,245,0.55)", lineHeight: 1.7,
            maxWidth: 520, margin: "0 auto 48px",
            animation: "fadeUp 1s ease 0.2s forwards", opacity: 0
          }}>
            Oplev frisørkunst på højeste niveau. Book din tid online på få sekunder og lad os tage os af resten.
          </p>

          <div style={{
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
            animation: "fadeUp 1s ease 0.4s forwards", opacity: 0
          }}>
            <Link to="/book" className="cta-btn">
              Book en tid nu
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
            {!user && (
              <Link to="/register" className="cta-btn-outline">
                Bliv medlem
              </Link>
            )}
          </div>
        </div>

        {/* Floating scissors decoration */}
        <div style={{
          position: "absolute", right: "8%", top: "30%",
          fontSize: 120, opacity: 0.06,
          animation: "scissors 6s ease-in-out infinite, float 5s ease-in-out infinite",
          userSelect: "none", pointerEvents: "none"
        }}>✂</div>
        <div style={{
          position: "absolute", left: "5%", bottom: "20%",
          fontSize: 60, opacity: 0.05,
          animation: "scissors 8s ease-in-out infinite reverse, float 7s ease-in-out infinite",
          userSelect: "none", pointerEvents: "none"
        }}>✂</div>
      </section>

      {/* STATS - DYNAMISK RATING */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 48px 80px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
          background: "rgba(55,138,221,0.1)", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(55,138,221,0.15)"
        }}>
          {[
            { num: ratingData.count > 0 ? `${ratingData.count}` : "0", label: "Anmeldelser" },
            { num: "6+", label: "Års erfaring" },
            { num: ratingData.average > 0 ? `${ratingData.average}★` : "Ny", label: "Gennemsnit" }
          ].map((s, i) => (
            <div key={i} style={{
              padding: "40px 20px", textAlign: "center",
              background: "rgba(8,12,20,0.6)",
              borderRight: i < 2 ? "1px solid rgba(55,138,221,0.1)" : "none",
              animation: `fadeUp 0.8s ease ${0.2 + i * 0.15}s forwards`, opacity: 0
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#378add", marginBottom: 8 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RATING FORDELING */}
      {ratingData.distribution && ratingData.count > 0 && (
        <section style={{ position: "relative", zIndex: 1, padding: "0 48px 80px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(55,138,221,0.1)",
              borderRadius: 20,
              padding: "32px"
            }}>
              <h3 style={{ fontSize: 14, color: "rgba(232,237,245,0.6)", marginBottom: 20, letterSpacing: "0.05em" }}>
                📊 Kunde tilfredshed
              </h3>
              
              {[
                { stars: 5, emoji: "😍", label: "Fantastisk", color: "#22c55e", count: ratingData.distribution.femStjerner },
                { stars: 4, emoji: "😊", label: "God", color: "#86efac", count: ratingData.distribution.fireStjerner },
                { stars: 3, emoji: "😐", label: "OK", color: "#fbbf24", count: ratingData.distribution.treStjerner },
                { stars: 2, emoji: "😕", label: "Skuffende", color: "#f97316", count: ratingData.distribution.toStjerner },
                { stars: 1, emoji: "😡", label: "Dårlig", color: "#ef4444", count: ratingData.distribution.enStjerne }
              ].map((e, i) => {
                const barWidth = ratingData.count > 0 ? (e.count / ratingData.count) * 100 : 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{e.emoji}</span>
                    <span style={{ fontSize: 11, color: "rgba(232,237,245,0.5)", width: 30 }}>{e.stars}★</span>
                    <div style={{ 
                      flex: 1, 
                      height: 6, 
                      background: "rgba(255,255,255,0.05)", 
                      borderRadius: 3,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${barWidth}%`,
                        height: "100%",
                        background: e.color,
                        borderRadius: 3,
                        transition: "width 1s ease",
                        minWidth: e.count > 0 ? "4px" : "0"
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", width: 25, textAlign: "right" }}>
                      {e.count}
                    </span>
                  </div>
                );
              })}
              
              <p style={{ fontSize: 10, color: "rgba(232,237,245,0.2)", marginTop: 16, textAlign: "center" }}>
                Baseret på {ratingData.count} anmeldelser
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section style={{ position: "relative", zIndex: 1, padding: "40px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 11, color: "#378add", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Vores services</p>
            <h2 style={{ fontSize: 40, fontWeight: 300, letterSpacing: "-0.01em", color: "#e8edf5" }}>Hvad kan vi gøre for dig?</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { icon: "✂", title: "Klipning", desc: "Klassisk og moderne klipning tilpasset din hårtype og stil." },
              { icon: "✨", title: "Styling", desc: "Til hverdag, fest eller specielle lejligheder." }
            ].map((s, i) => (
              <div key={i} className="service-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: 32, marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8edf5", marginBottom: 10, letterSpacing: "0.05em" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(232,237,245,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 48px 100px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          background: "rgba(24,95,165,0.12)",
          border: "1px solid rgba(55,138,221,0.2)",
          borderRadius: 28, padding: "64px 48px",
          textAlign: "center"
        }}>
          <div className="floating-card">
            <h2 style={{ fontSize: 36, fontWeight: 300, color: "#e8edf5", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Klar til din næste <span style={{ color: "#378add", fontWeight: 700 }}>transformation?</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(232,237,245,0.45)", marginBottom: 40, lineHeight: 1.7 }}>
              Book din tid online — hurtigt, nemt og altid tilgængeligt.
            </p>
            <Link to="/book" className="cta-btn" style={{ margin: "0 auto" }}>
              Book tid nu →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(55,138,221,0.1)",
        padding: "32px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16
      }}>
        <span style={{ fontSize: 13, color: "rgba(232,237,245,0.3)", letterSpacing: "0.1em" }}>© 2026 SuperKlip</span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link to="/book" className="nav-link">Book</Link>
          <Link to="/login" className="nav-link">Log ind</Link>
          <Link to="/frisor-login" className="nav-link">Frisør</Link>
        </div>
      </footer>
    </div>
  );

  {/* SIMPEL RATING - direkte på forsiden */}
<section style={{ position: "relative", zIndex: 1, padding: "0 48px 80px" }}>
  <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(55,138,221,0.1)",
      borderRadius: 20,
      padding: "32px"
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#e8edf5" }}>
        ⭐ Hvad synes du om os?
      </h3>
      
      <SimpleStarClick />
    </div>
  </div>
</section>
}