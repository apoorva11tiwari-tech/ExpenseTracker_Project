import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Landing from "./LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Component/User/Dashboard";
import AddExpense from "./Component/User/AddExpense";
import Expenses from "./Component/User/Expenses"
import { Wallet, DollarSign, PlusCircle } from "lucide-react";
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

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

       {/* SignUp page */}
        <Route path="/signup" element={<SignUp />} />

        {/* User Dashboard */}
        <Route path="/app/dashboard" element={<Dashboard />} />

        {/* Add Expense */}
        <Route path ="/app/add-expense" element={<AddExpense/>} />

        {/* settings */}
        <Route path="/app/settings" element={<Settings />} />

        {/* Goalsavings  */}
        <Route path="/app/goals" element={<GoalSavings />} />

        {/*Expenses  */}
        <Route path="/app/expenses" element={< Expenses />} />

        {/* Analytics */}
        <Route path="/app/analytics" element={< Analytics/>} />

        {/* AiInsights */}
        <Route path="/app/insights" element={<AIInsights/>}/>

        {/* Notification */}
        <Route path="/app/notification" element={<Notifications/>}/>

        {/* Reminders */}
        <Route path="/app/reminders" element={<Reminders/>}/>

        {/* Budget */}
        <Route path="/app/budget" element={<Budget/>}/>

        {/* User Income */}
        <Route path="/app/userincome" element={<UserIncome/>}/>
        




        <Route 
          path="*" 
          element={
            <div className="text-center mt-5">
              <h2>404 - Page Not Found</h2>
              <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;