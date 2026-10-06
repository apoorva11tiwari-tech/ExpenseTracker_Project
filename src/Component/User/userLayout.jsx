import React, { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

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
  User,
} from "lucide-react";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase";

import "./userLayout.css";

const navItems = [
  {
    to: "/app/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/app/transactions",
    icon: Receipt,
    label: "Expenses",
  },
  {
    to: "/app/add-expense",
    icon: ArrowUpCircle,
    label: "Add Expense",
  },
  {
    to: "/app/budget",
    icon: PiggyBank,
    label: "Budget",
  },
  {
    to: "/app/analytics",
    icon: BarChart2,
    label: "Analytics",
  },
  {
    to: "/app/savings",
    icon: Target,
    label: "Goals",
  },
  {
    to: "/app/ai-insights",
    icon: Brain,
    label: "AI Insights",
  },
  {
    to: "/app/reminders",
    icon: Lightbulb,
    label: "Reminders",
  },
  {
    to: "/app/notifications",
    icon: Bell,
    label: "Notifications",
  },
  {
    to: "/app/settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  const confirmLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setShowLogoutModal(false);
      navigate("/", { replace: true });
    }
  };

  /* Find current page title */
  const currentPage =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ||
    "Dashboard";

  return (
    <div className="layout-container">

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`sidebar-drawer ${sidebarOpen ? "show" : ""}`}
      >
        <div className="sidebar-header">

          <div className="brand-box">
            <div className="brand-logo-icon">💳</div>

            <div>
              <h6 className="brand-title">CashMate</h6>
              <small className="brand-subtitle">
                Secure Finance
              </small>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="close-sidebar-btn d-lg-none"
            type="button"
          >
            <X size={20} />
          </button>

        </div>

        {/* Sidebar Navigation */}
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

        {/* Sidebar Footer */}
        <div className="sidebar-footer">

          <div
            onClick={(e) => {
              e.preventDefault();
              setSidebarOpen(false);

              navigate("/app/settings", {
                state: { activeTab: "profile" },
              });
            }}
            className="user-profile-card"
          >
            <div className="user-avatar-box">

              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <User size={18} />
              )}

            </div>

            <div className="user-info">

              <p className="user-name">
                {currentUser?.displayName ||
                  currentUser?.email?.split("@")[0] ||
                  "My Account"}
              </p>

              <small className="user-email">
                {currentUser?.email || "user@example.com"}
              </small>

            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="logout-btn"
            type="button"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <main className="main-wrapper">

        {/* ================= TOP HEADER ================= */}
        <header className="topbar">

          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="mobile-toggle-btn d-lg-none"
            type="button"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* PAGE TITLE */}
          <div className="topbar-page-title">
            <h1>{currentPage}</h1>

            <span>
              Manage your finances with ease
            </span>
          </div>

          {/* TOP ACTIONS */}
          <div className="topbar-actions">

            {/* SINGLE ADD EXPENSE BUTTON */}
            <Link
              to="/app/add-expense"
              className="topbar-add-btn"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </Link>

            {/* Notifications */}
            <Link
              to="/app/notifications"
              className="topbar-icon-btn"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </Link>

            {/* Profile */}
            <Link
              to="/app/settings"
              state={{ activeTab: "profile" }}
              className="topbar-avatar"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <User size={16} />
              )}
            </Link>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}
        <div className="main-content-area">
          <Outlet />
        </div>

      </main>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="custom-logout-overlay">

          <div className="custom-logout-card">

            <h3 className="custom-logout-title">
              Log out?
            </h3>

            <p className="custom-logout-subtitle">
              Are you sure you want to log out of your CashMate
              account? You can log back in anytime to manage
              your expenses.
            </p>

            <div className="custom-logout-actions">

              <button
                type="button"
                className="custom-btn btn-logout-red"
                onClick={confirmLogout}
              >
                Log out
              </button>

              <button
                type="button"
                className="custom-btn btn-cancel-black"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}