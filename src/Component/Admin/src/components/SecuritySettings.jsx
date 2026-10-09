import React, { useState } from 'react'
import './SecuritySettings.css'

export default function SecuritySettings({ settings = {}, onSave }) {
  const [formData, setFormData] = useState({
    googleLogin: settings.googleLogin ?? true,
    emailPasswordLogin: settings.emailPasswordLogin ?? true,
    requireAdminApproval: settings.requireAdminApproval ?? true,
    approvedUsersOnly: settings.approvedUsersOnly ?? true,
  })

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
  }

  const securityOptions = [
    { key: 'googleLogin', label: 'Google Login' },
    { key: 'emailPasswordLogin', label: 'Email & Password Login' },
    { key: 'requireAdminApproval', label: 'Require Admin Approval' },
    { key: 'approvedUsersOnly', label: 'Approved Users Only' },
  ]

  return (
    <div className="security-settings">
      <h3>Security Settings</h3>

      <div className="security-settings__list">
        {securityOptions.map(({ key, label }) => (
          <div key={key} className="security-settings__row">
            <div className="security-settings__info">
              <span className="security-settings__label">{label}</span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${formData[key] ? 'enabled' : ''}`}
              aria-pressed={formData[key]}
              onClick={() => handleToggle(key)}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        ))}
      </div>

      <div className="security-settings__actions">
        <button type="button" className="security-settings__save" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  )
}