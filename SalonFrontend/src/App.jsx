import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Store/Components/CustomerLogIn";
import Dashboard from "./Store/Components/CustomerDash";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;