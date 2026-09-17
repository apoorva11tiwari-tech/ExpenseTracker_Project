import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./LandingPage";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;