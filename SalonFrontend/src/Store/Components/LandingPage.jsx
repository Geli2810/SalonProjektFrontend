import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Star, Clock, ArrowRight, LogOut, User, Instagram, Facebook, Mail, MapPin } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] font-sans">
      <nav className="p-8 flex justify-between items-center sticky top-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md">
        <h1 className="text-2xl font-serif tracking-[0.3em] uppercase">Salon Royale</h1>
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-bold items-center">
          <Link to="/book" className="hover:text-amber-800 transition text-amber-900">Book Tid</Link>
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-amber-900 transition flex items-center gap-2 shadow-lg">
                <User size={12}/> Min Profil
              </Link>
              <button onClick={handleLogout} className="text-red-600 font-black flex items-center gap-1 hover:opacity-70 transition">
                <LogOut size={14} /> LOG UD
              </button>
            </div>
          ) : (
            <Link to="/login" className="border border-black px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition">Log Ind</Link>
          )}
        </div>
      </nav>

      <section className="relative h-[85vh] flex items-center px-6 md:px-20 overflow-hidden">
        <div className="max-w-4xl z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Eksklusiv Hårpleje & Velvære</motion.p>
          
          <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8">
            {user ? `Velkommen, ${user.navn.split(' ')[0]}` : "Din stil,"} <br /> 
            <span className="italic text-amber-900/30">{user ? "skal vi finde en tid?" : "vores håndværk."}</span>
          </h2>

          <p className="max-w-lg text-gray-500 mb-10 leading-relaxed italic font-light">
            Hos Salon Royale kombinerer vi klassiske teknikker med moderne trends. 
            Vores mission er at skabe et rum, hvor du kan slappe af, mens vi perfektionerer dit look.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={user ? "/book" : "/login"} className="group bg-[#1a1a1a] text-white px-10 py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-amber-900 transition-all shadow-2xl">
              <span className="uppercase text-[10px] tracking-[0.3em] font-black">{user ? "Bestil tid nu" : "Log ind & Bestil"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!user && (
              <Link to="/book" className="group bg-white border border-gray-200 text-[#1a1a1a] px-10 py-6 rounded-2xl flex items-center justify-center gap-4 hover:border-black transition shadow-sm">
                <span className="uppercase text-[10px] tracking-[0.3em] font-black">Fortsæt som gæst</span>
              </Link>
            )}
          </div>
        </div>

        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }} className="absolute right-[-5%] top-0 w-full lg:w-1/2 h-full -z-0">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1500" alt="Salon" className="w-full h-full object-cover grayscale-[20%] brightness-90 shadow-2xl rounded-l-[5rem]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-transparent"></div>
        </motion.div>
      </section>

      {/* SERVICES SEKTION (Beskrivelser tilbage) */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-12 rounded-[3rem] border border-gray-50 text-center hover:shadow-xl transition-all group">
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-amber-100 transition-colors">
              <Scissors className="w-8 h-8 text-amber-800" />
            </div>
            <h3 className="text-xl font-serif mb-4 uppercase tracking-widest">Præcisions Klip</h3>
            <p className="text-gray-400 text-sm leading-relaxed italic">Vi mestrer kunsten at klippe efter dine ansigtstræk, så din frisure holder formen hver dag.</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-gray-50 text-center hover:shadow-xl transition-all group">
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-amber-100 transition-colors">
              <Star className="w-8 h-8 text-amber-800" />
            </div>
            <h3 className="text-xl font-serif mb-4 uppercase tracking-widest">Royal Styling</h3>
            <p className="text-gray-400 text-sm leading-relaxed italic">Fra bryllup til galla. Vi sørger for, at du stråler til de mest betydningsfulde øjeblikke i livet.</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-gray-50 text-center hover:shadow-xl transition-all group">
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-amber-100 transition-colors">
              <Clock className="w-8 h-8 text-amber-800" />
            </div>
            <h3 className="text-xl font-serif mb-4 uppercase tracking-widest">Hurtig Booking</h3>
            <p className="text-gray-400 text-sm leading-relaxed italic">Vores system er bygget til din travle hverdag. Bestil din tid på under et minut direkte fra mobilen.</p>
          </div>
      </section>

      {/* FOOTER (Tilbage) */}
      <footer className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="text-2xl font-serif uppercase tracking-widest mb-6">Salon Royale</h4>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed italic">Byens mest luksuriøse oplevelse. Vi glæder os til at byde dig velkommen i vores salon.</p>
          </div>
          <div>
            <h5 className="text-[10px] uppercase font-black tracking-widest mb-6">Kontakt</h5>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-800"/> København K, 1100</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-amber-800"/> kontakt@salonroyale.dk</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] uppercase font-black tracking-widest mb-6">Sociale Medier</h5>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors text-gray-400 hover:text-amber-800"><Instagram size={20}/></a>
              <a href="#" className="p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors text-gray-400 hover:text-amber-800"><Facebook size={20}/></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.3em]">© 2026 Salon Royale — Created with Passion</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;