import { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import"./Expenses.css";

const allTx = [
//   {
//     id: 1,
//     name: "Swiggy Order",
//     category: "Food",
//     emoji: "🍔",
//     amount: -450,
//     date: "Sep 9, 2025",
//     method: "UPI",
//   },
//   {
//     id: 2,
//     name: "Salary Credit",
//     category: "Income",
//     emoji: "💰",
//     amount: 35000,
//     date: "Sep 1, 2025",
//     method: "Bank Transfer",
//   },
//   {
//     id: 3,
//     name: "Uber Ride",
//     category: "Transport",
//     emoji: "🚗",
//     amount: -180,
//     date: "Sep 8, 2025",
//     method: "UPI",
//   },
//   {
//     id: 4,
//     name: "Amazon Shopping",
//     category: "Shopping",
//     emoji: "🛍️",
//     amount: -2350,
//     date: "Sep 7, 2025",
//     method: "Credit Card",
//   },
//   {
//     id: 5,
//     name: "Netflix Subscription",
//     category: "Subscriptions",
//     emoji: "💻",
//     amount: -199,
//     date: "Sep 6, 2025",
//     method: "Credit Card",
//   },
//   {
//     id: 6,
//     name: "Zomato Order",
//     category: "Food",
//     emoji: "🍔",
//     amount: -380,
//     date: "Sep 5, 2025",
//     method: "UPI",
//   },
//   {
//     id: 7,
//     name: "Metro Card Recharge",
//     category: "Transport",
//     emoji: "🚗",
//     amount: -500,
//     date: "Sep 4, 2025",
//     method: "UPI",
//   },
//   {
//     id: 8,
//     name: "Electricity Bill",
//     category: "Bills",
//     emoji: "🏠",
//     amount: -1200,
//     date: "Sep 3, 2025",
//     method: "Net Banking",
//   },
//   {
//     id: 9,
//     name: "Myntra Purchase",
//     category: "Shopping",
//     emoji: "🛍️",
//     amount: -1599,
//     date: "Sep 3, 2025",
//     method: "Credit Card",
//   },
//   {
//     id: 10,
//     name: "Pharmacy",
//     category: "Health",
//     emoji: "💊",
//     amount: -340,
//     date: "Sep 2, 2025",
//     method: "Cash",
//   },
//   {
//     id: 11,
//     name: "Udemy Course",
//     category: "Education",
//     emoji: "📚",
//     amount: -799,
//     date: "Sep 1, 2025",
//     method: "Credit Card",
//   },
//   {
//     id: 12,
//     name: "Restaurant Dinner",
//     category: "Food",
//     emoji: "🍔",
//     amount: -1100,
//     date: "Aug 30, 2025",
//     method: "Credit Card",
//   },
];

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

 function Expenses() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [method, setMethod] = useState("All");
  const [sort, setSort] = useState("date");
  const [data, setData] = useState(allTx);

  const filtered = [...data]
    .filter((t) => {
      const searchText = search.toLowerCase();

      return (
        (cat === "All" || t.category === cat) &&
        (method === "All" || t.method === method) &&
        (t.name.toLowerCase().includes(searchText) ||
          t.category.toLowerCase().includes(searchText))
      );
    })
    .sort((a, b) => {
      if (sort === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }

      return 0;
    });

  const deleteItem = (id) => {
    setData((currentData) =>
      currentData.filter((transaction) => transaction.id !== id)
    );
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

      {/* Filters */}

      <div className="transactions-filter-card">
        <div className="transaction-search">
          <Search size={16} className="transaction-search-icon" />

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

      {/* Transaction Table */}

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
                <tr key={transaction.id}>
                  <td>
                    <div className="transaction-name">
                      <div className="transaction-emoji">
                        {transaction.emoji}
                      </div>

                      <span>{transaction.name}</span>
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
                          catText[transaction.category] || "var(--muted)",
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>

                  <td>
                    <span className="transaction-secondary">
                      {transaction.date}
                    </span>
                  </td>

                  <td>
                    <span className="transaction-secondary">
                      {transaction.method}
                    </span>
                  </td>

                  <td className="text-end">
                    <span
                      className={`transaction-amount ${
                        transaction.amount > 0 ? "income-amount" : ""
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : "-"}₹
                      {Math.abs(transaction.amount).toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td>
                    <div className="transaction-actions">
                      <button
                        type="button"
                        className="transaction-action-btn edit-action"
                        title="Edit transaction"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="transaction-action-btn delete-action"
                        title="Delete transaction"
                        onClick={() => deleteItem(transaction.id)}
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

              <p>
                Try changing your search or filters.
              </p>
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
              0
            </button>

            <button type="button">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Expenses;