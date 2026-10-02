import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";
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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

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