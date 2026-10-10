import React, { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      if (data.user?.role !== "admin" || !data.token) {
        setError("Admin access was not confirmed by the server.");
        return;
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError(
        "Cannot connect to the backend. Make sure the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">🛡️</div>
          <h2>Admin Login</h2>
          <p>Sign in to manage your Expense Tracker</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-email" className="form-label">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="admin-password" className="form-label">
              Password
            </label>

            <div className="input-group">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login to Admin Panel"}
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