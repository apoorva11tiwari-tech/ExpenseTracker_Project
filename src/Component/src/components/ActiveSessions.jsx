import React, { useState } from 'react'

export default function ActiveSessions({ sessionsData = [], onLogoutUser, onLogoutAll }) {
  // Safe check to guarantee sessions is always an array
  const safeData = Array.isArray(sessionsData) ? sessionsData : []
  const [sessions, setSessions] = useState(safeData)

  const handleLogoutSingle = (id) => {
    setSessions(prev => prev.filter(sess => sess.id !== id))
    if (onLogoutUser) onLogoutUser(id)
  }

  const handleLogoutAllSessions = () => {
    setSessions([])
    if (onLogoutAll) onLogoutAll()
  }

  // Fallback to empty array if state becomes undefined
  const currentSessions = sessions || []

  return (
    <div style={{ backgroundColor: '#090d16', minHeight: '85vh', color: '#fff' }} className="p-3 d-flex flex-column justify-content-between">
      <div>
        {/* Header & Main Action Row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>Active Sessions</h3>
            <span style={{ color: '#60a5fa', fontSize: '0.9rem' }}>
              {currentSessions.length} active right now
            </span>
          </div>

          {/* Logout All Button */}
          <button
            type="button"
            className="btn btn-danger px-3 py-2 rounded-3 fw-semibold border-0"
            style={{ backgroundColor: '#e11d48', fontSize: '0.85rem' }}
            onClick={handleLogoutAllSessions}
            disabled={currentSessions.length === 0}
          >
            Logout All Sessions
          </button>
        </div>

        {/* Table Container */}
        <div className="rounded-4 overflow-hidden" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a2235' }}>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>USER ID</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>AUTH METHOD</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>LOGIN TIME</th>
                  <th className="py-3 px-4 text-secondary fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>SESSION STATUS</th>
                  <th className="py-3 px-4 text-secondary fw-semibold text-center" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', backgroundColor: '#0f1523' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentSessions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-secondary" style={{ backgroundColor: '#0f1523' }}>
                      No active user sessions right now.
                    </td>
                  </tr>
                ) : (
                  currentSessions.map((sess) => (
                    <tr key={sess.id} style={{ borderBottom: '1px solid #1a2235' }}>
                      <td className="py-3 px-4 fw-bold text-white" style={{ backgroundColor: '#0f1523' }}>
                        {sess.id}
                      </td>
                      <td className="py-3 px-4" style={{ backgroundColor: '#0f1523' }}>
                        <span 
                          className="badge rounded-pill px-3 py-2 fw-normal d-inline-flex align-items-center gap-1"
                          style={{ backgroundColor: '#1e293b', color: '#60a5fa', fontSize: '0.8rem', border: '1px solid #334155' }}
                        >
                          {sess.method === 'Google' ? (
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
                        {sess.loginTime}
                      </td>
                      <td className="py-3 px-4" style={{ backgroundColor: '#0f1523' }}>
                        <span 
                          className="badge rounded-pill px-3 py-1 fw-semibold"
                          style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '0.75rem', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                        >
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center" style={{ backgroundColor: '#0f1523' }}>
                        <button
                          type="button"
                          className="btn btn-sm px-3 rounded-2 fw-semibold border-0"
                          style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#f59e0b', fontSize: '0.8rem' }}
                          onClick={() => handleLogoutSingle(sess.id)}
                        >
                          Logout
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center text-secondary small pt-4" style={{ fontSize: '0.75rem' }}>
        <div>🔒 No personal user data is accessible from this console.</div>
        <div>Expense Tracker Admin · 2026</div>
      </div>
    </div>
  )
}