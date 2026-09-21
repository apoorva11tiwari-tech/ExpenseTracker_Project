import { useState, useEffect } from "react";
import "./Dashboard.css"
import { useNavigate, Link } from "react-router-dom";
import { Settings as SettingsIcon, Brain } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  WalletCards,
  BarChart3,
  Target,
  Bell,
  LogOut,
  BellRing,
  User,
  Menu,
} from "lucide-react";

// CHART COLORS
const chartColors = [
  "#E85D2E",
  "#9B8AFB",
  "#6FCF97",
  "#F4A261",
  "#B8A9D9",
  "#A8B5C1",
];

export default function Dashboard() {
  const navigate = useNavigate();

  // Real MongoDB State
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  // Fetch Expenses and Income from Backend
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/expenses").then((res) => res.json()),
      fetch("http://localhost:5000/api/income").then((res) => res.json()),
    ])
      .then(([expenseData, incomeData]) => {
        setExpenses(Array.isArray(expenseData) ? expenseData : []);
        setIncomes(Array.isArray(incomeData) ? incomeData : []);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  // Calculate Real Statistics
  const totalIncome = incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const totalBalance = totalIncome - totalExpense;

  // Generate Category Chart Data from real expenses
  const categoryMap = expenses.reduce((acc, item) => {
    const cat = item.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const categoryData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  // Combine trend data if available
  const trendData = [];

  const budgets = [];
  const goals = [];

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">💳</div>
          <div>
            <h4>CashMate</h4>
            <small>Secure Finance</small>
          </div>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          <Link to="/app/dashboard" className="sidebar-link active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/app/expenses" className="sidebar-link">
            <Receipt size={20} />
            <span>Expenses</span>
          </Link>

          <Link to="/app/add-expense" className="sidebar-link">
            <PlusCircle size={20} />
            <span>Add Expense</span>
          </Link>

          <Link to="/app/budget" className="sidebar-link">
            <WalletCards size={20} />
            <span>Budget</span>
          </Link>

          <Link to="/app/analytics" className="sidebar-link">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>

          <Link to="/app/goals" className="sidebar-link">
            <Target size={20} />
            <span>Goals</span>
          </Link>

          <Link to="/app/reminders" className="sidebar-link">
            <Bell size={20} />
            <span>Reminders</span>
          </Link>

          <Link to="/app/settings" className="sidebar-link">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>

          <Link
            to="/app/insights"
            className="sidebar-link d-flex align-items-center gap-2 p-2 rounded text-decoration-none"
          >
            <Brain size={20} />
            <span>AI Insights</span>
          </Link>
        </nav>

        {/* User Section */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-icon">
              <User size={20} />
            </div>

            <div>
              <strong>User</strong>
              <small>My Account</small>
            </div>
          </div>

          <button className="logout-btn" type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">
        {/* TOP NAVBAR */}
        <header className="top-navbar">
          <button className="mobile-menu-btn" type="button">
            <Menu size={22} />
          </button>

          <div></div>

          <div className="top-actions">
            <Link to="/app/notification" className="top-icon">
              <BellRing size={21} />
            </Link>

            <Link to="/app/profile" className="profile-icon">
              <User size={20} />
            </Link>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-page">
          {/* DASHBOARD HEADER */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Dashboard 👋</h1>
              <p className="dashboard-subtitle">
                Manage and track your finances easily.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary add-expense-btn"
              onClick={() => navigate("/app/add-expense")}
            >
              <PlusCircle size={18} />
              Add Expense
            </button>
          </div>

          {/* WELCOME MESSAGE */}
          <div className="dashboard-message">
            <div className="message-icon">✨</div>

            <div>
              <strong>Welcome to CashMate!</strong>
              <p>
                Start adding your income and expenses to see your financial
                summary here.
              </p>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="row g-4 mt-1">
            {/* Total Balance */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card balance-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">
                  ₹{totalBalance.toLocaleString("en-IN")}
                </div>
                <div className="stat-title">Total Balance</div>
                <div className="stat-subtitle">Available balance</div>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card income-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </div>
                <div className="stat-title">Monthly Income</div>
                <div className="stat-subtitle">This month</div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card expense-card">
                <div className="stat-icon">📉</div>
                <div className="stat-value">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </div>
                <div className="stat-title">Total Expenses</div>
                <div className="stat-subtitle">This month</div>
              </div>
            </div>

            {/* Budget Remaining */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card budget-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">
                  ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
                </div>
                <div className="stat-title">Budget Remaining</div>
                <div className="stat-subtitle">Set your budget</div>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="row g-4 mt-1">
            {/* Income vs Expenses Chart */}
            <div className="col-12 col-lg-8">
              <div className="dashboard-card chart-card">
                <h5 className="card-heading">Income vs Expenses</h5>
                <p className="dashboard-subtitle">Your financial activity</p>

                {trendData.length === 0 ? (
                  <div className="empty-chart">
                    <div className="empty-icon">📊</div>
                    <h5>No financial data yet</h5>
                    <p>Add income and expenses to see your chart.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        fill="var(--mint)"
                        stroke="var(--mint)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        fill="var(--coral)"
                        stroke="var(--coral)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Categories Pie Chart */}
            <div className="col-12 col-lg-4">
              <div className="dashboard-card chart-card">
                <h5 className="card-heading">Categories</h5>
                <p className="dashboard-subtitle">Expense distribution</p>

                {categoryData.length === 0 ? (
                  <div className="empty-chart">
                    <div className="empty-icon">🥧</div>
                    <h5>No categories yet</h5>
                    <p>Add an expense to see categories.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS */}
          {/* RECENT TRANSACTIONS */}
<div className="dashboard-card mt-4">
  <div className="card-heading d-flex justify-content-between align-items-center mb-3">
    <div>
      <h5>Recent Transactions</h5>
      <p className="dashboard-subtitle mb-0">Sorted from newest to oldest</p>
    </div>
    <Link to="/app/expenses" className="view-link">
      View All →
    </Link>
  </div>

  {expenses.length === 0 ? (
    <div className="empty-section">
      <div className="empty-icon">💳</div>
      <h5>No transactions yet</h5>
      <p>Your recent transactions will appear here.</p>
    </div>
  ) : (
    expenses
      // Sort by date descending (newest first)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((item) => {
        // Category color & icon mapping
        const categoryKey = (item.category || "other").toLowerCase();
        
        let categoryClass = "cat-other";
        let icon = "🛍️";

        if (categoryKey.includes("food") || categoryKey.includes("dining")) {
          categoryClass = "cat-food";
          icon = "🍔";
        } else if (categoryKey.includes("shop") || categoryKey.includes("store")) {
          categoryClass = "cat-shopping";
          icon = "🛍️";
        } else if (categoryKey.includes("travel") || categoryKey.includes("transport")) {
          categoryClass = "cat-travel";
          icon = "✈️";
        } else if (categoryKey.includes("bill") || categoryKey.includes("utility")) {
          categoryClass = "cat-bills";
          icon = "⚡";
        }

        return (
          <div key={item._id} className={`transaction-item ${categoryClass}`}>
            <div className={`transaction-icon-box ${categoryClass}`}>
              {icon}
            </div>
            <div className="transaction-info">
              <h6>{item.title}</h6>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className={`category-tag ${categoryClass}`}>
                  {item.category || "General"}
                </span>
                <small className="text-muted">
                  • {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </small>
              </div>
            </div>
            <div className="expense-text fw-bold">
              -₹{Math.abs(item.amount).toLocaleString("en-IN")}
            </div>
          </div>
        );
      })
  )}
</div>

          {/* BUDGETS AND GOALS */}
          <div className="row g-4 mt-1">
            <div className="col-12 col-lg-6">
              <div className="dashboard-card">
                <h5 className="card-heading">Budgets</h5>
                {budgets.length === 0 && (
                  <div className="empty-section">
                    <div className="empty-icon">💰</div>
                    <h5>No budgets yet</h5>
                    <p>Create a budget to start tracking your spending.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="dashboard-card">
                <h5 className="card-heading">Savings Goals</h5>
                {goals.length === 0 && (
                  <div className="empty-section">
                    <div className="empty-icon">🎯</div>
                    <h5>No goals yet</h5>
                    <p>Create a savings goal to track your progress.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}