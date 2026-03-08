import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Calendar, Clock, User, Scissors, CheckCircle } from 'lucide-react';

const BookingPage = () => {
  // State til valg
  const [frisorer, setFrisorer] = useState([]);
  const [behandlinger, setBehandlinger] = useState([]);
  const [selectedFrisor, setSelectedFrisor] = useState("");
  const [selectedBehandling, setSelectedBehandling] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  
  // State til selve bookingen
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ navn: "", email: "", telefon: "" });
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Hent stamdata ved load
  useEffect(() => {
    const loadData = async () => {
      const [fRes, bRes] = await Promise.all([
        axios.get('https://salonproject.onrender.com/api/HairDresserSalon/frisorer'),
        axios.get('https://salonproject.onrender.com/api/HairDresserSalon/behandlinger')
      ]);
      setFrisorer(fRes.data);
      setBehandlinger(bRes.data);
    };
    loadData();
  }, []);

  // 2. Hent optagede tider når frisøren ændres
  useEffect(() => {
    if (selectedFrisor) {
      axios.get(`https://salonproject.onrender.com/api/HairDresserSalon/occupied-slots/${selectedFrisor}`)
        .then(res => {
          const events = res.data.map(slot => ({
            start: slot.startTid,
            end: slot.slutTid,
            display: 'background',
            color: '#e5e7eb' // Grå farve for optaget
          }));
          setOccupiedSlots(events);
        });
    }
  }, [selectedFrisor]);

  const handleBooking = async (e) => {
    e.preventDefault();
    const payload = {
      frisorId: parseInt(selectedFrisor),
      behandlingId: parseInt(selectedBehandling),
      startTid: selectedTime.startStr,
      ...formData // Sender navn, email, tlf med til gæste-logikken
    };

    try {
      await axios.post('https://salonproject.onrender.com/api/Booking/create', payload);
      setIsSuccess(true);
    } catch (err) {
      alert("Fejl: " + err.response?.data || "Kunne ikke oprette booking");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-serif">Tak for din bestilling!</h1>
        <p className="text-gray-600 mt-2">Vi har sendt en bekræftelse til din e-mail.</p>
        <button onClick={() => window.location.reload()} className="mt-8 border border-black px-6 py-2 uppercase text-sm tracking-widest">Gå tilbage</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a]">
      {/* Navigation */}
      <nav className="p-8 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-serif tracking-[0.2em] uppercase">Salon Royale</h1>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-amber-800 transition">Hjem</a>
            <a href="#" className="font-bold border-b border-black">Booking</a>
            <a href="#" className="hover:text-amber-800 transition">Profil</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Venstre side: Valg og Kalender */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-800" /> 1. Vælg din service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-lg focus:ring-2 ring-amber-800 outline-none"
                onChange={(e) => setSelectedFrisor(e.target.value)}
              >
                <option value="">Vælg Frisør</option>
                {frisorer.map(f => <option key={f.frisorId} value={f.frisorId}>{f.navn}</option>)}
              </select>

              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-lg focus:ring-2 ring-amber-800 outline-none"
                onChange={(e) => setSelectedBehandling(e.target.value)}
              >
                <option value="">Vælg Behandling</option>
                {behandlinger.map(b => <option key={b.behandlingId} value={b.behandlingId}>{b.navn} ({b.varighedMinutter} min) - {b.pris} kr.</option>)}
              </select>
            </div>
          </div>

          {selectedFrisor && selectedBehandling && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-800" /> 2. Find en tid
              </h2>
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                height="600px"
                selectable={true}
                selectOverlap={false}
                events={occupiedSlots}
                select={(info) => setSelectedTime(info)}
                locale="da"
                headerToolbar={{ left: 'prev,next', center: 'title', right: 'timeGridDay,timeGridWeek' }}
              />
            </div>
          )}
        </div>

        {/* Højre side: Checkout Form */}
        <div className="lg:col-span-1">
          <div className={`bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-32 transition-opacity duration-300 ${!selectedTime ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-2xl font-serif mb-8 border-b pb-4">Gennemfør Bestilling</h2>
            
            {selectedTime && (
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-900 flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>{new Date(selectedTime.startStr).toLocaleString('da-DK', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="space-y-4">
                  <input 
                    required 
                    placeholder="Fulde Navn" 
                    className="w-full border-b border-gray-200 py-3 outline-none focus:border-amber-800 transition" 
                    onChange={(e) => setFormData({...formData, navn: e.target.value})}
                  />
                  <input 
                    required 
                    type="email" 
                    placeholder="Email Adresse" 
                    className="w-full border-b border-gray-200 py-3 outline-none focus:border-amber-800 transition" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    required 
                    placeholder="Telefon Nummer" 
                    className="w-full border-b border-gray-200 py-3 outline-none focus:border-amber-800 transition" 
                    onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1a1a1a] text-white py-5 rounded-lg uppercase text-xs tracking-[0.3em] font-bold hover:bg-amber-900 transition-all shadow-lg active:scale-95"
                >
                  Bestil Tid Nu
                </button>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-4">Ved bestilling accepterer du vores vilkår</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;