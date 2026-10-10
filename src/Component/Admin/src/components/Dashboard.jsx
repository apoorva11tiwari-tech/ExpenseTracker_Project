
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardView({
  statsData = null,
  activityData = null,
}) {
  const [liveStats, setLiveStats] = useState(statsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        setError("Admin session missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load dashboard statistics."
          );
        }

        setLiveStats(data.stats || {});
        setError("");
      } catch (err) {
        setError(
          err.message || "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = {
    totalUsers: liveStats?.totalUsers ?? 0,
    pendingRequests: liveStats?.pendingRequests ?? 0,
    googleLoginUsers: liveStats?.googleLoginUsers ?? 0,
    emailLoginUsers: liveStats?.emailLoginUsers ?? 0,
    activeSessions: liveStats?.activeSessions ?? 0,
    blockedAccounts: liveStats?.blockedAccounts ?? 0,
    approvedAccounts: liveStats?.approvedAccounts ?? 0,
    deniedAccounts: liveStats?.deniedAccounts ?? 0,
  };

  const labels = activityData?.labels || [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Access Requests",
        data: activityData?.accessRequests || labels.map(() => 0),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Failed Logins",
        data: activityData?.failedLogins || labels.map(() => 0),
        borderColor: "#ef4444",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Logouts",
        data: activityData?.logouts || labels.map(() => 0),
        borderColor: "#10b981",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Successful Logins",
        data: activityData?.successfulLogins || labels.map(() => 0),
        borderColor: "#8b5cf6",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "#1e293b",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#64748b",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 10,
        ticks: {
          precision: 0,
          color: "#64748b",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  };

  const cardStyle = {
    backgroundColor: "#0f1523",
    border: "1px solid #1a2235",
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥" },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: "🔐",
    },
    {
      label: "Google Login Users",
      value: stats.googleLoginUsers,
      icon: "🔵",
    },
    {
      label: "Email Login Users",
      value: stats.emailLoginUsers,
      icon: "✉️",
    },
    {
      label: "Active Sessions",
      value: stats.activeSessions,
      icon: "🟢",
    },
    {
      label: "Blocked Accounts",
      value: stats.blockedAccounts,
      icon: "🚫",
    },
    {
      label: "Approved Accounts",
      value: stats.approvedAccounts,
      icon: "✅",
    },
    {
      label: "Denied Accounts",
      value: stats.deniedAccounts,
      icon: "❌",
    },
  ];

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#090d16",
        color: "#fff",
        borderRadius: "16px",
        minHeight: "400px",
      }}
    >
      {loading && (
        <div className="alert alert-info">
          Loading dashboard data from backend...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <strong>Dashboard Error:</strong> {error}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Dashboard Overview</h4>
          <small className="text-secondary">
            Live information from your backend
          </small>
        </div>

        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div
            className="col-12 col-sm-6 col-md-3"
            key={card.label}
          >
            <div
              className="p-3 rounded-4 h-100"
              style={cardStyle}
            >
              <div className="mb-2">{card.icon}</div>
              <h2 className="fw-bold mb-1">
                {loading ? "..." : card.value}
              </h2>
              <div className="text-secondary small">
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-4 rounded-4 mb-4"
        style={cardStyle}
      >
        <h6 className="fw-bold mb-1">
          Authentication Activity
        </h6>

        <small
          className="text-secondary d-block mb-3"
          style={{ fontSize: "0.8rem" }}
        >
          Activity chart · No personal financial data displayed
        </small>

        <div style={{ height: "300px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        <small className="text-secondary d-block mt-3">
          Authentication activity will populate when login, logout,
          and access-request events are recorded by the backend.
        </small>
      </div>

      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-2 text-secondary small pt-2"
        style={{ fontSize: "0.75rem" }}
      >
        <div>
          🔒 Admin console — personal expense records are not displayed.
        </div>
        <div>Expense Tracker Admin · 2026</div>
      </div>
    </div>
  );
}
