import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Clock, Scissors, CheckCircle, LogOut, Mail, RefreshCw } from 'lucide-react';
import { getCurrentUser } from "../../SYSAdmin";

const BookingPage = () => {
  const navigate = useNavigate();
  const API_URL = 'https://salonproject.onrender.com';
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [frisorer, setFrisorer] = useState([]);
  const [behandlinger, setBehandlinger] = useState([]);
  const [selectedFrisor, setSelectedFrisor] = useState("");
  const [selectedBehandling, setSelectedBehandling] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allEvents = [
    ...occupiedSlots,
    ...(selectedTime ? [{
      id: "selected",
      title: "✓ DIN VALGTE TID",
      start: selectedTime.startStr,
      end: selectedTime.endStr,
      backgroundColor: "#1d4ed8",
      borderColor: "#3b82f6",
      textColor: "#ffffff",
      classNames: ["selected-event"]
    }] : [])
  ];

  useEffect(() => { setCurrentUser(getCurrentUser()); }, []);

  useEffect(() => {
    const timer = setInterval(() => setLoadingSeconds(s => s + 1), 1000);
    Promise.all([
      axios.get(`${API_URL}/api/HairDresserSalon/frisorer`),
      axios.get(`${API_URL}/api/HairDresserSalon/behandlinger`)
    ]).then(([fRes, bRes]) => {
      setFrisorer(fRes.data);
      setBehandlinger(bRes.data);
    }).catch(console.error)
      .finally(() => { setDataLoading(false); clearInterval(timer); });
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedFrisor) {
      axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${selectedFrisor}`)
        .then(res => {
          setOccupiedSlots(res.data.map(slot => ({
            id: `occ-${slot.startTid}`,
            title: slot.title?.toLowerCase().includes("skole") ? "SKOLE" : "OPTAGET",
            start: slot.startTid,
            end: slot.slutTid,
            backgroundColor: slot.title?.toLowerCase().includes("skole") ? '#dc2626' : '#4b5563',
            borderColor: 'transparent',
            textColor: '#ffffff'
          })));
          setSelectedTime(null);
        });
    } else {
      setOccupiedSlots([]);
      setSelectedTime(null);
    }
  }, [selectedFrisor]);

  const fetchOccupiedSlots = async (frisorId) => {
    try {
      const res = await axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${frisorId}`);
      setOccupiedSlots(res.data.map(slot => ({
        id: `occ-${slot.startTid}`,
        title: slot.title?.toLowerCase().includes("skole") ? "SKOLE" : "OPTAGET",
        start: slot.startTid,
        end: slot.slutTid,
        backgroundColor: slot.title?.toLowerCase().includes("skole") ? '#dc2626' : '#4b5563',
        borderColor: 'transparent',
        textColor: '#ffffff'
      })));
    } catch (err) {
      console.error("Kunne ikke hente optagede tider:", err);
    }
  };

  if (currentUser?.rolle === "frisor") {
    return (
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.2)", borderRadius: 24, padding: "48px", textAlign: "center", maxWidth: 400 }}>
          <Scissors size={32} color="#378add" style={{ margin: "0 auto 20px", display: "block" }} />
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Kun kunder kan booke tider</h1>
          <Link to="/admin" style={{ background: "rgba(24,95,165,0.4)", border: "1px solid rgba(55,138,221,0.4)", color: "#85b7eb", padding: "12px 28px", borderRadius: 50, textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 20, display: "inline-block" }}>
            Gå til frisørpanel
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/Booking/create`, {
        frisorId: parseInt(selectedFrisor),
        behandlingId: parseInt(selectedBehandling),
        startTid: selectedTime.startStr,
        kundeId: currentUser?.kundeId || null,
        email: currentUser?.email || guestEmail,
        navn: currentUser?.navn || "Gæst",
        telefon: currentUser?.telefon || "00000000"
      });
      await fetchOccupiedSlots(selectedFrisor);
      setSelectedTime(null);
      setIsSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Kunne ikke bestille tid.";
      alert(msg);
      if (String(msg).toLowerCase().includes("optaget")) {
        try {
          await fetchOccupiedSlots(selectedFrisor);
          setSelectedTime(null);
        } catch (e2) {
          console.error("Kunne ikke opdatere optagede tider:", e2);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXET: Logger ud én gang
  const handleLogout = () => { 
    sessionStorage.clear(); 
    setCurrentUser(null); 
    window.location.href = "/";
  };

  if (isSuccess) {
    return (
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "rgba(15,110,86,0.1)", border: "1px solid rgba(93,202,165,0.2)", borderRadius: 28, padding: "64px 48px", textAlign: "center", maxWidth: 480 }}>
          <CheckCircle size={48} color="#5dcaa5" style={{ margin: "0 auto 24px", display: "block" }} />
          <h1 style={{ fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Tiden er din!</h1>
          <p style={{ color: "rgba(232,237,245,0.45)", fontSize: 14, marginBottom: 40, lineHeight: 1.7 }}>Vi har sendt en bekræftelse til din mail.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/" style={{ background: "#185fa5", color: "#e6f1fb", padding: "16px 32px", borderRadius: 50, textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Gå til forsiden</Link>
            {currentUser && <Link to="/dashboard" style={{ color: "rgba(232,237,245,0.35)", fontSize: 11, textDecoration: "none" }}>Se mine aftaler</Link>}
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const isTuesday = (date) => date.getDay() === 2;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        .fc-timegrid-slot { background-image: none !important; background-color: transparent !important; }
        .fc-non-business, .fc-bg-event { display: none !important; }
        .fc-timegrid-col-frame {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='52'%3E%3Ctext x='50' y='28' font-family='Arial' font-weight='800' font-size='7' fill='%2363b3ed' fill-opacity='0.25' text-anchor='middle' letter-spacing='1.5'%3ELEDIG%3C/text%3E%3C/svg%3E") !important;
          background-repeat: repeat-y !important;
          background-position: center top !important;
        }
        .fc-day-tue .fc-timegrid-col-frame, .fc-day-disabled .fc-timegrid-col-frame { background-image: none !important; }
        .fc-timegrid-event-harness { overflow: hidden !important; max-width: 100% !important; }
        .fc-timegrid-col-events { overflow: hidden !important; margin: 0 2px !important; }
        .fc-event { max-width: 100% !important; overflow: hidden !important; box-sizing: border-box !important; border-radius: 8px !important; padding: 4px 8px !important; font-size: 10px !important; font-weight: 700 !important; }
        .fc { font-family: 'Segoe UI', Arial, sans-serif !important; }
        .fc .fc-view-harness { background: transparent !important; }
        .fc .fc-toolbar { padding: 0 0 20px 0; }
        .fc .fc-toolbar-title { font-size: 13px !important; font-weight: 600 !important; color: rgba(232,237,245,0.6) !important; }
        .fc .fc-button { background: rgba(24,95,165,0.2) !important; border: 1px solid rgba(55,138,221,0.2) !important; border-radius: 10px !important; font-size: 10px !important; font-weight: 700 !important; letter-spacing: 0.12em !important; text-transform: uppercase !important; padding: 7px 14px !important; color: rgba(133,183,235,0.7) !important; box-shadow: none !important; transition: all 0.2s !important; }
        .fc .fc-button:hover { background: rgba(24,95,165,0.4) !important; }
        .fc .fc-button-active { background: rgba(24,95,165,0.55) !important; }
        .fc .fc-scrollgrid { border: 1px solid rgba(55,138,221,0.1) !important; border-radius: 16px !important; overflow: hidden !important; }
        .fc td, .fc th { border-color: rgba(55,138,221,0.07) !important; }
        .fc .fc-col-header { background: rgba(8,12,20,0.9) !important; }
        .fc .fc-col-header-cell { padding: 12px 0 !important; }
        .fc .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 700 !important; color: rgba(232,237,245,0.3) !important; text-decoration: none !important; }
        .fc .fc-day-today .fc-col-header-cell-cushion { color: #60a5fa !important; }
        .fc-day-tue .fc-col-header-cell-cushion { color: rgba(220,38,38,0.4) !important; }
        .fc .fc-timegrid-slot { height: 52px !important; border-color: rgba(55,138,221,0.05) !important; }
        .fc .fc-timegrid-slot-label-cushion { font-size: 10px !important; color: rgba(232,237,245,0.2) !important; }
        .fc .fc-day-today { background: rgba(55,138,221,0.03) !important; }
        .fc .fc-timegrid-now-indicator-line { border-color: #60a5fa !important; border-width: 2px !important; }
        .fc-highlight { background: rgba(29,78,216,0.45) !important; border: 3px solid #3b82f6 !important; border-radius: 6px !important; box-shadow: 0 0 25px rgba(59,130,246,0.7) !important; animation: highlight-pulse 1.5s ease-in-out infinite !important; display: block !important; z-index: 5 !important; }
        @keyframes highlight-pulse { 0%,100%{ box-shadow: 0 0 20px rgba(59,130,246,0.5); } 50%{ box-shadow: 0 0 35px rgba(59,130,246,0.9); } }
        .selected-event { box-shadow: 0 0 0 3px #60a5fa, 0 4px 25px rgba(29,78,216,0.6) !important; animation: pulse-blue 2s ease-in-out infinite !important; }
        @keyframes pulse-blue { 0%,100%{ box-shadow: 0 0 0 3px #60a5fa; } 50%{ box-shadow: 0 0 0 6px rgba(96,165,250,0.5); } }
        .fc-day-tue { background: rgba(220,38,38,0.05) !important; opacity: 0.4 !important; cursor: not-allowed !important; pointer-events: none !important; }
        .fc-day-disabled { background: rgba(0,0,0,0.3) !important; opacity: 0.2 !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .select-field { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(55,138,221,0.15); color: #e8edf5; padding: 14px 18px; border-radius: 14px; font-size: 13px; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: border 0.2s; }
        .select-field:focus { border-color: rgba(55,138,221,0.45); }
        .select-field option { background: #0f1623; color: #e8edf5; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "rgba(8,12,20,0.95)", borderBottom: "1px solid rgba(55,138,221,0.1)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <Link to="/" style={{ textDecoration: "none", fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", color: "#e8edf5", textTransform: "uppercase" }}>SuperKlip</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link to="/book" style={{ color: "#378add", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(55,138,221,0.4)", paddingBottom: 2 }}>Booking</Link>
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20, borderLeft: "1px solid rgba(55,138,221,0.12)", paddingLeft: 20 }}>
              <Link to="/dashboard" style={{ color: "rgba(232,237,245,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Min profil</Link>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(162,45,45,0.12)", border: "1px solid rgba(162,45,45,0.2)", color: "#f09595", padding: "7px 14px", borderRadius: 50, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                <LogOut size={12} /> Log ud
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ background: "#185fa5", color: "#e6f1fb", padding: "9px 20px", borderRadius: 50, textDecoration: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Log ind</Link>
          )}
        </div>
      </nav>

      {/* LOADING */}
      {dataLoading && (
        <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 40px", textAlign: "center" }}>
          <div style={{ background: "rgba(24,95,165,0.07)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 20, padding: "48px 32px" }}>
            <RefreshCw size={26} color="#378add" style={{ margin: "0 auto 16px", display: "block", animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 15, color: "rgba(232,237,245,0.65)", marginBottom: 6 }}>Forbinder til serveren...</p>
            <p style={{ fontSize: 12, color: "rgba(232,237,245,0.25)", marginBottom: 24 }}>Typisk 20-40 sekunder</p>
            <div style={{ background: "rgba(55,138,221,0.08)", borderRadius: 50, height: 3, overflow: "hidden", maxWidth: 280, margin: "0 auto" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #185fa5, #378add)", borderRadius: 50, width: `${Math.min((loadingSeconds / 45) * 100, 95)}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        </div>
      )}

      {!dataLoading && (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 18, padding: "24px 28px", animation: "fadeUp 0.5s ease forwards" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(24,95,165,0.3)", border: "1px solid rgba(55,138,221,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#85b7eb", flexShrink: 0 }}>1</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(232,237,245,0.6)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Vælg frisør og behandling</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <select className="select-field" value={selectedFrisor} onChange={e => { setSelectedFrisor(e.target.value); setSelectedTime(null); }}>
                  <option value="">Vælg frisør</option>
                  {frisorer.map(f => <option key={f.frisorId} value={f.frisorId}>{f.navn}</option>)}
                </select>
                <select className="select-field" value={selectedBehandling} onChange={e => setSelectedBehandling(e.target.value)}>
                  <option value="">Vælg behandling</option>
                  {behandlinger.map(b => <option key={b.behandlingId} value={b.behandlingId}>{b.navn} — {b.pris} kr.</option>)}
                </select>
              </div>
            </div>

            {selectedFrisor && selectedBehandling && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.1)", borderRadius: 18, padding: "24px 28px", animation: "fadeUp 0.4s ease forwards" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(24,95,165,0.3)", border: "1px solid rgba(55,138,221,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#85b7eb", flexShrink: 0 }}>2</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(232,237,245,0.6)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Klik på en ledig tid</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 10, color: "rgba(232,237,245,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#4b5563", display: "inline-block" }} />Optaget</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#dc2626", display: "inline-block" }} />Skole</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#1d4ed8", display: "inline-block" }} />Din valgte</span>
                  </div>
                </div>
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  allDaySlot={false}
                  slotMinTime="10:00:00"
                  slotMaxTime="18:30:00"
                  height="620px"
                  expandRows={true}
                  selectable={true}
                  selectOverlap={false}
                  selectMirror={true}
                  events={allEvents}
                  select={(info) => setSelectedTime(info)}
                  selectAllow={(selectInfo) => !isTuesday(selectInfo.start)}
                  locale="da"
                  nowIndicator={true}
                  validRange={{ start: today }}
                  headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek' }}
                  slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                  dayHeaderFormat={{ weekday: 'short', day: 'numeric', month: 'numeric' }}
                  dayCellClassNames={(arg) => isTuesday(arg.date) ? ['fc-day-tue'] : []}
                />
              </div>
            )}
          </div>

          <div style={{ position: "sticky", top: 80, height: "fit-content" }}>
            <div style={{
              background: selectedTime ? "rgba(24,95,165,0.08)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${selectedTime ? "rgba(55,138,221,0.25)" : "rgba(55,138,221,0.07)"}`,
              borderRadius: 18, padding: "24px",
              transition: "all 0.4s ease",
              opacity: selectedTime ? 1 : 0.35,
              filter: selectedTime ? "none" : "blur(2px)",
              pointerEvents: selectedTime ? "all" : "none"
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5", marginBottom: 20 }}>Gennemfør booking</h2>
              {selectedTime && (
                <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "rgba(29,78,216,0.12)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 10, color: "rgba(96,165,250,0.6)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Valgt tid</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e8edf5", lineHeight: 1.5 }}>
                      {new Date(selectedTime.startStr).toLocaleString('da-DK', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={11} />
                      kl. {new Date(selectedTime.startStr).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                      {" — "}
                      {new Date(selectedTime.endStr).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!currentUser ? (
                    <div>
                      <p style={{ fontSize: 10, color: "rgba(55,138,221,0.55)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Din email</p>
                      <div style={{ position: "relative" }}>
                        <Mail size={12} color="rgba(232,237,245,0.15)" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                        <input required type="email" placeholder="din@email.dk" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(55,138,221,0.15)", color: "#e8edf5", padding: "11px 13px 11px 34px", borderRadius: 11, fontSize: 13, outline: "none", boxSizing: "border-box" }} onChange={e => setGuestEmail(e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(15,110,86,0.08)", border: "1px solid rgba(93,202,165,0.15)", borderRadius: 12, padding: "11px 14px" }}>
                      <p style={{ fontSize: 9, color: "rgba(93,202,165,0.5)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Logget ind som</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8edf5" }}>{currentUser.navn}</p>
                      <p style={{ fontSize: 11, color: "rgba(232,237,245,0.3)" }}>{currentUser.email}</p>
                    </div>
                  )}
                  <button type="submit" disabled={isSubmitting} style={{ width: "100%", background: isSubmitting ? "rgba(55,138,221,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#e6f1fb", padding: "15px", borderRadius: 12, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: isSubmitting ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(29,78,216,0.35)" }}>
                    {isSubmitting ? "Behandler..." : "Bestil tid nu"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;