import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DashboardView({ statsData = null, activityData = null }) {
  const stats = statsData || {
    totalUsers: 0,
    pendingRequests: 0,
    googleLoginUsers: 0,
    emailLoginUsers: 0,
    activeSessions: 0,
    blockedAccounts: 0,
    approvedAccounts: 0,
    deniedAccounts: 0
  }

  const chartData = {
    labels: activityData?.labels || ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
      {
        label: 'Access Requests',
        data: activityData?.accessRequests || [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      },
      {
        label: 'Failed Logins',
        data: activityData?.failedLogins || [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      },
      {
        label: 'Logouts',
        data: activityData?.logouts || [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      },
      {
        label: 'Successful Logins',
        data: activityData?.successfulLogins || [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          boxWidth: 8,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, color: '#64748b' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#090d16', color: '#fff' }} className="p-3">
      {/* Top 4 Stat Cards */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <h2 className="fw-bold mb-1">{stats.totalUsers}</h2>
            <div className="text-secondary small">Total Users</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <h2 className="fw-bold mb-1">{stats.pendingRequests}</h2>
            <div className="text-secondary small">Pending Requests</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <h2 className="fw-bold mb-1">{stats.googleLoginUsers}</h2>
            <div className="text-secondary small">Google Login Users</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <h2 className="fw-bold mb-1">{stats.emailLoginUsers}</h2>
            <div className="text-secondary small">Email Login Users</div>
          </div>
        </div>
      </div>

      {/* Bottom 4 Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <div className="mb-2" style={{ color: '#22c55e' }}>●</div>
            <h2 className="fw-bold mb-1">{stats.activeSessions}</h2>
            <div className="text-secondary small">Active Sessions</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <div className="mb-2" style={{ color: '#ef4444' }}>🚫</div>
            <h2 className="fw-bold mb-1">{stats.blockedAccounts}</h2>
            <div className="text-secondary small">Blocked Accounts</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <div className="mb-2" style={{ color: '#22c55e' }}>✅</div>
            <h2 className="fw-bold mb-1">{stats.approvedAccounts}</h2>
            <div className="text-secondary small">Approved Accounts</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <div className="mb-2" style={{ color: '#ef4444' }}>❌</div>
            <h2 className="fw-bold mb-1">{stats.deniedAccounts}</h2>
            <div className="text-secondary small">Denied Accounts</div>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
        <h6 className="fw-bold mb-0">Authentication Activity</h6>
        <small className="text-secondary d-block mb-3" style={{ fontSize: '0.8rem' }}>Today · No personal data displayed</small>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center text-secondary small pt-2" style={{ fontSize: '0.75rem' }}>
        <div>🔒 No personal user data is accessible from this console.</div>
        <div>Expense Tracker Admin · 2026</div>
      </div>
    </div>
  )
}