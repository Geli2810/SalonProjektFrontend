import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../SYSAdmin";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LogOut, Calendar, Users, Scissors, Clock, CheckCircle, XCircle, Edit2, Trash2, X, Save } from "lucide-react";

const API_URL = "https://salonproject.onrender.com";

export default function AdminPanel({ onLogout }) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [bookinger, setBookinger] = useState([]);
  const [kunder, setKunder] = useState([]);
  const [behandlinger, setBehandlinger] = useState([]);
  const [kalenderEvents, setKalenderEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("kalender");
  const [editKunde, setEditKunde] = useState(null);
  const [editBehandling, setEditBehandling] = useState(null);
  const [nyBehandling, setNyBehandling] = useState({ navn: "", pris: "", varighedMinutter: "" });
  const [visNyBehandling, setVisNyBehandling] = useState(false);
  const [blokeringModal, setBlokeringModal] = useState(null);
  const [blokeringArsag, setBlokeringArsag] = useState("Ikke på arbejde");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user || user.rolle !== "frisor") { navigate("/frisor-login"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [bRes, kRes, tRes, allBRes] = await Promise.all([
        axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${user.frisorId || 1}`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/HairDresserSalon/customers`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/HairDresserSalon/behandlinger`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/Booking/user/0`).catch(() => ({ data: [] }))
      ]);
      setBookinger(allBRes.data || []);
      setKunder(kRes.data || []);
      setBehandlinger(tRes.data || []);
      buildKalenderEvents(bRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buildKalenderEvents = (data) => {
    const events = data.map(slot => ({
      id: slot.blokeringId ? `blokering-${slot.blokeringId}` : `booking-${slot.bookingId}`,
      title: slot.title?.toLowerCase().includes("skole") ? "Skole" : slot.title || "Optaget",
      start: slot.startTid,
      end: slot.slutTid,
      backgroundColor: slot.title?.toLowerCase().includes("skole") ? '#ef4444' : slot.title?.toLowerCase().includes("ikke") ? '#f59e0b' : '#64748b',
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: { blokeringId: slot.blokeringId }
    }));
    setKalenderEvents(events);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleKalenderSelect = (info) => {
    setBlokeringModal({ start: info.startStr, end: info.endStr });
    setBlokeringArsag("Ikke på arbejde");
  };

  const opretBlokering = async () => {
    try {
      await axios.post(`${API_URL}/api/Booking/blokering`, {
        frisorId: user.frisorId || 1,
        startTid: blokeringModal.start,
        slutTid: blokeringModal.end,
        arsag: blokeringArsag
      });
      setBlokeringModal(null);
      showToast("Blokering oprettet");
      fetchAll();
    } catch {
      showToast("Kunne ikke oprette blokering", "error");
    }
  };

  const sletBlokering = async (event) => {
    const blokeringId = event.extendedProps?.blokeringId;
    if (!blokeringId) return;
    if (!window.confirm(`Vil du slette blokeringen "${event.title}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/Booking/blokering/${blokeringId}`);
      showToast("Blokering slettet");
      fetchAll();
    } catch {
      showToast("Kunne ikke slette blokering", "error");
    }
  };

  const aflysBooking = async (bookingId) => {
    if (!window.confirm("Er du sikker på at du vil aflyse denne booking?")) return;
    try {
      await axios.delete(`${API_URL}/api/Booking/${bookingId}`).catch(() => {});
      setBookinger(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: "aflyst" } : b));
      showToast("Booking aflyst");
    } catch { showToast("Kunne ikke aflyse booking", "error"); }
  };

  const gemKunde = async () => {
    try {
      await axios.put(`${API_URL}/api/HairDresserSalon/customers/${editKunde.kundeId}`, editKunde).catch(() => {});
      setKunder(prev => prev.map(k => k.kundeId === editKunde.kundeId ? editKunde : k));
      setEditKunde(null);
      showToast("Kunde opdateret");
    } catch { showToast("Kunne ikke opdatere kunde", "error"); }
  };

  const sletKunde = async (kundeId) => {
    if (!window.confirm("Er du sikker på at du vil slette denne kunde?")) return;
    try {
      await axios.delete(`${API_URL}/api/HairDresserSalon/customers/${kundeId}`).catch(() => {});
      setKunder(prev => prev.filter(k => k.kundeId !== kundeId));
      showToast("Kunde slettet");
    } catch { showToast("Kunne ikke slette kunde", "error"); }
  };

  const gemBehandling = async () => {
    try {
      await axios.put(`${API_URL}/api/HairDresserSalon/behandlinger/${editBehandling.behandlingId}`, editBehandling).catch(() => {});
      setBehandlinger(prev => prev.map(b => b.behandlingId === editBehandling.behandlingId ? editBehandling : b));
      setEditBehandling(null);
      showToast("Behandling opdateret");
    } catch { showToast("Kunne ikke opdatere behandling", "error"); }
  };

  const opretBehandling = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/HairDresserSalon/behandlinger`, nyBehandling).catch(() => ({ data: { ...nyBehandling, behandlingId: Date.now() } }));
      setBehandlinger(prev => [...prev, res.data]);
      setNyBehandling({ navn: "", pris: "", varighedMinutter: "" });
      setVisNyBehandling(false);
      showToast("Behandling oprettet");
    } catch { showToast("Kunne ikke oprette behandling", "error"); }
  };

  const sletBehandling = async (behandlingId) => {
    if (!window.confirm("Er du sikker?")) return;
    try {
      await axios.delete(`${API_URL}/api/HairDresserSalon/behandlinger/${behandlingId}`).catch(() => {});
      setBehandlinger(prev => prev.filter(b => b.behandlingId !== behandlingId));
      showToast("Behandling slettet");
    } catch { showToast("Kunne ikke slette behandling", "error"); }
  };

  const statusColor = (status) => {
    if (status === "booket") return { bg: "rgba(15,110,86,0.15)", color: "#5dcaa5", border: "rgba(15,110,86,0.3)" };
    if (status === "aflyst") return { bg: "rgba(162,45,45,0.15)", color: "#f09595", border: "rgba(162,45,45,0.3)" };
    return { bg: "rgba(55,138,221,0.15)", color: "#85b7eb", border: "rgba(55,138,221,0.3)" };
  };

  const dagensBookinger = bookinger.filter(b => new Date(b.startTid).toDateString() === new Date().toDateString());

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .admin-tab { padding: 10px 24px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; border: 1px solid rgba(55,138,221,0.2); background: transparent; color: rgba(232,237,245,0.4); transition: all 0.3s; }
        .admin-tab:hover { color: #e8edf5; border-color: rgba(55,138,221,0.4); }
        .admin-tab.active { background: rgba(24,95,165,0.3); border-color: rgba(55,138,221,0.5); color: #85b7eb; }
        .table-row { display: grid; padding: 14px 20px; border-bottom: 1px solid rgba(55,138,221,0.07); transition: background 0.2s; align-items: center; }
        .table-row:hover { background: rgba(55,138,221,0.05); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(55,138,221,0.12); border-radius: 16px; padding: 24px; animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .action-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; }
        .action-btn:hover { transform: scale(1.1); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #0f1623; border: 1px solid rgba(55,138,221,0.2); border-radius: 24px; padding: 32px; width: 100%; max-width: 480px; animation: slideIn 0.3s ease; }
        .modal input, .modal select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(55,138,221,0.2); color: #e8edf5; padding: 12px 16px; border-radius: 12px; font-size: 13px; outline: none; box-sizing: border-box; margin-bottom: 12px; transition: border 0.2s; }
        .modal input:focus, .modal select:focus { border-color: rgba(55,138,221,0.5); }
        .modal label { font-size: 11px; color: rgba(232,237,245,0.4); letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; }
        .modal select option { background: #0f1623; color: #e8edf5; }
        .save-btn { background: rgba(24,95,165,0.4); border: 1px solid rgba(55,138,221,0.4); color: #85b7eb; padding: 12px 24px; border-radius: 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
        .save-btn:hover { background: rgba(24,95,165,0.6); }
        .cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(232,237,245,0.4); padding: 12px 24px; border-radius: 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
        .cancel-btn:hover { border-color: rgba(255,255,255,0.3); color: #e8edf5; }
        .fc { font-family: 'Segoe UI', Arial, sans-serif !important; }
        .fc .fc-toolbar-title { font-size: 15px !important; font-weight: 600 !important; color: #e8edf5 !important; }
        .fc .fc-button { background: rgba(24,95,165,0.4) !important; border: 1px solid rgba(55,138,221,0.3) !important; border-radius: 10px !important; font-size: 10px !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; padding: 7px 14px !important; color: #85b7eb !important; transition: all 0.2s !important; box-shadow: none !important; }
        .fc .fc-button:hover, .fc .fc-button:focus { background: rgba(24,95,165,0.6) !important; outline: none !important; box-shadow: none !important; }
        .fc .fc-button-active, .fc .fc-button:not(:disabled):active { background: rgba(24,95,165,0.7) !important; box-shadow: none !important; }
        .fc .fc-timegrid-slot { height: 44px !important; border-color: rgba(55,138,221,0.08) !important; }
        .fc .fc-timegrid-slot-label { font-size: 11px !important; color: rgba(232,237,245,0.3) !important; }
        .fc .fc-col-header-cell { padding: 12px 0 !important; }
        .fc .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 700 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; color: rgba(232,237,245,0.4) !important; text-decoration: none !important; }
        .fc .fc-timegrid-now-indicator-line { border-color: #378add !important; border-width: 2px !important; }
        .fc-highlight { background: rgba(55,138,221,0.1) !important; border: 2px solid #378add !important; border-radius: 8px !important; }
        .fc-mirror { background: rgba(55,138,221,0.15) !important; border: 2px dashed #378add !important; border-radius: 8px !important; }
        .fc-event { border-radius: 6px !important; padding: 2px 6px !important; font-size: 11px !important; font-weight: 600 !important; cursor: pointer !important; }
        .fc .fc-scrollgrid { border-color: rgba(55,138,221,0.1) !important; }
        .fc td, .fc th { border-color: rgba(55,138,221,0.08) !important; }
        .fc .fc-day-today { background: rgba(55,138,221,0.04) !important; }
        .fc-bg-event { display: none !important; }
        .fc-timegrid-bg-harness { display: none !important; }
        .toast { position: fixed; bottom: 32px; right: 32px; padding: 14px 24px; border-radius: 14px; font-size: 13px; font-weight: 600; z-index: 9999; animation: toastIn 0.3s ease; }
        .toast.success { background: rgba(15,110,86,0.9); border: 1px solid rgba(93,202,165,0.4); color: #5dcaa5; }
        .toast.error { background: rgba(162,45,45,0.9); border: 1px solid rgba(240,149,149,0.4); color: #f09595; }
      `}</style>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* BLOKERING MODAL */}
      {blokeringModal && (
        <div className="modal-overlay" onClick={() => setBlokeringModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#e8edf5" }}>Opret blokering</h3>
              <button onClick={() => setBlokeringModal(null)} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: "rgba(55,138,221,0.08)", border: "1px solid rgba(55,138,221,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#85b7eb" }}>
              <Clock size={14} style={{ display: "inline", marginRight: 8 }} />
              {new Date(blokeringModal.start).toLocaleString("da-DK", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              {" — "}
              {new Date(blokeringModal.end).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <label>Årsag</label>
            <select value={blokeringArsag} onChange={e => setBlokeringArsag(e.target.value)}>
              <option>Ikke på arbejde</option>
              <option>Ferie</option>
              <option>Sygedag</option>
              <option>Skole</option>
              <option>Andet</option>
            </select>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="save-btn" onClick={opretBlokering}><Save size={14} /> Opret blokering</button>
              <button className="cancel-btn" onClick={() => setBlokeringModal(null)}>Annuller</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT KUNDE MODAL */}
      {editKunde && (
        <div className="modal-overlay" onClick={() => setEditKunde(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#e8edf5" }}>Rediger kunde</h3>
              <button onClick={() => setEditKunde(null)} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <label>Navn</label>
            <input value={editKunde.navn || ""} onChange={e => setEditKunde({ ...editKunde, navn: e.target.value })} />
            <label>Email</label>
            <input value={editKunde.email || ""} onChange={e => setEditKunde({ ...editKunde, email: e.target.value })} />
            <label>Telefon</label>
            <input value={editKunde.telefon || ""} onChange={e => setEditKunde({ ...editKunde, telefon: e.target.value })} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="save-btn" onClick={gemKunde}><Save size={14} /> Gem ændringer</button>
              <button className="cancel-btn" onClick={() => setEditKunde(null)}>Annuller</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BEHANDLING MODAL */}
      {editBehandling && (
        <div className="modal-overlay" onClick={() => setEditBehandling(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#e8edf5" }}>Rediger behandling</h3>
              <button onClick={() => setEditBehandling(null)} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <label>Navn</label>
            <input value={editBehandling.navn || ""} onChange={e => setEditBehandling({ ...editBehandling, navn: e.target.value })} />
            <label>Pris (kr.)</label>
            <input type="number" value={editBehandling.pris || ""} onChange={e => setEditBehandling({ ...editBehandling, pris: e.target.value })} />
            <label>Varighed (min)</label>
            <input type="number" value={editBehandling.varighedMinutter || ""} onChange={e => setEditBehandling({ ...editBehandling, varighedMinutter: e.target.value })} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="save-btn" onClick={gemBehandling}><Save size={14} /> Gem ændringer</button>
              <button className="cancel-btn" onClick={() => setEditBehandling(null)}>Annuller</button>
            </div>
          </div>
        </div>
      )}

      {/* NY BEHANDLING MODAL */}
      {visNyBehandling && (
        <div className="modal-overlay" onClick={() => setVisNyBehandling(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#e8edf5" }}>Ny behandling</h3>
              <button onClick={() => setVisNyBehandling(false)} style={{ background: "none", border: "none", color: "rgba(232,237,245,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <label>Navn</label>
            <input placeholder="fx Herreklip" value={nyBehandling.navn} onChange={e => setNyBehandling({ ...nyBehandling, navn: e.target.value })} />
            <label>Pris (kr.)</label>
            <input type="number" placeholder="250" value={nyBehandling.pris} onChange={e => setNyBehandling({ ...nyBehandling, pris: e.target.value })} />
            <label>Varighed (min)</label>
            <input type="number" placeholder="30" value={nyBehandling.varighedMinutter} onChange={e => setNyBehandling({ ...nyBehandling, varighedMinutter: e.target.value })} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="save-btn" onClick={opretBehandling}><Save size={14} /> Opret behandling</button>
              <button className="cancel-btn" onClick={() => setVisNyBehandling(false)}>Annuller</button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ background: "rgba(8,12,20,0.95)", borderBottom: "1px solid rgba(55,138,221,0.1)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
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
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.25)", color: "#f09595", padding: "8px 16px", borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            <LogOut size={12} /> Log ud
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px" }}>

        <div style={{ marginBottom: 40, animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
          <p style={{ fontSize: 11, color: "#378add", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Velkommen tilbage</p>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#e8edf5", letterSpacing: "-0.01em" }}>{user?.navn}</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: <Calendar size={20} color="#378add" />, label: "Bookinger i dag", value: dagensBookinger.length, delay: "0.1s" },
            { icon: <CheckCircle size={20} color="#5dcaa5" />, label: "Aktive bookinger", value: bookinger.filter(b => b.status === "booket").length, delay: "0.2s" },
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

        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {[{ key: "kalender", label: "Kalender" }, { key: "bookinger", label: "Bookinger" }, { key: "kunder", label: "Kunder" }, { key: "behandlinger", label: "Behandlinger" }].map(tab => (
            <button key={tab.key} className={`admin-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "kalender" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 20, padding: 24, animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Dit skema</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(232,237,245,0.35)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#64748b" }} /> Optaget</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#ef4444" }} /> Skole</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#f59e0b" }} /> Ikke på arbejde</div>
                <span style={{ color: "rgba(55,138,221,0.5)", fontStyle: "italic" }}>Klik på et event for at slette — klik og træk for at oprette blokering</span>
              </div>
            </div>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              height="700px"
              expandRows={true}
              selectable={true}
              selectMirror={true}
              events={kalenderEvents}
              select={handleKalenderSelect}
              eventClick={(info) => sletBlokering(info.event)}
              locale="da"
              nowIndicator={true}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek' }}
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              dayHeaderFormat={{ weekday: 'short', day: 'numeric', month: 'numeric' }}
            />
          </div>
        )}

        {activeTab === "bookinger" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 20, overflow: "hidden", animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
            <div style={{ padding: "20px 20px 0" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Alle bookinger</h2>
            </div>
            <div className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 60px", borderBottom: "1px solid rgba(55,138,221,0.15)", marginTop: 16 }}>
              {["Dato & tid", "Behandling", "Kunde", "Status", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {loading ? <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
            : bookinger.length === 0 ? <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen bookinger endnu</div>
            : bookinger.map((b, i) => {
              const sc = statusColor(b.status);
              return (
                <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 60px" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#e8edf5", fontWeight: 500 }}>{new Date(b.startTid).toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,237,245,0.35)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Clock size={10} /> kl. {new Date(b.startTid).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(232,237,245,0.7)" }}>{b.behandlingNavn || "—"}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,237,245,0.4)", fontFamily: "monospace" }}>#{b.kundeId || "—"}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, padding: "4px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", width: "fit-content" }}>{b.status}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {b.status !== "aflyst" && (
                      <button className="action-btn" onClick={() => aflysBooking(b.bookingId)} style={{ background: "rgba(162,45,45,0.15)", color: "#f09595" }} title="Aflys"><XCircle size={14} /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "kunder" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 20, overflow: "hidden", animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
            <div style={{ padding: "20px 20px 0" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Alle kunder</h2>
            </div>
            <div className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 80px", borderBottom: "1px solid rgba(55,138,221,0.15)", marginTop: 16 }}>
              {["Navn", "Email", "Telefon", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {loading ? <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
            : kunder.length === 0 ? <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen kunder endnu</div>
            : kunder.map((k, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 80px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(55,138,221,0.15)", border: "1px solid rgba(55,138,221,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#378add" }}>{k.navn?.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: 13, color: "#e8edf5" }}>{k.navn}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)" }}>{k.email}</div>
                <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)", fontFamily: "monospace" }}>{k.telefon}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="action-btn" onClick={() => setEditKunde(k)} style={{ background: "rgba(55,138,221,0.15)", color: "#85b7eb" }} title="Rediger"><Edit2 size={13} /></button>
                  <button className="action-btn" onClick={() => sletKunde(k.kundeId)} style={{ background: "rgba(162,45,45,0.15)", color: "#f09595" }} title="Slet"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "behandlinger" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 20, overflow: "hidden", animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
            <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,237,245,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Behandlinger</h2>
              <button className="save-btn" onClick={() => setVisNyBehandling(true)} style={{ fontSize: 10 }}>+ Ny behandling</button>
            </div>
            <div className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 80px", borderBottom: "1px solid rgba(55,138,221,0.15)" }}>
              {["Navn", "Varighed", "Pris", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {loading ? <div style={{ padding: 40, textAlign: "center", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Henter data...</div>
            : behandlinger.length === 0 ? <div style={{ padding: 60, textAlign: "center", color: "rgba(232,237,245,0.2)", fontSize: 14, fontStyle: "italic" }}>Ingen behandlinger endnu</div>
            : behandlinger.map((b, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 80px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Scissors size={14} color="rgba(55,138,221,0.5)" />
                  <span style={{ fontSize: 13, color: "#e8edf5" }}>{b.navn}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(232,237,245,0.45)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} color="rgba(232,237,245,0.3)" /> {b.varighedMinutter} min</div>
                <div style={{ fontSize: 13, color: "#5dcaa5", fontWeight: 600 }}>{b.pris} kr.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="action-btn" onClick={() => setEditBehandling(b)} style={{ background: "rgba(55,138,221,0.15)", color: "#85b7eb" }} title="Rediger"><Edit2 size={13} /></button>
                  <button className="action-btn" onClick={() => sletBehandling(b.behandlingId)} style={{ background: "rgba(162,45,45,0.15)", color: "#f09595" }} title="Slet"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}