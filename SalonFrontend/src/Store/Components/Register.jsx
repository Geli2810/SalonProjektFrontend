import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export default function Register({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ navn: "", email: "", telefon: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://salonproject.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/HairDresserSalon/customers`, {
        Navn: formData.navn,
        Email: formData.email,
        Telefon: formData.telefon,
        PasswordHash: formData.password
      });

      const nyBruger = response.data;
      if (nyBruger) {
        // Log ind med det samme i denne session
        sessionStorage.setItem("user", JSON.stringify(nyBruger));
        sessionStorage.setItem("token", "session_auth_token");
        if (onLoginSuccess) onLoginSuccess(nyBruger);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Kunne ikke oprette din profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-[0.2em] uppercase mb-2 text-[#1a1a1a]">Salon Royale</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-light text-center italic">Bliv medlem i dag</p>
        </div>
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] rounded-2xl border border-red-100 text-center font-bold italic">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="relative group"><User className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" /><input required placeholder="Fulde Navn" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent" onChange={(e) => setFormData({...formData, navn: e.target.value})} /></div>
          <div className="relative group"><Mail className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" /><input required type="email" placeholder="Din E-mail" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent" onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
          <div className="relative group"><Phone className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" /><input required placeholder="Telefonnummer" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent" onChange={(e) => setFormData({...formData, telefon: e.target.value})} /></div>
          <div className="relative group"><Lock className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" /><input required type="password" placeholder="Vælg Adgangskode" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent" onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
          <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all shadow-xl active:scale-[0.98]">{loading ? "Opretter..." : "Opret Profil & Start"}</button>
        </form>
        <div className="mt-10 text-center text-[10px] uppercase tracking-widest"><Link to="/login" className="text-gray-400 hover:text-amber-800 transition">Har du allerede en konto? <span className="font-black underline text-amber-800">Log ind her</span></Link></div>
      </div>
    </div>
  );
}