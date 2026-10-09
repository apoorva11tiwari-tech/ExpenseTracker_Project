import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "../../config/apiFetch";

import {
  Plus,
  X,
  Edit2,
  Trash2,
  PlusCircle,
  Award,
  Target,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";

import "./GoalSavings.css";

const colorThemes = ["indigo", "purple", "pink", "violet", "lavender"];

const initialFormData = {
  name: "",
  emoji: "🎯",
  target: "",
  saved: "0",
  priority: "Medium",
  deadline: "",
};

const readResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

export default function GoalSavings() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [addMoneyId, setAddMoneyId] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [celebrating, setCelebrating] = useState(null);

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateAmount, setAllocateAmount] = useState("");
  const [isAllocating, setIsAllocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  // Fetch only the signed-in user's goals.
  // The backend must also filter goals by the authenticated user's UID.
  const fetchGoals = useCallback(async () => {
    setError("");

    try {
      const res = await apiFetch("/api/goals");
      const data = await readResponse(res);

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response while loading goals.");
      }

      const formatted = data.map((g, index) => ({
        id: g._id,
        name: g.title,
        emoji: g.category || "🎯",
        target: Number(g.targetAmount || 0),
        saved: Number(g.savedAmount || 0),
        priority: g.priority || "Medium",

        // A date input requires YYYY-MM-DD, not a localized date.
        deadline: g.targetDate
          ? new Date(g.targetDate).toISOString().slice(0, 10)
          : "",

        theme: colorThemes[index % colorThemes.length],
      }));

      setGoals(formatted);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError(err.message || "Could not load your savings goals.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // AI allocation
  const handleAIAllocate = async (e) => {
    e.preventDefault();

    const amount = Number(allocateAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    setIsAllocating(true);
    setError("");

    try {
      const res = await apiFetch("/api/ai/allocate", {
        method: "POST",
        body: JSON.stringify({
          availableSavings: amount,
        }),
      });

      const data = await readResponse(res);

      if (data.success) {
        setShowAllocateModal(false);
        setAllocateAmount("");
        await fetchGoals();
      } else {
        alert(data.message || "Could not complete allocation.");
      }
    } catch (err) {
      console.error("AI Allocation error:", err);
      alert(err.message || "AI allocation failed. Please try again.");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingGoalId(null);
    setFormData({ ...initialFormData });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoalId(goal.id);

    setFormData({
      name: goal.name,
      emoji: goal.emoji || "🎯",
      target: String(goal.target),
      saved: String(goal.saved),
      priority: goal.priority || "Medium",
      deadline: goal.deadline || "",
    });

    setError("");
    setShowModal(true);
  };

  // Create or update a goal
  const handleSaveGoal = async (e) => {
    e.preventDefault();

    const title = formData.name.trim();
    const targetNum = Number(formData.target);
    const savedNum = Number(formData.saved);

    if (!title) {
      alert("Please enter a goal name.");
      return;
    }

    if (!Number.isFinite(targetNum) || targetNum <= 0) {
      alert("Please enter a valid target amount greater than zero.");
      return;
    }

    if (!Number.isFinite(savedNum) || savedNum < 0) {
      alert("Please enter a valid saved amount.");
      return;
    }

    if (!["High", "Medium", "Low"].includes(formData.priority)) {
      alert("Please select a valid priority.");
      return;
    }

    const payload = {
      title,
      targetAmount: targetNum,
      savedAmount: Math.min(savedNum, targetNum),
      category: formData.emoji.trim() || "🎯",
      priority: formData.priority,
      targetDate: formData.deadline || null,
    };

    setIsSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingGoalId);

      const res = isEditing
        ? await apiFetch(`/api/goals/${editingGoalId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch("/api/goals", {
            method: "POST",
            body: JSON.stringify(payload),
          });

      const result = await readResponse(res);

      if (
        !isEditing &&
        savedNum >= targetNum &&
        targetNum > 0
      ) {
        setCelebrating(result._id);
      }

      setShowModal(false);
      setEditingGoalId(null);
      setFormData({ ...initialFormData });

      await fetchGoals();
    } catch (err) {
      console.error("Error saving goal:", err);
      setError(err.message || "Could not save the goal.");
      alert(err.message || "Could not save the goal.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a goal
  const deleteGoal = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this savings goal?"
      )
    ) {
      return;
    }

    setError("");

    try {
      const res = await apiFetch(`/api/goals/${id}`, {
        method: "DELETE",
      });

      await readResponse(res);
      await fetchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert(err.message || "Could not delete the goal.");
    }
  };

  // Add money to a goal
  const addMoney = async (customVal) => {
    const amount =
      customVal !== undefined ? Number(customVal) : Number(addAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter an amount greater than zero.");
      return;
    }

    if (addMoneyId === null) return;

    const goalId = addMoneyId;
    setError("");

    try {
      const res = await apiFetch(`/api/goals/${goalId}`, {
        method: "PUT",
        body: JSON.stringify({
          addAmount: amount,
        }),
      });

      const updated = await readResponse(res);

      if (
        Number(updated.savedAmount) >= Number(updated.targetAmount)
      ) {
        setCelebrating(goalId);
      }

      setAddMoneyId(null);
      setAddAmount("");
      await fetchGoals();
    } catch (err) {
      console.error("Error adding funds to goal:", err);
      alert(err.message || "Could not add money to the goal.");
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

  const completion =
    totalTarget > 0
      ? Math.round((totalSaved / totalTarget) * 100)
      : 0;

  return (
    <div className="container my-4 goals-page">
      {/* Error message */}
      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss"
            onClick={() => setError("")}
          />
        </div>
      )}

      {/* Celebration Popup */}
      {celebrating !== null && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 text-center shadow-lg animate-pop">
            <div className="fs-1 mb-2">🎉</div>

            <h2 className="fs-4 fw-bold text-dark mb-1">
              Goal Achieved!
            </h2>

            <p className="text-muted small mb-4">
              Awesome work! You smashed your savings goal! 🚀
            </p>

            <button
              onClick={() => setCelebrating(null)}
              className="btn btn-purple text-white fw-bold w-100 rounded-pill py-2"
            >
              Woohoo! 🎊
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="fw-bold fs-3 mb-1 goals-title">
            Savings Goals 🏆
          </h1>

          <p className="text-muted small mb-0">
            Give your hard-earned money something awesome to work toward
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button
            onClick={() => setShowAllocateModal(true)}
            className="btn btn-ai-sparkle d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Sparkles size={16} /> ✨ AI Allocate
          </button>

          <button
            onClick={openCreateModal}
            className="btn btn-gradient-purple d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-white fw-bold shadow-sm"
          >
            <Plus size={16} /> New Goal
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card custom-card p-3 d-flex flex-row align-items-center gap-3">
            <div className="icon-circle bg-purple-subtle">
              <TrendingUp size={20} className="text-purple" />
            </div>

            <div>
              <span className="small text-muted d-block fw-medium">
                Total Saved
              </span>

              <h3 className="fs-5 fw-bold text-purple mb-0">
                ₹{totalSaved.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card custom-card p-3 d-flex flex-row align-items-center gap-3">
            <div className="icon-circle bg-indigo-subtle">
              <Target size={20} className="text-indigo" />
            </div>

            <div>
              <span className="small text-muted d-block fw-medium">
                Total Target
              </span>

              <h3 className="fs-5 fw-bold text-dark mb-0">
                ₹{totalTarget.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card custom-card p-3 d-flex flex-row align-items-center gap-3">
            <div className="icon-circle bg-pink-subtle">
              <Sparkles size={20} className="text-pink" />
            </div>

            <div>
              <span className="small text-muted d-block fw-medium">
                Overall Progress
              </span>

              <h3 className="fs-5 fw-bold text-pink mb-0">
                {completion}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="text-center py-5">
          <Loader2 size={30} className="animate-spin text-purple" />
          <p className="text-muted mt-2 mb-0">Loading your goals...</p>
        </div>
      ) : (
        <div className="row g-3">
          {goals.length === 0 ? (
            <div className="col-12 text-center text-muted py-5 card custom-card">
              <div className="fs-1 mb-2">🏆</div>

              <h4 className="fw-bold fs-5 text-dark">
                No savings goals created yet
              </h4>

              <p className="small text-muted mb-3">
                Set up a target to track your progress automatically.
              </p>

              <div>
                <button
                  onClick={openCreateModal}
                  className="btn btn-gradient-purple text-white fw-bold rounded-pill px-4 py-2"
                >
                  Create Your First Goal
                </button>
              </div>
            </div>
          ) : (
            goals.map((g) => {
              const pct =
                g.target > 0
                  ? Math.min(Math.round((g.saved / g.target) * 100), 100)
                  : 0;

              const done = pct >= 100;

              const priorityBadge =
                g.priority === "High"
                  ? "badge-priority-high"
                  : g.priority === "Low"
                  ? "badge-priority-low"
                  : "badge-priority-med";

              const displayDeadline = g.deadline
                ? new Date(`${g.deadline}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    { month: "short", year: "numeric" }
                  )
                : "No deadline";

              return (
                <div className="col-12 col-md-6" key={g.id}>
                  <div
                    className={`card custom-card p-3 ${
                      done ? "border-purple-custom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`goal-emoji-box bg-${g.theme}-subtle`}
                        >
                          {g.emoji}
                        </div>

                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <h3 className="fs-6 fw-bold mb-0 text-dark">
                              {g.name}
                            </h3>

                            <span className={`badge ${priorityBadge}`}>
                              {g.priority}
                            </span>
                          </div>

                          <span className="small text-muted">
                            Target: {displayDeadline}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-1">
                        <button
                          onClick={() => openEditModal(g)}
                          className="btn btn-sm text-muted p-1"
                          title="Edit Goal"
                          aria-label={`Edit ${g.name}`}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="btn btn-sm text-danger p-1"
                          title="Delete Goal"
                          aria-label={`Delete ${g.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>
                          Saved:{" "}
                          <strong className="text-dark">
                            ₹{g.saved.toLocaleString("en-IN")}
                          </strong>
                        </span>

                        <span>
                          Target:{" "}
                          <strong className="text-dark">
                            ₹{g.target.toLocaleString("en-IN")}
                          </strong>
                        </span>
                      </div>

                      <div className="progress goal-progress-bar">
                        <div
                          className={`progress-bar ${
                            done ? "bg-purple" : `bg-${g.theme}`
                          }`}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Contribution / Bottom Actions */}
                    {addMoneyId === g.id ? (
                      <div className="bg-light p-2 rounded-3 mt-2">
                        <div className="d-flex align-items-center gap-1 mb-2">
                          <button
                            onClick={() => addMoney(500)}
                            className="btn btn-sm btn-outline-purple flex-fill py-1 fw-bold"
                            style={{ fontSize: "11px" }}
                          >
                            +₹500
                          </button>

                          <button
                            onClick={() => addMoney(1000)}
                            className="btn btn-sm btn-outline-purple flex-fill py-1 fw-bold"
                            style={{ fontSize: "11px" }}
                          >
                            +₹1k
                          </button>

                          <button
                            onClick={() => addMoney(5000)}
                            className="btn btn-sm btn-outline-purple flex-fill py-1 fw-bold"
                            style={{ fontSize: "11px" }}
                          >
                            +₹5k
                          </button>
                        </div>

                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder="Custom ₹"
                            className="form-control form-control-sm custom-input py-1 px-2"
                            style={{ fontSize: "12px" }}
                          />

                          <button
                            onClick={() => addMoney()}
                            className="btn btn-sm btn-purple text-white fw-bold py-1 px-3"
                          >
                            Add
                          </button>

                          <button
                            onClick={() => {
                              setAddMoneyId(null);
                              setAddAmount("");
                            }}
                            className="btn btn-sm text-muted p-1"
                            aria-label="Cancel adding money"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-between pt-2">
                        <span
                          className={`fw-bold small ${
                            done ? "text-purple" : "text-pink"
                          }`}
                        >
                          {pct}% Achieved
                        </span>

                        {done ? (
                          <span className="badge bg-purple-subtle text-purple fw-bold d-flex align-items-center gap-1 px-2 py-1 rounded-pill">
                            <Award size={12} />
                            Goal Achieved!
                          </span>
                        ) : (
                          <button
                            onClick={() => setAddMoneyId(g.id)}
                            className="btn btn-sm text-purple fw-bold p-0 d-flex align-items-center gap-1"
                          >
                            <PlusCircle size={14} />
                            Add Money
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* AI ALLOCATE MODAL */}
      {showAllocateModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg animate-pop">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-purple" />
                AI Smart Allocation
              </h2>

              <button
                onClick={() => setShowAllocateModal(false)}
                className="btn btn-sm text-muted p-0"
                aria-label="Close allocation modal"
              >
                <X size={18} />
              </button>
            </div>

            <p className="small text-muted mb-3">
              Enter your available monthly savings or bonus. The AI will
              distribute it across active goals based on their priority
              level and target date proximity.
            </p>

            <form onSubmit={handleAIAllocate}>
              <div className="mb-4">
                <label className="form-label small fw-bold">
                  Amount to Distribute (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="form-control custom-input"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
                  disabled={isAllocating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAllocating}
                  className="btn btn-ai-sparkle w-50 rounded-pill text-white fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                  {isAllocating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}

                  {isAllocating ? "Allocating..." : "Distribute ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom card p-4 shadow-lg animate-pop">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-5 fw-bold mb-0 text-dark">
                {editingGoalId ? "Edit Goal ✏️" : "Create Savings Goal 🏆"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm text-muted p-0"
                aria-label="Close goal modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal}>
              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Emoji Icon
                </label>

                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleInputChange}
                  placeholder="e.g. 🎯, 🚲, 💻"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Goal Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. New Laptop"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Target Amount (₹)
                </label>

                <input
                  type="number"
                  name="target"
                  min="1"
                  required
                  value={formData.target}
                  onChange={handleInputChange}
                  placeholder="60000"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Current Saved (₹)
                </label>

                <input
                  type="number"
                  name="saved"
                  min="0"
                  value={formData.saved}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Priority Level
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select custom-input"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">
                  Target Date
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-gradient-purple w-50 rounded-pill text-white fw-bold"
                >
                  {isSaving
                    ? "Saving..."
                    : editingGoalId
                    ? "Update Goal 🚀"
                    : "Create Goal 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}