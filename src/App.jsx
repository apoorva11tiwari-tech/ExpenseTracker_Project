import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";
import Dashboard from "./Component/User/Dashboard";
import Notification from "./Component/User/Notification";
import Analytics from "./Component/User/Analytics";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Sign Up page */}
        <Route path = "/signup" element ={<Signup/>} />

        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard/>}/>

        {/* Notification */}
        <Route path="/app/notification" element={<Notification/>}/>

        {/* Analytics */}
        <Route path="/app/analytics" element={<Analytics/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;