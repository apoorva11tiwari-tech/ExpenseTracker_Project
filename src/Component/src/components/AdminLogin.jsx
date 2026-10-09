import React, { useState } from "react";
import "./AdminLogin.css";
import { color } from "chart.js/helpers";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {
      onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <div className="admin-login-icon">🛡️</div>

          <h2>Admin Login</h2>

          <p>
            Sign in to manage your Expense Tracker
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login to Admin Panel
          </button>

        </form>

        <p className="text-center mt-4 mb-0 text-muted">
          Expense Tracker Admin Portal
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;