import { useState, useEffect } from "react";
import "./Analytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";

const PALETTE = ["#10B981", "#6366F1", "#FF6B52", "#F59E0B", "#8B5CF6", "#3B82F6"];

function Analytics() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/analytics").then((res) => res.json()),
      fetch("http://localhost:5000/api/expenses").then((res) => res.json()),
    ])
      .then(([analyticsRes, expensesRes]) => {
        setAnalyticsData(analyticsRes);
        setExpenses(Array.isArray(expensesRes) ? expensesRes : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading analytics:", err);
        setLoading(false);
      });
  }, []);

  const totalIncome = analyticsData?.summary?.totalIncome || 0;
  const totalExpense = analyticsData?.summary?.totalExpense || 0;
  const netSavings = analyticsData?.summary?.netSavings || 0;

  const avgDailySpend = totalExpense > 0 ? (totalExpense / 30).toFixed(0) : 0;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  const categoryBreakdown = analyticsData?.categoryBreakdown || [];
  const topCategory =
    categoryBreakdown.length > 0
      ? categoryBreakdown.reduce((max, cat) => (cat.value > max.value ? cat : max), categoryBreakdown[0])
      : null;

  // Transform Category Data for the Comparison Bar Chart
  const categoryChartData = categoryBreakdown.map((item) => ({
    category: item.name,
    Expense: item.value,
  }));

  // General Comparison Data
  const summaryComparisonData = [
    { name: "Financial Overview", Income: totalIncome, Expense: totalExpense, Savings: netSavings > 0 ? netSavings : 0 }
  ];

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="secure-label mb-1">
            <span>🔒</span> Private & Secure Insights
          </div>
          <h1 className="analytics-title">Financial Analytics 📊</h1>
          <p className="analytics-subtitle">Real-time breakdown of your income, expenses & spending habits</p>
        </div>

        {/* Time Filter */}
        <div className="analytics-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Security Banner */}
      <div className="analytics-security mb-4">
        <div className="security-icon">🔐</div>
        <div>
          <h5>Encrypted Private Analytics</h5>
          <p>Insights are calculated directly from your MongoDB records and updated live.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="row g-4 mb-4">
        {/* Average Daily Spend */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card card-daily">
            <div className="card-badge bg-coral-light text-coral">Avg / Day</div>
            <span className="summary-icon">📅</span>
            <h3>₹{Number(avgDailySpend).toLocaleString("en-IN")}</h3>
            <p>Average Daily Spend</p>
            <small>Calculated over 30 days</small>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card card-savings">
            <div className="card-badge bg-mint-light text-mint">Health Index</div>
            <span className="summary-icon">💰</span>
            <h3>{savingsRate}%</h3>
            <p>Savings Rate</p>
            <small>Target: &gt; 20%</small>
          </div>
        </div>

        {/* Top Category */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card card-topcat">
            <div className="card-badge bg-lavender-light text-lavender">Highest Outflow</div>
            <span className="summary-icon">🏷️</span>
            <h3>{topCategory ? topCategory.name : "None"}</h3>
            <p>Top Category</p>
            <small>
              {topCategory ? `₹${Number(topCategory.value).toLocaleString("en-IN")}` : "No data"}
            </small>
          </div>
        </div>

        {/* Net Savings */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card card-net">
            <div className="card-badge bg-peach-light text-peach">Net Balance</div>
            <span className="summary-icon">📈</span>
            <h3>₹{netSavings.toLocaleString("en-IN")}</h3>
            <p>Net Savings</p>
            <small>Total Income - Expenses</small>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="row g-4 mb-4">
        {/* Bar Chart: Category Expense Breakdown */}
        <div className="col-12 col-lg-8">
          <div className="analytics-card chart-card">
            <div className="card-header-simple d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4>Spending Comparison by Category</h4>
                <p className="mb-0">Visualizing high-expense areas</p>
              </div>
              <span className="chart-security">📊 Category Insights</span>
            </div>

            {categoryChartData.length === 0 ? (
              <div className="analytics-empty py-5">
                <div className="empty-chart-icon">📊</div>
                <h5>No Category Data Available</h5>
                <p>Add expenses to view category-wise bar charts.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Expense"]} />
                  <Bar dataKey="Expense" radius={[10, 10, 0, 0]}>
                    {categoryChartData.map((_, index) => (
                      <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart: Distribution */}
        <div className="col-12 col-lg-4">
          <div className="analytics-card chart-card">
            <div className="card-header-simple mb-3">
              <h4>Expense Share</h4>
              <p className="mb-0">Percentage distribution</p>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="analytics-empty py-5">
                <div className="empty-chart-icon">🥧</div>
                <h5>No Distribution Data</h5>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {categoryBreakdown.map((_, index) => (
                      <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY PROGRESS & DETAILED BREAKDOWN */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="analytics-card">
            <div className="card-header-simple mb-3">
              <h4>Category Breakdown</h4>
              <p className="mb-0">Share of total monthly expenditure</p>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="analytics-empty py-4">
                <p>No category breakdown available.</p>
              </div>
            ) : (
              <div className="category-progress-list">
                {categoryBreakdown.map((item, idx) => (
                  <div key={item.name} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold fs-6">{item.name}</span>
                      <span className="fw-bold" style={{ color: PALETTE[idx % PALETTE.length] }}>
                        ₹{Number(item.value).toLocaleString("en-IN")} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: "8px", borderRadius: "10px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: PALETTE[idx % PALETTE.length],
                          borderRadius: "10px"
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview Bar Comparison */}
        <div className="col-12 col-lg-6">
          <div className="analytics-card">
            <div className="card-header-simple mb-3">
              <h4>Income vs Expense Ratio</h4>
              <p className="mb-0">Overall financial health monitor</p>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={summaryComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(val) => `₹${val}`} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" radius={[0, 8, 8, 0]} />
                <Bar dataKey="Expense" fill="#FF6B52" radius={[0, 8, 8, 0]} />
                <Bar dataKey="Savings" fill="#6366F1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;