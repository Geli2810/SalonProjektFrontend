import React, { useState } from 'react';
import axios from 'axios';

export default function SimpleStarClick() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);

  const handleClick = async (stars) => {
    setRating(stars);
    setDone(true);
    
    // Send til backend (lydløst - crasher ikke hvis fejler)
    try {
      await axios.post('https://salonproject.onrender.com/api/Rating/create', {
        bookingId: 75,  // placeholder
        kundeId: 14,     // placeholder
        stjerner: stars,
        kommentar: "Rating fra forsiden"
      });
    } catch (err) {
      console.log('Kunne ikke gemme rating:', err.message);
    }
  };

  if (done) {
    return (
      <div>
        <div style={{ fontSize: 40, marginBottom: 12 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ 
              color: s <= rating ? '#fbbf24' : 'rgba(255,255,255,0.2)',
              filter: s <= rating ? 'drop-shadow(0 0 6px rgba(251,191,36,0.6))' : 'none'
            }}>★</span>
          ))}
        </div>
        <p style={{ color: '#5dcaa5', fontSize: 13, fontWeight: 600 }}>Tak for din rating! ⭐</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              fontSize: 40,
              cursor: 'pointer',
              color: star <= (hover || rating) ? '#fbbf24' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.2s',
              transform: star <= (hover || rating) ? 'scale(1.2)' : 'scale(1)',
              filter: star <= (hover || rating) ? 'drop-shadow(0 0 10px rgba(251,191,36,0.7))' : 'none'
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p style={{ color: 'rgba(232,237,245,0.3)', fontSize: 11, marginTop: 12 }}>
        Klik på en stjerne for at rate os!
      </p>
    </div>
  );
}