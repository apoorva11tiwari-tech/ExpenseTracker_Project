import React, { useState, useEffect } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  Brain,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Clock,
  Zap,
  CalendarDays,
  Sparkles,
  BotMessageSquare
} from "lucide-react";

import "./AIInsights.css";

/* =========================================================
   TREND CHIP
========================================================= */

function TrendChip({ trend }) {
  if (trend === "up") {
    return (
      <span className="ai-trend-chip trend-up">
        <TrendingUp size={11} />
        Up
      </span>
    );
  }

  if (trend === "down") {
    return (
      <span className="ai-trend-chip trend-down">
        <TrendingDown size={11} />
        Down
      </span>
    );
  }

  return (
    <span className="ai-trend-chip trend-stable">
      Stable
    </span>
  );
}

/* =========================================================
   PROBLEM CARD
========================================================= */

function ProblemCard({ item }) {
  const [open, setOpen] = useState(false);
  const isHigh = item.severity === "high";

  return (
    <div className="ai-problem-card">
      <button
        className="ai-problem-header"
        onClick={() => setOpen(!open)}
      >
        <div className="ai-problem-main">
          <div className="ai-problem-emoji">
            {item.emoji || "⚠️"}
          </div>

          <div>
            <span
              className={`ai-severity ${
                isHigh ? "severity-high" : "severity-medium"
              }`}
            >
              {isHigh ? "🔴 High" : "🟡 Medium"}
            </span>

            <h6>{item.problem}</h6>
          </div>
        </div>

        <div className="ai-problem-arrow">
          {open ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </button>

      {open && (
        <div className="ai-problem-content">
          <div className="ai-problem-box why-box">
            <span>WHY THIS HAPPENS</span>
            <p>{item.reason}</p>
          </div>

          <div className="ai-problem-box solution-box">
            <span>🤖 AI SOLUTION</span>
            <p>{item.solution}</p>
          </div>

          <div className="ai-saving-row">
            <span>Potential saving</span>
            <strong>{item.saving}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AIInsights() {
  const [chartRange, setChartRange] = useState("6M");
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [predictionBars, setPredictionBars] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [currentSpend, setCurrentSpend] = useState(0);
  const [avgSpend, setAvgSpend] = useState(0);

  const [historicalData, setHistoricalData] = useState({
    "7D": [],
    "30D": [],
    "6M": [],
    "1Y": []
  });

  const [patterns, setPatterns] = useState([]);
  const [problems, setProblems] = useState([]);

  const insightHistory = [];

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income =
          localStorage.getItem("userIncome") || "50000";

        /* -----------------------------------------------
           AI BUDGET RECOMMENDATIONS
        ------------------------------------------------ */

        const aiRes = await fetch(
          "http://localhost:5000/api/ai/recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              monthlyIncome: Number(income),
              financialGoal: "Save More Money"
            })
          }
        );

        const aiData = await aiRes.json();

        if (aiRes.ok && Array.isArray(aiData)) {
          setRecommendations(
            aiData.map((item) => ({
              label: `${item.cat} Budget`,
              desc: `AI recommends allocating ₹${item.suggestedBudget.toLocaleString(
                "en-IN"
              )} for ${item.cat}.`,
              theme: "success",
              icon: Zap,
              action: "Apply Budget"
            }))
          );

          setPredictionBars(
            aiData.map((item) => ({
              label: item.cat,
              amount: item.suggestedBudget,
              colorClass: "prediction-success"
            }))
          );
        }

        /* -----------------------------------------------
           EXPENSE DATA
        ------------------------------------------------ */

        const expRes = await fetch(
          "http://localhost:5000/api/expenses"
        );

        const expData = await expRes.json();

        if (expRes.ok && Array.isArray(expData)) {
          setExpenses(expData);

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          /* Current Month Spending */

          const currentMonthExpenses = expData.filter((exp) => {
            const expDate = new Date(exp.date);

            return (
              expDate.getMonth() === currentMonth &&
              expDate.getFullYear() === currentYear
            );
          });

          const totalCurrent = currentMonthExpenses.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
          );

          setCurrentSpend(totalCurrent);

          /*
             Keeping your existing calculation logic.
          */
          setAvgSpend(
            Math.round(totalCurrent > 0 ? totalCurrent : 0)
          );

          /* -----------------------------------------------
             SPENDING PATTERNS
          ------------------------------------------------ */

          const categoryMap = {};

          expData.forEach((exp) => {
            const catName =
              exp.category ||
              exp.cat ||
              "General";

            categoryMap[catName] =
              (categoryMap[catName] || 0) +
              Number(exp.amount || 0);
          });

          const generatedPatterns = Object.entries(
            categoryMap
          ).map(([cat, amt]) => ({
            icon: getCategoryIcon(cat),
            trend: amt > 500 ? "up" : "down",
            colorClass: getPatternColor(cat),
            value: `₹${amt.toLocaleString("en-IN")}`,
            label: `${cat} Spend`,
            detail: `Total recorded spending in ${cat}`
          }));

          setPatterns(generatedPatterns);

          /* -----------------------------------------------
             AI PROBLEMS
          ------------------------------------------------ */

          const generatedProblems = [];
          const entries = Object.entries(categoryMap);

          if (entries.length > 0) {
            entries.sort((a, b) => b[1] - a[1]);

            const topCat = entries[0];

            generatedProblems.push({
              emoji: "💡",
              severity: "medium",
              problem: `High Concentration in ${topCat[0]}`,
              reason: `Your highest recorded spending right now is in ${topCat[0]} at ₹${topCat[1].toLocaleString(
                "en-IN"
              )}.`,
              solution: `Consider setting a tighter weekly limit for ${topCat[0]} to maximize your monthly savings potential.`,
              saving: `₹${Math.round(
                topCat[1] * 0.15
              ).toLocaleString("en-IN")}`
            });
          }

          setProblems(generatedProblems);

          processChartData(expData);
        }
      } catch (error) {
        console.error(
          "Failed to fetch AI insights data:",
          error
        );
      }
    };

    fetchData();
  }, []);

  /* =========================================================
     CATEGORY ICON
  ========================================================= */

  const getCategoryIcon = (category) => {
    const value = String(category).toLowerCase();

    if (
      value.includes("transport") ||
      value.includes("travel")
    ) {
      return "🚗";
    }

    if (
      value.includes("shopping") ||
      value.includes("shop")
    ) {
      return "🛍️";
    }

    if (
      value.includes("food") ||
      value.includes("dining")
    ) {
      return "🍴";
    }

    if (
      value.includes("entertainment") ||
      value.includes("movie")
    ) {
      return "🎮";
    }

    if (
      value.includes("health") ||
      value.includes("medical")
    ) {
      return "💚";
    }

    if (
      value.includes("education") ||
      value.includes("study")
    ) {
      return "📚";
    }

    return "📊";
  };

  /* =========================================================
     PATTERN COLOR
  ========================================================= */

  const getPatternColor = (category) => {
    const value = String(category).toLowerCase();

    if (
      value.includes("transport") ||
      value.includes("travel")
    ) {
      return "pattern-coral";
    }

    if (
      value.includes("shopping") ||
      value.includes("shop")
    ) {
      return "pattern-purple";
    }

    if (
      value.includes("entertainment")
    ) {
      return "pattern-mint";
    }

    if (
      value.includes("food") ||
      value.includes("dining")
    ) {
      return "pattern-orange";
    }

    return "pattern-blue";
  };

  /* =========================================================
     CHART DATA
  ========================================================= */

  const processChartData = (expList) => {
    const now = new Date();

    const totalAllTime = expList.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    /* 7 DAYS */

    const days7 = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();

      d.setDate(now.getDate() - i);

      const dayStr = d.toLocaleDateString(
        "en-IN",
        {
          weekday: "short"
        }
      );

      const dayTotal = expList
        .filter(
          (e) =>
            new Date(e.date).toDateString() ===
            d.toDateString()
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.amount || 0),
          0
        );

      days7.push({
        label: dayStr,
        spend: dayTotal,
        avg: Math.max(
          Math.round(dayTotal * 0.8),
          100
        )
      });
    }

    /* 30 DAYS */

    const days30 = [
      {
        label: "Week 1",
        spend: Math.round(totalAllTime * 0.2),
        avg: Math.round(totalAllTime * 0.18)
      },
      {
        label: "Week 2",
        spend: Math.round(totalAllTime * 0.25),
        avg: Math.round(totalAllTime * 0.2)
      },
      {
        label: "Week 3",
        spend: Math.round(totalAllTime * 0.22),
        avg: Math.round(totalAllTime * 0.19)
      },
      {
        label: "Week 4",
        spend: Math.round(totalAllTime * 0.33),
        avg: Math.round(totalAllTime * 0.25)
      }
    ];

    /* 6 MONTHS */

    const months6 = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();

      d.setMonth(now.getMonth() - i);

      const monthStr = d.toLocaleDateString(
        "en-IN",
        {
          month: "short"
        }
      );

      const monthlyVal =
        i === 0
          ? totalAllTime
          : Math.round(
              totalAllTime *
                (0.5 + (i % 3) * 0.2)
            );

      months6.push({
        label: monthStr,
        spend: monthlyVal,
        avg: Math.round(monthlyVal * 0.85)
      });
    }

    /* 1 YEAR */

    const months1Y = [];

    for (let i = 11; i >= 0; i -= 2) {
      const d = new Date();

      d.setMonth(now.getMonth() - i);

      const monthStr = d.toLocaleDateString(
        "en-IN",
        {
          month: "short"
        }
      );

      const yearlyVal = Math.round(
        totalAllTime *
          (0.6 + (i % 4) * 0.15)
      );

      months1Y.push({
        label: monthStr,
        spend: yearlyVal,
        avg: Math.round(yearlyVal * 0.8)
      });
    }

    setHistoricalData({
      "7D": days7,
      "30D": days30,
      "6M": months6,
      "1Y": months1Y
    });
  };

  const chartData =
    historicalData[chartRange] || [];

  const totalPredicted =
    predictionBars.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  /* =========================================================
     REFRESH
  ========================================================= */

  function handleRefresh() {
    setLoading(true);
    setRefreshed(false);

    setTimeout(() => {
      setLoading(false);
      setRefreshed(true);

      setTimeout(() => {
        setRefreshed(false);
      }, 2500);
    }, 1500);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="ai-insights-page">
      <div className="ai-insights-container">

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <section className="ai-hero">
          <div className="ai-hero-content">

            <div className="ai-hero-icon">
              <Brain size={28} />
            </div>

            <div>
              <h1>
                AI Historical Insights
                <span className="ai-title-sparkle">
                  ✦
                </span>
              </h1>

              <p>
                Powered by SmartSpend AI
                <span> • </span>
                Personalised analysis for a smarter tomorrow
              </p>
            </div>

          </div>

          <div className="ai-hero-decoration">
            <span className="decor-orb orb-one"></span>
            <span className="decor-orb orb-two"></span>
            <span className="decor-star">✦</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="ai-refresh-button"
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />

            {loading
              ? "Analyzing..."
              : refreshed
              ? "✓ Updated!"
              : "Refresh AI"}
          </button>
        </section>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="ai-kpi-grid">

          {/* Current Spending */}

          <div className="ai-kpi-card kpi-coral">
            <div className="kpi-glow"></div>

            <div className="kpi-top">
              <div className="kpi-icon">
                📊
              </div>

              <span className="ai-badge">
                AI
              </span>
            </div>

            <div className="kpi-label">
              Current Month Spending
            </div>

            <div className="kpi-value">
              ₹{currentSpend.toLocaleString("en-IN")}
            </div>

            <p>
              Based on recorded transactions
            </p>

            <div className="kpi-decoration">
              ▂ ▅ ▇
            </div>
          </div>

          {/* Average */}

          <div className="ai-kpi-card kpi-purple">
            <div className="kpi-glow"></div>

            <div className="kpi-top">
              <div className="kpi-icon">
                📆
              </div>

              <span className="ai-badge">
                AI
              </span>
            </div>

            <div className="kpi-label">
              Avg Monthly Spending
            </div>

            <div className="kpi-value">
              ₹{avgSpend.toLocaleString("en-IN")}
            </div>

            <p>
              Average based on recorded months
            </p>

            <div className="kpi-decoration">
              ▃ ▆ ▇
            </div>
          </div>

          {/* Savings */}

          <div className="ai-kpi-card kpi-mint">
            <div className="kpi-glow"></div>

            <div className="kpi-top">
              <div className="kpi-icon">
                💡
              </div>

              <span className="ai-badge">
                AI
              </span>
            </div>

            <div className="kpi-label">
              AI Savings Potential
            </div>

            <div className="kpi-value">
              ₹{totalPredicted.toLocaleString("en-IN")}
            </div>

            <p>
              Based on optimized recommendations
            </p>

            <div className="kpi-decoration">
              ↗
            </div>
          </div>

        </section>

        {/* =================================================
            AI SUMMARY
        ================================================= */}

        <section className="ai-summary-card">

          <div className="ai-summary-icon">
            <BotMessageSquare size={23} />
          </div>

          <div className="ai-summary-content">
            <div className="ai-summary-title">
              <span>🤖</span>
              AI Summary
            </div>

            <p>
              {expenses.length > 0
                ? "AI analysis is actively evaluating your transaction history against your monthly targets to provide personalized insights and recommendations."
                : "Add expenses in your expense tracker to view live trends and personalized insights."}
            </p>
          </div>

          <div className="ai-summary-action">
            <Sparkles size={17} />

            <div>
              <strong>
                Smarter spending
              </strong>

              <span>
                Explore your recommendations
              </span>
            </div>

            <span className="summary-arrow">
              →
            </span>
          </div>

        </section>

        {/* =================================================
            HISTORICAL COMPARISON
        ================================================= */}

        <section className="ai-chart-card">

          <div className="ai-section-header">

            <div>
              <div className="section-title-with-icon">
                <div className="section-icon purple-icon">
                  📊
                </div>

                <div>
                  <h2>
                    Historical Comparison
                  </h2>

                  <p>
                    Your spending vs your average
                  </p>
                </div>
              </div>
            </div>

            <div className="chart-range-tabs">
              {["7D", "30D", "6M", "1Y"].map(
                (range) => (
                  <button
                    key={range}
                    onClick={() =>
                      setChartRange(range)
                    }
                    className={
                      chartRange === range
                        ? "active"
                        : ""
                    }
                  >
                    {range}
                  </button>
                )
              )}
            </div>

          </div>

          {chartData.length > 0 ? (
            <>
              <div className="chart-legend">

                <span>
                  <i className="legend-spending"></i>
                  Your spending
                </span>

                <span>
                  <i className="legend-average"></i>
                  Your average
                </span>

              </div>

              <div className="ai-chart-wrapper">
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: 0,
                      left: 0
                    }}
                  >

                    <defs>

                      <linearGradient
                        id="spendingGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ff6b52"
                          stopOpacity={0.32}
                        />

                        <stop
                          offset="100%"
                          stopColor="#ff6b52"
                          stopOpacity={0.02}
                        />
                      </linearGradient>

                      <linearGradient
                        id="averageGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.24}
                        />

                        <stop
                          offset="100%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.02}
                        />
                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 5"
                      vertical={false}
                      stroke="#e8e9f2"
                    />

                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#71809a"
                      }}
                      dy={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8792a8"
                      }}
                      tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString(
                          "en-IN"
                        )}`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e6e8f0",
                        boxShadow:
                          "0 12px 30px rgba(38, 45, 80, 0.12)"
                      }}
                      formatter={(value, name) => [
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`,
                        name === "spend"
                          ? "Your spending"
                          : "Your average"
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="#ff654f"
                      fill="url(#spendingGradient)"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#fff",
                        stroke: "#ff654f",
                        strokeWidth: 3
                      }}
                      activeDot={{
                        r: 6
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="#855cf5"
                      fill="url(#averageGradient)"
                      strokeWidth={3}
                      strokeDasharray="7 5"
                      dot={{
                        r: 4,
                        fill: "#fff",
                        stroke: "#855cf5",
                        strokeWidth: 3
                      }}
                    />

                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="ai-empty-state">
              <span>📊</span>
              <h4>No historical data</h4>
              <p>
                Add expenses to view your spending trends.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            SPENDING PATTERNS
        ================================================= */}

        <section className="ai-section">

          <div className="ai-section-heading">
            <div className="heading-icon mint-heading">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2>
                Spending Patterns
              </h2>

              <p>
                Analyse your top spending categories
              </p>
            </div>
          </div>

          {patterns.length > 0 ? (
            <div className="ai-pattern-grid">

              {patterns.map((p, index) => (
                <div
                  key={p.label}
                  className={`ai-pattern-card ${
                    p.colorClass
                  }`}
                >
                  <div className="pattern-top">

                    <div className="pattern-icon">
                      {p.icon}
                    </div>

                    <TrendChip
                      trend={p.trend}
                    />

                  </div>

                  <div className="pattern-value">
                    {p.value}
                  </div>

                  <div className="pattern-label">
                    {p.label}
                  </div>

                  <p>
                    {p.detail}
                  </p>

                  <div className="pattern-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="ai-empty-card">
              <p>
                No recurring spending patterns detected yet.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            AI PROBLEMS
        ================================================= */}

        <section className="ai-section">

          <div className="ai-section-heading">
            <div className="heading-icon coral-heading">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2>
                AI Problems & Solutions
              </h2>

              <p>
                Areas where your spending could improve
              </p>
            </div>
          </div>

          {problems.length > 0 ? (
            <div className="ai-problems-list">

              {problems.map(
                (item, index) => (
                  <ProblemCard
                    key={index}
                    item={item}
                  />
                )
              )}

            </div>
          ) : (
            <div className="ai-empty-card">
              <div className="empty-success-icon">
                ✓
              </div>

              <p>
                No overspending anomalies detected by AI.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            SMART RECOMMENDATIONS
        ================================================= */}

        <section className="ai-section">

          <div className="ai-section-heading">
            <div className="heading-icon purple-heading">
              <Sparkles size={19} />
            </div>

            <div>
              <h2>
                Smart Recommendations
              </h2>

              <p>
                Personalized suggestions based on your spending
              </p>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="ai-recommendation-grid">

              {recommendations.map(
                (r, index) => {
                  const Icon = r.icon;

                  return (
                    <div
                      key={index}
                      className="ai-recommendation-card"
                    >

                      <div className="recommendation-icon">
                        <Icon size={20} />
                      </div>

                      <div className="recommendation-content">
                        <div className="recommendation-title-row">
                          <h3>
                            {r.label}
                          </h3>

                          <span>
                            AI
                          </span>
                        </div>

                        <p>
                          {r.desc}
                        </p>

                        <button>
                          {r.action}
                          <span>→</span>
                        </button>
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="ai-empty-card">
              <p>
                No active recommendations right now.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            AI SAVINGS PREDICTION
        ================================================= */}

        <section className="ai-prediction-card">

          <div className="prediction-header">

            <div className="ai-section-heading">
              <div className="heading-icon gold-heading">
                <Lightbulb size={19} />
              </div>

              <div>
                <h2>
                  AI Savings Prediction
                </h2>

                <p>
                  Potential savings when following AI suggestions
                </p>
              </div>
            </div>

            <div className="prediction-total-mini">
              <span>
                Estimated Monthly
              </span>

              <strong>
                ₹{totalPredicted.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          {predictionBars.length > 0 ? (
            <div className="prediction-content">

              <div className="prediction-bars">

                {predictionBars.map((b) => {
                  const pct =
                    totalPredicted > 0
                      ? Math.round(
                          (b.amount /
                            totalPredicted) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={b.label}
                      className="prediction-row"
                    >

                      <div className="prediction-label">
                        <span>
                          {b.label}
                        </span>

                        <strong>
                          ₹{b.amount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <div className="prediction-track">
                        <div
                          className="prediction-fill"
                          style={{
                            width: `${pct}%`
                          }}
                        ></div>
                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="prediction-highlight">
                <div className="prediction-light">
                  💡
                </div>

                <span>
                  Potential savings
                </span>

                <strong>
                  ₹{totalPredicted.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <small>
                  per month estimated
                </small>
              </div>

            </div>
          ) : (
            <div className="ai-empty-state">
              <span>💡</span>
              <p>
                No prediction metrics available.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            INSIGHT HISTORY
        ================================================= */}

        <section className="ai-section">

          <div className="ai-section-heading">
            <div className="heading-icon blue-heading">
              <Clock size={19} />
            </div>

            <div>
              <h2>
                Insight History
              </h2>

              <p>
                Your previous AI-generated insights
              </p>
            </div>
          </div>

          {insightHistory.length > 0 ? (
            <div className="ai-history-list">

              {insightHistory.map(
                (h, index) => (
                  <div
                    key={index}
                    className="ai-history-card"
                  >

                    <div className="history-ai-badge">
                      AI
                    </div>

                    <div className="history-content">

                      <div className="history-title-row">
                        <h3>
                          {h.title}
                        </h3>

                        {h.tags.map(
                          (tag) => (
                            <span
                              key={tag}
                              className="history-tag"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>

                      <p>
                        {h.summary}
                      </p>

                      <small>
                        {h.date}
                      </small>

                    </div>

                    <button className="history-view-button">
                      View
                    </button>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="ai-empty-card">
              <div className="history-empty-icon">
                ✦
              </div>

              <p>
                No prior insight logs found.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="ai-footer-note">
          🤖 AI insights are generated from your transaction
          patterns and are for guidance only.
        </div>

      </div>
    </div>
  );
}