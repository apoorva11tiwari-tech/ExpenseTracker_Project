import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/add-expense" element={<AddExpense />} />
        <Route path="/app/settings" element={<Settings />} />
        <Route path="/app/goals" element={<GoalSavings />} />
        <Route path="/app/expenses" element={<Expenses />} />
        <Route path="/app/analytics" element={<Analytics />} />
        <Route path="/app/aiinsights" element={<AIInsights />} />
        <Route path="/app/notification" element={<Notifications />} />
        <Route path="/app/reminders" element={<Reminders />} />
        <Route path="/app/budget" element={<Budget />} />
        <Route path="/app/userincome" element={<UserIncome />} />

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