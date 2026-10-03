import React, { useState } from 'react'

export default function WebsiteTheme() {
  const [selectedTheme, setSelectedTheme] = useState('dark')

  const themes = [
    { id: 'dark', name: 'Dark Mode (Default)', bg: '#060913', card: '#0f1523', border: '#1a2235' },
    { id: 'midnight', name: 'Midnight Blue', bg: '#0b1329', card: '#1c294b', border: '#2b3f6c' },
    { id: 'slate', name: 'Slate Gray', bg: '#0f172a', card: '#1e293b', border: '#334155' }
  ]

  return (
    <div className="rounded-4 p-4" style={{ backgroundColor: '#0f1523', border: '1px solid #1a2235' }}>
      <h5 className="fw-bold text-white mb-1">Website Theme Settings</h5>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }} className="mb-4">
        Customize the visual appearance and color palette of your admin console.
      </p>

      <div className="row g-3">
        {themes.map((theme) => (
          <div key={theme.id} className="col-12 col-md-4">
            <div 
              className="p-3 rounded-3 cursor-pointer"
              style={{
                backgroundColor: theme.card,
                border: selectedTheme === theme.id ? '2px solid #3b82f6' : `1px solid ${theme.border}`,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold text-white fs-6">{theme.name}</span>
                {selectedTheme === theme.id && <i className="bi bi-check-circle-fill text-primary"></i>}
              </div>
              <div className="p-3 rounded-2" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div className="d-flex gap-2 mb-2">
                  <div className="rounded" style={{ width: '40px', height: '10px', backgroundColor: '#3b82f6' }}></div>
                  <div className="rounded" style={{ width: '20px', height: '10px', backgroundColor: theme.border }}></div>
                </div>
                <div className="rounded w-100" style={{ height: '20px', backgroundColor: theme.card }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}