import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Calendar, Scissors, X, Plus, Trash2, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { getCurrentUser } from '../../SYSAdmin';

export default function AdminPanel({ onLogout }) {
  const navigate = useNavigate();
  const [frisor, setFrisor] = useState(getCurrentUser());
  const [bookings, setBookings] = useState([]);
  const [blokeringer, setBlokeringer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockStart, setBlockStart] = useState('10:00');
  const [blockEnd, setBlockEnd] = useState('18:00');

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    if (!frisor || (frisor.rolle !== "frisor" && frisor.rolle !== "admin")) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const frisorId = frisor?.frisorId;
      
      if (!frisorId) {
        setError('Ingen frisør ID fundet');
        setLoading(false);
        return;
      }

      const [bookingRes, blokeringRes] = await Promise.all([
        axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${frisorId}`),
        axios.get(`${API_URL}/api/HairDresserSalon/blokeringer/${frisorId}`)
      ]);
      
      // Filtrer bookinger (IKKE blokeringer)
      const onlyBookings = (bookingRes.data || []).filter(b => 
        !b.title?.toLowerCase().includes('blokeret') && 
        !b.title?.toLowerCase().includes('skole')
      );
      setBookings(onlyBookings);
      setBlokeringer(blokeringRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Fejl ved hentning:', err);
      setError('Kunne ikke hente data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleBlockDay = async (e) => {
    e.preventDefault();
    if (!blockDate) return;
    
    try {
      await axios.post(`${API_URL}/api/HairDresserSalon/bloker`, {
        frisorId: frisor.frisorId,
        startTid: `${blockDate}T${blockStart}:00`,
        slutTid: `${blockDate}T${blockEnd}:00`,
        arsag: blockReason || 'Blokeret dag'
      });
      
      setSuccess('Dagen er blokeret!');
      setShowBlockForm(false);
      setBlockDate('');
      setBlockReason('');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Kunne ikke blokere dagen');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteBlokering = async (blokeringId) => {
    if (!confirm('Fjern blokering?')) return;
    try {
      await axios.delete(`${API_URL}/api/HairDresserSalon/blokering/${blokeringId}`);
      fetchData();
      setSuccess('Blokering fjernet!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Kunne ikke fjerne blokering');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const upcomingBookings = bookings
    .filter(b => new Date(b.startTid) >= new Date())
    .sort((a, b) => new Date(a.startTid) - new Date(b.startTid));

  const pastBookings = bookings
    .filter(b => new Date(b.startTid) < new Date())
    .sort((a, b) => new Date(b.startTid) - new Date(a.startTid));

  // Byg uge-oversigt
  const weekDays = [...Array(7)].map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i);
    return day;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .btn { padding: 10px 20px; border-radius: 10px; border: none; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: #185fa5; color: #e6f1fb; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-danger { background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3); color: #fca5a5; }
        .btn-danger:hover { background: rgba(220,38,38,0.25); }
        .btn-ghost { background: transparent; border: 1px solid rgba(55,138,221,0.2); color: rgba(133,183,235,0.8); }
        .btn-ghost:hover { border-color: rgba(55,138,221,0.5); }
        .input-field { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(55,138,221,0.15); color: #e8edf5; padding: 10px 14px; border-radius: 10px; font-size: 12px; outline: none; box-sizing: border-box; }
        .input-field:focus { border-color: rgba(55,138,221,0.5); }
        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(55,138,221,0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        @media (max-width: 768px) { .booking-grid { grid-template-columns: 1fr !important; } .block-form-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "rgba(8,12,20,0.95)", borderBottom: "1px solid rgba(55,138,221,0.1)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <Link to="/" style={{ textDecoration: "none", fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", color: "#e8edf5", textTransform: "uppercase" }}>✂ SuperKlip</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "rgba(232,237,245,0.5)" }}>{frisor?.navn || 'Frisør'}</span>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.2)", color: "#f09595", padding: "6px 12px", borderRadius: 50, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            <LogOut size={11} /> Log ud
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 300, marginBottom: 4, letterSpacing: "-0.02em" }}>Frisørpanel</h1>
            <p style={{ fontSize: 12, color: "rgba(232,237,245,0.4)" }}>Velkommen, {frisor?.navn}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowBlockForm(!showBlockForm)}>
            {showBlockForm ? <X size={14} /> : <Plus size={14} />}
            {showBlockForm ? 'Fortryd' : 'Blokér dag'}
          </button>
        </div>

        {/* MESSAGES */}
        {success && <div style={{ background: "rgba(15,110,86,0.1)", border: "1px solid rgba(93,202,165,0.2)", color: "#5dcaa5", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 12, fontWeight: 600, animation: "fadeIn 0.3s ease" }}>{success}</div>}
        {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={14} /> {error}</div>}

        {/* BLOKERINGS-FORM */}
        {showBlockForm && (
          <div className="card" style={{ animation: "fadeIn 0.3s ease" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Blokér en dag</h3>
            <form onSubmit={handleBlockDay} className="block-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 9, color: "rgba(232,237,245,0.4)", display: "block", marginBottom: 4 }}>Dato</label>
                <input type="date" className="input-field" value={blockDate} onChange={e => setBlockDate(e.target.value)} min={today} required />
              </div>
              <div>
                <label style={{ fontSize: 9, color: "rgba(232,237,245,0.4)", display: "block", marginBottom: 4 }}>Fra kl.</label>
                <input type="time" className="input-field" value={blockStart} onChange={e => setBlockStart(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 9, color: "rgba(232,237,245,0.4)", display: "block", marginBottom: 4 }}>Til kl.</label>
                <input type="time" className="input-field" value={blockEnd} onChange={e => setBlockEnd(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-danger">Blokér</button>
            </form>
            <input type="text" className="input-field" placeholder="Årsag (valgfri)" value={blockReason} onChange={e => setBlockReason(e.target.value)} style={{ marginTop: 8 }} />
          </div>
        )}

        {/* BLOKERINGER - kun fremtidige */}
        {blokeringer.filter(b => new Date(b.slutTid) >= new Date()).length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={14} color="#dc2626" /> Blokerede dage
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {blokeringer
                .filter(b => new Date(b.slutTid) >= new Date())
                .sort((a, b) => new Date(a.startTid) - new Date(b.startTid))
                .slice(0, 20)
                .map(b => (
                  <div key={b.blokeringId || b.id} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                    <span>{new Date(b.startTid).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ color: "rgba(232,237,245,0.4)" }}>{(b.arsag || 'Blokeret').substring(0, 20)}</span>
                    <button onClick={() => handleDeleteBlokering(b.blokeringId || b.id)} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", padding: 2 }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <RefreshCw size={24} color="#378add" style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: "rgba(232,237,245,0.4)" }}>Henter data...</p>
          </div>
        )}

        {/* SKEMA - Ugeoversigt */}
        {!loading && (
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={14} color="#378add" /> Skema - næste 7 dage
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(55,138,221,0.15)" }}>
                    <th style={{ padding: "8px", textAlign: "left", color: "rgba(232,237,245,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Dag</th>
                    <th style={{ padding: "8px", textAlign: "left", color: "rgba(232,237,245,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tider</th>
                    <th style={{ padding: "8px", textAlign: "left", color: "rgba(232,237,245,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weekDays.map((day, i) => {
                    const dayStr = day.toISOString().split('T')[0];
                    
                    const dayBookings = bookings.filter(b => 
                      new Date(b.startTid).toISOString().split('T')[0] === dayStr
                    );
                    const dayBlokeringer = blokeringer.filter(b =>
                      new Date(b.startTid).toISOString().split('T')[0] === dayStr
                    );
                    
                    const allDayItems = [
                      ...dayBookings.map(b => ({ ...b, type: 'booking' })),
                      ...dayBlokeringer.map(b => ({ ...b, type: 'blokering' }))
                    ].sort((a, b) => new Date(a.startTid) - new Date(b.startTid));

                    const isToday = dayStr === today;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    return (
                      <tr key={i} style={{ 
                        borderBottom: "1px solid rgba(55,138,221,0.05)",
                        background: isToday ? "rgba(55,138,221,0.05)" : "transparent"
                      }}>
                        <td style={{ padding: "8px", fontWeight: 600, color: isToday ? "#60a5fa" : "#e8edf5" }}>
                          {day.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric' })}
                          {isToday && <span style={{ fontSize: 8, color: "#60a5fa", marginLeft: 4 }}>I DAG</span>}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {allDayItems.length === 0 ? (
                            <span style={{ color: "rgba(93,202,165,0.5)", fontSize: 10 }}>Ingen aftaler</span>
                          ) : (
                            allDayItems.slice(0, 4).map((item, j) => (
                              <div key={j} style={{ 
                                fontSize: 9, 
                                color: item.type === 'blokering' ? '#fca5a5' : '#85b7eb',
                                marginBottom: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}>
                                <span>{item.type === 'blokering' ? '🚫' : '✂'}</span>
                                <span>
                                  {new Date(item.startTid).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                                  {' - '}
                                  {new Date(item.slutTid).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))
                          )}
                          {allDayItems.length > 4 && (
                            <span style={{ fontSize: 8, color: "rgba(232,237,245,0.3)" }}>
                              +{allDayItems.length - 4} mere
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {isWeekend ? (
                            <span style={{ color: "rgba(232,237,245,0.2)", fontSize: 9 }}>Weekend</span>
                          ) : allDayItems.some(i => i.type === 'blokering') ? (
                            <span style={{ color: "#fca5a5", fontSize: 9, fontWeight: 600 }}>Blokeret</span>
                          ) : allDayItems.length > 0 ? (
                            <span style={{ color: "#85b7eb", fontSize: 9, fontWeight: 600 }}>{allDayItems.length} bookinger</span>
                          ) : (
                            <span style={{ color: "#5dcaa5", fontSize: 9 }}>Ledig</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGER */}
        {!loading && (
          <div className="booking-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Kommende */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Scissors size={14} color="#378add" /> Kommende bookinger ({upcomingBookings.length})
              </h3>
              {upcomingBookings.length === 0 ? (
                <p style={{ fontSize: 12, color: "rgba(232,237,245,0.4)", textAlign: "center", padding: "20px 0" }}>Ingen kommende bookinger</p>
              ) : (
                upcomingBookings.slice(0, 10).map((b, i) => (
                  <div key={b.id || b.startTid + i} style={{ background: "rgba(24,95,165,0.08)", border: "1px solid rgba(55,138,221,0.15)", borderRadius: 10, padding: "12px", marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{b.title || 'Booking'}</p>
                    <p style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", marginTop: 2 }}>
                      {new Date(b.startTid).toLocaleString('da-DK', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Tidligere */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={14} /> Tidligere ({pastBookings.length})
              </h3>
              {pastBookings.length === 0 ? (
                <p style={{ fontSize: 12, color: "rgba(232,237,245,0.4)", textAlign: "center", padding: "20px 0" }}>Ingen tidligere bookinger</p>
              ) : (
                pastBookings.slice(0, 10).map((b, i) => (
                  <div key={b.id || b.startTid + i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.06)", borderRadius: 10, padding: "10px", marginBottom: 6, opacity: 0.6 }}>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{b.title || 'Booking'}</p>
                    <p style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", marginTop: 2 }}>
                      {new Date(b.startTid).toLocaleString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* FOOTER LINK */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link to="/" style={{ color: "rgba(232,237,245,0.3)", fontSize: 11, textDecoration: "none" }}>
            ← Tilbage til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}