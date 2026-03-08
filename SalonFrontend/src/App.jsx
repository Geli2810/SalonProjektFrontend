import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";
import BookingPage from "./Store/Components/BookingView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;