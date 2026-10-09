
import React, { useState } from "react";
import "./App.css";

// Admin Login
import AdminLogin from "./components/AdminLogin";

// Admin Pages
import Dashboard from "./components/Dashboard";
import LoginRequests from "./components/LoginRequests";
import ActiveSessions from "./components/ActiveSessions";
import AccessManagement from "./components/AccessManagement";
import AuthenticationLogs from "./components/AuthenticationLogs";
import SecuritySettings from "./components/SecuritySettings";
import WebsiteTheme from "./components/WebsiteTheme";
import AdminProfile from "./components/AdminProfile";

export default function App() {
  // =========================
  // ADMIN LOGIN
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =========================
  // ACTIVE PAGE
  // =========================

  const [activeTab, setActiveTab] = useState("dashboard");

  // =========================
  // EMPTY DATA
  // =========================

  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [logs, setLogs] = useState([]);

  // =========================
  // ACTION HANDLER
  // =========================

  const handleActionTrigger = (
    title,
    message,
    confirmText,
    btnClass,
    userId,
    actionType
  ) => {
    const confirmed = window.confirm(`${title}\n\n${message}`);

    if (!confirmed) {
      return;
    }

    // Approve user
    if (actionType === "Approve" && userId) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: "Approved",
                activeState: "Active",
              }
            : user
        )
      );
    }

    // Deny user
    else if (actionType === "Deny" && userId) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: "Denied",
              }
            : user
        )
      );
    }

    // Logout particular user
    else if (actionType === "LogoutUser" && userId) {
      setSessions((prev) =>
        prev.filter((session) => session.id !== userId)
      );
    }

    // Logout all users
    else if (actionType === "LogoutAll") {
      setSessions([]);
    }
  };

  // =========================
  // SIDEBAR STYLE
  // =========================

  const buttonStyle = (tabName) => ({
    backgroundColor:
      activeTab === tabName
        ? "#4F46E5"
        : "transparent",

    color:
      activeTab === tabName
        ? "#FFFFFF"
        : "#CBD5E1",

    border:
      activeTab === tabName
        ? "1px solid #6366F1"
        : "1px solid transparent",

    borderRadius: "10px",

    padding: "10px 14px",

    width: "100%",

    textAlign: "left",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    fontSize: "0.875rem",

    fontWeight: "500",

    cursor: "pointer",

    transition: "all 0.2s",
  });

  // =========================
  // PAGE RENDER
  // =========================

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            users={users}
            sessions={sessions}
            logs={logs}
            onActionTrigger={handleActionTrigger}
          />
        );

      case "requests":
        return (
          <LoginRequests
            users={users}
            onActionTrigger={handleActionTrigger}
          />
        );

      case "sessions":
        return (
          <ActiveSessions
            sessions={sessions}
            onActionTrigger={handleActionTrigger}
          />
        );

      case "access":
        return (
          <AccessManagement
            users={users}
            onActionTrigger={handleActionTrigger}
          />
        );

      case "logs":
        return (
          <AuthenticationLogs
            logs={logs}
          />
        );

      case "security":
        return (
          <SecuritySettings
            onActionTrigger={handleActionTrigger}
          />
        );

      case "theme":
        return (
          <WebsiteTheme
            onActionTrigger={handleActionTrigger}
          />
        );

      case "profile":
        return (
          <AdminProfile
            onActionTrigger={handleActionTrigger}
          />
        );

      default:
        return (
          <Dashboard
            users={users}
            sessions={sessions}
            logs={logs}
            onActionTrigger={handleActionTrigger}
          />
        );
    }
  };

  // =========================
  // ADMIN LOGIN SCREEN
  // =========================

  if (!isLoggedIn) {
    return (
      <AdminLogin
        onLogin={() => {
          setIsLoggedIn(true);
        }}
      />
    );
  }

  // =========================
  // ADMIN PANEL
  // =========================

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        backgroundColor: "#F8FAFC",
      }}
    >

      {/* ================= SIDEBAR ================= */}

      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          backgroundColor: "#111827",
          padding: "20px",
          flexShrink: 0,
          boxShadow: "4px 0 15px rgba(15, 23, 42, 0.08)",
        }}
      >

        {/* Logo */}

        <div
          style={{
            color: "#FFFFFF",
            fontSize: "1.2rem",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          💰 Expense Tracker

          <div
            style={{
              color: "#94A3B8",
              fontSize: "0.75rem",
              marginTop: "4px",
            }}
          >
            Admin Panel
          </div>
        </div>

        {/* Navigation */}

        <div className="d-flex flex-column gap-2">

          {/* Dashboard */}

          <button
            style={buttonStyle("dashboard")}
            onClick={() => setActiveTab("dashboard")}
          >
            📊
            <span>Dashboard</span>
          </button>

          {/* Login Requests */}

          <button
            style={buttonStyle("requests")}
            onClick={() => setActiveTab("requests")}
          >
            🔐
            <span>Login Requests</span>
          </button>

          {/* Active Sessions */}

          <button
            style={buttonStyle("sessions")}
            onClick={() => setActiveTab("sessions")}
          >
            👥
            <span>Active Sessions</span>
          </button>

          {/* Access Management */}

          <button
            style={buttonStyle("access")}
            onClick={() => setActiveTab("access")}
          >
            🔑
            <span>Access Management</span>
          </button>

          {/* Authentication Logs */}

          <button
            style={buttonStyle("logs")}
            onClick={() => setActiveTab("logs")}
          >
            📋
            <span>Authentication Logs</span>
          </button>

          {/* Security Settings */}

          <button
            style={buttonStyle("security")}
            onClick={() => setActiveTab("security")}
          >
            🛡️
            <span>Security Settings</span>
          </button>

          {/* Website Theme */}

          <button
            style={buttonStyle("theme")}
            onClick={() => setActiveTab("theme")}
          >
            🎨
            <span>Website Theme</span>
          </button>

          {/* Admin Profile */}

          <button
            style={buttonStyle("profile")}
            onClick={() => setActiveTab("profile")}
          >
            👤
            <span>Admin Profile</span>
          </button>

        </div>

        {/* ================= LOGOUT ================= */}

        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #334155",
          }}
        >
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setActiveTab("dashboard");
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #EF4444",
              backgroundColor: "transparent",
              color: "#FCA5A5",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main
        className="flex-grow-1"
        style={{
          minWidth: 0,
          padding: "30px",
          backgroundColor: "#F8FAFC",
        }}
      >

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#0F172A",
              }}
            >
              Admin Panel
            </h2>

            <p
              className="mb-0"
              style={{
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              Manage your Expense Tracker website
            </p>
          </div>

          {/* Current Page */}

          <div
            style={{
              backgroundColor: "#211466",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#e3e3e9",
              textTransform: "capitalize",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            {activeTab}
          </div>

        </div>

        {/* Active Page */}

        {renderActiveComponent()}

      </main>

    </div>
  );
}       