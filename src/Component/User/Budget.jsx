import React, { useState } from "react";
import { Plus, X, Edit2, AlertTriangle, Sparkles } from "lucide-react";
import { useFadeIn } from "../../hooks/useCountUp";
import { getAIBudgetRecommendations } from "./aiService";
import "./Budget.css";

const initialBudgets = [
//   { id: 1, cat: "Food", emoji: "🍔", budget: 8000, used: 7850, color: "coral" },
//   { id: 2, cat: "Shopping", emoji: "🛍️", budget: 6000, used: 5600, color: "lavender" },
//   { id: 3, cat: "Transport", emoji: "🚗", budget: 3000, used: 2800, color: "mint" },
//   { id: 4, cat: "Bills", emoji: "🏠", budget: 5000, used: 4200, color: "peach" },
//   { id: 5, cat: "Entertainment", emoji: "🎮", budget: 2000, used: 1200, color: "purple" },
//   { id: 6, cat: "Health", emoji: "💊", budget: 2000, used: 340, color: "teal" },
//   { id: 7, cat: "Education", emoji: "📚", budget: 3000, used: 799, color: "slate" },
//   { id: 8, cat: "Savings", emoji: "💰", budget: 10000, used: 0, color: "mint" }, // New Savings Category
 ];

function CircularProgress({ pct, colorClass, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;

  return (
    <svg width={size} height={size} className="circular-progress-svg">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="circle-bg"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className={`circle-bar ${pct >= 100 ? "coral" : colorClass}`}
        strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export default function Budget() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Form & AI States
  const [newCat, setNewCat] = useState("Food");
  const [newLimit, setNewLimit] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [financialGoal, setFinancialGoal] = useState("Balanced Spending");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Manual Edit State
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const visible = useFadeIn(100);

  const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
  const totalUsed = budgets.reduce((sum, item) => sum + item.used, 0);
  const totalPct = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  // Manual Edit Save
  const saveEdit = () => {
    if (editId !== null && editVal !== "") {
      setBudgets((items) =>
        items.map((item) =>
          item.id === editId ? { ...item, budget: Number(editVal) } : item
        )
      );
      setEditId(null);
      setEditVal("");
    }
  };

  // Add/Update Single Category Budget
  const handleAddBudget = () => {
    if (!newLimit || Number(newLimit) <= 0) {
      alert("Please enter a valid monthly limit!");
      return;
    }
    setBudgets((prev) =>
      prev.map((b) => (b.cat === newCat ? { ...b, budget: Number(newLimit) } : b))
    );
    setShowModal(false);
    setNewLimit("");
  };

  // AI Auto Customization Trigger
  const handleAICustomize = async () => {
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      alert("Please enter your valid monthly income!");
      return;
    }

    setIsAiLoading(true);
    const aiSuggestions = await getAIBudgetRecommendations(
      monthlyIncome,
      financialGoal,
      budgets
    );
    setIsAiLoading(false);

    if (aiSuggestions && Array.isArray(aiSuggestions)) {
      setBudgets((prevBudgets) =>
        prevBudgets.map((item) => {
          const match = aiSuggestions.find(
            (s) => s.cat.toLowerCase() === item.cat.toLowerCase()
          );
          return match ? { ...item, budget: match.suggestedBudget } : item;
        })
      );
      setShowAIModal(false);
      setMonthlyIncome("");
    } else {
      alert("Oops, the AI recommendation engine stalled. Tap retry.");
    }
  };

  return (
    <div className={`container my-4 budget-page ${visible ? "fade-in" : ""}`}>
      {/* Header with AI & Manual Action Buttons */}
      <div className="d-flex align-items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-1 budget-title">
            Budget Management 🎯
          </h1>
          <p className="text-muted small mb-0">
            September 2026 — Track & Customize smartly
          </p>
        </div>

        <div className="d-flex gap-2">
          {/* AI Customize Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="btn btn-ai d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Sparkles size={16} /> AI Customize
          </button>

          {/* Manual Add Budget Button */}
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-gradient d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Plus size={16} /> Add Budget
          </button>
        </div>
      </div>

      {/* Monthly Overview Card */}
      <div
        className={`card custom-card p-4 mb-4 ${
          totalPct >= 90 ? "border-danger-custom" : ""
        }`}
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-4 text-center">
            <div className="position-relative d-inline-block">
              <CircularProgress pct={totalPct} colorClass="peach" size={120} />
              <div className="progress-center-text">
                <span
                  className={`fs-3 fw-bold ${
                    totalPct >= 90 ? "text-coral" : ""
                  }`}
                >
                  {totalPct}%
                </span>
                <span className="small text-muted d-block">Used</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <h2 className="fs-5 fw-bold mb-1">Monthly Budget Overview</h2>
            <p className="text-muted small mb-3">
              ₹{totalUsed.toLocaleString()} of ₹{totalBudget.toLocaleString()}{" "}
              used
            </p>

            <div className="progress main-progress-bar mb-2">
              <div
                className={`progress-bar ${
                  totalPct >= 90 ? "bg-coral" : "bg-peach-gradient"
                }`}
                role="progressbar"
                style={{ width: `${Math.min(totalPct, 100)}%` }}
              ></div>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="small text-muted">
                Spent: ₹{totalUsed.toLocaleString()}
              </span>
              <span className="small fw-bold text-mint">
                Remaining: ₹{Math.max(0, totalBudget - totalUsed).toLocaleString()}
              </span>
            </div>

            {totalPct >= 80 && (
              <div className="alert-custom d-flex align-items-center gap-2 p-3 rounded-3">
                <AlertTriangle size={16} className="text-coral shrink-0" />
                <p className="small mb-0">
                  You have used{" "}
                  <strong className="text-coral">{totalPct}%</strong> of your overall budget. Consider trimming non-essential expenses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="row g-3">
        {budgets.map((b) => {
          const pct = Math.round((b.used / b.budget) * 100);
          const over = pct > 100;

          return (
            <div className="col-12 col-md-6" key={b.id}>
              <div
                className={`card custom-card p-3 ${
                  over ? "border-danger-custom" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative shrink-0">
                    <CircularProgress
                      pct={pct}
                      colorClass={b.color}
                      size={60}
                    />
                    <div className="progress-center-emoji">{b.emoji}</div>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <h3 className="fs-6 fw-bold mb-0">{b.cat}</h3>
                      <div className="d-flex align-items-center gap-1">
                        {over && (
                          <AlertTriangle size={14} className="text-coral" />
                        )}
                        {editId === b.id ? (
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="number"
                              value={editVal}
                              onChange={(e) => setEditVal(e.target.value)}
                              className="form-control form-control-sm edit-input"
                            />
                            <button
                              onClick={saveEdit}
                              className="btn btn-sm btn-coral text-white fw-bold py-0 px-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="btn btn-sm text-muted p-0 ms-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditId(b.id);
                              setEditVal(String(b.budget));
                            }}
                            className="btn btn-sm text-muted p-1"
                            title="Edit Budget"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="small text-muted mb-2">
                      ₹{b.used.toLocaleString()} / ₹{b.budget.toLocaleString()}
                    </p>

                    <div className="progress category-progress-bar mb-1">
                      <div
                        className={`progress-bar ${
                          over ? "bg-coral" : `bg-${b.color}`
                        }`}
                        role="progressbar"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span
                        className={`small fw-bold ${
                          over
                            ? "text-coral"
                            : pct >= 80
                            ? "text-peach"
                            : "text-muted"
                        }`}
                      >
                        {pct}% used
                      </span>
                      <span className="small text-muted">
                        {over
                          ? `₹${(b.used - b.budget).toLocaleString()} over!`
                          : `₹${(b.budget - b.used).toLocaleString()} left`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Customize Modal */}
      {showAIModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Sparkles className="text-ai" size={20} /> AI Smart Planner
              </h2>
              <button
                onClick={() => setShowAIModal(false)}
                className="btn btn-sm text-muted p-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Monthly Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="form-control custom-input"
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Financial Goal</label>
              <select
                value={financialGoal}
                onChange={(e) => setFinancialGoal(e.target.value)}
                className="form-select custom-input"
              >
                <option value="Save More Money">Save More Money (50/30/20 Rule)</option>
                <option value="Aggressive Debt Payoff">Payoff Loans & Bills Fast</option>
                <option value="Student Budget">Student Low-Budget Plan</option>
                <option value="Balanced Spending">Balanced Spending Strategy</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowAIModal(false)}
                className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAICustomize}
                disabled={isAiLoading}
                className="btn btn-ai w-50 rounded-pill text-white fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                {isAiLoading ? "Generating..." : "Apply AI Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add/Update Budget Modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0">Set New Budget 🎯</h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm text-muted p-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="form-select custom-input"
              >
                {budgets.map((b) => (
                  <option key={b.id} value={b.cat}>
                    {b.emoji} {b.cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="form-control custom-input"
              />
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="btn btn-gradient w-50 rounded-pill text-white fw-bold"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}