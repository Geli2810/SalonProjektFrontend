import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Calendar, Clock, User, Scissors, CheckCircle, LogOut, Mail } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  const API_URL = 'https://salonproject.onrender.com';

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [frisorer, setFrisorer] = useState([]);
  const [behandlinger, setBehandlinger] = useState([]);
  const [selectedFrisor, setSelectedFrisor] = useState("");
  const [selectedBehandling, setSelectedBehandling] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

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
            title: slot.title.toLowerCase().includes("skole") ? "SKOLE" : "OPTAGET",
            start: slot.startTid,
            end: slot.slutTid,
            display: 'block', 
            backgroundColor: slot.title.toLowerCase().includes("skole") ? '#ef4444' : '#94a3b8',
            borderColor: 'transparent',
            textColor: '#ffffff'
          }));
          setOccupiedSlots(events);
        });
    }
  }, [selectedFrisor, API_URL]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) return alert("Vælg en tid i kalenderen!");
    const btn = e.target.querySelector('button');
    btn.innerText = "BEHANDLER..."; btn.disabled = true;

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
      btn.innerText = "BESTIL TID NU"; btn.disabled = false;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser(null);
    navigate("/");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="max-w-xl w-full bg-white p-16 rounded-[3rem] shadow-2xl border border-gray-50">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-serif mb-4 text-[#1a1a1a]">Tiden er din!</h1>
          <p className="text-gray-500 mb-10 italic">Reservationen er gennemført. Vi har sendt en bekræftelse til din mail.</p>
          <div className="flex flex-col gap-3">
             <Link to="/" className="bg-black text-white py-5 rounded-2xl text-[10px] uppercase font-black hover:bg-amber-900 transition shadow-lg tracking-widest">Gå til Forsiden</Link>
             {currentUser && <Link to="/dashboard" className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-black">Se Mine Aftaler</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans">
      <nav className="p-8 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-2xl font-serif tracking-[0.2em] uppercase">Salon Royale</Link>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-black items-center">
            <Link to="/book" className="text-amber-800 border-b border-amber-800 pb-1">Booking</Link>
            {currentUser ? (
              <div className="flex items-center gap-6 border-l border-gray-100 pl-6">
                <Link to="/dashboard" className="hover:text-amber-800 transition">Min Profil</Link>
                <button onClick={handleLogout} className="text-red-600 flex items-center gap-1 font-bold uppercase"><LogOut size={14}/> Log ud</button>
              </div>
            ) : (
              <Link to="/login" className="bg-black text-white px-4 py-2 rounded-full hover:bg-amber-900 transition">Log Ind</Link>
            )}
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
              <span className="bg-amber-50 p-2 rounded-full"><Scissors className="w-5 h-5 text-amber-800" /></span> 1. Vælg service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <select className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-amber-800 cursor-pointer" value={selectedFrisor} onChange={(e) => setSelectedFrisor(e.target.value)}>
                <option value="">Vælg Frisør</option>
                {frisorer.map(f => <option key={f.frisorId} value={f.frisorId}>{f.navn}</option>)}
              </select>
              <select className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-amber-800 cursor-pointer" value={selectedBehandling} onChange={(e) => setSelectedBehandling(e.target.value)}>
                <option value="">Vælg Behandling</option>
                {behandlinger.map(b => <option key={b.behandlingId} value={b.behandlingId}>{b.navn} ({b.pris} kr.)</option>)}
              </select>
            </div>
          </div>

          {selectedFrisor && selectedBehandling && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <h2 className="text-xl font-serif mb-8 flex items-center gap-3"><span className="bg-amber-50 p-2 rounded-full"><Calendar className="w-5 h-5 text-amber-800" /></span> 2. Find en ledig tid</h2>
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                height="850px"
                expandRows={true}
                selectable={true}
                selectOverlap={false}
                events={occupiedSlots}
                select={(info) => setSelectedTime(info)}
                locale="da"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek' }}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 sticky top-32 transition-all duration-500 ${!selectedTime ? 'opacity-30 blur-[1px] pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
            <h2 className="text-2xl font-serif mb-8 border-b border-gray-50 pb-6 tracking-tighter">Gennemfør</h2>
            {selectedTime && (
              <form onSubmit={handleBooking} className="space-y-8 text-sm">
                <div className="bg-amber-50/50 p-5 rounded-2xl text-amber-900 border border-amber-100">
                   <Clock size={20} className="mb-2 opacity-40"/><p className="font-bold">{new Date(selectedTime.startStr).toLocaleString('da-DK', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {!currentUser ? (
                  <div className="space-y-4 animate-in slide-in-from-top-1 duration-300">
                    <p className="text-[10px] uppercase font-black text-amber-800 tracking-widest px-1 italic">Indtast mail for bekræftelse</p>
                    <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" /><input required type="email" placeholder="din@email.dk" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:ring-2 ring-amber-800 transition" onChange={(e) => setGuestEmail(e.target.value)} /></div>
                  </div>
                ) : (
                  <div className="p-5 bg-green-50 border border-green-100 rounded-2xl text-green-900"><p className="text-[10px] uppercase font-black opacity-60 mb-1">Logget ind som</p><p className="font-bold text-sm">{currentUser.navn}</p><p className="text-xs opacity-70">{currentUser.email}</p></div>
                )}
                <button type="submit" className="w-full bg-[#1a1a1a] text-white py-6 rounded-2xl uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all shadow-xl active:scale-95 shadow-amber-900/10">Bestil Tid Nu</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;