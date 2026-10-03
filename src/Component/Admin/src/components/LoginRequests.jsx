import React, { useState } from 'react'

export default function LoginRequests({ requestsData = null, onApprove, onDeny }) {
  const [filter, setFilter] = useState('All')

  // Default empty state (Removed dummy data)
  const initialRequests = requestsData || []

  const [requests, setRequests] = useState(initialRequests)

  const handleApprove = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id))
    if (onApprove) onApprove(id)
  }

  const handleDeny = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id))
    if (onDeny) onDeny(id)
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'Google') return req.method === 'Google'
    if (filter === 'Email') return req.method === 'Email'
    return true
  })

  return (
    <div style={{ backgroundColor: '#090d16', minHeight: '85vh', color: '#fff' }} className="p-3 d-flex flex-column justify-content-between">
      <div>
        {/* Header & Filter Row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>Login Requests</h3>
            <span style={{ color: '#60a5fa', fontSize: '0.9rem' }}>
              {requests.length} pending approval
            </span>
          </div>

          {/* Filter Pills */}
          <div className="d-flex gap-1 bg-dark-subtle p-1 rounded-3" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
            <button
              type="button"
              className={`btn btn-sm px-3 border-0 rounded-2 fw-semibold ${filter === 'All' ? 'btn-primary text-white' : 'text-secondary'}`}
              style={{ fontSize: '0.8rem', backgroundColor: filter === 'All' ? '#2563eb' : 'transparent' }}
              onClick={() => setFilter('All')}
            >
              All
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 border-0 rounded-2 fw-semibold ${filter === 'Google' ? 'btn-primary text-white' : 'text-secondary'}`}
              style={{ fontSize: '0.8rem', backgroundColor: filter === 'Google' ? '#2563eb' : 'transparent' }}
              onClick={() => setFilter('Google')}
            >
              Google
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 border-0 rounded-2 fw-semibold ${filter === 'Email' ? 'btn-primary text-white' : 'text-secondary'}`}
              style={{ fontSize: '0.8rem', backgroundColor: filter === 'Email' ? '#2563eb' : 'transparent' }}
              onClick={() => setFilter('Email')}
            >
              Email
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-4 overflow-hidden" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a2235' }}>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>USER ID</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>AUTH METHOD</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>REQUEST DATE</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>STATUS</th>
                  <th className="py-3 px-4 text-secondary fw-semibold text-center" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-secondary" style={{ backgroundColor: '#0f1523' }}>
                      No pending login requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #1a2235' }}>
                      <td className="py-3 px-4 fw-bold text-white" style={{ backgroundColor: '#0f1523' }}>
                        {req.id}
                      </td>
                      <td className="py-3 px-4" style={{ backgroundColor: '#0f1523' }}>
                        <span 
                          className="badge rounded-pill px-3 py-2 fw-normal d-inline-flex align-items-center gap-1"
                          style={{ backgroundColor: '#1e293b', color: '#60a5fa', fontSize: '0.8rem', border: '1px solid #334155' }}
                        >
                          {req.method === 'Google' ? (
                            <>
                              <i className="bi bi-google me-1" style={{ fontSize: '0.75rem', color: '#38bdf8' }}></i>
                              <span style={{ color: '#38bdf8' }}>Google</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-envelope me-1" style={{ fontSize: '0.75rem', color: '#c084fc' }}></i>
                              <span style={{ color: '#c084fc' }}>Email</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-secondary" style={{ backgroundColor: '#0f1523', fontSize: '0.9rem' }}>
                        {req.date}
                      </td>
                      <td className="py-3 px-4" style={{ backgroundColor: '#0f1523' }}>
                        <span 
                          className="badge rounded-pill px-3 py-1 fw-semibold"
                          style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center" style={{ backgroundColor: '#0f1523' }}>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm px-3 rounded-2 fw-semibold border-0"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontSize: '0.8rem' }}
                            onClick={() => handleApprove(req.id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm px-3 rounded-2 fw-semibold border-0"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.8rem' }}
                            onClick={() => handleDeny(req.id)}
                          >
                            Deny
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="d-flex justify-content-between align-items-center text-secondary small pt-4" style={{ fontSize: '0.75rem' }}>
        <div>🔒 No personal user data is accessible from this console.</div>
        <div>Expense Tracker Admin · 2026</div>
      </div>
    </div>
  )
}