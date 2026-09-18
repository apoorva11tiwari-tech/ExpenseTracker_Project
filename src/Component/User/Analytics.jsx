import { useState } from "react";
import "./Analytics.css"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [activeTab, setActiveTab] = useState("Monthly");

  // Real data will be added later from database/API
  const chartData = [];

  const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">

        <div>
          <div className="secure-label">
            <span>🔒</span>
            Private & Secure
          </div>

          <h1>Analytics 📊</h1>

          <p>
            Understand your financial activity with secure insights.
          </p>
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


      {/* Security Information */}
      <div className="analytics-security">

        <div className="security-icon">
          🔐
        </div>

        <div>
          <h5>Your financial data stays private</h5>

          <p>
            Analytics are generated from your own transaction data.
            No financial information is displayed until you add it.
          </p>
        </div>

      </div>


      {/* Summary Cards */}
      <div className="row g-4 mt-2">

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card">

            <span className="summary-icon">📅</span>

            <h3>—</h3>

            <p>Average Daily Spend</p>

            <small>No data available</small>

          </div>
        </div>


        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card">

            <span className="summary-icon">💰</span>

            <h3>—</h3>

            <p>Savings Rate</p>

            <small>Add income and expenses</small>

          </div>
        </div>


        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card">

            <span className="summary-icon">🏷️</span>

            <h3>—</h3>

            <p>Top Category</p>

            <small>No category data yet</small>

          </div>
        </div>


        <div className="col-12 col-sm-6 col-lg-3">
          <div className="analytics-card summary-card">

            <span className="summary-icon">📈</span>

            <h3>—</h3>

            <p>Monthly Change</p>

            <small>Not enough data</small>

          </div>
        </div>

      </div>


      {/* Income & Expense Chart */}
      <div className="analytics-card chart-card mt-4">

        <div className="card-header-simple">

          <div>
            <h4>Income, Expenses & Savings</h4>

            <p>
              Your financial activity over time
            </p>
          </div>

          <span className="chart-security">
            🔒 Private
          </span>

        </div>


        {chartData.length === 0 ? (

          <div className="analytics-empty">

            <div className="empty-chart-icon">
              📊
            </div>

            <h5>No financial data yet</h5>

            <p>
              Add your income and expenses to generate
              personalized analytics.
            </p>

          </div>

        ) : (

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--secure-green)"
                fill="var(--secure-green)"
                fillOpacity={0.1}
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="var(--secure-blue)"
                fill="var(--secure-blue)"
                fillOpacity={0.1}
              />

              <Area
                type="monotone"
                dataKey="savings"
                stroke="var(--secure-purple)"
                fill="var(--secure-purple)"
                fillOpacity={0.1}
              />

            </AreaChart>

          </ResponsiveContainer>

        )}

      </div>


      {/* Category Analysis */}
      <div className="row g-4 mt-1">

        <div className="col-12 col-lg-6">

          <div className="analytics-card">

            <div className="card-header-simple">

              <div>
                <h4>Category Spending</h4>

                <p>
                  See where your money is going
                </p>
              </div>

              <span className="small-lock">
                🔒
              </span>

            </div>


            <div className="analytics-empty small-empty">

              <div className="empty-icon">
                🏷️
              </div>

              <h5>No category data</h5>

              <p>
                Categories will appear after you add expenses.
              </p>

            </div>

          </div>

        </div>


        {/* Comparison */}
        <div className="col-12 col-lg-6">

          <div className="analytics-card">

            <div className="card-header-simple">

              <div>
                <h4>Spending Comparison</h4>

                <p>
                  Compare your spending over time
                </p>
              </div>

              <span className="small-lock">
                🔒
              </span>

            </div>


            <div className="analytics-empty small-empty">

              <div className="empty-icon">
                📈
              </div>

              <h5>Comparison unavailable</h5>

              <p>
                Add transactions from different periods
                to compare your spending.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Privacy Notice */}
      <div className="privacy-card mt-4">

        <div className="privacy-icon">
          🛡️
        </div>

        <div>

          <h5>Privacy-first analytics</h5>

          <p>
            Your analytics are based only on the financial
            information you provide. CashMate does not show
            personal financial insights until data is available.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Analytics;