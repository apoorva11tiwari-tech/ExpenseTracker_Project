import React, { useState } from "react";
import API_URL from "../../config/api";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Calendar, CreditCard, FileText, Upload, CheckCircle2 } from "lucide-react";
import "./AddExpense.css";

const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Entertainment", icon: "🎮" },
  { name: "Education", icon: "📚" },
  { name: "Health", icon: "💊" },
  { name: "Bills", icon: "🏠" },
  { name: "Savings", icon: "💰" },
  { name: "Travel", icon: "✈️" },
  { name: "Subscriptions", icon: "💻" },
  { name: "Other", icon: "✨" },
];

const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Cash", "Net Banking"];

export default function AddExpense() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuickAmount = (val) => {
    const current = Number(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);

    const expenseData = {
      title: category,
      amount: Number(amount),
      category: category,
      date: date,
      paymentMethod: paymentMethod,
      description: description,
    };

    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add expense");
      }

      setSaved(true);
      setTimeout(() => {
        navigate("/app/expenses");
      }, 1800);
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center min-vh-75">
        <div className="card custom-card p-4 p-md-5 text-center shadow-lg animate-pop max-w-sm w-100">
          <CheckCircle2 size={56} className="text-purple mx-auto mb-3" />
          <h2 className="fw-bold fs-4 text-dark mb-1">Expense Recorded! 🎉</h2>
          <p className="text-muted small mb-4">
            ₹{Number(amount).toLocaleString("en-IN")} · {category}
          </p>
          <div className="progress goal-progress-bar">
            <div className="progress-bar bg-purple progress-animated" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-3 my-md-4 add-expense-page max-w-2xl mx-auto px-3">
      {/* Page Header */}
      <div className="mb-3 mb-md-4">
        <h1 className="fw-bold fs-3 mb-1 text-dark">Add Expense 💸</h1>
        <p className="text-muted small mb-0">Record a new transaction easily</p>
      </div>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 gap-md-4">
        {/* Amount Input */}
        <div className="card custom-card p-3 p-md-4">
          <label className="form-label small fw-bold text-dark mb-2">
            Amount (₹)
          </label>

          <div className="input-group input-group-lg mb-3">
            <span className="input-group-text bg-purple-subtle text-purple border-0 fw-bold fs-4 rounded-start-4 px-3">
              ₹
            </span>
            <input
              type="number"
              className="form-control custom-input fs-3 fw-bold rounded-end-4"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
            />
          </div>

          {/* Quick Add Preset Buttons */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted me-1 fw-medium">Quick Add:</span>
            {[100, 500, 1000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="btn btn-sm btn-outline-purple rounded-pill px-3 py-1 fw-bold flex-grow-1 flex-md-grow-0"
              >
                +₹{val}
              </button>
            ))}
          </div>
        </div>

        
        {/* Category Selector Grid */}
        <div className="card custom-card p-3 p-md-4">
          <label className="form-label small fw-bold text-dark mb-2 mb-md-3">
            Select Category
          </label>
          <div className="category-grid">
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`category-pill ${isSelected ? "selected" : ""}`}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="card custom-card p-3 p-md-4">
          <div className="row g-3">
           
            {/* Date Picker */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1">
                <Calendar size={15} className="text-purple" /> Date
              </label>
              <input
                type="date"
                className="form-control custom-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selector */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-2">
                <CreditCard size={15} className="text-purple" /> Payment Method
              </label>
              <div className="d-flex flex-wrap gap-2">
                {paymentMethods.map((pm) => (
                  <button
                    type="button"
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`btn btn-sm method-pill flex-grow-1 flex-md-grow-0 ${paymentMethod === pm ? "active" : ""}`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1">
                <FileText size={15} className="text-purple" /> Description (Optional)
              </label>
              <textarea
                className="form-control custom-input"
                rows="2"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Receipt Upload */}
        <div className="card custom-card p-3 p-md-4">
          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-2">
            <Upload size={15} className="text-purple" /> Attach Receipt (Optional)
          </label>
          <label className="receipt-dropzone w-100 p-3 text-center rounded-4 border-dashed cursor-pointer">
            <Upload size={22} className="text-muted mb-1" />
            <p className="mb-0 small fw-semibold text-dark">Click to upload bill image or PDF</p>
            <input
              type="file"
              className="d-none"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files[0])}
            />
          </label>
          {receipt && <p className="small text-purple fw-bold mt-2 mb-0">✓ Attached: {receipt.name}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-gradient-purple w-100 py-3 rounded-pill fw-bold text-white shadow-sm my-2"
          disabled={loading || !amount || Number(amount) <= 0}
        >
          {loading ? "Saving Transaction..." : "Save Expense 🚀"}
        </button>
      </form>
    </div>
  );
}