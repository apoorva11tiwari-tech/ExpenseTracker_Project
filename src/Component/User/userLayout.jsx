import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  ArrowUpCircle,
  PiggyBank,
  BarChart2,
  Target,
  Brain,
  Lightbulb,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus
} from "lucide-react";
import "./UserLayout.css";

const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/transactions", icon: Receipt, label: "Expenses" },
  { to: "/app/add-expense", icon: ArrowUpCircle, label: "Add Expense" },
  { to: "/app/budget", icon: PiggyBank, label: "Budget" },
  { to: "/app/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/app/savings", icon: Target, label: "Goals" },
  { to: "/app/ai-insights", icon: Brain, label: "AI Insights", badge: 4 },
  { to: "/app/insights", icon: Lightbulb, label: "Reminders", badge: 3 },
  { to: "/app/notifications", icon: Bell, label: "Notifications", badge: 2 },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="layout-container">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`sidebar-drawer ${sidebarOpen ? "show" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-between px-3">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-logo-icon">💳</div>
            <div>
              <h6 className="fw-bold text-white mb-0">CashMate</h6>
              <small className="text-muted">Secure Finance</small>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-sm text-white-50 d-lg-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav px-2 py-3">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-item-link d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-decoration-none ${
                  isActive ? "active" : ""
                }`
              }
            >
              <div className="d-flex align-items-center gap-3">
                <Icon size={18} />
                <span className="small font-weight-medium">{label}</span>
              </div>
              {badge && <span className="badge bg-danger rounded-pill">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer p-3 border-top border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="user-avatar">👩</div>
            <div className="overflow-hidden">
              <p className="text-white small fw-bold mb-0 text-truncate">Priya Sharma</p>
              <small className="text-muted d-block text-truncate">priya@example.com</small>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="topbar d-flex align-items-center justify-content-between px-3 bg-white border-bottom">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-light d-lg-none border-0"
          >
            <Menu size={20} />
          </button>

          <div className="ms-auto d-flex align-items-center gap-3">
            <NavLink
              to="/app/add-expense"
              className="btn btn-primary btn-sm rounded-pill d-none d-sm-flex align-items-center gap-1 px-3"
            >
              <Plus size={16} /> Add Expense
            </NavLink>

            <NavLink to="/app/notifications" className="btn btn-light rounded-circle p-2 position-relative">
              <Bell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </NavLink>

            <div className="user-avatar small">👩</div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="main-content p-3 p-md-4">
          <Outlet />
        </main>

        {/* Floating Add Expense Button for Mobile */}
        <NavLink
          to="/app/add-expense"
          className="fab-btn d-sm-none btn btn-primary rounded-circle shadow-lg"
        >
          <Plus size={24} />
        </NavLink>
      </div>
    </div>
  );
}