import React from 'react'
import './AdminProfile.css'

export  default function AdminProfile() {
  return (
    <div className="bg-light-card rounded-4 p-4" style={{ maxWidth: '600px' }}>
      <h5 className="fw-bold text-dark mb-1">Admin Profile Settings</h5>
      <p className="text-muted-custom fs-7 mb-4">Manage self admin credentials. You do not have access to regular user profiles.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3">
          <label className="form-label text-muted-custom fs-7 fw-semibold">Admin Account Name</label>
          <input type="text" className="form-control bg-light" defaultValue="System Administrator" />
        </div>
        <div className="mb-3">
          <label className="form-label text-muted-custom fs-7 fw-semibold">Current Password</label>
          <input type="password" className="form-control bg-light" defaultValue="••••••••••••" />
        </div>
        <div className="mb-3">
          <label className="form-label text-muted-custom fs-7 fw-semibold">New Password</label>
          <input type="password" className="form-control bg-light" placeholder="Enter new password" />
        </div>
        <button type="submit" className="btn btn-primary rounded-3 px-4 fw-semibold mt-2">
          Update Security Credentials
        </button>
      </form>
    </div>
  )
}