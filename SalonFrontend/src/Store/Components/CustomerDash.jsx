import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, Scissors, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function CustomerDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    // Tjek session
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      axios.get(`${API_URL}/api/Booking/user/${parsedUser.kundeId}`)
        .then(res => {
          setMyBookings(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
           <div><p className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-bold mb-2">Velkommen tilbage</p><h2 className="text-5xl font-serif tracking-tight">Min Profil</h2></div>
           <div className="flex gap-4"><Link to="/book" className="bg-white border border-gray-200 px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-gray-50 transition">Ny Booking</Link><button onClick={handleLogout} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-red-100 flex items-center gap-2">Log ud</button></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-center relative overflow-hidden h-fit animate-in fade-in zoom-in duration-500">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-800"></div>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6"><User size={32} className="text-amber-800" /></div>
              <h3 className="text-2xl font-serif mb-1 uppercase tracking-tight">{user.navn}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest italic mb-8 italic">Medlem</p>
              <div className="space-y-4 text-left border-t border-gray-50 pt-8 text-sm"><div className="flex items-center gap-3"><Mail size={14} className="text-gray-400"/><span>{user.email}</span></div><div className="flex items-center gap-3"><Clock size={14} className="text-gray-400"/><span>{user.telefon}</span></div></div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-serif flex items-center gap-3 ml-2"><Scissors size={20} className="text-amber-800" /> Dine Aftaler</h3>
            <div className="space-y-4">
              {loading ? <p className="italic text-gray-400 text-center py-10">Henter aftaler...</p> : myBookings.length > 0 ? (
                myBookings.map(b => (
                  <div key={b.bookingId} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                    <div className="flex items-center gap-8">
                       <div className="w-14 h-14 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-800 border border-amber-100"><span className="text-[10px] uppercase font-black">{new Date(b.startTid).toLocaleString('da-DK', {month: 'short'})}</span><span className="text-xl font-bold">{new Date(b.startTid).getDate()}</span></div>
                       <div><p className="font-serif text-lg">{b.behandlingNavn || "Service"}</p><p className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5 italic font-medium"><Clock size={10} className="text-amber-700"/> kl. {new Date(b.startTid).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}</p></div>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black px-5 py-2.5 rounded-full bg-green-50 text-green-700 border border-green-100">{b.status}</span>
                  </div>
                ))
              ) : <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-100 text-center font-serif text-gray-400 italic">Du har ingen aktive aftaler endnu.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}