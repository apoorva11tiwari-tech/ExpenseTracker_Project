import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./Component/User/userLayout";

// Public Components
import Landing from "./LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";

// User Components
import Dashboard from "./Component/User/Dashboard";
import AddExpense from "./Component/User/AddExpense";
import Expenses from "./Component/User/Expenses";
import Settings from "./Component/User/Settings";
import GoalSavings from "./Component/User/GoalSavings";
import Analytics from "./Component/User/Analytics";
import AIInsights from "./Component/User/AIInsights";
import Notifications from "./Component/User/Notifications";
import Reminders from "./Component/User/Reminders";
import Budget from "./Component/User/Budget";
import UserIncome from "./Component/User/UserIncome";

// Admin Components (Agar aapne add kiye hain)
import AdminDashboard from "./Component/Admin/src/components/Dashboard";
import AdminUsers from "./Component/Admin/src/components/adminUsers"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User Dashboard Routes */}
        
{/* User Dashboard Routes */}
<Route path="/app" element={<UserLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="add-expense" element={<AddExpense />} />
  <Route path="settings" element={<Settings />} />
  <Route path="goals" element={<GoalSavings />} />
  <Route path="expenses" element={<Expenses />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="aiinsights" element={<AIInsights />} />
  <Route path="notification" element={<Notifications />} />
  <Route path="reminders" element={<Reminders />} />
  <Route path="budget" element={<Budget />} />
  <Route path="userincome" element={<UserIncome />} />
</Route>


        {/* Admin Routes (Agar aap build kar rahe hain) */}
        <Route path="/admin/src/components/dashboard" element={<Dashboard />} /> 
         <Route path="/admin /src/components/adminusers" element={<AdminUsers />} /> 

        {/* 404 Fallback Route */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h2>404 - Page Not Found</h2>
              <Link to="/" className="btn btn-primary mt-3">
                Go Home
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;