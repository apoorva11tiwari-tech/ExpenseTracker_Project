import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Brain, RefreshCw, ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  AlertTriangle, Lightbulb, Clock, Zap, ShieldCheck,
  CalendarDays, Sparkles, BotMessageSquare
} from "lucide-react";
import "./AIInsights.css";

// Helper Sub-Components
function TrendChip({ trend }) {
  if (trend === "up") {
    return (
      <span className="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1">
        <TrendingUp size={10} /> Up
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
        <TrendingDown size={10} /> Down
      </span>
    );
  }
  return <span className="badge bg-primary-subtle text-primary">Stable</span>;
}

function ProblemCard({ item }) {
  const [open, setOpen] = useState(false);
  const isHigh = item.severity === "high";

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
      <button
        className="card-header bg-white border-0 p-3 text-start d-flex align-items-center justify-content-between"
        onClick={() => setOpen(!open)}
      >
        <div className="d-flex align-items-center gap-3">
          <span className="fs-3">{item.emoji || "⚠️"}</span>
          <div>
            <span className={`badge ${isHigh ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning-emphasis"} mb-1`}>
              {isHigh ? "🔴 High" : "🟡 Medium"}
            </span>
            <h6 className="mb-0 fw-bold text-dark">{item.problem}</h6>
          </div>
        </div>
        <div className="text-secondary">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="card-body bg-light border-top p-3">
          <div className="bg-white p-3 rounded-3 mb-2 border">
            <small className="text-uppercase fw-bold text-muted d-block mb-1">Why this happens</small>
            <p className="small mb-0 text-secondary">{item.reason}</p>
          </div>
          <div className="bg-success-subtle p-3 rounded-3 mb-3 border border-success-subtle">
            <small className="text-uppercase fw-bold text-success d-block mb-1">🤖 AI Solution</small>
            <p className="small mb-0 text-dark">{item.solution}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Potential saving</small>
            <span className="fw-bold text-success fs-5">{item.saving}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIInsights() {
  const [chartRange, setChartRange] = useState("6M");
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [predictionBars, setPredictionBars] = useState([]);

  // Fetch AI budget recommendations from backend on load
  useEffect(() => {
    const fetchAiRecommendations = async () => {
      try {
        const income = localStorage.getItem("userIncome") || "50000";
        const response = await fetch("http://localhost:5000/api/ai/budget-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            monthlyIncome: Number(income),
            financialGoal: "Save More Money"
          }),
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          const formattedRecs = data.map((item) => ({
            label: `${item.cat} Budget`,
            desc: `AI recommends allocating ₹${item.suggestedBudget.toLocaleString("en-IN")} for ${item.cat}.`,
            theme: "success",
            icon: Zap,
            action: "Apply Budget"
          }));
          setRecommendations(formattedRecs);

          const formattedPredictions = data.map((item) => ({
            label: item.cat,
            amount: item.suggestedBudget,
            colorClass: "bg-success"
          }));
          setPredictionBars(formattedPredictions);
        }
      } catch (error) {
        console.error("Failed to fetch AI budget recommendations:", error);
      }
    };

    fetchAiRecommendations();
  }, []);

  const currentSpend = 0;
  const avgSpend = 0;
  const totalPredicted = predictionBars.reduce((sum, item) => sum + item.amount, 0);

  function handleRefresh() {
    setLoading(true);
    setRefreshed(false);
    setTimeout(() => {
      setLoading(false);
      setRefreshed(true);
      setTimeout(() => setRefreshed(false), 2500);
    }, 1500);
  }

  const chartData = [];

  return (
    <div className="container py-4 max-w-custom">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="icon-badge bg-gradient-brand text-white rounded-3 p-2 d-flex align-items-center justify-content-center">
              <Brain size={20} />
            </div>
            <h2 className="fw-bold mb-0">AI Historical Insights</h2>
          </div>
          <small className="text-muted">Powered by SmartSpend AI</small>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn btn-brand text-white fw-bold px-3 py-2 rounded-3 d-flex align-items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          {loading ? "Analyzing…" : refreshed ? "✓ Updated!" : "Refresh AI"}
        </button>
      </div>

      {/* AI Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-4">📊</span>
              <span className="badge bg-light text-secondary border">AI</span>
            </div>
            <h3 className="fw-bold text-coral mb-0">₹{currentSpend.toLocaleString()}</h3>
            <div className="fw-semibold small text-dark">Current Month Spending</div>
            <small className="text-muted">Based on recorded transactions</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-4">📆</span>
              <span className="badge bg-light text-secondary border">AI</span>
            </div>
            <h3 className="fw-bold text-lavender mb-0">₹{avgSpend.toLocaleString()}</h3>
            <div className="fw-semibold small text-dark">Avg Monthly</div>
            <small className="text-muted">Historical monthly average</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-4">💡</span>
              <span className="badge bg-light text-secondary border">AI</span>
            </div>
            <h3 className="fw-bold text-mint mb-0">₹{totalPredicted.toLocaleString()}</h3>
            <div className="fw-semibold small text-dark">AI Savings Potential</div>
            <small className="text-muted">Based on optimized recommendations</small>
          </div>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="d-flex align-items-start gap-3">
          <div className="icon-badge bg-gradient-brand text-white rounded-3 p-2 d-flex align-items-center justify-content-center shrink-0">
            <BotMessageSquare size={20} />
          </div>
          <div>
            <h6 className="fw-bold mb-1">🤖 AI Summary</h6>
            <p className="small text-secondary mb-0">
              AI analysis is active based on your income goals and baseline budgets.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Comparison Chart */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-0">Historical Comparison</h5>
            <small className="text-muted">Your spending vs your average</small>
          </div>
          <div className="btn-group bg-light p-1 rounded-3">
            {["7D", "30D", "6M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => setChartRange(range)}
                className={`btn btn-sm rounded-2 border-0 fw-bold ${chartRange === range ? "bg-white text-coral shadow-sm" : "text-muted"}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-5 text-muted border rounded-3 bg-light">
          <p className="mb-0 small">No historical transaction data available for this range.</p>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
          <Sparkles size={18} className="text-mint" />
          Smart Recommendations
        </h5>
        {recommendations.length > 0 ? (
          <div className="row g-3">
            {recommendations.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100 d-flex flex-row align-items-start gap-3">
                    <div className={`p-2 rounded-3 bg-${r.theme}-subtle text-${r.theme}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">{r.label}</h6>
                      <p className="small text-secondary mb-2">{r.desc}</p>
                      <button className={`btn btn-sm btn-outline-${r.theme} fw-bold rounded-2`}>
                        {r.action} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card border-0 shadow-sm p-4 text-center text-muted">
            <p className="mb-0 small">Loading AI budget recommendations...</p>
          </div>
        )}
      </div>

      {/* AI Savings Prediction */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-1">
          <Lightbulb size={18} className="text-warning" />
          AI Savings Prediction
        </h5>
        <p className="small text-muted mb-4">Potential allocations when following AI suggestions</p>

        {predictionBars.length > 0 ? (
          <div className="row g-4 align-items-center">
            <div className="col-md-7">
              {predictionBars.map((b) => {
                const pct = totalPredicted > 0 ? Math.round((b.amount / totalPredicted) * 100) : 0;
                return (
                  <div key={b.label} className="mb-3">
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span>{b.label}</span>
                      <span>₹{b.amount.toLocaleString()}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: "8px" }}>
                      <div className={`progress-bar rounded-pill ${b.colorClass}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-5">
              <div className="bg-success-subtle p-4 rounded-4 text-center border border-success-subtle">
                <small className="text-uppercase fw-bold text-success d-block mb-1">Total Allocated</small>
                <h2 className="fw-bold text-success mb-1">₹{totalPredicted.toLocaleString()}</h2>
                <small className="text-muted d-block mb-3">per month estimated</small>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted border rounded-3 bg-light">
            <p className="mb-0 small">No prediction metrics available.</p>
          </div>
        )}
      </div>

      <p className="text-center small text-muted">
        🤖 AI insights are generated from your transaction patterns and are for guidance only.
      </p>
    </div>
  );
}