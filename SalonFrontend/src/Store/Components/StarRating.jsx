import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StarRating({ bookingId, kundeId, onRated }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    // Tjek om allerede ratet
    axios.get(`${API_URL}/api/Rating/booking/${bookingId}`)
      .then(res => {
        if (res.data && res.data.stjerner) {
          setRating(res.data.stjerner);
          setSubmitted(true);
        }
      })
      .catch(() => {});
  }, [bookingId]);

  const handleRate = async (stars) => {
    if (submitted) return;
    
    try {
      await axios.post(`${API_URL}/api/Rating/create`, {
        bookingId,
        kundeId,
        stjerner: stars,
        kommentar: null
      });
      setRating(stars);
      setSubmitted(true);
      if (onRated) onRated(stars);
    } catch (err) {
      console.error('Kunne ikke rate:', err);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => !submitted && setHover(star)}
          onMouseLeave={() => !submitted && setHover(0)}
          style={{
            fontSize: 20,
            cursor: submitted ? "default" : "pointer",
            color: star <= (hover || rating) ? "#fbbf24" : "rgba(255,255,255,0.2)",
            transition: "color 0.2s ease",
            filter: star <= (hover || rating) ? "drop-shadow(0 0 6px rgba(251,191,36,0.6))" : "none"
          }}
        >
          ★
        </span>
      ))}
      {submitted && (
        <span style={{ fontSize: 10, color: "#5dcaa5", marginLeft: 8, fontWeight: 600 }}>
          Tak!
        </span>
      )}
    </div>
  );
}