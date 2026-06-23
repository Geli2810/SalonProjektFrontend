import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Calendar, Clock, Scissors, CheckCircle, LogOut, Mail } from 'lucide-react';
import { getCurrentUser } from "../../SYSAdmin";

const BookingView = () => {
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

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fRes, bRes] = await Promise.all([
          axios.get(`${API_URL}/api/HairDresserSalon/frisorer`),
          axios.get(`${API_URL}/api/HairDresserSalon/behandlinger`)
        ]);
        setFrisorer(fRes.data);
        setBehandlinger(bRes.data);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, [API_URL]);

  useEffect(() => {
    if (selectedFrisor) {
      axios.get(`${API_URL}/api/HairDresserSalon/occupied-slots/${selectedFrisor}`)
        .then(res => {
          const events = res.data.map(slot => ({
            title: slot.title?.toLowerCase().includes("skole") ? "Skole" : "Optaget",
            start: slot.startTid,
            end: slot.slutTid,
            display: 'block',
            backgroundColor: slot.title?.toLowerCase().includes("skole") ? '#ef4444' : '#64748b',
            borderColor: 'transparent',
            textColor: '#ffffff'
          }));
          setOccupiedSlots(events);
        });
    } else {
      setOccupiedSlots([]);
    }
  }, [selectedFrisor, API_URL]);

  if (currentUser?.rolle === "frisor") {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-50 text-center max-w-md">
          <Scissors className="w-10 h-10 text-amber-800 mx-auto mb-6" />
          <h1 className="text-2xl font-serif mb-4">Kun kunder kan booke tider</h1>
          <p className="text-gray-400 text-sm mb-8">Gå til frisørpanelet for at administrere tider.</p>
          <Link to="/admin" className="bg-[#1a1a1a] text-white px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-amber-900 transition">
            Gå til frisørpanel
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) return alert("Vælg en tid i kalenderen!");
    const btn = e.target.querySelector('button');
    btn.innerText = "Behandler..."; btn.disabled = true;

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
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.response?.data?.message || "Kunne ikke bestille tid.");
      btn.innerText = "Bestil tid nu"; btn.disabled = false;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser(null);
    navigate("/");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-center">
        <div className="max-w-xl w-full bg-white p-16 rounded-[3rem] shadow-2xl border border-gray-50">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-serif mb-4 text-[#1a1a1a]">Tiden er din!</h1>
          <p className="text-gray-500 mb-10 italic">Reservationen er gennemført. Vi har sendt en bekræftelse til din mail.</p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="bg-black text-white py-5 rounded-2xl text-[10px] uppercase font-black hover:bg-amber-900 transition shadow-lg tracking-widest">Gå til forsiden</Link>
            {currentUser && <Link to="/dashboard" className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-black">Se mine aftaler</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans">

      <style>{`
        .fc {
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        .fc .fc-toolbar-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.05em;
        }
        .fc .fc-button {
          background: #1a1a1a !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          padding: 8px 16px !important;
          transition: background 0.2s !important;
        }
        .fc .fc-button:hover {
          background: #92400e !important;
        }
        .fc .fc-button-active {
          background: #92400e !important;
        }
        .fc .fc-timegrid-slot {
          height: 40px !important;
        }
        .fc .fc-timegrid-slot-label {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }
        .fc .fc-col-header-cell {
          padding: 12px 0 !important;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .fc .fc-timegrid-now-indicator-line {
          border-color: #b45309 !important;
          border-width: 2px !important;
        }
        .fc .fc-timegrid-now-indicator-arrow {
          border-color: #b45309 !important;
        }
        .fc-highlight {
          background: rgba(180, 83, 9, 0.1) !important;
          border: 2px solid #b45309 !important;
          border-radius: 8px !important;
        }
        .fc .fc-non-business {
          background: rgba(0,0,0,0.02) !important;
        }
        .fc-event {
          border-radius: 8px !important;
          padding: 2px 6px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }
        .fc-bg-event { display: none !important; }
        .fc-timegrid-bg-harness { display: none !important; }
        .fc-mirror {
          background: rgba(180, 83, 9, 0.15) !important;
          border: 2px dashed #b45309 !important;
          border-radius: 8px !important;
        }
      `}</style>

      <nav className="p-6 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-xl font-serif tracking-[0.2em] uppercase">Salon Royale</Link>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-black items-center">
          <Link to="/book" className="text-amber-800 border-b border-amber-800 pb-1">Booking</Link>
          {currentUser ? (
            <div className="flex items-center gap-6 border-l border-gray-100 pl-6">
              <Link to="/dashboard" className="hover:text-amber-800 transition">Min profil</Link>
              <button onClick={handleLogout} className="text-red-600 flex items-center gap-1 font-bold uppercase">
                <LogOut size={14} /> Log ud
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-black text-white px-4 py-2 rounded-full hover:bg-amber-900 transition">Log ind</Link>
          )}
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* VENSTRE SIDE */}
        <div className="lg:col-span-3 space-y-8">

          {/* VÆLG SERVICE */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
              <span className="bg-amber-50 p-2 rounded-full">
                <Scissors className="w-5 h-5 text-amber-800" />
              </span>
              1. Vælg service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-amber-800 cursor-pointer text-sm"
                value={selectedFrisor}
                onChange={(e) => { setSelectedFrisor(e.target.value); setSelectedTime(null); }}
              >
                <option value="">Vælg frisør</option>
                {frisorer.map(f => <option key={f.frisorId} value={f.frisorId}>{f.navn}</option>)}
              </select>
              <select
                className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-amber-800 cursor-pointer text-sm"
                value={selectedBehandling}
                onChange={(e) => setSelectedBehandling(e.target.value)}
              >
                <option value="">Vælg behandling</option>
                {behandlinger.map(b => <option key={b.behandlingId} value={b.behandlingId}>{b.navn} — {b.pris} kr.</option>)}
              </select>
            </div>
          </div>

          {/* KALENDER */}
          {selectedFrisor && selectedBehandling && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
                <span className="bg-amber-50 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-amber-800" />
                </span>
                2. Vælg en ledig tid
              </h2>

              <div className="flex gap-4 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: '#64748b' }} />
                  <span className="text-gray-500">Optaget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }} />
                  <span className="text-gray-500">Skole</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(180,83,9,0.15)', border: '2px solid #b45309' }} />
                  <span className="text-gray-500">Din valgte tid</span>
                </div>
              </div>

              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                height="800px"
                expandRows={true}
                selectable={true}
                selectOverlap={false}
                selectMirror={true}
                events={occupiedSlots}
                select={(info) => setSelectedTime(info)}
                locale="da"
                nowIndicator={true}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'timeGridDay,timeGridWeek'
                }}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
                dayHeaderFormat={{
                  weekday: 'short',
                  day: 'numeric',
                  month: 'numeric'
                }}
              />
            </div>
          )}
        </div>

        {/* HØJRE SIDE — GENNEMFØR */}
        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 sticky top-28 transition-all duration-500 ${!selectedTime ? 'opacity-30 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
            <h2 className="text-2xl font-serif mb-8 border-b border-gray-50 pb-6 tracking-tighter">Gennemfør</h2>
            {selectedTime && (
              <form onSubmit={handleBooking} className="space-y-6 text-sm">
                <div className="bg-amber-50 p-5 rounded-2xl text-amber-900 border border-amber-100">
                  <Clock size={16} className="mb-2 opacity-40" />
                  <p className="font-bold text-sm">
                    {new Date(selectedTime.startStr).toLocaleString('da-DK', {
                      weekday: 'long', day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {!currentUser ? (
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-amber-800 tracking-widest italic">Indtast mail for bekræftelse</p>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        type="email"
                        placeholder="din@email.dk"
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:ring-2 ring-amber-800 transition"
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-900">
                    <p className="text-[10px] uppercase font-black opacity-60 mb-1">Logget ind som</p>
                    <p className="font-bold text-sm">{currentUser.navn}</p>
                    <p className="text-xs opacity-70">{currentUser.email}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all shadow-xl active:scale-95"
                >
                  Bestil tid nu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;