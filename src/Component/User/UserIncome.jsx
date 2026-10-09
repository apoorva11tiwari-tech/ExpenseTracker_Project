
import { useState, useEffect, useCallback } from "react";
import { Search, Trash2 } from "lucide-react";

import apiFetch from "../../config/apiFetch";

function UserIncome() {
  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Salary");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const sources = [
    "Salary",
    "Freelance",
    "Investments",
    "Gift",
    "Allowance",
    "Other",
  ];

  // Fetch income records belonging to the authenticated user.
  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/income");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch income records."
        );
      }

      setIncomes(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error fetching income:", err);
      setError(err.message || "Could not load income records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  // Add income.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || amount === "" || !date || !source) {
      alert("Please fill in all required fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      alert("Please enter a valid, non-negative income amount.");
      return;
    }

    const incomeData = {
      title: title.trim(),
      amount: numericAmount,
      source,
      date,
      description: description.trim(),
    };

    setSaving(true);

    try {
      const response = await apiFetch("/api/income", {
        method: "POST",
        body: JSON.stringify(incomeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add income."
        );
      }

      // Monthly Salary may update an existing record instead
      // of creating a new one, so reload the authoritative list.
      await fetchIncomes();

      setTitle("");
      setAmount("");
      setSource("Salary");
      setDate("");
      setDescription("");

      alert(result.message || "Income saved successfully!");
    } catch (err) {
      console.error("Error adding income:", err);
      alert(err.message || "Failed to save income.");
    } finally {
      setSaving(false);
    }
  };

  // Delete only the selected user's income record.
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this income record?"
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await apiFetch(`/api/income/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete income."
        );
      }

      setIncomes((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Error deleting income:", err);
      alert(err.message || "Failed to delete income.");
    } finally {
      setDeletingId(null);
    }
  };

  // Search by title or source.
  const filteredIncomes = incomes.filter((item) => {
    const searchTerm = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(searchTerm) ||
      item.source?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">Income Tracker 💰</h2>

      {/* Add Income Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">Add New Income</h4>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                Title / Source Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. Monthly Salary, Freelance Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Amount (₹)</label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="e.g. 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Source Category
              </label>

              <select
                className="form-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              >
                {sources.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Date</label>

              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Description (Optional)
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Note or details"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? "Saving..." : "+ Add Income"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Income History */}
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h4 className="mb-0">Income History</h4>

          <div
            className="input-group"
            style={{ maxWidth: "300px" }}
          >
            <span className="input-group-text">
              <Search size={16} />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search income..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}

            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchIncomes}
            >
              Retry
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Source</th>
                <th>Date</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-muted py-4"
                  >
                    Loading income records...
                  </td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-muted py-4"
                  >
                    No income records found.
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>

                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {item.source || "Other"}
                      </span>
                    </td>

                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    <td className="text-end text-success fw-bold">
                      +₹
                      {Number(item.amount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        title="Delete income"
                      >
                        {deletingId === item._id ? (
                          "Deleting..."
                        ) : (
                          <Trash2 size={14} />
                        )}
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
  );
}

export default UserIncome;
