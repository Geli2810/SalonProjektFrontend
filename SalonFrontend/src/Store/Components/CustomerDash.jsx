import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, Scissors, Clock, ChevronRight, MapPin } from 'lucide-react';

export default function CustomerDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://salonproject.onrender.com"; 

  useEffect(() => {
    // 1. Hent brugeren fra localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (savedUser) {
      setUser(savedUser);
      // 2. Hent brugerens specifikke bookinger fra backenden
      axios.get(`${API_URL}/api/Booking/user/${savedUser.kundeId}`)
        .then(res => {
          setMyBookings(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fejl ved hentning af bookinger:", err);
          setLoading(false);
        });
    } else {
      // Hvis ingen er logget ind, send dem til login-siden
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return null; // Viser intet mens vi redirecter

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans">
      
      {/* Navigation / Header */}
      <nav className="p-8 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <h1 className="text-2xl font-serif tracking-[0.2em] uppercase">Salon Royale</h1>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold items-center">
            <Link to="/" className="hover:text-amber-800 transition">Hjem</Link>
            <Link to="/book" className="hover:text-amber-800 transition">Booking</Link>
            <button onClick={handleLogout} className="text-red-600 flex items-center gap-2 hover:opacity-70 transition">
              <LogOut size={14}/> Log ud
            </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        
        {/* Velkomst Sektion */}
        <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-bold mb-2">Din personlige profil</p>
          <h2 className="text-5xl font-serif tracking-tight">Velkommen, {user.navn.split(' ')[0]}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* VENSTRE KOLONNE: Brugeroplysninger */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-800"></div>
               
               <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner">
                  <User size={40} className="text-amber-800" />
               </div>
               
               <h3 className="text-2xl font-serif mb-1">{user.navn}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-10 italic">Loyalt medlem</p>
               
               <div className="space-y-5 text-left border-t border-gray-50 pt-8">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                      <User size={16} className="text-gray-400 group-hover:text-amber-800"/>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                      <Clock size={16} className="text-gray-400 group-hover:text-amber-800"/>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Telefon</p>
                      <p className="text-sm font-medium">{user.telefon || "Ikke oplyst"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                      <MapPin size={16} className="text-gray-400 group-hover:text-amber-800"/>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Foretrukken Salon</p>
                      <p className="text-sm font-medium">Salon Royale, KBH</p>
                    </div>
                  </div>
               </div>
            </div>

            <Link to="/book" className="block w-full bg-[#1a1a1a] text-white py-6 rounded-2xl text-center uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all shadow-xl active:scale-95">
              Bestil Ny Tid
            </Link>
          </div>

          {/* HØJRE KOLONNE: Bookingoversigt */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-serif flex items-center gap-3">
                 <Scissors size={20} className="text-amber-800" /> Dine Aftaler
              </h3>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total: {myBookings.length}</span>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-gray-50 text-center animate-pulse">
                   <p className="text-gray-400 italic">Henter dine aftaler...</p>
                </div>
              ) : myBookings.length > 0 ? (
                myBookings.map((b, index) => (
                  <div 
                    key={b.bookingId} 
                    className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-8">
                       {/* Dato-ikon */}
                       <div className="w-16 h-16 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-800 border border-amber-100 shadow-sm group-hover:bg-amber-100 transition-colors">
                          <span className="text-[10px] uppercase font-black tracking-tighter">
                            {new Date(b.startTid).toLocaleString('da-DK', {month: 'short'})}
                          </span>
                          <span className="text-2xl font-serif font-bold leading-none">
                            {new Date(b.startTid).getDate()}
                          </span>
                       </div>

                       {/* Detaljer */}
                       <div>
                          <p className="font-serif text-xl mb-1">{b.behandlingNavn || "Behandling"}</p>
                          <div className="flex gap-4">
                             <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                               <Clock size={12} className="text-amber-700" /> kl. {new Date(b.startTid).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}
                             </p>
                             <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                               <MapPin size={12} className="text-amber-700" /> Salon Royale
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <span className={`text-[9px] uppercase tracking-[0.3em] font-black px-5 py-2.5 rounded-full ${b.status === 'booket' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                          {b.status}
                       </span>
                       <ChevronRight size={18} className="text-gray-200 group-hover:text-amber-800 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar size={32} className="text-gray-200" />
                   </div>
                   <p className="text-gray-400 font-serif text-lg italic mb-8">Du har ingen aktive aftaler i øjeblikket.</p>
                   <Link to="/book" className="inline-block border-b-2 border-amber-800 pb-1 text-amber-800 text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-70 transition">
                      Bestil din første tid her
                   </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}