
import React, { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/admin/login-requests";

export default function LoginRequests() {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session missing. Please log in again.");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load login requests.");
      }

      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateRequest = async (requestId, status) => {
    const action = status === "Approved" ? "approve" : "deny";

    if (
      !window.confirm(`Are you sure you want to ${action} this request?`)
    ) {
      return;
    }

    setBusyId(requestId);
    setError("");
    setMessage("");

    try {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session missing. Please log in again.");
      }

      const response = await fetch(`${API_URL}/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const responseText = await response.text();

console.log("Login Requests HTTP Status:", response.status);
console.log("Login Requests Response:", responseText);

let data;
try {
  data = JSON.parse(responseText);
} catch {
  throw new Error(
    "Backend returned HTML instead of JSON. Check the backend URL and routes."
  );
}

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Could not ${action} request.`);
      }

      setRequests((previous) =>
        previous.filter((request) => request._id !== requestId)
      );

      setMessage(`Request ${action}d successfully.`);
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "Google") return request.method === "Google";
    if (filter === "Email") return request.method === "Email";
    return true;
  });

  const buttonStyle = (active) => ({
    backgroundColor: active ? "#2563eb" : "transparent",
    color: active ? "#fff" : "#94a3b8",
    border: "none",
    borderRadius: "8px",
    padding: "7px 14px",
    fontWeight: 600,
  });

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "#090d16",
        minHeight: "85vh",
        color: "#fff",
        borderRadius: "16px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Login Requests</h3>
          <span style={{ color: "#60a5fa" }}>
            {requests.length} pending approval
          </span>
        </div>

        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={fetchRequests}
          disabled={loading || busyId !== null}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      <div
        className="d-flex gap-1 p-1 rounded-3 mb-3"
        style={{
          width: "fit-content",
          backgroundColor: "#0f1523",
          border: "1px solid #1a2235",
        }}
      >
        {["All", "Google", "Email"].map((option) => (
          <button
            key={option}
            type="button"
            style={buttonStyle(filter === option)}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div
        className="rounded-4 overflow-hidden"
        style={{
          backgroundColor: "#0f1523",
          border: "1px solid #1a2235",
        }}
      >
        <div className="table-responsive">
          <table className="table table-dark align-middle mb-0">
            <thead>
              <tr>
                <th className="p-3">REQUEST ID</th>
                <th className="p-3">AUTH METHOD</th>
                <th className="p-3">REQUEST DATE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-center">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    Loading requests from database...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-5 text-secondary"
                  >
                    No pending login requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="p-3">
                      <code>{request._id}</code>
                    </td>

                    <td className="p-3">
                      {request.method || "Email"}
                    </td>

                    <td className="p-3 text-secondary">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="p-3">
                      <span className="badge bg-warning text-dark">
                        {request.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          disabled={busyId !== null}
                          onClick={() =>
                            updateRequest(request._id, "Approved")
                          }
                        >
                          {busyId === request._id ? "Saving..." : "Approve"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={busyId !== null}
                          onClick={() =>
                            updateRequest(request._id, "Denied")
                          }
                        >
                          {busyId === request._id ? "Saving..." : "Deny"}
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

      <div className="d-flex justify-content-between flex-wrap gap-2 text-secondary small pt-4">
        <div>🔒 Personal expense information is not displayed.</div>
        <div>Expense Tracker Admin · 2026</div>
      </div>
    </div>
  );
}
