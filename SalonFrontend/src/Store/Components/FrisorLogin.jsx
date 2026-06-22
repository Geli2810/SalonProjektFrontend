import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FrisorLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post('https://salonproject.onrender.com/api/Auth/frisor-login', {
        Email: form.email,
        Password: form.password
      });

      const frisorData = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      sessionStorage.setItem("frisor", JSON.stringify({ ...frisorData, rolle: "frisor" }));

      if (onLoginSuccess) onLoginSuccess({ ...frisorData, rolle: "frisor" }, "frisor");
      navigate("/admin");
    } catch (e) {
      setError(e.response?.data ?? "Login fejlede.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Frisør Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Kodeord" onChange={handleChange} required />
      <button type="submit">Login</button>
      {error && <div style={{ color: 'red' }}>{typeof error === "object" ? JSON.stringify(error) : error}</div>}
    </form>
  );
}