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

import { Link } from "react-router-dom";

function Dashboard() {
  // Empty data for now
  const trendData = [];
  const categoryData = [];
  const transactions = [];
  const budgets = [];
  const goals = [];

  return (
    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}
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

          <Link to="/app/transactions" className="sidebar-link">
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

          <Link to="/app/notification" className="sidebar-link">
            <Bell size={20} />
            <span>Reminders</span>
          </Link>

        </nav>

        {/* User section */}
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

          <button className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}
      <main className="main-area">

        {/* Top Navbar */}
        <header className="top-navbar">

          <button className="mobile-menu-btn">
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


        {/* Dashboard Content */}
        <div className="dashboard-page">

          {/* Heading */}
          <div className="dashboard-header">

            <h1 className="dashboard-title">
              Dashboard 👋
            </h1>

            <p className="dashboard-subtitle">
              Manage and track your finances easily.
            </p>

          </div>


          {/* Welcome Message */}
          <div className="dashboard-message">

            <div className="message-icon">
              ✨
            </div>

            <div>
              <strong>Welcome to CashMate!</strong>

              <p>
                Start adding your income and expenses to see your
                financial summary here.
              </p>
            </div>

          </div>


          {/* Statistics */}
          <div className="row g-4 mt-1">

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card balance-card">

                <div className="stat-icon">
                  💰
                </div>

                <div className="stat-value">
                  ₹0
                </div>

                <div className="stat-title">
                  Total Balance
                </div>

                <div className="stat-subtitle">
                  Available balance
                </div>

              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card income-card">

                <div className="stat-icon">
                  📈
                </div>

                <div className="stat-value">
                  ₹0
                </div>

                <div className="stat-title">
                  Monthly Income
                </div>

                <div className="stat-subtitle">
                  This month
                </div>

              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card expense-card">

                <div className="stat-icon">
                  📉
                </div>

                <div className="stat-value">
                  ₹0
                </div>

                <div className="stat-title">
                  Total Expenses
                </div>

                <div className="stat-subtitle">
                  This month
                </div>

              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card budget-card">

                <div className="stat-icon">
                  🎯
                </div>

                <div className="stat-value">
                  ₹0
                </div>

                <div className="stat-title">
                  Budget Remaining
                </div>

                <div className="stat-subtitle">
                  Set your budget
                </div>

              </div>
            </div>

          </div>


          {/* Charts */}
          <div className="row g-4 mt-1">

            {/* Income vs Expenses */}
            <div className="col-12 col-lg-8">

              <div className="dashboard-card chart-card">

                <h5 className="card-heading">
                  Income vs Expenses
                </h5>

                <p className="dashboard-subtitle">
                  Your financial activity
                </p>

                {trendData.length === 0 ? (

                  <div className="empty-chart">
                    <div className="empty-icon">
                      📊
                    </div>

                    <h5>No financial data yet</h5>

                    <p>
                      Add income and expenses to see your chart.
                    </p>
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

                <h5 className="card-heading">
                  Categories
                </h5>

                <p className="dashboard-subtitle">
                  Expense distribution
                </p>

                {categoryData.length === 0 ? (

                  <div className="empty-chart">

                    <div className="empty-icon">
                      🥧
                    </div>

                    <h5>
                      No categories yet
                    </h5>

                    <p>
                      Add an expense to see categories.
                    </p>

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
                          <Cell key={index} />
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


          {/* Transactions */}
          <div className="dashboard-card mt-4">

            <h5 className="card-heading">
              Recent Transactions
            </h5>

            {transactions.length === 0 ? (

              <div className="empty-section">

                <div className="empty-icon">
                  💳
                </div>

                <h5>
                  No transactions yet
                </h5>

                <p>
                  Your recent transactions will appear here.
                </p>

              </div>

            ) : (

              transactions.map((transaction) => (
                <div key={transaction.id}>
                  {transaction.title}
                </div>
              ))

            )}

          </div>


          {/* Budgets and Goals */}
          <div className="row g-4 mt-1">

            <div className="col-12 col-lg-6">

              <div className="dashboard-card">

                <h5 className="card-heading">
                  Budgets
                </h5>

                {budgets.length === 0 && (
                  <div className="empty-section">

                    <div className="empty-icon">
                      💰
                    </div>

                    <h5>
                      No budgets yet
                    </h5>

                    <p>
                      Create a budget to start tracking your spending.
                    </p>

                  </div>
                )}

              </div>

            </div>


            <div className="col-12 col-lg-6">

              <div className="dashboard-card">

                <h5 className="card-heading">
                  Savings Goals
                </h5>

                {goals.length === 0 && (
                  <div className="empty-section">

                    <div className="empty-icon">
                      🎯
                    </div>

                    <h5>
                      No goals yet
                    </h5>

                    <p>
                      Create a savings goal to track your progress.
                    </p>

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

export default Dashboard;