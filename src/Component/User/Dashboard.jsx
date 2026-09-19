import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCountUp } from "../../Hooks/useCountUp";
import { Settings as SettingsIcon } from "lucide-react";
import { Brain } from "lucide-react";
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

// =====================================================
// EMPTY DATA
// Later you can get this data from Firebase / MongoDB / API
// =====================================================

const trendData = [];
const categoryData = [];
const transactions = [];
const budgets = [];
const goals = [];

// =====================================================
// CHART COLORS
// =====================================================

const chartColors = [
  "#E85D2E",
  "#9B8AFB",
  "#6FCF97",
  "#F4A261",
  "#B8A9D9",
  "#A8B5C1",
];

// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard() {
  const navigate = useNavigate();

  // Animated statistics
  const balance = useCountUp(0);
  const income = useCountUp(0);
  const expenses = useCountUp(0);
  const budget = useCountUp(0);

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
          {/* Dashboard */}
          <Link to="/app/dashboard" className="sidebar-link active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* Expenses */}
          <Link to="/app/expenses" className="sidebar-link">
            <Receipt size={20} />
            <span>Expenses</span>
          </Link>

          {/* Add Expense */}
          <Link to="/app/add-expense" className="sidebar-link">
            <PlusCircle size={20} />
            <span>Add Expense</span>
          </Link>

          {/* Budget */}
          <Link to="/app/budget" className="sidebar-link">
            <WalletCards size={20} />
            <span>Budget</span>
          </Link>

          {/* Analytics */}
          <Link to="/app/analytics" className="sidebar-link">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>

          {/* Goals */}
          <Link to="/app/goals" className="sidebar-link">
            <Target size={20} />
            <span>Goals</span>
          </Link>

          {/* Reminders */}
          <Link to="/app/reminders" className="sidebar-link">
            <Bell size={20} />
            <span>Reminders</span>
          </Link>

          {/* Settings Link */}
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

          {/* Logout */}

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
          {/* Mobile Menu */}

          <button className="mobile-menu-btn" type="button">
            <Menu size={22} />
          </button>

          <div></div>

          {/* Top Actions */}

          <div className="top-actions">
            {/* Notifications */}

            <Link to="/app/reminders" className="top-icon">
              <BellRing size={21} />
            </Link>

            {/* Profile */}

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

            {/* Add Expense Button */}

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
                  ₹{balance.toLocaleString("en-IN")}
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
                  ₹{income.toLocaleString("en-IN")}
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
                  ₹{expenses.toLocaleString("en-IN")}
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
                  ₹{budget.toLocaleString("en-IN")}
                </div>

                <div className="stat-title">Budget Remaining</div>

                <div className="stat-subtitle">Set your budget</div>
              </div>
            </div>
          </div>

          {/* CHARTS */}

          <div className="row g-4 mt-1">
            {/* Income vs Expenses */}

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

            {/* Categories */}

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

          <div className="dashboard-card mt-4">
            <h5 className="card-heading">Recent Transactions</h5>

            {transactions.length === 0 ? (
              <div className="empty-section">
                <div className="empty-icon">💳</div>

                <h5>No transactions yet</h5>

                <p>Your recent transactions will appear here.</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  {transaction.title}
                </div>
              ))
            )}
          </div>

          {/* BUDGETS AND GOALS */}

          <div className="row g-4 mt-1">
            {/* Budgets */}

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

            {/* Savings Goals */}

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
