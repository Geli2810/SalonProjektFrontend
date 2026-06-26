import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from "../../SYSAdmin";
import { User, LogOut, Scissors, Clock, Mail, Phone, RefreshCw, Save, X, AlertCircle, Trash2, Edit3, XCircle } from 'lucide-react';
import StarRating from './StarRating';
import RatingPopup from './RatingPopup';

export default function CustomerDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendLoading, setBackendLoading] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelBookingId, setCancelBookingId] = useState(null);

  const API_URL = "https://salonproject.onrender.com";

  const [showRatingPopup, setShowRatingPopup] = useState(true);

  const [formData, setFormData] = useState({
    navn: '',
    email: '',
    telefon: ''
  });

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (!savedUser) { navigate("/login"); return; }
    setUser(savedUser);
    setFormData({
      navn: savedUser.navn || '',
      email: savedUser.email || '',
      telefon: savedUser.telefon || ''
    });
    
    fetchBookings(savedUser.kundeId);
  }, [navigate]);

  const fetchBookings = (kundeId) => {
    setBackendLoading(true);
    const timer = setInterval(() => setLoadingSeconds(s => s + 1), 1000);
    axios.get(`${API_URL}/api/Booking/user/${kundeId}`)
      .then(res => { 
        setMyBookings(res.data); 
        setLoading(false); 
        setBackendLoading(false); 
        clearInterval(timer); 
      })
      .catch(err => { 
        console.error(err); 
        setLoading(false); 
        setBackendLoading(false); 
        clearInterval(timer); 
      });
    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (!user || user.rolle !== "kunde") navigate("/login");
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put(`${API_URL}/api/Kunde/update/${user.kundeId}`, formData);
      
      const updatedUser = { ...user, ...formData };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profil opdateret! ✓');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunne ikke opdatere profil');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'SLET') return;
    
    try {
      await axios.delete(`${API_URL}/api/Kunde/delete/${user.kundeId}`);
      sessionStorage.clear();
      navigate('/');
    } catch (err) {
      setError('Kunne ikke slette konto');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/api/Booking/cancel/${bookingId}`);
      setSuccess('Tiden er aflyst ✓');
      setCancelBookingId(null);
      fetchBookings(user.kundeId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunne ikke aflyse tid');
      setTimeout(() => setError(''), 5000);
    }
  };

  const canCancel = (startTid) => {
    const now = new Date();
    const bookingDate = new Date(startTid);
    const diffInHours = (bookingDate - now) / (1000 * 60 * 60);
    return diffInHours >= 24;
  };

  const handleLogout = () => { 
    sessionStorage.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  const kommende = myBookings.filter(b => new Date(b.startTid) >= new Date() && b.status !== "aflyst");
  const tidligere = myBookings.filter(b => new Date(b.startTid) < new Date() || b.status === "aflyst");

  const statusStyle = (status) => {
    if (status === "booket") return { bg: "rgba(15,110,86,0.15)", color: "#5dcaa5", border: "rgba(15,110,86,0.3)" };
    if (status === "aflyst") return { bg: "rgba(162,45,45,0.15)", color: "#f09595", border: "rgba(162,45,45,0.3)" };
    return { bg: "rgba(55,138,221,0.15)", color: "#85b7eb", border: "rgba(55,138,221,0.3)" };
  };

  const BookingCard = ({ b, faded, showCancel }) => {
    const sc = statusStyle(b.status);
    const kanAflyses = !faded && canCancel(b.startTid);
    
    return (
      <div style={{ 
        background: "rgba(255,255,255,0.02)", 
        border: `1px solid ${cancelBookingId === b.bookingId ? "rgba(220,38,38,0.3)" : "rgba(55,138,221,0.1)"}`, 
        borderRadius: 18, 
        padding: "18px 20px", 
        display: "flex", 
        flexDirection: "column",
        marginBottom: 12, 
        opacity: faded ? 0.5 : 1, 
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
            <div style={{ 
              width: 48, height: 48, 
              background: faded ? "rgba(255,255,255,0.04)" : "rgba(24,95,165,0.15)", 
              border: `1px solid ${faded ? "rgba(255,255,255,0.08)" : "rgba(55,138,221,0.25)"}`, 
              borderRadius: 14, 
              display: "flex", flexDirection: "column", 
              alignItems: "center", justifyContent: "center", 
              color: faded ? "rgba(232,237,245,0.4)" : "#85b7eb", 
              flexShrink: 0 
            }}>
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>
                {new Date(b.startTid).toLocaleString('da-DK', { month: 'short' })}
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, marginTop: 2 }}>
                {new Date(b.startTid).getDate()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: faded ? "rgba(232,237,245,0.5)" : "#e8edf5" }}>
                {b.behandlingNavn || "Service"}
              </p>
              <p style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                <Clock size={10} /> 
                {new Date(b.startTid).toLocaleString('da-DK', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {showCancel && kanAflyses && cancelBookingId !== b.bookingId && (
              <button onClick={() => setCancelBookingId(b.bookingId)}
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#fca5a5", padding: "6px 12px", borderRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <XCircle size={12} /> Aflys
              </button>
            )}
            {cancelBookingId === b.bookingId && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, animation: "fadeIn 0.2s ease" }}>
                <button onClick={() => handleCancelBooking(b.bookingId)}
                  style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Bekræft</button>
                <button onClick={() => setCancelBookingId(null)}
                  style={{ background: "transparent", border: "1px solid rgba(55,138,221,0.2)", color: "rgba(133,183,235,0.8)", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><X size={12} /></button>
              </div>
            )}
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 50, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, whiteSpace: "nowrap" }}>{b.status}</span>
          </div>
        </div>
        {faded && b.status !== "aflyst" && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(55,138,221,0.06)" }}>
            <p style={{ fontSize: 9, color: "rgba(232,237,245,0.3)", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Din vurdering</p>
            <StarRating bookingId={b.bookingId} kundeId={user?.kundeId} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dash-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(55,138,221,0.15); color: #e8edf5; padding: 12px 16px; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.3s ease; box-sizing: border-box; }
        .dash-input:focus { border-color: rgba(55,138,221,0.5); box-shadow: 0 0 0 3px rgba(55,138,221,0.1); }
        .dash-input:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(255,255,255,0.02); }
        .btn-save { background: linear-gradient(135deg, #1d4ed8, #2563eb); color: #e6f1fb; padding: 12px 24px; border-radius: 12px; border: none; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(29,78,216,0.4); }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-cancel { background: transparent; border: 1px solid rgba(55,138,221,0.2); color: rgba(133,183,235,0.8); padding: 12px 24px; border-radius: 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-cancel:hover { border-color: rgba(55,138,221,0.5); background: rgba(55,138,221,0.1); }
        .btn-delete { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.25); color: #fca5a5; padding: 10px 20px; border-radius: 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-delete:hover { background: rgba(220,38,38,0.15); border-color: rgba(220,38,38,0.4); }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr !important; } nav { padding: 12px 16px !important; } }
        @media (max-width: 480px) { .dash-grid { gap: 14px !important; } }
      `}</style>

      <nav style={{ background: "rgba(8,12,20,0.85)", borderBottom: "1px solid rgba(55,138,221,0.1)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <Link to="/" style={{ textDecoration: "none", fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", color: "#e8edf5", textTransform: "uppercase" }}>✂ SuperKlip</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/book" style={{ color: "rgba(232,237,245,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Book tid</Link>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.2)", color: "#f09595", padding: "7px 14px", borderRadius: 50, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            <LogOut size={12} /> Log ud
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px" }}>
        {success && <div style={{ background: "rgba(15,110,86,0.1)", border: "1px solid rgba(93,202,165,0.2)", color: "#5dcaa5", padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 600, animation: "fadeIn 0.3s ease" }}>{success}</div>}
        {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#fca5a5", padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 0.3s ease" }}><AlertCircle size={16} /> {error}</div>}

        <div style={{ marginBottom: 36, animation: "fadeUp 0.5s ease forwards" }}>
          <p style={{ fontSize: 11, color: "#378add", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Velkommen tilbage</p>
          <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Min profil</h1>
        </div>

        <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28 }}>
          {/* Profil kort */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ height: 4, background: "linear-gradient(90deg, #185fa5, #378add)" }} />
              <div style={{ padding: 32 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ width: 72, height: 72, background: "rgba(24,95,165,0.15)", border: "1px solid rgba(55,138,221,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <User size={28} color="#85b7eb" />
                  </div>
                  <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 4 }}>{editing ? 'Redigér profil' : user.navn}</h2>
                  <p style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{editing ? 'Opdater dine oplysninger' : 'Medlem'}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={{ fontSize: 9, fontWeight: 700, color: "rgba(232,237,245,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 6 }}><User size={9} style={{ display: "inline", marginRight: 4 }} /> Navn</label><input className="dash-input" value={formData.navn} onChange={e => setFormData({ ...formData, navn: e.target.value })} disabled={!editing} /></div>
                  <div><label style={{ fontSize: 9, fontWeight: 700, color: "rgba(232,237,245,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 6 }}><Mail size={9} style={{ display: "inline", marginRight: 4 }} /> Email</label><input className="dash-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!editing} /></div>
                  <div><label style={{ fontSize: 9, fontWeight: 700, color: "rgba(232,237,245,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 6 }}><Phone size={9} style={{ display: "inline", marginRight: 4 }} /> Telefon</label><input className="dash-input" value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} disabled={!editing} /></div>
                </div>
                <div style={{ marginTop: 20, borderTop: "1px solid rgba(55,138,221,0.1)", paddingTop: 20 }}>
                  {editing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <button className="btn-save" onClick={handleSaveProfile} disabled={saving}>{saving ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Gemmer...</> : <><Save size={14} /> Gem ændringer</>}</button>
                      <button className="btn-cancel" onClick={() => { setEditing(false); setFormData({ navn: user.navn, email: user.email, telefon: user.telefon }); }}><X size={14} /> Fortryd</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <button className="btn-cancel" onClick={() => setEditing(true)}><Edit3 size={14} /> Redigér profil</button>
                      {!showDeleteConfirm ? (
                        <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}><Trash2 size={14} /> Slet konto</button>
                      ) : (
                        <div style={{ animation: "fadeIn 0.3s ease" }}>
                          <p style={{ fontSize: 11, color: "#fca5a5", marginBottom: 10, fontWeight: 600, textAlign: "center" }}>Skriv "SLET" for at bekræfte:</p>
                          <input className="dash-input" placeholder='Skriv "SLET"' value={deleteInput} onChange={e => setDeleteInput(e.target.value)} style={{ marginBottom: 10, textAlign: "center" }} />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-delete" onClick={handleDeleteAccount} disabled={deleteInput !== 'SLET'} style={{ flex: 1, opacity: deleteInput !== 'SLET' ? 0.4 : 1 }}>Bekræft</button>
                            <button className="btn-cancel" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}><X size={14} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Link to="/book" style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "15px", borderRadius: 14, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", textDecoration: "none", boxSizing: "border-box", boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}>Book ny tid</Link>
          </div>

          {/* Bookinger */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {backendLoading && (
              <div style={{ background: "rgba(24,95,165,0.07)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                <RefreshCw size={26} color="#378add" style={{ margin: "0 auto 16px", display: "block", animation: "spin 1s linear infinite" }} />
                <p style={{ fontSize: 15, color: "rgba(232,237,245,0.65)", marginBottom: 6 }}>Forbinder til serveren...</p>
                <div style={{ background: "rgba(55,138,221,0.08)", borderRadius: 50, height: 3, overflow: "hidden", maxWidth: 260, margin: "0 auto" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #185fa5, #378add)", borderRadius: 50, width: `${Math.min((loadingSeconds / 45) * 100, 95)}%`, transition: "width 1s ease" }} />
                </div>
              </div>
            )}
            {!backendLoading && (
              <>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,237,245,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Scissors size={15} color="#378add" /> Kommende aftaler {kommende.length > 0 && <span style={{ background: "#185fa5", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{kommende.length}</span>}
                  </h3>
                  {kommende.length === 0 ? (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(55,138,221,0.15)", borderRadius: 20, padding: 48, textAlign: "center" }}>
                      <Scissors size={24} color="rgba(232,237,245,0.15)" style={{ margin: "0 auto 12px", display: "block" }} />
                      <p style={{ fontSize: 14, color: "rgba(232,237,245,0.35)", fontStyle: "italic", marginBottom: 12 }}>Du har ingen kommende aftaler.</p>
                      <Link to="/book" style={{ fontSize: 10, color: "#378add", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Book en tid nu</Link>
                    </div>
                  ) : (
                    <>
                      {kommende.map(b => <BookingCard key={b.bookingId} b={b} showCancel={true} />)}
                      <p style={{ fontSize: 10, color: "rgba(232,237,245,0.2)", marginTop: 8, fontStyle: "italic" }}>ℹ️ Aflysning mulig indtil 24 timer før</p>
                    </>
                  )}
                </div>
                {tidligere.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,237,245,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Clock size={15} /> Tidligere aftaler</h3>
                    {tidligere.map(b => <BookingCard key={b.bookingId} b={b} faded />)}
                  </div>
                )}
              </>
            )}
            <RatingPopup kundeId={user?.kundeId} onClose={() => setShowRatingPopup(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}