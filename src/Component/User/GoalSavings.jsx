import { useState } from "react";
import { Plus, X, Edit2, Trash2, PlusCircle } from "lucide-react";
import "./GoalSavings.css";
const confettiColors = [
  "var(--coral)",
  "var(--peach)",
  "var(--lavender)",
  "var(--mint)",
  "#FFD700",
  "#FF69B4",
];

const colorOptions = [
  "var(--lavender)",
  "var(--peach)",
  "var(--mint)",
  "var(--coral)",
  "#B8A9D9",
];

function Confetti() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            top: `${Math.random() * 60 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            background: confettiColors[i % confettiColors.length],
            animationDelay: `${Math.random() * 0.6}s`,
            animationDuration: `${0.8 + Math.random() * 0.6}s`,
            width: Math.random() > 0.5 ? 10 : 6,
            height: Math.random() > 0.5 ? 10 : 6,
          }}
        />
      ))}
    </>
  );
}

export default function Goalsavings() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [addMoneyId, setAddMoneyId] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [celebrating, setCelebrating] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    emoji: "🎯",
    target: "",
    saved: "",
    deadline: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingGoalId(null);
    setFormData({
      name: "",
      emoji: "🎯",
      target: "",
      saved: "0",
      deadline: "",
    });
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoalId(goal.id);
    setFormData({
      name: goal.name,
      emoji: goal.emoji,
      target: goal.target.toString(),
      saved: goal.saved.toString(),
      deadline: goal.deadline,
    });
    setShowModal(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) return;

    const targetNum = Number(formData.target);
    const savedNum = Number(formData.saved) || 0;

    if (editingGoalId) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoalId
            ? {
                ...g,
                name: formData.name,
                emoji: formData.emoji || "🎯",
                target: targetNum,
                saved: Math.min(savedNum, targetNum),
                deadline: formData.deadline || "No deadline",
              }
            : g
        )
      );
    } else {
      const newGoal = {
        id: Date.now(),
        name: formData.name,
        emoji: formData.emoji || "🎯",
        target: targetNum,
        saved: Math.min(savedNum, targetNum),
        deadline: formData.deadline || "No deadline",
        color: colorOptions[goals.length % colorOptions.length],
      };

      setGoals((prev) => [...prev, newGoal]);

      if (savedNum >= targetNum && targetNum > 0) {
        setCelebrating(newGoal.id);
      }
    }

    setShowModal(false);
  };

  const deleteGoal = (id) => {
    setGoals((g) => g.filter((x) => x.id !== id));
  };

  const addMoney = () => {
    if (addMoneyId !== null) {
      const amt = Number(addAmount);

      if (!amt || amt <= 0) return;

      setGoals((g) =>
        g.map((x) => {
          if (x.id !== addMoneyId) return x;

          const newSaved = Math.min(x.saved + amt, x.target);

          if (newSaved >= x.target) {
            setCelebrating(x.id);
          }

          return {
            ...x,
            saved: newSaved,
          };
        })
      );

      setAddMoneyId(null);
      setAddAmount("");
    }
  };

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  const completion =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="p-5 md:p-6 max-w-5xl mx-auto space-y-5 page-enter">
      {/* Celebrate Overlay */}
      {celebrating !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in pointer-events-none">
          <Confetti />
          <div
            className="rounded-3xl p-8 text-center shadow-2xl border animate-celebrate pointer-events-auto"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="text-6xl mb-4 animate-bounce-soft">🎉</div>
            <h2
              className="font-extrabold text-2xl mb-2"
              style={{ color: "var(--text)" }}
            >
              Goal Achieved!
            </h2>
            <p className="text-base mb-4" style={{ color: "var(--text-2)" }}>
              Congratulations! You smashed your savings goal! 🚀
            </p>
            <button
              onClick={() => setCelebrating(null)}
              className="px-6 py-2.5 rounded-2xl text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--coral), var(--peach))",
              }}
            >
              Woohoo! 🎊
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-extrabold text-2xl md:text-3xl mb-1"
            style={{ color: "var(--text)" }}
          >
            Savings Goals 🏆
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Give your money something to work toward
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--coral), var(--peach))",
          }}
        >
          <Plus size={15} />
          New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Saved",
            value:
              totalSaved >= 1000
                ? `₹${(totalSaved / 1000).toFixed(1)}k`
                : `₹${totalSaved}`,
            emoji: "💰",
          },
          {
            label: "Total Target",
            value:
              totalTarget >= 1000
                ? `₹${(totalTarget / 1000).toFixed(1)}k`
                : `₹${totalTarget}`,
            emoji: "🎯",
          },
          {
            label: "Completion",
            value: `${completion}%`,
            emoji: "✨",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card-hover rounded-3xl border p-5"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="text-2xl mb-2">{s.emoji}</div>
            <p
              className="font-extrabold text-2xl mb-0.5"
              style={{ color: "var(--coral)" }}
            >
              {s.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
          const done = pct >= 100;

          return (
            <div
              key={g.id}
              className="card-hover rounded-3xl border p-5 relative overflow-hidden"
              style={{
                background: "var(--card)",
                borderColor: done ? g.color : "var(--border)",
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {/* Completed Goal Decoration */}
              {done && (
                <div
                  className="blob w-32 h-32 -top-10 -right-10 animate-glow"
                  style={{
                    background: g.color,
                    opacity: 0.15,
                  }}
                />
              )}

              {/* Goal Header */}
              <div className="relative flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: `${g.color}20`,
                    }}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base"
                      style={{ color: "var(--text)" }}
                    >
                      {g.name}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Target: {g.deadline}
                    </p>
                  </div>
                </div>

                {/* Edit / Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(g)}
                    className="p-1.5 rounded-xl transition-all hover:scale-110"
                    style={{ color: "var(--muted)" }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="p-1.5 rounded-xl transition-all hover:scale-110 hover:text-red-400"
                    style={{ color: "var(--muted)" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: "var(--text-2)" }}>
                    Saved:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      ₹{g.saved.toLocaleString()}
                    </strong>
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-2)" }}>
                    Target:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      ₹{g.target.toLocaleString()}
                    </strong>
                  </span>
                </div>

                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{
                    background: "var(--border)",
                  }}
                >
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{
                      width: `${pct}%`,
                      background: done
                        ? "linear-gradient(90deg, var(--mint), #52d9b8)"
                        : `linear-gradient(90deg, ${g.color}, ${g.color}cc)`,
                    }}
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between">
                <span
                  className="font-extrabold text-lg"
                  style={{
                    color: done ? "var(--mint)" : g.color,
                  }}
                >
                  {pct}%
                </span>

                {done ? (
                  <span
                    className="text-sm font-bold animate-bounce-soft"
                    style={{ color: "var(--mint)" }}
                  >
                    🎉 Goal Achieved!
                  </span>
                ) : addMoneyId === g.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="₹ Amount"
                      className="w-24 rounded-xl px-3 py-1.5 text-xs outline-none"
                      style={{
                        background: "var(--bg-alt)",
                        border: "1.5px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <button
                      onClick={addMoney}
                      className="text-xs px-3 py-1.5 rounded-xl text-white font-bold"
                      style={{
                        background: "var(--coral)",
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setAddMoneyId(null)}
                      style={{ color: "var(--muted)" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddMoneyId(g.id)}
                    className="flex items-center gap-1 text-xs font-bold transition-all hover:opacity-70"
                    style={{ color: g.color }}
                  >
                    <PlusCircle size={14} />
                    Add Money
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div
          className="text-center py-20 rounded-3xl border"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="text-6xl mb-4 animate-float">🏆</div>
          <h3
            className="font-bold text-xl mb-2"
            style={{ color: "var(--text)" }}
          >
            No goals created
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            Give your money something to work toward.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-2xl text-white text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, var(--coral), var(--peach))",
            }}
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="rounded-3xl p-6 w-full max-w-sm shadow-2xl border animate-celebrate"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-bold text-xl"
                style={{ color: "var(--text)" }}
              >
                {editingGoalId ? "Edit Goal ✏️" : "Create Savings Goal 🏆"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ color: "var(--muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label
                  className="text-sm font-bold block mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  Emoji Icon
                </label>
                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleInputChange}
                  placeholder="e.g. 🎯, 🚲, 💻"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-bold block mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  Goal Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. New Bike"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-bold block mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  name="target"
                  required
                  value={formData.target}
                  onChange={handleInputChange}
                  placeholder="50000"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-bold block mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  Current Saved (₹)
                </label>
                <input
                  type="number"
                  name="saved"
                  value={formData.saved}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-bold block mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  Target Date
                </label>
                <input
                  type="text"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  placeholder="e.g. Dec 2026"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl py-3 text-sm font-bold border transition-all hover:opacity-70"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-2)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl py-3 text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--coral), var(--peach))",
                  }}
                >
                  {editingGoalId ? "Update Goal 🚀" : "Create Goal 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}