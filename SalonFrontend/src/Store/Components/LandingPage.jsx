import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Star, Clock, ArrowRight, LogOut, User, CheckCircle, Instagram, Facebook } from 'lucide-react';

const LandingPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vi bruger nu sessionStorage for at sikre logout ved luk af fane
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] font-sans">
      <nav className="p-8 flex justify-between items-center sticky top-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md">
        <h1 className="text-2xl font-serif tracking-[0.3em] uppercase">Salon Royale</h1>
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-bold items-center">
          <Link to="/book" className="hover:text-amber-800 transition">Book Tid</Link>
          {user ? (
            <div className="flex items-center gap-6 border-l border-gray-200 pl-6">
              <Link to="/dashboard" className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-amber-900 transition flex items-center gap-2">
                <User size={12}/> Min Profil
              </Link>
              <button onClick={handleLogout} className="text-red-600 font-black hover:opacity-70 transition flex items-center gap-1 uppercase tracking-widest">
                <LogOut size={14} /> Log ud
              </button>
            </div>
          ) : (
            <Link to="/login" className="border border-black px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition">Log Ind</Link>
          )}
        </div>
      </nav>

      <section className="relative h-[85vh] flex items-center px-6 md:px-20 overflow-hidden">
        <div className="max-w-4xl z-10">
          {user ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 text-amber-800 mb-6 font-black uppercase tracking-[0.4em] text-[10px]">
                <CheckCircle size={18} /> <span>Logget ind som medlem</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8">
                Velkommen, <br /> <span className="italic text-amber-900/30">{user.navn.split(' ')[0]}</span>
              </h2>
              <p className="max-w-lg text-gray-500 mb-10 leading-relaxed italic text-lg">Din faste frisør står klar. Skal vi finde din næste tid i stolen?</p>
              <Link to="/book" className="inline-flex bg-[#1a1a1a] text-white px-12 py-6 rounded-2xl items-center gap-4 hover:bg-amber-900 transition shadow-2xl">
                <span className="uppercase text-[10px] tracking-[0.3em] font-black">Bestil ny tid</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Eksklusiv Hårpleje & Velvære</p>
              <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-10">Din stil, <br /> <span className="italic text-amber-900/30">vores håndværk.</span></h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="bg-[#1a1a1a] text-white px-10 py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-amber-900 transition shadow-2xl">
                  <span className="uppercase text-[10px] tracking-[0.3em] font-black">Log ind & Bestil</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/book" className="bg-white border border-gray-200 text-[#1a1a1a] px-10 py-6 rounded-2xl flex items-center justify-center gap-4 hover:border-black transition shadow-sm">
                  <span className="uppercase text-[10px] tracking-[0.3em] font-black">Fortsæt som gæst</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }} className="absolute right-[-5%] top-0 w-full lg:w-1/2 h-full -z-0 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1500" alt="Salon" className="w-full h-full object-cover grayscale-[30%] brightness-90 shadow-2xl rounded-l-[5rem]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-transparent"></div>
        </motion.div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4"><Scissors className="w-8 h-8 text-amber-800 mx-auto" /><h3 className="text-xl font-serif uppercase tracking-widest">Håndværk</h3><p className="text-gray-400 text-sm italic leading-relaxed">Klassiske teknikker med moderne trends.</p></div>
          <div className="space-y-4"><Star className="w-8 h-8 text-amber-800 mx-auto" /><h3 className="text-xl font-serif uppercase tracking-widest">Velvære</h3><p className="text-gray-400 text-sm italic leading-relaxed">Din komfort er vores højeste prioritet.</p></div>
          <div className="space-y-4"><Clock className="w-8 h-8 text-amber-800 mx-auto" /><h3 className="text-xl font-serif uppercase tracking-widest">Hurtig Booking</h3><p className="text-gray-400 text-sm italic leading-relaxed">Bestil tid som gæst på under 1 minut.</p></div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-20 px-6 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div><h4 className="text-3xl font-serif uppercase tracking-[0.2em] mb-4 text-[#1a1a1a]">Salon Royale</h4><p className="text-gray-400 text-[10px] tracking-widest uppercase">© 2026 København · Professionel Hårpleje</p></div>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] font-black"><a href="#" className="flex items-center gap-2 hover:text-amber-800 transition"><Instagram size={16} /> Instagram</a><a href="#" className="flex items-center gap-2 hover:text-amber-800 transition"><Facebook size={16} /> Facebook</a></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;