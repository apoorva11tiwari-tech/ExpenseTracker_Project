import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
 
import Dashboard from "./Component/User/Dashboard";
import Settings from "./Component/User/Settings";
 
import Signup from "./SignUp";
 
 
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

 
        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard />} />
 
        {/* Sign Up page */}
        <Route path = "/signup" element ={<Signup/>} />

        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard/>}/>

        {/*user setting*/}
        <Route path="/app/settings" element={<Settings />} />

        {/* Notification */}
        <Route path="/app/notification" element={<Notification/>}/>

        {/* Analytics */}
        <Route path="/app/analytics" element={<Analytics/>}/>
 

      </Routes>
    </BrowserRouter>
  );
}

export default App;