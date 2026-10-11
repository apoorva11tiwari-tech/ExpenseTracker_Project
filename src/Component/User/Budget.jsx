
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Edit2,
  AlertTriangle,
  Sparkles,
  Trash2,
} from "lucide-react";

import apiFetch from "../../config/apiFetch";
import { useFadeIn } from "../../Hooks/useCountUp.jsx";
import { getAIBudgetRecommendations } from "./aiService";
import "./Budget.css";

const categoryMeta = {
  Food: { emoji: "🍔", color: "coral" },
  Shopping: { emoji: "🛍️", color: "lavender" },
  Transport: { emoji: "🚗", color: "mint" },
  Bills: { emoji: "🏠", color: "peach" },
  Entertainment: { emoji: "🎮", color: "purple" },
  Health: { emoji: "💊", color: "teal" },
  Education: { emoji: "📚", color: "slate" },
  Savings: { emoji: "💰", color: "mint" },
  Other: { emoji: "📦", color: "slate" },
};

function CircularProgress({ pct, colorClass, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;

  return (
    <svg
      width={size}
      height={size}
      className="circular-progress-svg"
    >
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
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const [newCat, setNewCat] = useState("Food");
  const [newLimit, setNewLimit] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [financialGoal, setFinancialGoal] =
    useState("Balanced Spending");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const visible = useFadeIn(100);

  // Fetch only the authenticated user's budgets.
  const fetchBudgets = useCallback(async () => {
    try {
      const response = await apiFetch("/api/budgets");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load budgets.");
      }

      if (!Array.isArray(data)) {
        setBudgets([]);
        return;
      }

      const formatted = data.map((b) => {
        const meta = categoryMeta[b.category] || {
          emoji: "🎯",
          color: "lavender",
        };

        return {
          id: b._id,
          cat: b.category,
          emoji: meta.emoji,
          budget: Number(b.budgetedAmount ?? b.amount ?? 0),
          used: Number(b.spentAmount ?? 0),
          color: meta.color,
        };
      });

      setBudgets(formatted);
    } catch (error) {
      console.error("Error loading budgets:", error);
      setBudgets([]);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const totalBudget = budgets.reduce(
    (sum, item) => sum + item.budget,
    0
  );

  const totalUsed = budgets.reduce(
    (sum, item) => sum + item.used,
    0
  );

  const totalPct =
    totalBudget > 0
      ? Math.round((totalUsed / totalBudget) * 100)
      : 0;

  // Add or update a budget through the authenticated API.
  const saveBudget = async (category, amount) => {
    const response = await apiFetch("/api/budgets", {
      method: "POST",
      body: JSON.stringify({ category, amount }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save budget.");
    }

    return result;
  };

  // Edit a budget.
  const saveEdit = async () => {
    if (editId === null || editVal === "") {
      alert("Please enter a budget amount.");
      return;
    }

    const amount = Number(editVal);

    if (!Number.isFinite(amount) || amount < 0) {
      alert("Please enter a valid, non-negative budget amount.");
      return;
    }

    const targetItem = budgets.find((b) => b.id === editId);

    if (!targetItem) return;

    setIsSaving(true);

    try {
      await saveBudget(targetItem.cat, amount);

      setEditId(null);
      setEditVal("");

      await fetchBudgets();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert(error.message || "Could not update the budget.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new budget or update the selected category.
  const handleAddBudget = async () => {
    if (
      newLimit === "" ||
      !Number.isFinite(Number(newLimit)) ||
      Number(newLimit) <= 0
    ) {
      alert("Please enter a valid monthly limit greater than zero.");
      return;
    }

    setIsSaving(true);

    try {
      await saveBudget(newCat, Number(newLimit));

      setShowModal(false);
      setNewLimit("");

      await fetchBudgets();
    } catch (error) {
      console.error("Error saving budget:", error);
      alert(error.message || "Could not save the budget.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete one budget belonging to the current user.
  const handleDelete = async (id, categoryName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the budget for ${categoryName}?`
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete budget.");
      }

      await fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert(error.message || "Could not delete the budget.");
    }
  };

  // Delete all budgets displayed for the authenticated user only.
  // The backend's unsafe DELETE /api/budgets route is not used.
  const handleDeleteAllBudgets = async () => {
    if (budgets.length === 0) {
      alert("There are no budgets to delete.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete all your budgets?"
      )
    ) {
      return;
    }

    setIsDeletingAll(true);

    try {
      const results = await Promise.all(
        budgets.map((budget) =>
          apiFetch(`/api/budgets/${budget.id}`, {
            method: "DELETE",
          })
        )
      );

      const failedResponses = results.filter(
        (response) => !response.ok
      );

      if (failedResponses.length > 0) {
        await fetchBudgets();
        throw new Error(
          "Some budgets could not be deleted. Please refresh and try again."
        );
      }

      setBudgets([]);
      setEditId(null);
      setEditVal("");
    } catch (error) {
      console.error("Error deleting budgets:", error);
      alert(error.message || "Could not delete all budgets.");
      await fetchBudgets();
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Generate and save AI-recommended budgets.
  const handleAICustomize = async () => {
    if (
      !monthlyIncome ||
      !Number.isFinite(Number(monthlyIncome)) ||
      Number(monthlyIncome) <= 0
    ) {
      alert("Please enter your valid monthly income!");
      return;
    }

    setIsAiLoading(true);

    try {
      const aiSuggestions = await getAIBudgetRecommendations(
        Number(monthlyIncome),
        financialGoal,
        []
      );

      if (
        !Array.isArray(aiSuggestions) ||
        aiSuggestions.length === 0
      ) {
        throw new Error(
          "No AI recommendations were generated. Please try again."
        );
      }

      for (const suggestion of aiSuggestions) {
        const category = suggestion.cat;
        const amount = Number(suggestion.suggestedBudget);

        if (
          !category ||
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          continue;
        }

        await saveBudget(category, amount);
      }

      setShowAIModal(false);
      setMonthlyIncome("");

      await fetchBudgets();

      alert("Your AI budget plan has been saved successfully!");
    } catch (error) {
      console.error("Error saving AI budget allocations:", error);
      alert(error.message || "Failed to save AI budget allocations.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div
      className={`container my-4 budget-page ${
        visible ? "fade-in" : ""
      }`}
    >
      {/* Header and action buttons */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-1 budget-title">
            Budget Management 🎯
          </h1>

          <p className="text-muted small mb-0">
            Track & Customize smartly with real-time budget tracking
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={handleDeleteAllBudgets}
            disabled={isDeletingAll || budgets.length === 0}
            className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-bold shadow-sm"
          >
            <Trash2 size={16} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>

          <button
            onClick={() => setShowAIModal(true)}
            className="btn btn-ai d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Sparkles size={16} />
            AI Customize
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-gradient d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Plus size={16} />
            Add Budget
          </button>
        </div>
      </div>

      {/* Monthly overview */}
      <div
        className={`card custom-card p-4 mb-4 ${
          totalPct >= 90 ? "border-danger-custom" : ""
        }`}
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-4 text-center">
            <div className="position-relative d-inline-block">
              <CircularProgress
                pct={totalPct}
                colorClass="peach"
                size={120}
              />

              <div className="progress-center-text">
                <span
                  className={`fs-3 fw-bold ${
                    totalPct >= 90 ? "text-coral" : ""
                  }`}
                >
                  {totalPct}%
                </span>

                <span className="small text-muted d-block">
                  Used
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <h2 className="fs-5 fw-bold mb-1">
              Monthly Budget Overview
            </h2>

            <p className="text-muted small mb-3">
              ₹{totalUsed.toLocaleString("en-IN")} of ₹
              {totalBudget.toLocaleString("en-IN")} used
            </p>

            <div className="progress main-progress-bar mb-2">
              <div
                className={`progress-bar ${
                  totalPct >= 90
                    ? "bg-coral"
                    : "bg-peach-gradient"
                }`}
                role="progressbar"
                style={{
                  width: `${Math.min(totalPct, 100)}%`,
                }}
              />
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="small text-muted">
                Spent: ₹{totalUsed.toLocaleString("en-IN")}
              </span>

              <span className="small fw-bold text-mint">
                Remaining: ₹
                {Math.max(
                  0,
                  totalBudget - totalUsed
                ).toLocaleString("en-IN")}
              </span>
            </div>

            {totalPct >= 80 && (
              <div className="alert-custom d-flex align-items-center gap-2 p-3 rounded-3">
                <AlertTriangle
                  size={16}
                  className="text-coral shrink-0"
                />

                <p className="small mb-0">
                  You have used{" "}
                  <strong className="text-coral">
                    {totalPct}%
                  </strong>{" "}
                  of your overall budget. Consider trimming
                  non-essential expenses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Budget category cards */}
      <div className="row g-3">
        {budgets.length === 0 ? (
          <div className="col-12 text-center text-muted py-4">
            No budget limits set yet. Click{" "}
            <strong>"Add Budget"</strong> or{" "}
            <strong>"AI Customize"</strong> to set up limits!
          </div>
        ) : (
          budgets.map((b) => {
            const pct =
              b.budget > 0
                ? Math.round((b.used / b.budget) * 100)
                : 0;

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

                      <div className="progress-center-emoji">
                        {b.emoji}
                      </div>
                    </div>

                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h3 className="fs-6 fw-bold mb-0">
                          {b.cat}
                        </h3>

                        <div className="d-flex align-items-center gap-1">
                          {over && (
                            <AlertTriangle
                              size={14}
                              className="text-coral"
                            />
                          )}

                          {editId === b.id ? (
                            <div className="d-flex align-items-center gap-1 edit-actions-wrapper">
                              <input
                                type="number"
                                min="0"
                                value={editVal}
                                onChange={(e) =>
                                  setEditVal(e.target.value)
                                }
                                className="form-control form-control-sm edit-input"
                                style={{
                                  width: "80px",
                                  fontSize: "12px",
                                }}
                              />

                              <button
                                onClick={saveEdit}
                                disabled={isSaving}
                                className="btn btn-sm btn-save-custom fw-bold py-1 px-2"
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>

                              <button
                                onClick={() => {
                                  setEditId(null);
                                  setEditVal("");
                                }}
                                className="btn btn-sm text-muted p-1"
                                title="Cancel Edit"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center gap-1">
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

                              <button
                                onClick={() =>
                                  handleDelete(b.id, b.cat)
                                }
                                className="btn btn-sm text-danger p-1"
                                title="Delete Budget"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="small text-muted mb-2">
                        ₹{b.used.toLocaleString("en-IN")} / ₹
                        {b.budget.toLocaleString("en-IN")}
                      </p>

                      <div className="progress category-progress-bar mb-1">
                        <div
                          className={`progress-bar ${
                            over ? "bg-coral" : `bg-${b.color}`
                          }`}
                          role="progressbar"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                          }}
                        />
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
                            ? `₹${(
                                b.used - b.budget
                              ).toLocaleString("en-IN")} over!`
                            : `₹${(
                                b.budget - b.used
                              ).toLocaleString("en-IN")} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Customize Modal */}
      {showAIModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Sparkles className="text-ai" size={20} />
                AI Smart Planner
              </h2>

              <button
                onClick={() => setShowAIModal(false)}
                className="btn btn-sm text-muted p-0"
                disabled={isAiLoading}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">
                Monthly Income (₹)
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 50000"
                value={monthlyIncome}
                onChange={(e) =>
                  setMonthlyIncome(e.target.value)
                }
                className="form-control custom-input"
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">
                Financial Goal
              </label>

              <select
                value={financialGoal}
                onChange={(e) =>
                  setFinancialGoal(e.target.value)
                }
                className="form-select custom-input"
              >
                <option value="Save More Money">
                  Save More Money (50/30/20 Rule)
                </option>

                <option value="Aggressive Debt Payoff">
                  Payoff Loans & Bills Fast
                </option>

                <option value="Student Budget">
                  Student Low-Budget Plan
                </option>

                <option value="Balanced Spending">
                  Balanced Spending Strategy
                </option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowAIModal(false)}
                disabled={isAiLoading}
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

      {/* Add Budget Modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0">
                Set New Budget 🎯
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm text-muted p-0"
                disabled={isSaving}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">
                Category
              </label>

              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="form-select custom-input"
              >
                {Object.keys(categoryMeta).map((catName) => (
                  <option key={catName} value={catName}>
                    {categoryMeta[catName].emoji} {catName}
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
                min="1"
                placeholder="e.g. 5000"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="form-control custom-input"
              />
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleAddBudget}
                disabled={isSaving}
                className="btn btn-gradient w-50 rounded-pill text-white fw-bold"
              >
                {isSaving ? "Saving..." : "Save Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
