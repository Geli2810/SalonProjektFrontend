import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Star } from 'lucide-react';

export default function RatingPopup({ kundeId, onClose }) {
  const [visible, setVisible] = useState(false);
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    if (!kundeId) {
      setLoading(false);
      return;
    }

    // Tjek om popup allerede er vist i denne session
    const popupShown = sessionStorage.getItem('ratingPopupShown');
    if (popupShown) {
      setLoading(false);
      return;
    }

    // Hent bookinger og tjek om der er en urateret
    axios.get(`${API_URL}/api/Booking/user/${kundeId}`)
      .then(res => {
        const bookings = res.data || [];
        
        // Find tidligere bookinger der IKKE er aflyst og IKKE ratet
        const unrated = bookings.find(b => {
          const isPast = new Date(b.startTid) < new Date();
          const notCancelled = b.status !== 'aflyst';
          const notRated = !b.rated; // Backend skal sende dette felt!
          return isPast && notCancelled && notRated;
        });

        if (unrated) {
          setBooking(unrated);
          setTimeout(() => setVisible(true), 500); // Delay for effekt
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [kundeId]);

  const handleRate = async (stars) => {
    if (!booking || submitted) return;
    setRating(stars);
    setSubmitted(true);

    try {
      await axios.post(`${API_URL}/api/Rating/create`, {
        bookingId: booking.bookingId,
        kundeId: kundeId,
        stjerner: stars,
        kommentar: "Ratet via popup"
      });

      // Gem at popup er vist
      sessionStorage.setItem('ratingPopupShown', 'true');
      
      // Luk efter 1.5 sekunder
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      console.error('Kunne ikke rate:', err);
      setSubmitted(false);
      setRating(0);
    }
  };

  if (loading || !booking || !visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)",
      animation: "fadeIn 0.3s ease"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={{
        background: "#111827",
        border: "1px solid rgba(55,138,221,0.2)",
        borderRadius: 24,
        padding: "40px 36px",
        maxWidth: 420,
        width: "90%",
        textAlign: "center",
        animation: "slideUp 0.4s ease",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
      }}>
        
        {/* Luk-knap */}
        <button
          onClick={() => {
            setVisible(false);
            sessionStorage.setItem('ratingPopupShown', 'true');
            if (onClose) onClose();
          }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.05)",
            border: "none",
            color: "rgba(232,237,245,0.5)",
            cursor: "pointer",
            padding: 6,
            borderRadius: "50%",
            display: "flex"
          }}
        >
          <X size={18} />
        </button>

        {/* Indhold */}
        <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
        
        <h2 style={{ 
          fontSize: 20, 
          fontWeight: 600, 
          color: "#e8edf5", 
          marginBottom: 8,
          letterSpacing: "0.02em"
        }}>
          Hvordan var din oplevelse?
        </h2>
        
        <p style={{ 
          fontSize: 13, 
          color: "rgba(232,237,245,0.5)", 
          marginBottom: 24,
          lineHeight: 1.6
        }}>
          Din tid hos os den {new Date(booking.startTid).toLocaleDateString('da-DK', { 
            day: 'numeric', 
            month: 'long' 
          })} — {booking.behandlingNavn || "Klipning"}
        </p>

        {/* Stjerner */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !submitted && setHover(star)}
              onMouseLeave={() => !submitted && setHover(0)}
              style={{
                fontSize: 42,
                cursor: submitted ? "default" : "pointer",
                color: star <= (hover || rating) ? "#fbbf24" : "rgba(255,255,255,0.2)",
                transition: "all 0.2s ease",
                transform: star <= (hover || rating) ? "scale(1.1)" : "scale(1)",
                filter: star <= (hover || rating) 
                  ? "drop-shadow(0 0 12px rgba(251,191,36,0.7))" 
                  : "none",
                animation: star <= rating && submitted 
                  ? `popIn 0.3s ease ${star * 0.1}s` 
                  : "none"
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Labels */}
        {!submitted && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {['Dårlig', 'OK', 'God', 'Super', 'WOW!'].map((label, i) => (
              <span key={i} style={{ 
                fontSize: 9, 
                color: hover === i + 1 ? "#fbbf24" : "rgba(232,237,245,0.2)", 
                width: 42, 
                textAlign: "center",
                transition: "color 0.2s ease"
              }}>
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Tak besked */}
        {submitted && (
          <div style={{ 
            marginTop: 12, 
            animation: "fadeIn 0.3s ease" 
          }}>
            <p style={{ 
              fontSize: 14, 
              color: "#5dcaa5", 
              fontWeight: 600 
            }}>
              Tak for din rating! ⭐
            </p>
          </div>
        )}
      </div>
    </div>
  );
}