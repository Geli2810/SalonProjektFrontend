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
      // 1. Opret kunden i databasen
      const response = await axios.post(`${API_URL}/api/HairDresserSalon/customers`, {
        Navn: formData.navn,
        Email: formData.email,
        Telefon: formData.telefon,
        PasswordHash: formData.password // Vi sender rå password, din repo gemmer det
      });

      // Backenden returnerer det nye Kunde objekt (inkl. det nye KundeId)
      const nyBruger = response.data;

      if (nyBruger) {
        // 2. GEM I BROWSEREN (Så appen husker dig)
        localStorage.setItem("user", JSON.stringify(nyBruger));
        localStorage.setItem("token", "auth_token_success"); // Dummy token til sessionen

        // 3. OPDATER APP STATE (Låser ruterne op i App.jsx)
        if (onLoginSuccess) {
          onLoginSuccess(nyBruger);
        }

        // 4. HOP DIREKTE TIL DASHBOARD (Ingen omvej over login-siden!)
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Fejl ved oprettelse:", err);
      setError(err.response?.data?.message || "Kunne ikke oprette din profil. Prøv venligst igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-[0.2em] uppercase mb-2">Velkommen</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-light">Opret din profil og bestil tid med det samme</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] rounded-2xl border border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input required placeholder="Fulde Navn" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm" 
              onChange={(e) => setFormData({...formData, navn: e.target.value})} />
          </div>

          <div className="relative group">
            <Mail className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input required type="email" placeholder="Din E-mail" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative group">
            <Phone className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input required placeholder="Telefonnummer" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm" 
              onChange={(e) => setFormData({...formData, telefon: e.target.value})} />
          </div>

          <div className="relative group">
            <Lock className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input required type="password" placeholder="Vælg Adgangskode" className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
            {loading ? "Opretter..." : "Opret Profil & Start"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-10 text-center">
           <Link to="/login" className="text-[10px] text-gray-400 uppercase tracking-[0.2em] hover:text-amber-800 transition">
              Har du allerede en konto? <span className="font-black underline">Log ind her</span>
           </Link>
        </div>
      </div>
    </div>
  );
}