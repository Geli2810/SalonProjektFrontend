import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 
import { User, Lock, ArrowRight } from "lucide-react";

export default function CustomerLogIn({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://salonproject.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/HairDresserSalon/login`, {
        Email: email,
        PasswordHash: password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      if (userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", token);
        if (onLoginSuccess) onLoginSuccess(userData);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login fejlede", err);
      setError(err.response?.data?.message || "Forkert e-mail eller adgangskode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-[0.2em] uppercase mb-2 text-[#1a1a1a]">Salon Royale</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-light italic text-center">Log ind på din profil</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] rounded-2xl border border-red-100 text-center font-bold italic animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input
              type="email"
              placeholder="Din E-mail"
              className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-0 top-3 w-4 h-4 text-gray-300 group-focus-within:text-amber-800 transition-colors" />
            <input
              type="password"
              placeholder="Din Adgangskode"
              className="w-full border-b border-gray-200 py-3 pl-8 outline-none focus:border-amber-800 transition bg-transparent text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* HER ER FIXET: justify-center og gap-3 sørger for at pilen følger teksten */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.4em] font-black hover:bg-amber-900 transition-all flex items-center justify-center gap-3 group disabled:bg-gray-300 shadow-xl active:scale-[0.98] shadow-amber-900/5"
          >
            <span>{loading ? "Logger ind..." : "Log Ind"}</span>
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Mangler du en konto? <Link to="/register" className="text-amber-800 font-black hover:underline transition-all">Opret her</Link>
          </p>
          <button 
            onClick={() => navigate("/")} 
            className="text-[9px] text-gray-300 uppercase tracking-widest hover:text-gray-600 transition"
          >
            Tilbage til forsiden
          </button>
        </div>
      </div>
    </div>
  );
}