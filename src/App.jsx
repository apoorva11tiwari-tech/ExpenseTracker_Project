import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
<<<<<<< HEAD
import Dashboard from "./Component/User/Dashboard";
=======
import Signup from "./SignUp";
import Dashboard from "./Component/User/Dashboard";
import Notification from "./Component/User/Notification";
import Analytics from "./Component/User/Analytics";


>>>>>>> 69a19593a8b32b84428127c7cea8d68ce57b6c9c

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

<<<<<<< HEAD
        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard />} />
=======
        {/* Sign Up page */}
        <Route path = "/signup" element ={<Signup/>} />

        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard/>}/>

        {/* Notification */}
        <Route path="/app/notification" element={<Notification/>}/>

        {/* Analytics */}
        <Route path="/app/analytics" element={<Analytics/>}/>
>>>>>>> 69a19593a8b32b84428127c7cea8d68ce57b6c9c

      </Routes>
    </BrowserRouter>
  );
}

export default App;