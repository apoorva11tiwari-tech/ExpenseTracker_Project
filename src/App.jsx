import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";

import Dashboard from "./Component/User/Dashboard";
import Notification from "./Component/User/Notification";
import Analytics from "./Component/User/Analytics";
import Reminders from "./Component/User/Reminders";
import Expenses from "./Component/User/Expenses";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/app/dashboard"
          element={<Dashboard />}
        />

        {/* Notifications */}
        <Route
          path="/app/notification"
          element={<Notification />}
        />

        {/* Analytics */}
        <Route
          path="/app/analytics"
          element={<Analytics />}
        />

        {/* Reminders */}
        <Route
          path="/app/reminders"
          element={<Reminders />}
        />

        {/* Expenses */}
        <Route
          path="/app/expenses"
          element={<Expenses />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;