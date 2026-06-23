import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import daLocale from '@fullcalendar/core/locales/da';
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

  const localDateStr = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = localDateStr(new Date());
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = localDateStr(maxDate);

  const mapOccupiedSlots = (data) =>
    data.map(slot => ({
      id: `occ-${slot.startTid}`,
      title: slot.title?.toLowerCase().includes("skole") ? "SKOLE" : "OPTAGET",
      start: slot.startTid,
      end: slot.slutTid,
      backgroundColor: slot.title?.toLowerCase().includes("skole") ? "#dc2626" : "#4b5563",
      borderColor: "transparent",
      textColor: "#ffffff"
    }));

  const fetchOccupiedSlots = async (frisorId) => {
    if (!frisorId) return;
    const res = await axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${frisorId}`);
    setOccupiedSlots(mapOccupiedSlots(res.data));
  };

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
    if (!selectedFrisor) {
      setOccupiedSlots([]);
      setSelectedTime(null);
      return;
    }

    let isMounted = true;
    const run = async () => {
      try {
        if (!isMounted) return;
        await fetchOccupiedSlots(selectedFrisor);
      } catch (e) {
        console.error("Kunne ikke hente occupied slots:", e);
      }
    };

    run();
    const intervalId = setInterval(run, 10000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, [selectedFrisor]);

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

  const isTuesday = (date) => date.getDay() === 2;
  const isInOpeningHours = (date) => {
    const total = date.getHours() * 60 + date.getMinutes();
    return total >= 10 * 60 && total <= 18 * 60;
  };

  const isInAllowedRange = (date) => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const start = new Date(todayStr); start.setHours(0, 0, 0, 0);
    const end = new Date(maxDateStr); end.setHours(23, 59, 59, 999);
    return d >= start && d <= end;
  };

  const hasOverlapWithOccupied = (start, end) => {
    const s = start.getTime(), e = end.getTime();
    return occupiedSlots.some((ev) => {
      const es = new Date(ev.start).getTime();
      const ee = new Date(ev.end).getTime();
      return s < ee && e > es;
    });
  };

  const canPick = (start, end) => {
    if (!start || !end) return false;
    if (isTuesday(start) || isTuesday(end)) return false;
    if (!isInAllowedRange(start) || !isInAllowedRange(end)) return false;
    if (!isInOpeningHours(start) || !isInOpeningHours(end)) return false;
    if (hasOverlapWithOccupied(start, end)) return false;
    return true;
  };

  const handleDateClick = (info) => {
    const start = new Date(info.date);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    if (!canPick(start, end)) return;

    setSelectedTime({
      start,
      end,
      startStr: start.toISOString(),
      endStr: end.toISOString()
    });
  };

  const handleSelect = (info) => {
    if (!canPick(info.start, info.end)) return;
    setSelectedTime({
      start: info.start,
      end: info.end,
      startStr: info.startStr,
      endStr: info.endStr
    });
  };

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

      setOccupiedSlots(prev => [
        ...prev,
        {
          id: `occ-local-${Date.now()}`,
          title: "OPTAGET",
          start: selectedTime.startStr,
          end: selectedTime.endStr,
          backgroundColor: "#4b5563",
          borderColor: "transparent",
          textColor: "#ffffff"
        }
      ]);

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

  const handleLogout = () => { sessionStorage.clear(); setCurrentUser(null); navigate("/"); };

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

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#080c14", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        .fc-timegrid-slot { background-image: none !important; background-color: transparent !important; }
        .fc-non-business { display: none !important; }
        .fc-bg-event { display: none !important; }
        .fc .fc-timegrid-col.fc-day .fc-timegrid-col-frame { background-image: none !important; }

        .fc-timegrid-event-harness { overflow: hidden !important; max-width: 100% !important; }
        .fc-timegrid-col-events { overflow: hidden !important; margin: 0 2px !important; }
        .fc-event { max-width: 100% !important; overflow: hidden !important; box-sizing: border-box !important; border-radius: 8px !important; padding: 4px 8px !important; font-size: 11px !important; font-weight: 700 !important; }

        .fc { font-family: 'Segoe UI', Arial, sans-serif !important; }
        .fc .fc-view-harness { background: transparent !important; }
        .fc .fc-toolbar { padding: 0 0 20px 0; }
        .fc .fc-toolbar-title { font-size: 13px !important; font-weight: 600 !important; color: rgba(232,237,245,0.6) !important; }

        .fc .fc-button { background: rgba(24,95,165,0.2) !important; border: 1px solid rgba(55,138,221,0.2) !important; border-radius: 10px !important; font-size: 10px !important; font-weight: 700 !important; letter-spacing: 0.12em !important; text-transform: uppercase !important; padding: 7px 14px !important; color: rgba(133,183,235,0.7) !important; box-shadow: none !important; transition: all 0.2s !important; }
        .fc .fc-button:hover { background: rgba(24,95,165,0.4) !important; box-shadow: none !important; }
        .fc .fc-button:focus { box-shadow: none !important; outline: none !important; }
        .fc .fc-button-active, .fc .fc-button:not(:disabled):active { background: rgba(24,95,165,0.55) !important; box-shadow: none !important; }

        .fc .fc-scrollgrid { border: 1px solid rgba(55,138,221,0.1) !important; border-radius: 16px !important; overflow: hidden !important; }
        .fc td, .fc th { border-color: rgba(55,138,221,0.07) !important; }
        .fc .fc-scrollgrid-section > td { border: none !important; }

        .fc .fc-col-header { background: rgba(8,12,20,0.9) !important; }
        .fc .fc-col-header-cell { padding: 12px 0 !important; border-bottom: 1px solid rgba(55,138,221,0.1) !important; }
        .fc .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; color: rgba(232,237,245,0.3) !important; text-decoration: none !important; }
        .fc .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion { color: #60a5fa !important; }

        .fc .fc-timegrid-slot { height: 52px !important; border-color: rgba(55,138,221,0.05) !important; }
        .fc .fc-timegrid-slot-minor { border-color: rgba(55,138,221,0.02) !important; }
        .fc .fc-timegrid-slot-label { border: none !important; }
        .fc .fc-timegrid-slot-label-cushion { font-size: 10px !important; color: rgba(232,237,245,0.2) !important; font-weight: 600 !important; padding-right: 10px !important; }
        .fc .fc-timegrid-axis { background: rgba(8,12,20,0.7) !important; border-right: 1px solid rgba(55,138,221,0.07) !important; }

        .fc .fc-day-today { background: rgba(55,138,221,0.03) !important; }
        .fc .fc-timegrid-now-indicator-line { border-color: #60a5fa !important; border-width: 2px !important; }
        .fc .fc-timegrid-now-indicator-arrow { border-top-color: #60a5fa !important; border-bottom-color: #60a5fa !important; }

        .fc-highlight { background: rgba(29,78,216,0.35) !important; border: 2px solid #3b82f6 !important; border-radius: 8px !important; box-shadow: 0 0 16px rgba(59,130,246,0.5) !important; }
        .fc-mirror { background: rgba(29,78,216,0.4) !important; border: 2px solid #3b82f6 !important; border-radius: 8px !important; opacity: 1 !important; box-shadow: 0 0 16px rgba(59,130,246,0.5) !important; }

        .selected-event { box-shadow: 0 0 0 2px #60a5fa, 0 4px 20px rgba(29,78,216,0.5) !important; animation: pulse-blue 2s ease-in-out infinite !important; }
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 0 2px #60a5fa, 0 4px 16px rgba(29,78,216,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(96,165,250,0.4), 0 4px 28px rgba(29,78,216,0.6); }
        }

        .fc-day-disabled { background: rgba(0,0,0,0.2) !important; opacity: 0.25 !important; }
        .fc-scroller::-webkit-scrollbar { width: 3px; }
        .fc-scroller::-webkit-scrollbar-thumb { background: rgba(55,138,221,0.15); border-radius: 4px; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .select-field { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(55,138,221,0.15); color: #e8edf5; padding: 14px 18px; border-radius: 14px; font-size: 13px; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: border 0.2s; }
        .select-field:focus { border-color: rgba(55,138,221,0.45); }
        .select-field option { background: #0f1623; color: #e8edf5; }
      `}</style>
      {/* Resten af din JSX (nav, layout, FullCalendar, form) beholdes som i din nuværende version */}
    </div>
  );
};

export default BookingPage;