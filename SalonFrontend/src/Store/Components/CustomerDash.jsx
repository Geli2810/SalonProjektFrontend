import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from "../../SYSAdmin";
import { User, LogOut, Scissors, Clock, Mail, Phone, RefreshCw } from 'lucide-react';

export default function CustomerDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendLoading, setBackendLoading] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (!savedUser) { navigate("/login"); return; }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Timer der tæller sekunder mens backend vågner op
    const timer = setInterval(() => setLoadingSeconds(s => s + 1), 1000);

    axios.get(`${API_URL}/api/Booking/user/${parsedUser.kundeId}`)
      .then(res => {
        setMyBookings(res.data);
        setLoading(false);
        setBackendLoading(false);
        clearInterval(timer);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setBackendLoading(false);
        clearInterval(timer);
      });

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (!user || user.rolle !== "kunde") navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  const kommende = myBookings.filter(b => new Date(b.startTid) >= new Date() && b.status !== "aflyst");
  const tidligere = myBookings.filter(b => new Date(b.startTid) < new Date() || b.status === "aflyst");

  const statusStyle = (status) => {
    if (status === "booket") return "bg-green-50 text-green-700 border-green-100";
    if (status === "aflyst") return "bg-red-50 text-red-600 border-red-100";
    return "bg-gray-50 text-gray-500 border-gray-100";
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans">

      {/* NAVBAR */}
      <nav className="px-8 py-5 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-xl font-serif tracking-[0.2em] uppercase">Salon Royale</Link>
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-black items-center">
          <Link to="/book" className="hover:text-amber-800 transition">Book tid</Link>
          <button onClick={handleLogout} className="text-red-500 flex items-center gap-1 hover:text-red-700 transition">
            <LogOut size={13} /> Log ud
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-bold mb-2">Velkommen tilbage</p>
          <h1 className="text-4xl font-serif tracking-tight">Min Profil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* PROFIL KORT */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 bg-amber-800 w-full" />
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-100">
                  <User size={30} className="text-amber-800" />
                </div>
                <h2 className="text-xl font-serif uppercase tracking-tight mb-1">{user.navn}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest italic mb-6">Medlem</p>
                <div className="space-y-3 text-left border-t border-gray-50 pt-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Mail size={13} className="text-gray-300 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={13} className="text-gray-300 shrink-0" />
                    <span>{user.telefon || "Ikke oplyst"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/book" className="block w-full bg-[#1a1a1a] text-white py-4 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] hover:bg-amber-900 transition text-center shadow-lg">
              Book ny tid
            </Link>
          </div>

          {/* BOOKINGER */}
          <div className="lg:col-span-2 space-y-6">

            {/* BACKEND LOADING STATE */}
            {backendLoading && (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-10 text-center">
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw size={28} className="text-amber-800 animate-spin" />
                  <div>
                    <p className="font-serif text-lg text-gray-700 mb-1">Forbinder til serveren...</p>
                    <p className="text-xs text-gray-400 italic">Serveren vågner op — dette tager typisk 20-40 sekunder</p>
                    {loadingSeconds > 5 && (
                      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3">
                        <p className="text-[11px] text-amber-800 font-medium">
                          {loadingSeconds < 20 ? "Starter server..." : loadingSeconds < 40 ? "Næsten klar..." : "Tager lidt længere end normalt..."}
                        </p>
                        <div className="mt-2 h-1 bg-amber-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-800 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((loadingSeconds / 45) * 100, 95)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* KOMMENDE AFTALER */}
            {!backendLoading && (
              <>
                <div>
                  <h3 className="text-sm font-serif flex items-center gap-2 mb-4 text-gray-700">
                    <Scissors size={16} className="text-amber-800" /> Kommende aftaler
                    {kommende.length > 0 && (
                      <span className="bg-amber-800 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{kommende.length}</span>
                    )}
                  </h3>

                  {kommende.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-dashed border-gray-100 p-12 text-center">
                      <Scissors size={24} className="text-gray-200 mx-auto mb-3" />
                      <p className="font-serif text-gray-400 italic text-sm">Du har ingen kommende aftaler.</p>
                      <Link to="/book" className="text-[10px] text-amber-800 uppercase font-black tracking-widest mt-3 inline-block hover:underline">Book en tid nu</Link>
                    </div>
                  ) : kommende.map(b => (
                    <div key={b.bookingId} className="bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all mb-3">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex flex-col items-center justify-center text-amber-800 border border-amber-100 shrink-0">
                          <span className="text-[9px] uppercase font-black leading-none">{new Date(b.startTid).toLocaleString('da-DK', {month: 'short'})}</span>
                          <span className="text-lg font-bold leading-none mt-0.5">{new Date(b.startTid).getDate()}</span>
                        </div>
                        <div>
                          <p className="font-serif text-base">{b.behandlingNavn || "Service"}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={9} className="text-amber-700" />
                            kl. {new Date(b.startTid).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full border ${statusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TIDLIGERE AFTALER */}
                {tidligere.length > 0 && (
                  <div>
                    <h3 className="text-sm font-serif flex items-center gap-2 mb-4 text-gray-400">
                      <Clock size={16} /> Tidligere aftaler
                    </h3>
                    {tidligere.map(b => (
                      <div key={b.bookingId} className="bg-white p-5 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between opacity-50 mb-3">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                            <span className="text-[9px] uppercase font-black leading-none">{new Date(b.startTid).toLocaleString('da-DK', {month: 'short'})}</span>
                            <span className="text-lg font-bold leading-none mt-0.5">{new Date(b.startTid).getDate()}</span>
                          </div>
                          <div>
                            <p className="font-serif text-base text-gray-500">{b.behandlingNavn || "Service"}</p>
                            <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-0.5">
                              <Clock size={9} /> kl. {new Date(b.startTid).toLocaleTimeString('da-DK', {hour:'2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[9px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full border ${statusStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}