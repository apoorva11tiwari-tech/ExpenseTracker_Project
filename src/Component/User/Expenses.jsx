import { useState, useEffect } from "react";
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

// Emoji for each category
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

  // Data comes from MongoDB
  const [data, setData] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load expenses from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        return response.json();
      })
      .then((result) => {
        console.log("Expenses loaded:", result);
        setData(result);
      })
      .catch((error) => {
        console.error("Error loading expenses:", error);
      });
  }, []);

  // Filter and sort expenses
  const filtered = [...data]
    .filter((t) => {
      const searchText = search.toLowerCase();

      const title = t.title?.toLowerCase() || "";
      const category = t.category?.toLowerCase() || "";

      return (
        (cat === "All" || t.category === cat) &&
        (method === "All" || t.paymentMethod === method) &&
        (title.includes(searchText) || category.includes(searchText))
      );
    })
    .sort((a, b) => {
      if (sort === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }

      // Sort by date - newest first
      return new Date(b.date) - new Date(a.date);
    });

  // Delete expense from MongoDB
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete expense"
        );
      }

      console.log("Expense deleted:", result);

      // Remove deleted expense from screen
      setData((currentData) =>
        currentData.filter(
          (transaction) => transaction._id !== id
        )
      );
    } catch (error) {
      console.error("Error deleting expense:", error);

      alert("Failed to delete expense.");
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

      {/* EDIT FORM - Conditionally displayed when editingExpense is set */}
      {editingExpense && (
        <div className="card p-4 mb-4">
          <h4 className="mb-3">Edit Expense ✏️</h4>

          <div className="row g-3">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label">Expense Title</label>
              <input
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

            {/* Amount */}
            <div className="col-md-6">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={editingExpense.amount || ""}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={editingExpense.category || ""}
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

            {/* Date */}
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input
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

            {/* Payment Method */}
            <div className="col-md-6">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={editingExpense.paymentMethod || ""}
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

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
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

            {/* Action Buttons */}
            <div className="col-12 d-flex gap-2">
              <button
  type="button"
  className="btn btn-primary"
  onClick={async () => {
    try {
      // Ensure date is formatted properly before sending to backend
      const formattedDate = new Date(editingExpense.date).toISOString();

      const response = await fetch(
        `http://localhost:5000/api/expenses/${editingExpense._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingExpense.title,
            amount: Number(editingExpense.amount),
            category: editingExpense.category,
            date: formattedDate,
            paymentMethod: editingExpense.paymentMethod,
            description: editingExpense.description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update expense"
        );
      }

      setData((currentData) =>
        currentData.map((item) =>
          item._id === editingExpense._id ? result.expense : item
        )
      );

      setEditingExpense(null);
      alert("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      alert(error.message || "Failed to update expense.");
    }
  }}
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
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      {/* Expense Table */}
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
              {filtered.map((transaction) => (
                <tr key={transaction._id}>
                  {/* Transaction */}
                  <td>
                    <div className="transaction-name">
                      <div className="transaction-emoji">
                        {categoryEmoji[transaction.category] || "💵"}
                      </div>
                      <span>{transaction.title}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      className="transaction-category"
                      style={{
                        background:
                          catColors[transaction.category] || catColors.Other,
                        color:
                          catText[transaction.category] || "var(--muted)",
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="transaction-secondary">
                      {new Date(transaction.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td>
                    <span className="transaction-secondary">
                      {transaction.paymentMethod || "—"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="text-end">
                    <span className="transaction-amount">
                      -₹
                      {Math.abs(transaction.amount).toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="transaction-actions">
                      {/* Edit */}
                      <button
                        type="button"
                        className="transaction-action-btn edit-action"
                        title="Edit transaction"
                        onClick={() => setEditingExpense(transaction)}
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="transaction-action-btn delete-action"
                        title="Delete transaction"
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

          {/* Empty State */}
          {filtered.length === 0 && (
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
            <button type="button">Previous</button>
            <button type="button" className="active-page">
              1
            </button>
            <button type="button">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;