import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
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
  Plus,
  User
} from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase";
import "./userLayout.css";

const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/transactions", icon: Receipt, label: "Expenses" },
  { to: "/app/add-expense", icon: ArrowUpCircle, label: "Add Expense" },
  { to: "/app/budget", icon: PiggyBank, label: "Budget" },
  { to: "/app/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/app/savings", icon: Target, label: "Goals" },
  { to: "/app/ai-insights", icon: Brain, label: "AI Insights" },
  { to: "/app/reminders", icon: Lightbulb, label: "Reminders" },
  { to: "/app/notifications", icon: Bell, label: "Notifications" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="layout-container">
      {sidebarOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`sidebar-drawer ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-box">
            <div className="brand-logo-icon">💳</div>
            <div>
              <h6 className="brand-title">CashMate</h6>
              <small className="brand-subtitle">Secure Finance</small>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="close-sidebar-btn d-lg-none"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-item-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div
            onClick={(e) => {
              e.preventDefault();
              setSidebarOpen(false);
              navigate("/app/settings", { state: { activeTab: "profile" } });
            }}
            className="user-profile-card"
          >
            <div className="user-avatar-box">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="avatar-img" />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="user-info">
              <p className="user-name">
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || "My Account"}
              </p>
              <small className="user-email">
                {currentUser?.email || "user@example.com"}
              </small>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="main-wrapper">
        <header className="topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mobile-toggle-btn d-lg-none"
          >
            <Menu size={20} />
          </button>

          <div className="topbar-actions">
            <Link to="/app/add-expense" className="topbar-add-btn">
              <Plus size={16} /> Add Expense
            </Link>

            <Link to="/app/notifications" className="topbar-icon-btn">
              <Bell size={18} />
            </Link>

            <Link
              to="/app/settings"
              state={{ activeTab: "profile" }}
              className="topbar-avatar"
            >
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="avatar-img" />
              ) : (
                <User size={16} />
              )}
            </Link>
          </div>
        </header>

        <div className="main-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}