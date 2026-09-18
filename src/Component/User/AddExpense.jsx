
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddExpense.css";

const categories = [
  { label: "Food", emoji: "🍔" },
  { label: "Transport", emoji: "🚗" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Entertainment", emoji: "🎮" },
  { label: "Education", emoji: "📚" },
  { label: "Health", emoji: "💊" },
  { label: "Bills", emoji: "🏠" },
  { label: "Travel", emoji: "✈️" },
  { label: "Subscriptions", emoji: "💻" },
  { label: "Other", emoji: "💰" }
];

const paymentMethods = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Net Banking"
];

function AddExpense() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Show success screen
    setSaved(true);

    // Go to transactions page after 2 seconds
    setTimeout(() => {
      navigate("/app/transactions");
    }, 2000);
  };

  // Success screen
  if (saved) {
    return (
      <div className="success-screen d-flex justify-content-center align-items-center">
        <div className="text-center success-box">

          <div className="success-icon mx-auto mb-4">
            ✅
          </div>

          <h2 className="fw-bold mb-2">
            Expense Added! 🎉
          </h2>

          <p className="text-secondary mb-2">
            ₹{Number(amount).toLocaleString()} · {category}
          </p>

          <p className="small text-muted">
            Updating your transactions...
          </p>

          <div className="progress success-progress mt-4">
            <div className="progress-bar"></div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 add-expense-page">

      {/* Page Heading */}
      <div className="mb-4">
        <h1 className="fw-bold">
          Add Expense 💸
        </h1>

        <p className="text-secondary">
          Record a new transaction
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Amount */}
        <div className="card expense-card mb-4 fade-in">

          <div className="card-body p-4">

            <label className="form-label fw-bold">
              Amount 💰
            </label>

            <div className="input-group input-group-lg">

              <span className="input-group-text">
                ₹
              </span>

              <input
                type="number"
                className="form-control amount-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />

            </div>

          </div>
        </div>

        {/* Category */}
        <div className="card expense-card mb-4">

          <div className="card-body p-4">

            <label className="form-label fw-bold mb-3">
              Category
            </label>

            <div className="row g-2">

              {categories.map((item) => (
                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={item.label}>

                  <button
                    type="button"
                    className={`category-button w-100 ${
                      category === item.label ? "selected" : ""
                    }`}
                    onClick={() => setCategory(item.label)}
                  >
                    <span className="category-emoji">
                      {item.emoji}
                    </span>

                    <span>
                      {item.label}
                    </span>
                  </button>

                </div>
              ))}

            </div>

          </div>
        </div>

        {/* Details */}
        <div className="card expense-card mb-4">

          <div className="card-body p-4">

            <div className="row g-3">

              {/* Date */}
              <div className="col-md-6">

                <label className="form-label fw-bold">
                  Date 📅
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />

              </div>

              {/* Payment Method */}
              <div className="col-md-6">

                <label className="form-label fw-bold">
                  Payment Method 💳
                </label>

                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  required
                >
                  <option value="">
                    Select payment method
                  </option>

                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}

                </select>

              </div>

              {/* Description */}
              <div className="col-12">

                <label className="form-label fw-bold">
                  Description 📝
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                ></textarea>

              </div>

            </div>

          </div>
        </div>

        {/* Receipt */}
        <div className="card expense-card mb-4">

          <div className="card-body p-4">

            <label className="form-label fw-bold">
              Receipt <span className="text-muted">(Optional)</span> 🧾
            </label>

            <label className="receipt-box w-100">

              <div className="receipt-icon">
                📎
              </div>

              <p className="mb-1 fw-semibold">
                Click to upload receipt
              </p>

              <small className="text-muted">
                PNG, JPG or PDF
              </small>

              <input
                type="file"
                className="d-none"
                accept="image/*,.pdf"
                onChange={(event) => {
                  setReceipt(event.target.files[0]);
                }}
              />

            </label>

            {receipt && (
              <p className="small text-success mt-2">
                ✓ {receipt.name}
              </p>
            )}

          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="btn save-button w-100 py-3 fw-bold"
          disabled={!amount || !category || !date || !paymentMethod}
        >
          Save Expense 🚀
        </button>

      </form>

    </div>
  );
}

export default AddExpense;

