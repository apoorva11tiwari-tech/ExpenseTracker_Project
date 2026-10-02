import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";

// Layout
import UserLayout from "./Component/User/userLayout";

// Components
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/*              PUBLIC ROUTES                 */}
        {/* ========================================== */}

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* SignUp page */}
        <Route path="/signup" element={<SignUp />} />

        {/* ========================================== */}
        {/*             PROTECTED ROUTES               */}
        {/* ========================================== */}

        <Route path="/app" element={<UserLayout />}>
          {/* User Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Add Expense */}
          <Route path="add-expense" element={<AddExpense />} />

          {/* settings */}
          <Route path="settings" element={<Settings />} />

          {/* Goalsavings */}
          <Route path="goals" element={<GoalSavings />} />
          <Route path="savings" element={<GoalSavings />} />

          {/* Expenses */}
          <Route path="expenses" element={<Expenses />} />
          <Route path="transactions" element={<Expenses />} />

          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />

          {/* AiInsights */}
          <Route path="insights" element={<AIInsights />} />
          <Route path="ai-insights" element={<AIInsights />} />

          {/* Notification */}
          <Route path="notification" element={<Notifications />} />
          <Route path="notifications" element={<Notifications />} />

          {/* Reminders */}
          <Route path="reminders" element={<Reminders />} />

          {/* Budget */}
          <Route path="budget" element={<Budget />} />

          {/* User Income */}
          <Route path="userincome" element={<UserIncome />} />
        </Route>

        {/* ========================================== */}
        {/*               FALLBACK ROUTE               */}
        {/* ========================================== */}

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