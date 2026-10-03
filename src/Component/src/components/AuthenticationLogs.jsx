import React, { useState } from 'react'
import './AuthenticationLogs.css'

export default function AuthenticationLogs({ logs = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const safeLogs = Array.isArray(logs) ? logs : []

  const filteredLogs = safeLogs.filter((log) => {
    if (!log) return false

    const userId = log.userId || log.id || ''
    const method = log.method || log.authMethod || ''
    const status = log.status || log.result || ''

    const matchesSearch = userId
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())

    const matchesMethod =
      methodFilter === 'All' ||
      method.toString().toLowerCase() === methodFilter.toLowerCase()

    const matchesStatus =
      statusFilter === 'All' ||
      status.toString().toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesMethod && matchesStatus
  })

  return (
    <div className="authentication-logs">

      <h2>Authentication Logs</h2>

      <div className="filters">

        <input
          type="text"
          placeholder="Search by User ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="All">All Methods</option>
          <option value="Google">Google</option>
          <option value="Email">Email</option>
          <option value="Password">Password</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>

      </div>

      <div className="logs-container">

        {filteredLogs.length === 0 ? (
          <p>No authentication logs found.</p>
        ) : (
          filteredLogs.map((log, index) => (
            <div className="log-item" key={log.id || index}>

              <div>
                <strong>
                  {log.userId || log.id || 'Unknown User'}
                </strong>
              </div>

              <div>
                Method: {log.method || log.authMethod || 'N/A'}
              </div>

              <div>
                Status: {log.status || log.result || 'N/A'}
              </div>

              <div>
                {log.date || log.time || log.timestamp || ''}
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}