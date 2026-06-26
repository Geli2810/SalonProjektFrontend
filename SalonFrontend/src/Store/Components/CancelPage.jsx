import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [cancelling, setCancelling] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const API_URL = "https://salonproject.onrender.com";

  useEffect(() => {
    if (!email) {
      setError('Ingen email angivet');
      setLoading(false);
      return;
    }

    axios.get(`${API_URL}/api/Booking/by-email/${encodeURIComponent(email)}`)
      .then(res => {
        setBookings(res.data.filter(b => 
          new Date(b.startTid) > new Date() && b.status !== 'aflyst'
        ));
        setLoading(false);
      })
      .catch(() => {
        setError('Kunne ikke finde bookinger');
        setLoading(false);
      });
  }, [email]);

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId);
    try {
      await axios.put(`${API_URL}/api/Booking/cancel-by-link/${bookingId}?token=${token}`);
      setResult({ success: true, message: 'Tiden er aflyst! ✓' });
      setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
    } catch (err) {
      setResult({ 
        success: false, 
        message: err.response?.data?.message || 'Kunne ikke aflyse' 
      });
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size={32} color="#378add" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", color: "#e8edf5", fontFamily: "'Segoe UI', Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(55,138,221,0.12)", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Aflys din tid</h1>
          <p style={{ fontSize: 12, color: "rgba(232,237,245,0.4)", marginBottom: 24 }}>{email}</p>

          {error && <div style={{ color: "#fca5a5", marginBottom: 20, fontSize: 13 }}>{error}</div>}

          {result && (
            <div style={{ background: result.success ? "rgba(15,110,86,0.1)" : "rgba(220,38,38,0.1)", border: `1px solid ${result.success ? "rgba(93,202,165,0.2)" : "rgba(220,38,38,0.2)"}`, borderRadius: 12, padding: "16px", marginBottom: 24, color: result.success ? "#5dcaa5" : "#fca5a5", fontSize: 13 }}>
              {result.message}
            </div>
          )}

          {bookings.length === 0 && !result && (
            <p style={{ color: "rgba(232,237,245,0.5)", fontSize: 13 }}>Ingen kommende bookinger fundet.</p>
          )}

          {bookings.map(b => (
            <div key={b.bookingId} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(55,138,221,0.08)", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>{b.behandlingNavn || "Behandling"}</p>
              <p style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", marginBottom: 12 }}>
                {new Date(b.startTid).toLocaleString('da-DK', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
              <button onClick={() => handleCancel(b.bookingId)} disabled={cancelling === b.bookingId}
                style={{ background: cancelling === b.bookingId ? "rgba(220,38,38,0.2)" : "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", padding: "10px 24px", borderRadius: 8, cursor: cancelling === b.bookingId ? "wait" : "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cancelling === b.bookingId ? "Aflyser..." : "Aflys denne tid"}
              </button>
            </div>
          ))}

          <Link to="/" style={{ display: "inline-block", marginTop: 24, color: "#378add", fontSize: 12, textDecoration: "none" }}>
            ← Tilbage til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}