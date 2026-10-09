
import { useState, useEffect } from "react";
import apiFetch from "../../config/apiFetch";
import { Search, Edit2, Trash2 } from "lucide-react";
import "./Expenses.css";

const categories = [
  "All",
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Subscriptions",
  "Health",
  "Education",
  "Income",
  "Other",
];

const methods = [
  "All",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Net Banking",
  "Bank Transfer",
];

const catColors = {
  Food: "rgba(232, 93, 46, 0.12)",
  Shopping: "rgba(184, 169, 217, 0.2)",
  Transport: "rgba(126, 200, 181, 0.15)",
  Bills: "rgba(244, 162, 97, 0.15)",
  Subscriptions: "rgba(168, 181, 193, 0.2)",
  Health: "rgba(232, 93, 46, 0.08)",
  Education: "rgba(126, 200, 181, 0.12)",
  Income: "rgba(126, 200, 181, 0.2)",
  Other: "rgba(168, 181, 193, 0.1)",
};

const catText = {
  Food: "var(--coral)",
  Shopping: "var(--lavender)",
  Transport: "var(--mint)",
  Bills: "var(--peach)",
  Subscriptions: "var(--muted)",
  Health: "var(--coral)",
  Education: "var(--mint)",
  Income: "var(--mint)",
  Other: "var(--muted)",
};

const categoryEmoji = {
  Food: "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Bills: "🏠",
  Subscriptions: "💻",
  Health: "💊",
  Education: "📚",
  Income: "💰",
  Other: "💵",
};

function Expenses() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [method, setMethod] = useState("All");
  const [sort, setSort] = useState("date");

  const [data, setData] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load expenses for the authenticated user.
  useEffect(() => {
    let cancelled = false;

    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/expenses");

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(
            result.message || "Failed to load expenses."
          );
        }

        const result = await response.json();

        if (!cancelled) {
          setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading expenses:", err);
          setError(err.message || "Unable to load expenses.");
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter and sort transactions.
  const filtered = [...data]
    .filter((transaction) => {
      const searchText = search.toLowerCase();
      const title = transaction.title?.toLowerCase() || "";
      const category = transaction.category?.toLowerCase() || "";

      return (
        (cat === "All" || transaction.category === cat) &&
        (method === "All" ||
          transaction.paymentMethod === method) &&
        (title.includes(searchText) ||
          category.includes(searchText))
      );
    })
    .sort((a, b) => {
      if (sort === "amount") {
        return (
          Math.abs(Number(b.amount) || 0) -
          Math.abs(Number(a.amount) || 0)
        );
      }

      return new Date(b.date) - new Date(a.date);
    });

  // Delete an expense.
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete expense."
        );
      }

      setData((currentData) =>
        currentData.filter((transaction) => transaction._id !== id)
      );

      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert(err.message || "Failed to delete expense.");
    }
  };

  // Update an expense.
  const saveChanges = async () => {
    if (!editingExpense) return;

    const amount = Number(editingExpense.amount);

    if (!editingExpense.title?.trim()) {
      alert("Please enter an expense title.");
      return;
    }

    if (!Number.isFinite(amount) || amount < 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const formattedDate = editingExpense.date
        ? new Date(editingExpense.date).toISOString()
        : new Date().toISOString();

      const response = await apiFetch(
        `/api/expenses/${editingExpense._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: editingExpense.title.trim(),
            amount,
            category: editingExpense.category,
            date: formattedDate,
            paymentMethod: editingExpense.paymentMethod,
            description: editingExpense.description || "",
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update expense."
        );
      }

      // Supports APIs returning either { expense: ... } or the
      // updated expense document directly.
      const updatedExpense = result.expense || result;

      setData((currentData) =>
        currentData.map((item) =>
          item._id === editingExpense._id ? updatedExpense : item
        )
      );

      setEditingExpense(null);
      alert("Expense updated successfully!");
    } catch (err) {
      console.error("Error updating expense:", err);
      alert(err.message || "Failed to update expense.");
    }
  };

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div>
          <h1 className="transactions-title">
            Expense History <span>📋</span>
          </h1>

          <p className="transactions-subtitle">
            All your income and expense records
          </p>
        </div>
      </div>

      {/* Loading and error messages */}
      {loading && (
        <div className="transactions-empty">
          <p>Loading your transactions...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Edit form */}
      {editingExpense && (
        <div className="card p-4 mb-4">
          <h4 className="mb-3">Edit Expense ✏️</h4>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-title">
                Expense Title
              </label>
              <input
                id="edit-title"
                type="text"
                className="form-control"
                value={editingExpense.title || ""}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-amount">
                Amount
              </label>
              <input
                id="edit-amount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={editingExpense.amount ?? ""}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-category">
                Category
              </label>
              <select
                id="edit-category"
                className="form-select"
                value={editingExpense.category || "Other"}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    category: e.target.value,
                  })
                }
              >
                {categories
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-date">
                Date
              </label>
              <input
                id="edit-date"
                type="date"
                className="form-control"
                value={
                  editingExpense.date
                    ? editingExpense.date.substring(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    date: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-method">
                Payment Method
              </label>
              <select
                id="edit-method"
                className="form-select"
                value={editingExpense.paymentMethod || "Cash"}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    paymentMethod: e.target.value,
                  })
                }
              >
                {methods
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12">
              <label
                className="form-label"
                htmlFor="edit-description"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                className="form-control"
                rows="3"
                value={editingExpense.description || ""}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveChanges}
              >
                Save Changes
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingExpense(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="transactions-filter-card">
        <div className="transaction-search">
          <Search
            size={16}
            className="transaction-search-icon"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
          />
        </div>

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="transaction-select"
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="transaction-select"
          aria-label="Filter by payment method"
        >
          {methods.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="transaction-select"
          aria-label="Sort transactions"
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      {/* Expense table */}
      <div className="transactions-table-card">
        <div className="table-responsive">
          <table className="table transactions-table mb-0">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Method</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                !error &&
                filtered.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <div className="transaction-name">
                        <div className="transaction-emoji">
                          {categoryEmoji[transaction.category] || "💵"}
                        </div>
                        <span>{transaction.title}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className="transaction-category"
                        style={{
                          background:
                            catColors[transaction.category] ||
                            catColors.Other,
                          color:
                            catText[transaction.category] ||
                            "var(--muted)",
                        }}
                      >
                        {transaction.category}
                      </span>
                    </td>

                    <td>
                      <span className="transaction-secondary">
                        {transaction.date
                          ? new Date(
                              transaction.date
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>

                    <td>
                      <span className="transaction-secondary">
                        {transaction.paymentMethod || "—"}
                      </span>
                    </td>

                    <td className="text-end">
                      <span className="transaction-amount">
                        -₹
                        {Math.abs(
                          Number(transaction.amount) || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="transaction-actions">
                        <button
                          type="button"
                          className="transaction-action-btn edit-action"
                          title="Edit transaction"
                          aria-label={`Edit ${transaction.title}`}
                          onClick={() =>
                            setEditingExpense(transaction)
                          }
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          className="transaction-action-btn delete-action"
                          title="Delete transaction"
                          aria-label={`Delete ${transaction.title}`}
                          onClick={() => deleteItem(transaction._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && !error && filtered.length === 0 && (
            <div className="transactions-empty">
              <div className="transactions-empty-icon">🔍</div>
              <h4>No transactions found</h4>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="transactions-footer">
          <p>
            {filtered.length}{" "}
            {filtered.length === 1 ? "transaction" : "transactions"}
          </p>

          <div className="transaction-pagination">
            <button type="button" disabled>
              Previous
            </button>
            <button
              type="button"
              className="active-page"
              aria-current="page"
            >
              1
            </button>
            <button type="button" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
