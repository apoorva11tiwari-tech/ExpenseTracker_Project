import React, { useState } from 'react'
import './AuthenticationLogs.css'

export default function AuthenticationLogs({ logs = [] }) {
  const [filterType, setFilterType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const safeLogs = Array.isArray(logs) ? logs : []

  const filteredLogs = safeLogs.filter(log => {
    const matchesType = filterType === 'All' || log.event === filterType || log.result === filterType
    const matchesSearch = log.id ? log.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) : false
    return matchesType && matchesSearch
  })

  return (
    <div className="auth-logs-container">
      <h5 className="fw-bold text-white mb-3">Authentication Audit Logs</h5>

      <div className="row g-3 mb-4 align-items-center">
        <div className="col-12 col-md-5">
          <div className="input-group">
            <span className="input-group-text border-end-0 auth-logs-search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0 auth-logs-input" 
              placeholder="Search logs by User ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-3">
          <select 
            className="form-select auth-logs-select" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Log Types</option>
            <option value="User Login">User Login</option>
            <option value="Access Requested">Access Requested</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="auth-logs-table-wrapper">
        <div className="table-responsive">
          <table className="table table-dark align-middle mb-0 auth-logs-table">
            <thead>
              <tr>
                <th className="fw-semibold">USER ID</th>
                <th className="fw-semibold">EVENT</th>
                <th className="fw-semibold">AUTH METHOD</th>
                <th className="fw-semibold">DATE & TIME</th>
                <th className="fw-semibold text-end">RESULT</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-secondary">
                    No authentication logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td className="fw-bold text-white">
                      {log.id}
                    </td>
                    <td className="text-white-50">
                      {log.event}
                    </td>
                    <td>
                      <span className="badge bg-dark border text-white">{log.method}</span>
                    </td>
                    <td className="auth-logs-date">
                      {log.dateTime}
                    </td>
                    <td className="text-end">
                      <span className={`badge rounded-pill px-3 py-1 bg-${log.result === 'Success' ? 'success' : log.result === 'Pending' ? 'warning' : 'danger'}`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}