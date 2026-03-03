import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CustomerLogIn() {

  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [PasswordHash, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await axios.post(
      "https://salonproject.onrender.com/api/HairDresserSalon/login",
      {
        Email,
        PasswordHash
      }
    );

    console.log(response.data);

    navigate("/dashboard");

  } catch (error) {

    console.error("Login failed", error);
    alert("Forkert login");

  }
};

  return (
    <div>
      <h3>Log In</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={PasswordHash}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>
      </form>

    </div>
  );
}