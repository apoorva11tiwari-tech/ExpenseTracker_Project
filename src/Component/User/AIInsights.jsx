import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Brain, RefreshCw, ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  AlertTriangle, Lightbulb, Target, Clock, Zap, ShieldCheck,
  CalendarDays, Repeat, Sparkles, BotMessageSquare
} from "lucide-react";
import "./AIInsights.css";

// Mock Data
const historicalData = {
  "7D": [
    { label: "Mon", spend: 820, avg: 900 },
    { label: "Tue", spend: 450, avg: 700 },
    { label: "Wed", spend: 1200, avg: 800 },
    { label: "Thu", spend: 670, avg: 650 },
    { label: "Fri", spend: 1580, avg: 1100 },
    { label: "Sat", spend: 2100, avg: 1400 },
    { label: "Sun", spend: 980, avg: 900 }
  ],
  "30D": [
    { label: "W1", spend: 5800, avg: 6200 },
    { label: "W2", spend: 7200, avg: 6500 },
    { label: "W3", spend: 4900, avg: 6000 },
    { label: "W4", spend: 8100, avg: 6800 }
  ],
  "6M": [
    { label: "Apr", spend: 22000, avg: 24000 },
    { label: "May", spend: 19500, avg: 23000 },
    { label: "Jun", spend: 26000, avg: 24500 },
    { label: "Jul", spend: 21000, avg: 23800 },
    { label: "Aug", spend: 28500, avg: 25000 },
    { label: "Sep", spend: 24200, avg: 24500 }
  ],
  "1Y": [
    { label: "Oct", spend: 18000, avg: 20000 },
    { label: "Nov", spend: 22000, avg: 21000 },
    { label: "Dec", spend: 31000, avg: 28000 },
    { label: "Jan", spend: 19500, avg: 21000 },
    { label: "Feb", spend: 17800, avg: 20000 },
    { label: "Mar", spend: 21000, avg: 21500 },
    { label: "Apr", spend: 22000, avg: 22000 },
    { label: "May", spend: 19500, avg: 21500 },
    { label: "Jun", spend: 26000, avg: 22800 },
    { label: "Jul", spend: 21000, avg: 22500 },
    { label: "Aug", spend: 28500, avg: 23500 },
    { label: "Sep", spend: 24200, avg: 23800 }
  ]
};

const patterns = [
  { icon: "🍔", label: "Top Category", value: "Food & Dining", detail: "32% of total spend", trend: "up", colorClass: "text-coral" },
  { icon: "🔁", label: "Recurring Costs", value: "₹8,420 / mo", detail: "Netflix, Spotify, Gym, Rent", trend: "stable", colorClass: "text-lavender" },
  { icon: "📅", label: "Weekend Spending", value: "2.4× weekdays", detail: "Avg ₹2,800 on Sat–Sun", trend: "up", colorClass: "text-peach" },
  { icon: "⚡", label: "Impulse Buys", value: "₹4,200", detail: "Detected 9 unplanned txns", trend: "down", colorClass: "text-mint" },
  { icon: "🌙", label: "Late-night Spends", value: "₹1,650", detail: "After 10 PM this month", trend: "stable", colorClass: "text-primary" },
  { icon: "📈", label: "MoM Growth", value: "+18.4%", detail: "vs ₹20,400 last month", trend: "up", colorClass: "text-gold" }
];

const problems = [
  {
    emoji: "🍽️",
    problem: "Food spending 48% over target",
    reason: "You dine out 5× per week on average. Swiggy alone accounts for ₹3,200 this month.",
    solution: "Set a weekly food cap of ₹1,500 and cook at home at least 3 weekdays.",
    saving: "₹2,800 / month",
    severity: "high"
  },
  {
    emoji: "🛍️",
    problem: "Weekend impulse purchases spike",
    reason: "Saturday shopping events triggered 6 large unplanned purchases averaging ₹890 each.",
    solution: "Install a 24-hour cart-hold rule. Add items to wishlist — only buy next day.",
    saving: "₹4,100 / month",
    severity: "high"
  },
  {
    emoji: "📺",
    problem: "4 overlapping streaming subs",
    reason: "Netflix, Prime, Hotstar, and SonyLiv — total ₹1,540/mo but usage data shows only 2 are active.",
    solution: "Cancel Netflix + Hotstar (lower usage). Save ₹940 immediately.",
    saving: "₹940 / month",
    severity: "medium"
  },
  {
    emoji: "☕",
    problem: "Daily café visits add up fast",
    reason: "16 café visits this month at an average of ₹180 each. That's ₹2,880 on beverages alone.",
    solution: "Brew coffee at home 4 of 5 weekdays. Allow 1 café day as a treat.",
    saving: "₹2,100 / month",
    severity: "medium"
  }
];

const recommendations = [
  { icon: Target, label: "Set Food Budget", desc: "Cap dining at ₹6,000/mo to reduce overspend", action: "Apply Budget", theme: "coral" },
  { icon: Repeat, label: "Auto-save ₹2,000", desc: "Move savings to a separate account on salary day", action: "Set Reminder", theme: "mint" },
  { icon: Zap, label: "Cancel 2 Subs", desc: "Save ₹940/mo by dropping inactive streaming plans", action: "View Subs", theme: "lavender" },
  { icon: ShieldCheck, label: "Emergency Fund", desc: "3-month buffer goal: ₹75,000 — you're 38% there", action: "View Goal", theme: "peach" }
];

const insightHistory = [
  { date: "Sep 10, 2025", title: "September Mid-Month Review", tags: ["Food", "Impulse"], summary: "Food budget exceeded by 32%. 6 impulse purchases detected on weekends." },
  { date: "Aug 31, 2025", title: "August Wrap-up Analysis", tags: ["Savings", "Bills"], summary: "Saved ₹3,200 more than August 2024. Utilities down 12% from A/C reduction." },
  { date: "Aug 15, 2025", title: "Midmonth Pattern Alert", tags: ["Dining", "Weekend"], summary: "Weekend dining spike of 2.1× weekday average. Suggested meal prep routine." },
  { date: "Jul 31, 2025", title: "July Full Review", tags: ["Shopping", "Subscriptions"], summary: "3 duplicate subscriptions found. Total wasted: ₹1,200. Goal progress: 62%." }
];

const predictionBars = [
  { label: "Food Fix", amount: 2800, colorClass: "bg-coral" },
  { label: "Weekend", amount: 4100, colorClass: "bg-peach" },
  { label: "Subs", amount: 940, colorClass: "bg-lavender" },
  { label: "Café", amount: 2100, colorClass: "bg-primary" }
];

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
          <span className="fs-3">{item.emoji}</span>
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

  function handleRefresh() {
    setLoading(true);
    setRefreshed(false);
    setTimeout(() => {
      setLoading(false);
      setRefreshed(true);
      setTimeout(() => setRefreshed(false), 2500);
    }, 1500);
  }

  const chartData = historicalData[chartRange];
  const totalPredicted = predictionBars.reduce((sum, item) => sum + item.amount, 0);

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
          <small className="text-muted">Powered by CashMate AI · Last updated Sep 12, 2025</small>
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
            <h3 className="fw-bold text-coral mb-0">₹24,200</h3>
            <div className="fw-semibold small text-dark">Sep Spending</div>
            <small className="text-muted">vs ₹20,400 last month</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-4">📆</span>
              <span className="badge bg-light text-secondary border">AI</span>
            </div>
            <h3 className="fw-bold text-lavender mb-0">₹22,800</h3>
            <div className="fw-semibold small text-dark">Avg Monthly</div>
            <small className="text-muted">6-month rolling average</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-4">💡</span>
              <span className="badge bg-light text-secondary border">AI</span>
            </div>
            <h3 className="fw-bold text-mint mb-0">₹9,940</h3>
            <div className="fw-semibold small text-dark">AI Savings Potential</div>
            <small className="text-muted">if you follow all tips</small>
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
            <h6 className="fw-bold mb-1">🤖 AI Summary — September 2025</h6>
            <p className="small text-secondary mb-0">
              Your spending is <span className="fw-bold text-coral">18.6% higher</span> than your 6-month average, driven primarily by weekend dining and impulse shopping.
              The good news: your bills and transport are <span className="fw-bold text-mint">under control</span>. If you act on the recommendations below, you could reclaim nearly <span className="fw-bold text-mint">₹9,940 per month</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Comparison Chart */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-0">Historical Comparison</h5>
            <small className="text-muted">Your spending vs your own average</small>
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

        <div className="d-flex gap-3 mb-3">
          <small className="d-flex align-items-center gap-1 text-secondary">
            <span className="legend-dot bg-coral"></span> Your spending
          </small>
          <small className="d-flex align-items-center gap-1 text-secondary">
            <span className="legend-dot bg-lavender"></span> Your average
          </small>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, ""]} />
            <Area type="monotone" dataKey="spend" stroke="#e85d2e" fill="#e85d2e22" strokeWidth={2} name="Spending" />
            <Area type="monotone" dataKey="avg" stroke="#8b5cf6" fill="#8b5cf615" strokeWidth={2} strokeDasharray="5 4" name="Average" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Patterns Grid */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
          <CalendarDays size={18} className="text-lavender" />
          Spending Patterns
        </h5>
        <div className="row g-3">
          {patterns.map((p) => (
            <div key={p.label} className="col-6 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-4">{p.icon}</span>
                  <TrendChip trend={p.trend} />
                </div>
                <h6 className={`fw-bold mb-0 ${p.colorClass}`}>{p.value}</h6>
                <div className="fw-bold small text-dark mb-1">{p.label}</div>
                <small className="text-muted d-block">{p.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problems & Solutions */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-coral" />
          AI Problems & Solutions
        </h5>
        {problems.map((item, index) => (
          <ProblemCard key={index} item={item} />
        ))}
      </div>

      {/* Smart Recommendations */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
          <Sparkles size={18} className="text-mint" />
          Smart Recommendations
        </h5>
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
      </div>

      {/* AI Savings Prediction */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-1">
          <Lightbulb size={18} className="text-warning" />
          AI Savings Prediction
        </h5>
        <p className="small text-muted mb-4">If you follow all AI recommendations this month</p>

        <div className="row g-4 align-items-center">
          <div className="col-md-7">
            {predictionBars.map((b) => {
              const pct = Math.round((b.amount / totalPredicted) * 100);
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
              <small className="text-uppercase fw-bold text-success d-block mb-1">Total Savings</small>
              <h2 className="fw-bold text-success mb-1">₹{totalPredicted.toLocaleString()}</h2>
              <small className="text-muted d-block mb-3">per month if all tips followed</small>
              <span className="badge bg-success text-white px-3 py-2 rounded-pill">
                🎯 Goa trip in 2.3 mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insight History */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
          <Clock size={18} className="text-secondary" />
          Insight History
        </h5>
        {insightHistory.map((h, i) => (
          <div key={i} className="card border-0 shadow-sm rounded-4 p-3 mb-2">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-gradient-brand text-white fw-bold rounded-3 px-2 py-1 small shrink-0">
                AI
              </div>
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h6 className="fw-bold text-dark mb-0">{h.title}</h6>
                  {h.tags.map((t) => (
                    <span key={t} className="badge bg-light text-secondary border">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="small text-secondary mb-1">{h.summary}</p>
                <small className="text-muted">{h.date}</small>
              </div>
              <button className="btn btn-sm btn-light border text-secondary fw-bold rounded-2">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center small text-muted">
        🤖 AI insights are generated from your transaction patterns and are for guidance only.
      </p>
    </div>
  );
}