import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../SYSAdmin";
import { LogOut, Menu, X as XIcon } from "lucide-react";
import axios from "axios";
import CancelPage from './CancelPage';

export default function LandingPage({ currentUser, onLogout }) {
  const [user, setUser] = useState(currentUser || null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const heroRef = useRef(null);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0, distribution: null });

  useEffect(() => { setUser(currentUser || getCurrentUser()); }, [currentUser]);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    axios.get('https://salonproject.onrender.com/api/Rating/average')
      .then(res => setRatingData(res.data))
      .catch(() => {});
  }, []);

  // ✅ TJEK OM DET ER ET AFLYSNINGSLINK
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('email') && urlParams.get('token')) {
    return <CancelPage />;
  }

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    if (onLogout) onLogout();
    window.location.href = "/";
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "clamp(300px, 50vw, 600px)", height: "clamp(300px, 50vw, 600px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(24,95,165,0.18) 0%, transparent 70%)", top: "-100px", left: "-100px", animation: "blob1 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "clamp(250px, 40vw, 500px)", height: "clamp(250px, 40vw, 500px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(13,110,86,0.12) 0%, transparent 70%)", bottom: "100px", right: "-80px", animation: "blob2 10s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{ transform:translate(0,0) scale(1); } 33%{ transform:translate(30px,-30px) scale(1.05); } 66%{ transform:translate(-20px,20px) scale(0.95); } }
        @keyframes blob2 { 0%,100%{ transform:translate(0,0) scale(1); } 33%{ transform:translate(-30px,20px) scale(1.08); } 66%{ transform:translate(20px,-20px) scale(0.92); } }
        @keyframes fadeUp { from{ opacity:0; transform:translateY(30px); } to{ opacity:1; transform:translateY(0); } }
        @keyframes scissors { 0%,100%{ transform:rotate(-10deg); } 50%{ transform:rotate(10deg); } }
        @keyframes float { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-10px); } }
        .nav-link { color:rgba(232,237,245,0.6); text-decoration:none; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; font-weight:600; transition:color 0.3s; }
        .nav-link:hover { color:#378add; }
        .service-card { background:rgba(255,255,255,0.03); border:1px solid rgba(55,138,221,0.15); border-radius:20px; padding:32px 24px; transition:all 0.3s ease; }
        .service-card:hover { background:rgba(55,138,221,0.08); border-color:rgba(55,138,221,0.4); transform:translateY(-4px); }
        .cta-btn { display:inline-flex; align-items:center; gap:10px; background:#185fa5; color:#e6f1fb; padding:16px 36px; border-radius:50px; text-decoration:none; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.3s ease; border:none; cursor:pointer; }
        .cta-btn:hover { background:#378add; transform:translateY(-2px); box-shadow:0 12px 40px rgba(55,138,221,0.3); }
        .cta-btn-outline { display:inline-flex; align-items:center; gap:10px; background:transparent; color:#b5d4f4; padding:15px 36px; border-radius:50px; text-decoration:none; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.3s ease; border:1px solid rgba(55,138,221,0.4); cursor:pointer; }
        .cta-btn-outline:hover { border-color:#378add; color:#e6f1fb; background:rgba(55,138,221,0.1); }
        .scissors-icon { display:inline-block; animation:scissors 3s ease-in-out infinite; transform-origin:center; }
        @media (max-width: 768px) { .nav-link { font-size:10px !important; } .cta-btn, .cta-btn-outline { padding:12px 24px !important; font-size:10px !important; } .service-card { padding:24px 18px !important; } }
      `}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", background:scrolled?"rgba(8,12,20,0.9)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?"1px solid rgba(55,138,221,0.1)":"none", transition:"all 0.4s ease" }}>
        <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }} className="scissors-icon">✂</span>
          <span style={{ fontSize:16, fontWeight:700, letterSpacing:"0.15em", color:"#e8edf5", textTransform:"uppercase" }}>SuperKlip</span>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:20 }} className="desktop-menu">
          <Link to="/book" className="nav-link">Book tid</Link>
          {user?.rolle === "kunde" && (
            <>
              <Link to="/dashboard" className="nav-link">Min profil</Link>
              <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(162,45,45,0.15)", border:"1px solid rgba(162,45,45,0.3)", color:"#f09595", padding:"7px 12px", borderRadius:50, fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}><LogOut size={12} /></button>
            </>
          )}
          {user?.rolle === "frisor" && (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(162,45,45,0.15)", border:"1px solid rgba(162,45,45,0.3)", color:"#f09595", padding:"7px 12px", borderRadius:50, fontSize:10, fontWeight:700, cursor:"pointer" }}><LogOut size={12} /></button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="nav-link">Log ind</Link>
              <Link to="/register" style={{ background:"#185fa5", color:"#e6f1fb", padding:"8px 18px", borderRadius:50, textDecoration:"none", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>Opret</Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display:"none", background:"none", border:"none", color:"#e8edf5", cursor:"pointer" }} className="mobile-menu-btn">
          {mobileMenu ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      <style>{`@media (max-width: 768px) { .desktop-menu { display: none !important; } .mobile-menu-btn { display: block !important; } }`}</style>
      {mobileMenu && (
        <div style={{ position:"fixed", top:60, left:0, right:0, zIndex:99, background:"rgba(8,12,20,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(55,138,221,0.1)", padding:"20px", display:"flex", flexDirection:"column", gap:16 }}>
          <Link to="/book" className="nav-link" onClick={()=>setMobileMenu(false)}>Book tid</Link>
          {user?.rolle === "kunde" && <Link to="/dashboard" className="nav-link" onClick={()=>setMobileMenu(false)}>Min profil</Link>}
          {!user && <Link to="/login" className="nav-link" onClick={()=>setMobileMenu(false)}>Log ind</Link>}
          {!user && <Link to="/register" className="nav-link" onClick={()=>setMobileMenu(false)}>Opret konto</Link>}
          {user && <button onClick={()=>{handleLogout();setMobileMenu(false);}} style={{ background:"rgba(162,45,45,0.15)", border:"1px solid rgba(162,45,45,0.3)", color:"#f09595", padding:"10px", borderRadius:50, fontSize:11, fontWeight:700, cursor:"pointer" }}>Log ud</button>}
        </div>
      )}

      <section ref={heroRef} style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 20px 60px", textAlign:"center" }}>
        <div style={{ maxWidth:800, opacity:visible?1:0, animation:visible?"fadeUp 1s ease forwards":"none" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(55,138,221,0.1)", border:"1px solid rgba(55,138,221,0.25)", borderRadius:50, padding:"8px 16px", marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#378add", display:"inline-block" }} />
            <span style={{ fontSize:10, color:"#85b7eb", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>Professionel frisørkunst</span>
          </div>
          <h1 style={{ fontSize:"clamp(32px, 8vw, 88px)", fontWeight:300, lineHeight:1.05, letterSpacing:"-0.02em", marginBottom:20, color:"#e8edf5" }}>Dit hår.<br /><span style={{ color:"#378add", fontWeight:700 }}>Din stil.</span></h1>
          <p style={{ fontSize:"clamp(14px, 2vw, 17px)", color:"rgba(232,237,245,0.55)", lineHeight:1.7, maxWidth:520, margin:"0 auto 36px", padding:"0 10px" }}>Oplev frisørkunst på højeste niveau. Book din tid online på få sekunder.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/book" className="cta-btn">Book en tid nu<span style={{ fontSize:16 }}>→</span></Link>
            {!user && <Link to="/register" className="cta-btn-outline">Bliv medlem</Link>}
          </div>
        </div>
      </section>

      <section style={{ position:"relative", zIndex:1, padding:"0 20px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:1, background:"rgba(55,138,221,0.1)", borderRadius:20, overflow:"hidden", border:"1px solid rgba(55,138,221,0.15)" }}>
          {[{ num: ratingData.count > 0 ? `${ratingData.count}` : "0", label: "Anmeldelser" }, { num: "6+", label: "Års erfaring" }, { num: ratingData.average > 0 ? `${ratingData.average}★` : "Ny", label: "Gennemsnit" }].map((s, i) => (
            <div key={i} style={{ padding:"30px 20px", textAlign:"center", background:"rgba(8,12,20,0.6)", borderRight:i<2?"1px solid rgba(55,138,221,0.1)":"none", animation:`fadeUp 0.8s ease ${0.2+i*0.15}s forwards`, opacity:0 }}>
              <div style={{ fontSize:"clamp(24px, 4vw, 36px)", fontWeight:700, color:"#378add", marginBottom:6 }}>{s.num}</div>
              <div style={{ fontSize:"clamp(10px, 1.5vw, 12px)", color:"rgba(232,237,245,0.45)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position:"relative", zIndex:1, padding:"20px 20px 60px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}><p style={{ fontSize:10, color:"#378add", fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:12 }}>Vores services</p><h2 style={{ fontSize:"clamp(24px, 5vw, 40px)", fontWeight:300, color:"#e8edf5" }}>Hvad kan vi gøre for dig?</h2></div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16 }}>
            {[{ icon:"✂", title:"Klipning", desc:"Klassisk og moderne klipning." }, { icon:"✨", title:"Styling", desc:"Til hverdag og fest." }].map((s, i) => (
              <div key={i} className="service-card"><div style={{ fontSize:28, marginBottom:16 }}>{s.icon}</div><h3 style={{ fontSize:15, fontWeight:600, color:"#e8edf5", marginBottom:8 }}>{s.title}</h3><p style={{ fontSize:12, color:"rgba(232,237,245,0.45)", lineHeight:1.6 }}>{s.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position:"relative", zIndex:1, padding:"0 20px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", background:"rgba(24,95,165,0.12)", border:"1px solid rgba(55,138,221,0.2)", borderRadius:24, padding:"40px 24px", textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(22px, 4vw, 36px)", fontWeight:300, color:"#e8edf5", marginBottom:12 }}>Klar til din næste <span style={{ color:"#378add", fontWeight:700 }}>transformation?</span></h2>
          <p style={{ fontSize:13, color:"rgba(232,237,245,0.45)", marginBottom:28 }}>Book din tid online.</p>
          <Link to="/book" className="cta-btn">Book tid nu →</Link>
        </div>
      </section>

      <footer style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(55,138,221,0.1)", padding:"24px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, fontSize:11, color:"rgba(232,237,245,0.3)" }}>
        <span>© 2026 SuperKlip</span>
        <div style={{ display:"flex", gap:16 }}><Link to="/book" className="nav-link">Book</Link><Link to="/login" className="nav-link">Log ind</Link></div>
      </footer>
    </div>
  );
}